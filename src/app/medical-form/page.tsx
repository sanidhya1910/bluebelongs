'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, FileText, Download, Fish } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadMedicalPDF } from '@/utils/medicalPdf';

// Import the medical questionnaire data
const medicalData = {
  "title": "Medical Evaluation Questionnaire",
  "description": "Recreational scuba diving and freediving requires good physical and mental health. There are a few medical conditions which can be hazardous while diving, listed below. Those who have, or are predisposed to, any of these conditions, should be evaluated by a physician. This Diver Medical Participant Questionnaire provides a basis to determine if you should seek out that evaluation. If you have any concerns about your diving fitness not represented on this form, consult with your physician before diving. If you are feeling ill, avoid diving. If you think you may have a contagious disease, protect yourself and others by not participating in dive training and/or dive activities. References to 'diving' on this form encompass both recreational scuba diving and freediving. This form is principally designed as an initial medical screen for new divers, but is also appropriate for divers taking continuing education. For your safety, and that of others who may dive with you, answer all questions honestly.",
  "participantStatement": "I have answered all questions honestly, and understand that I accept responsibility for any consequences resulting from any questions I may have answered inaccurately or for my failure to disclose any existing or past health conditions.",
  "questions": [
    {
      "id": 1,
      "text": "I have had problems with my lungs, breathing, heart and/or blood affecting my normal physical or mental performance.",
      "goToBox": "A"
    },
    {
      "id": 2,
      "text": "I am over 45 years of age.",
      "goToBox": "B"
    },
    {
      "id": 3,
      "text": "I struggle to perform moderate exercise (e.g., walk 1.6 km/1 mile in 14 minutes or swim 200 meters/yards without resting), OR I have been unable to participate in a normal physical activity due to fitness or health reasons within the past 12 months.",
      "requiresMedicalEvaluation": true
    },
    {
      "id": 4,
      "text": "I have had problems with my eyes, ears, or nasal passages/sinuses.",
      "goToBox": "C"
    },
    {
      "id": 5,
      "text": "I have had surgery within the last 12 months, OR I have ongoing problems related to past surgery.",
      "requiresMedicalEvaluation": true
    },
    {
      "id": 6,
      "text": "I have lost consciousness, had migraine headaches, seizures, stroke, significant head injury, or suffer from persistent neurologic injury or disease.",
      "goToBox": "D"
    },
    {
      "id": 7,
      "text": "I am currently undergoing treatment (or have required treatment within the last five years) for psychological problems, personality disorder, panic attacks, or an addiction to drugs or alcohol; or, I have been diagnosed with a learning or developmental disability.",
      "goToBox": "E"
    },
    {
      "id": 8,
      "text": "I have had back problems, hernia, ulcers, or diabetes.",
      "goToBox": "F"
    },
    {
      "id": 9,
      "text": "I have had stomach or intestine problems, including recent diarrhea.",
      "goToBox": "G"
    },
    {
      "id": 10,
      "text": "I am taking prescription medications (except birth control or anti-malarial drugs other than mefloquine (Lariam)).",
      "requiresMedicalEvaluation": true
    }
  ],
  "instructions": {
    "noteToWomen": "If you are pregnant, or attempting to become pregnant, do not dive.",
    "evaluationRequiredIf": [
      "Yes to questions 3, 5 or 10",
      "Yes to any question on page 2 (Box A–G)"
    ]
  },
  "boxes": {
    "A": {
      "title": "BOX A – I HAVE/HAVE HAD",
      "questions": [
        "Chest surgery, heart surgery, heart valve surgery, an implantable medical device (e.g., stent, pacemaker, neurostimulator), pneumothorax, and/or chronic lung disease.",
        "Asthma, wheezing, severe allergies, hay fever or congested airways within the last 12 months that limits my physical activity/exercise.",
        "A problem or illness involving my heart such as: angina, chest pain on exertion, heart failure, immersion pulmonary edema, heart attack or stroke, OR am taking medication for any heart condition.",
        "Recurrent bronchitis and currently coughing within the past 12 months, OR have been diagnosed with emphysema.",
        "Symptoms affecting my lungs, breathing, heart and/or blood in the last 30 days that impair my physical or mental performance."
      ]
    },
    "B": {
      "title": "BOX B – I AM OVER 45 YEARS OF AGE AND",
      "questions": [
        "I currently smoke or inhale nicotine by other means.",
        "I have a high cholesterol level.",
        "I have high blood pressure.",
        "I have had a close blood relative die suddenly or of cardiac disease or stroke before the age of 50, OR have a family history of heart disease before age 50 (including abnormal heart rhythms, coronary artery disease or cardiomyopathy)."
      ]
    },
    "C": {
      "title": "BOX C – I HAVE/HAVE HAD",
      "questions": [
        "Sinus surgery within the last 6 months.",
        "Ear disease or ear surgery, hearing loss, or problems with balance.",
        "Recurrent sinusitis within the past 12 months.",
        "Eye surgery within the past 3 months."
      ]
    },
    "D": {
      "title": "BOX D – I HAVE/HAVE HAD",
      "questions": [
        "Head injury with loss of consciousness within the past 5 years.",
        "Persistent neurologic injury or disease.",
        "Recurring migraine headaches within the past 12 months, or take medications to prevent them.",
        "Blackouts or fainting (full/partial loss of consciousness) within the last 5 years.",
        "Epilepsy, seizures, or convulsions, OR take medications to prevent them."
      ]
    },
    "E": {
      "title": "BOX E – I HAVE/HAVE HAD",
      "questions": [
        "Behavioral health, mental or psychological problems requiring medical/psychiatric treatment.",
        "Major depression, suicidal ideation, panic attacks, uncontrolled bipolar disorder requiring medication/psychiatric treatment.",
        "Been diagnosed with a mental health condition or a learning/developmental disorder that requires ongoing care or special accommodation.",
        "An addiction to drugs or alcohol requiring treatment within the last 5 years."
      ]
    },
    "F": {
      "title": "BOX F – I HAVE/HAVE HAD",
      "questions": [
        "Recurrent back problems in the last 6 months that limit my everyday activity.",
        "Back or spinal surgery within the last 12 months.",
        "Diabetes, either drug or diet controlled, OR gestational diabetes within the last 12 months.",
        "An uncorrected hernia that limits my physical abilities.",
        "Active or untreated ulcers, problem wounds, or ulcer surgery within the last 6 months."
      ]
    },
    "G": {
      "title": "BOX G – I HAVE HAD",
      "questions": [
        "Ostomy surgery and do not have medical clearance to swim or engage in physical activity.",
        "Dehydration requiring medical intervention within the last 7 days.",
        "Active or untreated stomach or intestinal ulcers or ulcer surgery within the last 6 months.",
        "Frequent heartburn, regurgitation, or gastroesophageal reflux disease (GERD).",
        "Active or uncontrolled ulcerative colitis or Crohn's disease.",
        "Bariatric surgery within the last 12 months."
      ]
    }
  }
};


