import Image from "next/image";

// Proporções reais dos SVGs de assets/brand (viewBox).
const WORDMARK_RATIO = 12623 / 3273;

type Background = "dark" | "light";

export function Wordmark({
  height = 34,
  background = "dark",
  color,
  priority = false,
}: {
  height?: number;
  background?: Background;
  color?: "coralsoft" | "sand" | "ink";
  priority?: boolean;
}) {
  const file = color ?? (background === "light" ? "ink" : "coralsoft");
  const src = `/assets/brand/wordmark-${file}.svg`;
  return (
    <Image
      src={src}
      alt="BENZA"
      width={Math.round(height * WORDMARK_RATIO)}
      height={height}
      priority={priority}
      style={{ height, width: "auto" }}
    />
  );
}

export function Tagline({
  width = 110,
  variant = "sand",
}: {
  width?: number;
  variant?: string;
}) {
  const RATIO = 5095 / 5299;
  return (
    <Image
      src={`/assets/brand/tagline-${variant}.svg`}
      alt="the good kind of secret"
      width={width}
      height={Math.round(width / RATIO)}
    />
  );
}
