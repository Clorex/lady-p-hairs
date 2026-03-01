"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Heart } from "lucide-react";
import { cldMasonry, cldLightbox } from "@/lib/cloudinary";

type GalleryImage = {
  id: string;
  url: string;
  category: string;
  likes: number;
};

const categories = [
  { id: "all", label: "All" },
  { id: "wigs", label: "Wigs" },
  { id: "bundles", label: "Bundles" },
  { id: "styles", label: "Styles" },
  { id: "installations", label: "Installations" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (Array.isArray(json?.images)) setImages(json.images);
    })();
  }, []);

  const filteredImages = useMemo(() => {
    return activeCategory === "all" ? images : images.filter(i => i.category === activeCategory);
  }, [images, activeCategory]);

  const leftColumn = filteredImages.filter((_, i) => i % 2 === 0);
  const rightColumn = filteredImages.filter((_, i) => i % 2 === 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="px-4 pt-6 pb-4 safe-area-top">
        <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">
          Our <span className="text-gradient-peony">Gallery</span>
        </h1>
        <p className="text-sm text-gray-500">Aesthetic looks & transformations</p>
      </div>

      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
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

      {filteredImages.length === 0 ? (
        <div className="px-4">
          <div className="bg-peony-50 border border-peony-100 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-700 font-medium">No gallery photos yet</p>
            <p className="text-xs text-gray-500 mt-1">Check back soon for new looks.</p>
          </div>
        </div>
      ) : (
        <div className="px-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              {leftColumn.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedImage(image)}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl"
                >
                  <img src={cldMasonry(image.url)} alt="Gallery" className="w-full h-auto object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="w-4 h-4 fill-peony-400 text-peony-400" />
                      <span className="text-xs">{image.likes}</span>
                    </div>
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3 pt-6">
              {rightColumn.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedImage(image)}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl"
                >
                  <img src={cldMasonry(image.url)} alt="Gallery" className="w-full h-auto object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="w-4 h-4 fill-peony-400 text-peony-400" />
                      <span className="text-xs">{image.likes}</span>
                    </div>
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
            >
              <X className="w-8 h-8" />
            </motion.button>

            <motion.img
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              src={cldLightbox(selectedImage.url)}
              alt="Gallery"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
