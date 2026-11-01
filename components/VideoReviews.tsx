import Link from "@/components/Link";
import { getReviews, toCardData } from "@/lib/social";
import { formatCount } from "@/lib/catalog";
import { Rail } from "./Rail";
import { VideoCard } from "./VideoCard";
import { getT } from "@/lib/i18n/server";

// "Reviews em vídeo": a prova da curadoria, feita pela comunidade.
export async function VideoReviews() {
  const t = await getT();
  const reviews = getReviews().map(toCardData);
  return (
    <section className="bg-ink text-sand">
      <div className="container-benza py-24 sm:py-40">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="label text-accent">{t("[ Feito pela comunidade ]")}</span>
            <h2 className="text-[clamp(40px,4vw,56px)] leading-none">
              {t("Reviews")}{" "}<em>{t("em vídeo")}</em>
            </h2>
          </div>
          <Link href="/comunidade" className="label inline-flex min-h-[var(--tap)] items-center hover:text-accent">
            {t("{count} reviews · ver a comunidade →", { count: formatCount(reviews.length) })}
          </Link>
        </div>
        <Rail
          label={t("Reviews em vídeo")}
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
