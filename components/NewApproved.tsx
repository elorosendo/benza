"use client";

import { useRef } from "react";

export function NewApproved({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const arrow =
    "inline-flex h-12 w-12 items-center justify-center border border-ink text-lg hover:bg-ink hover:text-sand";
  return (
    <section className="bg-cream-deep text-ink">
      <div className="container-benza py-16 sm:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
            Novidades <em>(aprovadas)</em>
          </h2>
          <div className="flex gap-2">
            <button type="button" aria-label="Anterior" className={arrow} onClick={() => scroll(-1)}>←</button>
            <button type="button" aria-label="Próximo" className={arrow} onClick={() => scroll(1)}>→</button>
          </div>
        </div>
        <div
          ref={track}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [&>*]:w-[70%] [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-[calc((100%-32px)/3)] lg:[&>*]:w-[calc((100%-48px)/4)]"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
