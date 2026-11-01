"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { splitPath } from "@/lib/i18n/config";
import { useHomeVariant } from "@/lib/useHomeVariant";
import type { Category, Line } from "@/lib/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { HeaderAlt } from "./HeaderAlt";

type Props = {
  categories: Category[];
  lines: Line[];
  menuLines: Record<string, string>;
};

// Escolhe o header conforme a variação da home (?v=). Fora da home, sempre o padrão.
export function ChromeHeader(props: Props) {
  const variant = useHomeVariant();
  const isHome = splitPath(usePathname()).rest === "/";
  // Na home o menu é fixo: troca para o tema claro quando passa sobre fundo claro.
  const watch = isHome && variant !== 2 && variant !== 3;
  useEffect(() => {
    if (!watch) return;
    const root = document.documentElement;
    let raf = 0;
    const luminance = (c: string) => {
      const m = c.match(/[\d.]+/g)?.map(Number);
      if (!m || m.length < 3) return null;
      if (m.length > 3 && m[3] < 0.5) return null;
      return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
    };
    const update = () => {
      raf = 0;
      const chrome = document.querySelector<HTMLElement>(".home-chrome");
      if (!chrome) return;
      const y = Math.max(1, chrome.getBoundingClientRect().height / 2);
      const under = document.elementsFromPoint(window.innerWidth / 2, y).find((el) => !chrome.contains(el));
      let lum: number | null = null;
      for (let el: Element | null = under ?? null; el && lum === null; el = el.parentElement) {
        lum = luminance(getComputedStyle(el).backgroundColor);
      }
      root.dataset.chrome = lum !== null && lum > 0.6 ? "light" : "dark";
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
      delete root.dataset.chrome;
    };
  }, [watch]);

  if (variant === 2 || variant === 3) {
    return <HeaderAlt variant={variant} categories={props.categories} />;
  }
  const chrome = (
    <>
      <AnnouncementBar />
      <Header {...props} />
    </>
  );
  // Na home o menu fica fixo e só aparece depois que o cartão da abertura sai (ver SecretIntro).
  return isHome ? <div className="home-chrome fixed inset-x-0 top-0 z-50">{chrome}</div> : chrome;
}
