"use client";

import { useRef } from "react";

// Faixa horizontal com scroll-snap e setas. Cada filho define a própria largura via itemClass.
export function Rail({
  children,
  itemClass,
  label,
  arrowClass = "border-current hover:bg-current/10",
}: {
  children: React.ReactNode;
  itemClass: string;
  label: string;
  arrowClass?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const arrow = `inline-flex h-12 w-12 items-center justify-center border text-lg ${arrowClass}`;
  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <button type="button" aria-label={`${label}: anterior`} className={arrow} onClick={() => scroll(-1)}>←</button>
        <button type="button" aria-label={`${label}: próximo`} className={arrow} onClick={() => scroll(1)}>→</button>
      </div>
      <div
        ref={track}
        className={`-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [&>*]:shrink-0 [&>*]:snap-start ${itemClass}`}
      >
        {children}
      </div>
    </div>
  );
}
