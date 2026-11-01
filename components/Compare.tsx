"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "@/components/Link";
import { formatPrice, getSubCategoryName } from "@/lib/catalog";
import type { AiProduct } from "@/lib/aiMock";
import { useLocale, useT } from "@/lib/i18n/client";

const USE: Record<string, string> = {
  vibradores: "prazer solo e primeiros passos",
  "succao-ar": "prazer solo e primeiros passos",
  dildos: "exploração com material liso",
  anal: "exploração com material liso",
  "prazer-compartilhado": "momentos a dois",
  "aneis-capas": "momentos a dois",
  "lubrificantes-liquidos": "conforto e cuidado",
  higiene: "conforto e cuidado",
  "skincare-intimo": "conforto e cuidado",
  velas: "clima e ritual",
  aromaterapia: "clima e ritual",
  massagem: "clima e ritual",
  "banho-ervas": "clima e ritual",
};
const BEGINNER = ["para-comecar", "silenciosos", "lubrificantes-liquidos", "vibradores"];

// Comparador com resumo SIMULADO da IA (protótipo): monta o texto com regras locais.
export function Compare({ products }: { products: AiProduct[] }) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const find = (slug: string | null) => products.find((p) => p.slug === slug);
  const a = find(params.get("a")) ?? products[0];
  const b = find(params.get("b")) ?? products.find((p) => p.slug !== a.slug && p.line === a.line) ?? products.find((p) => p.slug !== a.slug)!;

  const set = (key: "a" | "b", slug: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("a", a.slug);
    next.set("b", b.slug);
    next.set(key, slug);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const sub = (p: AiProduct) => {
    const n = getSubCategoryName(p.category);
    return n ? t(n) : "";
  };
  const use = (p: AiProduct) => t(USE[p.category] ?? "uso geral");

  const rows: [string, (p: AiProduct) => string][] = [
    ["Marca", (p) => t(p.brand)],
    ["Categoria", sub],
    ["Linha", (p) => p.line.charAt(0).toUpperCase() + p.line.slice(1)],
    ["Preço", (p) => formatPrice(p.price, locale, t)],
    ["Material", (p) => t(p.specs?.material ?? "—")],
    ["Tamanho", (p) => t(p.specs?.size ?? "—")],
    ["Cuidados", (p) => t(p.specs?.care ?? "—")],
    ["O que funciona", (p) => (p.review?.works ?? []).map((w) => t(w)).join(" · ") || "—"],
    ["O que não funciona", (p) => (p.review?.doesnt ?? []).map((w) => t(w)).join(" · ") || "—"],
    ["Selo", (p) => (p.approved ? t("✓ Approved") : "—")],
  ];

  const starter = BEGINNER.includes(a.category) && !BEGINNER.includes(b.category) ? a : BEGINNER.includes(b.category) && !BEGINNER.includes(a.category) ? b : null;
  const summary = [
    t("{name} é melhor para {use}.", { name: t(a.name), use: use(a) }),
    t("{name} é melhor para {use}.", { name: t(b.name), use: use(b) }),
    a.line === b.line
      ? t("Os dois são da mesma linha, {line}, então combinam entre si.", { line: a.line.charAt(0).toUpperCase() + a.line.slice(1) })
      : t("Eles vêm de linhas diferentes: o clima muda, o uso também."),
    starter ? t("Se você está começando, prefira {name}.", { name: t(starter.name) }) : t("Os dois servem para quem já conhece o básico."),
  ];

  const select = "min-h-[52px] w-full rounded-pill border border-ink/30 bg-transparent px-5 text-base text-ink";

  return (
    <div className="flex flex-col gap-12">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { key: "a" as const, p: a, other: b },
          { key: "b" as const, p: b, other: a },
        ].map(({ key, p, other }) => (
          <div key={key} className="flex flex-col gap-4 rounded-brand bg-cream-deep p-5">
            <label htmlFor={`cmp-${key}`} className="label text-accent-dark">
              {key === "a" ? t("Produto A") : t("Produto B")}
            </label>
            <select id={`cmp-${key}`} value={p.slug} onChange={(e) => set(key, e.target.value)} className={select}>
              {products
                .filter((x) => x.slug !== other.slug)
                .map((x) => (
                  <option key={x.slug} value={x.slug}>
                    {t(x.name)} — {sub(x)} ({x.line})
                  </option>
                ))}
            </select>
            <Link href={`/produto/${p.slug}`} className="flex items-center gap-4">
              <span className="relative h-[110px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-cream">
                {p.images[0] && <Image src={p.images[0]} alt={t(p.name)} fill sizes="88px" className="object-cover" />}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-xl leading-tight">{t(p.name)}</span>
                <span className="text-sm opacity-75">{t(p.brand)} · {sub(p)}</span>
                <span className="label text-accent-dark">{t("Ver o produto")} →</span>
              </span>
            </Link>
          </div>
        ))}
      </div>

      <section aria-labelledby="cmp-ai" className="flex flex-col gap-4 rounded-brand bg-deep p-6 text-sand sm:p-8">
        <span id="cmp-ai" className="label flex items-center gap-2 text-accent">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red" />
          {t("Resumo da IA · protótipo")}
        </span>
        <ul className="flex flex-col gap-2 text-[17px] leading-relaxed">
          {summary.map((s) => (
            <li key={s} className="flex gap-3">
              <span aria-hidden="true" className="text-accent">•</span>
              {s}
            </li>
          ))}
        </ul>
        <p className="label text-sand/50">{t("Resumo simulado. A IA de verdade usará só as reviews da comunidade.")}</p>
      </section>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{t("Comparação entre os dois produtos")}</caption>
          <thead>
            <tr className="border-b border-ink/25">
              <th scope="col" className="py-3 pr-4"><span className="sr-only">{t("Característica")}</span></th>
              <th scope="col" className="py-3 pr-4 text-xl font-normal">{t(a.name)}</th>
              <th scope="col" className="py-3 text-xl font-normal">{t(b.name)}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label} className="border-b border-ink/15 align-top">
                <th scope="row" className="label w-[22%] py-4 pr-4 text-accent-dark">{t(label)}</th>
                <td className="py-4 pr-4 text-[15px] leading-relaxed">{get(a)}</td>
                <td className="py-4 text-[15px] leading-relaxed">{get(b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
