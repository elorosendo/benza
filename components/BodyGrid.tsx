import Link from "next/link";
import { countInBody, formatCount, type Category } from "@/lib/catalog";

// "Conheça (o seu) corpo" (SiteV3).
export function BodyGrid({ category, tone = "deep", asH1 = false }: { category: Category; tone?: "deep" | "cream"; asH1?: boolean }) {
  const Heading = asH1 ? "h1" : "h2";
  const bg = tone === "cream" ? "bg-cream" : "bg-cream-deep";
  
  const parts = category.groups?.flatMap((g) => g.children) ?? [];
  return (
    <section className={`${bg} text-ink`}>
      <div className="container-benza py-16 sm:py-24">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <Heading className="text-[clamp(56px,7vw,110px)] font-medium uppercase leading-[0.88]">
            Conheça <em className="normal-case">(o seu)</em> corpo
          </Heading>
          <p className="max-w-[460px] text-[17px] leading-relaxed">
            Comece pelo corpo, não pela prateleira. Cada parte leva aos produtos aprovados e a um guia do Diário escrito sem vergonha e sem jargão.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-brand border border-ink/25 bg-ink/25 sm:grid-cols-2 lg:grid-cols-4">
          {parts.map((p) => (
            <Link
              key={p.slug}
              href={`/corpo/${p.slug}`}
              className={`part flex min-h-[120px] items-end justify-between ${bg} p-[22px] sm:min-h-[150px]`}
            >
              <span className="part-t title-brown font-display text-[34px] leading-none">{p.name}</span>
              <span className="part-n font-mono text-[11px]">{formatCount(countInBody(p.slug))}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
