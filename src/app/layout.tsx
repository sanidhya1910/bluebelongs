import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Navigation from "./components/NavigationWithTabs";
import ClientRoot from './components/ClientRoot';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';
import BackToTop from '../components/BackToTop';
import { siteConfig } from '../lib/site';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Blue Belong - Diving School Andaman",
    template: "%s | Blue Belong",
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  manifest: "/manifest.json",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Blue Belong - Diving School Andaman",
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage, alt: "Blue Belong Diving School" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blue Belong - Diving School Andaman",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BlueBelong"
  }
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  sport: "Scuba Diving",
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.locality,
    addressRegion: siteConfig.region,
    addressCountry: siteConfig.country,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <ServiceWorkerRegistration />
        <Navigation />
        <ClientRoot>
          <main className="min-h-screen w-full">
            {children}
          </main>
        </ClientRoot>
        <BackToTop />
        <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white">
          {/* Sophisticated background patterns */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400"></div>

          {/* Animated underwater effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-bubble-float"></div>
            <div className="absolute top-20 right-20 w-1 h-1 bg-sky-300 rounded-full animate-bubble-float-delayed"></div>
            <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bubble-float-slow"></div>
          </div>

          <div className="relative z-10 container mx-auto px-6 py-16">
            {/* Enhanced logo section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-sky-500/20">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.5 2 8 4.5 8 6c0 1-1 2-2 3s-2 2-2 4c0 3 2 5 5 6h6c3-1 5-3 5-6 0-2-1-3-2-4s-2-2-2-3c0-1.5-.5-4-4-4z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, serif' }}>
                    BlueBelong
                  </h3>
                  <p className="text-slate-400 font-medium tracking-wide text-sm">Diving School - Andaman Islands</p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  We guide people into the ocean — not to conquer it, but to reconnect with themselves through it.
                </p>
                <p className="text-sm text-slate-400 italic">
                  &quot;Calm. Confident. Connected. That&apos;s how we dive. BlueBelong - you are the ocean&quot;
                </p>
              </div>
            </div>

            {/* Enhanced navigation links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
              <div>
                <h4 className="text-sky-300 font-semibold mb-3 text-sm uppercase tracking-wider">Dive Courses</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/courses" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">SSI Open Water Diver</Link></li>
                  <li><Link href="/courses" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">Advanced Adventurer</Link></li>
                  <li><Link href="/courses" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">Specialty Courses</Link></li>
                  <li><Link href="/courses" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">View All Courses</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sky-300 font-semibold mb-3 text-sm uppercase tracking-wider">Explore</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">Home</Link></li>
                  <li><Link href="/about" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">About BlueBelong</Link></li>
                  <li><Link href="/blogs" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">Diving Blog</Link></li>
                  <li><Link href="/itinerary" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">Travel Itinerary</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sky-300 font-semibold mb-3 text-sm uppercase tracking-wider">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/medical-form" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">Medical Questionnaire</Link></li>
                  <li><Link href="/dashboard" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">My Dashboard</Link></li>
                  <li><Link href="/login" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">Login / Sign Up</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sky-300 font-semibold mb-3 text-sm uppercase tracking-wider">Location</h4>
                <ul className="space-y-2 text-sm">
                  <li><span className="text-slate-400">Havelock Island</span></li>
                  <li><span className="text-slate-400">Andaman & Nicobar</span></li>
                  <li><span className="text-slate-400">India</span></li>
                  <li><Link href="/itinerary" className="text-slate-400 hover:text-sky-300 transition-colors duration-300">How to Reach</Link></li>
                </ul>
              </div>
            </div>

            {/* Enhanced bottom section */}
            <div className="border-t border-slate-700/50 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-sm text-slate-400 flex items-center space-x-2">
                  <span>© {new Date().getFullYear()}</span>
                  <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                  <span className="font-medium text-slate-300">BlueBelong Diving School</span>
                  <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                  <span>All rights reserved</span>
                </p>

                <div className="flex items-center space-x-6 text-xs text-slate-500">
                  <span>SSI Certified Diving Center</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                    <span>The blue has always belonged to you</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/30 to-transparent"></div>
        </footer>
      </body>
    </html>
  );
}
