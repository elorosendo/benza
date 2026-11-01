"use client";

import Link from "@/components/Link";
import { categoryHref, type Category, type Line } from "@/lib/catalog";
import { Wordmark, Tagline } from "./Wordmark";
import { socialLinks } from "@/lib/socialLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useHomeVariant } from "@/lib/useHomeVariant";
import { useT } from "@/lib/i18n/client";

export function Footer({
  categories,
  lines,
}: {
  categories: Category[];
  lines: Line[];
}) {
  const t = useT();
  const variant = useHomeVariant();
  const bg = variant === 3 ? "bg-olive" : "";
  const link = "inline-flex min-h-[var(--tap)] items-center hover:text-accent lg:min-h-0";
  const title = "label text-accent";
  return (
    <footer className={`border-t border-[var(--sand-line)] ${bg}`}>
      <div className="container-benza grid grid-cols-2 gap-9 pb-12 pt-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
          <div className="self-start">
            <Wordmark height={30} />
          </div>
          <Tagline width={150} />
          <ul className="flex flex-wrap gap-x-4">
            {socialLinks.map((s) => (
              <li key={s.platform}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label={t("Loja")} className="flex flex-col gap-1 lg:gap-2">
          <span className={title}>{t("Loja")}</span>
          {categories.map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className={link}>
              {t(c.name)}
            </Link>
          ))}
        </nav>
        <nav aria-label={t("Linhas")} className="flex flex-col gap-1 lg:gap-2">
          <span className={title}>{t("Linhas")}</span>
          {lines.map((l) => (
            <Link key={l.slug} href={`/linhas/${l.slug}`} className={link}>
              {l.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="BENZA" className="flex flex-col gap-1 lg:gap-2">
          <span className={title}>BENZA</span>
          <Link href="/ask-benza" className={link}>{t("Ask Benza")}</Link>
          <Link href="/approved" className={link}>{t("Como aprovamos")}</Link>
          <Link href="/sobre" className={link}>{t("Sobre")}</Link>
          <Link href="/quiz" className={link}>{t("Quiz")}</Link>
          <Link href="/comunidade" className={link}>{t("Comunidade")}</Link>
          <Link href="/aplicacoes" className={link}>{t("Aplicações")}</Link>
          <Link href="/sobre#envio" className={link}>{t("Envio discreto")}</Link>
        </nav>
      </div>
      <div className="container-benza flex flex-wrap items-center justify-between gap-4 border-t border-[var(--sand-line)] py-5 text-sm">
        <LanguageSwitcher variant="list" />
      </div>
    </footer>
  );
}
