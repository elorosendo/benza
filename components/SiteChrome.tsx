import { Suspense } from "react";
import { getCategories, getLines, megaMenuLine } from "@/lib/catalog";
import { ChromeHeader } from "./ChromeHeader";
import { Footer } from "./Footer";

export function SiteHeader() {
  return (
    <Suspense>
      <ChromeHeader categories={getCategories()} lines={getLines()} menuLines={megaMenuLine} />
    </Suspense>
  );
}

export function SiteFooter() {
  return (
    <Suspense>
      <Footer categories={getCategories()} lines={getLines()} />
    </Suspense>
  );
}
