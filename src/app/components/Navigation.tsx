'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Waves, User, LogOut } from 'lucide-react';
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

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/courses', label: 'Courses' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/medical-form', label: 'Medical Form' },
    { href: '/itinerary', label: 'Itinerary' },
    ...(user ? [
      { href: '/dashboard', label: 'Dashboard' }
    ] : [
      { href: '/login', label: 'Login' }
    ])
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-sky-100 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Waves className="h-8 w-8 text-sky-500" />
            </motion.div>
            <motion.span 
              className="text-2xl font-bold text-slate-800"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Blue Belong
            </motion.span>
            <CoralIcon className="h-6 w-6 text-coral-500" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-slate-600 hover:text-sky-600 font-medium transition-colors duration-200 relative group"
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
            
            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-sky-600" />
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? 'close' : 'open'}
                initial={{ rotate: 0 }}
                animate={{ rotate: isOpen ? 180 : 0 }}
                exit={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pb-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="text-slate-600 hover:text-sky-600 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200 block"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
