import type { Metadata } from "next";
import { getCategories, getLines, getProducts } from "@/lib/catalog";
import type { QuizProduct } from "@/lib/quiz";
import { Quiz } from "@/components/Quiz";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("quiz — benza"), description: t("Seis perguntas para descobrir a linha e os produtos que combinam com o seu momento.") };
}

export default function QuizPage() {
  const parentOf: Record<string, string> = {};
  for (const c of getCategories())
    for (const g of c.groups ?? []) for (const s of g.children) parentOf[s.slug] ??= c.slug;
  const products: QuizProduct[] = getProducts().map((p) => ({ ...p, parent: parentOf[p.category] ?? "" }));
  return (
    <main>
      <Quiz products={products} lines={getLines()} />
    </main>
  );
}
