import { Suspense } from "react";
import { getCategories, type FilterParams } from "@/lib/catalog";
import { CategoryView } from "@/components/CategoryView";

export function generateStaticParams() {
  return getCategories().flatMap((c) =>
    (c.groups?.flatMap((g) => g.children) ?? []).map((s) => ({ slug: c.slug, sub: s.slug })),
  );
}

type Props = {
  params: Promise<{ slug: string; sub: string }>;
  searchParams: Promise<FilterParams>;
};

export default function SubCategoryPage(props: Props) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  );
}

async function Content({ params, searchParams }: Props) {
  const [{ slug, sub }, filters] = await Promise.all([params, searchParams]);
  return <CategoryView slug={slug} sub={sub} filters={filters} />;
}
