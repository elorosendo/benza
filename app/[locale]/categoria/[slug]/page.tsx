import { Suspense } from "react";
import { getCategories, type FilterParams } from "@/lib/catalog";
import { CategoryView } from "@/components/CategoryView";

export function generateStaticParams() {
  return getCategories()
    .filter((c) => c.slug !== "por-corpo")
    .map((c) => ({ slug: c.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<FilterParams>;
};

export default function CategoryPage(props: Props) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  );
}

async function Content({ params, searchParams }: Props) {
  const [{ slug }, filters] = await Promise.all([params, searchParams]);
  return <CategoryView slug={slug} filters={filters} />;
}
