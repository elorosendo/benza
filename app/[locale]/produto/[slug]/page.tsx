import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/Link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  formatPrice,
  getBodyPart,
  getProductsWithParent,
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
import { VideoCard } from "@/components/VideoCard";
import { AiChat } from "@/components/AiChat";
import { productQuestions } from "@/lib/aiMock";
import { ShareButtons } from "@/components/ShareButtons";
import { reviewsForProduct, toCardData } from "@/lib/social";
import { getLocale, getT } from "@/lib/i18n/server";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  const t = await getT();
  return { title: p ? `${t(p.name)} — benza` : "benza" };
}

export default function ProductPage(props: Props) {
  return (
    <Suspense>
      <ProductContent {...props} />
    </Suspense>
  );
}

async function ProductContent({ params }: Props) {
  const t = await getT();
  const locale = await getLocale();
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const line = getLine(product.line)!;
  const subName = getSubCategoryName(product.category);
  const related = relatedProducts(product);
  const bodyParts = product.body.map((b) => getBodyPart(b)).filter(Boolean);
  const { review, specs } = product;
  const videos = reviewsForProduct(product.slug).map(toCardData);

  return (
    <main data-line={product.line} className="bg-line-bg text-line-text">
      <div className="container-benza grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
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
                  alt={`${t(product.name)}, ${subName ? t(subName) : t("produto")}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                t("[FOTO]")
              )}
              {i === 0 && product.approved && <ApprovedBadge />}
            </div>
          ))}
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <nav aria-label={t("Você está em")} className="label text-sand/70">
            <Link href="/" className="hover:text-accent">{t("Início")}</Link>
            {" / "}
            <Link href={categoryHref(product.category)} className="hover:text-accent">{subName ? t(subName) : ""}</Link>
          </nav>
          <div className="flex flex-col gap-3">
            <span className="text-sm text-sand-muted">{t(product.brand)}</span>
            <h1 className="text-[clamp(44px,5vw,72px)] font-medium leading-[0.95]">{t(product.name)}</h1>
            <span className="font-mono text-lg">{formatPrice(product.price, locale, t)}</span>
          </div>
          <p className="max-w-[460px] text-[17px] leading-relaxed">{t(product.summary)}</p>

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
                {t(b!.name)}
              </Link>
            ))}
          </div>

          <AddToBag slug={product.slug} />
          <p className="label text-sand/70">{t("Envio discreto · embalagem sem marca")}</p>

          {/* Detalhes */}
          <div className="mt-2 border-t border-sand/15">
            {[
              [t("Material"), specs.material],
              [t("Tamanho"), specs.size],
              [t("Cuidados"), specs.care],
            ].map(([title, text]) => (
              <details key={title} className="group border-b border-sand/15">
                <summary className="flex min-h-[var(--tap)] cursor-pointer list-none items-center justify-between font-display text-2xl">
                  {title}
                  <span aria-hidden="true" className="font-mono text-sm text-line-accent group-open:hidden">+</span>
                  <span aria-hidden="true" className="hidden font-mono text-sm text-line-accent group-open:inline">−</span>
                </summary>
                <p className="pb-4 text-[15px] leading-relaxed text-sand-muted">{t(text)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Pergunte à IA (simulada) */}
      <section className="border-t border-sand/15">
        <div className="container-benza grid gap-10 py-20 sm:py-32 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="chip label self-start text-line-accent">{t("IA da benza · protótipo")}</span>
            <h2 className="text-[clamp(36px,3.6vw,52px)] leading-none">
              {t("Pergunte sobre")}{" "}<em>{t("este produto")}</em>
            </h2>
            <p className="text-[17px] leading-relaxed text-sand-muted">{t("Dúvidas rápidas antes de decidir. As respostas vêm só dos dados e das reviews da benza.")}</p>
            <Link href={`/comparar?a=${product.slug}`} className="btn self-start border border-sand/60 hover:bg-sand hover:text-ink">
              {t("Comparar com outro produto")}
            </Link>
          </div>
          <AiChat
            mode="product"
            product={getProductsWithParent().find((p) => p.slug === product.slug)}
            products={getProductsWithParent()}
            suggestions={productQuestions}
            placeholder={t("Pergunte sobre este produto…")}
          />
        </div>
      </section>

      {/* Veja o teste */}
      {videos.length > 0 && (
        <section id="teste" className="scroll-mt-8 border-t border-sand/15">
          <div className="container-benza grid items-center gap-10 py-20 sm:py-36 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
            <div className="mx-auto w-full max-w-[320px] lg:mx-0">
              {videos.slice(0, 1).map((v) => (
                <VideoCard key={v.id} review={v} />
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <span className="label text-line-accent">{t("[ Testado pela comunidade ]")}</span>
              <h2 className="text-[clamp(40px,4vw,56px)] leading-none">
                {t("Veja o")}{" "}<em>{t("teste")}</em>
              </h2>
              {videos.map((v) => (
                <figure key={v.id} className="flex max-w-[520px] flex-col gap-2 border-l border-line-accent pl-5">
                  <blockquote className="text-2xl leading-snug">“{t(v.quote)}”</blockquote>
                  <figcaption className="label text-sand/70">
                    {t("{tester} · {handle} · testou por {time}", { tester: t(v.tester), handle: t(v.handle), time: t(v.testedFor) })}
                  </figcaption>
                </figure>
              ))}
              <ShareButtons path={`/produto/${product.slug}`} text={t("{name} · testado pela comunidade benza.", { name: t(product.name) })} />
            </div>
          </div>
        </section>
      )}

      {/* Review BENZA Approved */}
      {product.approved && (
        <section className="bg-cream text-ink">
          <div className="container-benza py-24 sm:py-40">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
                {t("A review")}{" "}<em className="text-accent-dark">benza approved</em>
              </h2>
              <span className="label text-accent-dark">
                {t("Testado por {tester} durante {time}", { tester: t(review.testedBy), time: t(review.testedFor) })}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [t("O que funciona"), review.works, "✓"],
                [t("O que não funciona"), review.doesnt, "×"],
              ].map(([title, items, mark]) => (
                <div key={title as string} className="flex flex-col gap-5 rounded-brand bg-cream-deep p-6 sm:p-8">
                  <h3 className="text-3xl leading-none">{title as string}</h3>
                  <ul className="flex flex-col gap-3">
                    {(items as string[]).map((item) => (
                      <li key={item} className="flex gap-3 text-[17px] leading-snug">
                        <span aria-hidden="true" className="font-mono text-accent-dark">{mark as string}</span>
                        {t(item)}
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
        <section className="container-benza py-24 sm:py-40">
          <h2 className="mb-8 text-[clamp(40px,4vw,56px)] font-medium leading-none">
            {t("Combina")}{" "}<em>{t("com")}</em>
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  );
}
