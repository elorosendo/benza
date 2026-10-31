import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "sobre — benza" };

export default function SobrePage() {
  return (
    <main>
      <section className="bg-ink text-sand">
        <div className="container-benza grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="label text-accent">[ Manifesto ]</span>
            <h1 className="text-[clamp(56px,7vw,110px)] font-medium leading-[0.9]">
              The good kind <em>of secret.</em>
            </h1>
            <p className="max-w-[520px] text-[17px] leading-relaxed text-sand-muted">
              A benza é um marketplace curado de sex wellness. Não fabricamos: selecionamos, testamos e aprovamos. [Texto do manifesto a definir.]
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-brand bg-burgundy">
            <Image
              src="/assets/photos/window.jpg"
              alt="Luz entrando por uma janela"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream text-ink">
        <div className="container-benza grid gap-4 py-16 sm:py-24 md:grid-cols-3">
          {[
            ["Escolhemos", "[Curadoria de marcas parceiras.]"],
            ["Testamos", "[Reviews feitas por quem usa.]"],
            ["Aprovamos", "[O selo benza approved.]"],
          ].map(([t, d]) => (
            <div key={t} className="flex flex-col gap-3 rounded-brand bg-cream-deep p-6 sm:p-8">
              <h2 className="text-4xl leading-none">{t}</h2>
              <p className="text-[15px] leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="envio" className="bg-cream-deep text-ink scroll-mt-8">
        <div className="container-benza flex flex-col gap-4 py-16 sm:py-24">
          <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
            Envio <em className="text-accent-dark">discreto</em>
          </h2>
          <p className="max-w-[560px] text-[17px] leading-relaxed">
            Entrega para todo o Brasil em embalagem sem marca, sem menção ao conteúdo. [Prazos, frete e políticas a definir.]
          </p>
        </div>
      </section>
    </main>
  );
}
