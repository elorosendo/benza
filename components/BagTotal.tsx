"use client";

import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useLocale, useT } from "@/lib/i18n/client";

export function BagTotal() {
  const t = useT();
  const locale = useLocale();
  const { total, hasUnpriced, lines } = useCart();
  if (!lines.length) return null;
  return (
    <div className="flex items-baseline justify-between">
      <span className="label">{t("Total")}</span>
      <span className="font-mono text-base">
        {hasUnpriced && !total ? t("[TOTAL]") : formatPrice(total, locale, t)}
        {hasUnpriced && total > 0 ? ` + ${t("[PREÇO]")}` : ""}
      </span>
    </div>
  );
}
