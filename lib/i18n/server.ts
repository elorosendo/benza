import { locale as localeParam } from "next/root-params";
import { notFound } from "next/navigation";
import { localeFromSlug, type Locale } from "./config";
import { messages } from "./messages";
import { makeT, type TFunction } from "./translate";

// Só em Server Components: lê o idioma da URL sem passar props.
export async function getLocale(): Promise<Locale> {
  const slug = await localeParam();
  const l = slug ? localeFromSlug(slug) : undefined;
  if (!l) notFound();
  return l;
}

export async function getT(): Promise<TFunction> {
  const l = await getLocale();
  return makeT(l, messages[l]);
}
