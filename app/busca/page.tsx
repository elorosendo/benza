import type { Metadata } from "next";
import { Suspense } from "react";
import { getBodyPart, getLine, getProducts, getSubCategoryName } from "@/lib/catalog";
import { SearchView } from "@/components/SearchView";

export const metadata: Metadata = { title: "busca — benza" };

export default function BuscaPage() {
  const items = getProducts().map((p) => ({
    ...p,
    categoryName: getSubCategoryName(p.category) ?? "",
    lineName: getLine(p.line)?.name ?? "",
    bodyNames: p.body.map((b) => getBodyPart(b)?.name ?? ""),
  }));
  return (
    <main className="bg-cream text-ink">
      <div className="container-benza flex flex-col gap-8 py-12 sm:py-16">
        <h1 className="text-[clamp(56px,6.4vw,96px)] font-medium leading-[0.92]">
          O que você <em>procura?</em>
        </h1>
        <Suspense>
          <SearchView items={items} />
        </Suspense>
      </div>
    </main>
  );
}
