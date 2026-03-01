"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cldPortrait, cldSquare } from "@/lib/cloudinary";

export const ProductPage: React.FC = () => {
  const { selectedProduct, setCurrentPage, addToCart, cart } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  if (!selectedProduct) {
    setCurrentPage("shop");
    return null;
  }

  const cartItem = cart.find(item => item.product.id === selectedProduct.id);
  const inCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(selectedProduct);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  const averageRating =
    selectedProduct.reviews?.length > 0
      ? selectedProduct.reviews.reduce((a, r) => a + r.rating, 0) / selectedProduct.reviews.length
      : 0;

  const mainImage = selectedProduct.images?.[selectedImage] || "";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentPage("shop")}
            className="p-2 -ml-2 hover:bg-peony-50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.9 }} className="p-2 hover:bg-peony-50 rounded-full">
              <Heart className="w-5 h-5 text-gray-700" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="p-2 hover:bg-peony-50 rounded-full">
              <Share2 className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="aspect-[4/5] relative overflow-hidden">
          <img src={cldPortrait(mainImage)} alt={selectedProduct.title} className="w-full h-full object-cover" />

          {selectedProduct.images?.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {selectedProduct.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${selectedImage === index ? "w-6 bg-peony-500" : "bg-white/70"}`}
                />
              ))}
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {selectedProduct.featured && (
              <span className="bg-peony-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                FEATURED
              </span>
            )}
            {selectedProduct.originalPrice && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                SALE
              </span>
            )}
          </div>
        </motion.div>

        {selectedProduct.images?.length > 1 && (
          <div className="flex gap-2 px-4 mt-3 overflow-x-auto scrollbar-hide">
            {selectedProduct.images.map((img, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === index ? "border-peony-500" : "border-transparent"
                }`}
              >
                <img src={cldSquare(img)} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-4 mt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-peony-500 font-medium uppercase tracking-wide mb-1">{selectedProduct.category}</p>
            <h1 className="text-xl font-serif font-semibold text-gray-800">{selectedProduct.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-peony-600">{"\u20A6"}{selectedProduct.price.toLocaleString()}</p>
            {selectedProduct.originalPrice && (
              <p className="text-sm text-gray-400 line-through">{"\u20A6"}{selectedProduct.originalPrice.toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {averageRating.toFixed(1)} ({selectedProduct.reviews?.length || 0} reviews)
          </span>
        </div>

        {/* Stock status */}
        <div className="mt-4">
          {selectedProduct.stockStatus === "inStock" ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              <Check className="w-4 h-4" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="px-4 mt-6">
        <div className="flex border-b border-peony-100">
          {(["description", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab ? "text-peony-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="productTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-peony-500" />}
            </button>
          ))}
        </div>

        <div className="py-4">
          <AnimatePresence mode="wait">
            {activeTab === "description" ? (
              <motion.div
                key="description"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-sm text-gray-600 leading-relaxed"
              >
                {selectedProduct.description}
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {selectedProduct.reviews?.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No reviews yet</p>
                ) : (
                  selectedProduct.reviews.map((review: any) => (
                    <div key={review.id} className="bg-peony-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{review.customerName}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-green-600 mt-2">
                          <Check className="w-3 h-3" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Add to Cart Bar */}
      {selectedProduct.stockStatus === "inStock" && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-[80px] left-0 right-0 z-30 px-4">
          <div className="max-w-[430px] mx-auto">
            <div className="bg-white rounded-2xl shadow-soft-lg p-4 border border-peony-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-peony-50 rounded-xl px-3 py-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-peony-600"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="w-6 text-center font-semibold">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-peony-600"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-peony text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                  {inCart > 0 && (
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                      {inCart} in cart
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {showAddedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-[180px] left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Added to cart!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductPage;

