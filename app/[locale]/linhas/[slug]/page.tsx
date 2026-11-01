import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/Link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  formatCount,
  getLine,
  getLines,
  lineCopy,
  linePhotoAlt,
  productsInLine,
  type LineSlug,
} from "@/lib/catalog";
import { ProductGrid } from "@/components/ProductGrid";
import { Tagline } from "@/components/Wordmark";
import { getT } from "@/lib/i18n/server";

export function generateStaticParams() {
  return getLines().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const line = getLine((await params).slug);
  return { title: line ? `${line.name} — benza` : "benza" };
}

export default function LinePage(props: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <LineContent {...props} />
    </Suspense>
  );
}

async function LineContent({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getT();
  const line = getLine((await params).slug);
  if (!line) notFound();
  const copy = lineCopy[line.slug as LineSlug];
  const products = productsInLine(line.slug);
  const others = getLines().filter((l) => l.slug !== line.slug);
  const accentTitle = line.slug === "penumbra" || line.slug === "mata";

  return (
    <main data-line={line.slug} className="bg-line-bg text-line-text">
      <section className="relative overflow-hidden">
        <Image
          src={`/assets/photos/${line.photo}`}
          alt={t(linePhotoAlt[line.slug as LineSlug])}
          fill
          priority
          sizes="100vw"
          data-parallax="0.1"
          className="scale-[1.2] object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-line-bg via-line-bg/40 to-transparent" />
        <div className="container-benza relative flex min-h-[640px] flex-col justify-end gap-5 pb-16 pt-24 lg:min-h-[820px]">
          <span className="label text-line-accent">N°{line.number} · {t(line.moment)}</span>
          <h1 className={`text-[clamp(72px,10vw,160px)] font-medium leading-[0.88] ${accentTitle ? "text-line-accent" : ""}`}>
            {line.name}
          </h1>
          <p className="font-brand text-2xl italic">({t(copy.poem)})</p>
          <p className="max-w-[520px] text-[17px] leading-relaxed">{t(copy.description)}</p>
        </div>
      </section>

      <section className="container-benza py-20 sm:py-32">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(32px,3.4vw,48px)] font-medium leading-none">
            {t(copy.cta)}
          </h2>
          <span className="label text-line-accent">{formatCount(products.length)} produtos</span>
        </div>
        <ProductGrid products={products} />
      </section>

      <section className="border-t border-sand/15">
        <div className="container-benza grid items-center gap-8 py-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <Tagline width={200} className="text-line-accent" />
          <div className="flex flex-col">
            <span className="label mb-3 text-line-accent">{t("Outras linhas")}</span>
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/linhas/${o.slug}`}
                className="flex min-h-[var(--tap)] flex-wrap items-center justify-between gap-2 border-t border-sand/15 py-3 hover:text-line-accent"
              >
                <span className="font-display text-4xl leading-none">{o.name}</span>
                <span className="label">N°{o.number} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
