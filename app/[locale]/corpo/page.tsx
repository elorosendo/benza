import type { Metadata } from "next";
import { getCategory } from "@/lib/catalog";
import { BodyGrid } from "@/components/BodyGrid";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Por corpo — BENZA") };
}

export default function CorpoPage() {
  return (
    <main>
      <BodyGrid category={getCategory("por-corpo")!} asH1 />
    </main>
  );
}
