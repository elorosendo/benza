"use client";

import type { Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";
import { useT } from "@/lib/i18n/client";

export function ProductGrid({ products }: { products: Product[] }) {
  const t = useT();
  if (!products.length) {
    return (
      <p className="py-16 font-display text-3xl">
        {t("Nada por aqui com esses filtros.")}{" "}<em>{t("Tente tirar um deles.")}</em>
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
