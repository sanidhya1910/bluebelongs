'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Save, X, Clock, Award, MapPin, Waves, Users, BookOpen, Calendar, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, CardHeader, Button, Chip, Input, Textarea } from '@heroui/react';

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
  image?: string;
  slots?: CourseSlot[];
  // Special Offer fields
  offerActive?: boolean;
  offerTitle?: string;
  offerDescription?: string;
  offerDiscountPercent?: number;
  offerDiscountAmount?: number;
  offerExpiryDate?: string;
  offerCode?: string;
}

interface CourseSlot {
  id: string;
  courseId: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
  available: boolean;
  instructor?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  certification_level?: string;
  total_dives?: number;
  created_at: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  course_id: string;
  course_name: string;
  course_price: string;
  preferred_date: string;
  experience?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  created_at: string;
  notes?: string;
}

interface AdminStats {
  totalBookings: number;
  totalUsers: number;
  totalCourses: number;
  activeBookings: number;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  featured: boolean;
  published: boolean;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'announcement';
  priority: 'low' | 'medium' | 'high';
  active: boolean;
  createdAt: string;
  expiresAt?: string;
  replies?: AnnouncementReply[];
}

interface AnnouncementReply {
  id: string;
  announcementId: string;
  userId: number;
  userName: string;
  userEmail: string;
  message: string;
  createdAt: string;
}

type GalleryItem = {
  id: string | number;
  title: string;
  desc: string;
  img: string;
  height: number;
  url?: string;
};

type ViewModalState =
  | { type: 'booking'; data: Booking }
  | { type: 'user'; data: User }
  | { type: null; data: null };

