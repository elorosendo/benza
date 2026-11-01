// Envolve textos JSX em t("...") (uso único, na migração para i18n).
const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const DRY = process.argv.includes("--dry");
const BRAND = new Set(["benza", "BENZA", "benza approved", "the good kind of secret", "Gaya", "Outfit"]);
const ATTRS = new Set(["alt", "aria-label", "placeholder", "title", "label"]);
const FORCE_CLIENT = new Set(["components/ProductCard.tsx", "components/ProductGrid.tsx", "components/ApprovedBadge.tsx"]);

function walk(d, out = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

function decode(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
}

const files = [...walk("app"), ...walk("components")].filter((f) => f !== "components/Link.tsx");
const skipped = [];
const allKeys = new Set();
let changedFiles = 0;

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  if (src.includes('from "@/lib/i18n')) continue; // já migrado
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let isClient = /^\s*["']use client["']/.test(src) || FORCE_CLIENT.has(file);
  const edits = []; // {start,end,text}
  const hosts = new Map(); // fn node -> true

  function outermostFn(node) {
    let last = null;
    for (let n = node.parent; n && n.kind !== ts.SyntaxKind.SourceFile; n = n.parent) {
      if (ts.isFunctionDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n)) last = n;
    }
    return last;
  }
  function useIn(node) {
    const fn = outermostFn(node);
    if (fn) hosts.set(fn, true);
  }

  function isInlineExpr(n) {
    return ts.isJsxExpression(n) && !(n.expression && ts.isStringLiteral(n.expression) && n.expression.text.trim() === "");
  }

  function visit(node) {
    if (ts.isJsxText(node)) {
      const raw = node.text;
      const letters = (raw.match(/\p{L}/gu) || []).length;
      if (letters >= 2 || (letters === 1 && /\p{L}{1}/u.test(raw) && raw.trim().length > 2)) {
        const core = raw.trim();
        const key = decode(core.replace(/\s+/g, " "));
        if (BRAND.has(key) || /&nbsp;/.test(raw)) { /* ignora */ }
        else {
          const siblings = node.parent.children;
          const i = siblings.indexOf(node);
          const prev = siblings[i - 1], next = siblings[i + 1];
          const adjPrev = prev && isInlineExpr(prev) && !/^\s*\n/.test(raw);
          const adjNext = next && isInlineExpr(next) && !/\n\s*$/.test(raw);
          // texto colado em {expressão}: tradução de frase quebrada, fica para ajuste manual
          const startsWS = /^\s/.test(raw), endsWS = /\s$/.test(raw);
          const mixed = (prev && isInlineExpr(prev) && !startsWS) || (next && isInlineExpr(next) && !endsWS);
          if (mixed || ((prev && isInlineExpr(prev)) || (next && isInlineExpr(next)))) {
            skipped.push(`${file}: "${key}"`);
          } else {
            const lead = /^\s/.test(raw) ? (/^\s*\n/.test(raw) ? "" : '{" "}') : "";
            const trail = /\s$/.test(raw) ? (/\n\s*$/.test(raw) ? "" : '{" "}') : "";
            edits.push({ start: node.getStart(), end: node.getEnd(), text: `${lead}{t(${JSON.stringify(key)})}${trail}` });
            allKeys.add(key);
            useIn(node);
          }
        }
      }
    } else if (ts.isJsxAttribute(node) && ATTRS.has(node.name.getText()) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const key = node.initializer.text;
      if (/\p{L}{2}/u.test(key) && !BRAND.has(key)) {
        edits.push({ start: node.initializer.getStart(), end: node.initializer.getEnd(), text: `{t(${JSON.stringify(key)})}` });
        allKeys.add(key);
        useIn(node);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (!edits.length) continue;

  // inserir `const t` em cada componente raiz
  for (const fn of hosts.keys()) {
    const decl = isClient ? "const t = useT();" : "const t = await getT();";
    if (fn.body && ts.isBlock(fn.body)) {
      edits.push({ start: fn.body.getStart() + 1, end: fn.body.getStart() + 1, text: `\n  ${decl}` });
    } else if (fn.body) {
      // arrow com corpo de expressão
      edits.push({ start: fn.body.getStart(), end: fn.body.getEnd(), text: `{\n  ${decl}\n  return (${fn.body.getText()});\n}` });
    }
    if (!isClient && !(fn.modifiers || []).some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)) {
      if (ts.isFunctionDeclaration(fn)) {
        const kw = fn.getChildren().find((c) => c.kind === ts.SyntaxKind.FunctionKeyword);
        edits.push({ start: kw.getStart(), end: kw.getStart(), text: "async " });
      } else {
        edits.push({ start: fn.getStart(), end: fn.getStart(), text: "async " });
      }
    }
  }

  // import
  const imports = sf.statements.filter(ts.isImportDeclaration);
  const lastImp = imports[imports.length - 1];
  const impLine = isClient ? 'import { useT } from "@/lib/i18n/client";' : 'import { getT } from "@/lib/i18n/server";';
  const pos = lastImp ? lastImp.getEnd() : 0;
  edits.push({ start: pos, end: pos, text: `\n${impLine}` });

  // "use client" para os forçados
  if (FORCE_CLIENT.has(file) && !/^\s*["']use client["']/.test(src)) {
    edits.push({ start: 0, end: 0, text: '"use client";\n\n' });
  }

  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  for (const e of edits) src = src.slice(0, e.start) + e.text + src.slice(e.end);
  changedFiles++;
  if (!DRY) fs.writeFileSync(file, src);
}
console.log(`arquivos alterados: ${changedFiles}; chaves: ${allKeys.size}`);
console.log("--- ignorados (texto colado a expressão), ajustar à mão ---");
console.log(skipped.join("\n"));
fs.writeFileSync("/tmp/keys-jsx.json", JSON.stringify([...allKeys], null, 1));
