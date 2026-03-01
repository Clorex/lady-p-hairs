"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  CreditCard,
  Building2,
  User,
  Upload,
  Check,
  Calendar,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { uploadImageSigned } from "@/lib/cloudinary";

export const CartPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    setCurrentPage,
    addOrder
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pickupDate: "",
    paymentProof: "", // Cloudinary URL
  });

  const [proofUploading, setProofUploading] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);
  const proofInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadProof = async (file: File) => {
    setProofError(null);
    setProofUploading(true);
    try {
      const res = await uploadImageSigned(file, "proof");
      setFormData(prev => ({ ...prev, paymentProof: res.url }));
    } catch (e: any) {
      setProofError(e?.message || "Upload failed");
    } finally {
      setProofUploading(false);
    }
  };

  const handleCheckout = () => {
    const order = {
      id: `o${Date.now()}`,
      customerName: formData.name,
      phone: formData.phone,
      items: [...cart],
      total: cartTotal,
      pickupDate: formData.pickupDate,
      paymentProof: formData.paymentProof,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    setCheckoutStep("success");
    setTimeout(() => {
      setCheckoutStep("cart");
      setCurrentPage("home");
    }, 4000);
  };

  if (cart.length === 0 && checkoutStep === "cart") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col items-center justify-center px-4 pb-24">
        <div className="w-24 h-24 bg-peony-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-peony-300" />
        </div>
        <h2 className="text-xl font-serif font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Browse our collection and add some beautiful hair to your cart</p>
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => setCurrentPage("shop")} className="btn-peony">
          Start Shopping
        </motion.button>
      </motion.div>
    );
  }

  if (checkoutStep === "success") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col items-center justify-center px-4 pb-24">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-12 h-12 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Order Placed!</h2>
        <p className="text-sm text-gray-500 mb-2 text-center">Thank you for your order. We will contact you shortly.</p>
        <p className="text-xs text-peony-600">Redirecting to home...</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-4 safe-area-top border-b border-peony-100">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => checkoutStep === "checkout" ? setCheckoutStep("cart") : setCurrentPage("shop")}
            className="p-2 -ml-2 hover:bg-peony-50 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
          <h1 className="text-lg font-serif font-semibold text-gray-800">
            {checkoutStep === "cart" ? `Shopping Cart (${cartCount})` : "Checkout"}
          </h1>
        </div>
      </div>

      {checkoutStep === "cart" ? (
        <>
          <div className="px-4 py-4 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-soft border border-peony-50"
              >
                <div className="flex gap-4">
                  <img src={item.product.images[0]} alt={item.product.title} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.title}</h3>
                    <p className="text-xs text-gray-500 capitalize mb-2">{item.product.category}</p>
                    <p className="text-lg font-bold text-peony-600">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeFromCart(item.product.id)} className="p-2 text-gray-400 hover:text-red-500 self-start">
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-peony-50">
                  <span className="text-xs text-gray-500">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-peony-50 text-peony-600">
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-peony-50 text-peony-600">
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="px-4 mt-4">
            <div className="bg-peony-50 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-green-600">Free (Pickup)</span>
              </div>
              <div className="border-t border-peony-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-xl font-bold text-peony-600">₦{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="fixed bottom-[80px] left-0 right-0 px-4 z-30">
            <div className="max-w-[430px] mx-auto">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCheckoutStep("checkout")}
                className="w-full bg-gradient-peony text-white font-semibold py-4 rounded-2xl shadow-soft-lg flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </motion.button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="px-4 py-4 space-y-4">
            {/* Bank Details */}
            <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl p-4 border border-green-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Bank Transfer Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-medium">Opay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-medium">0123456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Name</span>
                  <span className="font-medium">Lady P Hairs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-peony-600">₦{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., 0801 234 5678"
                  className="w-full px-4 py-4 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-12 pr-4 py-4 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
                  />
                </div>
              </div>

              {/* Payment proof upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Proof (Optional)</label>

                <input
                  ref={proofInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadProof(file);
                    if (proofInputRef.current) proofInputRef.current.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => proofInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-peony-200 rounded-2xl p-6 text-center hover:bg-peony-50 transition-colors"
                >
                  {proofUploading ? (
                    <div className="flex items-center justify-center gap-2 text-peony-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </div>
                  ) : formData.paymentProof ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
                        Proof uploaded
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <ImageIcon className="w-4 h-4" />
                        Tap to replace
                      </div>
                      <img
                        src={formData.paymentProof}
                        alt="Payment proof"
                        className="w-full max-h-48 object-cover rounded-xl"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-peony-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Upload screenshot of payment</p>
                      <p className="text-xs text-gray-400 mt-1">Tap to select an image</p>
                    </div>
                  )}
                </button>

                {proofError && <p className="text-xs text-red-500 mt-2">{proofError}</p>}
              </div>
            </div>
          </div>

          <div className="fixed bottom-[80px] left-0 right-0 px-4 z-30">
            <div className="max-w-[430px] mx-auto">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={!formData.name || !formData.phone || !formData.pickupDate}
                className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  formData.name && formData.phone && formData.pickupDate
                    ? "bg-gradient-peony text-white shadow-soft-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Check className="w-5 h-5" />
                Place Order (₦{cartTotal.toLocaleString()})
              </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CartPage;


