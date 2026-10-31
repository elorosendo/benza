import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, DM_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { getProducts } from "@/lib/catalog";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "benza — the good kind of secret",
  description:
    "Marketplace curado de sex wellness. Selecionamos, testamos e aprovamos.",
};

const cartProducts = getProducts().map((p) => ({
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  price: p.price,
  image: p.images[0],
  line: p.line,
}));

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${hanken.variable} ${dmMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <CartProvider products={cartProducts}>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
