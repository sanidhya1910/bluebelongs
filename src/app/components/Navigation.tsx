'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Waves, User, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Coral SVG Component
const CoralIcon = ({ className }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    animate={{ 
      scale: [1, 1.08, 1],
      rotate: [0, 2, -2, 0]
    }}
    transition={{ 
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <path d="M12 2C8.5 2 8 4.5 8 6c0 1-1 2-2 3s-2 2-2 4c0 3 2 5 5 6h6c3-1 5-3 5-6 0-2-1-3-2-4s-2-2-2-3c0-1.5-.5-4-4-4z" opacity="0.8"/>
    <path d="M10 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" opacity="0.6"/>
    <path d="M14 10c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" opacity="0.6"/>
  </motion.svg>
);

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Mark as hydrated first to prevent hydration mismatches
    setIsHydrated(true);
    
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    ...(isHydrated && user ? [{ href: '/medical-form', label: 'Medical Form' }] : []),
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
      transition={{ duration: 1, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-sky-100/50' 
          : 'bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative"
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.15 }}
            >
              <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-lg scale-150 group-hover:bg-sky-500/30 transition-colors"></div>
              <Waves className="h-10 w-10 text-sky-500 relative z-10" />
            </motion.div>
            
            <div className="flex flex-col">
              <motion.span 
                className="text-2xl font-bold text-slate-800 leading-tight"
                style={{ fontFamily: 'Inter, serif' }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                BlueBelong
              </motion.span>
              <motion.span 
                className="text-xs text-slate-500 font-medium tracking-wider uppercase leading-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Diving School
              </motion.span>
            </div>
            
            <motion.div
              animate={{ 
                rotate: [0, 3, -3, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <CoralIcon className="h-6 w-6 text-coral-500" />
            </motion.div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link
                  href={item.href}
                  className="relative px-6 py-3 text-slate-700 hover:text-sky-600 font-medium transition-all duration-300 rounded-2xl group overflow-hidden"
                >
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Sophisticated hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 border border-sky-100/50 group-hover:border-sky-200"
                    initial={false}
                  />
                  
                  {/* Animated underline */}
                  <motion.div
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 group-hover:w-10 transition-all duration-300 rounded-full"
                    initial={false}
                  />
                </Link>
              </motion.div>
            ))}
            
            {/* Enhanced User Menu */}
            {isHydrated && user && (
              <motion.div 
                className="flex items-center space-x-4 ml-8 pl-8 border-l border-slate-200/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-3 bg-gradient-to-r from-sky-50 to-cyan-50 px-4 py-2 rounded-2xl border border-sky-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                    <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-300 border border-red-100 hover:border-red-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-2xl text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all duration-300 border border-slate-200"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="lg:hidden pb-6 overflow-hidden border-t border-slate-100"
            >
              <div className="pt-6 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center text-slate-700 hover:text-sky-600 font-medium py-3 px-4 rounded-2xl hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 transition-all duration-300 border border-transparent hover:border-sky-100 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative">
                        {item.label}
                        <motion.div
                          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 group-hover:w-full transition-all duration-300 rounded-full"
                          initial={false}
                        />
                      </span>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile User Menu */}
                {isHydrated && user && (
                  <motion.div 
                    className="mt-6 pt-6 border-t border-slate-100 space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl border border-sky-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{user.name}</span>
                        <span className="text-sm text-slate-500 capitalize">{user.role}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 border border-red-100 hover:border-red-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
