import type { Metadata } from "next";
import Link from "@/components/Link";
import { Marquee } from "@/components/Marquee";
import { ZoomImage } from "@/components/ZoomImage";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("aplicações — benza"), description: t("A marca fora da tela: pôsteres, cartões de design review e pranchas de clima.") };
}

const A = "/assets/aplicacoes";

const posters = [
  { src: "poster-oleo", alt: "Pôster: frasco de óleo corporal escorrendo sobre um ombro, com a frase the good kind of secret" },
  { src: "poster-bolsa", alt: "Pôster: necessaire de couro marrom com produtos de cuidado, fundo vinho" },
  { src: "poster-bandeja", alt: "Pôster: bandeja de metal com objetos íntimos sobre fundo terracota" },
  { src: "poster-tipografico", alt: "Pôster tipográfico: the good kind of secret em branco sobre marrom" },
];

const cards = [
  { n: "01", src: "card-01-curated", tag: "The Design Review", title: "Objects of quiet desire", alt: "Cartão 01: quatro objetos íntimos com o selo benza approved" },
  { n: "02", src: "card-02-dame", tag: "Dame — Sex Oil", title: "A darker kind of blue", alt: "Cartão 02: frasco azul-cobalto e preto da Dame" },
  { n: "03", src: "card-03-gender-x", tag: "Gender X — Just the Tip", title: "Clearly sculptural", alt: "Cartão 03: peça de vidro âmbar translúcido" },
  { n: "04", src: "card-04-iroha", tag: "iroha — Kushi Nadeshiko", title: "A little shell appeal", alt: "Cartão 04: objeto rosa com sulcos em forma de concha" },
  { n: "05", src: "card-05-lab46", tag: "LAB46 — Italian Leather", title: "A gloss act.", alt: "Cartão 05: frasco preto brilhante com gel escorrendo" },
  { n: "06", src: "card-06-benza", tag: "benza approved", title: "benza, the good kind of secret", alt: "Cartão 06: quatro produtos lado a lado sob o logo benza" },
];

const boards = [
  { src: "prancha-sensory-story", w: 1800, h: 1732, n: "01", title: "Sensory Story", mood: "warm / tactile / intimate", text: "Pele, óleo, luz quente. A marca pelo toque.", alt: "Prancha Sensory Story: mosaico de fotos, logo benza e selo approved sobre fundo marrom" },
  { src: "prancha-curated-shelf", w: 1800, h: 1732, n: "02", title: "The Curated Shelf", mood: "objects / pairings / small pleasures", text: "Objetos pequenos, bem escolhidos, lado a lado.", alt: "Prancha The Curated Shelf: mosaico de produtos, logo e tagline" },
  { src: "prancha-after-hours", w: 1800, h: 2759, n: "03", title: "After Hours", mood: "low light / close quarters", text: "Meia-luz, pouca distância, nenhuma pressa.", alt: "Prancha After Hours: retrato em close, tagline gigante, logo e produtos" },
];

