import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getT } from "@/lib/i18n/server";

// Página criada, mas fora de menu, home, rodapé e buscadores até os fundadores confirmarem que há ao menos
// uma benzedeira ou pesquisadora com acordo fechado. Em produção (Vercel) ela responde 404, a menos que
// SHOW_WHY_BENZA=1 esteja definido; em dev e em previews fica acessível pela URL.
const visible = process.env.VERCEL_ENV !== "production" || process.env.SHOW_WHY_BENZA === "1";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Por que Benza — benza"), robots: { index: false, follow: false } };
}

// Placeholder visível: nada aqui foi inventado (nomes, retratos, citações, termos e e-mail ainda não existem).
function Ph({ children }: { children: React.ReactNode }) {
  return <span className="rounded-sm border border-dashed border-current/40 px-1.5 py-0.5">{children}</span>;
}

export default async function PorQueBenzaPage() {
  if (!visible) notFound();
  const t = await getT();

  const row = "container-benza grid gap-6 py-16 sm:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16";
  const label = "label text-accent-dark lg:pt-3";
  const body = "flex max-w-[640px] flex-col gap-5 text-[17px] leading-relaxed";

  return (
    <main>
      <section className="bg-ink text-sand">
        <div className="container-benza flex flex-col gap-8 py-20 sm:py-36">
          <span className="label text-accent">{t("[Rascunho · página ainda não publicada]")}</span>
          <h1 className="text-[clamp(56px,7vw,110px)] font-medium leading-[0.9]">{t("Por que Benza")}</h1>
          <p className="max-w-[620px] font-brand text-[clamp(22px,2.4vw,30px)] italic leading-snug text-sand">
            {t("(benza, v.) Do verbo benzer: abençoar, desejar bem, proteger. “Benza-te Deus”, frase de avó.")}
          </p>
        </div>
      </section>

      <section className="bg-cream text-ink">
        <div className={row}>
          <h2 className={label}>{t("De onde vem o nome")}</h2>
          <div className={body}>
            {/* CONFIRMAR com as pessoas envolvidas antes de publicar: "Muitas não cobram" vem de depoimentos em pesquisas acadêmicas. */}
            <p>{t("No Brasil, as benzedeiras abençoam quem as procura, com reza, ervas e as mãos. É uma prática antiga, aprendida e passada adiante, com raízes no catolicismo popular e em saberes indígenas e africanos. Muitas não cobram. Veem como um dom.")}</p>
            <p>{t("Demos esse nome à casa por causa desse gesto: cuidado, sem vergonha.")}</p>
          </div>
        </div>
      </section>

      <section className="bg-cream-deep text-ink">
        <div className={row}>
          <h2 className={label}>{t("O que não somos")}</h2>
          <div className={body}>
            <p>{t("Não somos religião nem benzedeiras. Não prometemos curar nada. Curamos produtos de prazer e cuidado íntimo. Pegamos uma palavra emprestada, e devemos algo por isso.")}</p>
          </div>
        </div>
      </section>

      <section className="bg-cream text-ink">
        <div className={row}>
          <h2 className={label}>{t("Quem")}</h2>
          <div className="flex flex-col gap-10">
            <p className="text-[15px] text-ink-muted"><Ph>{t("[Um bloco por pessoa: retrato, nome e uma frase curta, com as palavras dela.]")}</Ph></p>
            <div className="grid gap-8 sm:grid-cols-2">
              {[1, 2].map((n) => (
                <figure key={n} className="flex flex-col gap-4">
                  <div className="flex aspect-[4/5] items-end rounded-brand border border-dashed border-ink/40 bg-cream-deep p-5">
                    <span className="label text-ink-muted">{t("[Retrato feito com ela, com crédito]")}</span>
                  </div>
                  <figcaption className="flex flex-col gap-2">
                    <span className="text-2xl leading-none">{t("[Nome]")}</span>
                    <blockquote className="font-brand text-xl italic leading-snug">{t("[Frase dela, com as palavras dela]")}</blockquote>
                    <span className="label text-ink-muted">{t("[Crédito da foto]")}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-deep text-ink">
        <div className={row}>
          <h2 className={label}>{t("O que devemos")}</h2>
          <div className={body}>
            <p>{t("[Nome] e [nome] compartilharam [o quê: conhecimento, tempo, uma receita] conosco. Recebem [termos: cachê / parte da receita]. O que disseram é delas. Os produtos feitos com elas levam seus nomes. [Detalhes.]")}</p>
          </div>
        </div>
      </section>

      <section className="bg-cream text-ink">
        <div className={row}>
          <h2 className={label}>{t("Onde você vai ver isso")}</h2>
          <div className={body}>
            <p>{t("Em Mata e Rio, no Journal e por trás do selo BENZA Approved. [Ajustar depois.]")}</p>
          </div>
        </div>
      </section>

      <section className="bg-ink text-sand">
        <div className="container-benza grid gap-6 py-16 sm:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <h2 className="label text-accent lg:pt-3">{t("Corrija-nos")}</h2>
          <div className={body}>
            <p>{t("Se você pratica o benzimento, ou acha que erramos, escreva para [e-mail]. Preferimos ouvir de você.")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
