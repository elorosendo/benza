"use client";

import { useState } from "react";

export function AskBenza() {
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-red text-white">
      <div className="container-benza grid items-center gap-8 py-16 sm:py-[88px] lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-3">
          <span className="chip label self-start">Ask Benza · conselho de amiga</span>
          <p className="font-display text-[clamp(34px,3.4vw,50px)] leading-[1.05]">
            “[Pergunta real da comunidade — o que eu queria que alguém tivesse me dito antes.]”
          </p>
        </div>
        <form
          className="flex flex-col gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label htmlFor="ask-home" className="text-sm font-semibold">
            Mande a sua pergunta — anônima, sempre.
          </label>
          <div className="flex flex-wrap gap-2.5">
            <input
              id="ask-home"
              type="text"
              required
              placeholder="Escreva aqui…"
              className="min-h-[52px] flex-[1_1_240px] rounded-pill border border-white bg-transparent px-5 text-base text-white placeholder:text-white/80"
            />
            <button
              type="submit"
              className="min-h-[52px] rounded-pill bg-white px-[26px] text-sm font-semibold text-red hover:opacity-90"
            >
              Enviar
            </button>
          </div>
          <p role="status" className="min-h-5 text-sm">
            {sent && "[Protótipo] Pergunta registrada só neste navegador — nada foi enviado."}
          </p>
        </form>
      </div>
    </section>
  );
}
