import { ApprovedStamp } from "./ApprovedStamp";

export function ApprovedBadge() {
  return (
    <span className="absolute left-3 top-3">
      <ApprovedStamp width={72} />
    </span>
  );
}
