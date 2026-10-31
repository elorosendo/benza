import taxonomyJson from "@/data/taxonomy.json";
import tokens from "@/tokens.json";
import productsJson from "@/data/products.sample.json";

export type SubCategory = { slug: string; name: string };
export type CategoryGroup = { label: string; children: SubCategory[] };
export type Category = {
  slug: string;
  name: string;
  photo?: string;
  groups?: CategoryGroup[];
};

export type LineSlug = "penumbra" | "mata" | "rio" | "brasa";
export type Line = {
  slug: LineSlug;
  number: number;
  name: string;
  moment: string;
  photo: string;
  blurb: string;
  wordmark: string;
  tagline: string;
};

export function getCategories(): Category[] {
  return taxonomyJson.categories as Category[];
}

export function getLines(): Line[] {
  return Object.entries(tokens.lines).map(([slug, l]) => ({
    slug: slug as LineSlug,
    number: l.number,
    name: l.name,
    moment: l.moment,
    photo: l.photo,
    blurb: l.blurb,
    wordmark: l.wordmark,
    tagline: l.tagline,
  }));
}

export function getLine(slug: string): Line | undefined {
  return getLines().find((l) => l.slug === slug);
}

export function categoryHref(slug: string) {
  return slug === "por-corpo" ? "/corpo" : `/categoria/${slug}`;
}

export function subCategoryHref(category: string, sub: string) {
  if (category === "por-corpo") return `/corpo/${sub}`;
  if (sub === "approved") return "/approved";
  return `/categoria/${category}/${sub}`;
}

// Linha de destaque exibida no mega menu de cada categoria.
export const megaMenuLine: Record<string, LineSlug> = {
  prazer: "brasa",
  "cuidado-intimo": "rio",
  "no-clima": "penumbra",
  "por-corpo": "mata",
};

// ---------- Produtos ----------


export type Product = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  body: string[];
  line: LineSlug;
  approved: boolean;
  isNew: boolean;
  images: string[];
  summary: string;
  review: { works: string[]; doesnt: string[]; testedBy: string; testedFor: string };
  specs: { material: string; size: string; care: string };
};

export function getProducts(): Product[] {
  return productsJson.products as Product[];
}

export function getSubCategoryName(slug: string): string | undefined {
  for (const c of getCategories()) {
    for (const g of c.groups ?? []) {
      const found = g.children.find((s) => s.slug === slug);
      if (found) return found.name;
    }
  }
}

export function categorySubSlugs(slug: string): string[] {
  const c = getCategories().find((x) => x.slug === slug);
  return c?.groups?.flatMap((g) => g.children.map((s) => s.slug)) ?? [];
}

export function countInCategory(slug: string): number {
  const subs = categorySubSlugs(slug);
  return getProducts().filter((p) => subs.includes(p.category)).length;
}

export function countInBody(slug: string): number {
  return getProducts().filter((p) => p.body.includes(slug)).length;
}

export function getApprovedCount(): number {
  return getProducts().filter((p) => p.approved).length;
}

export function getNewApproved(): Product[] {
  return getProducts().filter((p) => p.approved && p.isNew);
}

export function formatCount(n: number): string {
  return `[${String(n).padStart(2, "0")}]`;
}

// Preço 0 = ainda sem valor definido: mantém o placeholder visível.
export function formatPrice(price: number): string {
  if (!price) return "[PREÇO]";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const linePhotoAlt: Record<LineSlug, string> = {
  penumbra: "Duas pessoas, rostos próximos",
  mata: "Mulher correndo na floresta",
  rio: "Pêssego com mel",
  brasa: "Mãos em luz vermelha",
};

export const photoAlt: Record<string, string> = {
  "hands.jpg": "Silhueta de braços contra fundo terracota",
  "peach.jpg": "Pêssego com mel escorrendo",
  "candle.jpg": "Vela acesa com ervas",
  "neck.jpg": "Pescoço e ombro com pele brilhante",
};

// ---------- Filtros (estado na URL) ----------

export type FilterParams = {
  sub?: string;
  corpo?: string;
  linha?: string;
  preco?: string;
  approved?: string;
};

export const priceRanges = [
  { slug: "ate-100", label: "Até R$ 100", min: 0, max: 100 },
  { slug: "100-250", label: "R$ 100–250", min: 100, max: 250 },
  { slug: "250-mais", label: "Acima de R$ 250", min: 250, max: Infinity },
] as const;

// Produto sem preço definido (0) passa por qualquer faixa, para o protótipo não esvaziar a lista.
export function filterProducts(products: Product[], f: FilterParams): Product[] {
  const range = priceRanges.find((r) => r.slug === f.preco);
  return products.filter((p) => {
    if (f.sub && p.category !== f.sub) return false;
    if (f.corpo && !p.body.includes(f.corpo)) return false;
    if (f.linha && p.line !== f.linha) return false;
    if (f.approved === "1" && !p.approved) return false;
    if (range && p.price > 0 && (p.price < range.min || p.price >= range.max)) return false;
    return true;
  });
}

export function getBodyParts(): SubCategory[] {
  const c = getCategories().find((x) => x.slug === "por-corpo");
  return c?.groups?.flatMap((g) => g.children) ?? [];
}

export function getCategory(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function categoryProducts(slug: string, sub?: string): Product[] {
  if (slug === "novidades") return getProducts().filter((p) => p.isNew);
  const subs = sub ? [sub] : categorySubSlugs(slug);
  return getProducts().filter((p) => subs.includes(p.category));
}
