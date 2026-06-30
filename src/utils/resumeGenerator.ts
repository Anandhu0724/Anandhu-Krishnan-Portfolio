/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';

export function downloadResume() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page width and height
  const pageWidth = 210;
  
  // Set draw colors (black and deep gray)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);

  // --- 1. HEADER (Top Right Box) ---
  // Double lined outer border for name card
  doc.rect(80, 10, 120, 25);
  doc.rect(80.5, 10.5, 119, 24);
  
  // Name
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(21);
  doc.setTextColor(0, 0, 0);
  doc.text('ANANDHU KRISHNAN', 140, 21, { align: 'center' });
  
  // Subtitle
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  // Add spacing in characters manually for "UNDERGRADUATE STUDENT"
  doc.text('U N D E R G R A D U A T E   S T U D E N T', 140, 28, { align: 'center' });

  // --- 2. PROFILE IMAGE PLACEHOLDER (Top Left) ---
  // Draw a sleek placeholder box for photo
  doc.setFillColor(242, 244, 247);
  doc.rect(10, 10, 60, 65, 'F');
  doc.rect(10, 10, 60, 65, 'S');
  
  // Minimalist stylized camera/avatar icon inside the placeholder
  doc.setDrawColor(180, 185, 190);
  doc.circle(40, 38, 10, 'S');
  doc.circle(40, 38, 4, 'S');
  doc.rect(30, 48, 20, 12, 'S');
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 125, 130);
  doc.text('ANANDHU KRISHNAN', 40, 65, { align: 'center' });

  // --- 3. CONTACT INFO (Left Column below photo) ---
  const contactYStart = 85;
  doc.setDrawColor(0, 0, 0);
  doc.rect(10, contactYStart, 9, 38); // Small left vertical accents
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  // Phone
  doc.text('P:', 12, contactYStart + 6);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('+91 9994420724', 22, contactYStart + 6);

  // Email
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('E:', 12, contactYStart + 15);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('ananthuk012@gmail.com', 22, contactYStart + 15);

  // Location
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('L:', 12, contactYStart + 24);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Thottathil (H), Vandiperiyar', 22, contactYStart + 24);

  // LinkedIn
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('W:', 12, contactYStart + 33);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('linkedin.com/in/anandhu0724', 22, contactYStart + 33);

  // --- 4. VERTICAL COLUMN SEPARATOR ---
  doc.setDrawColor(150, 150, 150);
  doc.line(81, 42, 81, 287);

  // --- 5. PROFILE STATEMENT (Right Side, Top) ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('P R O F I L E', 86, 48);

  // Thick accent line under Profile heading
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.line(86, 51, 106, 51);
  doc.setLineWidth(0.4);

  const profileText = `I am a Computer Science Engineering student at MBCCET who balances a rigorous technical background with a high-impact leadership role as an MBC:80 Lead. Deeply embedded in the college's innovation ecosystem, I lead and organize major initiatives across clubs like NSS, uLearn, and FOSS, ranging from inter-college CTF events like DECENDA 2k26 to large-scale community efforts like blood donation drives. My technical portfolio includes practical projects like the MBCeats management system and the YIP cardamom harvesting machine, often paired with a creative flair for AI-generated media and design. Whether I am advocating for dedicated technical spaces on campus or coordinating with an extensive network of peers, I act as a bridge between student innovation and support.`;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  const splitProfile = doc.splitTextToSize(profileText, 114);
  doc.text(splitProfile, 86, 58, { align: 'justify', lineHeightFactor: 1.4 });

  // --- 6. EDUCATION (Left Column, Middle) ---
  const eduYStart = 132;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('E D U C A T I O N', 10, eduYStart);
  doc.line(10, eduYStart + 3, 35, eduYStart + 3);

  // Edu Segment 1
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('2022 - 2024', 10, eduYStart + 10);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ST.PHILOMINA\'S HSS, UPPUTHARA', 10, eduYStart + 14);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('• Plus one, Plus Two', 10, eduYStart + 19);
  doc.text('• Completed', 10, eduYStart + 24);

  // Edu Segment 2
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('2024 - 2028', 43, eduYStart + 10);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('MBC, KUTTIKKANAM', 43, eduYStart + 14);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('• Bachelor Of Technology :', 43, eduYStart + 19);
  doc.text('  Computer Science', 43, eduYStart + 24);
  doc.text('• Pursuing', 43, eduYStart + 29);

  // --- 7. PROFESSIONAL EXPERIENCE & LEADERSHIP (Left Column, Bottom) ---
  const expYStart = 175;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('P R O F E S S I O N A L   E X P E R I E N C E   &', 10, expYStart);
  doc.text('L E A D E R S H I P', 10, expYStart + 5);
  doc.line(10, expYStart + 8, 65, expYStart + 8);

  const experiences = [
    'College Magazine Editor 2026',
    'MBCCET Tourism Club Lead',
    'MBC:80 Lead',
    'EX -IEDC Operation Sub Lead',
    'NSS Volunteer',
    'IIC LEAD',
    'EDC Lead',
    'FOSS Media Coordinator'
  ];

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);
  let currentExpY = expYStart + 15;
  experiences.forEach((exp) => {
    // Bullet point
    doc.setFont('Helvetica', 'bold');
    doc.text('•', 10, currentExpY);
    doc.setFont('Helvetica', 'normal');
    doc.text(exp, 14, currentExpY);
    currentExpY += 6.5;
  });

  // --- 8. RIGHT CONTENT BOX (SKILLS & LANGUAGES) ---
  const rightBoxX = 125;
  const rightBoxY = 120;
  const rightBoxWidth = 75;
  const rightBoxHeight = 167;

  // Draw box border
  doc.setDrawColor(0, 0, 0);
  doc.rect(rightBoxX, rightBoxY, rightBoxWidth, rightBoxHeight);

  // Box Content: S K I L L S
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('S K I L L S', rightBoxX + 8, rightBoxY + 10);
  doc.line(rightBoxX + 8, rightBoxY + 13, rightBoxX + 28, rightBoxY + 13);

  const skillsList = [
    'Vibe Coder',
    'Communication',
    'Graphics Designer',
    'Public Relations',
    'Teamwork',
    'Time Management',
    'Leadership',
    'Effective Communication',
    'Critical Thinking',
    'Listener',
    'Event Organizer'
  ];

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  let skillY = rightBoxY + 20;
  skillsList.forEach((skill) => {
    doc.text(`•  ${skill}`, rightBoxX + 8, skillY);
    skillY += 6.2;
  });

  // Box Content: L A N G U A G E S
  const langYStart = rightBoxY + 100;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('L A N G U A G E S', rightBoxX + 8, langYStart);
  doc.line(rightBoxX + 8, langYStart + 3, rightBoxX + 44, langYStart + 3);

  const languagesList = [
    'English',
    'Malayalam',
    'Hindi',
    'Tamil ( Basic )'
  ];

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  let langY = langYStart + 10;
  languagesList.forEach((lang) => {
    doc.text(`•  ${lang}`, rightBoxX + 8, langY);
    langY += 6.5;
  });

  // Save the PDF
  doc.save('Anandhu_Krishnan_Resume.pdf');
}
