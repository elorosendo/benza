export const locales = ["pt-BR", "pt-PT", "es-ES", "fr-FR", "en-US"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt-BR";

// O caminho da URL é o código em minúsculas: /pt-br, /pt-pt, /es-es, /fr-fr, /en-us.
export const localeMeta: Record<Locale, { label: string; native: string; slug: string; flag: string }> = {
  "pt-BR": { label: "Português (Brasil)", native: "Português · Brasil", slug: "pt-br", flag: "BR" },
  "pt-PT": { label: "Português (Portugal)", native: "Português · Portugal", slug: "pt-pt", flag: "PT" },
  "es-ES": { label: "Español (España)", native: "Español · España", slug: "es-es", flag: "ES" },
  "fr-FR": { label: "Français (France)", native: "Français · France", slug: "fr-fr", flag: "FR" },
  "en-US": { label: "English (USA)", native: "English · USA", slug: "en-us", flag: "US" },
};

export function slugOf(locale: Locale): string {
  return localeMeta[locale].slug;
}

export function localeFromSlug(slug: string): Locale | undefined {
  return locales.find((l) => localeMeta[l].slug === slug.toLowerCase());
}

// "/en-us/produto/x" -> { locale: "en-US", rest: "/produto/x" }
export function splitPath(pathname: string): { locale?: Locale; rest: string } {
  const [, first, ...tail] = pathname.split("/");
  const locale = first ? localeFromSlug(first) : undefined;
  if (!locale) return { rest: pathname };
  return { locale, rest: "/" + tail.join("/") };
}

export function localizePath(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const base = `/${slugOf(locale)}`;
  return href === "/" ? base : `${base}${href}`;
}
