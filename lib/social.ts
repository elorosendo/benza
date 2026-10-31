import reviewsJson from "@/data/reviews.sample.json";
import { getProduct, type Product } from "./catalog";
import type { Platform } from "./socialLinks";

export type VideoReview = {
  id: string;
  productSlug: string;
  tester: string;
  handle: string;
  testedFor: string;
  platform: Platform;
  url: string;
  poster: string;
  video: string | null;
  duration: string;
  caption: string;
  quote: string;
};

export type Tester = { handle: string; name: string; count: number; platforms: Platform[] };

export function getReviews(): VideoReview[] {
  return reviewsJson.reviews as VideoReview[];
}

export function reviewsForProduct(slug: string): VideoReview[] {
  return getReviews().filter((r) => r.productSlug === slug);
}

export function productOf(review: VideoReview): Product | undefined {
  return getProduct(review.productSlug);
}

export function getTesters(): Tester[] {
  const map = new Map<string, Tester>();
  for (const r of getReviews()) {
    const t = map.get(r.handle) ?? { handle: r.handle, name: r.tester, count: 0, platforms: [] };
    t.count += 1;
    if (!t.platforms.includes(r.platform)) t.platforms.push(r.platform);
    map.set(r.handle, t);
  }
  return [...map.values()];
}

// Dados que o card de vídeo (componente de cliente) precisa, já resolvidos no servidor.
export type VideoCardData = VideoReview & { productName: string; productHref: string };

export function toCardData(r: VideoReview): VideoCardData {
  const p = productOf(r);
  return { ...r, productName: p?.name ?? "[Produto]", productHref: `/produto/${r.productSlug}` };
}
