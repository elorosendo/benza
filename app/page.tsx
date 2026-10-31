import { Suspense } from "react";
import { getCategories, getLines, getNewApproved } from "@/lib/catalog";
import { HeroSplit } from "@/components/Hero";
import { CategoryIndex } from "@/components/CategoryIndex";
import { BodyGrid } from "@/components/BodyGrid";
import { LineCards } from "@/components/LineCard";
import { NewApproved } from "@/components/NewApproved";
import { ProductCard } from "@/components/ProductCard";
import { AskBenza } from "@/components/AskBenza";
import { HomeV1 } from "@/components/variants/HomeV1";
import { HomeV2 } from "@/components/variants/HomeV2";
import { HomeV3 } from "@/components/variants/HomeV3";

type SearchParams = Promise<{ v?: string }>;

// ?v=1|2|3 renderiza as variações da designer; sem parâmetro, a combinação recomendada.
export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}

async function HomeContent({ searchParams }: { searchParams: SearchParams }) {
  const { v } = await searchParams;
  if (v === "1") return <HomeV1 />;
  if (v === "2") return <HomeV2 />;
  if (v === "3") return <HomeV3 />;

  const categories = getCategories();
  const body = categories.find((c) => c.slug === "por-corpo")!;
  return (
    <main>
      <HeroSplit />
      <CategoryIndex categories={categories} />
      <BodyGrid category={body} />
      <LineCards lines={getLines()} />
      <NewApproved>
        {getNewApproved().slice(0, 8).map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </NewApproved>
      <AskBenza />
    </main>
  );
}
