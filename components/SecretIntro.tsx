"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["the", "good", "kind", "of", "secret"];
const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

type Layout = { lines: number[][]; size: number };

// "the good kind of secret" em Gaya Italic, na largura toda; cada palavra acende com o scroll.
export function SecretIntro() {
  const section = useRef<HTMLElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const cue = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);
  const [layout, setLayout] = useState<Layout>({ lines: [[0, 1, 2, 3, 4]], size: 80 });

  // Ajusta o corpo da fonte para a frase caber na largura (1 linha no desktop, 3 no mobile).
  useEffect(() => {
    const fit = () => {
      const sec = section.current;
      const m = measure.current;
      if (!sec || !m) return;
      const spans = Array.from(m.querySelectorAll<HTMLElement>("[data-w]"));
      const widths = spans.map((s) => s.getBoundingClientRect().width);
      const space = m.querySelector<HTMLElement>("[data-space]")!.getBoundingClientRect().width;
      const avail = sec.clientWidth - (window.innerWidth < 640 ? 32 : 48);
      const mobile = window.innerWidth < 640;
      const lines = mobile ? [[0, 1], [2, 3], [4]] : [[0, 1, 2, 3, 4]];
      const lineW = (l: number[]) => l.reduce((a, i) => a + widths[i], 0) + space * (l.length - 1);
      const widest = Math.max(...lines.map(lineW));
      const byWidth = (avail / widest) * 100;
      const byHeight = (window.innerHeight * 0.7) / (lines.length * 1.05);
      setLayout({ lines, size: Math.floor(Math.min(byWidth, byHeight)) });
    };
    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const sec = section.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const p = reduced ? 1 : clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      words.current.forEach((el, i) => {
        if (!el) return;
        const v = clamp((p + 0.1 - i * 0.15) / 0.25);
        el.style.opacity = String(0.22 + 0.78 * v);
        el.style.transform = `translateY(${(1 - v) * 0.22}em)`;
      });
      if (cue.current) cue.current.style.opacity = String(1 - clamp(p * 6));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, layout]);

  return (
    <section
      ref={section}
      aria-label="the good kind of secret"
      className={`relative overflow-x-clip bg-ink text-red ${reduced ? "" : "h-[260vh]"}`}
    >
      <div
        className={`flex flex-col items-center justify-center overflow-hidden ${
          reduced ? "min-h-[70vh] py-16" : "sticky top-0 h-[calc(100svh-4px)]"
        }`}
      >
        <p
          className="font-display italic leading-[1.05] tracking-[-0.01em]"
          style={{ fontSize: layout.size }}
          aria-hidden="true"
        >
          {layout.lines.map((line, li) => (
            <span key={li} className="block whitespace-nowrap text-center">
              {line.map((wi, k) => (
                <span key={wi}>
                  <span
                    ref={(el) => {
                      words.current[wi] = el;
                    }}
                    className="inline-block will-change-transform"
                  >
                    {WORDS[wi]}
                  </span>
                  {k < line.length - 1 && " "}
                </span>
              ))}
            </span>
          ))}
        </p>
        <span ref={cue} className="label mt-12 text-sand/70">
          Role para baixo ↓
        </span>
      </div>

      {/* medição invisível, no mesmo estilo do texto */}
      <div
        ref={measure}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre font-display italic"
        style={{ fontSize: 100 }}
      >
        {WORDS.map((w) => (
          <span key={w} data-w>
            {w}
          </span>
        ))}
        <span data-space> </span>
      </div>
    </section>
  );
}
