'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title: string;
  date: string;
  scrollToExpand: string;
  children: React.ReactNode;
}

const ScrollExpandMedia = ({
  mediaType,
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  children,
}: ScrollExpandMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', '250vh start'],
  });

  // Transform values for the expansion effect - video stays in place and only scales
  const videoScale = useTransform(scrollYProgress, [0, 0.6], [0.6, 1.4]);
  const videoOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const whiteOverlay = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const contentTranslateY = useTransform(scrollYProgress, [0, 0.7, 1], ['100vh', '100vh', '0vh']);
  const heroVisible = useTransform(scrollYProgress, [0, 0.95, 1], [1, 1, 0]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: mediaOpacity,
        }}
      />

      {/* Hero Section with Overlaid Text and Video */}
      <div className="relative z-10" style={{ height: '300vh' }}>
        {/* Fixed Media Section that doesn't move but only visible during hero scroll */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden"
          style={{ opacity: heroVisible }}
        >
          {/* White background overlay that appears on scroll */}
          <motion.div 
            className="absolute inset-0 bg-white z-10"
            style={{ opacity: whiteOverlay }}
          />
          
          <div className="w-full max-w-6xl mx-auto px-4 relative z-30">
            <motion.div
              className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl"
              style={{ 
                opacity: videoOpacity,
                scale: videoScale,
                transformOrigin: 'center center'
              }}
            >
              {mediaType === 'video' ? (
                <video
                  src={mediaSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={mediaSrc}
                  alt={title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Media overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
              
              {/* Overlaid Hero Text */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-center px-4"
                style={{ opacity: textOpacity }}
              >
                <div className="max-w-4xl">
                  <motion.h1 
                    className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 text-white drop-shadow-2xl"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    {title}
                  </motion.h1>
                  <motion.p 
                    className="text-lg md:text-xl lg:text-2xl mb-8 text-white drop-shadow-lg"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    {date}
                  </motion.p>
                  <motion.div
                    className="text-sm md:text-base text-white/90 drop-shadow-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.1 }}
                  >
                    {scrollToExpand}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <motion.div 
        className="relative z-20 bg-gradient-to-b from-sky-50 to-white min-h-screen py-20"
        style={{ y: contentTranslateY }}
      >
        <div className="container mx-auto px-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default ScrollExpandMedia;
