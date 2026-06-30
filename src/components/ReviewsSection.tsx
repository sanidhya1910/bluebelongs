'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Card, CardBody } from '@heroui/react';

const API_BASE = 'https://bluebelong-api.blackburn1910.workers.dev';

interface Review {
  id: string;
  courseId: string;
  courseName: string;
  rating: number;
  comment: string;
  createdAt: string;
  approvedAt?: string;
  userName?: string;
}

interface ReviewsSectionProps {
  courseId?: string; // If provided, show only reviews for this course
  maxReviews?: number;
  title?: string;
}

export default function ReviewsSection({ courseId, maxReviews, title = 'What Our Divers Say' }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      try {
        const url = courseId
          ? `${API_BASE}/api/reviews?courseId=${encodeURIComponent(courseId)}`
          : `${API_BASE}/api/reviews`;
        const response = await fetch(url);
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled) return;

        let list: Review[] = Array.isArray(data.reviews) ? data.reviews : [];
        if (maxReviews) {
          list = list.slice(0, maxReviews);
        }
        setReviews(list);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    };

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [courseId, maxReviews]);

  // Keep the carousel index valid if the list shrinks
  useEffect(() => {
    setCurrentIndex((prev) => (prev >= reviews.length ? 0 : prev));
  }, [reviews.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  }, [reviews.length]);

  // Auto-rotate reviews every 8 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [reviews.length, handleNext]);

  if (reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  const currentReview = reviews[currentIndex];

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <section className="py-16 bg-gradient-to-br from-sky-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-slate-800 mb-3"
          >
            {title}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-600 font-medium">
              {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </motion.div>
        </div>

        {/* Review Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="shadow-xl">
                <CardBody className="p-8">
                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < currentReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                    &ldquo;{currentReview.comment}&rdquo;
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{currentReview.userName}</p>
                      <p className="text-sm text-slate-600">{currentReview.courseName}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-slate-500 mt-4">
                    {new Date(currentReview.approvedAt || currentReview.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-slate-50 transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-6 w-6 text-slate-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-slate-50 transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="h-6 w-6 text-slate-700" />
              </button>
            </>
          )}

          {/* Indicator Dots */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-sky-500'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
