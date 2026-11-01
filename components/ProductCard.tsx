"use client";

import Link from "@/components/Link";
import Image from "next/image";
import { formatPrice, getSubCategoryName, type Product } from "@/lib/catalog";
import { ApprovedBadge } from "./ApprovedBadge";
import { reviewsForProduct } from "@/lib/social";
import { useLocale, useT } from "@/lib/i18n/client";

export function ProductCard({ product }: { product: Product }) {
  const t = useT();
  const locale = useLocale();
  const image = product.images[0];
  const tested = reviewsForProduct(product.slug)[0];
  const sub = getSubCategoryName(product.category);
  return (
    <article data-line={product.line} className="flex flex-col gap-2.5">
      <Link href={`/produto/${product.slug}`} className="group flex flex-col gap-2.5">
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-brand bg-cream font-mono text-[11px] text-[#6A4A3A]">
          {image ? (
            <Image src={image} alt={t(product.name)} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          ) : (
            t("[FOTO]")
          )}
          {product.approved && <ApprovedBadge />}
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-[15px] font-medium group-hover:underline">{t(product.name)}</span>
          <span className="shrink-0 font-mono text-[13px]">{formatPrice(product.price, locale, t)}</span>
        </div>
        <span className="text-sm opacity-75">
          {t(product.brand)} · {sub ? t(sub) : ""}
        </span>
        {tested && (
          <span className="label inline-flex items-center gap-1.5 text-accent-dark">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            {t("Testado por {tester}", { tester: t(tested.tester) })}
          </span>
        )}
      </Link>
    </article>
  );
}
