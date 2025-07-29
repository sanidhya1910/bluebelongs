'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface MedicalQuestion {
  id: string;
  question: string;
  category: string;
}

const medicalQuestions: MedicalQuestion[] = [
  {
    id: 'heart_disease',
    question: 'Do you have any history of heart disease, heart attack, or heart surgery?',
    category: 'cardiovascular'
  },
  {
    id: 'high_blood_pressure',
    question: 'Do you have high blood pressure or take medication for blood pressure?',
    category: 'cardiovascular'
  },
  {
    id: 'asthma',
    question: 'Do you have asthma or wheezing with breathing, or allergies requiring medication?',
    category: 'respiratory'
  },
  {
    id: 'lung_disease',
    question: 'Do you have any lung disease, pneumothorax (collapsed lung), or chest surgery?',
    category: 'respiratory'
  },
  {
    id: 'diabetes',
    question: 'Do you have diabetes requiring medication (insulin or oral hypoglycemics)?',
    category: 'metabolic'
  },
  {
    id: 'seizures',
    question: 'Do you have a history of seizures, blackouts, or fainting?',
    category: 'neurological'
  },
  {
    id: 'ear_problems',
    question: 'Do you have ear problems, hearing loss, or ear surgery?',
    category: 'ear_sinus'
  },
  {
    id: 'sinus_problems',
    question: 'Do you have sinus problems or sinus surgery?',
    category: 'ear_sinus'
  },
  {
    id: 'medications',
    question: 'Are you currently taking any medications (prescription or over-the-counter)?',
    category: 'medications'
  },
  {
    id: 'pregnancy',
    question: 'Are you pregnant or trying to become pregnant?',
    category: 'pregnancy'
  }
];

export default function MedicalFormPage() {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      dateOfBirth: '',
      gender: '',
      emergencyContact: '',
      emergencyPhone: ''
    },
    medicalAnswers: {} as Record<string, boolean>,
    additionalInfo: '',
    physicianApproval: false,
    declaration: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [field]: value
      }
    });
  };

  const handleMedicalAnswer = (questionId: string, answer: boolean) => {
    setFormData({
      ...formData,
      medicalAnswers: {
        ...formData.medicalAnswers,
        [questionId]: answer
      }
    });
  };

  const hasYesAnswers = Object.values(formData.medicalAnswers).some(answer => answer === true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const { personalInfo, declaration } = formData;
    if (!personalInfo.name || !personalInfo.dateOfBirth || !personalInfo.emergencyContact || !declaration) {
      alert('Please fill in all required fields and accept the declaration.');
      return;
    }

    // Check if all medical questions are answered
    if (Object.keys(formData.medicalAnswers).length !== medicalQuestions.length) {
      alert('Please answer all medical questions.');
      return;
    }

    // In a real application, this would submit to an API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <CoralIcon className="absolute top-20 right-10 h-24 w-24 text-coral-400/10 coral-animation" />
        <CoralIcon className="absolute bottom-20 left-10 h-20 w-20 text-coral-500/10 coral-animation" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              className="card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <motion.h1
                className="text-3xl font-bold text-slate-800 mb-4 underwater-text"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Medical Form Submitted Successfully
              </motion.h1>
              <motion.p
                className="text-lg text-slate-600 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Thank you for completing the medical questionnaire. Your form has been received and will be reviewed by our team.
              </motion.p>
              
              {hasYesAnswers && (
                <motion.div
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-semibold text-yellow-800">Physician Approval Required</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Based on your responses, you will need medical clearance from a physician before participating in diving activities. 
                        Please bring a signed medical statement to your course.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <motion.button 
                  onClick={() => window.print()} 
                  className="btn-secondary w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Print Form
                </motion.button>
                <motion.button 
                  onClick={() => setSubmitted(false)} 
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Fill Another Form
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <CoralIcon className="absolute top-20 right-10 h-24 w-24 text-coral-400/10 coral-animation" />
      <CoralIcon className="absolute bottom-20 left-10 h-20 w-20 text-coral-500/10 coral-animation" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold text-slate-800 mb-4 underwater-text">
              Medical Questionnaire
            </h1>
            <p className="text-xl text-slate-600">
              This medical questionnaire is required for all diving activities. 
              Please answer all questions honestly to ensure your safety.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <motion.div
              className="card floating-element"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.personalInfo.gender}
                    onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.emergencyContact}
                    onChange={(e) => handlePersonalInfoChange('emergencyContact', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.personalInfo.emergencyPhone}
                    onChange={(e) => handlePersonalInfoChange('emergencyPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Medical Questions */}
            <motion.div
              className="card floating-element"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Medical History</h2>
              <p className="text-slate-600 mb-6">
                Please answer YES or NO to the following questions. If you answer YES to any question, 
                you may require physician approval before diving.
              </p>
              
              <div className="space-y-4">
                {medicalQuestions.map((question) => (
                  <div key={question.id} className="border border-slate-200 rounded-lg p-4">
                    <p className="text-slate-800 mb-3">{question.question}</p>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={question.id}
                          value="yes"
                          checked={formData.medicalAnswers[question.id] === true}
                          onChange={() => handleMedicalAnswer(question.id, true)}
                          className="mr-2 text-red-500 focus:ring-red-500"
                        />
                        <span className="text-slate-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={question.id}
                          value="no"
                          checked={formData.medicalAnswers[question.id] === false}
                          onChange={() => handleMedicalAnswer(question.id, false)}
                          className="mr-2 text-green-500 focus:ring-green-500"
                        />
                        <span className="text-slate-700">No</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              className="card floating-element"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Additional Information</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Please provide any additional medical information that may be relevant to diving safety:
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Include any medications, recent surgeries, or other health concerns..."
                />
              </div>
            </motion.div>

            {/* Physician Approval */}
            {hasYesAnswers && (
              <motion.div
                className="card bg-yellow-50 border-yellow-200 floating-element"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                      Physician Approval Required
                    </h3>
                    <p className="text-yellow-700 mb-4">
                      Based on your responses, you will need medical clearance from a physician 
                      before participating in diving activities.
                    </p>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.physicianApproval}
                        onChange={(e) => setFormData({ ...formData, physicianApproval: e.target.checked })}
                        className="mr-2 mt-1"
                      />
                      <span className="text-sm text-yellow-800">
                        I understand that I need physician approval and will provide medical clearance before diving.
                      </span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Declaration */}
            <motion.div
              className="card floating-element"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Declaration</h2>
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-slate-700">
                  I certify that all information provided in this medical questionnaire is true and complete. 
                  I understand that any false or incomplete information may endanger my safety and the safety of others. 
                  I agree to inform the dive operator of any changes to my medical condition.
                </p>
              </div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  checked={formData.declaration}
                  onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                  className="mr-3 mt-1"
                />
                <span className="text-slate-700">
                  I have read and understood the above declaration, and I certify that all information 
                  provided is accurate and complete. *
                </span>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <motion.button
                type="submit"
                className="btn-primary text-lg px-8 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Medical Form
              </motion.button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
