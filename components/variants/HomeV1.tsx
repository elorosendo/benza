import Image from "next/image";
import Link from "next/link";
import {
  categoryHref,
  countInCategory,
  formatCount,
  formatPrice,
  getApprovedCount,
  getCategories,
  getLines,
  getProducts,
  photoAlt,
  getLine,
} from "@/lib/catalog";
import { Tagline } from "../Wordmark";

// V1 — Noite (base Penumbra). O header com mega menu vem do layout.
export function HomeV1() {
  const categories = getCategories().filter((c) => c.groups?.length);
  const body = categories.find((c) => c.slug === "por-corpo")!;
  const bodyParts = body.groups!.flatMap((g) => g.children);
  const lines = getLines();
  const approved = getProducts().filter((p) => p.approved).slice(0, 4);
  const penumbra = getLine("penumbra")!;
  const accentTitle = new Set(["penumbra", "mata"]);

  return (
    <main className="bg-ink text-sand">
      {/* Hero */}
      <section data-line="penumbra" className="relative h-[640px] overflow-hidden bg-line-tone lg:h-[760px]">
        <Image
          src="/assets/photos/couple.jpg"
          alt="Duas pessoas com rostos próximos"
          fill
          priority
          sizes="100vw"
          className="object-cover [object-position:center_30%]"
        />
        <div className="absolute inset-0 bg-ink/[0.38]" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-benza flex flex-wrap items-end justify-between gap-8 pb-12 lg:pb-16">
            <div className="w-[min(360px,70vw)]">
              <Tagline width={360} className="text-white" />
            </div>
            <div className="flex max-w-[400px] flex-col gap-[18px]">
              <span className="label text-accent">Linha N°1 · {penumbra.name}</span>
              <p className="font-display text-[34px] leading-[1.1]">
                Marketplace curado de sex wellness. Escolhemos, testamos, aprovamos.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/linhas/penumbra" className="btn bg-red text-white hover:opacity-90">
                  Explorar Penumbra
                </Link>
                <Link href="/approved" className="btn border border-sand/60 hover:bg-sand hover:text-ink">
                  Como aprovamos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprar por categoria */}
      <section className="container-benza pb-12 pt-16 sm:pt-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
            Comprar por <em className="text-accent">categoria</em>
          </h2>
          <Link href="/categoria/prazer" className="label inline-flex min-h-[var(--tap)] items-center hover:text-accent">
            Ver tudo →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const count = c.slug === "por-corpo" ? bodyParts.length : countInCategory(c.slug);
            return (
              <Link
                key={c.slug}
                href={categoryHref(c.slug)}
                className="group relative block h-[360px] overflow-hidden rounded-brand bg-burgundy lg:h-[440px]"
              >
                {c.photo && (
                  <Image
                    src={`/assets/photos/${c.photo}`}
                    alt={photoAlt[c.photo] ?? ""}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between rounded-xl bg-ink p-[18px]">
                  <span className="font-display text-[30px] leading-none">{c.name}</span>
                  <span className="font-mono text-[11px] text-accent">{formatCount(count)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Por corpo — chips */}
      <section className="container-benza pb-16 sm:pb-24">
        <div className="flex flex-wrap items-center gap-2.5 border-t border-[var(--sand-line)] pt-7">
          <span className="label mr-3.5 text-accent">Encontre pelo corpo</span>
          {bodyParts.map((p) => (
            <Link
              key={p.slug}
              href={`/corpo/${p.slug}`}
              className="inline-flex min-h-[var(--tap)] items-center rounded-pill border border-sand/30 px-5 text-[15px] hover:border-accent hover:text-accent"
            >
              {p.name}
            </Link>
          ))}
        </div>
      </section>

      {/* As 4 linhas */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4">
        {lines.map((l) => (
          <Link
            key={l.slug}
            href={`/linhas/${l.slug}`}
            data-line={l.slug}
            className={`flex min-h-[320px] flex-col justify-between gap-6 p-8 text-line-text hover:brightness-110 lg:min-h-[420px] lg:p-10 ${
              l.slug === "penumbra" ? "bg-line-tone" : "bg-line-bg"
            }`}
          >
            <span className="label text-line-accent">
              N°{l.number} · {l.moment}
            </span>
            <div className="flex flex-col gap-2.5">
              <span className={`font-display text-[52px] leading-[0.95] ${accentTitle.has(l.slug) ? "text-line-accent" : ""}`}>
                {l.name}
              </span>
              <span className="text-[15px] leading-normal text-sand-muted">{l.blurb}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* BENZA Approved */}
      <section className="container-benza py-16 sm:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
            BENZA <em className="text-accent">Approved</em>
          </h2>
          <span className="label text-sand/70">{formatCount(getApprovedCount())} aprovados</span>
        </div>
        <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {approved.map((p) => (
            <Link key={p.slug} href={`/produto/${p.slug}`} className="group flex flex-col gap-2.5">
              <div className="flex aspect-[4/5] items-center justify-center rounded-brand bg-burgundy font-mono text-[11px] text-sand/55">
                [FOTO]
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
                ✓ Approved · {getLine(p.line)?.name}
              </span>
              <span className="font-display text-2xl leading-[1.1] group-hover:underline">{p.name}</span>
              <span className="font-mono text-[13px]">{formatPrice(p.price)}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
