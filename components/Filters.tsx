"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/client";

type Option = { slug: string; label: string };
export type FilterGroup = { key: string; label: string; options: Option[] };

// Filtros rápidos numa única linha; o resto abre numa gaveta lateral.
const QUICK_KEYS = ["approved", "linha"];

export function Filters({ groups }: { groups: FilterGroup[] }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  const go = (next: URLSearchParams) => {
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const toggle = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (next.get(key) === value) next.delete(key);
    else next.set(key, value);
    go(next);
  };

  const activeCount = groups.filter((g) => params.get(g.key)).length;
  const quick = QUICK_KEYS.flatMap((k) => {
    const g = groups.find((x) => x.key === k);
    return g ? g.options.map((o) => ({ key: g.key, ...o })) : [];
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const btn = opener.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      btn?.focus();
    };
  }, [open]);

  const chip = (on: boolean) =>
    `inline-flex min-h-[var(--tap)] shrink-0 items-center whitespace-nowrap rounded-pill border px-4 text-sm transition-colors ${
      on ? "border-ink bg-ink text-sand" : "border-ink/30 hover:border-ink"
    }`;

  return (
    <div className="border-b border-ink/15 pb-5">
      <div className="flex items-center gap-2">
        <div className="-mx-4 flex flex-1 items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label={t("Filtros rápidos")}>
          {quick.map((o) => (
            <button
              key={`${o.key}-${o.slug}`}
              type="button"
              aria-pressed={params.get(o.key) === o.slug}
              className={chip(params.get(o.key) === o.slug)}
              onClick={() => toggle(o.key, o.slug)}
            >
              {o.label}
            </button>
          ))}
        </div>
        <button
          ref={opener}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="inline-flex min-h-[var(--tap)] shrink-0 items-center gap-2 rounded-pill border border-ink px-4 text-sm hover:bg-ink hover:text-sand"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
            <circle cx="16" cy="7" r="2" />
            <circle cx="8" cy="17" r="2" />
          </svg>
          {t("Mais filtros")}
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1.5 font-mono text-[11px] text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={t("Filtros")}>
          <button type="button" aria-label={t("Fechar filtros")} className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div ref={panel} tabIndex={-1} className="absolute inset-y-0 right-0 flex w-[min(440px,100vw)] flex-col bg-cream text-ink outline-none">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink/15 px-5">
              <span className="label text-accent-dark">{t("Filtros")}</span>
              <button type="button" aria-label={t("Fechar filtros")} onClick={() => setOpen(false)} className="-mr-3 inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>
            <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
              {groups.map((g) => (
                <fieldset key={g.key} className="flex flex-col gap-3">
                  <legend className="label mb-3 text-accent-dark">{g.label}</legend>
                  <div className="flex flex-wrap gap-2">
                    {g.options.map((o) => {
                      const on = params.get(g.key) === o.slug;
                      return (
                        <button key={o.slug} type="button" aria-pressed={on} className={chip(on)} onClick={() => toggle(g.key, o.slug)}>
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-ink/15 p-5">
              <button
                type="button"
                disabled={activeCount === 0}
                onClick={() => go(new URLSearchParams())}
                className="label inline-flex min-h-[var(--tap)] items-center underline underline-offset-4 disabled:opacity-40"
              >
                {t("Limpar filtros")}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn bg-red text-white hover:opacity-90">
                {t("Ver resultados")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
