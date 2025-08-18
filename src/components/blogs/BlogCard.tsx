'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/data/blogs';

interface Props {
  post: BlogPost;
  featured?: boolean;
  index?: number;
}

export default function BlogCard({ post, featured = false, index = 0 }: Props) {
  if (featured) {
    return (
      <motion.article
        className="card group cursor-pointer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative mb-6 overflow-hidden rounded-lg">
          <motion.div
            className="h-64 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${post.image})` }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
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
        <p className="text-slate-600 mb-4">{post.excerpt}</p>
        <Link href={`/blogs/${post.id}`} className="inline-flex items-center text-sky-600 font-medium hover:text-sky-700 transition-colors">
          Read More
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      key={post.id}
      className="card group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <motion.div
          className="h-48 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${post.image})` }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
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

      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{post.readTime}</span>
        <Link href={`/blogs/${post.id}`} className="inline-flex items-center text-sky-600 font-medium hover:text-sky-700 transition-colors text-sm">
          Read More
          <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}
