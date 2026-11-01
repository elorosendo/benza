import type { Metadata } from "next";
import { Suspense } from "react";
import { getProductsWithParent } from "@/lib/catalog";
import { Compare } from "@/components/Compare";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("comparar — benza") };
}

export default async function CompararPage() {
  const t = await getT();
  return (
    <main className="bg-cream text-ink">
      <div className="container-benza flex flex-col gap-12 py-20 sm:py-32">
        <div className="flex flex-col gap-5">
          <span className="chip label self-start text-accent-dark">{t("IA da benza · protótipo")}</span>
          <h1 className="text-[clamp(44px,5.6vw,88px)] leading-[0.95]">
            {t("Compare")}{" "}<em className="text-accent-dark">{t("antes de decidir.")}</em>
          </h1>
          <p className="max-w-[560px] text-[17px] leading-relaxed">
            {t("Escolha dois produtos e veja as diferenças lado a lado, com um resumo para decidir mais rápido.")}
          </p>
        </div>
        <Suspense>
          <Compare products={getProductsWithParent()} />
        </Suspense>
      </div>
    </main>
  );
}
