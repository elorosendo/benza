"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocalizedHref } from "@/lib/i18n/client";

// <Link> que acrescenta o idioma atual aos caminhos internos ("/quiz" -> "/en-us/quiz").
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const localize = useLocalizedHref();
  const h = typeof href === "string" ? localize(href) : href;
  return <NextLink href={h} {...props} />;
}
