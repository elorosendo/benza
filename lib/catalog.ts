import taxonomyJson from "@/data/taxonomy.json";
import tokens from "@/tokens.json";

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
