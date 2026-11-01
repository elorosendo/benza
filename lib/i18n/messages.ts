import type { Locale } from "./config";
import type { Messages } from "./translate";
import ptPT from "./dict/pt-PT";
import esES from "./dict/es-ES";
import frFR from "./dict/fr-FR";
import enUS from "./dict/en-US";

// pt-BR é o idioma-base: os textos do código já estão em pt-BR.
export const messages: Record<Locale, Messages> = {
  "pt-BR": {},
  "pt-PT": ptPT,
  "es-ES": esES,
  "fr-FR": frFR,
  "en-US": enUS,
};
