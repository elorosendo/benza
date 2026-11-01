import type { Metadata } from "next";
import Image from "next/image";
import { formatCount } from "@/lib/catalog";
import { getReviews, getTesters, toCardData } from "@/lib/social";
import { platformLabel, socialLinks } from "@/lib/socialLinks";
import { VideoCard } from "@/components/VideoCard";
import { CommunityForm } from "@/components/CommunityForm";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("comunidade — benza"), description: t("Quem testa, o que testou e como a benza nasceu: de uma comunidade.") };
}

const wall = [
  ["couple.jpg", "Duas pessoas, rostos próximos"],
  ["forest.jpg", "Mulher correndo na floresta"],
  ["mango.jpg", "Boca mordendo manga verde, anéis dourados"],
  ["redhands.jpg", "Mãos em luz vermelha"],
  ["window.jpg", "Luz entrando por uma janela"],
  ["palm.jpg", "Folhas de palmeira em contraluz"],
];

export default async function ComunidadePage() {
  const t = await getT();
  const reviews = getReviews().map(toCardData);
  const testers = getTesters();
  return (
    <main>
      {/* Abertura */}
      <section className="bg-ink text-sand">
        <div className="container-benza flex flex-col gap-6 py-20 sm:py-36">
          <span className="label text-accent">{t("[ Comunidade ]")}</span>
          <h1 className="text-[clamp(56px,7vw,110px)] leading-[0.92]">
            {t("Uma marca feita")}{" "}<em>{t("por quem usa.")}</em>
          </h1>
          <p className="max-w-[560px] text-[17px] leading-relaxed text-sand-muted">
            {t("A benza nasceu de uma comunidade. Cada produto é testado por pessoas reais, filmado e contado sem vergonha e sem jargão, antes de ganhar o selo.")}</p>
          <ul className="flex flex-wrap gap-2.5">
            {socialLinks.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border border-sand/60 hover:bg-sand hover:text-ink"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quem testa */}
      <section className="bg-cream text-ink">
        <div className="container-benza py-24 sm:py-40">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-[clamp(40px,4vw,56px)] leading-none">
              {t("Quem")}{" "}<em className="text-accent-dark">{t("testa")}</em>
            </h2>
            <span className="label text-accent-dark">{formatCount(testers.length)}</span>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testers.map((tester) => (
              <li key={tester.handle} className="flex items-center gap-4 rounded-brand bg-cream-deep p-5">
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-burgundy font-display text-2xl text-sand"
                >
                  {tester.name.replace(/[^\p{L}\d]/gu, "").charAt(0) || "·"}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-xl leading-tight">{t(tester.name)}</span>
                  <span className="label text-accent-dark">{t(tester.handle)}</span>
                  <span className="text-sm opacity-75">
                    {t("{n} reviews · {platforms}", { n: tester.count, platforms: tester.platforms.map((p) => platformLabel[p]).join(", ") })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-ink text-sand">
        <div className="container-benza py-24 sm:py-40">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(40px,4vw,56px)] leading-none">
              {t("Últimos")}{" "}<em>{t("reviews")}</em>
            </h2>
            <span className="label text-accent">{t("{count} em vídeo", { count: formatCount(reviews.length) })}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {reviews.map((r) => (
              <VideoCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Mural */}
      <section className="bg-cream-deep text-ink">
        <div className="container-benza py-24 sm:py-40">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(40px,4vw,56px)] leading-none">
              {t("O mural")}{" "}<em className="text-accent-dark">{t("da comunidade")}</em>
            </h2>
            <span className="label text-accent-dark">{t("[Conteúdo só com consentimento]")}</span>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
            {wall.map(([src, alt], i) => (
              <li key={src} className={`relative aspect-[4/5] overflow-hidden rounded-brand bg-cream ${i % 2 ? "lg:mt-10" : ""}`}>
                <Image src={`/assets/photos/${src}`} alt={t(alt)} fill sizes="(min-width: 1024px) 16vw, 50vw" className="object-cover" />
                <span className="absolute inset-x-2 bottom-2 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-white">
                  {t("@[perfil]")}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quero testar */}
      <section className="bg-red text-white">
        <div className="container-benza grid items-center gap-10 py-24 sm:py-40 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-4">
            <span className="label">{t("Faça parte")}</span>
            <h2 className="text-[clamp(40px,5vw,72px)] leading-[0.95]">
              {t("Quer testar")}{" "}<em>{t("com a gente?")}</em>
            </h2>
            <p className="max-w-[460px] text-[17px] leading-relaxed">
              {t("Escolhemos novas vozes a cada mês. [Critérios e regras de uso de imagem a definir.]")}</p>
          </div>
          <CommunityForm />
        </div>
      </section>
    </main>
  );
}