export default function MedicalFormPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasBookings, setHasBookings] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      birthdate: '',
      date: new Date().toISOString().split('T')[0],
      facilityName: 'Blue Belongs Diving School',
      instructorName: '',
      participantSignature: ''
    },
    mainQuestions: {} as Record<number, boolean>,
    boxQuestions: {} as Record<string, Record<string, boolean>>,
    additionalInfo: '',
    participantStatement: false
  });

  // Track which boxes need to be shown based on main question answers
  const [activeBoxes, setActiveBoxes] = useState<string[]>([]);
  const [requiresMedicalEvaluation, setRequiresMedicalEvaluation] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      alert('Please log in to access the medical form.');
      window.location.href = '/login';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Check if user has bookings
    checkUserBookings(token);
    
    // Pre-fill user data
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        name: parsedUser.name
      }
    }));
  }, []);

  const checkUserBookings = async (token: string) => {
    try {
      const response = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.bookings && data.bookings.length > 0) {
          setHasBookings(true);
        }
      }
    } catch (error) {
      console.error('Error checking bookings:', error);
    }
  };

  // Update active boxes and medical evaluation requirement when main questions change
  useEffect(() => {
    const boxes: string[] = [];
    let needsEvaluation = false;

    medicalData.questions.forEach(q => {
      if (formData.mainQuestions[q.id]) {
        if (q.goToBox) {
          boxes.push(q.goToBox);
        }
        if (q.requiresMedicalEvaluation) {
          needsEvaluation = true;
        }
      }
    });

    // Check if any box questions are answered "yes"
    Object.keys(formData.boxQuestions).forEach(boxKey => {
      Object.values(formData.boxQuestions[boxKey]).forEach(answer => {
        if (answer) {
          needsEvaluation = true;
        }
      });
    });

    setActiveBoxes([...new Set(boxes)]);
    setRequiresMedicalEvaluation(needsEvaluation);
  }, [formData.mainQuestions, formData.boxQuestions]);

  const handleMainQuestionChange = (questionId: number, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      mainQuestions: {
        ...prev.mainQuestions,
        [questionId]: value
      }
    }));
  };

  const handleBoxQuestionChange = (boxKey: string, questionIndex: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      boxQuestions: {
        ...prev.boxQuestions,
        [boxKey]: {
          ...prev.boxQuestions[boxKey],
          [questionIndex]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.personalInfo.name || !formData.personalInfo.birthdate || !formData.participantStatement) {
      alert('Please fill in all required fields and accept the participant statement.');
      return;
    }

    // Check if all main questions are answered
    if (Object.keys(formData.mainQuestions).length !== medicalData.questions.length) {
      alert('Please answer all medical questions.');
      return;
    }

    // Check if all active box questions are answered
    for (const boxKey of activeBoxes) {
      const boxQuestions = medicalData.boxes[boxKey as keyof typeof medicalData.boxes]?.questions || [];
      const answeredQuestions = Object.keys(formData.boxQuestions[boxKey] || {}).length;
      if (answeredQuestions < boxQuestions.length) {
        alert(`Please answer all questions in ${medicalData.boxes[boxKey as keyof typeof medicalData.boxes]?.title}`);
        return;
      }
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://bluebelong-api.blackburn1910.workers.dev/api/medical-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: 1, // You might want to get this from the user's bookings
          name: formData.personalInfo.name,
          email: user?.email,
          medicalAnswers: {
            mainQuestions: formData.mainQuestions,
            boxQuestions: formData.boxQuestions,
            requiresMedicalEvaluation: requiresMedicalEvaluation,
            additionalInfo: formData.additionalInfo
          },
          physicianApproval: false
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const error = await response.json();
        alert(`Failed to submit medical form: ${error.error}`);
      }
    } catch (error) {
      console.error('Medical form submission error:', error);
      alert('Failed to submit medical form. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-blue-900 mb-4">
              Medical Form Submitted Successfully
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for completing the medical questionnaire. Your form has been received and will be reviewed by our team.
              {requiresMedicalEvaluation && (
                <span className="block mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  <AlertTriangle className="h-5 w-5 inline mr-2" />
                  Based on your responses, medical clearance by a physician is required before diving. 
                  Please download both forms: your medical evaluation PDF and the doctor&apos;s clearance form for physician signature.
                </span>
              )}
            </p>
            
            {requiresMedicalEvaluation && (
              <div className="mb-6 space-y-3">
                <button
                  onClick={() => downloadMedicalPDF({
                    personalInfo: formData.personalInfo,
                    mainQuestions: formData.mainQuestions,
                    boxQuestions: formData.boxQuestions,
                    requiresMedicalEvaluation,
                    additionalInfo: formData.additionalInfo
                  })}
                  className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Your Medical Evaluation PDF
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/medical-clearance-form.pdf';
                    link.download = 'medical-clearance-form-doctor.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Doctor&apos;s Clearance Form
                </button>
                <p className="text-sm text-gray-600 text-center">
                  Present both forms to your physician for medical clearance before your diving course.
                </p>
              </div>
            )}
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!isHydrated) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100"></div>;
  }

  if (!hasBookings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-blue-900 mb-4">
              Booking Required
            </h1>
            <p className="text-gray-600 mb-6">
              You need to book a course first before completing the medical form.
            </p>
            <button
              onClick={() => window.location.href = '/courses'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <Fish className="h-10 w-10 text-blue-100" />
              <div>
                <h1 className="text-3xl font-bold">{medicalData.title}</h1>
                <p className="text-blue-100 mt-2">Blue Belongs Diving School</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <FileText className="h-6 w-6 text-blue-600 mb-3" />
              <p className="text-gray-700 text-sm leading-relaxed">
                {medicalData.description}
              </p>
            </div>

            {/* Warning for Women */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertTriangle className="h-5 w-5 text-red-600 inline mr-2" />
              <span className="text-red-800 font-semibold">Note to Women:</span>
              <span className="text-red-700"> {medicalData.instructions.noteToWomen}</span>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, name: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.personalInfo.birthdate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, birthdate: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Main Questions */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-900">Medical Questionnaire</h2>
              <p className="text-gray-600 text-sm">
                Please answer YES or NO to each question. If you are unsure about any question, answer YES.
              </p>
              
              {medicalData.questions.map((question) => (
                <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {question.id}
                    </span>
                    <div className="flex-grow">
                      <p className="text-gray-800 mb-3">{question.text}</p>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={formData.mainQuestions[question.id] === true}
                            onChange={() => handleMainQuestionChange(question.id, true)}
                            className="mr-2"
                          />
                          <span className="text-red-600 font-medium">YES</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={formData.mainQuestions[question.id] === false}
                            onChange={() => handleMainQuestionChange(question.id, false)}
                            className="mr-2"
                          />
                          <span className="text-green-600 font-medium">NO</span>
                        </label>
                      </div>
                      {question.requiresMedicalEvaluation && formData.mainQuestions[question.id] && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                          * Physician&apos;s medical evaluation required
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Conditional Box Questions */}
            {activeBoxes.map(boxKey => {
              const box = medicalData.boxes[boxKey as keyof typeof medicalData.boxes];
              if (!box) return null;

              return (
                <div key={boxKey} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{box.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please answer YES or NO to each question below:
                  </p>
                  <div className="space-y-4">
                    {box.questions.map((question, index) => (
                      <div key={index} className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 mb-3">{question}</p>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`box-${boxKey}-${index}`}
                              checked={formData.boxQuestions[boxKey]?.[index] === true}
                              onChange={() => handleBoxQuestionChange(boxKey, index.toString(), true)}
                              className="mr-2"
                            />
                            <span className="text-red-600 font-medium">YES</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`box-${boxKey}-${index}`}
                              checked={formData.boxQuestions[boxKey]?.[index] === false}
                              onChange={() => handleBoxQuestionChange(boxKey, index.toString(), false)}
                              className="mr-2"
                            />
                            <span className="text-green-600 font-medium">NO</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
                    * If you answered YES to any question in this box, physician&apos;s medical evaluation is required.
                  </div>
                </div>
              );
            })}

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Medical Information</h3>
              <p className="text-gray-600 text-sm mb-4">
                Please provide any additional medical information that may be relevant to diving safety:
              </p>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Any medications, medical conditions, or other relevant information..."
              />
            </div>

            {/* Medical Evaluation Warning */}
            {requiresMedicalEvaluation && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <AlertTriangle className="h-6 w-6 text-red-600 mb-3" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Medical Evaluation Required</h3>
                <p className="text-red-700 text-sm mb-4">
                  Based on your responses, you will need to obtain medical clearance from a physician before participating in diving activities.
                  This evaluation is for your safety and is required by diving safety standards.
                </p>
                <p className="text-red-700 text-sm">
                  <strong>Medical evaluation required if:</strong>
                </p>
                <ul className="list-disc list-inside text-red-700 text-sm mt-2">
                  {medicalData.instructions.evaluationRequiredIf.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Participant Statement */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Participant Statement</h3>
              <p className="text-gray-700 text-sm mb-4">
                {medicalData.participantStatement}
              </p>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.participantStatement}
                  onChange={(e) => setFormData(prev => ({ ...prev, participantStatement: e.target.checked }))}
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-700">
                  I acknowledge that I have read and understood the participant statement above, and I agree to its terms. *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 space-x-4">
              {requiresMedicalEvaluation && (
                <div className="flex flex-col space-y-3">
                  <button
                    type="button"
                    onClick={() => downloadMedicalPDF({
                      personalInfo: formData.personalInfo,
                      mainQuestions: formData.mainQuestions,
                      boxQuestions: formData.boxQuestions,
                      requiresMedicalEvaluation,
                      additionalInfo: formData.additionalInfo
                    })}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Your Medical Evaluation PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/medical-clearance-form.pdf';
                      link.download = 'medical-clearance-form-doctor.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Doctor&apos;s Clearance Form
                  </button>
                  <p className="text-sm text-gray-600 text-center max-w-md">
                    You need both forms: Complete the evaluation PDF with your responses, then have a doctor fill and sign the clearance form.
                  </p>
                </div>
              )}
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors shadow-lg"
              >
                Submit Medical Form
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
