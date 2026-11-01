import type { Metadata } from "next";
import Link from "@/components/Link";
import { BagLines } from "@/components/BagLines";
import { BagTotal } from "@/components/BagTotal";
import { CheckoutNotice } from "@/components/CheckoutNotice";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Sacola — benza") };
}

export default async function SacolaPage() {
  const t = await getT();
  return (
    <main className="bg-ink text-sand">
      <div className="container-benza grid gap-10 py-20 sm:py-28 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div>
          <h1 className="mb-6 text-[clamp(56px,6.4vw,96px)] font-medium leading-[0.92]">
            {t("Sua")}{" "}<em>{t("sacola")}</em>
          </h1>
          <BagLines />
          <Link href="/categoria/novidades" className="label mt-6 inline-flex min-h-[var(--tap)] items-center hover:text-accent">
            {t("← Continuar explorando")}</Link>
        </div>
        <aside className="flex h-fit flex-col gap-5 rounded-brand bg-deep p-6">
          <BagTotal />
          <p className="text-sm text-sand-muted">{t("Envio discreto, embalagem sem marca. Frete e prazo: [a definir].")}</p>
          <CheckoutNotice className="btn justify-center bg-red text-white hover:opacity-90" />
        </aside>
      </div>
    </main>
  );
}
