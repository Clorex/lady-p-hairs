"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CATEGORIES } from "@/types";
import type { Product } from "@/types";
import { cldSquare } from "@/lib/cloudinary";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export const ShopPage: React.FC = () => {
  const router = useRouter();
  const { products, setCurrentPage, setSelectedProduct, addToCart, cartCount, cartTotal } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCartPreview, setShowCartPreview] = useState(false);

  const categoryProducts =
    activeCategory === "all"
      ? products
      : products.filter(p => String(p.category).toLowerCase() === activeCategory);

  const filteredProducts = categoryProducts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    router.push(`/product/${product.id}`);
  };

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-peony-100 px-4 py-4 safe-area-top">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-peony-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-peony-300"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCartPreview(!showCartPreview)}
            className="relative p-2.5 bg-peony-50 rounded-xl"
          >
            <ShoppingCart className="w-5 h-5 text-peony-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-peony-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-peony text-white shadow-soft"
                  : "bg-peony-50 text-gray-600 hover:bg-peony-100"
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cart Preview */}
      <AnimatePresence>
        {showCartPreview && cartCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 overflow-hidden"
          >
            <div className="bg-gradient-peony rounded-2xl p-4 text-white mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Cart ({cartCount} items)</span>
                <span className="text-lg font-bold">{"\u20A6"}{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setCurrentPage("cart")}
                className="w-full bg-white text-peony-600 font-semibold py-2.5 rounded-xl text-sm"
              >
                View Cart & Checkout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-semibold text-gray-800">
            {activeCategory === "all"
              ? "All Products"
              : CATEGORIES.find(c => c.id === activeCategory)?.label}
          </h2>
          <span className="text-xs text-gray-500">{filteredProducts.length} items</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-peony-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-peony-300" />
            </div>
            <p className="text-gray-500 text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft border border-peony-50 cursor-pointer group"
                >
                  <div className="relative aspect-square overflow-hidden" onClick={() => handleProductClick(product)}>
                    <img
                      src={cldSquare(product.images?.[0] || "")}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.featured && (
                        <span className="bg-peony-500 text-white text-[9px] font-bold px-2 py-1 rounded-full">
                          FEATURED
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full">
                          SALE
                        </span>
                      )}
                    </div>

                    {product.stockStatus === "outOfStock" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {product.stockStatus === "inStock" && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ scale: 1.1 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="absolute bottom-2 right-2 w-9 h-9 bg-white rounded-full shadow-soft flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ShoppingCart className="w-4 h-4 text-peony-600" />
                      </motion.button>
                    )}
                  </div>

                  <div className="p-3" onClick={() => handleProductClick(product)}>
                    <p className="text-[10px] text-peony-500 font-medium uppercase tracking-wide mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-1 mb-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] text-gray-500">
                        {product.reviews?.length > 0
                          ? `${(product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length).toFixed(1)} (${product.reviews.length})`
                          : "No reviews"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-peony-600">
                        {"\u20A6"}{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {"\u20A6"}{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShopPage;



