"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartProduct = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
  line: string;
};

type Line = { slug: string; qty: number };

type CartContextValue = {
  lines: (CartProduct & { qty: number })[];
  count: number;
  total: number;
  hasUnpriced: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
};

const STORAGE_KEY = "benza-bag";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  products,
  children,
}: {
  products: CartProduct[];
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((slug: string) => {
    setItems((cur) =>
      cur.some((l) => l.slug === slug)
        ? cur.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + 1, 20) } : l))
        : [...cur, { slug, qty: 1 }],
    );
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((cur) =>
      qty <= 0 ? cur.filter((l) => l.slug !== slug) : cur.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, 20) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => setItems((cur) => cur.filter((l) => l.slug !== slug)), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = items.flatMap((l) => {
      const p = products.find((x) => x.slug === l.slug);
      return p ? [{ ...p, qty: l.qty }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.price * l.qty, 0),
      hasUnpriced: lines.some((l) => !l.price),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      add,
      setQty,
      remove,
    };
  }, [items, products, drawerOpen, add, setQty, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fora do CartProvider");
  return ctx;
}
