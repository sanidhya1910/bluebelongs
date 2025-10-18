'use client';

import { useEffect } from 'react';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import { ArrowRight, Eye, Waves } from 'lucide-react';
import Link from 'next/link';

const BluesBelongHero = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="https://videos.pexels.com/video-files/4788513/4788513-hd_1920_1080_25fps.mp4"
        posterSrc="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1920&auto=format&fit=crop"
        bgImageSrc="https://www.gokitetours.com/wp-content/uploads/2024/09/andaman-tour-packages-from-india.webp"
        title="BlueBelong"
        date="Andaman Islands"
        scrollToExpand="Scroll to Dive Deeper"
      >
        <div className="max-w-4xl mx-auto">
          {/* Mission Statement Section */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-sky-100 border border-sky-200 px-4 py-2 rounded-full mb-6">
              <Waves className="h-4 w-4 text-sky-600" />
              <span className="text-sm font-medium text-sky-700">OUR MISSION</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-8 leading-tight">
              We guide people into the <span className="font-bold text-sky-700">ocean</span> — not to conquer it, but to <span className="font-bold text-cyan-600">reconnect</span> with themselves through it.
            </h2>
            
            <div className="prose prose-lg max-w-none text-slate-600 mb-8">
              <p className="text-xl leading-relaxed mb-6">
                Whether you&apos;re a first-time diver, a soul seeking stillness, or a dreamer chasing deeper waters, our mission is to help you discover that the blue has always belonged to you.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 my-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">C</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Calm</h3>
                  <p className="text-slate-600">Find peace in the underwater silence</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">C</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Confident</h3>
                  <p className="text-slate-600">Build skills with expert guidance</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">C</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Connected</h3>
                  <p className="text-slate-600">Discover your bond with the ocean</p>
                </div>
              </div>
              
              <blockquote className="text-2xl font-light text-center text-sky-700 border-l-4 border-sky-300 pl-6 my-12">
                &quot;That&apos;s how we dive. BlueBelong - you are the ocean&quot;
              </blockquote>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/courses" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Eye className="h-5 w-5" />
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link 
                href="/about" 
                className="inline-flex items-center gap-3 bg-white border-2 border-sky-300 text-sky-600 hover:bg-sky-50 font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Learn More About Us
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
};

export default BluesBelongHero;
