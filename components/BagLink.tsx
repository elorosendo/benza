"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function BagLink({ className }: { className?: string }) {
  const { count } = useCart();
  return (
    <Link href="/sacola" className={className}>
      Sacola [{count}]
    </Link>
  );
}
