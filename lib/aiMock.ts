// Respostas SIMULADAS da "IA da benza": nada é enviado a nenhuma API.
// A lógica abaixo imita o que a IA faria: ler a intenção, escolher produtos aprovados e citar as fontes.
import type { Product } from "./catalog";
import { reviewsForProduct } from "./social";

export type AiProduct = Product & { parent: string };

export type IntentId =
  | "beginner" | "quiet" | "lube" | "travel" | "couple" | "care" | "ritual" | "solo" | "glass";

const INTENTS: { id: IntentId; re: RegExp }[] = [
  { id: "beginner", re: /inici|começ|comec|primeir|principiant|beginner|first|starter|\bstart|empez|primera|novat|d[eé]but|premi[eè]re|commenc/i },
  { id: "quiet", re: /silenc|discret|discre|quiet|silent|bruit|ruido|noise/i },
  { id: "lube", re: /lubrific|lube|lubric/i },
  { id: "travel", re: /viag|travel|viaj|voyag|mala\b|bolsa|bag\b|bolso|\bsac\b/i },
  { id: "couple", re: /\bdois\b|casal|parceir|couple|partner|pareja|\bdeux\b|duo|junt|together|for two/i },
  { id: "care", re: /limp|higien|cuid|clean|hygien|nettoy|care|soin|cuidad|skin|piel|peau|pele/i },
  { id: "ritual", re: /ritual|vela|candle|massag|óleo|oleo|\boil\b|bougie|aceite|banho|bath|\bbain\b|baño|noite|night|nuit|noche/i },
  { id: "solo", re: /sozinh|só para mim|solo\b|sola\b|\bseul|alone|myself|para mí/i },
  { id: "glass", re: /vidro|glass|vidrio|verre|dildo/i },
];

const BODY: { slug: string; re: RegExp }[] = [
  { slug: "clitoris", re: /clit/i },
  { slug: "vulva", re: /vulv/i },
  { slug: "vagina", re: /vagin|ponto g|g-spot|punto g|point g/i },
  { slug: "penis", re: /p[êe]nis|\bpene\b/i },
  { slug: "prostata", re: /pr[óo]stata|prostate/i },
  { slug: "anus", re: /[âa]nus|\banal\b|períneo|perineo|périnée|perineum/i },
];

const HEALTH = /\bdor\b|dores|sangr|sangu|bleed|m[ée]dic|doctor|docteur|infec|gr[aá]vid|pregnan|embaraz|dolor|douleur|ist\b|dst|alerg/i;

export const intentLabel: Record<IntentId, string> = {
  beginner: "iniciante",
  quiet: "discreto e silencioso",
  lube: "lubrificante",
  travel: "viagem",
  couple: "a dois",
  care: "cuidado e higiene",
  ritual: "ritual e clima",
  solo: "a solo",
  glass: "vidro",
};

// Por que cada produto foi sugerido (chave de tradução).
const WHY: Record<IntentId, string> = {
  beginner: "boa porta de entrada, sem complicação",
  quiet: "silencioso e fácil de guardar",
  lube: "textura e duração aprovadas pela comunidade",
  travel: "cabe na bolsa e viaja bem",
  couple: "pensado para dividir o momento",
  care: "cuida da pele e do depois",
  ritual: "combina com o clima do ritual",
  solo: "para começar sozinha, no seu tempo",
  glass: "material liso, fácil de limpar",
};

export function detect(text: string) {
  const intents = INTENTS.filter((i) => i.re.test(text)).map((i) => i.id);
  const bodies = BODY.filter((b) => b.re.test(text)).map((b) => b.slug);
  return { intents, bodies, health: HEALTH.test(text) };
}

function score(p: AiProduct, intents: IntentId[], bodies: string[]) {
  let s = p.approved ? 1 : 0;
  let best = 0;
  let reason: IntentId | undefined;
  const add = (n: number, id: IntentId) => { s += n; if (n > best) { best = n; reason = id; } };
  for (const id of intents) {
    if (id === "beginner" && ["para-comecar", "silenciosos", "lubrificantes-liquidos", "vibradores"].includes(p.category)) add(3, id);
    if (id === "quiet" && p.category === "silenciosos") add(4, id);
    if (id === "quiet" && p.category === "vibradores") add(1, id);
    if (id === "lube" && (p.category === "lubrificantes-liquidos" || p.parent === "cuidado-intimo")) add(4, id);
    if (id === "travel" && p.line === "brasa") add(4, id);
    if (id === "couple" && ["prazer-compartilhado", "aneis-capas"].includes(p.category)) add(4, id);
    if (id === "couple" && p.line === "penumbra") add(2, id);
    if (id === "care" && p.parent === "cuidado-intimo") add(4, id);
    if (id === "care" && p.line === "rio") add(2, id);
    if (id === "ritual" && p.parent === "no-clima") add(4, id);
    if (id === "ritual" && p.line === "penumbra") add(2, id);
    if (id === "solo" && p.line === "mata") add(3, id);
    if (id === "glass" && ["dildos", "anal"].includes(p.category)) add(3, id);
  }
  if (bodies.some((b) => p.body.includes(b))) s += 3;
  return { s, reason };
}

export type AiAnswer = {
  kind: "picks" | "ask-more" | "health" | "text";
  text: string;
  intents: IntentId[];
  items: { product: AiProduct; why: string }[];
  sources: { label: string; href: string }[];
};

type T = (k: string, v?: Record<string, string | number>) => string;

