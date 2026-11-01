"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/client";

const KEY = "benza-18";

// Placeholder da validação de idade (+18): só uma confirmação guardada neste navegador.
export function AgeGate() {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (open && d && !d.open) d.showModal();
  }, [open]);

  const confirm = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    ref.current?.close();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="age-title"
      onCancel={(e) => e.preventDefault()}
      className="m-auto w-[min(480px,calc(100vw-32px))] rounded-brand bg-ink p-8 text-sand backdrop:bg-black/80 sm:p-10"
    >
      <p className="chip label text-accent">+18</p>
      <h2 id="age-title" className="mt-4 text-5xl leading-[0.95]">
        {t("Você tem")}{" "}<em>{t("18 anos")}</em> {" "}{t("ou mais?")}</h2>
      <p className="mt-4 leading-relaxed text-sand-muted">
        {t("A benza vende produtos de bem-estar sexual para adultos. [Texto legal a definir.]")}</p>
      <div className="mt-8 flex flex-wrap gap-2.5">
        <button type="button" onClick={confirm} className="btn bg-red text-white hover:opacity-90">
          {t("Tenho 18 anos ou mais")}</button>
        <a href="https://www.google.com" className="btn border border-sand/60 hover:bg-sand hover:text-ink">
          {t("Sair")}</a>
      </div>
    </dialog>
  );
}
