"use client";

import Link from "next/link";
import { useState } from "react";
import { categoryHref, type Category } from "@/lib/catalog";
import { Wordmark } from "./Wordmark";
import { MobileNav } from "./MobileNav";
import { BagLink } from "./BagLink";

// Headers das variações V2 (Dia, claro) e V3 (Expressiva, Mata). Sem mega menu, como na referência.
export function HeaderAlt({
  variant,
  categories,
}: {
  variant: 2 | 3;
  categories: Category[];
}) {
  const [drawer, setDrawer] = useState(false);
  const light = variant === 2;
  const link = "inline-flex min-h-[var(--tap)] items-center text-sm font-medium hover:text-accent";
  const linkLight = light ? "hover:!text-accent-dark" : "";
  const mono =
    "inline-flex min-h-[var(--tap)] items-center font-mono text-xs uppercase tracking-[0.08em]";
  const italic = "inline-flex min-h-[var(--tap)] items-center font-display text-lg italic font-medium";

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
          aria-label="Abrir menu"
          aria-expanded={drawer}
          aria-controls="mobile-nav-alt"
          onClick={() => setDrawer(true)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </button>

        {light && (
          <Link href="/" aria-label="BENZA, página inicial" className="block leading-[0]">
            <Wordmark height={30} priority />
          </Link>
        )}

        <nav aria-label="Categorias" className={`hidden gap-[26px] lg:flex ${light ? "" : "flex-1"}`}>
          {categories.map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className={`${link} ${linkLight}`}>
              {c.name}
            </Link>
          ))}
          {light && (
            <Link href="/linhas" className={`${italic} ${linkLight}`}>
              (Linhas)
            </Link>
          )}
        </nav>

        {light ? (
          <div className="flex items-center gap-[18px]">
            <Link href="/busca" className={`${mono} hidden sm:inline-flex ${linkLight}`}>Buscar</Link>
            <BagLink className={`${mono} ${linkLight}`} />
          </div>
        ) : (
          <div className="flex items-center gap-[22px]">
            <Link href="/ask-benza" className={`${link} hidden lg:inline-flex`}>Ask Benza</Link>
            <Link href="/linhas" className={`${italic} hidden hover:text-accent lg:inline-flex`}>(Linhas)</Link>
            <BagLink className={`${mono} hover:text-accent`} />
          </div>
        )}
      </div>
      <MobileNav id="mobile-nav-alt" open={drawer} onClose={() => setDrawer(false)} categories={categories} />
    </header>
  );
}
