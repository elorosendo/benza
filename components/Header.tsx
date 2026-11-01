"use client";

import Link from "@/components/Link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  categoryHref,
  subCategoryHref,
  type Category,
  type Line,
} from "@/lib/catalog";
import { Wordmark } from "./Wordmark";
import { MobileNav } from "./MobileNav";
import { BagLink } from "./BagLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "@/lib/i18n/client";

type Props = {
  categories: Category[];
  lines: Line[];
  menuLines: Record<string, string>;
};

export function Header({ categories, lines, menuLines }: Props) {
  const t = useT();
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const show = (slug: string | null) => {
    clearTimeout(closeTimer.current);
    setOpen(slug);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  const active = categories.find((c) => c.slug === open && c.groups?.length);
  const activeLine = active
    ? lines.find((l) => l.slug === menuLines[active.slug])
    : undefined;

  const navLink =
    "min-h-[var(--tap)] items-center whitespace-nowrap text-sm hover:text-accent";

  return (
    <header
      ref={headerRef}
      className="relative z-30 border-b border-[var(--sand-line)] bg-ink"
      onMouseLeave={scheduleClose}
      onMouseEnter={() => clearTimeout(closeTimer.current)}
      onBlur={(e) => {
        if (!headerRef.current?.contains(e.relatedTarget as Node)) setOpen(null);
      }}
    >
      <div className="container-benza flex items-center justify-between gap-8 py-3 lg:py-[18px]">
        {/* Mobile: gaveta */}
        <div className="flex flex-1 lg:hidden">
          <button
            type="button"
            className="-ml-3 inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center"
            aria-label={t("Abrir menu")}
            aria-expanded={drawer}
            aria-controls="mobile-nav"
            onClick={() => setDrawer(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </button>
        </div>

        {/* Desktop: categorias */}
        <nav aria-label={t("Categorias")} className={`hidden flex-1 gap-5 lg:flex xl:gap-[26px]`}>
          {categories.map((c) => {
            const hasMenu = !!c.groups?.length;
            const isOpen = open === c.slug && hasMenu;
            return (
              <Link
                key={c.slug}
                href={categoryHref(c.slug)}
                className={`inline-flex ${navLink} border-b ${
                  isOpen ? "border-accent text-accent" : "border-transparent"
                }`}
                aria-haspopup={hasMenu ? "true" : undefined}
                aria-expanded={hasMenu ? isOpen : undefined}
                onMouseEnter={() => show(hasMenu ? c.slug : null)}
                onFocus={() => show(hasMenu ? c.slug : null)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" && hasMenu) {
                    e.preventDefault();
                    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
                  }
                }}
              >
                {t(c.name)}
              </Link>
            );
          })}
        </nav>

        <Link href="/" aria-label={t("benza, página inicial")} className="flex min-h-[var(--tap)] shrink-0 items-center leading-[0]">
          <Wordmark height={36} priority />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2 lg:gap-[22px]">
          <Link href="/linhas" className={`${navLink} hidden lg:inline-flex`}>
            {t("Linhas")}</Link>
          <Link href="/ask-benza" className={`${navLink} hidden lg:inline-flex`}>
            {t("Ask Benza")}</Link>
          <Link href="/comunidade" className={`${navLink} hidden xl:inline-flex`}>
            {t("Comunidade")}</Link>
          <Link href="/aplicacoes" className={`${navLink} hidden xl:inline-flex`}>
            {t("Aplicações")}</Link>
          <Link
            href="/busca"
            aria-label={t("Buscar")}
            className="inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center hover:text-accent"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </Link>
          <LanguageSwitcher className="hidden lg:block" />
          <BagLink className="inline-flex min-h-[var(--tap)] items-center font-mono text-xs uppercase tracking-[0.08em] hover:text-accent" />
        </div>
      </div>

      {/* Mega menu */}
      {active && (
        <div ref={panelRef} className="mega-panel absolute inset-x-0 top-full hidden border-t border-b border-[var(--sand-line)] bg-deep lg:block">
          <div className="container-benza grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 pb-10 pt-9">
            {active.groups!.map((g, i) => (
              <div key={g.label} className="flex flex-col gap-2.5">
                <span className="label text-accent">{t(g.label)}</span>
                {i === 0 && (
                  <Link href={categoryHref(active.slug)} className="hover:text-accent" onClick={() => setOpen(null)}>
                    {t("Ver tudo")}</Link>
                )}
                {g.children.map((s) => (
                  <Link
                    key={s.slug}
                    href={subCategoryHref(active.slug, s.slug)}
                    className="hover:text-accent"
                    onClick={() => setOpen(null)}
                  >
                    {t(s.name)}
                  </Link>
                ))}
              </div>
            ))}
            {activeLine && (
              <Link
                href={`/linhas/${activeLine.slug}`}
                className="relative block min-h-[220px] overflow-hidden rounded-brand bg-burgundy"
                onClick={() => setOpen(null)}
              >
                <Image
                  src={`/assets/photos/${activeLine.photo}`}
                  alt={t("Foto da linha {name}", { name: activeLine.name })}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
                <span className="absolute bottom-3.5 left-4 font-display text-2xl text-sand">
                  {t("Linha {name} →", { name: activeLine.name })}
                </span>
              </Link>
            )}
          </div>
        </div>
      )}

      <MobileNav
        id="mobile-nav"
        open={drawer}
        onClose={() => setDrawer(false)}
        categories={categories}
      />
    </header>
  );
}
