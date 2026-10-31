import Link from "next/link";
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

export function CategoryView({
  slug,
  sub,
  filters,
}: {
  slug: string;
  sub?: string;
  filters: FilterParams;
}) {
  const category = getCategory(slug);
  if (!category) notFound();
  const subs = category.groups?.flatMap((g) => g.children).filter((s) => s.slug !== "approved") ?? [];
  const current = sub ? subs.find((s) => s.slug === sub) : undefined;
  if (sub && !current) notFound();

  const base = categoryProducts(slug, sub);
  const products = filterProducts(base, { ...filters, sub: sub ?? filters.sub });

  const groups: FilterGroup[] = [];
  if (!sub && subs.length) {
    groups.push({ key: "sub", label: "Categoria", options: subs.map((s) => ({ slug: s.slug, label: s.name })) });
  }
  groups.push(
    { key: "corpo", label: "Corpo", options: getBodyParts().map((b) => ({ slug: b.slug, label: b.name })) },
    { key: "linha", label: "Linha", options: getLines().map((l) => ({ slug: l.slug, label: l.name })) },
    { key: "preco", label: "Preço", options: priceRanges.map((r) => ({ slug: r.slug, label: r.label })) },
    { key: "approved", label: "Seleção", options: [{ slug: "1", label: "Só Approved ✓" }] },
  );

  const title = current?.name ?? category.name;

  return (
    <main>
      <section className="bg-ink text-sand">
        <div className="container-benza flex flex-col gap-6 pb-12 pt-10 sm:pb-16">
          <nav aria-label="Você está em" className="label text-sand/70">
            <Link href="/" className="hover:text-accent">Início</Link>
            {" / "}
            {current ? (
              <>
                <Link href={categoryHref(slug)} className="hover:text-accent">{category.name}</Link>
                {" / "}
                <span className="text-sand">{current.name}</span>
              </>
            ) : (
              <span className="text-sand">{category.name}</span>
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
                  {s.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-cream-deep text-ink">
        <div className="container-benza flex flex-col gap-8 py-10 sm:py-14">
          <Filters groups={groups} />
          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}
