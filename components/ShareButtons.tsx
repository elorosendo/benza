"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/client";

// Compartilhar: copiar link e WhatsApp. Sem rastreadores de terceiros.
export function ShareButtons({ path, text }: { path: string; text: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const url = () => `${window.location.origin}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const whatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url()}`)}`, "_blank", "noopener,noreferrer");
  };

  const btn =
    "label inline-flex min-h-[var(--tap)] items-center rounded-pill border border-current/30 px-4 hover:border-current";
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={copy} className={btn}>
        {copied ? "Link copiado ✓" : "Copiar link"}
      </button>
      <button type="button" onClick={whatsapp} className={btn}>
        {t("WhatsApp")}</button>
    </div>
  );
}
