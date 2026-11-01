"use client";

import { createContext, useContext, useMemo } from "react";
import { localizePath, type Locale } from "./config";
import { makeT, type Messages, type TFunction } from "./translate";

type Ctx = { locale: Locale; t: TFunction; href: (path: string) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo<Ctx>(
    () => ({ locale, t: makeT(locale, messages), href: (p) => localizePath(locale, p) }),
    [locale, messages],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useCtx() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT/useLocale fora do I18nProvider");
  return ctx;
}

export const useT = (): TFunction => useCtx().t;
export const useLocale = (): Locale => useCtx().locale;
export const useLocalizedHref = () => useCtx().href;