export function answerGeneral(question: string, products: AiProduct[], t: T): AiAnswer {
  const { intents, bodies, health } = detect(question);
  if (health) {
    return { kind: "health", intents: [], items: [], sources: [], text: t("Para dúvidas de saúde, converse com um profissional. Eu posso ajudar a escolher produtos, mas não substituo orientação médica.") };
  }
  if (!intents.length && !bodies.length) {
    return { kind: "ask-more", intents: [], items: [], sources: [], text: t("Me conta um pouco mais: é para você ou a dois? É a primeira vez? Prefere algo discreto?") };
  }
  const ranked = products
    .map((p) => ({ p, ...score(p, intents, bodies) }))
    .filter((x) => x.s > 1)
    .sort((a, b) => b.s - a.s || a.p.slug.localeCompare(b.p.slug))
    .slice(0, 3);
  const items = ranked.map((x) => ({ product: x.p, why: t(WHY[x.reason ?? intents[0] ?? "beginner"]) }));
  const tags = intents.map((i) => t(intentLabel[i])).join(", ");
  const sources = ranked.flatMap((x) => {
    const r = reviewsForProduct(x.p.slug)[0];
    const out = [{ label: t(x.p.name), href: `/produto/${x.p.slug}` }];
    if (r) out.push({ label: t("Review em vídeo · {tester}", { tester: t(r.tester) }), href: `/produto/${x.p.slug}#teste` });
    return out;
  });
  return {
    kind: "picks",
    intents,
    items,
    sources,
    text: items.length
      ? t("Pelo que você contou ({tags}), separei {n} opções aprovadas:", { tags: tags || t("seu pedido"), n: items.length })
      : t("Não achei uma opção aprovada que combine direitinho. Tente descrever de outro jeito?"),
  };
}

const BEGINNER_CATS = ["para-comecar", "silenciosos", "lubrificantes-liquidos", "vibradores"];

export const productQuestions = [
  "Serve para a primeira vez?",
  "Posso usar com lubrificante?",
  "Como eu limpo?",
  "É discreto?",
  "O que a comunidade achou?",
];

export function answerProduct(question: string, p: AiProduct, t: T): AiAnswer {
  const q = question.toLowerCase();
  const base = { intents: [] as IntentId[], items: [], sources: [{ label: t(p.name), href: `/produto/${p.slug}` }] };
  const review = p.review;
  if (HEALTH.test(q)) {
    return { ...base, kind: "health", sources: [], text: t("Para dúvidas de saúde, converse com um profissional. Eu posso ajudar a escolher produtos, mas não substituo orientação médica.") };
  }
  if (/primeir|iniciant|começ|comec|first|beginner|empez|primera|principiant|d[eé]but|premi[eè]re|starter/.test(q)) {
    return { ...base, kind: "text", text: BEGINNER_CATS.includes(p.category) ? t("Sim, é uma boa opção para a primeira vez: {why}.", { why: t(WHY.beginner) }) : t("Costuma ser mais indicado para quem já conhece o básico. Para começar, vale olhar a seleção \"Para começar\".") };
  }
  if (/lubrific|lube|lubric/.test(q)) {
    return { ...base, kind: "text", text: t("Material: {material}. Como regra geral, lubrificante à base de água é a escolha mais segura. Confira a ficha de material antes de usar.", { material: t(p.specs?.material ?? "[material]") }) };
  }
  if (/limp|clean|lav|nettoy|lavar|higien|cuidad|care|soin/.test(q)) {
    return { ...base, kind: "text", text: t("Cuidados: {care}", { care: t(p.specs?.care ?? "[instruções]") }) };
  }
  if (/discret|silenc|quiet|noise|ruido|bruit|barulho|embalagem|packag/.test(q)) {
    return { ...base, kind: "text", text: p.category === "silenciosos" ? t("Sim: é da seleção dos silenciosos. O envio é discreto, em embalagem sem marca.") : t("O envio é discreto, em embalagem sem marca. O nível de ruído deste produto ainda será medido: [dado a definir].") };
  }
  if (/comunidad|community|communaut|review|achou|opin|test|avis|rese[ñn]a|dice|pense|think/.test(q) && review) {
    const r = reviewsForProduct(p.slug)[0];
    const src = [...base.sources];
    if (r) src.push({ label: t("Review em vídeo · {tester}", { tester: t(r.tester) }), href: `/produto/${p.slug}#teste` });
    return { ...base, sources: src, kind: "text", text: t("Resumo da review: funciona — {works}; não funciona — {doesnt}.", { works: t(review.works[0] ?? "[ponto forte]"), doesnt: t(review.doesnt[0] ?? "[ponto fraco]") }) };
  }
  return { ...base, kind: "text", text: t("Ainda estou aprendendo sobre este produto. Veja a review abaixo ou pergunte no Ask Benza.") };
}

export function interpretSearch(query: string, products: AiProduct[], t: T) {
  const { intents, bodies } = detect(query);
  if (!intents.length && !bodies.length) return { tags: [] as string[], picks: [] as AiProduct[] };
  const picks = products
    .map((p) => ({ p, ...score(p, intents, bodies) }))
    .filter((x) => x.s > 1)
    .sort((a, b) => b.s - a.s || a.p.slug.localeCompare(b.p.slug))
    .slice(0, 6)
    .map((x) => x.p);
  return { tags: intents.map((i) => t(intentLabel[i])), picks };
}
