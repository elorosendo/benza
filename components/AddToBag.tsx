"use client";

import { useCart } from "@/lib/cart";
import { useT } from "@/lib/i18n/client";

export function AddToBag({ slug }: { slug: string }) {
  const t = useT();
  const { add } = useCart();
  return (
    <button type="button" onClick={() => add(slug)} className="btn w-full justify-center bg-red text-white hover:opacity-90 sm:w-auto sm:min-w-[260px]">
      {t("Adicionar à sacola")}</button>
  );
}
