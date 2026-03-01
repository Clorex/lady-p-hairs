"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getFeaturedProducts } from '@/data/products';
import type { Product } from '@/types';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export const HomePage: React.FC = () => {
  const { setCurrentPage, setSelectedProduct } = useApp();
  const featuredProducts = getFeaturedProducts();
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="relative px-4 pt-6 pb-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-peony p-6 text-white shadow-soft-lg">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4"
            >
              <Sparkles size={14} className="text-yellow-200" />
              <span className="text-xs font-medium">Premium Quality Hair</span>
            </motion.div>
            
            <h1 className="text-3xl font-serif font-bold leading-tight mb-3">
              Elevate Your
              <br />
              <span className="text-peony-100">Natural Beauty</span>
            </h1>
            
            <p className="text-white/90 text-sm mb-6 max-w-[200px]">
              Luxurious wigs, bundles & extensions crafted for the modern queen
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('shop')}
              className="inline-flex items-center gap-2 bg-white text-peony-600 font-semibold px-5 py-3 rounded-2xl shadow-soft hover:shadow-glow transition-shadow"
            >
              <ShoppingBag size={18} />
              Shop Now
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </motion.section>
      
      {/* Features */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4 mb-8"
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Star, label: 'Premium', sublabel: 'Quality' },
            { icon: Sparkles, label: '100%', sublabel: 'Human Hair' },
            { icon: ShoppingBag, label: 'Fast', sublabel: 'Pickup' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-3 text-center shadow-soft border border-peony-50"
            >
              <feature.icon className="w-5 h-5 text-peony-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-gray-800">{feature.label}</p>
              <p className="text-[10px] text-gray-500">{feature.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Featured Products */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-semibold text-gray-800">
            Featured <span className="text-gradient-peony">Collection</span>
          </h2>
          <button
            onClick={() => setCurrentPage('shop')}
            className="text-peony-600 text-sm font-medium flex items-center gap-1 hover:text-peony-700"
          >
            See All
            <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-2xl overflow-hidden shadow-soft border border-peony-50 cursor-pointer group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {product.originalPrice && (
                  <div className="absolute top-2 left-2 bg-peony-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    SALE
                  </div>
                )}
                {product.stockStatus === 'outOfStock' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="text-xs font-medium text-gray-800 line-clamp-1 mb-1">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-peony-600">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Brand Promise */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4 mt-8"
      >
        <div className="bg-gradient-soft rounded-3xl p-6 border border-peony-100">
          <h2 className="text-lg font-serif font-semibold text-gray-800 mb-4 text-center">
            The Lady P Promise
          </h2>
          <div className="space-y-3">
            {[
              '100% Premium Human Hair',
              'Long-lasting & Tangle-free',
              'Expert Installation Available',
              'Satisfaction Guaranteed',
            ].map((promise, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-peony-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="text-sm text-gray-700">{promise}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* CTA */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4 mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentPage('book')}
          className="w-full bg-gradient-peony-dark text-white font-semibold py-4 rounded-2xl shadow-soft-lg hover:shadow-glow transition-shadow"
        >
          Book Installation Appointment
        </motion.button>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;
 HomePage;


