'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: string | number;
  img: string;
  url?: string;
  title?: string;
  desc?: string;
}

interface MasonryGalleryProps {
  items: GalleryItem[];
}

const MasonryGallery = ({ items }: MasonryGalleryProps) => {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <>
      {/* CSS Columns Masonry Grid */}
      <div className="masonry-grid w-full max-w-7xl mx-auto px-4">

        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="mb-4 break-inside-avoid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
          >
            <div
              className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer group"
              onClick={() => setLightbox(item)}
            >
              <Image
                src={item.img}
                alt={item.title || `Gallery item ${item.id}`}
                width={800}
                height={600}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
                unoptimized
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Zoom icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Title & description overlay */}
              {(item.title || item.desc) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  {item.title && (
                    <h4 className="text-white font-semibold text-sm mb-1 drop-shadow-md">
                      {item.title}
                    </h4>
                  )}
                  {item.desc && (
                    <p className="text-white/80 text-xs line-clamp-2 drop-shadow">
                      {item.desc}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative max-w-5xl max-h-[90vh] w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors z-10"
                aria-label="Close lightbox"
              >
                <X className="h-8 w-8" />
              </button>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={lightbox.img}
                  alt={lightbox.title || 'Gallery image'}
                  width={1600}
                  height={1200}
                  className="w-full h-auto max-h-[85vh] object-contain bg-black/50"
                  unoptimized
                  priority
                />

                {/* Caption */}
                {(lightbox.title || lightbox.desc) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    {lightbox.title && (
                      <h3 className="text-white font-bold text-lg mb-1">{lightbox.title}</h3>
                    )}
                    {lightbox.desc && (
                      <p className="text-white/80 text-sm">{lightbox.desc}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MasonryGallery;
