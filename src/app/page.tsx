'use client';

import Link from 'next/link';
import { ArrowRight, Award, Users, MapPin, Star, Fish, Waves, Heart, Eye, Shield } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
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
        y: [-100, -200, -300], 
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0.8, 0],
        x: [0, 40, -30, 20, 0]
      }}
      transition={{ 
        duration: 12,
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
const SwimmingFish = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        initial={{ x: "-10vw", y: "50%" }}
        animate={{
          x: ["0vw", "110vw"],
          y: [`${50 + i * 5}%`, `${45 + i * 5}%`, `${55 + i * 5}%`, `${48 + i * 5}%`, `${50 + i * 5}%`]
        }}
        transition={{
          duration: 25 + i * 3,
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
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Generate bubble positions
  const [bubblePositions, setBubblePositions] = useState<number[]>([]);
  
  useEffect(() => {
    setBubblePositions(Array.from({ length: 25 }, () => Math.random() * 100));
  }, []);
  
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
      comment: "&ldquo;BlueBelong transformed my relationship with the ocean. The instructors create such a peaceful, connected experience.&rdquo;",
      role: "Open Water Diver",
      avatar: "S"
    },
    {
      name: "Dhruv", 
      rating: 5,
      comment: "&ldquo;The most calming and professional diving experience. I felt truly at home in the blue waters of Andaman.&rdquo;",
      role: "Advanced Diver",
      avatar: "D"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'rgb(225, 217, 203)' }}>
      
      {/* HERO SECTION - Framer Style */}
      <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">
        {/* Hero Gradient Wrapper */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-sky-300/10"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <SwimmingFish />
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/30 rounded-t-full transform translate-y-4 blur-lg scale-105"></div>
                
                {/* Archway Border Container */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-t-full border-2 border-white/20 overflow-hidden">
                  {/* Background Layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-t-full"></div>
                  
                  {/* Main Visual */}
                  <div className="relative aspect-[4/5] max-w-md mx-auto rounded-t-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400/30 via-cyan-500/20 to-blue-600/30"></div>
                    {/* Placeholder for diving image */}
                    <div className="absolute inset-0 flex items-center justify-center text-white/60 text-6xl">
                      <Fish className="animate-pulse" />
                    </div>
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

      {/* MAIN CONTENT */}
      <main>
        
        {/* BENEFITS SECTION - Framer Style */}
        <section ref={featuresRef} className="py-24 relative" style={{ backgroundColor: 'rgb(225, 217, 203)' }}>
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
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50"></div>
          
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
                  {/* Large Border Frame - Framer Style */}
                  <div className="border-2 border-sky-300 rounded-t-full rounded-b-lg overflow-hidden shadow-xl">
                    <div className="border border-sky-200 rounded-t-full rounded-b-lg overflow-hidden">
                      <div className="aspect-[4/5] bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center">
                        {/* Placeholder for instructor/diving image */}
                        <div className="text-sky-400 text-8xl">
                          <Users />
                        </div>
                      </div>
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
                  "                  &ldquo;At BlueBelong, we&apos;re experienced dive professionals helping you find peace, connection, 
                  and confidence in the underwater world. Whether you&apos;re seeking your first breath underwater 
                  or advancing your diving journey, we&apos;re here to guide you safely into the blue.&rdquo;"
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

        {/* TESTIMONIALS SECTION - Framer Style */}
        <section ref={testimonialsRef} className="py-24 relative" style={{ backgroundColor: 'rgb(239, 236, 229)' }}>
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
                    "                    {testimonial.comment}"
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
      </main>
    </div>
  );
}
