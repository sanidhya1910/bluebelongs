'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Clock, Award, MapPin, Waves, Users, BookOpen, Calendar, Settings, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  available: boolean;
}

interface User {
  name: string;
  email: string;
  role: string;
}

interface AdminStats {
  totalBookings: number;
  totalUsers: number;
  totalCourses: number;
  activeBookings: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats>({ totalBookings: 0, totalUsers: 0, totalCourses: 0, activeBookings: 0 });
  const [activeTab, setActiveTab] = useState<'courses' | 'bookings' | 'users' | 'settings'>('courses');
  const [isLoading, setIsLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>({});

  const categoryOptions = [
    { value: 'beginner', label: 'Entry Level Programs' },
    { value: 'certification', label: 'Continuing Education' },
    { value: 'specialty', label: 'Specialty Courses' }
  ];

  const levelOptions = [
    'Beginner', 'Intermediate', 'Advanced', 'Open Water', 'Refresher', 'Kids'
  ];

  useEffect(() => {
    checkAuth();
    loadCourses();
    loadAdminStats();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!userData || !token) {
      window.location.href = '/login';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      window.location.href = '/dashboard';
      return;
    }
    
    setUser(parsedUser);
  };

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/admin/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminStats(data.stats || { totalBookings: 0, totalUsers: 0, totalCourses: 0, activeBookings: 0 });
      }
    } catch (error) {
      console.error('Error loading admin stats:', error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({ ...course });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      dives: 0,
      price: '',
      level: 'Beginner',
      certification: '',
      category: 'beginner',
      available: true
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const url = editingCourse 
        ? `https://bluebelong-api.blackburn1910.workers.dev/api/admin/courses/${editingCourse.id}`
        : 'https://bluebelong-api.blackburn1910.workers.dev/api/admin/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadCourses();
        setEditingCourse(null);
        setIsCreating(false);
        setFormData({});
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bluebelong-api.blackburn1910.workers.dev/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadCourses();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const handleToggleAvailability = async (courseId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bluebelong-api.blackburn1910.workers.dev/api/admin/courses/${courseId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadCourses();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to toggle course availability');
      }
    } catch (error) {
      console.error('Error toggling course availability:', error);
      alert('Failed to toggle course availability');
    }
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-slate-600">Course Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Courses</p>
                <p className="text-2xl font-bold text-slate-900">{adminStats.totalCourses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900">{adminStats.totalBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{adminStats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Active Bookings</p>
                <p className="text-2xl font-bold text-slate-900">{adminStats.activeBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Course Management
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Booking Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Courses</h2>
          <button
            onClick={handleCreate}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Course
          </button>
        </div>

        {/* Course Creation/Edit Form */}
        <AnimatePresence>
          {(isCreating || editingCourse) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm border p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter course title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category || 'beginner'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Course['category'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2 days"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Number of Dives *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.dives || 0}
                    onChange={(e) => setFormData({ ...formData, dives: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ₹35,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Level *
                  </label>
                  <select
                    required
                    value={formData.level || 'Beginner'}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {levelOptions.map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Certification *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.certification || ''}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., SSI Open Water Diver"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter course description"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Course
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses List */}
        <div className="grid gap-4">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              className="bg-white rounded-lg shadow-sm border p-6"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {course.title}
                    </h3>
                    {!course.available && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Disabled
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.category === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.category === 'certification' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {categoryOptions.find(c => c.value === course.category)?.label}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.level === 'Beginner' || course.level === 'Kids' ? 'bg-green-100 text-green-800' :
                      course.level === 'Intermediate' || course.level === 'Open Water' ? 'bg-blue-100 text-blue-800' :
                      course.level === 'Advanced' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 mb-3">{course.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
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
                      {course.price}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleToggleAvailability(course.id, course.available)}
                    className={`p-2 rounded-lg transition-colors ${
                      course.available
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={course.available ? 'Disable course' : 'Enable course'}
                  >
                    {course.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {courses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-slate-500">No courses found. Create your first course to get started.</p>
          </div>
        )}
            </motion.div>
          )}
          
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Booking Management</h3>
              <p className="text-slate-600">Booking management features coming soon...</p>
            </motion.div>
          )}
          
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">User Management</h3>
              <p className="text-slate-600">User management features coming soon...</p>
            </motion.div>
          )}
          
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">System Settings</h3>
              <p className="text-slate-600">System settings and configuration options coming soon...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
