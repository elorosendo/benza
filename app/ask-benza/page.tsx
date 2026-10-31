import type { Metadata } from "next";
import { AskBenza } from "@/components/AskBenza";

export const metadata: Metadata = { title: "ask benza" };

const questions = [
  ["[Pergunta da comunidade sobre começar.]", "[Resposta da benza, sem vergonha e sem jargão.]"],
  ["[Pergunta sobre lubrificantes.]", "[Resposta da benza.]"],
  ["[Pergunta sobre cuidado e higiene.]", "[Resposta da benza.]"],
  ["[Pergunta sobre prazer a dois.]", "[Resposta da benza.]"],
];

export default function AskBenzaPage() {
  return (
    <main>
      <section className="bg-ink text-sand">
        <div className="container-benza flex flex-col gap-6 py-14 sm:py-20">
          <span className="label text-accent">Ask benza · conselho de amiga</span>
          <h1 className="text-[clamp(56px,7vw,110px)] font-medium leading-[0.9]">
            Pergunte <em>sem vergonha.</em>
          </h1>
          <p className="max-w-[520px] text-[17px] leading-relaxed text-sand-muted">
            Perguntas reais, respostas diretas. Anônimo, sempre.
          </p>
        </div>
      </section>

      <section className="bg-cream text-ink">
        <div className="container-benza grid gap-4 py-16 sm:py-24 md:grid-cols-2">
          {questions.map(([q, a], i) => (
            <article key={i} className="flex flex-col gap-4 rounded-brand bg-cream-deep p-6 sm:p-8">
              <span className="font-mono text-xs text-accent-dark">[0{i + 1}]</span>
              <h2 className="text-3xl leading-[1.05]">{q}</h2>
              <p className="text-[15px] leading-relaxed">{a}</p>
            </article>
          ))}
        </div>
      </section>

      <AskBenza />
    </main>
  );
}
