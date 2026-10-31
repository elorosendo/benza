import Image from "next/image";

// Proporção do SVG do logo (viewBox 802 x 266).
const WORDMARK_RATIO = 802 / 266;

type Color = "red" | "white" | "ink";

export function Wordmark({
  height = 34,
  color = "red",
  priority = false,
}: {
  height?: number;
  color?: Color;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/assets/brand/benza-${color}.svg`}
      alt="benza"
      width={Math.round(height * WORDMARK_RATIO)}
      height={height}
      priority={priority}
      style={{ height, width: "auto" }}
    />
  );
}

// A tagline é composta na fonte de display (Gaya Italic).
export function Tagline({
  width = 110,
  className = "text-red",
}: {
  width?: number;
  className?: string;
}) {
  return (
    <span
      className={`block font-brand italic leading-none ${className}`}
      style={{ fontSize: Math.round(width / 6.2) }}
    >
      the good kind of secret
    </span>
  );
}
