"use client";

import Link from "@/components/Link";
import { useEffect, useRef } from "react";
import { categoryHref, subCategoryHref, type Category } from "@/lib/catalog";
import { useT } from "@/lib/i18n/client";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  categories: Category[];
};

export function MobileNav({ id, open, onClose, categories }: Props) {
  const t = useT();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const row =
    "flex min-h-[var(--tap)] items-center justify-between border-b border-[var(--sand-line)]";

  return (
    <div id={id} className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t("Menu")}>
      <button
        type="button"
        aria-label={t("Fechar menu")}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-y-0 left-0 flex w-[min(360px,90vw)] flex-col overflow-y-auto bg-ink px-4 pb-8 outline-none"
      >
        <div className="flex h-16 items-center justify-between">
          <span className="label text-accent">{t("Menu")}</span>
          <button
            type="button"
            aria-label={t("Fechar menu")}
            onClick={onClose}
            className="-mr-3 inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <nav aria-label={t("Categorias")} className="flex flex-col">
          {categories.map((c) => {
            const subs = c.groups?.flatMap((g) => g.children) ?? [];
            if (!subs.length) {
              return (
                <Link key={c.slug} href={categoryHref(c.slug)} onClick={onClose} className={`${row} font-display text-2xl`}>
                  {t(c.name)}
                </Link>
              );
            }
            return (
              <details key={c.slug} className="border-b border-[var(--sand-line)]">
                <summary className="flex min-h-[var(--tap)] cursor-pointer list-none items-center justify-between font-display text-2xl">
                  {t(c.name)}
                  <span aria-hidden="true" className="font-mono text-sm text-accent">+</span>
                </summary>
                <div className="flex flex-col pb-3">
                  <Link href={categoryHref(c.slug)} onClick={onClose} className="flex min-h-[var(--tap)] items-center text-sm text-accent">
                    {t("Ver tudo")}</Link>
                  {subs.map((s) => (
                    <Link
                      key={s.slug}
                      href={subCategoryHref(c.slug, s.slug)}
                      onClick={onClose}
                      className="flex min-h-[var(--tap)] items-center text-sm"
                    >
                      {t(s.name)}
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>

        <nav aria-label={t("Institucional")} className="mt-6 flex flex-col">
          {[
            ["Linhas", "/linhas"],
            ["Ask Benza", "/ask-benza"],
            ["BENZA Approved", "/approved"],
            ["Diário", "/diario"],
            ["Sobre", "/sobre"],
            ["Comunidade", "/comunidade"],
            ["Aplicações", "/aplicacoes"],
          ].map(([label, href]) => (
            <Link key={href} href={href} onClick={onClose} className="flex min-h-[var(--tap)] items-center text-sm">
              {t(label)}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-[var(--sand-line)] pt-4">
          <span className="label text-accent">{t("Idioma")}</span>
          <LanguageSwitcher variant="list" className="mt-2 flex-col" />
        </div>
      </div>
    </div>
  );
}
