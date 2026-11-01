"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export type TarotName = "clitoris" | "vulva" | "penis" | "anus" | "clitorisdark" | "vulva-negative" | "clitoris-negative" | "benzacard";

const DIMS: Partial<Record<TarotName, [number, number]>> = {
  "vulva-negative": [456, 667],
  "clitoris-negative": [451, 667],
  benzacard: [358, 631],
};

// Carta de tarô ilustrada: flutua devagar e inclina em 3D conforme o mouse (ou o toque) na área do cartão.
// Com "reduzir movimento", fica parada.
export function TarotCard({
  name,
  alt,
  width,
  rest = 0,
  floatDelay = 0,
  tiltZone = "self",
  priority = false,
  className = "",
}: {
  name: TarotName;
  alt: string;
  width: number | string;
  rest?: number; // inclinação de repouso, em graus
  floatDelay?: number;
  tiltZone?: "self" | "parent-link";
  priority?: boolean;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    const card = inner.current;
    if (!el || !card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const zone: HTMLElement = (tiltZone === "parent-link" ? el.closest("a") : null) ?? el;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const cx = Math.max(-1.6, Math.min(1.6, x));
      const cy = Math.max(-1.6, Math.min(1.6, y));
      card.style.transform = `rotateX(${(-cy * 9).toFixed(1)}deg) rotateY(${(cx * 11).toFixed(1)}deg) scale(1.05)`;
    };
    const leave = () => {
      card.style.transform = "";
    };
    zone.addEventListener("pointermove", move);
    zone.addEventListener("pointerleave", leave);
    return () => {
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerleave", leave);
    };
  }, [tiltZone]);

  return (
    <div
      ref={outer}
      className={`tarot-float [perspective:900px] ${className}`}
      style={{ width, ["--fd" as string]: `${floatDelay}s`, rotate: `${rest}deg` }}
    >
      <div ref={inner} className="tarot-inner">
        <Image
          src={`/assets/cards/${name}.svg`}
          alt={alt}
          width={DIMS[name]?.[0] ?? 588}
          height={DIMS[name]?.[1] ?? 979}
          unoptimized
          priority={priority}
          className="h-auto w-full select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
