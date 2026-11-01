import type { Metadata } from "next";
import Link from "@/components/Link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  filterProducts,
  formatCount,
  getBodyPart,
  getBodyParts,
  getLines,
  getProducts,
  priceRanges,
  type FilterParams,
} from "@/lib/catalog";
import { Filters, type FilterGroup } from "@/components/Filters";
import { ProductGrid } from "@/components/ProductGrid";
import { getT } from "@/lib/i18n/server";

export function generateStaticParams() {
  return getBodyParts().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const part = getBodyPart((await params).slug);
  const t = await getT();
  return { title: part ? `${t(part.name)} — benza` : "benza" };
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<FilterParams>;
};

export default function BodyPage(props: Props) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  );
}

async function Content({ params, searchParams }: Props) {
  const t = await getT();
  const [{ slug }, filters] = await Promise.all([params, searchParams]);
  const part = getBodyPart(slug);
  if (!part) notFound();

  const products = filterProducts(
    getProducts().filter((p) => p.body.includes(slug)),
    filters,
  );
  const groups: FilterGroup[] = [
    { key: "linha", label: t("Linha"), options: getLines().map((l) => ({ slug: l.slug, label: l.name })) },
    { key: "preco", label: t("Preço"), options: priceRanges.map((r) => ({ slug: r.slug, label: t(r.label) })) },
    { key: "approved", label: t("Seleção"), options: [{ slug: "1", label: t("Só Approved ✓") }] },
  ];

  return (
    <main>
      <section data-line="mata" className="bg-line-bg text-sand">
        <div className="container-benza flex flex-col gap-6 pb-20 pt-14 sm:pb-28">
          <nav aria-label={t("Você está em")} className="label text-sand/70">
            <Link href="/" className="hover:text-accent">{t("Início")}</Link>
            {" / "}
            <Link href="/corpo" className="hover:text-accent">{t("Por corpo")}</Link>
            {" / "}
            <span className="text-sand">{t(part.name)}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-[clamp(56px,6.4vw,96px)] font-medium leading-[0.92]">{t(part.name)}</h1>
            <span className="label text-accent">{formatCount(products.length)} produtos</span>
          </div>
          <div className="flex flex-wrap gap-x-6 text-[15px] text-sand-muted">
            {getBodyParts().filter((b) => b.slug !== slug).map((b) => (
              <Link key={b.slug} href={`/corpo/${b.slug}`} className="inline-flex min-h-[var(--tap)] items-center hover:text-accent">
                {t(b.name)}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-cream-deep text-ink">
        <div className="container-benza flex flex-col gap-8 py-16 sm:py-24">
          <Filters groups={groups} />
          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}
