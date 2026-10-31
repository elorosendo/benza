import Image from "next/image";

export function ApprovedBadge() {
  return (
    <span className="absolute left-3 top-3">
      <Image src="/assets/brand/approved-stamp.svg" alt="benza approved" width={72} height={38} />
    </span>
  );
}
