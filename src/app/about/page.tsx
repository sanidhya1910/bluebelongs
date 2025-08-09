'use client';

import { motion } from 'framer-motion';
import { Award, Heart, Users, MapPin, Waves, Star, Fish, Anchor } from 'lucide-react';

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

const achievements = [
  {
    icon: <Award className="h-8 w-8" />,
    title: "SSI Certified Instructor",
    description: "Professional diving instructor with advanced certifications",
    color: "from-amber-400 to-orange-500"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "500+ Students Trained",
    description: "Successfully certified hundreds of diving enthusiasts",
    color: "from-emerald-400 to-green-500"
  },
  {
    icon: <Waves className="h-8 w-8" />,
    title: "10+ Years Experience",
    description: "Decade of expertise in Andaman's pristine waters",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Ocean Conservation Advocate",
    description: "Passionate about marine life protection and education",
    color: "from-pink-400 to-rose-500"
  }
];

const certifications = [
  "SSI Open Water Scuba Instructor (OWSI)",
  "SSI Advanced Open Water Instructor",
  "SSI Rescue Diver Instructor",
  "SSI Divemaster Instructor",
  "Emergency First Responder (EFR) Instructor",
  "SSI Specialty Instructor (Multiple Specialties)"
];

const values = [
  {
    icon: <Star className="h-6 w-6" />,
    title: "Safety First",
    description: "Every dive is planned with the highest safety standards and emergency protocols in place."
  },
  {
    icon: <Fish className="h-6 w-6" />,
    title: "Marine Conservation",
    description: "Teaching responsible diving practices to protect Andaman's incredible marine biodiversity."
  },
  {
    icon: <Anchor className="h-6 w-6" />,
    title: "Personal Attention",
    description: "Small group sizes ensure personalized instruction and confidence building for every student."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 pt-28 relative overflow-hidden">
      {/* Animated Background Elements */}
      <CoralIcon className="absolute top-20 right-10 h-32 w-32 text-coral-400/10" />
      <CoralIcon className="absolute bottom-20 left-10 h-24 w-24 text-coral-500/10" />
      <CoralIcon className="absolute top-1/2 right-1/4 h-20 w-20 text-coral-300/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 underwater-text">
            About Blue Belongs
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Founded with a passion for the ocean and a commitment to sharing the underwater world 
            with fellow adventurers, Blue Belongs is your gateway to Andaman&apos;s marine paradise.
          </p>
        </motion.div>

        {/* Founder Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-slate-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Meet Nilanjana Biswas
                </h2>
                <h3 className="text-xl text-blue-600 font-semibold mb-6">
                  Founder & Chief Instructor
                </h3>
                
                <div className="space-y-4 text-slate-600">
                  <p>
                    Welcome to Blue Belongs! I&apos;m Nilanjana Biswas, and I&apos;ve been sharing my passion 
                    for the underwater world in the pristine waters of the Andaman Islands for over a decade.
                  </p>
                  
                  <p>
                    What started as a personal love for diving has evolved into a mission to create 
                    safe, educational, and transformative underwater experiences for divers of all levels. 
                    Every dive is an opportunity to connect with the ocean and discover the incredible 
                    marine life that calls these waters home.
                  </p>
                  
                  <p>
                    At Blue Belongs, we believe that diving is more than just a sport &ndash; it&apos;s a way 
                    to understand and protect our oceans. Through proper training, respect for marine 
                    life, and responsible diving practices, we&apos;re building a community of ocean advocates.
                  </p>
                </div>

                <div className="mt-6 flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-blue-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    Havelock Island, Andaman
                  </div>
                  <div className="flex items-center text-emerald-600">
                    <Award className="h-4 w-4 mr-1" />
                    SSI Certified Instructor
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="order-1 lg:order-2">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="w-80 h-80 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 p-2">
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
                    <div className="text-6xl">🤿</div>
                  </div>
                </div>
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full p-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Fish className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full p-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Waves className="h-6 w-6 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Experience & Achievements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${achievement.color} mx-auto mb-4 flex items-center justify-center text-white`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  {achievement.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Values */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-16 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.7 }}
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-blue-100">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-slate-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
            Professional Certifications
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              >
                <Award className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-slate-700">{cert}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed">
              &ldquo;To provide safe, professional, and inspiring diving experiences that foster 
              a deep connection with the ocean while promoting marine conservation and 
              responsible diving practices in the pristine waters of the Andaman Islands.&rdquo;
            </p>
            <motion.div
              className="mt-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-4xl">🌊</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
