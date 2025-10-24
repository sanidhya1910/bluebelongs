'use client';

import Link from 'next/link';
import { Waves, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Ocean Wave Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Waves className="h-32 w-32 text-sky-400 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-sky-600">404</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Lost in the Blue
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto">
          Looks like you&apos;ve drifted off course. The page you&apos;re looking for doesn&apos;t exist in these waters.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-full hover:from-sky-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="h-5 w-5" />
            Return to Surface
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-sky-600 font-semibold rounded-full hover:bg-sky-50 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-sky-200"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Decorative Element */}
        <div className="mt-12 text-slate-400 text-sm">
          <p className="italic">
            &quot;Not all who wander are lost, but this page definitely is.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
