'use client';

import Link from 'next/link';
import { ArrowRight, Award, Users, MapPin, Star, Fish, Waves, Heart, Eye, Shield } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Masonry from '@/utils/masonry';
import { useRef, useState, useEffect } from 'react';

// Enhanced Coral SVG Component
const CoralIcon = ({ className }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    animate={{ 
      scale: [1, 1.08, 1],
      rotate: [0, 2, -2, 0]
    }}
    transition={{ 
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <path d="M12 2C8.5 2 8 4.5 8 6c0 1-1 2-2 3s-2 2-2 4c0 3 2 5 5 6h6c3-1 5-3 5-6 0-2-1-3-2-4s-2-2-2-3c0-1.5-.5-4-4-4z" opacity="0.8"/>
    <path d="M10 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" opacity="0.6"/>
    <path d="M14 10c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" opacity="0.6"/>
  </motion.svg>
);

// Wave Divider Component
const WaveDivider = ({ color = '#EFECE5', flip = false, className = '' }: { color?: string; flip?: boolean; className?: string }) => (
  <div className={`w-full overflow-hidden leading-none ${className}`} aria-hidden="true">
    <svg
      viewBox="0 0 1440 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`block w-full h-[80px] ${flip ? 'rotate-180' : ''}`}
      preserveAspectRatio="none"
    >
      <path
        d="M0,32 C120,52 240,72 360,72 C480,72 600,52 720,40 C840,28 960,24 1080,32 C1200,40 1320,60 1440,72 L1440,100 L0,100 Z"
        fill={color}
      />
    </svg>
  </div>
);

// Enhanced Bubble Animation
const Bubble = ({ delay, position, size = 'small' }: { delay: number; position: number; size?: 'small' | 'medium' | 'large' }) => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-5 h-5',
    large: 'w-7 h-7'
  };
  
  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} bg-white/25 rounded-full backdrop-blur-sm`}
      initial={{ y: 100, opacity: 0, scale: 0 }}
      animate={{ 
        y: [-60, -140, -220], 
        opacity: [0, 0.7, 0],
        scale: [0, 1, 0.85, 0],
        x: [0, 20, -15, 10, 0]
      }}
      transition={{ 
        duration: 20,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        left: `${position}%`,
        filter: 'blur(0.5px)'
      }}
    />
  );
};

// Fish Animation
const SwimmingFish = ({ count = 2, reduced = false }: { count?: number; reduced?: boolean }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {reduced ? null : [...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        initial={{ x: "-10vw", y: "50%" }}
        animate={{
          x: ["0vw", "110vw"],
          y: [`${50 + i * 5}%`, `${45 + i * 5}%`, `${55 + i * 5}%`, `${48 + i * 5}%`, `${50 + i * 5}%`]
        }}
        transition={{
          duration: 36 + i * 6,
          delay: i * 4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Fish className={`h-6 w-6 text-cyan-200/40 ${i === 1 ? 'scale-110' : i === 2 ? 'scale-90' : ''}`} />
      </motion.div>
    ))}
  </div>
);

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Generate bubble positions
  const [bubblePositions, setBubblePositions] = useState<number[]>([]);
  
  useEffect(() => {
    const count = prefersReducedMotion ? 0 : 14;
    setBubblePositions(Array.from({ length: count }, () => Math.random() * 100));
  }, [prefersReducedMotion]);
  
  const featuresInView = useInView(featuresRef, { once: true });
  const aboutInView = useInView(aboutRef, { once: true });
  const testimonialsInView = useInView(testimonialsRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });

  // Framer-style Benefits/Features Data
  const benefits = [
    {
      icon: <Award className="h-8 w-8 text-sky-600" />,
      title: "PROFESSIONAL TRAINING",
      description: "SSI certified courses from beginner to advanced levels",
      gradient: "from-sky-100/80 to-blue-100/80"
    },
    {
      icon: <Shield className="h-8 w-8 text-cyan-600" />,
      title: "SAFETY FIRST",
      description: "Experienced instructors ensuring your underwater safety",
      gradient: "from-cyan-100/80 to-teal-100/80"
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: "OCEAN CONNECTION", 
      description: "Discover your deeper relationship with marine life",
      gradient: "from-blue-100/80 to-indigo-100/80"
    }
  ];

  const testimonials = [
    {
      name: "Sanidhya",
      rating: 5,
      comment: "BlueBelong transformed my relationship with the ocean. The instructors create such a peaceful, connected experience.",
      role: "Open Water Diver",
      avatar: "S"
    },
    {
      name: "Dhruv", 
      rating: 5,
      comment: "The most calming and professional diving experience. I felt truly at home in the blue waters of Andaman.",
      role: "Advanced Diver",
      avatar: "D"
    }
  ];

  return (
  <div className="min-h-screen relative overflow-hidden sand-section">
      
      {/* HERO SECTION - Framer Style */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20" id="hero">
        {/* Hero Gradient Wrapper */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-sky-300/10"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <SwimmingFish reduced={!!prefersReducedMotion} />
          {bubblePositions.map((position, i) => (
            <Bubble 
              key={i} 
              delay={i * 0.3} 
              position={position} 
              size={i % 3 === 0 ? 'large' : i % 2 === 0 ? 'medium' : 'small'} 
            />
          ))}
        </div>

        {/* Hero Container */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            
            {/* Hero Content Column */}
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Waves className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">DIVING SCHOOL ANDAMAN</span>
              </motion.div>
              
              <motion.h1
                className="text-5xl md:text-7xl font-light mb-6 text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.2 }}
                style={{ fontFamily: 'Inter, serif' }}
              >
                <motion.span 
                  className="block mb-2"
                  style={{ display: 'inline-block' }}
                >
                  Finally Find Your
                </motion.span>
                <motion.span 
                  className="font-bold bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent"
                  style={{ display: 'inline-block' }}
                >
                  Ocean Connection
                </motion.span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-blue-100/90 mb-8 max-w-lg font-light leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.2 }}
              >
                Discover the underwater world of Andaman Islands with professional guidance, 
                connecting you to the ocean&apos;s magnificent depths.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 1.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Link 
                    href="/courses" 
                    className="inline-flex items-center gap-3 bg-white text-sky-600 hover:text-sky-700 font-semibold text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Eye className="h-5 w-5" />
                    Book My First Dive
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Hero Visual Column */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 1.2 }}
            >
              <div className="relative">
                {/* Shadow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/30 rounded-3xl transform translate-y-4 blur-lg scale-105"></div>
                
                {/* Archway Border Container */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border-2 border-white/20 overflow-hidden">
                  {/* Background Layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-3xl"></div>
                  
                  {/* Main Visual */}
                  <div className="relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden">
                    {/* Hero Diving Photo */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1600&auto=format&fit=crop)'
                      }}
                      aria-label="Scuba diver exploring coral reef"
                    />
                    {/* Soft overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent"></div>
                    {/* Coral Decorations */}
                    <CoralIcon className="absolute bottom-10 left-6 h-12 w-12 text-coral-400/40" />
                    <CoralIcon className="absolute bottom-16 right-8 h-8 w-8 text-coral-500/30" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wave divider to transition into next section (sand color) */}
      <WaveDivider color="rgb(225, 217, 203)" />

      {/* MAIN CONTENT */}
      <main>
        
        {/* BENEFITS SECTION - Framer Style */}
  <section ref={featuresRef} className="py-24 relative sand-section">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className={`relative p-8 rounded-3xl border border-white/20 backdrop-blur-sm bg-gradient-to-br ${benefit.gradient} shadow-lg hover:shadow-xl transition-all duration-500`}
                  initial={{ opacity: 0, y: 60 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 1 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                >
                  {/* Icon Circle */}
                  <motion.div
                    className="inline-flex p-4 rounded-full bg-white/80 backdrop-blur-sm mb-6 shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {benefit.icon}
                  </motion.div>
                  
                  {/* Text Content */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 tracking-wider uppercase">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT SECTION - Framer Style */}
        <section ref={aboutRef} className="py-24 relative" id="about">
          <div className="absolute inset-0 sand-gradient"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              
              {/* About Image Column */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -60 }}
                animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1.2 }}
              >
                <div className="relative">
                  {/* Large Border Frame with Underwater Instructor Photo */}
                  <div className="border-2 border-sky-300 rounded-3xl overflow-hidden shadow-xl">
                    <div className="border border-sky-200 rounded-3xl overflow-hidden">
                      <div 
                        className="aspect-[4/5] bg-cover bg-center"
                        style={{
                          backgroundImage: 'url(https://images.unsplash.com/photo-1518599807935-37015b9cefcb?q=80&w=1200&auto=format&fit=crop)'
                        }}
                        aria-label="Instructor guiding student underwater"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* About Content Column */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 60 }}
                animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 bg-sky-100 border border-sky-200 px-4 py-2 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={aboutInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <span className="text-sm font-medium text-sky-700">ABOUT YOUR INSTRUCTORS</span>
                </motion.div>
                
                {/* Main Heading with Framer Animation */}
                <motion.h2
                  className="text-4xl md:text-5xl font-light text-slate-800 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7, duration: 1 }}
                  style={{ fontFamily: 'Inter, serif' }}
                >
                  <motion.span 
                    className="inline-block"
                    initial={{ opacity: 0, filter: 'blur(10px)', transform: 'translateY(10px)' }}
                    animate={aboutInView ? { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' } : {}}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    We&apos;re
                  </motion.span>{' '}
                  <motion.span 
                    className="inline-block"
                    initial={{ opacity: 0, filter: 'blur(10px)', transform: 'translateY(10px)' }}
                    animate={aboutInView ? { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' } : {}}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    Here
                  </motion.span>{' '}
                  <motion.span 
                    className="inline-block"
                    initial={{ opacity: 0, filter: 'blur(10px)', transform: 'translateY(10px)' }}
                    animate={aboutInView ? { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' } : {}}
                    transition={{ delay: 1.0, duration: 0.6 }}
                  >
                    To
                  </motion.span>{' '}
                  <motion.span 
                    className="inline-block font-bold text-sky-700"
                    initial={{ opacity: 0, filter: 'blur(10px)', transform: 'translateY(10px)' }}
                    animate={aboutInView ? { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' } : {}}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    Guide You
                  </motion.span>
                </motion.h2>
                
                {/* Description */}
                <motion.p
                  className="text-lg text-slate-600 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.2, duration: 1 }}
                >
                  &quot;At BlueBelong, we&apos;re experienced dive professionals helping you find peace, connection, 
                  and confidence in the underwater world. Whether you&apos;re seeking your first breath underwater 
                  or advancing your diving journey, we&apos;re here to guide you safely into the blue.&quot;
                </motion.p>
                
                {/* Qualifications */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.4, duration: 1 }}
                >
                  <div className="flex items-center gap-3 text-sky-700 font-medium">
                    <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                    <span>SSI Certified Instructors</span>
                  </div>
                  <div className="flex items-center gap-3 text-sky-700 font-medium">
                    <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                    <span>15+ Years Combined Experience</span>
                  </div>
                </motion.div>
                
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.6, duration: 1 }}
                >
                  <Link 
                    href="/courses" 
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Your Diving Journey
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

    {/* GALLERY SECTION - Masonry */}
  <section className="py-16 relative overflow-hidden sand-section">
          <div className="container mx-auto px-4">
              <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-sky-100 border border-sky-200 px-4 py-2 rounded-full mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Fish className="h-4 w-4 text-sky-600" />
                <span className="text-sm font-medium text-sky-700">UNDERWATER GALLERY</span>
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-4">
                Dive into <span className="font-bold text-sky-700">Amazing Moments</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
                Discover the breathtaking underwater world through the eyes of our divers
              </p>
            </motion.div>
          </div>
          
          {/* Masonry gallery */}
          <div className="relative container mx-auto px-4">
            {(() => {
              const items = [
                {
                  id: 1,
                  title: "Coral Gardens",
                  desc: "Vibrant coral formations in crystal clear waters",
                  img: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80",
                  height: 520,
                  url: "#",
                },
                {
                  id: 2,
                  title: "Tropical Fish",
                  desc: "Schools of colorful tropical fish",
                  img: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=1200&q=80",
                  height: 420,
                  url: "#",
                },
                {
                  id: 3,
                  title: "Sea Turtle",
                  desc: "Gentle giants of the ocean",
                  img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
                  height: 640,
                  url: "#",
                },
                {
                  id: 4,
                  title: "Reef Diving",
                  desc: "Exploring pristine coral reefs",
                  img: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1200&q=80",
                  height: 460,
                  url: "#",
                },
                {
                  id: 5,
                  title: "Deep Blue",
                  desc: "Crystal clear underwater views",
                  img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
                  height: 380,
                  url: "#",
                },
                {
                  id: 6,
                  title: "Scuba Adventure",
                  desc: "Professional diving experiences",
                  img: "https://images.unsplash.com/photo-1582845512264-dbb30cd05e8e?auto=format&fit=crop&w=1200&q=80",
                  height: 500,
                  url: "#",
                },
                {
                  id: 7,
                  title: "Marine Life",
                  desc: "Diverse underwater ecosystem",
                  img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
                  height: 420,
                  url: "#",
                },
                {
                  id: 8,
                  title: "Underwater World",
                  desc: "Magical underwater landscapes",
                  img: "https://images.unsplash.com/photo-1588481123261-9b6a0cb5f584?auto=format&fit=crop&w=1200&q=80",
                  height: 560,
                  url: "#",
                },
              ];
              return (
                <Masonry
                  items={items}
                  animateFrom="bottom"
                  stagger={0.06}
                  duration={0.6}
                  blurToFocus
                  scaleOnHover
                  hoverScale={0.97}
                  colorShiftOnHover
                />
              );
            })()}
          </div>
          
          {/* Gallery description */}
          <div className="container mx-auto px-4 mt-12">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-600 font-light max-w-3xl mx-auto">
                Every dive tells a story. From the vibrant coral gardens to the mysterious depths, 
                experience the magic of Andaman&apos;s underwater world through our guided diving adventures.
              </p>
            </motion.div>
          </div>
        </section>

  {/* Wave divider between gallery and testimonials */}
  <WaveDivider color="rgb(239, 236, 229)" />

        {/* TESTIMONIALS SECTION - Framer Style */}
  <section ref={testimonialsRef} className="py-24 relative sand-section">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-4">
                What Our <span className="font-bold text-sky-700">Divers</span> Say
              </h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500"
                  initial={{ opacity: 0, y: 50 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.2, duration: 1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  {/* Rating Stars */}
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={testimonialsInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.5 + index * 0.2 + i * 0.1, duration: 0.3 }}
                      >
                        <Star className="h-5 w-5 text-amber-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Comment */}
                  <blockquote className="text-slate-700 mb-6 text-lg font-light leading-relaxed italic">
                    &quot;{testimonial.comment}&quot;
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION - Framer Style */}
  <section ref={ctaRef} className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-600"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-sky-300/20"></div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 4 + i,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 30}%`
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Fish className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">START YOUR JOURNEY</span>
              </motion.div>
              
              <motion.h2
                className="text-4xl md:text-5xl font-light mb-6 text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 1 }}
              >
                Ready to Discover <br />
                <span className="font-bold">Your Ocean Connection?</span>
              </motion.h2>
              
              <motion.p
                className="text-xl text-blue-100/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 1 }}
              >
                Book your diving course today and experience the breathtaking underwater world of Andaman. 
                Payment can be made face-to-face at our center in the pristine waters of Havelock Island.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9, duration: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Link href="/courses" className="bg-white text-sky-600 hover:text-sky-700 font-semibold text-lg px-10 py-4 rounded-full inline-flex items-center shadow-xl hover:shadow-2xl transition-all duration-300">
                    <Fish className="mr-3 h-5 w-5" />
                    Book Your Course Now
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Link href="/about" className="bg-transparent border-2 border-white/80 text-white hover:bg-white/10 backdrop-blur-sm font-semibold text-lg px-10 py-4 rounded-full inline-flex items-center transition-all duration-300">
                    <MapPin className="mr-3 h-5 w-5" />
                    Learn More
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

  {/* Wave divider into footer background */}
  <WaveDivider color="#f8fafc" flip className="-mt-[1px]" />
      </main>
    </div>
  );
}
