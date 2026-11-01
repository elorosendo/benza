import Link from "@/components/Link";
import {
  categoryHref,
  countInCategory,
  formatCount,
  getApprovedCount,
  type Category,
} from "@/lib/catalog";
import { Emphasis } from "./Emphasis";
import { getT } from "@/lib/i18n/server";

// Índice tipográfico (SiteV2): linhas grandes em Cormorant, subcategorias ao lado.
export async function CategoryIndex({ categories }: { categories: Category[] }) {
  const t = await getT();
  const rows = categories.filter((c) => c.groups?.length);
  return (
    <section className="bg-cream text-ink">
      <div className="container-benza py-24 sm:py-40">
        <div className="mb-6 flex items-end justify-between gap-4">
          <span className="label">{t("Índice")}</span>
          <span className="label text-[#6A4A3A]">{t("{count} produtos aprovados", { count: formatCount(getApprovedCount()) })}</span>
        </div>
        <div className="flex flex-col">
          {rows.map((c, i) => {
            const subs = c.groups!.flatMap((g) => g.children).filter((s) => s.slug !== "approved");
            const count = c.slug === "por-corpo" ? subs.length : countInCategory(c.slug);
            return (
              <Link
                key={c.slug}
                href={categoryHref(c.slug)}
                className={`idx group grid items-center gap-x-6 gap-y-2 border-t border-ink/25 py-8 hover:bg-ink/[0.04] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_60px] sm:py-[44px] ${
                  i === rows.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="idx-t title-brown font-display text-[clamp(44px,5.4vw,80px)] leading-none">
                  <Emphasis text={t(c.name)} />
                </span>
                <span className="idx-s text-[15px] leading-relaxed text-ink-muted">
                  {subs.map((s) => t(s.name)).join(" · ")}
                </span>
                <span className="idx-n font-mono text-xs sm:text-right">{formatCount(count)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
