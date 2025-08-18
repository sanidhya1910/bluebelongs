'use client';

import { useState, useEffect } from 'react';
import { Clock, Award, MapPin, Waves, Fish, Anchor, ChevronDown } from 'lucide-react';
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
  image?: string;
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
    name: 'Entry Level Programs',
    description: 'Perfect for first-time divers and those new to scuba diving - from Try Scuba to Open Water certification',
    icon: <Fish className="h-8 w-8" />,
    color: 'from-emerald-400 to-cyan-500'
  },
  {
    id: 'certification',
    name: 'Continuing Education',
    description: 'Advanced training for certified divers seeking skill enhancement and rescue capabilities',
    icon: <Award className="h-8 w-8" />,
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'specialty',
    name: 'Specialty Courses',
    description: 'Specialized training for unique diving experiences - from Deep Diving to Wreck Exploration',
    icon: <Anchor className="h-8 w-8" />,
    color: 'from-purple-400 to-pink-500'
  }
];

const courses: Course[] = [
  // Beginner Courses (Entry Level Programs)
  {
    id: 'try-scuba',
    title: 'Try Scuba',
    description: 'Safe and exhilarating introduction to scuba diving, perfect for non-swimmers. Test the waters before you commit!',
    duration: '3 hours',
    dives: 1,
    price: '₹4,500',
    level: 'Beginner',
    certification: 'Try Scuba Experience',
  category: 'beginner',
  image: 'https://unsplash.com/photos/black-and-white-fire-extinguisher-on-brown-concrete-wall-4HOg7XW_9co/download?force=true'
  },
  {
    id: 'basic-diver',
    title: 'SSI Basic Diver',
    description: 'Gateway to exploring depths of up to 12 meters with an experienced SSI Professional. Credits towards further certifications.',
    duration: '4 hours',
    dives: 1,
    price: '₹7,500',
    level: 'Beginner',
    certification: 'SSI Basic Diver',
  category: 'beginner',
  image: 'https://images.pexels.com/photos/10467/pexels-photo-10467.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'scuba-diver',
    title: 'SSI Scuba Diver',
    description: 'Excellent starting point combining online learning with practical dives. Dive up to 12 meters deep.',
    duration: '2 days',
    dives: 2,
    price: '₹15,000',
    level: 'Beginner',
    certification: 'SSI Scuba Diver',
  category: 'beginner',
  image: 'https://images.pexels.com/photos/3046582/pexels-photo-3046582.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'open-water',
    title: 'SSI Open Water Diver',
    description: 'Globally recognized certification program. Your gateway to lifelong diving adventures up to 18 meters deep.',
    duration: '4 days',
    dives: 4,
    price: '₹35,000',
    level: 'Beginner',
    certification: 'SSI Open Water Diver',
  category: 'beginner',
  image: 'https://images.pexels.com/photos/1540297/pexels-photo-1540297.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },

  // Certification Courses (Continuing Education)
  {
    id: 'advanced-adventurer',
    title: 'SSI Advanced Adventurer',
    description: 'Sample five SSI specialties through Adventure Dives. Certifies you to dive up to 30 meters deep.',
    duration: '3 days',
    dives: 5,
    price: '₹25,000',
    level: 'Intermediate',
    certification: 'SSI Advanced Adventurer',
  category: 'certification',
  image: 'https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'scuba-skill-update',
    title: 'SSI Scuba Skill Update',
    description: 'Refresh your skills after inactivity. Perfect for divers who haven\'t been in water for a while.',
    duration: '1 day',
    dives: 0,
    price: '₹8,000',
    level: 'Refresher',
    certification: 'Skill Update',
  category: 'certification',
  image: 'https://images.pexels.com/photos/1303651/pexels-photo-1303651.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'diver-stress-rescue',
    title: 'SSI Diver Stress and Rescue',
    description: 'Comprehensive course to manage emergencies effectively. Learn to identify stress signals and prevent accidents.',
    duration: '3-4 days',
    dives: 4,
    price: 'Contact for pricing',
    level: 'Advanced',
    certification: 'SSI Diver Stress and Rescue',
  category: 'certification',
  image: 'https://unsplash.com/photos/people-in-water-during-daytime-NThBgBjmgnE/download?force=true'
  },

  // Specialty Courses
  {
    id: 'deep-diving',
    title: 'SSI Deep Diving Specialty',
    description: 'Prepare for dives ranging from 18 to 40 meters deep. Learn dive computers and gas consumption.',
    duration: '2 days',
    dives: 4,
    price: 'Contact for pricing',
    level: 'Advanced',
    certification: 'SSI Deep Diving Specialty',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/3410956/pexels-photo-3410956.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'perfect-buoyancy',
    title: 'SSI Perfect Buoyancy',
    description: 'Master buoyancy control underwater. Learn to swim like a fish and be balanced like a turtle.',
    duration: '1-2 days',
    dives: 2,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'SSI Perfect Buoyancy',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/37530/diver-scuba-underwater-swimming-37530.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'nitrox',
    title: 'SSI Nitrox Specialty',
    description: 'Learn enriched air nitrox diving for longer bottom times and shorter surface intervals.',
    duration: '1 day',
    dives: 2,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'SSI Nitrox Specialty',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/9307238/pexels-photo-9307238.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'navigation',
    title: 'SSI Navigation Specialty',
    description: 'Master underwater navigation with compass and natural techniques. Never get lost underwater again!',
    duration: '2 days',
    dives: 3,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'SSI Navigation Specialty',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/4553081/pexels-photo-4553081.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'fish-identification',
    title: 'SSI Fish Identification',
    description: 'Learn to identify fish species, their behaviors, and habitats. Know what you\'re seeing underwater!',
    duration: '2 days',
    dives: 2,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'SSI Fish Identification',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/3635910/pexels-photo-3635910.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'wreck-diving',
    title: 'SSI Wreck Diving (Havelock Only)',
    description: 'Explore and navigate wreck dive sites safely. Discover underwater history like the Titanic!',
    duration: '2 days',
    dives: 4,
    price: 'Contact for pricing',
    level: 'Advanced',
    certification: 'SSI Wreck Diving',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/3098980/pexels-photo-3098980.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'night-diving',
    title: 'SSI Night & Limited Visibility (Havelock Only)',
    description: 'Safely navigate underwater environments in low light. Discover nocturnal marine life behaviors.',
    duration: '2 days',
    dives: 3,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'SSI Night & Limited Visibility',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/3098970/pexels-photo-3098970.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'science-diving',
    title: 'SSI Science of Diving (Theory)',
    description: 'Comprehensive understanding of diving physics, physiology, and decompression theory.',
    duration: '1 day',
    dives: 0,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'SSI Science of Diving',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/1441024/pexels-photo-1441024.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'boat-diving',
    title: 'SSI Boat Diving Specialty',
    description: 'Learn boat diving logistics, entry/exit techniques, and safety protocols for diving from boats.',
    duration: '1 day',
    dives: 2,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'SSI Boat Diving',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/8826360/pexels-photo-8826360.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'equipment-technique',
    title: 'SSI Equipment Technique',
    description: 'Master dive equipment maintenance, care, and troubleshooting. Make the right equipment choices.',
    duration: '1 day',
    dives: 0,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'SSI Equipment Technique',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/1276531/pexels-photo-1276531.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'search-recovery',
    title: 'SSI Search and Recovery',
    description: 'Learn to locate and retrieve objects underwater. Find that lost wedding ring!',
    duration: '2 days',
    dives: 4,
    price: 'Contact for pricing',
    level: 'Advanced',
    certification: 'SSI Search and Recovery',
  category: 'specialty',
  image: 'https://images.pexels.com/photos/13478691/pexels-photo-13478691.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80'
  },
  {
    id: 'computer-diving',
    title: 'SSI Computer Diving',
    description: 'Master dive computer operation for safer diving. Learn algorithms and dive profile optimization.',
    duration: '1 day',
    dives: 2,
    price: 'Contact for pricing',
    level: 'Open Water',
    certification: 'SSI Computer Diving',
  category: 'specialty',
  image: 'https://source.unsplash.com/featured/1200x800?dive-computer,wrist,scubadiving,gauge'
  }
];

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('beginner');
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: '',
    preferredDate: '',
    experience: '',
    medicalCleared: false
  });

  useEffect(() => {
    // Mark as hydrated and check authentication
    setIsHydrated(true);
    
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleBooking = (course: Course) => {
    // Check if user is logged in
    if (!user) {
      alert('Please log in to book a course. You will be redirected to the login page.');
      window.location.href = '/login';
      return;
    }
    
    setSelectedCourse(course);
    setBookingForm({ 
      ...bookingForm, 
      courseId: course.id,
      name: user.name,
      email: user.email 
    });
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to book a course.');
      window.location.href = '/login';
      return;
    }
    
    // Get form and button references
    const form = e.target as HTMLFormElement;
    const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = button.textContent || 'Submit Booking Request';
    
    try {
      // Show loading state
      button.disabled = true;
      button.textContent = 'Submitting...';

      // Call backend API
      const requestPayload = {
        ...bookingForm,
        course_id: bookingForm.courseId,
        preferred_date: bookingForm.preferredDate,
        courseName: selectedCourse?.title,
        coursePrice: selectedCourse?.price,
        timestamp: new Date().toISOString()
      };
      
      // Log the request payload for debugging
      console.log('Sending booking request:', requestPayload);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      
      // Log response for debugging
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        alert(`✅ Booking request submitted successfully! 
        
Booking ID: ${data.bookingId}
        
We'll contact you within 24 hours to confirm your slot. 
Payment can be made face-to-face at our center.

IMPORTANT: Please complete your medical form before your course date.
You can access it from your dashboard or the medical form section.

A confirmation email has been sent to ${bookingForm.email}.`);
        
        setSelectedCourse(null);
        setBookingForm({
          name: user?.name || '',
          email: user?.email || '',
          phone: '',
          courseId: '',
          preferredDate: '',
          experience: '',
          medicalCleared: false
        });
      } else {
        throw new Error(data.error || 'Booking submission failed');
      }

    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Log the full response for debugging
      console.error('Full error details:', error);
      
      alert(`❌ Booking submission failed: ${errorMessage}
      
Please try again or contact us directly:
📧 Email: info@bluebelongs.com
📱 Phone: +91-XXXX-XXXX`);
    } finally {
      // Reset button state
      button.disabled = false;
      button.textContent = originalText;
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const getCoursesForCategory = (categoryId: string) => {
    return courses.filter(course => course.category === categoryId);
  };

  return (
  <div className="min-h-screen sand-section py-12 pt-28 relative overflow-hidden">
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
            Choose from our range of SSI certified diving courses, designed for all skill levels. 
            From complete beginners to advanced divers, we have the perfect course for you.
          </p>
        </motion.div>

        {/* Course Categories */}
        <div className="space-y-6 mb-12">
          {categories.map((category, index) => (
                        <motion.div
              key={category.id}
                          className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
                          className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: courseIndex * 0.1, duration: 0.4 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {course.image && (
                            <div className="h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${course.image})` }} aria-label={`${course.title} cover image`} />
                          )}
                          <div className="p-6 flex flex-col gap-3">
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
                            <p
                              className="text-slate-600 text-sm"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical' as any,
                                overflow: 'hidden'
                              }}
                            >
                              {course.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-600 px-6">
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

                          <div className="flex items-center justify-between px-6 pb-6 mt-auto">
                            <div className="min-h-8 flex items-center text-2xl font-bold text-sky-600">
                              {course.price}
                            </div>
                            <motion.button
                              onClick={() => handleBooking(course)}
                              className="btn-primary text-sm px-4 py-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isHydrated && !user ? 'Login to Book' : 'Book Now'}
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
                    readOnly={!!user}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${user ? 'bg-slate-100 text-slate-700' : ''}`}
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
                    readOnly={!!user}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${user ? 'bg-slate-100 text-slate-700' : ''}`}
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
