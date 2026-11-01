import type { Metadata } from "next";
import Image from "next/image";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("sobre — benza") };
}

export default async function SobrePage() {
  const t = await getT();
  return (
    <main>
      <section className="bg-ink text-sand">
        <div className="container-benza grid items-center gap-10 py-20 sm:py-36 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="chip label self-start text-accent">{t("Manifesto")}</span>
            <h1 className="text-[clamp(56px,7vw,110px)] font-medium leading-[0.9]">
              {t("The good kind")}{" "}<em>{t("of secret.")}</em>
            </h1>
            <p className="max-w-[520px] text-[17px] leading-relaxed text-sand-muted">
              {t("A benza é um marketplace curado de sex wellness. Não fabricamos: selecionamos, testamos e aprovamos. [Texto do manifesto a definir.]")}</p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-brand bg-burgundy">
            <Image
              src="/assets/photos/window.jpg"
              alt={t("Luz entrando por uma janela")}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream text-ink">
        <div className="container-benza grid gap-4 py-24 sm:py-40 md:grid-cols-3">
          {[
            ["Escolhemos", "[Curadoria de marcas parceiras.]"],
            ["Testamos", "[Reviews feitas por quem usa.]"],
            ["Aprovamos", "[O selo benza approved.]"],
          ].map(([title, d]) => (
            <div key={title} className="flex flex-col gap-3 rounded-brand bg-cream-deep p-6 sm:p-8">
              <h2 className="text-4xl leading-none">{t(title)}</h2>
              <p className="text-[15px] leading-relaxed">{t(d)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="envio" className="bg-cream-deep text-ink scroll-mt-8">
        <div className="container-benza flex flex-col gap-4 py-24 sm:py-40">
          <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
            {t("Envio")}{" "}<em className="text-accent-dark">{t("discreto")}</em>
          </h2>
          <p className="max-w-[560px] text-[17px] leading-relaxed">
            {t("Entrega para todo o Brasil em embalagem sem marca, sem menção ao conteúdo. [Prazos, frete e políticas a definir.]")}</p>
        </div>
      </section>
    </main>
  );
}
