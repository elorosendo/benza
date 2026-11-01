import Image from "next/image";

// Selo "benza approved": sempre inclinado 8° (sentido anti-horário), como nos pôsteres da marca.
export const STAMP_ROTATION = "-8deg";

export function ApprovedStamp({
  width = 72,
  priority = false,
  className = "",
}: {
  width?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/assets/brand/approved-stamp.svg"
      alt="benza approved"
      width={width}
      height={Math.round(width / (898 / 469))}
      priority={priority}
      className={className}
      style={{ rotate: STAMP_ROTATION }}
    />
  );
}
