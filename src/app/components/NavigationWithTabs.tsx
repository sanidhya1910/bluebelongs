"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home, 
  Info, 
  BookOpen, 
  FileText, 
  Map, 
  LayoutDashboard,
  UserPlus,
  Activity,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

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

  const dashboardHref = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
  
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [dropdownCloseTimer, setDropdownCloseTimer] = useState<NodeJS.Timeout | null>(null);
  
  const moreItems = [
    { href: '/itinerary', label: 'Travel Itinerary' },
    { href: '/marine-life', label: 'Marine Life Encyclopedia' },
    { href: '/safety', label: 'Safety Guidelines' },
    { href: '/faq', label: 'FAQ' }
  ];
  
  // Navigation items for mobile menu
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/courses', label: 'Courses' },
    { href: '/blogs', label: 'Blogs' },
    ...(isHydrated && user ? [{ href: '/medical-form', label: 'Medical Form' }] : []),
    ...(user ? [
      { href: dashboardHref, label: 'Dashboard' }
    ] : [
      { href: '/login', label: 'Login' }
    ])
  ];

  // Expandable tabs configuration for desktop
  const expandableTabs = [
    {
      title: "Home",
      icon: Home,
    },
    {
      title: "About",
      icon: Info,
    },
    {
      title: "Courses",
      icon: BookOpen,
    },
    {
      title: "Blogs",
      icon: FileText,
    },
    ...(isHydrated && user ? [{
      title: "Medical Form",
      icon: Activity,
    }] : []),
    { type: "separator" as const },
    {
      title: "More",
      icon: MoreHorizontal,
    },
    ...(user ? [{
      title: "Dashboard",
      icon: LayoutDashboard,
    }] : [{
      title: "Login",
      icon: UserPlus,
    }])
  ];

  const handleTabChange = (index: number | null) => {
    if (index !== null) {
      // Get only the actual tabs (not separators) to match with routes
      const actualTabs = expandableTabs.filter(tab => tab.type !== "separator");
      
      // Find the actual tab index (excluding separators)
      let actualTabIndex = 0;
      let currentIndex = 0;
      
      for (let i = 0; i <= index && i < expandableTabs.length; i++) {
        if (expandableTabs[i].type === "separator") {
          currentIndex++;
        } else {
          if (currentIndex === index) {
            break;
          }
          actualTabIndex++;
          currentIndex++;
        }
      }
      
      // Get the actual tab
      const selectedTab = actualTabs[actualTabIndex];
      
      // Handle "More" dropdown toggle (click opens, hover also opens via effect)
      if (selectedTab?.title === "More") {
        // Clear any pending close timer
        if (dropdownCloseTimer) {
          clearTimeout(dropdownCloseTimer);
          setDropdownCloseTimer(null);
        }
        setMoreDropdownOpen(true);
        return; // Exit early - don't navigate
      }
      
      // Map tab to route and navigate
      let route = '';
      
      switch(selectedTab?.title) {
        case "Home":
          route = '/';
          break;
        case "About":
          route = '/about';
          break;
        case "Courses":
          route = '/courses';
          break;
        case "Blogs":
          route = '/blogs';
          break;
        case "Medical Form":
          route = '/medical-form';
          break;
        case "Dashboard":
          route = dashboardHref;
          break;
        case "Login":
          route = '/login';
          break;
        default:
          return;
      }
      
      // Navigate to the route
      if (route) {
        window.location.href = route;
      }
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0 z-50">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="BlueBelong Logo" 
                width={40}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <span className="text-xl font-bold text-sky-600">
                BlueBelong
              </span>
            </Link>
          </div>

          {/* Desktop Expandable Tabs Navigation */}
          <div 
            className="hidden lg:block relative"
            onMouseLeave={() => {
              // Close dropdown when leaving the entire navigation area with a delay
              const timer = setTimeout(() => setMoreDropdownOpen(false), 300);
              setDropdownCloseTimer(timer);
            }}
            onMouseEnter={() => {
              // Cancel close timer when re-entering
              if (dropdownCloseTimer) {
                clearTimeout(dropdownCloseTimer);
                setDropdownCloseTimer(null);
              }
            }}
          >
            <div
              onMouseMove={(e) => {
                // Detect if hovering near the More button
                const target = e.target as HTMLElement;
                const button = target.closest('button');
                if (button) {
                  const buttonText = button.textContent;
                  if (buttonText?.includes('More')) {
                    // Clear any pending close timer
                    if (dropdownCloseTimer) {
                      clearTimeout(dropdownCloseTimer);
                      setDropdownCloseTimer(null);
                    }
                    setMoreDropdownOpen(true);
                  }
                }
              }}
            >
              <ExpandableTabs
                tabs={expandableTabs}
                onChange={handleTabChange}
                activeColor="text-sky-600"
                className="bg-white/90 backdrop-blur-md border-sky-200/50 shadow-sm"
              />
            </div>
            
            {/* More Dropdown Menu */}
            <AnimatePresence>
              {moreDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-0.5 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-sky-100/50 overflow-hidden z-[60]"
                  onMouseEnter={() => {
                    // Cancel any close timer when hovering dropdown
                    if (dropdownCloseTimer) {
                      clearTimeout(dropdownCloseTimer);
                      setDropdownCloseTimer(null);
                    }
                    setMoreDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    // Add a small delay before closing
                    const timer = setTimeout(() => setMoreDropdownOpen(false), 200);
                    setDropdownCloseTimer(timer);
                  }}
                >
                  <div className="py-2">
                    {moreItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className="block px-4 py-3 text-sm text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all duration-200 font-medium"
                          onClick={() => setMoreDropdownOpen(false)}
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

          {/* User Menu for Desktop */}
          {user && (
            <div className="hidden lg:flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-3 bg-sky-50/80 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-sky-900">{user.name}</p>
                  <p className="text-xs text-sky-600 capitalize">{user.role}</p>
                </div>
              </motion.div>
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-full border border-red-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-sky-600 hover:text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-sky-200/50"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-sky-800 hover:text-sky-900 hover:bg-sky-50/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile More Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                className="border-t border-sky-200/50 pt-2 mt-2"
              >
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="w-full flex items-center justify-between text-sky-800 hover:text-sky-900 font-medium py-3 px-4 rounded-lg hover:bg-sky-50/80 transition-colors"
                >
                  <span>More</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {moreDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 mt-1 space-y-1 overflow-hidden"
                    >
                      {moreItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className="block text-sky-700 hover:text-sky-900 py-2 px-4 rounded-lg hover:bg-sky-50 transition-colors"
                            onClick={() => {
                              setIsOpen(false);
                              setMoreDropdownOpen(false);
                            }}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {user && (
                <>
                  <div className="border-t border-sky-200/50 pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-sky-50/50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sky-900">{user.name}</p>
                        <p className="text-sm text-sky-600 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 mt-4 bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-lg border border-red-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
