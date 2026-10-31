"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Option = { slug: string; label: string };
export type FilterGroup = { key: string; label: string; options: Option[] };

export function Filters({ groups }: { groups: FilterGroup[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const toggle = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (next.get(key) === value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const active = groups.some((g) => params.get(g.key));
  const chip = (on: boolean) =>
    `inline-flex min-h-[var(--tap)] items-center rounded-pill border px-4 text-sm transition-colors ${
      on ? "border-ink bg-ink text-sand" : "border-ink/30 hover:border-ink"
    }`;

  return (
    <div className="flex flex-col gap-5 border-b border-ink/15 pb-6">
      {groups.map((g) => (
        <fieldset key={g.key} className="flex flex-wrap items-center gap-2">
          <legend className="label mb-2 w-full text-accent-dark sm:mb-0 sm:mr-3 sm:inline-block sm:w-[120px] sm:float-left">
            {g.label}
          </legend>
          {g.options.map((o) => {
            const on = params.get(g.key) === o.slug;
            return (
              <button
                key={o.slug}
                type="button"
                aria-pressed={on}
                className={chip(on)}
                onClick={() => toggle(g.key, o.slug)}
              >
                {o.label}
              </button>
            );
          })}
        </fieldset>
      ))}
      {active && (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="label self-start underline underline-offset-4 hover:text-accent-dark"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
