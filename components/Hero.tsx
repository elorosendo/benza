import Image from "next/image";
import Link from "@/components/Link";
import { getT } from "@/lib/i18n/server";

// Variante "split" (SiteV2): texto + foto.
export async function HeroSplit() {
  const t = await getT();
  return (
    <section className="bg-cream text-ink">
      <div className="container-benza grid gap-4 pt-10 lg:grid-cols-2">
        <div className="flex min-h-[520px] flex-col justify-between gap-10 pb-6 pt-2 lg:min-h-[780px]">
          <span className="chip label self-start text-accent-dark">{t("Marketplace curado de sex wellness")}</span>
          <div className="flex flex-col gap-6">
            <h1 className="text-[clamp(44px,4.4vw,68px)] font-medium leading-[0.98] tracking-[-0.01em]">
              {t("O que está aqui, está aqui")}{" "}
              <span className="text-accent-dark">{t("porque a gente escolheu.")}</span>
            </h1>
            <p className="max-w-[460px] text-[17px] leading-relaxed">
              {t("Prazer, cuidado íntimo e rituais — testados por quem usa antes de ganhar o selo BENZA Approved.")}</p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/categoria/prazer" className="btn bg-ink text-sand hover:bg-ink-muted">
                {t("Comprar agora")}</Link>
              <Link href="/quiz" className="btn border border-ink hover:bg-ink hover:text-sand">
                {t("Fazer o quiz")}</Link>
            </div>
          </div>
        </div>
        <div className="relative min-h-[460px] overflow-hidden rounded-brand bg-[#E2D3C2] lg:min-h-[780px]">
          <Image
            src="/assets/photos/hero-perfume.webp"
            alt={t("Duas mãos segurando um frasco de perfume âmbar junto ao ombro")}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            data-parallax="0.07"
            className="scale-[1.18] object-cover [object-position:center_45%]"
          />
        </div>
      </div>
    </section>
  );
}
