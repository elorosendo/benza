// Extrai todas as chaves (textos em pt-BR) que precisam de tradução.
const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const keys = new Set();
const BRAND = new Set(["benza", "BENZA", "benza approved", "the good kind of secret", "Gaya", "Outfit", "·", "→", "←"]);
const add = (s) => { if (typeof s === "string" && /\p{L}{2}/u.test(s) && !BRAND.has(s.trim())) keys.add(s); };

function walk(d, o = []) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p, o); else if (/\.tsx?$/.test(p)) o.push(p); } return o; }

// 1) t("...") literais
const files = [...walk("app"), ...walk("components"), ...walk("lib")];
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, f.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  (function v(n) {
    if (ts.isCallExpression(n) && n.expression.getText() === "t" && n.arguments[0] && (ts.isStringLiteral(n.arguments[0]) || ts.isNoSubstitutionTemplateLiteral(n.arguments[0]))) add(n.arguments[0].text);
    ts.forEachChild(n, v);
  })(sf);
}

// 2) listas de dados em páginas/componentes (valores usados depois com t(x))
const DATA_FILES = [
  "app/[locale]/aplicacoes/page.tsx", "app/[locale]/approved/page.tsx", "app/[locale]/ask-benza/page.tsx",
  "app/[locale]/comunidade/page.tsx", "app/[locale]/diario/page.tsx", "app/[locale]/sobre/page.tsx",
  "components/variants/HomeV3.tsx", "components/MobileNav.tsx", "lib/quiz.ts", "lib/catalog.ts", "lib/social.ts", "lib/aiMock.ts", "components/Compare.tsx", "components/SearchView.tsx",
];
const CLASSY = /(flex|grid|text-|bg-|border|rounded|px-|py-|min-h|w-\[|h-\[|lg:|sm:|md:|hover:|absolute|relative|\.webp|\.jpg|^\/|use client|prefers-)/;
for (const f of DATA_FILES) {
  const src = fs.readFileSync(f, "utf8");
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, f.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  (function v(n) {
    if (ts.isStringLiteral(n)) {
      const p = n.parent;
      const inT = ts.isCallExpression(p) && p.expression.getText() === "t";
      const skip = ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isJsxAttribute(p) || (ts.isPropertyAssignment(p) && p.name === n) || ts.isElementAccessExpression(p) || ts.isLiteralTypeNode(p);
      const inArrOrProp = ts.isArrayLiteralExpression(p) || ts.isPropertyAssignment(p);
      if (!inT && !skip && inArrOrProp && !CLASSY.test(n.text) && /[\s?]|[áéíóúãõçâêôà]|^\[|^\p{Lu}/u.test(n.text)) add(n.text);
    }
    ts.forEachChild(n, v);
  })(sf);
}

// 3) JSON de dados
const tax = JSON.parse(fs.readFileSync("data/taxonomy.json", "utf8"));
for (const c of tax.categories) { add(c.name); for (const g of c.groups ?? []) { add(g.label); for (const s of g.children) add(s.name); } }
for (const e of tax.editorial ?? []) add(e.name);
const tok = JSON.parse(fs.readFileSync("tokens.json", "utf8"));
for (const l of Object.values(tok.lines)) { add(l.moment); add(l.blurb); }
const prods = JSON.parse(fs.readFileSync("data/products.sample.json", "utf8")).products;
for (const p of prods) {
  add(p.name); add(p.brand); add(p.summary);
  for (const w of p.review?.works ?? []) add(w); for (const w of p.review?.doesnt ?? []) add(w);
  add(p.review?.testedBy); add(p.review?.testedFor);
  add(p.specs?.material); add(p.specs?.size); add(p.specs?.care);
}
const revs = JSON.parse(fs.readFileSync("data/reviews.sample.json", "utf8")).reviews;
for (const r of revs) { add(r.tester); add(r.handle); add(r.testedFor); add(r.caption); add(r.quote); }

["iniciante","discreto e silencioso","lubrificante","viagem","a dois","cuidado e higiene","ritual e clima","a solo","vidro","uso geral","Selo","Produto A","Produto B","Característica"].forEach(add);
const list = [...keys].sort((a, b) => a.localeCompare(b, "pt"));
fs.writeFileSync("/tmp/i18n-keys.json", JSON.stringify(list, null, 1));
console.log(list.length + " chaves");
