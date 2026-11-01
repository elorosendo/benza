"use client";

import { useEffect } from "react";

// Animações de rolagem: seções que sobem e aparecem, filhos em cascata e parallax leve nas fotos.
// Só esconde o que está abaixo da dobra ao carregar, para não haver "piscada" de conteúdo.
function hasBackground(el: HTMLElement) {
  const cs = getComputedStyle(el);
  const color = cs.backgroundColor;
  const transparent = color === "rgba(0, 0, 0, 0)" || color === "transparent";
  return !transparent || cs.backgroundImage !== "none";
}

// Filhos que podem se mover: em fluxo normal e sem fundo próprio (senão desce um nível).
function collectTargets(parent: HTMLElement, depth: number): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const child of Array.from(parent.children)) {
    if (!(child instanceof HTMLElement)) continue;
    const pos = getComputedStyle(child).position;
    if (pos === "absolute" || pos === "fixed" || pos === "sticky") continue;
    if (hasBackground(child) && depth < 2) out.push(...collectTargets(child, depth + 1));
    else out.push(child);
  }
  return out;
}

export function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const setup = () => {
      document.querySelectorAll<HTMLElement>("main section").forEach((sec) => {
        if (sec.dataset.revealInit || sec.hasAttribute("data-no-reveal") || sec.parentElement?.closest("section")) return;
        sec.dataset.revealInit = "1";
        const below = sec.getBoundingClientRect().top > window.innerHeight * 0.9;
        if (!below) return;
        sec.classList.add("reveal");
        // anima só o conteúdo: o fundo da seção (e elementos com fundo) fica parado
        collectTargets(sec, 0).forEach((el) => el.classList.add("reveal-item"));
        const groups = sec.querySelectorAll<HTMLElement>(".grid, ul, ol");
        groups.forEach((g) => {
          Array.from(g.children)
            .slice(0, 12)
            .forEach((child, i) => {
              if (!(child instanceof HTMLElement)) return;
              child.classList.add("reveal-child");
              child.style.setProperty("--d", `${120 + i * 80}ms`);
            });
        });
        io.observe(sec);
      });
    };

    let raf = 0;
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; setup(); });
    };
    // Espera a hidratação terminar: mexer no DOM antes disso causa aviso de "hydration mismatch".
    let mo: MutationObserver | undefined;
    const start = window.setTimeout(() => {
      ready = true;
      parallax();
      setup();
      mo = new MutationObserver(schedule);
      mo.observe(document.body, { childList: true, subtree: true });
    }, 1200);

    // parallax: [data-parallax="0.08"] desloca a foto devagar em relação à rolagem
    let pRaf = 0;
    let ready = false; // só depois da hidratação (mesmo motivo do atraso acima)
    const parallax = () => {
      pRaf = 0;
      if (!ready) return;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        const speed = parseFloat(el.dataset.parallax || "0.08");
        const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
    };
    const onScroll = () => {
      if (!pRaf) pRaf = requestAnimationFrame(parallax);
    };
    parallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.clearTimeout(start);
      io.disconnect();
      mo?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (pRaf) cancelAnimationFrame(pRaf);
    };
  }, []);

  return null;
}
