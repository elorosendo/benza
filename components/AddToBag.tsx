"use client";

import { useCart } from "@/lib/cart";

export function AddToBag({ slug }: { slug: string }) {
  const { add } = useCart();
  return (
    <button type="button" onClick={() => add(slug)} className="btn w-full justify-center bg-red text-white hover:opacity-90 sm:w-auto sm:min-w-[260px]">
      Adicionar à sacola
    </button>
  );
}
