import Link from "next/link";
import { getReviews, toCardData } from "@/lib/social";
import { formatCount } from "@/lib/catalog";
import { Rail } from "./Rail";
import { VideoCard } from "./VideoCard";

// "Reviews em vídeo": a prova da curadoria, feita pela comunidade.
export function VideoReviews() {
  const reviews = getReviews().map(toCardData);
  return (
    <section className="bg-ink text-sand">
      <div className="container-benza py-16 sm:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="label text-accent">[ Feito pela comunidade ]</span>
            <h2 className="text-[clamp(40px,4vw,56px)] leading-none">
              Reviews <em>em vídeo</em>
            </h2>
          </div>
          <Link href="/comunidade" className="label inline-flex min-h-[var(--tap)] items-center hover:text-accent">
            {formatCount(reviews.length)} reviews · ver a comunidade →
          </Link>
        </div>
        <Rail
          label="Reviews em vídeo"
          itemClass="[&>*]:w-[62%] sm:[&>*]:w-[calc((100%-32px)/3)] lg:[&>*]:w-[calc((100%-64px)/5)]"
          arrowClass="border-sand/60 hover:bg-sand hover:text-ink"
        >
          {reviews.map((r) => (
            <VideoCard key={r.id} review={r} />
          ))}
        </Rail>
      </div>
    </section>
  );
}
