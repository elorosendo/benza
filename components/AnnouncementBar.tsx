"use client";


import { useT } from "@/lib/i18n/client";

export function AnnouncementBar() {
  const t = useT();
  return (
    <div className="label bg-red px-4 py-2.5 text-center text-white">
      {t("Envio discreto para todo o Brasil · embalagem sem marca")}</div>
  );
}
