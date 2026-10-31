import { getCategories, getLines, getNewApproved } from "@/lib/catalog";
import { HeroSplit } from "../Hero";
import { CategoryIndex } from "../CategoryIndex";
import { LineCards } from "../LineCard";
import { NewApproved } from "../NewApproved";
import { ProductCard } from "../ProductCard";

// V2 — Dia, loja primeiro. Header claro vem do layout (HeaderAlt).
export function HomeV2() {
  return (
    <main className="bg-cream text-ink">
      <HeroSplit />
      <CategoryIndex categories={getCategories()} />
      <LineCards lines={getLines()} />
      <NewApproved>
        {getNewApproved().slice(0, 8).map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </NewApproved>
    </main>
  );
}
