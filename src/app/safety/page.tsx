'use client';

import { Shield, AlertTriangle, CheckCircle, Heart, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SafetyPage() {
  const safetyCategories = [
    {
      icon: Shield,
      title: "Pre-Dive Safety Checks",
      color: "from-sky-500 to-cyan-500",
      items: [
        "Complete medical questionnaire honestly",
        "Get adequate rest before diving (8+ hours)",
        "Stay hydrated - drink plenty of water",
        "Avoid alcohol 12 hours before diving",
        "No heavy meals 2 hours before diving",
        "Check weather and sea conditions",
        "Inspect all diving equipment thoroughly",
        "Verify buddy system assignments"
      ]
    },
    {
      icon: Activity,
      title: "During the Dive",
      color: "from-cyan-500 to-blue-500",
      items: [
        "Never hold your breath while ascending",
        "Equalize early and often",
        "Monitor your air supply constantly",
        "Stay with your buddy at all times",
        "Maintain proper buoyancy control",
        "Ascend slowly - 9 meters per minute max",
        "Perform safety stop at 5 meters for 3 minutes",
        "Use hand signals for communication"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Emergency Procedures",
      color: "from-blue-500 to-sky-600",
      items: [
        "Signal distress immediately if needed",
        "Know emergency ascent procedures",
        "Locate nearest hyperbaric chamber",
        "Emergency contact: DAN +1-919-684-9111",
        "Local emergency: 108 (India)",
        "Coast Guard: 1554",
        "Keep emergency oxygen accessible",
        "Know CPR and first aid procedures"
      ]
    },
    {
      icon: Heart,
      title: "Medical Considerations",
      color: "from-sky-600 to-cyan-500",
      items: [
        "No diving with cold, congestion, or fever",
        "Wait 12-24 hours after last dive before flying",
        "Inform instructor of any medical conditions",
        "Carry diving medical insurance",
        "Know signs of decompression sickness",
        "Understand nitrogen narcosis symptoms",
        "Pregnancy - diving is not recommended",
        "Age minimum: 10 years (with restrictions)"
      ]
    },
    {
      icon: CheckCircle,
      title: "Equipment Safety",
      color: "from-cyan-500 to-sky-500",
      items: [
        "Inspect BCD for leaks and functionality",
        "Test regulator before every dive",
        "Check tank pressure and valve",
        "Verify computer/depth gauge accuracy",
        "Ensure mask fits properly and is defogged",
        "Check fins for secure fit",
        "Test weights for proper buoyancy",
        "Carry cutting tool and whistle"
      ]
    },
    {
      icon: FileText,
      title: "Dive Planning",
      color: "from-blue-500 to-cyan-500",
      items: [
        "Plan your dive, dive your plan",
        "Know maximum depth limits for your certification",
        "Calculate no-decompression limits",
        "Plan for deepest dive first",
        "Allow surface interval between dives",
        "Check tides and currents",
        "Identify entry and exit points",
        "Establish lost diver procedures"
      ]
    }
  ];

  const importantReminders = [
    "NEVER dive alone - always use the buddy system",
    "NEVER exceed your training and experience level",
    "NEVER dive if you feel unwell or uncomfortable",
    "NEVER touch marine life or coral reefs",
    "ALWAYS inform someone onshore of your dive plan",
    "ALWAYS carry appropriate insurance coverage"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Diving Safety Guidelines</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your safety is our top priority. Please read and understand these guidelines before every dive.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Important Reminders Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-6 mb-12"
        >
          <h2 className="text-2xl font-bold text-sky-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Critical Safety Reminders
          </h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {importantReminders.map((reminder, index) => (
              <li key={index} className="flex items-start gap-2 text-sky-700">
                <span className="text-sky-600 font-bold mt-1">•</span>
                <span className="font-medium">{reminder}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Safety Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {safetyCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                  <Icon className="h-8 w-8 mb-2" />
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                </div>
                <ul className="p-6 space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* DAN Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Emergency Contacts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">DAN (Divers Alert Network)</h3>
              <p className="text-blue-100">Emergency Hotline:</p>
              <a href="tel:+19196849111" className="text-2xl font-bold underline-offset-2 hover:underline">+1-919-684-9111</a>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Local Emergency</h3>
              <p className="text-blue-100">India Emergency Services:</p>
              <a href="tel:108" className="text-2xl font-bold underline-offset-2 hover:underline">108</a>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Coast Guard</h3>
              <p className="text-blue-100">Marine Emergency:</p>
              <a href="tel:1554" className="text-2xl font-bold underline-offset-2 hover:underline">1554</a>
            </div>
          </div>
        </motion.div>

        {/* Certification Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Required Certifications & Insurance</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              All divers must present valid certification cards before diving. We are an SSI-certified dive center
              and recognize certifications from all major agencies (PADI, SSI, NAUI, etc.).
            </p>
            <p className="mb-4">
              <strong>Highly Recommended:</strong> DAN (Divers Alert Network) membership provides emergency diving
              accident insurance and 24/7 emergency assistance.
            </p>
            <p>
              <strong>Note:</strong> Travel insurance typically does NOT cover diving accidents. Specialized diving
              insurance is essential for your safety and peace of mind.
            </p>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center"
        >
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> These guidelines are for informational purposes only and do not replace
            proper diving training and certification. Always follow your instructor&apos;s guidance and dive within
            your limits. Blue Belongs reserves the right to refuse service to anyone we determine is unfit to dive.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
