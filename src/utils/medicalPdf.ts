// Medical Evaluation PDF Generator
// This utility generates a PDF form for physician evaluation

export interface MedicalFormData {
  personalInfo: {
    name: string;
    birthdate: string;
    date: string;
    facilityName: string;
    instructorName: string;
  };
  mainQuestions: Record<number, boolean>;
  boxQuestions: Record<string, Record<string, boolean>>;
  requiresMedicalEvaluation: boolean;
  additionalInfo: string;
}

export const generateMedicalEvaluationPDF = async (formData: MedicalFormData) => {
  // This function will generate a PDF that needs to be signed by a physician
  // We'll use jsPDF for client-side PDF generation
  
  const jsPDF = (await import('jspdf')).default;
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL EVALUATION FOR RECREATIONAL SCUBA DIVING', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Blue Belongs Diving School - Andaman Islands', 20, 30);
  
  // Patient Information
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INFORMATION:', 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${formData.personalInfo.name}`, 20, 60);
  doc.text(`Date of Birth: ${formData.personalInfo.birthdate}`, 20, 70);
  doc.text(`Evaluation Date: ${formData.personalInfo.date}`, 20, 80);
  
  // Medical History Summary
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL QUESTIONNAIRE RESPONSES:', 20, 100);
  doc.setFont('helvetica', 'normal');
  
  let yPosition = 110;
  
  // Main questions that were answered "YES"
  Object.entries(formData.mainQuestions).forEach(([questionId, answer]) => {
    if (answer) {
      doc.text(`Question ${questionId}: YES`, 20, yPosition);
      yPosition += 10;
    }
  });
  
  // Box questions that were answered "YES"
  Object.entries(formData.boxQuestions).forEach(([boxKey, boxAnswers]) => {
    Object.entries(boxAnswers).forEach(([questionIndex, answer]) => {
      if (answer) {
        doc.text(`Box ${boxKey}, Question ${parseInt(questionIndex) + 1}: YES`, 20, yPosition);
        yPosition += 10;
      }
    });
  });
  
  if (formData.additionalInfo) {
    doc.setFont('helvetica', 'bold');
    doc.text('ADDITIONAL MEDICAL INFORMATION:', 20, yPosition + 10);
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(formData.additionalInfo, 170);
    doc.text(splitText, 20, yPosition + 20);
    yPosition += 20 + (splitText.length * 5);
  }
  
  // Medical Evaluation Required Notice
  if (formData.requiresMedicalEvaluation) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('⚠️ MEDICAL EVALUATION REQUIRED', 20, yPosition + 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Based on the responses above, this individual requires medical clearance', 20, yPosition + 35);
    doc.text('from a physician before participating in scuba diving activities.', 20, yPosition + 45);
  }
  
  // Physician Section
  const physicianY = yPosition + 60;
  doc.setFont('helvetica', 'bold');
  doc.text('PHYSICIAN EVALUATION:', 20, physicianY);
  doc.setFont('helvetica', 'normal');
  
  // Checkboxes for physician
  doc.rect(20, physicianY + 15, 5, 5); // Checkbox
  doc.text('☐ Patient is CLEARED for recreational scuba diving', 30, physicianY + 19);
  
  doc.rect(20, physicianY + 30, 5, 5); // Checkbox
  doc.text('☐ Patient is NOT CLEARED for recreational scuba diving', 30, physicianY + 34);
  
  doc.rect(20, physicianY + 45, 5, 5); // Checkbox
  doc.text('☐ Patient is cleared with restrictions (see notes below)', 30, physicianY + 49);
  
  // Physician notes area
  doc.text('Physician Notes:', 20, physicianY + 65);
  for (let i = 0; i < 4; i++) {
    doc.line(20, physicianY + 75 + (i * 10), 190, physicianY + 75 + (i * 10));
  }
  
  // Signature lines
  doc.text('Physician Name: ________________________________', 20, physicianY + 125);
  doc.text('Medical License #: _____________________________', 20, physicianY + 140);
  doc.text('Physician Signature: ___________________________', 20, physicianY + 155);
  doc.text('Date: _____________', 20, physicianY + 170);
  
  // Footer
  doc.setFontSize(10);
  doc.text('This form must be completed by a licensed physician and returned to Blue Belongs Diving School', 20, 280);
  doc.text('before the student can participate in diving activities.', 20, 290);
  
  // Additional note about doctor's clearance form
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT: Please also complete the separate "Medical Clearance Form" provided by', 20, 305);
  doc.text('Blue Belongs Diving School which contains additional medical assessment requirements.', 20, 315);
  
  return doc;
};

export const downloadMedicalPDF = (formData: MedicalFormData) => {
  generateMedicalEvaluationPDF(formData).then(doc => {
    doc.save(`Medical_Evaluation_${formData.personalInfo.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  });
};
