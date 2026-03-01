"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, Package, ShoppingBag, Calendar, TrendingUp, Check, X, ChevronLeft,
  Loader2, Image as ImageIcon, LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import type { Product } from "@/types";
import { uploadImageSigned, cldSquare, destroyImage, publicIdFromUrl } from "@/lib/cloudinary";

type Tab = "products" | "orders" | "bookings";

const emptyProduct = (): Product =>
  ({
    id: `p${Date.now()}`,
    title: "",
    price: 0,
    category: "wigs",
    description: "",
    images: [],
    stockStatus: "inStock",
    reviews: [],
    createdAt: new Date().toISOString().slice(0, 10),
    featured: false,
  } as unknown as Product);

export default function AdminPage() {
  const router = useRouter();
  const {
    setCurrentPage,
    setIsAdmin,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    deleteOrder,
    bookings,
    deleteBooking,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const stats = useMemo(() => ({
    totalProducts: products.length,
    inStock: products.filter(p => p.stockStatus === "inStock").length,
    outOfStock: products.filter(p => p.stockStatus === "outOfStock").length,
    featured: products.filter(p => p.featured).length,
  }), [products]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setIsAdmin(false);
    router.push("/");
    router.refresh();
  };

  const handleSaveProduct = (p: Product) => {
    const normalized: Product = {
      ...p,
      title: String((p as any).title || "").trim(),
      description: String((p as any).description || "").trim(),
      images: Array.isArray((p as any).images) ? (p as any).images.filter(Boolean) : [],
      createdAt: (p as any).createdAt || new Date().toISOString().slice(0, 10),
      price: Number((p as any).price || 0),
    } as Product;

    const exists = products.some(x => x.id === normalized.id);
    if (exists) updateProduct(normalized);
    else addProduct(normalized);

    setEditingProduct(null);
    setIsCreating(false);
  };

  const ProductEditor = ({ product }: { product: Product }) => {
    const [draft, setDraft] = useState<Product>(product);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    const remaining = Math.max(0, 6 - (draft.images?.length || 0));

    const uploadFiles = async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (remaining <= 0) { setUploadError("Max 6 images reached."); return; }

      setUploading(true);
      setUploadError(null);

      try {
        const selected = Array.from(files).slice(0, remaining);
        const urls: string[] = [];
        for (const f of selected) {
          const res = await uploadImageSigned(f, "products");
          urls.push(res.url);
        }
        setDraft(prev => ({ ...prev, images: [...(prev.images || []), ...urls] } as any));
      } catch (e: any) {
        setUploadError(e?.message || "Upload failed");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    };

    const removeImage = async (idx: number) => {
      const url = draft.images?.[idx];
      const pid = publicIdFromUrl(url || "");
      // remove from product immediately
      const next = [...(draft.images || [])];
      next.splice(idx, 1);
      setDraft({ ...draft, images: next } as any);

      // optional: also delete from Cloudinary (admin-only route)
      if (pid) await destroyImage(pid).catch(() => {});
    };

    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
        onClick={() => { setEditingProduct(null); setIsCreating(false); }}
      >
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto"
        >
          <h2 className="text-lg font-serif font-bold text-gray-800 mb-4">
            {isCreating ? "Add Product" : "Edit Product"}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600">Title</label>
              <input className="w-full px-4 py-3 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
                value={(draft as any).title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value } as any)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Price</label>
                <input type="number" className="w-full px-4 py-3 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
                  value={Number((draft as any).price || 0)}
                  onChange={(e) => setDraft({ ...draft, price: Number(e.target.value || 0) } as any)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Category</label>
                <select className="w-full px-4 py-3 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
                  value={String((draft as any).category || "wigs")}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value } as any)}
                >
                  <option value="wigs">Wigs</option>
                  <option value="bundles">Bundles</option>
                  <option value="frontal">Frontal</option>
                  <option value="closure">Closure</option>
                  <option value="revamp">Revamp Services</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Description</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300 resize-none"
                value={(draft as any).description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value } as any)}
              />
            </div>

            <div className="bg-peony-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Images</p>
                  <p className="text-xs text-gray-500">Max 6 • Signed upload (API key)</p>
                </div>

                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                  onChange={(e) => uploadFiles(e.target.files)}
                />

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading || remaining <= 0}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    uploading || remaining <= 0 ? "bg-gray-200 text-gray-400" : "bg-gradient-peony text-white"
                  }`}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  {uploading ? "Uploading..." : `Upload (${remaining} left)`}
                </button>
              </div>

              {uploadError && <p className="text-xs text-red-500 mb-2">{uploadError}</p>}

              {draft.images?.length ? (
                <div className="grid grid-cols-3 gap-2">
                  {draft.images.map((url, idx) => (
                    <div key={url + idx} className="relative rounded-xl overflow-hidden">
                      <img src={cldSquare(url)} className="w-full h-20 object-cover" alt="" loading="lazy" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Upload at least 1 image.</p>
              )}
            </div>

            <div className="flex items-center justify-between bg-peony-50 rounded-2xl px-4 py-3">
              <span className="text-sm text-gray-700">Stock</span>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, stockStatus: (draft as any).stockStatus === "inStock" ? "outOfStock" : "inStock" } as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  (draft as any).stockStatus === "inStock" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {(draft as any).stockStatus === "inStock" ? "In Stock" : "Out of Stock"}
              </button>
            </div>

            <div className="flex items-center justify-between bg-peony-50 rounded-2xl px-4 py-3">
              <span className="text-sm text-gray-700">Featured</span>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, featured: !(draft as any).featured } as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  (draft as any).featured ? "bg-peony-500 text-white" : "bg-white text-gray-700"
                }`}
              >
                {(draft as any).featured ? "Yes" : "No"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button onClick={() => { setEditingProduct(null); setIsCreating(false); }} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium">
              Cancel
            </button>
            <button
              onClick={() => handleSaveProduct(draft)}
              className="flex-1 py-3 bg-gradient-peony text-white rounded-xl font-medium"
              disabled={!String((draft as any).title || "").trim() || !(draft as any).images?.length}
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 min-h-screen">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-4 safe-area-top border-b border-peony-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage("home")} className="p-2 -ml-2 hover:bg-peony-50 rounded-full">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
            <h1 className="text-lg font-serif font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={logout} className="p-2 text-gray-500 hover:text-red-500">
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-peony rounded-2xl p-4 text-white">
            <Package className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
            <p className="text-xs opacity-80">Total Products</p>
          </div>
          <div className="bg-green-500 rounded-2xl p-4 text-white">
            <Check className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.inStock}</p>
            <p className="text-xs opacity-80">In Stock</p>
          </div>
          <div className="bg-red-500 rounded-2xl p-4 text-white">
            <X className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.outOfStock}</p>
            <p className="text-xs opacity-80">Out of Stock</p>
          </div>
          <div className="bg-peony-400 rounded-2xl p-4 text-white">
            <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.featured}</p>
            <p className="text-xs opacity-80">Featured</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: "products", label: "Products", icon: Package },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "bookings", label: "Bookings", icon: Calendar },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-gradient-peony text-white shadow-soft" : "bg-peony-50 text-gray-600 hover:bg-peony-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {activeTab === "products" && (
          <>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { setIsCreating(true); setEditingProduct(emptyProduct()); }}
              className="w-full mb-4 py-3 border-2 border-dashed border-peony-300 rounded-2xl text-peony-600 font-medium flex items-center justify-center gap-2 hover:bg-peony-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </motion.button>

            <div className="space-y-3">
              {products.map((product) => (
                <motion.div key={product.id} layout className="bg-white rounded-2xl p-4 shadow-soft border border-peony-50">
                  <div className="flex gap-3">
                    <img src={cldSquare(product.images?.[0] || "")} alt={product.title} className="w-16 h-16 object-cover rounded-xl bg-peony-50" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">{product.title}</h3>
                      <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                      <p className="text-sm font-bold text-peony-600 mt-1">₦{product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setIsCreating(false); setEditingProduct(product); }} className="p-2 bg-peony-50 rounded-lg text-peony-600">
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => confirm("Delete this product?") && deleteProduct(product.id)} className="p-2 bg-red-50 rounded-lg text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-peony-200 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              orders.map((o: any) => (
                <div key={o.id} className="bg-white rounded-2xl p-4 shadow-soft border border-peony-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{o.customerName}</p>
                      <p className="text-xs text-gray-500">{o.phone} • Pickup: {o.pickupDate}</p>
                      <p className="text-sm font-bold text-peony-600 mt-1">₦{Number(o.total || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => updateOrderStatus(o.id, o.status === "confirmed" ? "pending" : "confirmed")}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          o.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {o.status === "confirmed" ? "Confirmed" : "Pending"}
                      </button>
                      <button onClick={() => confirm("Delete this order?") && deleteOrder(o.id)} className="text-xs text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-peony-200 mx-auto mb-4" />
                <p className="text-gray-500">No bookings yet</p>
              </div>
            ) : (
              bookings.map((b: any) => (
                <div key={b.id} className="bg-white rounded-2xl p-4 shadow-soft border border-peony-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{b.name}</p>
                      <p className="text-xs text-gray-500">{b.phone}</p>
                      <p className="text-xs text-gray-700 mt-2"><span className="font-medium">Service:</span> {b.hairType}</p>
                      <p className="text-xs text-gray-700"><span className="font-medium">Preferred:</span> {b.preferredDate}</p>
                      {b.notes ? <p className="text-xs text-gray-500 mt-2 line-clamp-2">{b.notes}</p> : null}
                    </div>
                    <button onClick={() => confirm("Delete this booking?") && deleteBooking(b.id)} className="text-xs text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingProduct && <ProductEditor product={editingProduct} />}
      </AnimatePresence>
    </motion.div>
  );
}
