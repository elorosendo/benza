import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "diário — benza" };

const posts = [
  ["Guia", "[Título do artigo sobre o corpo]", "hands.jpg", "Silhueta de braços contra fundo terracota"],
  ["Ritual", "[Título do artigo sobre rituais]", "candle.jpg", "Vela acesa com ervas"],
  ["Cuidado", "[Título do artigo sobre cuidado íntimo]", "peach.jpg", "Pêssego com mel escorrendo"],
  ["Começar", "[Título do artigo para quem está começando]", "neck.jpg", "Pescoço e ombro com pele brilhante"],
];

export default function DiarioPage() {
  return (
    <main>
      <section className="bg-ink text-sand">
        <div className="container-benza flex flex-col gap-6 py-14 sm:py-20">
          <span className="chip label self-start text-accent">Diário</span>
          <h1 className="text-[clamp(56px,7vw,110px)] font-medium leading-[0.9]">
            Guias, rituais <em>e conversas.</em>
          </h1>
        </div>
      </section>
      <section className="bg-cream text-ink">
        <div className="container-benza grid gap-4 py-16 sm:grid-cols-2 sm:py-24 lg:grid-cols-4">
          {posts.map(([tag, title, photo, alt]) => (
            <article key={title} className="flex flex-col gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-brand bg-cream-deep">
                <Image src={`/assets/photos/${photo}`} alt={alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <span className="label text-accent-dark">{tag}</span>
              <h2 className="text-3xl leading-[1.05]">{title}</h2>
              <span className="label opacity-60">[Em breve]</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
