'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, Send, AlertCircle, Info, CheckCircle, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function MessageBoard() {
  const [isOpen, setIsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [user, setUser] = useState<{ id: number; email: string; name: string; role: string } | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    loadAnnouncements();
    loadUser();
    checkUnreadAnnouncements();
  }, []);

  const loadUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const loadAnnouncements = () => {
    try {
      const storedAnnouncements = localStorage.getItem('announcements');
      if (storedAnnouncements) {
        const allAnnouncements: Announcement[] = JSON.parse(storedAnnouncements);
        // Filter active announcements that haven't expired
        const activeAnnouncements = allAnnouncements.filter(a => {
          if (!a.active) return false;
          if (a.expiresAt && new Date(a.expiresAt) < new Date()) return false;
          return true;
        });
        setAnnouncements(activeAnnouncements);
      }
    } catch (err) {
      console.error('Error loading announcements:', err);
    }
  };

  const checkUnreadAnnouncements = () => {
    try {
      const lastRead = localStorage.getItem('lastReadAnnouncement');
      const storedAnnouncements = localStorage.getItem('announcements');
      if (storedAnnouncements) {
        const allAnnouncements: Announcement[] = JSON.parse(storedAnnouncements);
        const activeAnnouncements = allAnnouncements.filter(a => a.active);
        if (activeAnnouncements.length > 0) {
          const latestAnnouncementDate = Math.max(...activeAnnouncements.map(a => new Date(a.createdAt).getTime()));
          const lastReadDate = lastRead ? new Date(lastRead).getTime() : 0;
          setHasUnread(latestAnnouncementDate > lastReadDate);
        }
      }
    } catch (err) {
      console.error('Error checking unread announcements:', err);
    }
  };

  const markAsRead = () => {
    localStorage.setItem('lastReadAnnouncement', new Date().toISOString());
    setHasUnread(false);
  };

  const handleReply = (announcementId: string) => {
    if (!user) {
      alert('Please login to reply to announcements');
      return;
    }

    if (!replyMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      const storedAnnouncements = localStorage.getItem('announcements');
      if (storedAnnouncements) {
        const allAnnouncements: Announcement[] = JSON.parse(storedAnnouncements);
        const updatedAnnouncements = allAnnouncements.map(a => {
          if (a.id === announcementId) {
            const newReply: AnnouncementReply = {
              id: Date.now().toString(),
              announcementId,
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
              message: replyMessage,
              createdAt: new Date().toISOString()
            };
            return {
              ...a,
              replies: [...(a.replies || []), newReply]
            };
          }
          return a;
        });
        localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
        setReplyMessage('');
        loadAnnouncements();
        alert('Reply sent successfully!');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Failed to send reply');
    }
  };

  const getIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-5 w-5" />;
      case 'success': return <CheckCircle className="h-5 w-5" />;
      case 'announcement': return <Megaphone className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: Announcement['type']) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'announcement': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (announcements.length === 0) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          markAsRead();
        }}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-sky-500 to-cyan-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
      >
        <MessageCircle className="h-6 w-6" />
        {hasUnread && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      {/* Message Board Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-6 w-6" />
                    <h2 className="text-xl font-bold">Announcements</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-white/80 mt-2">
                  {announcements.length} active {announcements.length === 1 ? 'message' : 'messages'}
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedAnnouncement ? (
                  // Single Announcement View
                  <div>
                    <button
                      onClick={() => setSelectedAnnouncement(null)}
                      className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1 text-sm"
                    >
                      ← Back to all
                    </button>

                    <div className={`border-2 rounded-xl p-6 ${getTypeColor(selectedAnnouncement.type)}`}>
                      <div className="flex items-start gap-3 mb-4">
                        {getIcon(selectedAnnouncement.type)}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold">{selectedAnnouncement.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedAnnouncement.priority)}`}>
                              {selectedAnnouncement.priority}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{selectedAnnouncement.message}</p>
                          <p className="text-xs mt-3 opacity-70">
                            {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Replies */}
                      {selectedAnnouncement.replies && selectedAnnouncement.replies.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-current/20">
                          <h4 className="font-semibold text-sm mb-3">Replies ({selectedAnnouncement.replies.length})</h4>
                          <div className="space-y-3">
                            {selectedAnnouncement.replies.map(reply => (
                              <div key={reply.id} className="bg-white/60 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-xs">{reply.userName}</span>
                                  <span className="text-xs opacity-60">
                                    {new Date(reply.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">{reply.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reply Form */}
                      {user && (
                        <div className="mt-4 pt-4 border-t border-current/20">
                          <h4 className="font-semibold text-sm mb-2">Reply to this announcement</h4>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder="Type your message..."
                              className="flex-1 px-3 py-2 border border-current/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-current/50 bg-white/80"
                              onKeyPress={(e) => e.key === 'Enter' && handleReply(selectedAnnouncement.id)}
                            />
                            <button
                              onClick={() => handleReply(selectedAnnouncement.id)}
                              className="p-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {!user && (
                        <p className="mt-4 pt-4 border-t border-current/20 text-sm text-center opacity-70">
                          Please <a href="/login" className="underline font-semibold">login</a> to reply
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // All Announcements List
                  announcements.map((announcement) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border-2 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all ${getTypeColor(announcement.type)}`}
                      onClick={() => setSelectedAnnouncement(announcement)}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(announcement.type)}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold">{announcement.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(announcement.priority)}`}>
                              {announcement.priority}
                            </span>
                          </div>
                          <p className="text-sm line-clamp-2">{announcement.message}</p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs opacity-70">
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </p>
                            {announcement.replies && announcement.replies.length > 0 && (
                              <span className="text-xs font-semibold">
                                {announcement.replies.length} {announcement.replies.length === 1 ? 'reply' : 'replies'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
