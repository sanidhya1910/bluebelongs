'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Tag, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface SpecialOffer {
  id: string;
  courseId: string;
  courseTitle: string;
  offerTitle: string;
  offerDescription: string;
  discountPercent?: number;
  discountAmount?: number;
  expiryDate: string;
  offerCode?: string;
}

export default function SpecialOffersBanner() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Load active offers from localStorage
    const loadOffers = () => {
      const coursesData = localStorage.getItem('courses');
      if (coursesData) {
        try {
          const courses = JSON.parse(coursesData);
          const activeOffers = courses
            .filter((course: { 
              id: string;
              offerActive?: boolean;
              offerExpiryDate?: string;
            }) => 
              course.offerActive && 
              course.offerExpiryDate && 
              new Date(course.offerExpiryDate) > new Date()
            )
            .map((course: {
              id: string;
              title: string;
              offerTitle?: string;
              offerDescription?: string;
              offerDiscountPercent?: number;
              offerDiscountAmount?: number;
              offerExpiryDate: string;
              offerCode?: string;
            }) => ({
              id: course.id,
              courseId: course.id,
              courseTitle: course.title,
              offerTitle: course.offerTitle || 'Special Offer!',
              offerDescription: course.offerDescription || 'Limited time offer',
              discountPercent: course.offerDiscountPercent,
              discountAmount: course.offerDiscountAmount,
              expiryDate: course.offerExpiryDate,
              offerCode: course.offerCode
            }));
          
          setOffers(activeOffers);
        } catch (error) {
          console.error('Error loading offers:', error);
        }
      }
    };

    loadOffers();
    
    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem('offerBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (offers.length === 0) return;

    // Calculate time left for current offer
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(offers[currentOfferIndex].expiryDate).getTime();
      const difference = expiry - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        // Offer expired, remove it
        setOffers(prev => prev.filter((_, index) => index !== currentOfferIndex));
        setCurrentOfferIndex(0);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [offers, currentOfferIndex]);

  useEffect(() => {
    if (offers.length <= 1) return;

    // Auto-rotate offers every 10 seconds
    const rotateTimer = setInterval(() => {
      setCurrentOfferIndex(prev => (prev + 1) % offers.length);
    }, 10000);

    return () => clearInterval(rotateTimer);
  }, [offers.length]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('offerBannerDismissed', 'true');
  };

  if (offers.length === 0 || isDismissed) return null;

  const currentOffer = offers[currentOfferIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="fixed top-20 left-0 right-0 z-40 px-4 pt-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={currentOffer.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-pulse"></div>
            </div>

            <div className="relative px-6 py-4 md:px-8 md:py-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Offer Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Tag className="h-5 w-5 text-white animate-bounce" />
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {currentOffer.offerTitle}
                    </h3>
                  </div>
                  
                  <p className="text-white/90 text-sm md:text-base mb-2">
                    {currentOffer.offerDescription} - <span className="font-semibold">{currentOffer.courseTitle}</span>
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-white">
                    {currentOffer.discountPercent && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <TrendingDown className="h-4 w-4" />
                        <span className="font-bold text-lg">{currentOffer.discountPercent}% OFF</span>
                      </div>
                    )}
                    {currentOffer.discountAmount && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <TrendingDown className="h-4 w-4" />
                        <span className="font-bold text-lg">₹{currentOffer.discountAmount} OFF</span>
                      </div>
                    )}
                    {currentOffer.offerCode && (
                      <div className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">Code: </span>
                        <span className="font-bold">{currentOffer.offerCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-white/90 text-xs mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Offer Ends In:</span>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div key={unit} className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                        <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                          {value.toString().padStart(2, '0')}
                        </span>
                        <span className="text-xs text-white/80 uppercase">{unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col items-center gap-2">
                  <Link
                    href="/courses"
                    className="bg-white hover:bg-white/90 text-red-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
                  >
                    Claim Offer Now!
                  </Link>
                  
                  {/* Offer Indicator Dots */}
                  {offers.length > 1 && (
                    <div className="flex gap-1">
                      {offers.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentOfferIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentOfferIndex
                              ? 'bg-white w-4'
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                          aria-label={`View offer ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Dismiss offer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
