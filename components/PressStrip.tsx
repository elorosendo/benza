import { getT } from "@/lib/i18n/server";

// "Destaque em": logos de veículos de imprensa, usados como PLACEHOLDER de design.
// Antes de publicar, trocar por logos só dos veículos que de fato citaram a benza.
// Os logos são máscaras: sempre aparecem na cor da marca (--title), nunca nas cores originais.
const logos = [
  { name: "Vogue", file: "vogue.png", ratio: 1280 / 340, h: 30 },
  { name: "Glamour", file: "glamour.svg", ratio: 302 / 70, h: 30 },
  { name: "GQ", file: "gq.svg", ratio: 225.9 / 121.4, h: 46 },
];

export async function PressStrip() {
  const t = await getT();
  return (
    <section aria-label={t("Destaque em")} className="border-y border-ink/10 bg-cream text-ink">
      <div className="container-benza flex flex-col items-center justify-center gap-6 py-14 sm:py-20 lg:flex-row lg:gap-14">
        <span className="shrink-0 text-[15px] font-medium">{t("Destaque em")}</span>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((l) => (
            <li key={l.name}>
              <span
                role="img"
                aria-label={l.name}
                className="press-logo block"
                style={{
                  height: l.h,
                  aspectRatio: String(l.ratio),
                  ["--logo" as string]: `url(/assets/press/${l.file})`,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
