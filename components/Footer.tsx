import Link from "next/link";
import { categoryHref, type Category, type Line } from "@/lib/catalog";
import { Wordmark, Tagline } from "./Wordmark";

export function Footer({
  categories,
  lines,
}: {
  categories: Category[];
  lines: Line[];
}) {
  const link = "inline-flex min-h-[var(--tap)] items-center hover:text-accent lg:min-h-0";
  const title = "label text-accent";
  return (
    <footer className="border-t border-[var(--sand-line)]">
      <div className="container-benza grid grid-cols-2 gap-9 pb-12 pt-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
          <div className="self-start">
            <Wordmark height={30} />
          </div>
          <div className="opacity-80">
            <Tagline width={110} />
          </div>
        </div>
        <nav aria-label="Loja" className="flex flex-col gap-1 lg:gap-2">
          <span className={title}>Loja</span>
          {categories.map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className={link}>
              {c.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Linhas" className="flex flex-col gap-1 lg:gap-2">
          <span className={title}>Linhas</span>
          {lines.map((l) => (
            <Link key={l.slug} href={`/linhas/${l.slug}`} className={link}>
              {l.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="BENZA" className="flex flex-col gap-1 lg:gap-2">
          <span className={title}>BENZA</span>
          <Link href="/ask-benza" className={link}>Ask Benza</Link>
          <Link href="/approved" className={link}>Como aprovamos</Link>
          <Link href="/sobre" className={link}>Sobre</Link>
          <Link href="/sobre#envio" className={link}>Envio discreto</Link>
        </nav>
      </div>
    </footer>
  );
}
