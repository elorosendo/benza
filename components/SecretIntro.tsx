"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/client";
import { TarotCard } from "./TarotCard";

const WORDS = ["the", "good", "kind", "of", "secret"];

type Layout = { lines: number[][]; size: number };

// "the good kind of secret" em Gaya Italic, na largura toda; cada palavra acende em sequência após a abertura do cartão.
export function SecretIntro() {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [revealed, setRevealed] = useState(false);
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

  // Abertura automática: o cartão fica no centro (sem menu) e, depois de um instante ou no primeiro gesto
  // de scroll, sobe e dá lugar à frase e ao menu.
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduce);
    if (reduce || window.scrollY > 40) {
      root.dataset.intro = "done";
      setRevealed(true);
      return () => void delete root.dataset.intro;
    }
    root.dataset.intro = "hold";
    root.style.overflow = "hidden";
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      root.style.overflow = "";
      root.dataset.intro = "done";
      setRevealed(true);
    };
    const timer = window.setTimeout(go, 1800);
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, go));
      root.style.overflow = "";
      delete root.dataset.intro;
    };
  }, []);

  const ease = "cubic-bezier(0.65, 0, 0.25, 1)";
  const soft = "cubic-bezier(0.22, 1, 0.36, 1)";
  const out = reduced ? "none" : `transform 1.9s ${ease}, opacity 1.1s ease 0.5s`;

  return (
    <section
      ref={section}
      data-no-reveal
      aria-label="the good kind of secret"
      className="relative overflow-hidden bg-ink text-red"
    >
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <div
          className="absolute inset-0 flex items-center justify-center will-change-transform"
          style={{
            transform: revealed ? "translateY(-115vh) scale(0.94)" : "none",
            opacity: revealed ? 0 : 1,
            transition: out,
          }}
        >
          <TarotCard
            name="benzacard"
            alt="benza"
            width="min(40vh, 72vw, 320px)"
            rest={7}
            tiltZone="self"
            priority
          />
        </div>
        <div
          className="relative will-change-transform"
          style={{
            transform: revealed || reduced ? "none" : "translateY(32vh)",
            opacity: revealed || reduced ? 1 : 0,
            transition: reduced ? "none" : `transform 2s ${soft} 0.3s, opacity 1.3s ease 0.6s`,
          }}
        >
          <p
            className="font-brand italic leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: layout.size }}
            aria-hidden="true"
          >
            {layout.lines.map((line, li) => (
              <span key={li} className="block whitespace-nowrap text-center">
                {line.map((wi, k) => (
                  <span key={wi}>
                    <span
                      className="inline-block will-change-transform"
                      style={{
                        opacity: revealed || reduced ? 1 : 0.22,
                        transform: revealed || reduced ? "none" : "translateY(0.22em)",
                        transition: reduced ? "none" : `opacity 1s ease ${1.3 + wi * 0.2}s, transform 1s ${soft} ${1.3 + wi * 0.2}s`,
                      }}
                    >
                      {WORDS[wi]}
                    </span>
                    {k < line.length - 1 && " "}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>
        <span
          className="label absolute bottom-10 text-sand/70 transition-opacity duration-500"
          style={{ opacity: revealed ? 0 : 1 }}
        >
          {t("Role para baixo ↓")}
        </span>
      </div>

      {/* medição invisível, no mesmo estilo do texto */}
      <div
        ref={measure}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre font-brand italic"
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
