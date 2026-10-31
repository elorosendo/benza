import Image from "next/image";
import Link from "next/link";
import { getCategories, getLines, photoAlt } from "@/lib/catalog";
import { BodyGrid } from "../BodyGrid";
import { AskBenza } from "../AskBenza";
import { Tagline } from "../Wordmark";

const categoryBlurb: Record<string, string> = {
  prazer: "Vibradores, sucção, dildos, anal, a dois",
  "cuidado-intimo": "Skincare íntimo, lubrificantes, higiene",
  "no-clima": "Velas, aromaterapia, massagem, banho",
};

const shortMoment: Record<string, string> = {
  penumbra: "ritual noturno",
  mata: "sozinha primeiro",
  rio: "depois, cuidado",
  brasa: "antes de saber",
};

// V3 — Expressiva (base Mata). Header sem wordmark vem do layout (HeaderAlt).
export function HomeV3() {
  const categories = getCategories();
  const body = categories.find((c) => c.slug === "por-corpo")!;
  const shown = categories.filter((c) => categoryBlurb[c.slug]);
  const lines = getLines();

  return (
    <main data-line="mata" className="bg-olive text-sand">
      {/* Hero: wordmark gigante + colagem */}
      <section className="container-benza relative lg:h-[820px]">
        <h1 className="pt-4 lg:pt-10">
          <Image
            src="/assets/brand/benza-red.svg"
            alt="benza"
            width={1240}
            height={411}
            priority
            className="h-auto w-full"
          />
        </h1>

        <div className="mt-10 grid grid-cols-3 items-start gap-3 lg:contents">
          <Image
            src="/assets/photos/mango.jpg"
            alt="Boca mordendo manga verde, anéis dourados"
            width={300}
            height={360}
            className="h-[220px] w-full -rotate-[4deg] rounded-brand object-cover lg:absolute lg:left-[8%] lg:top-[340px] lg:h-[360px] lg:w-[300px]"
          />
          <Image
            src="/assets/photos/forest.jpg"
            alt="Mulher de vestido verde correndo na floresta"
            width={260}
            height={460}
            className="h-[260px] w-full rounded-brand object-cover lg:absolute lg:left-[40%] lg:top-[280px] lg:h-[460px] lg:w-[260px]"
          />
          <Image
            src="/assets/photos/peach.jpg"
            alt="Pêssego com mel escorrendo"
            width={240}
            height={300}
            className="h-[200px] w-full rotate-[5deg] rounded-brand object-cover lg:absolute lg:right-[9%] lg:top-[360px] lg:h-[300px] lg:w-[240px]"
          />
        </div>
        <div className="hidden lg:absolute lg:left-[30%] lg:top-[600px] lg:block"><Tagline width={220} /></div>

        <div className="mt-10 flex flex-col gap-6 pb-12 lg:absolute lg:bottom-10 lg:right-10 lg:mt-0 lg:max-w-[320px] lg:items-end lg:gap-3.5 lg:p-0 lg:text-right">
          <p className="text-[15px] leading-normal">
            Marketplace curado de sex wellness. O que está aqui, está aqui porque a gente escolheu.
          </p>
          <Link
            href="/categoria/prazer"
            className="inline-flex min-h-12 items-center self-start rounded-pill bg-red px-6 text-sm font-semibold text-white hover:opacity-90 lg:self-auto"
          >
            Começar a explorar
          </Link>
        </div>
        <span className="absolute bottom-12 left-10 hidden font-brand text-[26px] italic lg:block">
          (Linha N°2 · Mata)
        </span>
      </section>

      {/* Por corpo */}
      <BodyGrid category={body} tone="cream" />

      {/* Categorias em colunas */}
      <section className="container-benza pb-12 pt-16 sm:pt-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <Link key={c.slug} href={`/categoria/${c.slug}`} className="group flex flex-col gap-3.5">
              <div className="relative h-[320px] overflow-hidden rounded-brand bg-[#2F2610] lg:h-[380px]">
                {c.photo && (
                  <Image
                    src={`/assets/photos/${c.photo}`}
                    alt={photoAlt[c.photo] ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <span className="font-display text-[40px] uppercase leading-none">
                {c.name.includes(" ") ? (
                  <>
                    {c.name.split(" ")[0]} <em className="normal-case">{c.name.split(" ").slice(1).join(" ")}</em>
                  </>
                ) : (
                  c.name
                )}
              </span>
              <span className="text-sm text-sand-muted">{categoryBlurb[c.slug]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Linhas em lista */}
      <section className="container-benza pb-16 pt-12 sm:pb-24">
        <span className="chip label mb-5 text-accent">As linhas</span>
        <div>
          {lines.map((l) => (
            <Link
              key={l.slug}
              href={`/linhas/${l.slug}`}
              data-line={l.slug}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-line-bg px-6 py-6 text-line-text hover:brightness-110 sm:px-8 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-sand/[0.08]"
            >
              <span className={`font-display text-5xl leading-none sm:text-[56px] ${l.slug === "penumbra" || l.slug === "mata" ? "text-line-accent" : ""}`}>
                {l.name}
              </span>
              <span className={`font-brand text-[22px] italic ${l.slug === "rio" || l.slug === "brasa" ? "text-line-accent" : ""}`}>
                ({shortMoment[l.slug]})
              </span>
              <span className="label">N°{l.number} →</span>
            </Link>
          ))}
        </div>
      </section>

      <AskBenza />
    </main>
  );
}
