"use client";

import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function BagTotal() {
  const { total, hasUnpriced, lines } = useCart();
  if (!lines.length) return null;
  return (
    <div className="flex items-baseline justify-between">
      <span className="label">Total</span>
      <span className="font-mono text-base">
        {hasUnpriced && !total ? "[TOTAL]" : formatPrice(total)}
        {hasUnpriced && total > 0 ? " + [PREÇO]" : ""}
      </span>
    </div>
  );
}
