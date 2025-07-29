'use client';

import { useState } from 'react';
import { Clock, Users, Award, MapPin, Waves, Fish, Anchor, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  dives: number;
  price: string;
  level: string;
  certification: string;
  category: 'beginner' | 'certification' | 'specialty';
}

interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const categories: CourseCategory[] = [
  {
    id: 'beginner',
    name: 'Beginner Courses',
    description: 'Perfect for first-time divers and those new to scuba diving',
    icon: <Fish className="h-8 w-8" />,
    color: 'from-emerald-400 to-cyan-500'
  },
  {
    id: 'certification',
    name: 'Certification Courses',
    description: 'Advanced training for serious divers seeking professional certification',
    icon: <Award className="h-8 w-8" />,
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'specialty',
    name: 'Specialty Courses',
    description: 'Specialized training for unique diving experiences and skills',
    icon: <Anchor className="h-8 w-8" />,
    color: 'from-purple-400 to-pink-500'
  }
];

const courses: Course[] = [
  // Beginner Courses
  {
    id: 'discover-scuba',
    title: 'Discover Scuba Diving',
    description: 'Try scuba diving for the first time in a safe, controlled environment.',
    duration: '1 day',
    dives: 2,
    price: '₹5,000',
    level: 'Beginner',
    certification: 'Experience Certificate',
    category: 'beginner'
  },
  {
    id: 'bubble-maker',
    title: 'PADI Bubblemaker',
    description: 'Introduction to scuba diving for kids aged 8-10 in shallow water.',
    duration: '1 day',
    dives: 1,
    price: '₹3,500',
    level: 'Kids',
    certification: 'PADI Bubblemaker',
    category: 'beginner'
  },
  {
    id: 'try-scuba',
    title: 'Try Scuba Diving',
    description: 'Pool session to experience breathing underwater before open water.',
    duration: '2 hours',
    dives: 1,
    price: '₹2,500',
    level: 'Beginner',
    certification: 'Try Scuba',
    category: 'beginner'
  },

  // Certification Courses
  {
    id: 'open-water',
    title: 'PADI Open Water Diver',
    description: 'Your gateway to the underwater world with fundamental scuba skills.',
    duration: '3-4 days',
    dives: 4,
    price: '₹18,000',
    level: 'Beginner',
    certification: 'PADI Open Water',
    category: 'certification'
  },
  {
    id: 'advanced-open-water',
    title: 'PADI Advanced Open Water',
    description: 'Build confidence with adventure dives and enhanced skills.',
    duration: '2-3 days',
    dives: 5,
    price: '₹15,000',
    level: 'Intermediate',
    certification: 'PADI Advanced Open Water',
    category: 'certification'
  },
  {
    id: 'rescue-diver',
    title: 'PADI Rescue Diver',
    description: 'Learn to prevent and manage underwater emergencies.',
    duration: '3-4 days',
    dives: 4,
    price: '₹20,000',
    level: 'Advanced',
    certification: 'PADI Rescue Diver',
    category: 'certification'
  },
  {
    id: 'divemaster',
    title: 'PADI Divemaster',
    description: 'Professional level training to guide and assist other divers.',
    duration: '4-6 weeks',
    dives: 20,
    price: '₹45,000',
    level: 'Professional',
    certification: 'PADI Divemaster',
    category: 'certification'
  },

  // Specialty Courses
  {
    id: 'deep-diving',
    title: 'PADI Deep Diver',
    description: 'Explore deeper waters safely with proper deep diving techniques.',
    duration: '2 days',
    dives: 4,
    price: 'Contact for pricing',
    level: 'Advanced',
    certification: 'PADI Deep Diver Specialty',
    category: 'specialty'
  },
  {
    id: 'night-diving',
    title: 'PADI Night Diver',
    description: 'Experience the magic of underwater life after dark.',
    duration: '1-2 days',
    dives: 3,
    price: 'Contact for pricing',
    level: 'Advanced',
    certification: 'PADI Night Diver Specialty',
    category: 'specialty'
  },
  {
    id: 'underwater-photography',
    title: 'PADI Underwater Photography',
    description: 'Capture the beauty of marine life with professional techniques.',
    duration: '2 days',
    dives: 2,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'PADI UW Photography Specialty',
    category: 'specialty'
  },
  {
    id: 'wreck-diving',
    title: 'PADI Wreck Diver',
    description: 'Safely explore sunken ships and artificial reefs.',
    duration: '2 days',
    dives: 4,
    price: 'Contact for pricing',
    level: 'Advanced',
    certification: 'PADI Wreck Diver Specialty',
    category: 'specialty'
  }
];

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('beginner');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: '',
    preferredDate: '',
    experience: '',
    medicalCleared: false
  });

  const handleBooking = (course: Course) => {
    setSelectedCourse(course);
    setBookingForm({ ...bookingForm, courseId: course.id });
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Booking request submitted for ${selectedCourse?.title}! We'll contact you within 24 hours to confirm your slot. Payment can be made face-to-face at our center.`);
    setSelectedCourse(null);
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      courseId: '',
      preferredDate: '',
      experience: '',
      medicalCleared: false
    });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const getCoursesForCategory = (categoryId: string) => {
    return courses.filter(course => course.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <CoralIcon className="absolute top-20 right-10 h-24 w-24 text-coral-400/10" />
      <CoralIcon className="absolute bottom-20 left-10 h-20 w-20 text-coral-500/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 underwater-text">
            Diving Courses
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose from our range of PADI certified diving courses, designed for all skill levels. 
            From complete beginners to advanced divers, we have the perfect course for you.
          </p>
        </motion.div>

        {/* Course Categories */}
        <div className="space-y-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              {/* Category Header */}
              <motion.div
                className={`bg-gradient-to-r ${category.color} p-6 cursor-pointer`}
                onClick={() => toggleCategory(category.id)}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {category.icon}
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                      <p className="text-white/90">{category.description}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-6 w-6" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Category Courses */}
              <AnimatePresence>
                {expandedCategory === category.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getCoursesForCategory(category.id).map((course, courseIndex) => (
                        <motion.div
                          key={course.id}
                          className="bg-slate-50 rounded-lg p-6 border border-slate-200"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: courseIndex * 0.1, duration: 0.4 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="mb-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                              course.level === 'Beginner' || course.level === 'Kids' ? 'bg-green-100 text-green-800' :
                              course.level === 'Intermediate' || course.level === 'Open Water' ? 'bg-blue-100 text-blue-800' :
                              course.level === 'Advanced' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {course.level}
                            </span>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                              {course.title}
                            </h3>
                            <p className="text-slate-600 text-sm mb-4">{course.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-sky-500" />
                              {course.duration}
                            </div>
                            <div className="flex items-center">
                              <Waves className="h-4 w-4 mr-2 text-sky-500" />
                              {course.dives} dives
                            </div>
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-2 text-sky-500" />
                              {course.certification}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-sky-500" />
                              Andaman Waters
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-sky-600">
                              {course.price}
                            </div>
                            <motion.button
                              onClick={() => handleBooking(course)}
                              className="btn-primary text-sm px-4 py-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Book Now
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedCourse && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Book: {selectedCourse.title}
              </h3>
              
              <form onSubmit={submitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Preferred Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.preferredDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Previous Diving Experience
                  </label>
                  <textarea
                    value={bookingForm.experience}
                    onChange={(e) => setBookingForm({ ...bookingForm, experience: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Tell us about any previous diving experience..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="medical"
                    required
                    checked={bookingForm.medicalCleared}
                    onChange={(e) => setBookingForm({ ...bookingForm, medicalCleared: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="medical" className="text-sm text-slate-700">
                    I confirm that I will complete the medical questionnaire before the course *
                  </label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Payment:</strong> Payment can be made face-to-face at our center. 
                    We accept cash, card, and UPI payments.
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setSelectedCourse(null)}
                    className="btn-secondary flex-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="btn-primary flex-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit Booking Request
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
