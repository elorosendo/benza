import { getCategories, getLines, megaMenuLine } from "@/lib/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteHeader() {
  return (
    <>
      <AnnouncementBar />
      <Header categories={getCategories()} lines={getLines()} menuLines={megaMenuLine} />
    </>
  );
}

export function SiteFooter() {
  return <Footer categories={getCategories()} lines={getLines()} />;
}
