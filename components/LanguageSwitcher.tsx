"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, localeMeta, slugOf, splitPath, type Locale } from "@/lib/i18n/config";
import { useLocale, useT } from "@/lib/i18n/client";

function useTargets() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const { rest } = splitPath(pathname);
  return (l: Locale) => `/${slugOf(l)}${rest === "/" ? "" : rest}${search ? `?${search}` : ""}`;
}

const remember = (l: Locale) => {
  try {
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
};

// Menu suspenso (header) ou lista em linha (rodapé e menu mobile).
export function LanguageSwitcher({ variant = "menu", className = "" }: { variant?: "menu" | "list"; className?: string }) {
  const t = useT();
  const current = useLocale();
  const target = useTargets();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (variant === "list") {
    return (
      <ul className={`flex flex-wrap gap-x-4 ${className}`} aria-label={t("Idioma")}>
        {locales.map((l) => (
          <li key={l}>
            <NextLink
              href={target(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === current ? "true" : undefined}
              onClick={() => remember(l)}
              className={`inline-flex min-h-[var(--tap)] items-center hover:text-accent lg:min-h-0 ${l === current ? "text-accent" : ""}`}
            >
              {localeMeta[l].label}
            </NextLink>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={box} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t("Idioma")}: ${localeMeta[current].label}`}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-[var(--tap)] items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] hover:text-accent"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
        </svg>
        {localeMeta[current].flag}
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-50 mt-1 min-w-[220px] rounded-brand border border-[var(--sand-line)] bg-deep p-2 text-sand shadow-xl">
          {locales.map((l) => (
            <li key={l}>
              <NextLink
                href={target(l)}
                hrefLang={l}
                lang={l}
                aria-current={l === current ? "true" : undefined}
                onClick={() => {
                  remember(l);
                  setOpen(false);
                }}
                className={`flex min-h-[var(--tap)] items-center justify-between gap-4 rounded-lg px-3 text-sm hover:bg-sand/10 ${l === current ? "text-accent" : ""}`}
              >
                {localeMeta[l].label}
                {l === current && <span aria-hidden="true">✓</span>}
              </NextLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
