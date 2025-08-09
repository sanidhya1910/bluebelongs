'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Calendar, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  LogOut,
  Settings,
  Bell,
  Activity,
  Waves,
  Fish,
  MapPin,
  X
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  certification_level?: string;
  total_dives: number;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  course_name: string;
  course_price: string;
  preferred_date: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalUsers: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        window.location.href = '/login';
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Load profile and bookings
      const profileResponse = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserBookings(profileData.bookings || []);
      }

      // Load dashboard stats (for admin/instructor)
      if (parsedUser.role === 'admin' || parsedUser.role === 'instructor') {
        const statsResponse = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
          setRecentBookings(statsData.recentBookings || []);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Dashboard error:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-sky-600">Loading your diving dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to access the dashboard</p>
          <Link href="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const cancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bluebelong-api.blackburn1910.workers.dev/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        // Reload the data to show updated status
        loadDashboardData();
      } else {
        const error = await response.json();
        alert(`Failed to cancel booking: ${error.error}`);
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Waves className="h-8 w-8 text-sky-600" />
                <h1 className="text-2xl font-bold text-sky-900">Blue Belongs</h1>
              </div>
              <span className="text-sky-600">|</span>
              <h2 className="text-xl text-sky-700">Dashboard</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-sky-600" />
                <span className="text-sky-900 font-medium">{user.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              
              <button className="p-2 rounded-lg hover:bg-sky-50 text-sky-600">
                <Bell className="h-5 w-5" />
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-sky-600 hover:bg-sky-50'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'bookings'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-sky-600 hover:bg-sky-50'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            My Bookings
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'profile'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-sky-600 hover:bg-sky-50'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Profile
          </button>
          
          {(user.role === 'admin' || user.role === 'instructor') && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'admin'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-sky-600 hover:bg-sky-50'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Admin
            </button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-sky-500 to-cyan-600 rounded-xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h3>
                  <p className="text-sky-100 mb-4">Ready for your next diving adventure?</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Fish className="h-5 w-5" />
                      <span>Total Dives: {user.total_dives}</span>
                    </div>
                    {user.certification_level && (
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Level: {user.certification_level}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <Waves className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/courses" className="card hover:shadow-lg transition-shadow group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sky-100 rounded-lg group-hover:bg-sky-200 transition-colors">
                    <BookOpen className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Courses</h4>
                    <p className="text-sm text-gray-600">Explore diving courses</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/medical-form" className="card hover:shadow-lg transition-shadow group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Medical Form</h4>
                    <p className="text-sm text-gray-600">Complete health check</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/itinerary" className="card hover:shadow-lg transition-shadow group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                    <MapPin className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Travel Guide</h4>
                    <p className="text-sm text-gray-600">Plan your trip</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Bookings Preview */}
            {userBookings.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Bookings</h3>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="text-sky-600 hover:text-sky-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {userBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{booking.course_name}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.preferred_date).toLocaleDateString()} • {booking.course_price}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">My Bookings</h3>
            
            {userBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No bookings yet</p>
                <Link href="/courses" className="btn-primary">Book Your First Course</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{booking.course_name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Date:</span> {new Date(booking.preferred_date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> {booking.course_price}
                          </div>
                          <div>
                            <span className="font-medium">Booked:</span> {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.payment_status)}`}>
                          Payment: {booking.payment_status}
                        </span>
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="h-3 w-3" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <input
                    type="text"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Dives</label>
                  <input
                    type="text"
                    value={user.total_dives}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certification Level</label>
                  <input
                    type="text"
                    value={user.certification_level || 'Not specified'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div className="pt-4">
                  <button className="btn-primary">Update Profile</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Tab */}
        {(user.role === 'admin' || user.role === 'instructor') && activeTab === 'admin' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-sky-600" />
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Confirmed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Recent Bookings Table */}
            {recentBookings.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Bookings</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Course</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{booking.name}</p>
                              <p className="text-sm text-gray-600">{booking.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">{booking.course_name}</p>
                            <p className="text-sm text-gray-600">{booking.course_price}</p>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(booking.preferred_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.payment_status)}`}>
                              {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
