import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { AgeGate } from "@/components/AgeGate";
import { getProducts } from "@/lib/catalog";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
      className={outfit.variable}
    >
      <body className="flex min-h-screen flex-col">
        <CartProvider products={cartProducts}>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
          <CartDrawer />
          <AgeGate />
        </CartProvider>
      </body>
    </html>
  );
}
