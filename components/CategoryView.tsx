import Link from "@/components/Link";
import { notFound } from "next/navigation";
import {
  categoryHref,
  categoryProducts,
  filterProducts,
  formatCount,
  getBodyParts,
  getCategory,
  getLines,
  priceRanges,
  subCategoryHref,
  type FilterParams,
} from "@/lib/catalog";
import { Filters, type FilterGroup } from "./Filters";
import { ProductGrid } from "./ProductGrid";
import { Emphasis } from "./Emphasis";
import { getT } from "@/lib/i18n/server";

export async function CategoryView({
  slug,
  sub,
  filters,
}: {
  slug: string;
  sub?: string;
  filters: FilterParams;
}) {
  const t = await getT();
  const category = getCategory(slug);
  if (!category) notFound();
  const subs = category.groups?.flatMap((g) => g.children).filter((s) => s.slug !== "approved") ?? [];
  const current = sub ? subs.find((s) => s.slug === sub) : undefined;
  if (sub && !current) notFound();

  const base = categoryProducts(slug, sub);
  const products = filterProducts(base, { ...filters, sub: sub ?? filters.sub });

  const groups: FilterGroup[] = [];
  if (!sub && subs.length) {
    groups.push({ key: "sub", label: t("Categoria"), options: subs.map((s) => ({ slug: s.slug, label: t(s.name) })) });
  }
  groups.push(
    { key: "corpo", label: t("Corpo"), options: getBodyParts().map((b) => ({ slug: b.slug, label: t(b.name) })) },
    { key: "linha", label: t("Linha"), options: getLines().map((l) => ({ slug: l.slug, label: l.name })) },
    { key: "preco", label: t("Preço"), options: priceRanges.map((r) => ({ slug: r.slug, label: t(r.label) })) },
    { key: "approved", label: t("Seleção"), options: [{ slug: "1", label: t("Só Approved ✓") }] },
  );

  const title = t(current?.name ?? category.name);

  return (
    <main>
      <section className="bg-ink text-sand">
        <div className="container-benza flex flex-col gap-6 pb-20 pt-14 sm:pb-28">
          <nav aria-label={t("Você está em")} className="label text-sand/70">
            <Link href="/" className="hover:text-accent">{t("Início")}</Link>
            {" / "}
            {current ? (
              <>
                <Link href={categoryHref(slug)} className="hover:text-accent">{t(category.name)}</Link>
                {" / "}
                <span className="text-sand">{t(current.name)}</span>
              </>
            ) : (
              <span className="text-sand">{t(category.name)}</span>
            )}
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-[clamp(56px,6.4vw,96px)] font-medium leading-[0.92]">
              <Emphasis text={title} />
            </h1>
            <span className="label text-accent">{formatCount(products.length)} produtos</span>
          </div>
          {!sub && subs.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[15px] text-sand-muted">
              {subs.map((s) => (
                <Link key={s.slug} href={subCategoryHref(slug, s.slug)} className="inline-flex min-h-[var(--tap)] items-center hover:text-accent">
                  {t(s.name)}
                </Link>
              ))}
            </div>
          )}
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
