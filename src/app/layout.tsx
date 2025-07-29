import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blue Belong - Diving School Andaman",
  description: "Premier diving school in Andaman Islands offering certified diving courses, underwater adventures, and marine exploration experiences.",
  keywords: "diving school, scuba diving, Andaman, PADI courses, underwater adventure, marine life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-slate-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-sky-400 mb-2">Blue Belong</h3>
              <p className="text-slate-300">Dive into Adventure in Andaman Islands</p>
            </div>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-sm text-slate-400">
                © 2024 Blue Belong Diving School. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
