"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/lib/catalog";
import { ProductGrid } from "./ProductGrid";
import { interpretSearch, type AiProduct } from "@/lib/aiMock";
import { useT } from "@/lib/i18n/client";

export type SearchItem = Product & { categoryName: string; lineName: string; bodyNames: string[] };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const EXAMPLES = ["algo discreto para começar", "lubrificante para viagem", "ritual a dois", "cuidado e higiene"];

export function SearchView({ items, aiProducts }: { items: SearchItem[]; aiProducts: AiProduct[] }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return items.filter((p) => {
      const hay = norm([p.name, p.brand, p.summary, p.categoryName, p.lineName, ...p.bodyNames].join(" "));
      return terms.every((t) => hay.includes(t));
    });
  }, [q, items]);

  const intent = useMemo(() => interpretSearch(q, aiProducts, t), [q, aiProducts, t]);
  const aiExtra = intent.picks.filter((p) => !results.some((r) => r.slug === p.slug));

  const onChange = (v: string) => {
    setQ(v);
    router.replace(v ? `${pathname}?q=${encodeURIComponent(v)}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-8">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
        <label htmlFor="busca" className="label text-accent-dark">{t("Buscar")}</label>
        <input
          id="busca"
          type="search"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("Vibrador, lubrificante, Mata, vulva…")}
          className="min-h-[56px] rounded-pill border border-ink/30 bg-transparent px-6 text-lg placeholder:text-ink/50"
        />
      </form>
      <p role="status" className="label text-ink/70">
        {q.trim() ? t("{count} resultados", { count: `[${String(results.length).padStart(2, "0")}]` }) : t("Digite para buscar")}
      </p>
      {q.trim() && results.length > 0 && <ProductGrid products={results} />}

      {q.trim() && intent.tags.length > 0 && (
        <section aria-labelledby="ai-intent" className="flex flex-col gap-5 rounded-brand bg-deep p-6 text-sand sm:p-8">
          <span id="ai-intent" className="label flex items-center gap-2 text-accent">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red" />
            {t("Busca por intenção · IA protótipo")}
          </span>
          <p className="text-[17px] leading-relaxed">
            {t("Entendi que você procura:")}{" "}
            {intent.tags.map((tag) => (
              <span key={tag} className="mr-2 inline-block rounded-pill border border-sand/30 px-3 py-0.5 text-sm">{tag}</span>
            ))}
          </p>
          {aiExtra.length > 0 ? (
            <div className="rounded-brand bg-cream-deep p-5 text-ink">
              <ProductGrid products={aiExtra} />
            </div>
          ) : (
            <p className="text-sand-muted">{t("Os resultados acima já cobrem o que você descreveu.")}</p>
          )}
          <p className="label text-sand/50">{t("Busca simulada. A IA de verdade entenderá frases livres em qualquer idioma.")}</p>
        </section>
      )}

      {q.trim() && results.length === 0 && intent.tags.length === 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[17px]">{t("Nada com esse nome. Tente descrever o que você quer, por exemplo:")}</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" onClick={() => onChange(t(ex))} className="inline-flex min-h-[var(--tap)] items-center rounded-pill border border-ink/30 px-4 text-sm hover:border-ink">
                {t(ex)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
