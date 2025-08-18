'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, User, ArrowRight, Fish, Waves, Anchor } from 'lucide-react';
import Link from 'next/link';

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
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1588481123261-9b6a0cb5f584?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
                    className="h-64 bg-cover bg-center bg-no-repeat relative"
                    style={{
                      backgroundImage: `url(${post.image})`
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
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
                    className="h-48 bg-cover bg-center bg-no-repeat relative"
                    style={{
                      backgroundImage: `url(${post.image})`
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
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
