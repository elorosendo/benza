"use client";

import { useEffect, useRef, useState } from "react";

// Sem checkout real: o botão "Finalizar" abre um aviso de protótipo.
export function CheckoutNotice({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Finalizar
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        aria-labelledby="checkout-title"
        className="m-auto w-[min(440px,calc(100vw-32px))] rounded-brand bg-cream p-8 text-ink backdrop:bg-black/60"
      >
        <h2 id="checkout-title" className="text-4xl leading-none">
          Isto é um <em>protótipo.</em>
        </h2>
        <p className="mt-4 leading-relaxed">
          Pagamento, login e estoque ficam fora do escopo desta versão. Sua sacola fica salva só neste navegador.
        </p>
        <button type="button" onClick={() => setOpen(false)} className="btn mt-6 bg-red text-white hover:opacity-90">
          Entendi
        </button>
      </dialog>
    </>
  );
}
