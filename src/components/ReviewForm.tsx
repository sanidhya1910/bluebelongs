'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle } from 'lucide-react';
import { Card, CardBody, CardHeader, Button, Textarea } from '@heroui/react';

interface Review {
  id: string;
  courseId: string;
  courseName: string;
  bookingId: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
}

interface ReviewFormProps {
  bookingId: string;
  courseId: string;
  courseName: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ bookingId, courseId, courseName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get current user
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not logged in');
      }
      
      const user = JSON.parse(userData);
      
      // Get existing reviews from user data
      const usersData = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex((u: { email: string }) => u.email === user.email);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Create new review
      const newReview: Review = {
        id: `review-${Date.now()}`,
        courseId,
        courseName,
        bookingId,
        rating,
        comment: comment.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Add review to user's reviews array
      if (!users[userIndex].reviews) {
        users[userIndex].reviews = [];
      }
      users[userIndex].reviews.push(newReview);

      // Save updated users data
      localStorage.setItem('users', JSON.stringify(users));

      setIsSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Review Submitted!</h3>
        <p className="text-slate-600">
          Thank you for your feedback. Your review is awaiting admin approval and will be displayed soon.
        </p>
      </motion.div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
        <h3 className="text-xl font-bold">Write a Review</h3>
        <p className="text-sm text-white/90">{courseName}</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-slate-600 mt-2">
                {rating === 5 && 'Excellent! ⭐'}
                {rating === 4 && 'Very Good! 👍'}
                {rating === 3 && 'Good 👌'}
                {rating === 2 && 'Fair 😐'}
                {rating === 1 && 'Poor 😞'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Review
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your diving experience with us... What did you enjoy most? Any suggestions?"
              minRows={4}
              className="w-full"
              classNames={{
                input: 'text-slate-700'
              }}
            />
            <p className="text-xs text-slate-500 mt-1">
              {comment.length} characters (minimum 10 required)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold py-6 text-lg"
            startContent={!isSubmitting && <Send className="h-5 w-5" />}
          >
            {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            Your review will be visible after admin approval
          </p>
        </form>
      </CardBody>
    </Card>
  );
}
