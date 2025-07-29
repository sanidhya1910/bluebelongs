'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, User, ArrowRight, Fish, Waves, Anchor } from 'lucide-react';
import Link from 'next/link';

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

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Marine Life Conservation in Andaman Waters',
    excerpt: 'Discover the incredible biodiversity of Andaman seas and how Blue Belong is contributing to marine conservation efforts through responsible diving practices.',
    author: 'Dr. Priya Sharma',
    date: '2024-01-15',
    category: 'Conservation',
    readTime: '8 min read',
    image: '/api/placeholder/600/400',
    featured: true
  },
  {
    id: '2',
    title: 'Best Diving Spots Around Havelock Island',
    excerpt: 'Explore the top underwater destinations near Havelock Island, from vibrant coral reefs to mysterious underwater caves that will take your breath away.',
    author: 'Captain Mike Rodriguez',
    date: '2024-01-10',
    category: 'Diving Spots',
    readTime: '6 min read',
    image: '/api/placeholder/600/400',
    featured: false
  },
  {
    id: '3',
    title: 'Night Diving: A Different World Underwater',
    excerpt: 'Experience the magic of night diving in Andaman waters. Learn about the unique marine life that emerges after sunset and safety tips for night dives.',
    author: 'Sarah Chen',
    date: '2024-01-08',
    category: 'Techniques',
    readTime: '5 min read',
    image: '/api/placeholder/600/400',
    featured: false
  },
  {
    id: '4',
    title: 'Underwater Photography Tips for Beginners',
    excerpt: 'Master the art of underwater photography with these essential tips. From camera settings to composition techniques for capturing stunning marine life.',
    author: 'Alex Thompson',
    date: '2024-01-05',
    category: 'Photography',
    readTime: '7 min read',
    image: '/api/placeholder/600/400',
    featured: false
  },
  {
    id: '5',
    title: 'The Coral Restoration Project: Making a Difference',
    excerpt: 'Learn about our ongoing coral restoration initiatives and how every diver can contribute to preserving the underwater ecosystem for future generations.',
    author: 'Dr. Raj Patel',
    date: '2024-01-02',
    category: 'Conservation',
    readTime: '10 min read',
    image: '/api/placeholder/600/400',
    featured: true
  },
  {
    id: '6',
    title: 'Monsoon Diving: What You Need to Know',
    excerpt: 'Diving during monsoon season offers unique experiences and challenges. Get expert advice on safety, visibility, and the best practices for monsoon diving.',
    author: 'Captain Arjun Kumar',
    date: '2023-12-28',
    category: 'Safety',
    readTime: '6 min read',
    image: '/api/placeholder/600/400',
    featured: false
  }
];

const categories = ['All', 'Conservation', 'Diving Spots', 'Techniques', 'Photography', 'Safety'];

export default function BlogsPage() {
  const heroRef = useRef(null);
  const postsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const postsInView = useInView(postsRef, { once: true });

  return (
    <div className="min-h-screen bg-slate-50">
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
          
          {/* Coral Decorations */}
          <CoralIcon className="absolute bottom-10 left-10 h-20 w-20 text-coral-400/30" />
          <CoralIcon className="absolute top-20 right-20 h-16 w-16 text-coral-500/25" />
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
              <Anchor className="h-8 w-8 text-cyan-200 floating-element" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  category === 'All' 
                    ? 'bg-sky-500 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
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
            {blogPosts.filter(post => post.featured).map((post, index) => (
              <motion.article
                key={post.id}
                className="card group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <motion.div
                    className="h-64 bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Fish className="h-20 w-20 text-white/60" />
                  </motion.div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-slate-500 mb-3">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">{new Date(post.date).toLocaleDateString()}</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-sky-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-slate-600 mb-4">
                  {post.excerpt}
                </p>
                
                <Link
                  href={`/blogs/${post.id}`}
                  className="inline-flex items-center text-sky-600 font-medium hover:text-sky-700 transition-colors"
                >
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.article>
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
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <motion.article
                key={post.id}
                className="card group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={postsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <motion.div
                    className="h-48 bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CoralIcon className="h-16 w-16 text-white/60" />
                  </motion.div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-sky-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-slate-500 mb-2">
                  <User className="h-3 w-3 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{post.readTime}</span>
                  <Link
                    href={`/blogs/${post.id}`}
                    className="inline-flex items-center text-sky-600 font-medium hover:text-sky-700 transition-colors text-sm"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
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
          <CoralIcon className="absolute bottom-10 right-10 h-24 w-24 text-coral-400/20" />
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
