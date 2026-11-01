import type { Metadata } from "next";
import { AskBenza } from "@/components/AskBenza";
import { AiChat } from "@/components/AiChat";
import { getProductsWithParent } from "@/lib/catalog";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("ask benza") };
}

const questions = [
  ["[Pergunta da comunidade sobre começar.]", "[Resposta da benza, sem vergonha e sem jargão.]"],
  ["[Pergunta sobre lubrificantes.]", "[Resposta da benza.]"],
  ["[Pergunta sobre cuidado e higiene.]", "[Resposta da benza.]"],
  ["[Pergunta sobre prazer a dois.]", "[Resposta da benza.]"],
];

const suggestions = [
  "Sou iniciante e quero algo discreto",
  "Qual lubrificante você indica?",
  "Algo para levar na viagem",
  "Um presente para a dois",
];

export default async function AskBenzaPage() {
  const t = await getT();
  return (
    <main>
      <section className="bg-ink text-sand">
        <div className="container-benza flex flex-col gap-6 py-20 sm:py-36">
          <span className="chip label self-start text-accent">{t("Ask Benza · conselho de amiga")}</span>
          <h1 className="text-[clamp(56px,7vw,110px)] font-medium leading-[0.9]">
            {t("Pergunte")}{" "}<em>{t("sem vergonha.")}</em>
          </h1>
          <p className="max-w-[520px] text-[17px] leading-relaxed text-sand-muted">
            {t("Perguntas reais, respostas diretas. Anônimo, sempre.")}</p>
          <div className="mt-6 max-w-[900px]">
            <AiChat
              products={getProductsWithParent()}
              suggestions={suggestions}
              placeholder={t("Ex.: quero algo discreto para a primeira vez")}
            />
          </div>
        </div>
      </section>

      <section className="bg-cream text-ink">
        <div className="container-benza grid gap-4 py-24 sm:py-40 md:grid-cols-2">
          {questions.map(([q, a], i) => (
            <article key={i} className="flex flex-col gap-4 rounded-brand bg-cream-deep p-6 sm:p-8">
              <span className="font-mono text-xs text-accent-dark">[0{i + 1}]</span>
              <h2 className="text-3xl leading-[1.05]">{t(q)}</h2>
              <p className="text-[15px] leading-relaxed">{t(a)}</p>
            </article>
          ))}
        </div>
      </section>

      <AskBenza />
    </main>
  );
}
