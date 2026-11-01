import Link from "@/components/Link";
import { countInBody, formatCount, type Category } from "@/lib/catalog";
import { getT } from "@/lib/i18n/server";
import { TarotCard, type TarotName } from "./TarotCard";

// Placeholder: todas as partes do corpo usam a mesma carta escura até haver uma ilustração para cada uma.
// Cartas "Negative edition"; as partes sem carta própria alternam entre as duas até haver as demais.
const CARD_BY_SLUG: Record<string, TarotName> = { clitoris: "clitoris-negative", vulva: "vulva-negative" };
const cardFor = (slug: string, i: number): TarotName =>
  CARD_BY_SLUG[slug] ?? (i % 2 ? "clitoris-negative" : "vulva-negative");

// "Conheça (o seu) corpo" (SiteV3).
export async function BodyGrid({ category, tone = "deep", asH1 = false }: { category: Category; tone?: "deep" | "cream"; asH1?: boolean }) {
  const t = await getT();
  const Heading = asH1 ? "h1" : "h2";
  const bg = tone === "cream" ? "bg-cream" : "bg-cream-deep";
  
  const parts = category.groups?.flatMap((g) => g.children) ?? [];
  return (
    <section className={`${bg} text-ink`}>
      <div className="container-benza py-24 sm:py-40">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <Heading className="text-[clamp(56px,7vw,110px)] font-medium uppercase leading-[0.88]">
            {t("Conheça")}{" "}<em className="normal-case">{t("(o seu)")}</em> {" "}{t("corpo")}</Heading>
          <p className="max-w-[460px] text-[17px] leading-relaxed">
            {t("Comece pelo corpo, não pela prateleira. Cada parte leva aos produtos aprovados e a um guia do Diário escrito sem vergonha e sem jargão.")}</p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-brand border border-ink/25 bg-ink/25 sm:grid-cols-2 lg:grid-cols-4">
          {parts.map((p, i) => {
            const card = cardFor(p.slug, i);
            return (
              <Link
                key={p.slug}
                href={`/corpo/${p.slug}`}
                className={`part relative flex min-h-[160px] items-end justify-between overflow-hidden ${bg} p-[26px] sm:min-h-[210px]`}
              >
                {card && (
                  <TarotCard
                    name={card}
                    alt={t("Carta de tarô: {name}", { name: t(p.name) })}
                    width={116}
                    rest={i % 2 ? 4 : -4}
                    floatDelay={i * 0.7}
                    tiltZone="parent-link"
                    className="part-card"
                  />
                )}
                <span className="part-t title-brown font-display text-[34px] leading-none">{t(p.name)}</span>
                <span className="part-n font-mono text-[11px]">{formatCount(countInBody(p.slug))}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
