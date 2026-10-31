"use client";

import { usePathname, useSearchParams } from "next/navigation";

export type HomeVariant = 1 | 2 | 3;

// A home aceita ?v=1|2|3 para comparar as variações da designer.
export function useHomeVariant(): HomeVariant | null {
  const pathname = usePathname();
  const v = useSearchParams().get("v");
  if (pathname !== "/") return null;
  return v === "1" || v === "2" || v === "3" ? (Number(v) as HomeVariant) : null;
}
