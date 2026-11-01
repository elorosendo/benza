"use client";

import Link from "@/components/Link";
import { useState } from "react";
import { categoryHref, type Category } from "@/lib/catalog";
import { Wordmark } from "./Wordmark";
import { MobileNav } from "./MobileNav";
import { BagLink } from "./BagLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "@/lib/i18n/client";

// Headers das variações V2 (Dia, claro) e V3 (Expressiva, Mata). Sem mega menu, como na referência.
export function HeaderAlt({
  variant,
  categories,
}: {
  variant: 2 | 3;
  categories: Category[];
}) {
  const t = useT();
  const [drawer, setDrawer] = useState(false);
  const light = variant === 2;
  const link = "min-h-[var(--tap)] items-center text-sm font-medium hover:text-accent";
  const linkLight = light ? "hover:!text-accent-dark" : "";
  const mono =
    "inline-flex min-h-[var(--tap)] items-center font-mono text-xs uppercase tracking-[0.08em]";
  const italic = "inline-flex min-h-[var(--tap)] items-center font-brand text-lg italic font-medium";

  return (
    <header
      className={
        light
          ? "relative z-30 border-b border-ink/15 bg-cream text-ink"
          : "relative z-30 bg-olive text-sand"
      }
    >
      <div className="container-benza flex items-center justify-between gap-6 py-3 lg:py-[18px]">
        <button
          type="button"
          className="-ml-3 inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center lg:hidden"
          aria-label={t("Abrir menu")}
          aria-expanded={drawer}
          aria-controls="mobile-nav-alt"
          onClick={() => setDrawer(true)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </button>

        {light && (
          <Link href="/" aria-label={t("benza, página inicial")} className="flex min-h-[var(--tap)] shrink-0 items-center leading-[0]">
            <Wordmark height={30} priority />
          </Link>
        )}

        <nav aria-label={t("Categorias")} className={`hidden gap-[26px] lg:flex ${light ? "" : "flex-1"}`}>
          {categories.map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className={`inline-flex ${link} ${linkLight}`}>
              {t(c.name)}
            </Link>
          ))}
          {light && (
            <Link href="/linhas" className={`${italic} ${linkLight}`}>
              {t("(Linhas)")}</Link>
          )}
        </nav>

        {light ? (
          <div className="flex items-center gap-[18px]">
            <Link href="/busca" className={`${mono} hidden sm:inline-flex ${linkLight}`}>{t("Buscar")}</Link>
            <LanguageSwitcher className="hidden lg:block" />
            <BagLink className={`${mono} ${linkLight}`} />
          </div>
        ) : (
          <div className="flex items-center gap-[22px]">
            <Link href="/ask-benza" className={`${link} hidden lg:inline-flex`}>{t("Ask Benza")}</Link>
            <Link href="/linhas" className={`${italic} hidden hover:text-accent lg:inline-flex`}>{t("(Linhas)")}</Link>
            <LanguageSwitcher className="hidden lg:block" />
            <BagLink className={`${mono} hover:text-accent`} />
          </div>
        )}
      </div>
      <MobileNav id="mobile-nav-alt" open={drawer} onClose={() => setDrawer(false)} categories={categories} />
    </header>
  );
}
