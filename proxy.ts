import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, localeFromSlug, localizePath, locales, type Locale } from "@/lib/i18n/config";

// Escolhe o idioma: cookie da última escolha > Accept-Language > pt-BR.
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get("NEXT_LOCALE")?.value;
  const fromCookie = saved ? locales.find((l) => l === saved) : undefined;
  if (fromCookie) return fromCookie;

  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase())
    .filter(Boolean);

  for (const tag of accepted) {
    const exact = locales.find((l) => l.toLowerCase() === tag);
    if (exact) return exact;
    const lang = tag.split("-")[0];
    if (lang === "pt") return "pt-BR";
    if (lang === "es") return "es-ES";
    if (lang === "fr") return "fr-FR";
    if (lang === "en") return "en-US";
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (first && localeFromSlug(first)) return;

  const url = request.nextUrl.clone();
  url.pathname = localizePath(pickLocale(request), pathname);
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // Ignora arquivos estáticos (com extensão) e internos do Next.
  matcher: ["/((?!_next|api|assets|fonts|.*\\..*).*)"],
};
