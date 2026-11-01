import Link from "@/components/Link";
import Image from "next/image";
import { linePhotoAlt, type Line } from "@/lib/catalog";
import { getT } from "@/lib/i18n/server";

const accentTitle = new Set(["penumbra", "mata"]);

export async function LineCard({ line }: { line: Line }) {
  const t = await getT();
  return (
    <Link
      href={`/linhas/${line.slug}`}
      data-line={line.slug}
      className="group flex flex-col overflow-hidden rounded-brand bg-line-bg text-line-text"
    >
      <div className="relative h-[440px] overflow-hidden">
        <Image
          src={`/assets/photos/${line.photo}`}
          alt={t(linePhotoAlt[line.slug])}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-1.5 p-[22px]">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-line-accent">
          N°{line.number} · {t(line.moment)}
        </span>
        <span className={`font-display text-4xl leading-none ${accentTitle.has(line.slug) ? "text-line-accent" : ""}`}>
          {line.name}
        </span>
      </div>
    </Link>
  );
}

export async function LineCards({ lines }: { lines: Line[] }) {
  const t = await getT();
  return (
    <section className="bg-cream text-ink">
      <div className="container-benza py-24 sm:py-40">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(40px,4vw,56px)] font-medium leading-none">
            {t("Quatro linhas,")}{" "}<em className="text-accent-dark">{t("quatro momentos")}</em>
          </h2>
          <Link href="/linhas" className="label inline-flex min-h-[var(--tap)] items-center hover:text-accent-dark">
            {t("Todas as linhas →")}</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lines.map((l) => (
            <LineCard key={l.slug} line={l} />
          ))}
        </div>
      </div>
    </section>
  );
}
