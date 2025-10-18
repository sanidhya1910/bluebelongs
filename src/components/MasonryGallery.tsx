'use client';

import { useEffect, useRef, useState } from 'react';

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
  const gridRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const masonryInstance = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !gridRef.current || items.length === 0) return;

    const initMasonry = async () => {
      const Masonry = (await import('masonry-layout')).default;
      const imagesLoaded = (await import('imagesloaded')).default;

      // Initialize Masonry
      masonryInstance.current = new Masonry(gridRef.current!, {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-sizer',
        percentPosition: true,
        gutter: 16,
        transitionDuration: '0.3s',
        fitWidth: false,
        horizontalOrder: false,
      });

      // Wait for images to load before laying out
      const imgLoad = imagesLoaded(gridRef.current!);
      const masonry = masonryInstance.current;
      
      imgLoad.on('progress', () => {
        // Layout Masonry after each image loads
        masonry.layout();
      });

      imgLoad.on('always', () => {
        // Final layout when all images are loaded
        masonry.layout();
      });

      // Handle window resize
      const handleResize = () => {
        masonry.layout();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        masonry.destroy();
      };
    };

    const cleanup = initMasonry();

    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, [items, mounted]);

  // Re-layout when items change
  useEffect(() => {
    if (!mounted) return;
    
    const masonry = masonryInstance.current;
    if (masonry) {
      // Small delay to ensure DOM updates are complete
      setTimeout(() => {
        masonry.reloadItems();
        masonry.layout();
      }, 100);
    }
  }, [items, mounted]);

  if (!mounted) {
    return null; // Don't render during SSR
  }

  return (
    <div className="w-full px-4">
      <div ref={gridRef} className="masonry-grid">
        {/* Grid sizer for responsive column width */}
        <div className="masonry-sizer w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"></div>
        
        {items.map((item) => (
          <div
            key={item.id}
            className="masonry-item w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
          >
            <div
              className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
            >
              <img
                src={item.img}
                alt={`Gallery item ${item.id}`}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGallery;
