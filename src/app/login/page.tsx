'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(`https://bluebelong-api.blackburn1910.workers.dev${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-600">
              {isLogin 
                ? 'Sign in to access your diving course bookings and profile' 
                : 'Join Blue Belongs to book courses and track your progress'
              }
            </p>
          </div>

          <div className="card">
            {/* Toggle Buttons */}
            <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  isLogin
                    ? 'bg-white text-sky-600 shadow-sm font-medium'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  !isLogin
                    ? 'bg-white text-sky-600 shadow-sm font-medium'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Registration only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Registration only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me / Forgot Password */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-sky-600 hover:text-sky-700"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms and Conditions (Registration only) */}
              {!isLogin && (
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-sky-600 hover:text-sky-700">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-sky-600 hover:text-sky-700">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-4 text-sm text-slate-500">or</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* Social Login (placeholder) */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-5 h-5 mr-3 bg-red-500 rounded"></div>
                Continue with Google
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-5 h-5 mr-3 bg-blue-600 rounded"></div>
                Continue with Facebook
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-blue-800 mb-2">Demo Note</h3>
            <p className="text-sm text-blue-700">
              This is a demo login page. In a production environment, this would be integrated 
              with a secure authentication system like NextAuth.js with proper user management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
