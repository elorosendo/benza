import { getCategories, getLines, getNewApproved } from "@/lib/catalog";
import { HeroSplit } from "@/components/Hero";
import { CategoryIndex } from "@/components/CategoryIndex";
import { BodyGrid } from "@/components/BodyGrid";
import { LineCards } from "@/components/LineCard";
import { NewApproved } from "@/components/NewApproved";
import { ProductCard } from "@/components/ProductCard";
import { AskBenza } from "@/components/AskBenza";

export default function Home() {
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
