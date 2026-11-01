"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "@/components/Link";
import { formatPrice } from "@/lib/catalog";
import { answerGeneral, answerProduct, type AiAnswer, type AiProduct } from "@/lib/aiMock";
import { useLocale, useT } from "@/lib/i18n/client";

type Msg =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "ai"; answer: AiAnswer; shown: number; done: boolean };

// Chat de IA SIMULADO (protótipo): responde com regras locais, sem enviar nada a nenhuma API.
export function AiChat({
  products,
  mode = "general",
  product,
  suggestions,
  placeholder,
}: {
  products: AiProduct[];
  mode?: "general" | "product";
  product?: AiProduct;
  suggestions: string[];
  placeholder: string;
}) {
  const t = useT();
  const locale = useLocale();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const idRef = useRef(1);
  const timers = useRef<number[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, thinking]);

  const ask = (raw: string) => {
    const q = raw.trim();
    if (!q || thinking) return;
    const uid = idRef.current++;
    setMsgs((m) => [...m, { id: uid, role: "user", text: q }]);
    setInput("");
    setThinking(true);
    const answer = mode === "product" && product ? answerProduct(q, product, t) : answerGeneral(q, products, t);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(
      window.setTimeout(() => {
        const aid = idRef.current++;
        const words = answer.text.split(" ").length;
        setThinking(false);
        setMsgs((m) => [...m, { id: aid, role: "ai", answer, shown: reduce ? words : 0, done: reduce }]);
        if (reduce) return;
        let n = 0;
        const tick = window.setInterval(() => {
          n += 1;
          setMsgs((m) => m.map((x) => (x.id === aid && x.role === "ai" ? { ...x, shown: n, done: n >= words } : x)));
          if (n >= words) clearInterval(tick);
        }, 38);
        timers.current.push(tick);
      }, 900),
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setMsgs([]);
    setThinking(false);
  };

  const chip =
    "inline-flex min-h-[var(--tap)] items-center rounded-pill border border-sand/30 px-4 text-left text-sm hover:border-sand disabled:opacity-40";

  return (
    <div className="flex flex-col overflow-hidden rounded-brand bg-deep text-sand">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--sand-line)] px-5 py-3">
        <span className="label flex items-center gap-2 text-accent">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red motion-safe:animate-pulse" />
          {t("IA da benza · protótipo")}
        </span>
        {msgs.length > 0 && (
          <button type="button" onClick={reset} className="label inline-flex min-h-[var(--tap)] items-center underline underline-offset-4 hover:text-accent">
            {t("Nova conversa")}
          </button>
        )}
      </div>

      <div ref={logRef} role="log" aria-live="polite" aria-label={t("Conversa com a IA da benza")} className="flex max-h-[520px] min-h-[200px] flex-col gap-5 overflow-y-auto px-5 py-6">
        {msgs.length === 0 && (
          <p className="max-w-[520px] text-[17px] leading-relaxed text-sand-muted">
            {mode === "product"
              ? t("Pergunte qualquer coisa sobre este produto. Eu respondo só com os dados e as reviews da benza.")
              : t("Conte o que você procura, do seu jeito. Eu busco só entre os produtos aprovados e mostro de onde veio cada sugestão.")}
          </p>
        )}

        {msgs.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="self-end rounded-2xl rounded-br-sm bg-red px-4 py-2.5 text-white">
              {m.text}
            </div>
          ) : (
            <div key={m.id} className="flex max-w-[640px] flex-col gap-4">
              <p className="leading-relaxed">
                {m.answer.text.split(" ").slice(0, m.shown).join(" ")}
                {!m.done && <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-sand motion-safe:animate-pulse" />}
              </p>
              {m.done && m.answer.items.length > 0 && (
                <ul className="flex flex-col gap-2.5">
                  {m.answer.items.map(({ product: p, why }) => (
                    <li key={p.slug}>
                      <Link
                        href={`/produto/${p.slug}`}
                        className="flex items-center gap-4 rounded-xl border border-[var(--sand-line)] p-3 hover:border-sand/50"
                      >
                        <span className="relative h-[70px] w-14 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                          {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" />}
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="font-medium">{t(p.name)}</span>
                          <span className="text-sm text-sand-muted">{t(p.brand)} · {formatPrice(p.price, locale, t)}</span>
                          <span className="text-sm text-accent">{why}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {m.done && m.answer.sources.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="label text-sand/60">{t("Fontes")}</span>
                  {m.answer.sources.map((s) => (
                    <Link key={s.href + s.label} href={s.href} className="inline-flex min-h-[var(--tap)] items-center rounded-pill border border-sand/25 px-3 text-xs hover:border-sand">
                      {s.label} ↗
                    </Link>
                  ))}
                </div>
              )}
              {m.done && (
                <p className="label text-sand/50">
                  {t("Resposta simulada. A IA de verdade usará só as reviews da comunidade e não substitui orientação médica.")}
                </p>
              )}
            </div>
          ),
        )}

        {thinking && (
          <div className="flex items-center gap-1.5 text-sand-muted" role="status" aria-label={t("A IA está pensando")}>
            {[0, 1, 2].map((i) => (
              <span key={i} aria-hidden="true" className="h-2 w-2 rounded-full bg-sand/70 motion-safe:animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--sand-line)] p-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} type="button" disabled={thinking} onClick={() => ask(t(s))} className={chip}>
              {t(s)}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <label htmlFor={`ai-${mode}`} className="sr-only">{t("Sua pergunta")}</label>
          <input
            id={`ai-${mode}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="min-h-[52px] flex-1 rounded-pill border border-sand/30 bg-transparent px-5 text-base placeholder:text-sand/50"
          />
          <button type="submit" disabled={thinking || !input.trim()} className="btn bg-red text-white hover:opacity-90 disabled:opacity-40">
            {t("Perguntar")}
          </button>
        </form>
      </div>
    </div>
  );
}
