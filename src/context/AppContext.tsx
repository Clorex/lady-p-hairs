"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Product, CartItem, Page, Order, Booking } from "@/types";
import { products as defaultProducts } from "@/data/products";

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: "pending" | "confirmed") => void;
  deleteOrder: (orderId: string) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  deleteBooking: (bookingId: string) => void;

  // Admin
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;

  // Products (shared via /api/products)
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  refreshProducts: () => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LS = {
  cart: "ladyP_cart",
  orders: "ladyP_orders",
  bookings: "ladyP_bookings",
};

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSave(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function hasAdminCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith("ladyP_admin=1"));
}

function pageFromPath(pathname: string): Page {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/shop")) return "shop";
  if (pathname.startsWith("/gallery")) return "gallery";
  if (pathname.startsWith("/essence")) return "essence";
  if (pathname.startsWith("/book")) return "book";
  if (pathname.startsWith("/cart")) return "cart";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/product/")) return "product";
  return "home";
}

const pageToPath: Record<Page, string> = {
  home: "/",
  shop: "/shop",
  gallery: "/gallery",
  essence: "/essence",
  book: "/book",
  cart: "/cart",
  admin: "/admin",
  product: "/shop", // product needs an id route
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [currentPage, setCurrentPageState] = useState<Page>(() => pageFromPath(pathname || "/"));
  useEffect(() => setCurrentPageState(pageFromPath(pathname || "/")), [pathname]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => safeLoad<CartItem[]>(LS.cart, []));
  const [orders, setOrders] = useState<Order[]>(() => safeLoad<Order[]>(LS.orders, []));
  const [bookings, setBookings] = useState<Booking[]>(() => safeLoad<Booking[]>(LS.bookings, []));

  // Only from cookie (prevents random users from seeing admin-only UI)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => hasAdminCookie());

  const [products, setProducts] = useState<Product[]>(defaultProducts);

  useEffect(() => safeSave(LS.cart, cart), [cart]);
  useEffect(() => safeSave(LS.orders, orders), [orders]);
  useEffect(() => safeSave(LS.bookings, bookings), [bookings]);

  const setCurrentPage = useCallback((page: Page) => router.push(pageToPath[page]), [router]);

  // --- Products: load from server (shared store) ---
  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const json = await res.json();
      if (Array.isArray(json?.products)) setProducts(json.products);
    } catch {
      setProducts(defaultProducts);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const persistProducts = useCallback(async (next: Product[]) => {
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: next }),
    });
    if (!res.ok) {
      console.warn("Failed to persist products:", await res.text().catch(() => ""));
    }
  }, []);

  // --- Cart ---
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) return removeFromCart(productId);
      setCart((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)));
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // --- Orders ---
  const addOrder = useCallback((order: Order) => setOrders((prev) => [order, ...prev]), []);
  const updateOrderStatus = useCallback((orderId: string, status: "pending" | "confirmed") => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? ({ ...o, status } as Order) : o)));
  }, []);
  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  // --- Bookings ---
  const addBooking = useCallback((booking: Booking) => setBookings((prev) => [booking, ...prev]), []);
  const deleteBooking = useCallback((bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  }, []);

  // --- Product CRUD (admin) ---
  const updateProduct = useCallback(
    async (product: Product) => {
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === product.id ? product : p));
        persistProducts(next);
        return next;
      });
    },
    [persistProducts]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== productId);
        persistProducts(next);
        return next;
      });
    },
    [persistProducts]
  );

  const addProduct = useCallback(
    async (product: Product) => {
      setProducts((prev) => {
        const next = [product, ...prev];
        persistProducts(next);
        return next;
      });
    },
    [persistProducts]
  );

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,

        selectedProduct,
        setSelectedProduct,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,

        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,

        bookings,
        addBooking,
        deleteBooking,

        isAdmin,
        setIsAdmin,

        products,
        setProducts,
        refreshProducts,
        updateProduct,
        deleteProduct,
        addProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
