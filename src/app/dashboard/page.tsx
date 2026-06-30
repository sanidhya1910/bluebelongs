'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Tabs, Tab, Avatar, Chip, Input } from '@heroui/react';
import { 
  Fish,
  BookOpen,
  MapPin,
  Calendar,
  CheckCircle,
  X,
  Activity,
  User as UserIcon,
  Clock,
  Users,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReviewForm from '@/components/ReviewForm';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  certification_level?: string;
  total_dives: number;
  phone?: string;
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
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

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
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Dashboard error:', error);
      setLoading(false);
    }
  };

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

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-sky-600 text-lg">Loading your diving dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center pt-24">
        <Card className="max-w-md shadow-2xl">
          <CardBody className="text-center space-y-4 p-8">
            <p className="text-red-600 text-lg">Please log in to access the dashboard</p>
            <Link href="/login">
              <Button color="primary" size="lg">Go to Login</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 pt-24 pb-12">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={(key) => setActiveTab(key as string)}
          color="primary"
          variant="underlined"
          size="lg"
          classNames={{
            tabList: "bg-white/60 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/50",
            cursor: "bg-gradient-to-r from-sky-500 to-cyan-500 shadow-md",
            tab: "text-slate-700 data-[selected=true]:text-sky-700 font-medium px-6",
            panel: "mt-8"
          }}
        >
          <Tab
            key="overview"
            title={
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <span>Overview</span>
              </div>
            }
          >
            <div className="space-y-8">
              {/* Welcome Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 border-none shadow-2xl overflow-hidden">
                  <CardBody className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-center justify-between text-white gap-6">
                      <div className="flex-1">
                        <h3 className="text-3xl md:text-4xl font-bold mb-3">Welcome back, {user.name}!</h3>
                        <p className="text-sky-100 mb-6 text-lg md:text-xl">Ready for your next diving adventure?</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-5 py-2.5 backdrop-blur-sm border border-white/30">
                            <Fish className="h-5 w-5" />
                            <span className="font-semibold">Total Dives: {user.total_dives}</span>
                          </div>
                          {user.certification_level && (
                            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-5 py-2.5 backdrop-blur-sm border border-white/30">
                              <BookOpen className="h-5 w-5" />
                              <span className="font-semibold">Level: {user.certification_level}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Avatar
                        className="w-28 h-28 text-5xl bg-white/30 text-white border-4 border-white/50 shadow-xl"
                        name={user.name}
                        showFallback
                      />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { href: '/courses', icon: <BookOpen className="h-8 w-8" />, title: 'Browse Courses', desc: 'Explore diving courses', gradient: 'from-sky-50 to-blue-100', iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
                  { href: '/medical-form', icon: <CheckCircle className="h-8 w-8" />, title: 'Medical Form', desc: 'Complete health check', gradient: 'from-green-50 to-emerald-100', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
                  { href: '/itinerary', icon: <MapPin className="h-8 w-8" />, title: 'Travel Guide', desc: 'Plan your trip', gradient: 'from-cyan-50 to-teal-100', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' }
                ].map((action, i) => (
                  <motion.div
                    key={action.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (i + 1), duration: 0.5 }}
                  >
                    <Link href={action.href}>
                      <Card className={`hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br ${action.gradient} border border-white/50`}>
                        <CardBody className="p-7">
                          <div className="flex items-center space-x-5">
                            <div className={`p-4 ${action.iconBg} rounded-2xl shadow-md ${action.iconColor}`}>
                              {action.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg mb-1">{action.title}</h4>
                              <p className="text-sm text-gray-600">{action.desc}</p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Recent Bookings */}
              {userBookings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Card className="shadow-xl border border-white/50">
                    <CardHeader className="flex justify-between items-center pb-0 px-7 pt-6">
                      <h3 className="text-2xl font-bold text-gray-900">Recent Bookings</h3>
                      <Button 
                        onClick={() => setActiveTab('bookings')}
                        color="primary"
                        variant="flat"
                        size="md"
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardBody className="space-y-3 pt-5 px-7 pb-7">
                      {userBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 rounded-xl border border-sky-200 shadow-sm hover:shadow-md transition-shadow">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg mb-1">{booking.course_name}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.preferred_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {booking.course_price}
                            </p>
                          </div>
                          <Chip color={getStatusColor(booking.status)} variant="flat" size="lg">
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Chip>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                </motion.div>
              )}

              {/* Admin Stats */}
              {(user.role === 'admin' || user.role === 'instructor') && stats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                  {[
                    { label: 'Total Bookings', value: stats.totalBookings, icon: <Calendar className="h-8 w-8" />, color: 'from-blue-500 to-blue-600', iconColor: 'text-blue-600' },
                    { label: 'Pending', value: stats.pendingBookings, icon: <Clock className="h-8 w-8" />, color: 'from-yellow-500 to-yellow-600', iconColor: 'text-yellow-600' },
                    { label: 'Confirmed', value: stats.confirmedBookings, icon: <CheckCircle className="h-8 w-8" />, color: 'from-green-500 to-green-600', iconColor: 'text-green-600' },
                    { label: 'Total Users', value: stats.totalUsers, icon: <Users className="h-8 w-8" />, color: 'from-purple-500 to-purple-600', iconColor: 'text-purple-600' }
                  ].map((stat) => (
                    <Card key={stat.label} className="shadow-lg border border-white/50">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`${stat.iconColor}`}>
                            {stat.icon}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </motion.div>
              )}
            </div>
          </Tab>

          <Tab
            key="bookings"
            title={
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>My Bookings</span>
              </div>
            }
          >
            <Card className="shadow-xl border border-white/50">
              <CardHeader className="px-7 pt-6">
                <h3 className="text-2xl font-bold text-gray-900">My Bookings</h3>
              </CardHeader>
              <CardBody className="px-7 pb-7">
                {userBookings.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-block p-6 bg-sky-50 rounded-full mb-6">
                      <Calendar className="h-20 w-20 text-sky-300" />
                    </div>
                    <p className="text-gray-600 text-lg mb-6">No bookings yet</p>
                    <Link href="/courses">
                      <Button color="primary" size="lg" startContent={<BookOpen className="h-5 w-5" />} className="font-semibold">
                        Book Your First Course
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {userBookings.map((booking) => (
                      <Card key={booking.id} className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                        <CardBody className="p-6">
                          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-900 mb-3">{booking.course_name}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-sky-500" />
                                  <span><span className="font-medium">Date:</span> {new Date(booking.preferred_date).toLocaleDateString()}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Price:</span> {booking.course_price}
                                </div>
                                <div>
                                  <span className="font-medium">Booked:</span> {new Date(booking.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-3">
                              <Chip color={getStatusColor(booking.status)} variant="flat" size="lg">
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Chip>
                              <Chip color={getStatusColor(booking.payment_status)} variant="flat">
                                Payment: {booking.payment_status}
                              </Chip>
                              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <Button
                                  onClick={() => cancelBooking(booking.id)}
                                  color="danger"
                                  variant="flat"
                                  size="sm"
                                  startContent={<X className="h-4 w-4" />}
                                >
                                  Cancel
                                </Button>
                              )}
                              {booking.status === 'completed' && (
                                <Button
                                  onClick={() => setReviewBooking(booking)}
                                  color="primary"
                                  variant="flat"
                                  size="sm"
                                  startContent={<Star className="h-4 w-4" />}
                                >
                                  Write a review
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="profile"
            title={
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                <span>Profile</span>
              </div>
            }
          >
            <Card className="shadow-xl border border-white/50">
              <CardHeader className="px-7 pt-6">
                <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
              </CardHeader>
              <CardBody className="px-7 pb-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h4>
                    <Input
                      label="Full Name"
                      value={user.name}
                      isDisabled
                      variant="bordered"
                      size="lg"
                      classNames={{ input: "text-gray-700" }}
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      value={user.email}
                      isDisabled
                      variant="bordered"
                      size="lg"
                      classNames={{ input: "text-gray-700" }}
                    />

                    <Input
                      label="Phone"
                      value={user.phone ?? 'Not provided'}
                      isDisabled
                      variant="bordered"
                      size="lg"
                      classNames={{ input: "text-gray-700" }}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h4>
                    <div className="space-y-5">
                      <Input
                        type="password"
                        label="Current Password"
                        value={pwForm.currentPassword}
                        onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                        variant="bordered"
                        size="lg"
                      />
                      
                      <Input
                        type="password"
                        label="New Password"
                        value={pwForm.newPassword}
                        onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                        variant="bordered"
                        size="lg"
                      />
                      
                      <Input
                        type="password"
                        label="Confirm New Password"
                        value={pwForm.confirm}
                        onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                        variant="bordered"
                        size="lg"
                      />
                      
                      <div className="flex flex-col gap-3 pt-2">
                        <Button
                          onClick={async () => {
                            setPwMessage(null);
                            if (!pwForm.currentPassword || !pwForm.newPassword) {
                              setPwMessage('Please fill all password fields');
                              return;
                            }
                            if (pwForm.newPassword !== pwForm.confirm) {
                              setPwMessage('New passwords do not match');
                              return;
                            }
                            try {
                              setPwLoading(true);
                              const token = localStorage.getItem('authToken');
                              const res = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/auth/change-password', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
                              });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                setPwMessage('Password updated successfully');
                                setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
                              } else {
                                setPwMessage(data.error || 'Failed to change password');
                              }
                            } catch {
                              setPwMessage('Network error. Please try again.');
                            } finally {
                              setPwLoading(false);
                            }
                          }}
                          color="primary"
                          isLoading={pwLoading}
                          size="lg"
                          className="w-full font-semibold"
                        >
                          Change Password
                        </Button>
                        {pwMessage && (
                          <p className={`text-sm font-medium ${pwMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                            {pwMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Write-a-review modal */}
      {reviewBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Write a review"
          onClick={() => setReviewBooking(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setReviewBooking(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-600 shadow hover:bg-white"
              aria-label="Close review form"
            >
              <X className="h-5 w-5" />
            </button>
            <ReviewForm
              bookingId={reviewBooking.id}
              courseId=""
              courseName={reviewBooking.course_name}
              onSuccess={() => setReviewBooking(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