interface AdminReview {
  id: number;
  course_name: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  // Removed unused stats state
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'bookings' | 'users' | 'blogs' | 'gallery' | 'messages' | 'reviews'>('overview');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>({});
  const [courseImageOverrides, setCourseImageOverrides] = useState<Record<string, string>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  // Modal state for replacing browser alerts on "View" actions
  const [viewModal, setViewModal] = useState<ViewModalState>({ type: null, data: null });
  // router not used

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
    // Load local overrides on mount/tab changes
    loadCourseImageOverrides();
    if (activeTab === 'gallery') {
      loadGallery();
    }
    if (activeTab === 'bookings') {
      loadBookings();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'blogs') {
      loadBlogs();
    } else if (activeTab === 'messages') {
      loadAnnouncements();
    } else if (activeTab === 'reviews') {
      loadReviews();
    }
  }, [activeTab]);

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

  const loadCourseImageOverrides = () => {
    try {
      const raw = localStorage.getItem('courseImageOverrides');
      setCourseImageOverrides(raw ? JSON.parse(raw) : {});
    } catch {
      setCourseImageOverrides({});
    }
  };

  const saveCourseImageOverride = (courseId: string, url: string) => {
    const next = { ...courseImageOverrides, [courseId]: url };
    setCourseImageOverrides(next);
    localStorage.setItem('courseImageOverrides', JSON.stringify(next));
  };

  const clearCourseImageOverride = (courseId: string) => {
    const next = { ...courseImageOverrides };
    delete next[courseId];
    setCourseImageOverrides(next);
    localStorage.setItem('courseImageOverrides', JSON.stringify(next));
  };

  const loadGallery = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/admin/gallery', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        const items: GalleryItem[] = data.items || [];
        setGalleryItems(items);
        // Update localStorage with actual DB items
        localStorage.setItem('masonryGallery', JSON.stringify(items));
        return;
      } else {
        console.error('Failed to load gallery:', res.status, res.statusText);
      }
    } catch (err) {
      console.error('Error loading gallery:', err);
    }
    
    // Fallback to localStorage only if API fails completely
    try {
      const raw = localStorage.getItem('masonryGallery');
      const fallbackItems = raw ? JSON.parse(raw) : [];
      setGalleryItems(Array.isArray(fallbackItems) ? fallbackItems : []);
    } catch {
      setGalleryItems([]);
    }
  };

  const saveGalleryItem = async (item: Omit<GalleryItem, 'id'> & { id?: string | number }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const isUpdate = Boolean(item.id);
      const url = isUpdate
        ? `https://bluebelong-api.blackburn1910.workers.dev/api/admin/gallery/${String(item.id)}`
        : 'https://bluebelong-api.blackburn1910.workers.dev/api/admin/gallery';
      const method = isUpdate ? 'PUT' : 'POST';
      const body = JSON.stringify({
        title: item.title,
        desc: item.desc,
        img: item.img,
        height: item.height,
        url: item.url || undefined,
      });

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Failed to save gallery item');
      }

      // Refresh from server to get canonical list and IDs
      await loadGallery();
      setEditingGallery(null);
      setShowGalleryForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save gallery item';
      alert(msg);
    }
  };

  const deleteGalleryItem = async (id: GalleryItem['id']) => {
    if (!confirm('Delete this gallery item?')) return;
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`https://bluebelong-api.blackburn1910.workers.dev/api/admin/gallery/${String(id)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Failed to delete gallery item');
      }
      await loadGallery();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete gallery item';
      alert(msg);
    }
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
    } catch (err) {
      console.error('Error loading courses:', err);
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
    } catch (err) {
      console.error('Error loading admin stats:', err);
    }
  };

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const loadReviews = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/admin/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

  const updateReviewStatus = async (reviewId: number, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bluebelong-api.blackburn1910.workers.dev/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status } : r)));
      } else {
        const error = await response.json().catch(() => ({}));
        alert(error.error || 'Failed to update review');
      }
    } catch (err) {
      console.error('Error updating review:', err);
      alert('Failed to update review');
    }
  };

  const handleUpdateUser = async (userId: number, updates: Partial<User>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bluebelong-api.blackburn1910.workers.dev/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        alert('User updated successfully!');
        setShowUserForm(false);
        setEditingUser(null);
        loadUsers();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bluebelong-api.blackburn1910.workers.dev/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('User deleted successfully!');
        loadUsers();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const loadBlogs = async () => {
    try {
      // For now, using local storage for blogs
      const storedBlogs = localStorage.getItem('blogs');
      if (storedBlogs) {
        setBlogs(JSON.parse(storedBlogs));
      } else {
        // Initialize with default blogs if none exist
        const defaultBlogs: BlogPost[] = [
          {
            id: "1",
            title: "Best Diving Spots in Andaman",
            excerpt: "Discover the most breathtaking underwater locations in the Andaman Islands.",
            content: "The Andaman Islands offer some of the most pristine diving conditions in the world...",
            author: "Blue Belongs Team",
            date: "2024-01-15",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=400&fit=crop",
            category: "Diving Spots",
            published: true,
            featured: true
          },
          {
            id: "2",
            title: "Marine Life Conservation Efforts",
            excerpt: "How Blue Belongs is contributing to coral reef conservation in Andaman.",
            content: "Conservation is at the heart of what we do at Blue Belongs...",
            author: "Blue Belongs Team",
            date: "2024-01-10",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
            category: "Conservation",
            published: true,
            featured: false
          }
        ];
        setBlogs(defaultBlogs);
        localStorage.setItem('blogs', JSON.stringify(defaultBlogs));
      }
    } catch (err) {
      console.error('Error loading blogs:', err);
    }
  };

  const saveBlog = async (blog: Omit<BlogPost, 'id'> | BlogPost) => {
    try {
      let updatedBlogs;
      if ('id' in blog) {
        // Update existing blog
        updatedBlogs = blogs.map(b => b.id === blog.id ? blog : b);
      } else {
        // Create new blog
        const maxId = blogs.length > 0 ? Math.max(...blogs.map(b => parseInt(b.id))) : 0;
        const newBlog: BlogPost = {
          ...blog,
          id: (maxId + 1).toString()
        };
        updatedBlogs = [...blogs, newBlog];
      }
      
      setBlogs(updatedBlogs);
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
      setEditingBlog(null);
      setShowBlogForm(false);
      return true;
    } catch (err) {
      console.error('Error saving blog:', err);
      return false;
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const updatedBlogs = blogs.filter(b => b.id !== id);
      setBlogs(updatedBlogs);
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
      return true;
    } catch (err) {
      console.error('Error deleting blog:', err);
      return false;
    }
  };

  // Announcement Management Functions
  const loadAnnouncements = async () => {
    try {
      const storedAnnouncements = localStorage.getItem('announcements');
      if (storedAnnouncements) {
        setAnnouncements(JSON.parse(storedAnnouncements));
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      console.error('Error loading announcements:', err);
    }
  };

  const saveAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt' | 'replies'> | Announcement) => {
    try {
      let updatedAnnouncements;
      if ('id' in announcement) {
        // Update existing announcement
        updatedAnnouncements = announcements.map(a => a.id === announcement.id ? announcement : a);
      } else {
        // Create new announcement
        const newAnnouncement: Announcement = {
          ...announcement,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          replies: []
        };
        updatedAnnouncements = [...announcements, newAnnouncement];
      }
      
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
      setEditingAnnouncement(null);
      setShowAnnouncementForm(false);
      alert('Announcement saved successfully!');
      return true;
    } catch (err) {
      console.error('Error saving announcement:', err);
      alert('Failed to save announcement');
      return false;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }
    try {
      const updatedAnnouncements = announcements.filter(a => a.id !== id);
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
      alert('Announcement deleted successfully!');
      return true;
    } catch (err) {
      console.error('Error deleting announcement:', err);
      alert('Failed to delete announcement');
      return false;
    }
  };

  const toggleAnnouncementActive = async (id: string) => {
    try {
      const updatedAnnouncements = announcements.map(a => 
        a.id === id ? { ...a, active: !a.active } : a
      );
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
      return true;
    } catch (err) {
      console.error('Error toggling announcement:', err);
      return false;
    }
  };

  // Blog Form Component
  const BlogForm = ({ blog, onSave, onCancel }: {
    blog?: BlogPost | null;
    onSave: (blog: Omit<BlogPost, 'id'> | BlogPost) => Promise<boolean>;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: blog?.title || '',
      excerpt: blog?.excerpt || '',
      content: blog?.content || '',
      author: blog?.author || 'Blue Belongs Team',
      date: blog?.date || new Date().toISOString().split('T')[0],
      category: blog?.category || 'Diving',
      readTime: blog?.readTime || '5 min read',
      image: blog?.image || '',
      featured: blog?.featured || false,
      published: blog?.published || false
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await onSave(blog ? { ...formData, id: blog.id } : formData);
      if (success) {
        onCancel();
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={8}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Read Time</label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="5 min read"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700">
              Featured Post
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="published" className="text-sm font-medium text-slate-700">
              Published
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Save size={16} />
            {blog ? 'Update' : 'Create'} Blog Post
          </button>
        </div>
      </form>
    );
  };

      const updateBookingStatus = async (id: number, status: Booking['status']) => {
    try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`https://bluebelong-api.blackburn1910.workers.dev/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Update local state
        setBookings(bookings.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        ));
      } else {
        alert('Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Error updating booking status');
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
    } catch (err) {
      console.error('Error saving course:', err);
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
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course');
    }
  };

  const handleToggleAvailability = async (courseId: string, _currentStatus: boolean) => {
  // Mark unused param as intentionally unused to satisfy lint rules
  void _currentStatus;
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
    } catch (err) {
      console.error('Error toggling course availability:', err);
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
      <div className="min-h-screen sand-section flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 pt-20">
      {/* View Details Modal */}
      {viewModal.type && viewModal.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="view-modal-title">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewModal({ type: null, data: null })} />
          <div className="relative z-10 w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 id="view-modal-title" className="text-lg font-semibold text-slate-800">{viewModal.type === 'booking' ? 'Booking Details' : 'User Details'}</h3>
              <button aria-label="Close" className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100" onClick={() => setViewModal({ type: null, data: null })}>✕</button>
            </div>
            <div className="px-6 py-5 text-slate-800">
              {viewModal.type === 'booking' && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Customer</span><span className="font-medium">{viewModal.data.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Email</span><span className="font-medium break-all">{viewModal.data.email}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Phone</span><span className="font-medium">{viewModal.data.phone || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Course</span><span className="font-medium">{viewModal.data.course_name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Price</span><span className="font-medium">{viewModal.data.course_price}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Preferred Date</span><span className="font-medium">{new Date(viewModal.data.preferred_date).toLocaleDateString()}</span></div>
                  <div><div className="text-slate-600">Experience</div><div className="font-medium">{viewModal.data.experience || 'None specified'}</div></div>
                  <div><div className="text-slate-600">Notes</div><div className="font-medium whitespace-pre-wrap">{viewModal.data.notes || 'None'}</div></div>
                  <div className="flex justify-between"><span className="text-slate-600">Booking Date</span><span className="font-medium">{new Date(viewModal.data.created_at).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Payment Status</span><span className="font-medium capitalize">{viewModal.data.payment_status}</span></div>
                </div>
              )}
              {viewModal.type === 'user' && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Name</span><span className="font-medium">{viewModal.data.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Email</span><span className="font-medium break-all">{viewModal.data.email}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Phone</span><span className="font-medium">{viewModal.data.phone || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Role</span><span className="font-medium capitalize">{viewModal.data.role}</span></div>
                  {viewModal.data.created_at && (
                    <div className="flex justify-between"><span className="text-slate-600">Joined</span><span className="font-medium">{new Date(viewModal.data.created_at).toLocaleDateString()}</span></div>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button className="btn-secondary" onClick={() => setViewModal({ type: null, data: null })}>Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">Admin Dashboard</h1>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-slate-600">Welcome back,</p>
                <Chip color="primary" variant="flat" size="sm">{user?.name || 'Admin'}</Chip>
              </div>
            </div>
            <Button
              color="danger"
              variant="shadow"
              onPress={handleLogout}
              className="font-semibold"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{adminStats?.totalCourses || 0}</p>
                  </div>
                  <div className="bg-blue-200 p-3 rounded-full">
                    <BookOpen className="h-8 w-8 text-blue-700" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{adminStats?.totalBookings || 0}</p>
                  </div>
                  <div className="bg-green-200 p-3 rounded-full">
                    <Calendar className="h-8 w-8 text-green-700" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{adminStats?.totalUsers || 0}</p>
                  </div>
                  <div className="bg-purple-200 p-3 rounded-full">
                    <Users className="h-8 w-8 text-purple-700" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Active Bookings</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{adminStats?.activeBookings || 0}</p>
                  </div>
                  <div className="bg-orange-200 p-3 rounded-full">
                    <Clock className="h-8 w-8 text-orange-700" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white/60 backdrop-blur-md p-2 rounded-2xl shadow-lg overflow-x-auto">
            <Button
              onPress={() => setActiveTab('courses')}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'courses'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
            >
              Course Management
            </Button>
            <Button
              onPress={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
            >
              Booking Management
            </Button>
            <Button
              onPress={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
            >
              User Management
            </Button>
            <Button
              onPress={() => setActiveTab('blogs')}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'blogs'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
            >
              Blog Management
            </Button>
            <Button
              onPress={() => setActiveTab('gallery')}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
            >
              Gallery Management
            </Button>
            <Button
              onPress={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
            >
              Message Board
            </Button>
            <Button
              onPress={() => setActiveTab('reviews')}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
            >
              Reviews
            </Button>
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
              className="bg-white rounded-xl shadow-md border border-slate-200/80 p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-shadow duration-300"
              whileHover={{ scale: 1.005 }}
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

                  {/* Image override controls */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course Image URL (override)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        defaultValue={courseImageOverrides[course.id] || ''}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onBlur={(e) => {
                          const url = e.target.value.trim();
                          if (url) saveCourseImageOverride(course.id, url);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => clearCourseImageOverride(course.id)}
                        className="px-3 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                        title="Clear override"
                      >
                        Clear
                      </button>
                    </div>
                    {courseImageOverrides[course.id] && (
                      <div className="mt-2 text-xs text-slate-500">Override set. Public courses page will use this image.</div>
                    )}
                  </div>
                  
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
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Booking Management</h2>
                <div className="flex gap-2">
                  <select 
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onChange={(e) => {
                      // Filter bookings by status
                      const filtered = e.target.value === 'all' 
                        ? bookings 
                        : bookings.filter(booking => booking.status === e.target.value);
                      setBookings(filtered);
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-sky-50 to-cyan-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Participants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-sky-50/50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            #{booking.id.toString().padStart(6, '0')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{booking.name}</div>
                            <div className="text-sm text-slate-500">{booking.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {booking.course_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            <div>{new Date(booking.preferred_date).toLocaleDateString()}</div>
                            <div className="text-slate-500">As requested</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            1 person
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                              booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.payment_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
                                className="text-xs px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                              </select>
                              <button
                                onClick={() => setViewModal({ type: 'booking', data: booking })}
                                className="text-blue-600 hover:text-blue-900 text-xs"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No bookings found
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">User Management</h2>
                <div className="flex gap-2">
                  <select 
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onChange={() => {
                      // Filter users by role
                      loadUsers(); // Reload all users first
                    }}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>
              </div>

              {/* User Edit Form */}
              {showUserForm && editingUser && (
                <div className="bg-white rounded-xl shadow-md border border-slate-200/80 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Edit User</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={editingUser.phone || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="user">User</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => handleUpdateUser(editingUser.id, editingUser)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setShowUserForm(false);
                          setEditingUser(null);
                        }}
                        className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-sky-50 to-cyan-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Name & Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Role
                        </th>
                        {false && (
                          <>
                            <th className="px-6 py-3 text-left text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Certification</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Total Dives</th>
                          </>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-sky-50/50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            #{user.id.toString().padStart(4, '0')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {user.phone || 'Not provided'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          {false && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.certification_level || 'None'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.total_dives || 0}</td>
                            </>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setViewModal({ type: 'user', data: user })}
                                className="text-blue-600 hover:text-blue-900 text-xs"
                              >
                                View
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowUserForm(true);
                                }}
                                className="text-green-600 hover:text-green-900 text-xs"
                              >
                                Edit
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 text-xs"
                                disabled={false}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No users found
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'blogs' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Blog Management</h2>
                <button
                  onClick={() => {
                    setEditingBlog(null);
                    setShowBlogForm(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add New Blog Post
                </button>
              </div>

              {/* Blog Form */}
              {showBlogForm && (
                <div className="bg-white rounded-xl shadow-md border border-slate-200/80 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h3>
                  <BlogForm
                    blog={editingBlog}
                    onSave={saveBlog}
                    onCancel={() => {
                      setShowBlogForm(false);
                      setEditingBlog(null);
                    }}
                  />
                </div>
              )}

              {/* Blogs List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80">
                <div className="overflow-x-auto">
          <table className="w-full">
                    <thead>
            <tr className="border-b border-slate-200 bg-gradient-to-r from-sky-50 to-cyan-50">
            <th className="text-left p-4 text-sm font-medium text-slate-700">Image</th>
            <th className="text-left p-4 text-sm font-medium text-slate-700">Title</th>
            <th className="text-left p-4 text-sm font-medium text-slate-700">Category</th>
            <th className="text-left p-4 text-sm font-medium text-slate-700">Author</th>
            <th className="text-left p-4 text-sm font-medium text-slate-700">Date</th>
            <th className="text-left p-4 text-sm font-medium text-slate-700">Status</th>
            <th className="text-left p-4 text-sm font-medium text-slate-700">Actions</th>
                      </tr>
                    </thead>
          <tbody>
                      {blogs.map((blog) => (
            <tr key={blog.id} className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors duration-150">
                          <td className="p-4">
                            <div className="relative w-16 h-12">
                              <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                sizes="64px"
                                className="object-cover rounded"
                              />
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-slate-900">{blog.title}</p>
                              <p className="text-sm text-slate-500">{blog.excerpt}</p>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-slate-600">{blog.category}</td>
                          <td className="p-4 text-sm text-slate-600">{blog.author}</td>
                          <td className="p-4 text-sm text-slate-600">{blog.date}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                blog.published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </span>
                              {blog.featured && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingBlog(blog);
                                  setShowBlogForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => deleteBlog(blog.id)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                              {blog.published ? (
                              <div title="Published">
                                <Eye size={16} className="text-green-600" />
                              </div>
                              ) : (
                              <div title="Draft">
                                <EyeOff size={16} className="text-yellow-600" />
                              </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {blogs.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No blog posts found. Create your first blog post!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Masonry Gallery</h2>
                <button
                  onClick={() => { setEditingGallery(null); setShowGalleryForm(true); }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              </div>

              {/* Gallery Form */}
              {showGalleryForm && (
                <div className="bg-white rounded-xl shadow-md border border-slate-200/80 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{editingGallery ? 'Edit' : 'Add'} Gallery Item</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget as HTMLFormElement);
                      const payload = {
                        id: editingGallery?.id,
                        title: String(fd.get('title') || ''),
                        desc: String(fd.get('desc') || ''),
                        img: String(fd.get('img') || ''),
                        height: Number(fd.get('height') || 400),
                        url: String(fd.get('url') || ''),
                      } as GalleryItem;
                      await saveGalleryItem(payload);
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                      <input name="title" defaultValue={editingGallery?.title || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Link URL (optional)</label>
                      <input name="url" defaultValue={editingGallery?.url || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <input name="desc" defaultValue={editingGallery?.desc || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                      <input name="img" type="url" defaultValue={editingGallery?.img || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Display Height (px)</label>
                      <input name="height" type="number" min="200" max="800" defaultValue={editingGallery?.height || 420} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
                    </div>
                    <div className="flex items-end gap-3">
                      <button type="submit" className="btn-primary">Save Item</button>
                      <button type="button" className="btn-secondary" onClick={() => { setShowGalleryForm(false); setEditingGallery(null); }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Gallery Items List */}
              <div className="grid gap-4">
                {galleryItems.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
                    <div className="relative w-24 h-16 overflow-hidden rounded">
                      <Image src={item.img} alt={item.title} fill className="object-cover" sizes="96px" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{item.title}</div>
                      <div className="text-sm text-slate-500">{item.desc}</div>
                      <div className="text-xs text-slate-400">Height: {item.height}px {item.url ? `• Link: ${item.url}` : ''}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => { setEditingGallery(item); setShowGalleryForm(true); }} title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => deleteGalleryItem(item.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {galleryItems.length === 0 && (
                  <div className="text-center py-12 text-slate-500">No gallery items yet. Add your first one.</div>
                )}
              </div>
            </motion.div>
          )}

          {/* Message Board Tab */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Message Board</h2>
                <Button
                  color="primary"
                  variant="shadow"
                  startContent={<Plus className="h-4 w-4" />}
                  onPress={() => {
                    setEditingAnnouncement(null);
                    setShowAnnouncementForm(true);
                  }}
                >
                  Create Announcement
                </Button>
              </div>

              {/* Announcement Form */}
              {showAnnouncementForm && (
                <Card className="mb-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <Input
                        label="Title"
                        placeholder="Enter announcement title"
                        value={editingAnnouncement?.title || ''}
                        onChange={(e) => setEditingAnnouncement({
                          ...editingAnnouncement,
                          id: editingAnnouncement?.id || '',
                          title: e.target.value,
                          message: editingAnnouncement?.message || '',
                          type: editingAnnouncement?.type || 'info',
                          priority: editingAnnouncement?.priority || 'medium',
                          active: editingAnnouncement?.active !== undefined ? editingAnnouncement.active : true,
                          createdAt: editingAnnouncement?.createdAt || new Date().toISOString(),
                        } as Announcement)}
                        required
                      />
                      
                      <Textarea
                        label="Message"
                        placeholder="Enter your announcement message"
                        value={editingAnnouncement?.message || ''}
                        onChange={(e) => setEditingAnnouncement({
                          ...editingAnnouncement,
                          id: editingAnnouncement?.id || '',
                          title: editingAnnouncement?.title || '',
                          message: e.target.value,
                          type: editingAnnouncement?.type || 'info',
                          priority: editingAnnouncement?.priority || 'medium',
                          active: editingAnnouncement?.active !== undefined ? editingAnnouncement.active : true,
                          createdAt: editingAnnouncement?.createdAt || new Date().toISOString(),
                        } as Announcement)}
                        minRows={4}
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                          <select
                            value={editingAnnouncement?.type || 'info'}
                            onChange={(e) => setEditingAnnouncement({
                              ...editingAnnouncement,
                              id: editingAnnouncement?.id || '',
                              title: editingAnnouncement?.title || '',
                              message: editingAnnouncement?.message || '',
                              type: e.target.value as Announcement['type'],
                              priority: editingAnnouncement?.priority || 'medium',
                              active: editingAnnouncement?.active !== undefined ? editingAnnouncement.active : true,
                              createdAt: editingAnnouncement?.createdAt || new Date().toISOString(),
                            } as Announcement)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="success">Success</option>
                            <option value="announcement">Announcement</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                          <select
                            value={editingAnnouncement?.priority || 'medium'}
                            onChange={(e) => setEditingAnnouncement({
                              ...editingAnnouncement,
                              id: editingAnnouncement?.id || '',
                              title: editingAnnouncement?.title || '',
                              message: editingAnnouncement?.message || '',
                              type: editingAnnouncement?.type || 'info',
                              priority: e.target.value as Announcement['priority'],
                              active: editingAnnouncement?.active !== undefined ? editingAnnouncement.active : true,
                              createdAt: editingAnnouncement?.createdAt || new Date().toISOString(),
                            } as Announcement)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Expires At (Optional)</label>
                          <input
                            type="datetime-local"
                            value={editingAnnouncement?.expiresAt?.slice(0, 16) || ''}
                            onChange={(e) => setEditingAnnouncement({
                              ...editingAnnouncement,
                              id: editingAnnouncement?.id || '',
                              title: editingAnnouncement?.title || '',
                              message: editingAnnouncement?.message || '',
                              type: editingAnnouncement?.type || 'info',
                              priority: editingAnnouncement?.priority || 'medium',
                              active: editingAnnouncement?.active !== undefined ? editingAnnouncement.active : true,
                              createdAt: editingAnnouncement?.createdAt || new Date().toISOString(),
                              expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                            } as Announcement)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          color="primary"
                          onPress={() => saveAnnouncement(editingAnnouncement!)}
                        >
                          {editingAnnouncement?.id ? 'Update' : 'Create'} Announcement
                        </Button>
                        <Button
                          color="default"
                          variant="flat"
                          onPress={() => {
                            setShowAnnouncementForm(false);
                            setEditingAnnouncement(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Announcements List */}
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className={`${!announcement.active ? 'opacity-60' : ''}`}>
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-slate-800">{announcement.title}</h3>
                            <Chip
                              size="sm"
                              color={
                                announcement.type === 'warning' ? 'warning' :
                                announcement.type === 'success' ? 'success' :
                                announcement.type === 'announcement' ? 'secondary' :
                                'primary'
                              }
                              variant="flat"
                            >
                              {announcement.type}
                            </Chip>
                            <Chip
                              size="sm"
                              color={
                                announcement.priority === 'high' ? 'danger' :
                                announcement.priority === 'medium' ? 'warning' :
                                'default'
                              }
                              variant="flat"
                            >
                              {announcement.priority} priority
                            </Chip>
                            <Chip
                              size="sm"
                              color={announcement.active ? 'success' : 'default'}
                              variant="flat"
                            >
                              {announcement.active ? 'Active' : 'Inactive'}
                            </Chip>
                          </div>
                          
                          <p className="text-slate-600 mb-3 whitespace-pre-wrap">{announcement.message}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Created: {new Date(announcement.createdAt).toLocaleString()}</span>
                            {announcement.expiresAt && (
                              <span>Expires: {new Date(announcement.expiresAt).toLocaleString()}</span>
                            )}
                            {announcement.replies && announcement.replies.length > 0 && (
                              <span className="text-blue-600 font-medium">
                                {announcement.replies.length} {announcement.replies.length === 1 ? 'reply' : 'replies'}
                              </span>
                            )}
                          </div>

                          {/* Replies Section */}
                          {announcement.replies && announcement.replies.length > 0 && (
                            <div className="mt-4 pl-4 border-l-2 border-slate-200 space-y-3">
                              {announcement.replies.map((reply) => (
                                <div key={reply.id} className="bg-slate-50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-slate-700">{reply.userName}</span>
                                    <span className="text-xs text-slate-500">{reply.userEmail}</span>
                                    <span className="text-xs text-slate-400">
                                      {new Date(reply.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600">{reply.message}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            color={announcement.active ? 'warning' : 'success'}
                            variant="flat"
                            onPress={() => toggleAnnouncementActive(announcement.id)}
                          >
                            {announcement.active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            startContent={<Edit className="h-3 w-3" />}
                            onPress={() => {
                              setEditingAnnouncement(announcement);
                              setShowAnnouncementForm(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<Trash2 className="h-3 w-3" />}
                            onPress={() => deleteAnnouncement(announcement.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
                
                {announcements.length === 0 && (
                  <Card>
                    <CardBody className="text-center py-12 text-slate-500">
                      <p className="text-lg mb-2">No announcements yet</p>
                      <p className="text-sm">Create your first announcement to communicate with customers</p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Customer Reviews</h2>
                <p className="text-slate-500 text-sm mt-1">Approve a review to publish it on the site; reject to hide it.</p>
              </div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardBody className="p-5">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <span className="font-semibold text-slate-800">{review.reviewer_name}</span>
                            <span className="text-yellow-500 text-sm" aria-label={`${review.rating} out of 5 stars`}>
                              {'★'.repeat(review.rating)}
                              <span className="text-slate-300">{'★'.repeat(5 - review.rating)}</span>
                            </span>
                            <Chip
                              size="sm"
                              variant="flat"
                              color={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'danger' : 'warning'}
                            >
                              {review.status}
                            </Chip>
                          </div>
                          <p className="text-xs text-slate-500 mb-2">
                            {review.course_name} · {new Date(review.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-slate-700">{review.comment}</p>
                        </div>
                        <div className="flex md:flex-col gap-2 shrink-0">
                          {review.status !== 'approved' && (
                            <Button size="sm" color="success" variant="flat" onPress={() => updateReviewStatus(review.id, 'approved')}>
                              Approve
                            </Button>
                          )}
                          {review.status !== 'rejected' && (
                            <Button size="sm" color="danger" variant="flat" onPress={() => updateReviewStatus(review.id, 'rejected')}>
                              Reject
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}

                {reviews.length === 0 && (
                  <Card>
                    <CardBody className="text-center py-12 text-slate-500">
                      <p className="text-lg mb-2">No reviews yet</p>
                      <p className="text-sm">Reviews submitted by customers will appear here for approval</p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
