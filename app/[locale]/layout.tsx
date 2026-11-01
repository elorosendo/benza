import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { AgeGate } from "@/components/AgeGate";
import { ScrollEffects } from "@/components/ScrollEffects";
import { getProducts } from "@/lib/catalog";
import { locales, localeMeta } from "@/lib/i18n/config";
import { messages } from "@/lib/i18n/messages";
import { getLocale, getT } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/client";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export function generateStaticParams() {
  return locales.map((l) => ({ locale: localeMeta[l].slug }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("benza — the good kind of secret"),
    description: t("Marketplace curado de sex wellness. Selecionamos, testamos e aprovamos."),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const t = await getT();
  const cartProducts = getProducts().map((p) => ({
    slug: p.slug,
    name: t(p.name),
    brand: t(p.brand),
    price: p.price,
    image: p.images[0],
    line: p.line,
  }));

  return (
    <html lang={locale} className={outfit.variable}>
      <body className="flex min-h-screen flex-col">
        <I18nProvider locale={locale} messages={messages[locale]}>
          <CartProvider products={cartProducts}>
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
            <CartDrawer />
            <AgeGate />
            <ScrollEffects />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
