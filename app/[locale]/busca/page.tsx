import type { Metadata } from "next";
import { Suspense } from "react";
import { getBodyPart, getLine, getProducts, getProductsWithParent, getSubCategoryName } from "@/lib/catalog";
import { SearchView } from "@/components/SearchView";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("busca — benza") };
}

export default async function BuscaPage() {
  const t = await getT();
  const items = getProducts().map((p) => ({
    ...p,
    name: t(p.name),
    brand: t(p.brand),
    summary: t(p.summary),
    categoryName: t(getSubCategoryName(p.category) ?? ""),
    lineName: getLine(p.line)?.name ?? "",
    bodyNames: p.body.map((b) => t(getBodyPart(b)?.name ?? "")),
  }));
  return (
    <main className="bg-cream text-ink">
      <div className="container-benza flex flex-col gap-8 py-20 sm:py-28">
        <h1 className="text-[clamp(56px,6.4vw,96px)] font-medium leading-[0.92]">
          {t("O que você")}{" "}<em>{t("procura?")}</em>
        </h1>
        <Suspense>
          <SearchView items={items} aiProducts={getProductsWithParent()} />
        </Suspense>
      </div>
    </main>
  );
}
