'use client';

import Link from 'next/link';
import { ArrowRight, Award, Users, MapPin, Star, Fish, Anchor, Waves } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Coral SVG Component
const CoralIcon = ({ className }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    animate={{ 
      scale: [1, 1.05, 1]
    }}
    transition={{ 
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <path d="M12 2C8.5 2 8 4.5 8 6c0 1-1 2-2 3s-2 2-2 4c0 3 2 5 5 6h6c3-1 5-3 5-6 0-2-1-3-2-4s-2-2-2-3c0-1.5-.5-4-4-4z"/>
    <path d="M10 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z"/>
    <path d="M14 10c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z"/>
  </motion.svg>
);

// Bubble Component
const Bubble = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-4 h-4 bg-white/20 rounded-full"
    initial={{ y: 100, opacity: 0 }}
    animate={{ 
      y: -100, 
      opacity: [0, 1, 0],
      x: [0, 30, -20, 10]
    }}
    transition={{ 
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      left: `${Math.random() * 100}%`,
    }}
  />
);

// Fish Swimming Animation
const SwimmingFish = () => (
  <motion.div
    className="absolute top-1/2 left-0"
    animate={{
      x: ["0vw", "100vw"],
      y: [0, -20, 20, -10, 0]
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <Fish className="h-8 w-8 text-cyan-300/60" />
  </motion.div>
);

export default function HomePage() {
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  const featuresInView = useInView(featuresRef, { once: true });
  const testimonialsInView = useInView(testimonialsRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });

  const features = [
    {
      icon: <Award className="h-8 w-8 text-sky-500" />,
      title: "PADI Certified Courses",
      description: "Professional diving courses from beginner to advanced levels with certified instructors."
    },
    {
      icon: <Users className="h-8 w-8 text-sky-500" />,
      title: "Expert Instructors",
      description: "Learn from experienced dive masters with years of underwater exploration expertise."
    },
    {
      icon: <MapPin className="h-8 w-8 text-sky-500" />,
      title: "Andaman Waters",
      description: "Explore the pristine coral reefs and marine life in the crystal-clear waters of Andaman."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing experience! The instructors were professional and the waters were absolutely stunning."
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment: "Best diving school in Andaman. Highly recommend for both beginners and experienced divers."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center ocean-gradient overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Swimming Fish */}
          <SwimmingFish />
          
          {/* Floating Bubbles */}
          {[...Array(15)].map((_, i) => (
            <Bubble key={i} delay={i * 0.5} />
          ))}
          
          {/* Coral Decorations */}
          <motion.div
            className="absolute bottom-10 left-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <CoralIcon className="h-16 w-16 text-coral-400/40" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-20 right-20"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <CoralIcon className="h-12 w-12 text-coral-500/30" />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Dive into <span className="text-cyan-200 underwater-text">Adventure</span>
            </motion.h2>
            
            <motion.p
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              Discover the underwater world of Andaman Islands with professional diving courses 
              and unforgettable marine experiences.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/courses" className="btn-primary bg-white text-sky-600 hover:bg-gray-100 text-lg px-8 py-3 inline-flex items-center">
                  View Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/medical-form" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-sky-600 text-lg px-8 py-3 inline-flex items-center">
                  Start Medical Form
                  <Anchor className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 bg-white relative overflow-hidden">
        {/* Decorative Coral Elements */}
        <CoralIcon className="absolute top-10 right-10 h-20 w-20 text-coral-400/20 coral-animation" />
        <CoralIcon className="absolute bottom-10 left-10 h-16 w-16 text-coral-500/20 coral-animation" />
        
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-12 text-slate-800"
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Why Choose Blue Belong?
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="flex justify-center mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 bg-slate-100 relative overflow-hidden">
        {/* Animated Background Waves */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="h-full w-full bg-gradient-to-r from-sky-400 to-cyan-500"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ backgroundSize: "200% 200%" }}
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-3xl font-bold mb-6 text-slate-800"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            Ready to Start Your Diving Journey?
          </motion.h2>
          
          <motion.p
            className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Book your diving course today and experience the breathtaking underwater world of Andaman. 
            Payment can be made face-to-face at our center.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/courses" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
              Book Your Course Now
              <Fish className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-slate-800"
            initial={{ opacity: 0, y: 50 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            What Our Divers Say
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={testimonialsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.3, duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={testimonialsInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: index * 0.3 + i * 0.1, duration: 0.3 }}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 mb-4 italic">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>
                <p className="font-semibold text-slate-800">
                  - {testimonial.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
