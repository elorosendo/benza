"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function BagLines({ onNavigate }: { onNavigate?: () => void }) {
  const { lines, setQty, remove } = useCart();
  if (!lines.length) {
    return <p className="font-display text-3xl">Sua sacola está <em>vazia.</em></p>;
  }
  const step =
    "inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center hover:text-accent";
  return (
    <ul className="flex flex-col">
      {lines.map((l) => (
        <li key={l.slug} className="grid grid-cols-[88px_1fr] gap-4 border-b border-current/15 py-5">
          <Link
            href={`/produto/${l.slug}`}
            onClick={onNavigate}
            className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-cream-deep"
          >
            {l.image && <Image src={l.image} alt={l.name} fill sizes="88px" className="object-cover" />}
          </Link>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-3">
              <Link href={`/produto/${l.slug}`} onClick={onNavigate} className="font-medium hover:underline">
                {l.name}
              </Link>
              <span className="shrink-0 font-mono text-[13px]">{formatPrice(l.price)}</span>
            </div>
            <span className="text-sm opacity-75">{l.brand}</span>
            <div className="mt-auto flex items-center justify-between">
              <div className="-ml-3 inline-flex items-center">
                <button type="button" aria-label={`Diminuir ${l.name}`} className={step} onClick={() => setQty(l.slug, l.qty - 1)}>
                  −
                </button>
                <span className="w-6 text-center font-mono text-sm" aria-live="polite">{l.qty}</span>
                <button type="button" aria-label={`Aumentar ${l.name}`} className={step} onClick={() => setQty(l.slug, l.qty + 1)}>
                  +
                </button>
              </div>
              <button type="button" onClick={() => remove(l.slug)} className="label min-h-[var(--tap)] underline underline-offset-4 hover:text-accent">
                Remover
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
