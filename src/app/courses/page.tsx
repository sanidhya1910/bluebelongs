'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CourseCategory from '@/components/courses/CourseCategory';
import { categories, courses, type Course as TCourse } from '@/data/courses';
import Section from '@/components/ui/Section';

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<TCourse | null>(null);
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

  const handleBooking = (course: TCourse) => {
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

  const getCoursesForCategory = (categoryId: string) => courses.filter(c => c.category === categoryId);

  return (
  <div className="min-h-screen sand-section py-12 pt-28 relative overflow-hidden">
      {/* Removed coral background elements */}
      <Section
        title="Diving Courses"
        subtitle="Choose from our range of SSI certified diving courses, designed for all skill levels. From complete beginners to advanced divers, we have the perfect course for you."
        className="pt-0"
        containerClassName="relative z-10"
      >
        <div className="space-y-6 mb-12">
          {categories.map((category) => (
            <CourseCategory
              key={category.id}
              category={category}
              courses={getCoursesForCategory(category.id)}
              expanded={expandedCategory === category.id}
              onToggle={toggleCategory}
              onBook={handleBooking}
              isHydrated={isHydrated}
              userPresent={!!user}
            />
          ))}
        </div>
      </Section>

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
  );
}
