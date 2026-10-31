"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
};

// Imagem que abre ampliada num diálogo (Esc ou clique fora fecham).
export function ZoomImage({ src, alt, width, height, sizes, className = "", priority }: Props) {
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar: ${alt}`}
        className={`group block w-full cursor-zoom-in overflow-hidden rounded-brand ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === ref.current && setOpen(false)}
        aria-label={alt}
        className="m-auto max-h-[94svh] max-w-[min(94vw,1100px)] overflow-visible bg-transparent p-0 backdrop:bg-black/85"
      >
        {open && (
          <div className="relative">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="94vw"
              className="max-h-[90svh] w-auto rounded-brand object-contain"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="absolute right-2 top-2 inline-flex h-[var(--tap)] w-[var(--tap)] items-center justify-center rounded-full bg-ink/80 text-sand"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
