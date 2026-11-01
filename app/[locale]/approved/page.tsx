import type { Metadata } from "next";
import { formatCount, getProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/ProductGrid";
import { getT } from "@/lib/i18n/server";
import { ApprovedStamp } from "@/components/ApprovedStamp";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("benza approved") };
}

const steps = [
  ["01", "Escolhemos", "[Critérios de curadoria: marca, materiais, segurança.]"],
  ["02", "Testamos", "[Quem testa, por quanto tempo e em que condições.]"],
  ["03", "Escrevemos", "[Review honesta: o que funciona e o que não funciona.]"],
  ["04", "Aprovamos", "[Só então o produto ganha o selo.]"],
];

export default async function ApprovedPage() {
  const t = await getT();
  const products = getProducts().filter((p) => p.approved);
  return (
    <main>
      <section className="bg-ink text-sand">
        <div className="container-benza grid items-center gap-10 py-20 sm:py-36 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <span className="chip label self-start text-accent">{t("Como aprovamos")}</span>
            <h1 className="text-[clamp(56px,7vw,110px)] font-medium leading-[0.9]">
              {t("Só entra")}{" "}<em>{t("o que a gente testou.")}</em>
            </h1>
            <p className="max-w-[520px] text-[17px] leading-relaxed text-sand-muted">
              {t("O selo benza approved é a nossa palavra: cada produto passa por pessoas reais antes de chegar à prateleira.")}</p>
          </div>
          <div className="flex justify-center rounded-brand bg-deep p-10">
            <ApprovedStamp width={360} priority />
          </div>
        </div>
      </section>

      <section className="bg-cream text-ink">
        <div className="container-benza py-24 sm:py-40">
          <h2 className="mb-10 text-[clamp(40px,4vw,56px)] font-medium leading-none">
            {t("Em quatro")}{" "}<em className="text-accent-dark">{t("passos")}</em>
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([n, title, d]) => (
              <li key={n} className="flex flex-col gap-3 rounded-brand bg-cream-deep p-6">
                <span className="font-mono text-xs text-accent-dark">[{n}]</span>
                <h3 className="text-3xl leading-none">{t(title)}</h3>
                <p className="text-[15px] leading-relaxed">{t(d)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream-deep text-ink">
        <div className="container-benza py-24 sm:py-40">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
              {t("Todos os")}{" "}<em>{t("aprovados")}</em>
            </h2>
            <span className="label text-accent-dark">{formatCount(products.length)} produtos</span>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}
