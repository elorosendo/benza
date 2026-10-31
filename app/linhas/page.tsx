import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatCount, getLines, linePhotoAlt, lineCopy, productsInLine } from "@/lib/catalog";

export const metadata: Metadata = { title: "(Linhas) — BENZA" };

export default function LinhasPage() {
  const lines = getLines();
  return (
    <main className="bg-ink text-sand">
      <section className="container-benza pb-10 pt-12 sm:pt-16">
        <span className="chip label self-start text-accent">Um sistema, quatro climas</span>
        <h1 className="mt-4 text-[clamp(56px,7vw,110px)] font-medium leading-[0.9]">
          As quatro <em>(linhas)</em>
        </h1>
        <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-sand-muted">
          Uma camada editorial por cima das categorias: escolha pelo momento, não pela prateleira.
        </p>
      </section>

      {lines.map((l) => {
        const accent = l.slug === "penumbra" || l.slug === "mata";
        return (
          <section key={l.slug} data-line={l.slug} className="bg-line-bg text-line-text">
            <div className="container-benza grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-brand bg-line-tone">
                <Image
                  src={`/assets/photos/${l.photo}`}
                  alt={linePhotoAlt[l.slug]}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-5">
                <span className="label text-line-accent">N°{l.number} · {l.moment}</span>
                <h2 className={`text-[clamp(56px,7vw,96px)] font-medium leading-[0.9] ${accent ? "text-line-accent" : ""}`}>
                  {l.name}
                </h2>
                <p className="font-brand text-[22px] italic text-sand-muted">({lineCopy[l.slug].poem})</p>
                <p className="max-w-[460px] text-[17px] leading-relaxed">{lineCopy[l.slug].description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link href={`/linhas/${l.slug}`} className="btn bg-line-accent text-line-bg hover:opacity-90">
                    Ver a linha →
                  </Link>
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
