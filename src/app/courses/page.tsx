'use client';

import { useState } from 'react';
import { Clock, Users, Award, MapPin } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  maxStudents: number;
  price: string;
  level: string;
  certification: string;
  features: string[];
}

const courses: Course[] = [
  {
    id: 'open-water',
    title: 'PADI Open Water Diver',
    description: 'Your adventure into the underwater world begins here. This course teaches you fundamental scuba diving skills.',
    duration: '3-4 days',
    maxStudents: 8,
    price: '₹18,000',
    level: 'Beginner',
    certification: 'PADI Open Water',
    features: [
      'Theory and confined water training',
      'Open water dives',
      'Digital learning materials',
      'Certification card',
      'Equipment during training'
    ]
  },
  {
    id: 'advanced-open-water',
    title: 'PADI Advanced Open Water',
    description: 'Build confidence and skills with this adventure-based program that introduces you to new diving activities.',
    duration: '2-3 days',
    maxStudents: 6,
    price: '₹15,000',
    level: 'Intermediate',
    certification: 'PADI Advanced Open Water',
    features: [
      'Deep diving adventure',
      'Underwater navigation',
      'Three elective adventures',
      'Advanced techniques',
      'Enhanced safety skills'
    ]
  },
  {
    id: 'rescue-diver',
    title: 'PADI Rescue Diver',
    description: 'Learn to prevent and manage problems underwater, and become a more confident diver.',
    duration: '3-4 days',
    maxStudents: 6,
    price: '₹20,000',
    level: 'Advanced',
    certification: 'PADI Rescue Diver',
    features: [
      'Self-rescue techniques',
      'Recognizing stress in divers',
      'Emergency management',
      'Rescue exercises',
      'First aid training'
    ]
  },
  {
    id: 'discover-scuba',
    title: 'Discover Scuba Diving',
    description: 'Try scuba diving for the first time in a safe, controlled environment under professional supervision.',
    duration: '1 day',
    maxStudents: 4,
    price: '₹5,000',
    level: 'Beginner',
    certification: 'Experience Certificate',
    features: [
      'Pool/confined water session',
      'Basic equipment introduction',
      'Professional instructor guidance',
      'Safe and easy introduction',
      'No prior experience needed'
    ]
  }
];

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
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
    // In a real application, this would submit to an API
    alert(`Booking request submitted for ${selectedCourse?.title}! We&apos;ll contact you within 24 hours to confirm your slot. Payment can be made face-to-face at our center.`);
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

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Diving Courses
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose from our range of PADI certified diving courses, designed for all skill levels. 
            From complete beginners to advanced divers, we have the perfect course for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {courses.map((course) => (
            <div key={course.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {course.level}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {course.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-sky-600">{course.price}</div>
                  <div className="text-sm text-slate-500">per person</div>
                </div>
              </div>

              <p className="text-slate-600 mb-4">{course.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-slate-600">
                  <Clock className="h-5 w-5 mr-2 text-sky-500" />
                  <span className="text-sm">{course.duration}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Users className="h-5 w-5 mr-2 text-sky-500" />
                  <span className="text-sm">Max {course.maxStudents} students</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Award className="h-5 w-5 mr-2 text-sky-500" />
                  <span className="text-sm">{course.certification}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-5 w-5 mr-2 text-sky-500" />
                  <span className="text-sm">Andaman Waters</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-2">What&apos;s Included:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {course.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-sky-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleBooking(course)}
                className="btn-primary w-full"
              >
                Book This Course
              </button>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
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
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(null)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Submit Booking Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-white rounded-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Important Information
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Before You Book
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
                  Complete the medical questionnaire online
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
                  Minimum age requirement: 10 years (with parental consent)
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
                  Swimming proficiency required
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
                  Valid photo identification needed
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                What to Bring
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
                  Swimwear and towel
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
                  Sunscreen and sunglasses
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
                  Completed medical questionnaire
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
                  Positive attitude and excitement!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
