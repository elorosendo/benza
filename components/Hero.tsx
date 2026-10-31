import Image from "next/image";
import Link from "next/link";

// Variante "split" (SiteV2): texto + foto.
export function HeroSplit() {
  return (
    <section className="bg-cream text-ink">
      <div className="container-benza grid gap-4 pt-10 lg:grid-cols-2">
        <div className="flex min-h-[420px] flex-col justify-between gap-10 pb-6 pt-2 lg:min-h-[620px]">
          <span className="label text-accent-dark">[ Marketplace curado de sex wellness ]</span>
          <div className="flex flex-col gap-6">
            <h1 className="text-[clamp(56px,6.4vw,96px)] font-medium leading-[0.92] tracking-[-0.01em]">
              O que está aqui, está aqui{" "}
              <em className="text-accent-dark">porque a gente escolheu.</em>
            </h1>
            <p className="max-w-[460px] text-[17px] leading-relaxed">
              Prazer, cuidado íntimo e rituais — testados por quem usa antes de ganhar o selo BENZA Approved.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/categoria/prazer" className="btn bg-ink text-sand hover:bg-ink-muted">
                Comprar agora
              </Link>
              <Link href="/quiz" className="btn border border-ink hover:bg-ink hover:text-sand">
                Fazer o quiz
              </Link>
            </div>
          </div>
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-brand bg-[#E2D3C2] lg:min-h-[620px]">
          <Image
            src="/assets/photos/hero-ritual.webp"
            alt="Frascos de óleo e uma barra de sabonete empilhados sobre um ombro"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover [object-position:center_60%]"
          />
        </div>
      </div>
    </section>
  );
}
