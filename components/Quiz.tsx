"use client";

import Image from "next/image";
import Link from "@/components/Link";
import { useEffect, useRef, useState } from "react";
import { lineCopy, linePhotoAlt, type Line } from "@/lib/catalog";
import { computeResult, questions, type QuizProduct } from "@/lib/quiz";
import { useCart } from "@/lib/cart";
import { ProductCard } from "./ProductCard";
import { ShareButtons } from "./ShareButtons";
import { useT } from "@/lib/i18n/client";

export function Quiz({ products, lines }: { products: QuizProduct[]; lines: Line[] }) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const { add } = useCart();

  const q = questions[step];
  const chosen = answers[q.id];

  // Leva o foco ao título a cada passo, para leitores de tela e teclado.
  useEffect(() => {
    heading.current?.focus();
  }, [step, done]);

  const next = () => {
    if (!chosen) return;
    if (step === questions.length - 1) setDone(true);
    else setStep(step + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  if (done) {
    const result = computeResult(answers, products);
    const line = lines.find((l) => l.slug === result.line)!;
    const copy = lineCopy[line.slug];
    return (
      <div data-line={line.slug} className="bg-line-bg text-line-text">
        <section className="container-benza grid items-center gap-10 py-20 sm:py-36 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-brand bg-line-tone">
            <Image
              src={`/assets/photos/${line.photo}`}
              alt={t(linePhotoAlt[line.slug])}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <span className="label text-line-accent">{t("[ O seu resultado ]")}</span>
            <h1
              ref={heading}
              tabIndex={-1}
              className="text-[clamp(56px,7vw,110px)] leading-[0.92] outline-none"
            >
              {t("Você é")}{" "}<em>{line.name}</em>
            </h1>
            <p className="font-brand text-2xl italic text-sand-muted">({t(copy.poem)})</p>
            <p className="max-w-[480px] text-[17px] leading-relaxed">
              {t(copy.description)} {t("Separamos três produtos para o seu momento: {moment}.", { moment: t(line.moment).toLowerCase() })}
            </p>
            <ul className="flex flex-wrap gap-2" aria-label={t("Suas respostas")}>
              {result.profile.map((p) => (
                <li key={p} className="rounded-pill border border-sand/30 px-3 py-1 text-sm">
                  {t(p)}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2.5">
              <Link href={`/linhas/${line.slug}`} className="btn bg-line-accent text-line-bg hover:opacity-90">
                {t("Ver a linha {name} →", { name: line.name })}
              </Link>
              <button type="button" onClick={restart} className="btn border border-sand/60 hover:bg-sand hover:text-ink">
                {t("Refazer o quiz")}</button>
            </div>
          </div>
        </section>

        <section className="bg-cream text-ink">
          <div className="container-benza py-20 sm:py-36">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(40px,4vw,56px)] leading-none">
                {t("Para começar,")}{" "}<em className="text-accent-dark">{t("estes três")}</em>
              </h2>
              <button
                type="button"
                onClick={() => result.products.forEach((p) => add(p.slug))}
                className="btn bg-red text-white hover:opacity-90"
              >
                {t("Adicionar os três à sacola")}</button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
              {result.products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/15 pt-6">
              <span className="label text-accent-dark">{t("Mande o quiz para alguém")}</span>
              <ShareButtons path="/quiz" text={t("Qual linha da benza combina com você? Faça o quiz:")} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  const progress = ((step + (chosen ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="bg-ink text-sand">
      <div className="container-benza flex min-h-[calc(100svh-120px)] flex-col gap-8 py-16 sm:py-28">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="label text-accent">
              [{String(step + 1).padStart(2, "0")}/{String(questions.length).padStart(2, "0")}]
            </span>
            <span className="label text-sand/70">{t("Quiz benza")}</span>
          </div>
          <div
            role="progressbar"
            aria-label={t("Progresso do quiz")}
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={step + (chosen ? 1 : 0)}
            className="h-[3px] w-full bg-sand/15"
          >
            <div className="h-full bg-red transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <fieldset className="flex flex-1 flex-col gap-8">
          <legend className="mb-8 w-full">
            <h1
              ref={heading}
              tabIndex={-1}
              className="max-w-[900px] text-[clamp(44px,6vw,96px)] leading-[0.95] outline-none"
            >
              {t(q.title)} <em>{t(q.emphasis)}</em>
            </h1>
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {q.options.map((o) => {
              const on = chosen === o.id;
              return (
                <label
                  key={o.id}
                  className={`flex min-h-[88px] cursor-pointer flex-col justify-center gap-1 rounded-brand border p-5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                    on ? "border-red bg-red text-white" : "border-sand/30 hover:border-sand"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={o.id}
                    checked={on}
                    onChange={() => setAnswers({ ...answers, [q.id]: o.id })}
                    className="sr-only"
                  />
                  <span className="text-2xl leading-tight">{t(o.label)}</span>
                  {o.hint && <span className={`text-sm ${on ? "text-white/90" : "text-sand-muted"}`}>{t(o.hint)}</span>}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="label inline-flex min-h-[var(--tap)] items-center underline underline-offset-4 disabled:opacity-30"
          >
            {t("← Voltar")}</button>
          <button
            type="button"
            onClick={next}
            disabled={!chosen}
            className="btn bg-red text-white hover:opacity-90 disabled:opacity-40"
          >
            {step === questions.length - 1 ? t("Ver meu resultado") : t("Continuar →")}
          </button>
        </div>
      </div>
    </div>
  );
}
