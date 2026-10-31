"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/lib/catalog";
import { ProductGrid } from "./ProductGrid";

export type SearchItem = Product & { categoryName: string; lineName: string; bodyNames: string[] };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function SearchView({ items }: { items: SearchItem[] }) {
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

  const onChange = (v: string) => {
    setQ(v);
    router.replace(v ? `${pathname}?q=${encodeURIComponent(v)}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-8">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
        <label htmlFor="busca" className="label text-accent-dark">Buscar</label>
        <input
          id="busca"
          type="search"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Vibrador, lubrificante, Mata, vulva…"
          className="min-h-[56px] rounded-pill border border-ink/30 bg-transparent px-6 text-lg placeholder:text-ink/50"
        />
      </form>
      <p role="status" className="label text-ink/70">
        {q.trim() ? `[${String(results.length).padStart(2, "0")}] resultados` : "Digite para buscar"}
      </p>
      {q.trim() && <ProductGrid products={results} />}
    </div>
  );
}
