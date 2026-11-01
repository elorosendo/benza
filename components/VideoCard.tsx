"use client";

import Image from "next/image";
import Link from "@/components/Link";
import { useEffect, useRef, useState } from "react";
import { platformLabel } from "@/lib/socialLinks";
import type { VideoCardData } from "@/lib/social";
import { ShareButtons } from "./ShareButtons";
import { useT } from "@/lib/i18n/client";

// "1:24" -> 84 (segundos), para a barra de progresso imitar a duração real.
function seconds(d: string) {
  const [m, s] = d.split(":").map(Number);
  return (m || 0) * 60 + (s || 0) || 30;
}

function kbIndex(id: string) {
  return [...id].reduce((n, c) => n + c.charCodeAt(0), 0) % 3;
}

function PlayIcon() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

// Card vertical 9:16. Com arquivo de vídeo, toca sem som no hover; sem arquivo, mostra o pôster.
export function VideoCard({ review }: { review: VideoCardData }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const preview = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const canHover = () =>
    !!review.video && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const play = () => canHover() && preview.current?.play().catch(() => {});
  const stop = () => {
    const v = preview.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const label = t("Assistir: {caption}", { caption: t(review.caption) });

  return (
    <article className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={play}
        onMouseLeave={stop}
        onFocus={play}
        onBlur={stop}
        aria-label={label}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-brand bg-burgundy text-left"
      >
        <Image
          src={review.poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, 60vw"
          className={`kb kb-${kbIndex(review.id) + 1} object-cover`}
          style={{ animationDelay: `-${(kbIndex(review.id) * 5) % 16}s` }}
        />
        {review.video && (
          <video
            ref={preview}
            src={review.video}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
        <span aria-hidden="true" className="vc-grain pointer-events-none absolute" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
          <span
            className="vc-bar block h-full bg-white"
            style={{ animationDuration: `${Math.min(seconds(review.duration), 60)}s` }}
          />
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white">
          {platformLabel[review.platform]}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-white">
          {review.duration}
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <PlayIcon />
        </span>
        <span className="absolute inset-x-3 bottom-3 flex flex-col gap-0.5 text-white">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
            {t("Testado por {tester}", { tester: t(review.tester) })}
          </span>
          <span className="text-sm leading-snug">{t(review.productName)}</span>
        </span>
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && setOpen(false)}
        aria-label={t(review.caption)}
        className="m-auto max-h-[94svh] w-[min(94vw,420px)] overflow-y-auto rounded-brand bg-ink p-0 text-sand backdrop:bg-black/85"
      >
        {open && (
          <div className="flex flex-col">
            <div className="relative aspect-[9/16] w-full bg-burgundy">
              {review.video ? (
                <video src={review.video} controls autoPlay playsInline className="h-full w-full object-cover" />
              ) : (
                <>
                  <Image src={review.poster} alt="" fill sizes="420px" className={`kb kb-${kbIndex(review.id) + 1} object-cover`} />
                  <span aria-hidden="true" className="vc-grain pointer-events-none absolute" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/45 px-6 text-center font-mono text-xs uppercase tracking-[0.12em] text-white">
                    {t("[Vídeo em breve]")}</span>
                </>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("Fechar")}
                className="absolute right-2 top-2 inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center rounded-full bg-ink/80 text-sand"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                {t("{tester} · {handle} · testou por {time}", { tester: t(review.tester), handle: t(review.handle), time: t(review.testedFor) })}
              </p>
              <p className="leading-relaxed">{t(review.caption)}</p>
              <div className="flex flex-wrap gap-2.5">
                <Link href={review.productHref} className="btn bg-red text-white hover:opacity-90">
                  {t("Ver o produto")}</Link>
                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border border-sand/60 hover:bg-sand hover:text-ink"
                >
                  {t("Ver no {platform}", { platform: platformLabel[review.platform] })} ↗
                </a>
              </div>
              <ShareButtons path={review.productHref} text={t("{name} · testado pela comunidade benza.", { name: t(review.productName) })} />
            </div>
          </div>
        )}
      </dialog>
    </article>
  );
}
