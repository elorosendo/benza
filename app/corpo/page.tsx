import type { Metadata } from "next";
import { getCategory } from "@/lib/catalog";
import { BodyGrid } from "@/components/BodyGrid";

export const metadata: Metadata = { title: "Por corpo — BENZA" };

export default function CorpoPage() {
  return (
    <main>
      <BodyGrid category={getCategory("por-corpo")!} asH1 />
    </main>
  );
}
