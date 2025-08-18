"use client";

import { motion, useInView } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { Fish, Waves, Anchor } from 'lucide-react';
import BlogCard from '@/components/blogs/BlogCard';
import { blogPosts as posts } from '@/data/blogs';

const allCategories = ['All', 'Conservation', 'Diving Spots', 'Techniques', 'Photography', 'Safety'] as const;

export default function BlogsPage() {
  const heroRef = useRef(null);
  const postsRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState<(typeof allCategories)[number]>('All');
  
  const heroInView = useInView(heroRef, { once: true });
  const postsInView = useInView(postsRef, { once: true });
  const filtered = useMemo(
    () => (activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory)),
    [activeCategory]
  );

  return (
    <div className="min-h-screen sand-section">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 ocean-gradient text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Swimming Fish */}
          <motion.div
            className="absolute top-1/4 left-0"
            animate={{
              x: ["0vw", "100vw"],
              y: [0, -30, 30, -15, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Fish className="h-12 w-12 text-cyan-200/40" />
          </motion.div>
          
          {/* Light blue accents only */}
          <div className="absolute bottom-10 left-10 h-20 w-20 rounded-full bg-white/10 blur-xl" />
          <div className="absolute top-20 right-20 h-16 w-16 rounded-full bg-white/10 blur-xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 underwater-text"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Dive into Stories
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Explore the depths of knowledge with our diving blog. From marine conservation to diving techniques, 
              discover the underwater world through our expert insights.
            </motion.p>
            
            <motion.div
              className="flex items-center justify-center space-x-4"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 1 }}
            >
              <Waves className="h-8 w-8 text-cyan-200 wave-animation" />
              <span className="text-cyan-200 font-medium">Latest Updates from Blue Belong</span>
              <Anchor className="h-8 w-8 text-cyan-200" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sand wave divider */}
      <div className="w-full overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" className="block w-full h-[60px] rotate-180" preserveAspectRatio="none">
          <path d="M0,32 C120,52 240,72 360,72 C480,72 600,52 720,40 C840,28 960,24 1080,32 C1200,40 1320,60 1440,72 L1440,100 L0,100 Z" fill="#F7F3EA" />
        </svg>
      </div>

      {/* Categories Filter */}
  <section className="py-8 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
    {allCategories.map((category, index) => (
              <motion.button
                key={category}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
      activeCategory === category 
                    ? 'bg-sky-500 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
        onClick={() => setActiveCategory(category)}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-slate-800"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Featured Stories
          </motion.h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {posts.filter(post => post.featured).map((post, index) => (
              <BlogCard key={post.id} post={post} featured index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section ref={postsRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-slate-800"
            initial={{ opacity: 0, y: 30 }}
            animate={postsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Latest Articles
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.filter(post => !post.featured).map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
  <section className="py-16 bg-slate-800 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-600/20 to-transparent"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute bottom-10 right-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        </div>
        
  <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Stay Updated with Ocean Stories
          </motion.h2>
          
          <motion.p
            className="text-slate-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Subscribe to our newsletter for the latest diving tips, marine conservation updates, 
            and underwater adventure stories from the Andaman Islands.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
