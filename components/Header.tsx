"use client";

import Link from "next/link";
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

type Props = {
  categories: Category[];
  lines: Line[];
  menuLines: Record<string, string>;
};

export function Header({ categories, lines, menuLines }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

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
    "inline-flex min-h-[var(--tap)] items-center text-sm hover:text-accent";

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
        <button
          type="button"
          className="-ml-3 inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={drawer}
          aria-controls="mobile-nav"
          onClick={() => setDrawer(true)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </button>

        {/* Desktop: categorias */}
        <nav aria-label="Categorias" className="hidden flex-1 gap-[26px] lg:flex">
          {categories.map((c) => {
            const hasMenu = !!c.groups?.length;
            const isOpen = open === c.slug && hasMenu;
            return (
              <Link
                key={c.slug}
                href={categoryHref(c.slug)}
                className={`${navLink} border-b ${
                  isOpen ? "border-accent text-accent" : "border-transparent"
                }`}
                aria-haspopup={hasMenu ? "true" : undefined}
                aria-expanded={hasMenu ? isOpen : undefined}
                onMouseEnter={() => show(hasMenu ? c.slug : null)}
                onFocus={() => show(hasMenu ? c.slug : null)}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>

        <Link href="/" aria-label="BENZA, página inicial" className="block leading-[0]">
          <Wordmark height={36} priority />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-[22px]">
          <Link href="/linhas" className={`${navLink} hidden lg:inline-flex`}>
            Linhas
          </Link>
          <Link href="/ask-benza" className={`${navLink} hidden lg:inline-flex`}>
            Ask Benza
          </Link>
          <Link
            href="/busca"
            aria-label="Buscar"
            className="inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center hover:text-accent"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </Link>
          <Link
            href="/sacola"
            className="inline-flex min-h-[var(--tap)] items-center font-mono text-xs uppercase tracking-[0.08em] hover:text-accent"
          >
            Sacola [0]
          </Link>
        </div>
      </div>

      {/* Mega menu */}
      {active && (
        <div className="absolute inset-x-0 top-full hidden border-t border-b border-[var(--sand-line)] bg-deep lg:block">
          <div className="container-benza grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 pb-10 pt-9">
            {active.groups!.map((g, i) => (
              <div key={g.label} className="flex flex-col gap-2.5">
                <span className="label text-accent">{g.label}</span>
                {i === 0 && (
                  <Link href={categoryHref(active.slug)} className="hover:text-accent" onClick={() => setOpen(null)}>
                    Ver tudo
                  </Link>
                )}
                {g.children.map((s) => (
                  <Link
                    key={s.slug}
                    href={subCategoryHref(active.slug, s.slug)}
                    className="hover:text-accent"
                    onClick={() => setOpen(null)}
                  >
                    {s.name}
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
                  alt={`Foto da linha ${activeLine.name}`}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
                <span className="absolute bottom-3.5 left-4 font-display text-2xl text-sand">
                  Linha {activeLine.name} →
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
