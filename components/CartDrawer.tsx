"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { BagLines } from "./BagLines";
import { BagTotal } from "./BagTotal";
import { CheckoutNotice } from "./CheckoutNotice";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines } = useCart();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Sacola">
      <button type="button" aria-label="Fechar sacola" className="absolute inset-0 bg-black/50" onClick={closeDrawer} />
      <div
        ref={panel}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-[min(440px,100vw)] flex-col bg-ink text-sand outline-none"
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <span className="label text-accent">Sacola</span>
          <button type="button" aria-label="Fechar sacola" onClick={closeDrawer} className="-mr-3 inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <BagLines onNavigate={closeDrawer} />
        </div>
        {lines.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-[var(--sand-line)] p-4 sm:p-6">
            <BagTotal />
            <div className="flex gap-2.5">
              <Link href="/sacola" onClick={closeDrawer} className="btn flex-1 justify-center border border-sand/60 hover:bg-sand hover:text-ink">
                Ver sacola
              </Link>
              <CheckoutNotice className="btn flex-1 justify-center bg-red text-white hover:opacity-90" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
