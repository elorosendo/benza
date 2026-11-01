import { defaultLocale, type Locale } from "./config";

export type Messages = Record<string, string>;
export type TFunction = (key: string, vars?: Record<string, string | number>) => string;

// A chave é o próprio texto em português (Brasil). Sem tradução, devolve o texto original.
const warned = new Set<string>();

export function makeT(locale: Locale, messages: Messages): TFunction {
  return (key, vars) => {
    if (process.env.NODE_ENV !== "production" && locale !== defaultLocale && !(key in messages) && /\p{L}{3}/u.test(key)) {
      const id = `${locale}:${key}`;
      if (!warned.has(id)) {
        warned.add(id);
        console.warn(`[i18n] sem tradução (${locale}): ${key}`);
      }
    }
    let out = locale === defaultLocale ? key : (messages[key] ?? key);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
    }
    return out;
  };
}