export default async function AplicacoesPage() {
  const t = await getT();
  return (
    <main className="bg-ink text-sand">
      {/* Abertura */}
      <section className="container-benza flex flex-col gap-8 pb-10 pt-20 sm:pt-32">
        <span className="chip label self-start text-accent">{t("Aplicações")}</span>
        <h1 className="font-brand text-[clamp(64px,13vw,220px)] font-normal italic leading-[0.88] text-red">
          the good kind of secret
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[520px] text-[17px] leading-relaxed text-sand-muted">
            {t("A marca fora da tela: pôsteres, cartões e pranchas. Um mesmo olhar para o detalhe, em escalas diferentes.")}</p>
          <span className="label text-sand/70">{t("13 peças · [conceito]")}</span>
        </div>
      </section>

      {/* Pôsteres */}
      <section className="container-benza pb-24 sm:pb-40">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
            {t("Pôsteres")}{" "}<em>{t("(escala grande)")}</em>
          </h2>
          <span className="label text-accent">[04]</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {posters.map((p, i) => (
            <div key={p.src} className={i % 2 ? "lg:mt-12" : ""}>
              <ZoomImage
                src={`${A}/${p.src}.webp`}
                alt={t(p.alt)}
                width={1400}
                height={1702}
                sizes="(min-width: 1024px) 25vw, 50vw"
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </section>

      <Marquee
        className="bg-red py-8 text-white"
        phrases={["the good kind of secret", t("escolhemos"), t("testamos"), t("aprovamos"), t("pequenos prazeres")]}
      />

      {/* Cartões do Design Review */}
      <section className="bg-cream text-ink">
        <div className="container-benza py-24 sm:py-40">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
            <h2 className="text-[clamp(40px,5vw,72px)] font-medium leading-[0.95]">
              {t("The design review,")}{" "}<em className="text-accent-dark">{t("em seis cartões")}</em>
            </h2>
            <p className="max-w-[460px] text-[17px] leading-relaxed">
              {t("Cada produto aprovado ganha um olhar de design: forma, cor, material. Menos ficha técnica, mais objeto de desejo.")}</p>
          </div>
          <ol className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <li key={c.src} className={`flex flex-col gap-3 ${i % 3 === 1 ? "lg:mt-16" : i % 3 === 2 ? "lg:mt-6" : ""}`}>
                <ZoomImage src={`${A}/${c.src}.webp`} alt={t(c.alt)} width={1200} height={1500} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                <div className="flex items-baseline justify-between gap-3">
                  <span className="label text-accent-dark">{c.tag}</span>
                  <span className="font-mono text-xs">[{c.n}]</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Frase */}
      <section className="bg-deep">
        <div className="container-benza py-20 text-center sm:py-32">
          <p className="mx-auto max-w-[1000px] font-brand text-[clamp(40px,6vw,96px)] italic leading-[1] text-sand">
            {t("Não fabricamos.")}{" "}<span className="text-red">{t("Escolhemos.")}</span>
            <br />
            {t("Testamos. Aprovamos.")}</p>
        </div>
      </section>

      {/* Pranchas de clima */}
      <section className="container-benza py-24 sm:py-40">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
            {t("Três")}{" "}<em>{t("climas")}</em>
          </h2>
          <span className="label text-accent">[03]</span>
        </div>
        <div className="flex flex-col gap-16 sm:gap-24">
          {boards.map((b, i) => (
            <article key={b.src} className={`grid items-center gap-6 lg:grid-cols-12 lg:gap-10 ${i === 1 ? "" : ""}`}>
              <div className={`lg:col-span-4 ${i % 2 ? "lg:order-2" : ""}`}>
                <span className="font-mono text-xs text-accent">[{b.n}]</span>
                <h3 className="mt-3 text-5xl leading-none">{b.title}</h3>
                <p className="label mt-4 text-accent">{b.mood}</p>
                <p className="mt-4 max-w-[340px] text-[17px] leading-relaxed text-sand-muted">{t(b.text)}</p>
              </div>
              <div className={`lg:col-span-8 ${i % 2 ? "lg:order-1" : ""} ${b.h > b.w ? "lg:col-span-6 lg:justify-self-center" : ""}`}>
                <ZoomImage src={`${A}/${b.src}.webp`} alt={t(b.alt)} width={b.w} height={b.h} sizes="(min-width: 1024px) 66vw, 100vw" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <Marquee
        className="border-y border-[var(--sand-line)] py-8 text-red"
        phrases={["benza approved", "low light", "close quarters", "warm · tactile · intimate", "the good kind of secret"]}
      />

      {/* Fecho */}
      <section className="container-benza flex flex-col items-start gap-6 py-24 sm:py-40">
        <p className="max-w-[640px] font-brand text-[clamp(32px,4vw,56px)] italic leading-[1.05]">
          {t("Tudo começa num objeto bem escolhido.")}</p>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/approved" className="btn bg-red text-white hover:opacity-90">{t("Ver os aprovados")}</Link>
          <Link href="/sobre" className="btn border border-sand/60 hover:bg-sand hover:text-ink">{t("Sobre a benza")}</Link>
        </div>
        <p className="label mt-6 text-sand/60">
          {t("Peças de conceito. Fotos de produtos e do moodboard são de terceiros, só para apresentação interna.")}</p>
      </section>
    </main>
  );
}
