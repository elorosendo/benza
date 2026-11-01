"use client";

import Link from "@/components/Link";
import { useCart } from "@/lib/cart";
import { useT } from "@/lib/i18n/client";

export function BagLink({ className }: { className?: string }) {
  const t = useT();
  const { count } = useCart();
  return (
    <Link href="/sacola" className={`whitespace-nowrap ${className ?? ""}`}>
      {t("Sacola [{count}]", { count })}
    </Link>
  );
}
