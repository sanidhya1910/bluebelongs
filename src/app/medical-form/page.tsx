'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

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
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                Medical Form Submitted Successfully
              </h1>
              <p className="text-lg text-slate-600 mb-6">
                Thank you for completing the medical questionnaire. Your form has been received and will be reviewed by our team.
              </p>
              
              {hasYesAnswers && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
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
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={() => window.print()} 
                  className="btn-secondary w-full"
                >
                  Print Form
                </button>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="btn-primary w-full"
                >
                  Fill Another Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Medical Questionnaire
            </h1>
            <p className="text-xl text-slate-600">
              This medical questionnaire is required for all diving activities. 
              Please answer all questions honestly to ensure your safety.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="card">
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
            </div>

            {/* Medical Questions */}
            <div className="card">
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
            </div>

            {/* Additional Information */}
            <div className="card">
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
            </div>

            {/* Physician Approval */}
            {hasYesAnswers && (
              <div className="card bg-yellow-50 border-yellow-200">
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
              </div>
            )}

            {/* Declaration */}
            <div className="card">
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
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn-primary text-lg px-8 py-3">
                Submit Medical Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
