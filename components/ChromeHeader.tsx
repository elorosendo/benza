"use client";

import { useHomeVariant } from "@/lib/useHomeVariant";
import type { Category, Line } from "@/lib/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { HeaderAlt } from "./HeaderAlt";

type Props = {
  categories: Category[];
  lines: Line[];
  menuLines: Record<string, string>;
};

// Escolhe o header conforme a variação da home (?v=). Fora da home, sempre o padrão.
export function ChromeHeader(props: Props) {
  const variant = useHomeVariant();
  if (variant === 2 || variant === 3) {
    return <HeaderAlt variant={variant} categories={props.categories} />;
  }
  return (
    <>
      <AnnouncementBar />
      <Header {...props} />
    </>
  );
}
