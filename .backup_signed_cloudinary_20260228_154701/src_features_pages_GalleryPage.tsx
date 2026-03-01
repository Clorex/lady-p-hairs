"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Heart, Plus, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { uploadImageUnsigned, cldMasonry, cldLightbox } from "@/lib/cloudinary";

type GalleryImage = {
  id: string;
  url: string;
  category: string;
  likes: number;
};

const LS_KEY = "ladyP_gallery";

function loadGallery(): GalleryImage[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveGallery(images: GalleryImage[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(images));
  } catch {
    // ignore
  }
}

const categories = [
  { id: "all", label: "All" },
  { id: "wigs", label: "Wigs" },
  { id: "bundles", label: "Bundles" },
  { id: "styles", label: "Styles" },
  { id: "installations", label: "Installations" },
];

export const GalleryPage: React.FC = () => {
  const { isAdmin } = useApp();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setImages(loadGallery());
  }, []);

  useEffect(() => {
    saveGallery(images);
  }, [images]);

  const filteredImages = useMemo(() => {
    return activeCategory === "all" ? images : images.filter(img => img.category === activeCategory);
  }, [images, activeCategory]);

  const leftColumn = filteredImages.filter((_, i) => i % 2 === 0);
  const rightColumn = filteredImages.filter((_, i) => i % 2 === 1);

  const uploadGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);

    try {
      const selected = Array.from(files).slice(0, 12);
      const uploaded: GalleryImage[] = [];

      for (const f of selected) {
        const res = await uploadImageUnsigned(f, { folder: "lady-p-hairs/gallery" });
        uploaded.push({
          id: `g${Date.now()}_${Math.random().toString(16).slice(2)}`,
          url: res.url,
          category: "styles",
          likes: Math.floor(20 + Math.random() * 200),
        });
      }

      setImages(prev => [...uploaded, ...prev]);
    } catch (e: any) {
      setUploadError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 safe-area-top">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">
              Our <span className="text-gradient-peony">Gallery</span>
            </h1>
            <p className="text-sm text-gray-500">Aesthetic looks & transformations</p>
          </div>

          {isAdmin && (
            <div className="flex flex-col items-end">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => uploadGalleryFiles(e.target.files)}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  uploading ? "bg-gray-200 text-gray-400" : "bg-gradient-peony text-white"
                }`}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {uploading ? "Uploading..." : "Add Photos"}
              </button>
              {uploadError && <p className="text-[11px] text-red-500 mt-1 max-w-[160px] text-right">{uploadError}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
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

      {/* Empty state */}
      {images.length === 0 ? (
        <div className="px-4">
          <div className="bg-peony-50 border border-peony-100 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-700 font-medium">No gallery photos yet</p>
            <p className="text-xs text-gray-500 mt-1">
              {isAdmin
                ? "Use “Add Photos” to upload images to Cloudinary."
                : "Check back soon for new looks."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Masonry Grid */}
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
                    <img
                      src={cldMasonry(image.url)}
                      alt="Gallery"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
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
                    <img
                      src={cldMasonry(image.url)}
                      alt="Gallery"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
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
        </>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
            >
              <X className="w-8 h-8" />
            </motion.button>

            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={cldLightbox(selectedImage.url)}
              alt="Gallery"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
            >
              <Heart className="w-5 h-5 fill-peony-400 text-peony-400" />
              <span className="text-white font-medium">{selectedImage.likes} likes</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryPage;

