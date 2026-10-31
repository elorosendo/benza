"use client";

import { useState } from "react";

// "Quero testar": formulário mock, nada é enviado.
export function CommunityForm() {
  const [sent, setSent] = useState(false);
  const field =
    "min-h-[52px] w-full rounded-pill border border-white bg-transparent px-5 text-base text-white placeholder:text-white/80";
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label htmlFor="cm-nome" className="sr-only">Nome</label>
      <input id="cm-nome" required placeholder="Seu nome" className={field} />
      <label htmlFor="cm-perfil" className="sr-only">Seu perfil</label>
      <input id="cm-perfil" placeholder="@seu-perfil (opcional)" className={field} />
      <label htmlFor="cm-mail" className="sr-only">E-mail</label>
      <input id="cm-mail" type="email" required placeholder="Seu e-mail" className={field} />
      <button type="submit" className="min-h-[52px] rounded-pill bg-white px-6 text-sm font-semibold text-red hover:opacity-90">
        Quero testar
      </button>
      <p role="status" className="min-h-5 text-sm text-white">
        {sent && "[Protótipo] Cadastro registrado só neste navegador — nada foi enviado."}
      </p>
    </form>
  );
}
