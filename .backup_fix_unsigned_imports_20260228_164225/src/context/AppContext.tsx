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

  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: "pending" | "confirmed") => void;
  deleteOrder: (orderId: string) => void;

  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  deleteBooking: (bookingId: string) => void;

  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;

  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addProduct: (product: Product) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LS_KEYS = {
  cart: "ladyP_cart",
  orders: "ladyP_orders",
  bookings: "ladyP_bookings",
  products: "ladyP_products",
  isAdmin: "ladyP_isAdmin",
};

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSave(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
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
  // product needs an id, so we don't navigate here directly:
  product: "/shop",
};

function hasAdminCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some(c => c.trim().startsWith("ladyP_admin=1"));
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [currentPage, _setCurrentPage] = useState<Page>(() => pageFromPath(pathname || "/"));
  useEffect(() => {
    _setCurrentPage(pageFromPath(pathname || "/"));
  }, [pathname]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => safeLoad<CartItem[]>(LS_KEYS.cart, []));
  const [orders, setOrders] = useState<Order[]>(() => safeLoad<Order[]>(LS_KEYS.orders, []));
  const [bookings, setBookings] = useState<Booking[]>(() => safeLoad<Booking[]>(LS_KEYS.bookings, []));
  const [products, setProducts] = useState<Product[]>(() => safeLoad<Product[]>(LS_KEYS.products, defaultProducts));

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const ls = safeLoad<boolean>(LS_KEYS.isAdmin, false);
    return ls || hasAdminCookie();
  });

  useEffect(() => safeSave(LS_KEYS.cart, cart), [cart]);
  useEffect(() => safeSave(LS_KEYS.orders, orders), [orders]);
  useEffect(() => safeSave(LS_KEYS.bookings, bookings), [bookings]);
  useEffect(() => safeSave(LS_KEYS.products, products), [products]);
  useEffect(() => safeSave(LS_KEYS.isAdmin, isAdmin), [isAdmin]);

  const setCurrentPage = useCallback((page: Page) => {
    router.push(pageToPath[page]);
  }, [router]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addOrder = useCallback((order: Order) => setOrders(prev => [order, ...prev]), []);
  const updateOrderStatus = useCallback((orderId: string, status: "pending" | "confirmed") => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);
  const deleteOrder = useCallback((orderId: string) => setOrders(prev => prev.filter(o => o.id !== orderId)), []);

  const addBooking = useCallback((booking: Booking) => setBookings(prev => [booking, ...prev]), []);
  const deleteBooking = useCallback((bookingId: string) => setBookings(prev => prev.filter(b => b.id !== bookingId)), []);

  const updateProduct = useCallback((product: Product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p)), []);
  const deleteProduct = useCallback((productId: string) => setProducts(prev => prev.filter(p => p.id !== productId)), []);
  const addProduct = useCallback((product: Product) => setProducts(prev => [product, ...prev]), []);

  return (
    <AppContext.Provider value={{
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
      updateProduct,
      deleteProduct,
      addProduct,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
