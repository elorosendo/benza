import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatPrice,
  getBodyPart,
  getLine,
  getProduct,
  getProducts,
  getSubCategoryName,
  relatedProducts,
  categoryHref,
} from "@/lib/catalog";
import { AddToBag } from "@/components/AddToBag";
import { ApprovedBadge } from "@/components/ApprovedBadge";
import { ProductGrid } from "@/components/ProductGrid";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p ? `${p.name} — benza` : "benza" };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const line = getLine(product.line)!;
  const subName = getSubCategoryName(product.category);
  const related = relatedProducts(product);
  const bodyParts = product.body.map((b) => getBodyPart(b)).filter(Boolean);
  const { review, specs } = product;

  return (
    <main data-line={product.line} className="bg-line-bg text-line-text">
      <div className="container-benza grid gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-16">
        {/* Galeria */}
        <div className="grid gap-3">
          {(product.images.length ? product.images : [null]).map((src, i) => (
            <div
              key={i}
              className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-brand bg-line-tone font-mono text-[11px] text-sand/60"
            >
              {src ? (
                <Image
                  src={src}
                  alt={`${product.name}, ${subName ?? "produto"}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                "[FOTO]"
              )}
              {i === 0 && product.approved && <ApprovedBadge />}
            </div>
          ))}
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <nav aria-label="Você está em" className="label text-sand/70">
            <Link href="/" className="hover:text-accent">Início</Link>
            {" / "}
            <Link href={categoryHref(product.category)} className="hover:text-accent">{subName}</Link>
          </nav>
          <div className="flex flex-col gap-3">
            <span className="text-sm text-sand-muted">{product.brand}</span>
            <h1 className="text-[clamp(44px,5vw,72px)] font-medium leading-[0.95]">{product.name}</h1>
            <span className="font-mono text-lg">{formatPrice(product.price)}</span>
          </div>
          <p className="max-w-[460px] text-[17px] leading-relaxed">{product.summary}</p>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/linhas/${line.slug}`}
              className="inline-flex min-h-[var(--tap)] items-center rounded-pill border border-line-accent px-4 text-sm text-line-accent hover:bg-line-accent hover:text-line-bg"
            >
              N°{line.number} · {line.name}
            </Link>
            {bodyParts.map((b) => (
              <Link
                key={b!.slug}
                href={`/corpo/${b!.slug}`}
                className="inline-flex min-h-[var(--tap)] items-center rounded-pill border border-sand/30 px-4 text-sm hover:border-sand"
              >
                {b!.name}
              </Link>
            ))}
          </div>

          <AddToBag slug={product.slug} />
          <p className="label text-sand/70">Envio discreto · embalagem sem marca</p>

          {/* Detalhes */}
          <div className="mt-2 border-t border-sand/15">
            {[
              ["Material", specs.material],
              ["Tamanho", specs.size],
              ["Cuidados", specs.care],
            ].map(([title, text]) => (
              <details key={title} className="group border-b border-sand/15">
                <summary className="flex min-h-[var(--tap)] cursor-pointer list-none items-center justify-between font-display text-2xl">
                  {title}
                  <span aria-hidden="true" className="font-mono text-sm text-line-accent group-open:hidden">+</span>
                  <span aria-hidden="true" className="hidden font-mono text-sm text-line-accent group-open:inline">−</span>
                </summary>
                <p className="pb-4 text-[15px] leading-relaxed text-sand-muted">{text}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Review BENZA Approved */}
      {product.approved && (
        <section className="bg-cream text-ink">
          <div className="container-benza py-16 sm:py-24">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
                A review <em className="text-accent-dark">benza approved</em>
              </h2>
              <span className="label text-accent-dark">
                Testado por {review.testedBy} durante {review.testedFor}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["O que funciona", review.works, "✓"],
                ["O que não funciona", review.doesnt, "×"],
              ].map(([title, items, mark]) => (
                <div key={title as string} className="flex flex-col gap-5 rounded-brand bg-cream-deep p-6 sm:p-8">
                  <h3 className="text-3xl leading-none">{title as string}</h3>
                  <ul className="flex flex-col gap-3">
                    {(items as string[]).map((t) => (
                      <li key={t} className="flex gap-3 text-[17px] leading-snug">
                        <span aria-hidden="true" className="font-mono text-accent-dark">{mark as string}</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Combina com */}
      {related.length > 0 && (
        <section className="container-benza py-16 sm:py-24">
          <h2 className="mb-8 text-[clamp(40px,4vw,56px)] font-medium leading-none">
            Combina <em>com</em>
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  );
}
