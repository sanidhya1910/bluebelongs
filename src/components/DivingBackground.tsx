'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Fish } from 'lucide-react';

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

interface SwimmingFish {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  type: 'small' | 'medium' | 'large';
}

interface LightRay {
  id: string;
  x: number;
  width: number;
  opacity: number;
  delay: number;
}

interface DivingBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  className?: string;
}

const DivingBackground: React.FC<DivingBackgroundProps> = ({
  intensity = 'medium',
  interactive = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [fish, setFish] = useState<SwimmingFish[]>([]);
  const [lightRays, setLightRays] = useState<LightRay[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  // Intensity settings
  const intensitySettings = {
    low: { bubbles: 15, fish: 2, lightRays: 3 },
    medium: { bubbles: 25, fish: 4, lightRays: 5 },
    high: { bubbles: 40, fish: 6, lightRays: 8 }
  };

  const settings = intensitySettings[intensity];

  // Generate bubbles
  const generateBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < settings.bubbles; i++) {
      newBubbles.push({
        id: `bubble-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        delay: Math.random() * 10
      });
    }
    setBubbles(newBubbles);
  }, [settings.bubbles]);

  // Generate swimming fish
  const generateFish = useCallback(() => {
    const newFish: SwimmingFish[] = [];
    const fishTypes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    
    for (let i = 0; i < settings.fish; i++) {
      newFish.push({
        id: `fish-${i}`,
        x: -10,
        y: Math.random() * 80 + 10,
        size: Math.random() * 15 + 10,
        speed: Math.random() * 2 + 0.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        type: fishTypes[Math.floor(Math.random() * fishTypes.length)]
      });
    }
    setFish(newFish);
  }, [settings.fish]);

  // Generate light rays
  const generateLightRays = useCallback(() => {
    const newLightRays: LightRay[] = [];
    for (let i = 0; i < settings.lightRays; i++) {
      newLightRays.push({
        id: `light-${i}`,
        x: Math.random() * 100,
        width: Math.random() * 15 + 5,
        opacity: Math.random() * 0.3 + 0.1,
        delay: Math.random() * 8
      });
    }
    setLightRays(newLightRays);
  }, [settings.lightRays]);

  // Mouse interaction handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  }, [interactive]);

  // Initialize effects
  useEffect(() => {
    if (!prefersReducedMotion) {
      generateBubbles();
      generateFish();
      generateLightRays();
    }
  }, [generateBubbles, generateFish, generateLightRays, prefersReducedMotion]);

  // Bubble component
  const BubbleElement = ({ bubble }: { bubble: Bubble }) => (
    <motion.div
      key={bubble.id}
      className="absolute rounded-full bg-white/20 backdrop-blur-sm border border-white/10"
      style={{
        left: `${bubble.x}%`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        opacity: bubble.opacity
      }}
      initial={{ y: '100vh', scale: 0 }}
      animate={{
        y: ['-20vh', '-120vh'],
        scale: [0, 1, 0.8, 0],
        x: [0, Math.sin(bubble.delay) * 50, Math.cos(bubble.delay) * 30, 0]
      }}
      transition={{
        duration: 15 + bubble.speed * 5,
        delay: bubble.delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  // Fish component
  const FishElement = ({ fishItem }: { fishItem: SwimmingFish }) => {
    const fishSizes = {
      small: 'w-4 h-4',
      medium: 'w-6 h-6',
      large: 'w-8 h-8'
    };

    return (
      <motion.div
        key={fishItem.id}
        className="absolute z-10"
        style={{ top: `${fishItem.y}%` }}
        initial={{ x: fishItem.direction > 0 ? '-10vw' : '110vw' }}
        animate={{
          x: fishItem.direction > 0 ? '110vw' : '-10vw',
          y: [
            `${fishItem.y}%`,
            `${fishItem.y + Math.sin(Date.now() * 0.001) * 5}%`,
            `${fishItem.y}%`
          ]
        }}
        transition={{
          duration: 30 + fishItem.speed * 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Fish 
          className={`${fishSizes[fishItem.type]} text-cyan-300/60 ${
            fishItem.direction < 0 ? 'scale-x-[-1]' : ''
          }`}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.3))'
          }}
        />
      </motion.div>
    );
  };

  // Light ray component
  const LightRayElement = ({ lightRay }: { lightRay: LightRay }) => (
    <motion.div
      key={lightRay.id}
      className="absolute top-0 h-full bg-gradient-to-b from-cyan-200/30 via-blue-200/10 to-transparent"
      style={{
        left: `${lightRay.x}%`,
        width: `${lightRay.width}%`,
        opacity: lightRay.opacity,
        transformOrigin: 'top center'
      }}
      animate={{
        opacity: [lightRay.opacity * 0.5, lightRay.opacity, lightRay.opacity * 0.3],
        scaleX: [0.8, 1.2, 0.9],
        rotate: [-2, 2, -1]
      }}
      transition={{
        duration: 8 + lightRay.delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay: lightRay.delay
      }}
    />
  );

  // Interactive ripple effect
  const RippleEffect = () => (
    interactive && (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 3], opacity: [0.8, 0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-20 h-20 rounded-full border-2 border-cyan-300/40" />
      </motion.div>
    )
  );

  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-blue-500/30 to-cyan-600/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-sky-300/10" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-blue-500/30 to-cyan-600/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-sky-300/10" />
      
      {/* Animated water texture */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.2) 0%, transparent 50%)
          `,
          backgroundSize: '400px 400px'
        }}
      />

      {/* Light rays from above */}
      {lightRays.map(lightRay => (
        <LightRayElement key={lightRay.id} lightRay={lightRay} />
      ))}

      {/* Floating bubbles */}
      {bubbles.map(bubble => (
        <BubbleElement key={bubble.id} bubble={bubble} />
      ))}

      {/* Swimming fish */}
      {fish.map(fishItem => (
        <FishElement key={fishItem.id} fishItem={fishItem} />
      ))}

      {/* Interactive ripples */}
      <RippleEffect />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-cyan-200/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, -60],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              delay: Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Caustic light patterns */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(34, 211, 238, 0.1) 20px,
              rgba(34, 211, 238, 0.1) 40px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 25px,
              rgba(59, 130, 246, 0.1) 25px,
              rgba(59, 130, 246, 0.1) 50px
            )
          `,
          backgroundSize: '200px 200px, 300px 300px'
        }}
      />

      {/* Ocean depth fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/40" />
    </div>
  );
};

export default DivingBackground;
