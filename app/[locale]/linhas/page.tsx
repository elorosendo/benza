import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/Link";
import { formatCount, getLines, linePhotoAlt, lineCopy, productsInLine } from "@/lib/catalog";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("(Linhas) — BENZA") };
}

export default async function LinhasPage() {
  const t = await getT();
  const lines = getLines();
  return (
    <main className="bg-ink text-sand">
      <section className="container-benza pb-10 pt-16 sm:pt-28">
        <span className="chip label self-start text-accent">{t("Um sistema, quatro climas")}</span>
        <h1 className="mt-4 text-[clamp(56px,7vw,110px)] font-medium leading-[0.9]">
          {t("As quatro")}{" "}<em>{t("(linhas)")}</em>
        </h1>
        <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-sand-muted">
          {t("Uma camada editorial por cima das categorias: escolha pelo momento, não pela prateleira.")}</p>
      </section>

      {lines.map((l) => {
        const accent = l.slug === "penumbra" || l.slug === "mata";
        return (
          <section key={l.slug} data-line={l.slug} className="bg-line-bg text-line-text">
            <div className="container-benza grid items-center gap-8 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-brand bg-line-tone">
                <Image
                  src={`/assets/photos/${l.photo}`}
                  alt={t(linePhotoAlt[l.slug])}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-5">
                <span className="label text-line-accent">N°{l.number} · {t(l.moment)}</span>
                <h2 className={`text-[clamp(56px,7vw,96px)] font-medium leading-[0.9] ${accent ? "text-line-accent" : ""}`}>
                  {l.name}
                </h2>
                <p className="font-brand text-[22px] italic text-sand-muted">({t(lineCopy[l.slug].poem)})</p>
                <p className="max-w-[460px] text-[17px] leading-relaxed">{t(lineCopy[l.slug].description)}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link href={`/linhas/${l.slug}`} className="btn bg-line-accent text-line-bg hover:opacity-90">
                    {t("Ver a linha →")}</Link>
                  <span className="label text-line-accent">{formatCount(productsInLine(l.slug).length)} produtos</span>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
