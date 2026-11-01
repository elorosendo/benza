// Lista strings que parecem texto de interface e ainda não passam por t().
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
function walk(d, o = []) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p, o); else if (/\.tsx?$/.test(p)) o.push(p); } return o; }
const SKIP_ATTR = new Set(["className", "href", "src", "key", "id", "type", "name", "value", "htmlFor", "sizes", "role", "style", "data-line", "variant", "color", "tone", "target", "rel", "autoComplete", "priority", "fill", "loading", "decoding", "background", "as", "d", "viewBox", "fill", "stroke", "xmlns", "path", "title"]);
const files = [...walk("app"), ...walk("components"), "lib/quiz.ts", "lib/social.ts", "lib/socialLinks.ts", "lib/catalog.ts"];
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out = [];
  (function v(n) {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const text = n.text;
      const p = n.parent;
      const inT = p && ts.isCallExpression(p) && p.expression.getText() === "t";
      const isImport = ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || (p && ts.isLiteralTypeNode(p));
      const isAttr = ts.isJsxAttribute(p) && SKIP_ATTR.has(p.name.getText());
      const isProp = ts.isPropertyAssignment(p) && p.name === n;
      const isIdx = ts.isElementAccessExpression(p);
      if (!inT && !isImport && !isAttr && !isProp && !isIdx && /\p{L}{3}/u.test(text) && /[\p{Lu}]|\s|[áéíóúãõçâêô]/u.test(text) && !/^[\w./:@#%-]+$/.test(text) && !text.startsWith("/") && !text.startsWith("data:")) {
        const { line } = sf.getLineAndCharacterOfPosition(n.getStart());
        out.push(`  ${line + 1}: ${JSON.stringify(text).slice(0, 110)}`);
      }
    }
    if (ts.isTemplateExpression(n)) {
      const { line } = sf.getLineAndCharacterOfPosition(n.getStart());
      const txt = n.getText();
      if (/\p{L}{3}/u.test(n.head.text + n.templateSpans.map((s) => s.literal.text).join(""))) out.push(`  ${line + 1}: TPL ${txt.slice(0, 110).replace(/\n/g, " ")}`);
    }
    ts.forEachChild(n, v);
  })(sf);
  if (out.length) console.log(file + "\n" + out.join("\n"));
}
