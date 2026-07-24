'use client';

/**
 * @file Feedback Portal Page
 * @description Redesigned Citizen Grievance & Feedback Portal for Nashik Kumbh Mela 2027.
 * Built for transparency, rapid routing, accessibility, and operational usefulness.
 */

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  AlertTriangle, 
  Sparkles, 
  Heart, 
  Trash2, 
  Users, 
  Building, 
  ShieldAlert, 
  Laptop, 
  Smartphone, 
  Info, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Send, 
  ArrowLeft, 
  Upload, 
  Paperclip, 
  Home, 
  MessageCircle, 
  Shield,
  MapPin,
  Clock,
  ThumbsUp,
  AlertOctagon,
  FileText,
  User,
  Plus
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/utils/cn';

// ============================================================
// TRANSLATIONS DATA (English, Hindi, Marathi)
// ============================================================

const TRANSLATIONS = {
  en: {
    portalTitle: "Citizen Feedback & Grievance Portal",
    portalSubtitle: "Government Grievance Management System (Grievance Redressal)",
    charterTag: "Citizen Charter Active",
    statusTitle: "Citizen Service Grievance Status (Today)",
    reportsReceived: "Today's Reports Received",
    resolvedToday: "Resolved Today",
    avgResolution: "Average Resolution Time",
    pendingHigh: "Pending High Priority Cases",
    emergencyDetected: "EMERGENCY DETECTED",
    emergencyMsg: "This description looks like an active emergency. Please switch to the Emergency Response Portal immediately.",
    emergencyBtn: "Switch to Emergency Portal",
    routedTo: "Will be routed to:",
    indicativeTime: "Expected resolution timeframe:",
    anonymousText: "Report Anonymously",
    anonymousDisclaimer: "Note: Anonymous complaints prevent the administration from sending status updates or contacting you for location details.",
    termsConsent: "I hereby consent to verify my mobile number and confirm that the details provided are correct to the best of my knowledge under the Maharashtra Citizen Grievance Charter.",
    submitBtn: "Submit Grievance Report",
    step1: "What would you like to report?",
    step2: "Where did it happen?",
    step3: "Describe the issue",
    step4: "Upload evidence (Optional)",
    step5: "Contact details",
    wizardPrev: "Previous",
    wizardNext: "Next Step",
    complaintTracking: "Track Grievance",
    complaintInput: "Enter Complaint ID to track...",
    trackBtn: "Track Status",
    complaintId: "Complaint ID",
    statusReceived: "Received",
    statusAssigned: "Assigned",
    statusReview: "Under Review",
    statusAction: "Action Taken",
    statusResolved: "Resolved",
    myReportsTitle: "My Submitted Grievances",
    reopenBtn: "Reopen Report",
    satisfactionTitle: "Rate Resolution Quality",
    satisfactionQuality: "Resolution Quality",
    satisfactionTime: "Timeliness",
    satisfactionOverall: "Overall Experience",
    satisfactionSubmit: "Submit Rating",
    supportExisting: "Support Nearby Existing Reports",
    supportExistingText: "If you see your issue below, click 'Support' to alert authorities without creating duplicate reports.",
    supportBtn: "Support (+1)",
    insightsTitle: "Operational Auditing Trends",
    insightsSub: "Aggregated municipal trends (Placeholders)",
    mostReported: "Most Reported Categories",
    hotspots: "Area Grid Issues Count",
    faqTitle: "Frequently Asked Questions",
    charterTitle: "Citizen Redressal Charter",
    charterBody: "1. Every grievance is routed automatically to the designated sector nodal officer. 2. Critical sanitation and water issues are prioritized for sub-12 hour resolution. 3. Transparency is maintained via public audit logs.",
    langEn: "English",
    langHi: "हिन्दी",
    langMr: "मराठी",
    contrastMode: "High Contrast UI",
    normalContrast: "Normal UI"
  },
  hi: {
    portalTitle: "नागरिक प्रतिक्रिया एवं शिकायत पोर्टल",
    portalSubtitle: "सरकारी शिकायत प्रबंधन प्रणाली (निवारण प्रकोष्ठ)",
    charterTag: "नागरिक चार्टर सक्रिय",
    statusTitle: "नागरिक सेवा शिकायत स्थिति (आज)",
    reportsReceived: "आज प्राप्त शिकायतें",
    resolvedToday: "आज हल की गई",
    avgResolution: "औसत समाधान समय",
    pendingHigh: "लंबित उच्च प्राथमिकता मामले",
    emergencyDetected: "आपातकालीन स्थिति पाई गई",
    emergencyMsg: "यह विवरण एक सक्रिय आपातकाल जैसा लग रहा है। कृपया तुरंत आपातकालीन प्रतिक्रिया पोर्टल पर जाएं।",
    emergencyBtn: "आपातकालीन पोर्टल पर जाएं",
    routedTo: "इस विभाग को भेजा जाएगा:",
    indicativeTime: "अपेक्षित समाधान समय सीमा:",
    anonymousText: "अनाम रिपोर्ट करें",
    anonymousDisclaimer: "नोट: अनाम शिकायतों के कारण प्रशासन आपको स्टेटस अपडेट भेजने या स्थान विवरण के लिए संपर्क करने में असमर्थ रहेगा।",
    termsConsent: "मैं एतद्वारा अपने मोबाइल नंबर को सत्यापित करने की सहमति देता हूं और पुष्टि करता हूं कि महाराष्ट्र नागरिक शिकायत चार्टर के तहत प्रदान किए गए विवरण मेरी जानकारी में सही हैं।",
    submitBtn: "शिकायत दर्ज करें",
    step1: "आप क्या रिपोर्ट करना चाहते हैं?",
    step2: "यह कहां हुआ?",
    step3: "मुद्दे का वर्णन करें",
    step4: "प्रमाण अपलोड करें (वैकल्पिक)",
    step5: "संपर्क विवरण",
    wizardPrev: "पिछला",
    wizardNext: "अगला चरण",
    complaintTracking: "शिकायत ट्रैक करें",
    complaintInput: "ट्रैक करने के लिए शिकायत आईडी दर्ज करें...",
    trackBtn: "ट्रैक स्टेटस",
    complaintId: "शिकायत आईडी",
    statusReceived: "प्राप्त",
    statusAssigned: "आवंटित",
    statusReview: "समीक्षाधीन",
    statusAction: "कार्रवाई की गई",
    statusResolved: "समाधान हुआ",
    myReportsTitle: "मेरी प्रस्तुत शिकायतें",
    reopenBtn: "शिकायत दोबारा खोलें",
    satisfactionTitle: "समाधान गुणवत्ता का मूल्यांकन करें",
    satisfactionQuality: "समाधान की गुणवत्ता",
    satisfactionTime: "समयबद्धता",
    satisfactionOverall: "समग्र अनुभव",
    satisfactionSubmit: "मूल्यांकन जमा करें",
    supportExisting: "आसपास की मौजूदा शिकायतों का समर्थन करें",
    supportExistingText: "यदि आप नीचे अपनी समस्या देखते हैं, तो डुप्लिकेट रिपोर्ट बनाए बिना अधिकारियों को सचेत करने के लिए 'समर्थन' पर क्लिक करें।",
    supportBtn: "समर्थन करें (+1)",
    insightsTitle: "परिचालन लेखापरीक्षा रुझान",
    insightsSub: "एकत्रित नगरपालिका रुझान (प्लेसहोल्डर)",
    mostReported: "सर्वाधिक रिपोर्ट की गई श्रेणियां",
    hotspots: "क्षेत्रवार समस्याओं की संख्या",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    charterTitle: "नागरिक निवारण चार्टर",
    charterBody: "1. प्रत्येक शिकायत स्वचालित रूप से नामित सेक्टर नोडल अधिकारी को भेजी जाती है। 2. स्वच्छता और पानी के मुद्दों को 12 घंटे के भीतर समाधान के लिए प्राथमिकता दी जाती है। 3. सार्वजनिक ऑडिट लॉग के माध्यम से पारदर्शिता बनाए रखी जाती है।",
    langEn: "English",
    langHi: "हिन्दी",
    langMr: "मराठी",
    contrastMode: "उच्च कंट्रास्ट UI",
    normalContrast: "सामान्य UI"
  },
  mr: {
    portalTitle: "नागरिक अभिप्राय आणि तक्रार निवारण पोर्टल",
    portalSubtitle: "शासकीय तक्रार निवारण प्रणाली",
    charterTag: "नागरिक सनद सक्रिय",
    statusTitle: "नागरिक सेवा तक्रार स्थिती (आज)",
    reportsReceived: "आज प्राप्त झालेल्या तक्रारी",
    resolvedToday: "आज निवारण केलेल्या तक्रारी",
    avgResolution: "सरासरी निवारण वेळ",
    pendingHigh: "लंबित उच्च प्राधान्य तक्रारी",
    emergencyDetected: "आपत्कालीन स्थिती आढळली",
    emergencyMsg: "हे वर्णन तातडीच्या आपत्कालीन परिस्थितीचे दिसते. कृपया त्वरित आपत्कालीन मदत पोर्टलवर जा.",
    emergencyBtn: "आपत्कालीन पोर्टलवर जा",
    routedTo: "या विभागाकडे पाठवले जाईल:",
    indicativeTime: "अपेक्षित निवारण कालावधी:",
    anonymousText: "अनामिकपणे तक्रार नोंदवा",
    anonymousDisclaimer: "टीप: अनामिक तक्रारींमुळे प्रशासन तुम्हाला अपडेट्स पाठवू शकत नाही किंवा अधिक तपशीलासाठी संपर्क साधू शकत नाही.",
    termsConsent: "मी याद्वारे माझा मोबाईल नंबर पडताळण्यास सहमती देतो आणि तक्रारीतील सर्व माहिती खरी असल्याची खात्री देतो.",
    submitBtn: "तक्रार सादर करा",
    step1: "तुम्हाला कशाबद्दल तक्रार करायची आहे?",
    step2: "ती कुठे घडली?",
    step3: "तक्रारीचे वर्णन करा",
    step4: "पुरावा अपलोड करा (पर्यायी)",
    step5: "संपर्क तपशील",
    wizardPrev: "मागे",
    wizardNext: "पुढील पायरी",
    complaintTracking: "तक्रार ट्रॅक करा",
    complaintInput: "तक्रार आयडी प्रविष्ट करा...",
    trackBtn: "तक्रार ट्रॅक करा",
    complaintId: "तक्रार आयडी",
    statusReceived: "प्राप्त",
    statusAssigned: "नियुक्त",
    statusReview: "तपासणी सुरू",
    statusAction: "कृती केली",
    statusResolved: "निवारण झाले",
    myReportsTitle: "माझ्या सादर केलेल्या तक्रारी",
    reopenBtn: "तक्रार पुन्हा सुरू करा",
    satisfactionTitle: "निवारण गुणवत्तेचे मूल्यांकन करा",
    satisfactionQuality: "निवारण गुणवत्ता",
    satisfactionTime: "वेळेत निवारण",
    satisfactionOverall: "एकूण अनुभव",
    satisfactionSubmit: "मूल्यांकन सादर करा",
    supportExisting: "जवळपासच्या तक्रारींना पाठिंबा द्या",
    supportExistingText: "जर तुमची समस्या खाली दिसत असेल, तर नवीन तक्रार न करता 'पाठिंबा' वर क्लिक करून प्रशासनाला सूचित करा.",
    supportBtn: "पाठिंबा (+1)",
    insightsTitle: "कार्यात्मक नगरपालिका आकडेवारी",
    insightsSub: "एकत्रित आकडेवारी कल (प्लेसहोल्डर्स)",
    mostReported: "सर्वाधिक नोंदवलेले तक्रार प्रकार",
    hotspots: "विभागवार एकूण तक्रारी",
    faqTitle: "नेहमी विचारले जाणारे प्रश्न",
    charterTitle: "नागरिक हक्क सनद",
    charterBody: "१. प्रत्येक तक्रार थेट नेमलेल्या सेक्टर नोडल अधिकाऱ्याकडे पाठवली जाते. २. स्वच्छता आणि पाण्याच्या गंभीर तक्रारींना १२ तासांच्या आत सोडवण्यास प्राधान्य दिले जाते. ३. सार्वजनिक ऑडिट लॉगद्वारे पारदर्शकता राखली जाते.",
    langEn: "English",
    langHi: "हिन्दी",
    langMr: "मराठी",
    contrastMode: "उच्च कंट्रास्ट UI",
    normalContrast: "सामान्य UI"
  }
};

// ============================================================
// GOVERNMENT SECTOR CATEGORIES & ROUTING
// ============================================================

interface GrievanceCategory {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  desc: string;
  department: string;
  timeframe: string;
  priority: 'High' | 'Medium' | 'Low';
  icon: string;
}

const GRIEVANCE_CATEGORIES: GrievanceCategory[] = [
  { id: 'sanitation', name: 'Sanitation & Cleanliness', nameHi: 'स्वच्छता और साफ-सफाई', nameMr: 'स्वच्छता आणि कचरा व्यवस्थापन', desc: 'Overflowing dustbins, garbage piles, missing sweepers', department: 'Sanitation Department', timeframe: '6 Hours', priority: 'High', icon: 'Trash2' },
  { id: 'water', name: 'Drinking Water', nameHi: 'पेयजल आपूर्ति', nameMr: 'पिण्याचे पाणी पुरवठा', desc: 'No drinking water in camps, dirty tap water, pipe leaks', department: 'Water Works & Sanitation Department', timeframe: '8 Hours', priority: 'High', icon: 'Sparkles' },
  { id: 'toilets', name: 'Toilets', nameHi: 'शौचालय व्यवस्था', nameMr: 'सार्वजनिक शौचालय', desc: 'Unclean mobile toilets, water shortage in toilets', department: 'Sanitation & Public Health Department', timeframe: '6 Hours', priority: 'High', icon: 'Building' },
  { id: 'medical', name: 'Medical Services', nameHi: 'चिकित्सा सेवाएं', nameMr: 'वैद्यकीय सेवा', desc: 'First-aid tent unattended, lack of ambulance at sector', department: 'Health Department', timeframe: '4 Hours', priority: 'High', icon: 'ShieldAlert' },
  { id: 'police', name: 'Police & Security', nameHi: 'पुलिस एवं सुरक्षा', nameMr: 'पोलीस आणि सुरक्षा', desc: 'Harassment, pickpocketing, lack of safety barricades', department: 'Police & Security Department', timeframe: '2 Hours', priority: 'High', icon: 'Shield' },
  { id: 'crowd', name: 'Crowd Management', nameHi: 'भीड़ नियंत्रण', nameMr: 'गर्दी नियंत्रण', desc: 'Chokepoints at entry gate, barricade blocks, gate lockups', department: 'Police & Crowd Management Task Force', timeframe: '2 Hours', priority: 'High', icon: 'Users' },
  { id: 'transport', name: 'Transport & Shuttle', nameHi: 'परिवहन एवं शटल', nameMr: 'वाहतूक आणि शटल बस', desc: 'E-rickshaw overcharging, shuttle bus delay, routes blocked', department: 'Transport Department', timeframe: '12 Hours', priority: 'Medium', icon: 'Smartphone' },
  { id: 'accommodation', name: 'Accommodation', nameHi: 'आवास / तंबू शिविर', nameMr: 'राहण्याची सोय / तंबू', desc: 'Tent allocation issues, lack of blankets in sadhugram', department: 'SSST Administration', timeframe: '24 Hours', priority: 'Medium', icon: 'Building' },
  { id: 'infrastructure', name: 'Infrastructure Damage', nameHi: 'बुनियादी ढांचा क्षति', nameMr: 'पायाभूत सुविधांचे नुकसान', desc: 'Broken ghat steps, metal barrier fall, road potholes', department: 'Public Works Department', timeframe: '24 Hours', priority: 'Medium', icon: 'AlertTriangle' },
  { id: 'electricity', name: 'Electricity & Lighting', nameHi: 'बिजली एवं लाइटिंग', nameMr: 'विद्युत पुरवठा आणि पथदिवे', desc: 'Sadhugram tent blackouts, dark road stretches, street light out', department: 'Public Works Department (Electrical)', timeframe: '12 Hours', priority: 'Medium', icon: 'Laptop' },
  { id: 'lost_property', name: 'Lost Property', nameHi: 'खोया-पाया सामान', nameMr: 'हरवलेले सामान', desc: 'Lost bags, identity cards, missing mobile reporting desk', department: 'Police Department', timeframe: '48 Hours', priority: 'Low', icon: 'Info' },
  { id: 'digital_portal', name: 'Digital Portal Issue', nameHi: 'डिजिटल पोर्टल समस्या', nameMr: 'डिजिटल पोर्टल त्रुटी', desc: 'Snan booking QR generation failed, portal errors', department: 'NTKMA IT Control Room', timeframe: '12 Hours', priority: 'Low', icon: 'Laptop' },
  { id: 'volunteer_apprec', name: 'Volunteer Appreciation', nameHi: 'स्वयंसेवक प्रशंसा', nameMr: 'स्वयंसेवक कौतुक', desc: 'Commend helpful volunteers or guides at sectors', department: 'NTKMA Volunteer Network', timeframe: '48 Hours', priority: 'Low', icon: 'Heart' },
  { id: 'suggestion', name: 'General Suggestion', nameHi: 'सामान्य सुझाव', nameMr: 'सामान्य सूचना', desc: 'Ideas to improve transit flows, shade sheds, drinking spots', department: 'NTKMA Officials', timeframe: '72 Hours', priority: 'Low', icon: 'MessageCircle' },
  { id: 'other', name: 'Other Issue', nameHi: 'अन्य समस्या', nameMr: 'इतर तक्रार', desc: 'Any other issues not classified above', department: 'NTKMA Officials', timeframe: '24 Hours', priority: 'Medium', icon: 'MessageSquare' }
];

const MOCK_EXISTING_REPORTS = [
  { id: 'EX-9801', category: 'sanitation', landmark: 'Sadhugram Sector 3 Camp entry', desc: 'Dustbin overflowing and garbage scattered around the main road.', count: 18 },
  { id: 'EX-7612', category: 'water', landmark: 'Ram Kund Ghat Exit Gate', desc: 'No drinking water flowing in the municipal tap station near the holy pool.', count: 42 },
  { id: 'EX-4131', category: 'electricity', landmark: 'CBS Road flyover intersection', desc: 'Four street lights are not functioning, causing dark stretches during night.', count: 9 }
];

const FAQS = [
  { q: "How can I track my submitted grievance?", a: "Enter your unique Complaint ID in the tracking input field above to check status in real-time." },
  { q: "What is the expected resolution timeframe?", a: "Sanitation and water issues are reviewed and dispatched within 6-8 hours, while other categories average 12-24 hours." },
  { q: "Can I report an issue anonymously?", a: "Yes. Step 5 allows toggling anonymous reporting. Note that we cannot send you progress alerts in anonymous mode." },
  { q: "Is it possible to edit or reopen a closed report?", a: "Once marked Resolved, you can reopen a report within 24 hours if you are unsatisfied with the resolution." }
];

export default function FeedbackPortal() {
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [highContrast, setHighContrast] = useState(false);

  // Wizard Steps: 1 to 5
  const [step, setStep] = useState(1);

  // Grievance state
  const [selectedCategory, setSelectedCategory] = useState<string>('sanitation');
  const [sector, setSector] = useState<string>('Sector 2 - Ram Kund');
  const [landmark, setLandmark] = useState<string>('');
  const [gpsSimulated, setGpsSimulated] = useState<string>('Latitude: 20.0058, Longitude: 73.7919');
  const [description, setDescription] = useState<string>('');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [termsConsented, setTermsConsented] = useState<boolean>(false);

  // Tracking Grievance
  const [trackingInput, setTrackingInput] = useState<string>('');
  const [trackedReport, setTrackedReport] = useState<any>(null);

  // My Grievances list (simulated local state)
  const [myGrievances, setMyGrievances] = useState<any[]>([
    {
      id: 'MKB-GRI-10492',
      category: 'water',
      sector: 'Sector 3 - Sadhugram',
      landmark: 'Water Point 9',
      desc: 'Muddy water coming from camp filtration taps.',
      department: 'Water Works & Sanitation Department',
      status: 'Under Review',
      timestamp: '2026-07-14T12:00:00Z',
      supported: 4
    },
    {
      id: 'MKB-GRI-88301',
      category: 'electricity',
      sector: 'Sector 1 - Godavari Bridge',
      landmark: 'Godavari Bridge entry',
      desc: 'Dark stretch due to burnt streetlight bulbs.',
      department: 'Public Works Department (Electrical)',
      status: 'Resolved',
      timestamp: '2026-07-13T18:30:00Z',
      resolutionQuality: 0,
      supported: 12
    }
  ]);

  // Support counts state
  const [supportedReports, setSupportedReports] = useState<Record<string, number>>({});

  // Active Submitted Ticket ID
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);

  // Accordion indices
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const text = TRANSLATIONS[lang];

  // Auto detect emergency keywords in description
  const checkEmergencyKeywords = (val: string) => {
    setDescription(val);
    const keywords = ['fire', 'medical', 'stampede', 'violence', 'flood', 'river', 'drown', 'accident', 'आग', 'वैद्यकीय', 'गर्दी', 'पूर'];
    const matched = keywords.some(k => val.toLowerCase().includes(k));
    setIsEmergency(matched);
  };

  // Select quick category tile
  const handleQuickCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setStep(2); // Jump to location selection step
  };

  // Submit Wizard Form
  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnonymous && (!contactName || !contactPhone)) {
      alert("Please provide contact details or select anonymous reporting.");
      return;
    }
    if (!termsConsented) {
      alert("Please accept the Citizen Grievance Charter consent checkbox.");
      return;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `MKB-GRI-${randomSuffix}`;

    const newReport = {
      id: newId,
      category: selectedCategory,
      sector: sector,
      landmark: landmark,
      desc: description,
      department: GRIEVANCE_CATEGORIES.find(c => c.id === selectedCategory)?.department || 'NTKMA Officials',
      status: 'Received',
      timestamp: new Date().toISOString(),
      supported: 1
    };

    setMyGrievances([newReport, ...myGrievances]);
    setActiveSubmissionId(newId);
    setTrackedReport(newReport);
    
    // Reset inputs
    setLandmark('');
    setDescription('');
    setTermsConsented(false);
    setStep(1); // Go back to start
  };

  // Support count handler
  const handleSupportClick = (id: string) => {
    setSupportedReports(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    alert(`Thank you. Your support (+1) has been recorded to prioritize Grievance ${id}.`);
  };

  // Reopen report handler
  const handleReopen = (id: string) => {
    setMyGrievances(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Under Review', reopenTimestamp: new Date().toISOString() };
      }
      return item;
    }));
    alert(`Complaint ${id} has been reopened and re-assigned to the department nodal officer.`);
  };

  // Rating resolution handler
  const handleRateResolution = (id: string, metric: string, stars: number) => {
    setMyGrievances(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [`rate_${metric}`]: stars,
          rated: true
        };
      }
      return item;
    }));
  };

  const getLucideIcon = (iconName: string, className?: string) => {
    switch (iconName) {
      case 'Trash2': return <Trash2 className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Building': return <Building className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'AlertTriangle': return <AlertTriangle className={className} />;
      case 'Laptop': return <Laptop className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'MessageCircle': return <MessageCircle className={className} />;
      case 'MessageSquare':
      default:
        return <MessageSquare className={className} />;
    }
  };

  const selectedCategoryObj = useMemo(() => {
    return GRIEVANCE_CATEGORIES.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className={cn(
      "relative min-h-screen flex flex-col bg-[#FAFBFC] text-[#111827] transition-all",
      highContrast && "bg-white text-black font-extrabold"
    )}>
      <Navbar />

      {/* ACCESSIBILITY CONTROLLER */}
      <div className="fixed bottom-4 right-4 z-[999] flex flex-col gap-2">
        <button
          onClick={() => setHighContrast(!highContrast)}
          className="p-3 bg-slate-900 text-white rounded-full shadow-2xl border-2 border-white flex items-center justify-center font-bold text-xs uppercase tracking-wide cursor-pointer hover:bg-slate-800"
          aria-label={text.contrastMode}
        >
          {highContrast ? text.normalContrast : text.contrastMode}
        </button>
      </div>

      {/* TOP CONTROLS */}
      <div className="w-full pt-[90px] px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E5E7EB] dark:border-white/5 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Language switchers */}
        <div className="flex items-center gap-1 bg-[#FAFBFC] p-1.5 rounded-lg border border-[#E5E7EB]">
          <button
            onClick={() => setLang('en')}
            className={cn("px-4 py-1.5 rounded font-black text-xs uppercase", lang === 'en' ? 'bg-[#005BAC] text-white shadow-sm' : 'text-[#374151] hover:bg-[#F5F7FA]')}
          >
            {text.langEn}
          </button>
          <button
            onClick={() => setLang('hi')}
            className={cn("px-4 py-1.5 rounded font-black text-xs uppercase", lang === 'hi' ? 'bg-[#005BAC] text-white shadow-sm' : 'text-[#374151] hover:bg-[#F5F7FA]')}
          >
            {text.langHi}
          </button>
          <button
            onClick={() => setLang('mr')}
            className={cn("px-4 py-1.5 rounded font-black text-xs uppercase", lang === 'mr' ? 'bg-[#005BAC] text-white shadow-sm' : 'text-[#374151] hover:bg-[#F5F7FA]')}
          >
            {text.langMr}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-[#005BAC]">
          <span className="px-2 py-0.5 bg-[#EBF0FA] border border-[#005BAC] rounded-full uppercase tracking-wider">
            {text.charterTag}
          </span>
        </div>
      </div>

      <main className="flex-grow pb-24 px-4 sm:px-6 lg:px-8 space-y-6 max-w-[1280px] mx-auto w-full pt-4">
        
        {/* HERO TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            {text.portalTitle}
          </h1>
          <p className="text-xs text-[#6B7280] font-bold">
            {text.portalSubtitle}
          </p>
        </div>

        {/* SECTION 1: CITIZEN SERVICE STATUS BANNER */}
        <div className={cn(
          "bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl p-4 space-y-3",
          highContrast && "border-2 border-black bg-white text-black"
        )}>
          <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wide flex items-center gap-1.5">
              <Clock size={16} />
              <span>{text.statusTitle}</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Updated: Real-time</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-[#374151]">
            <div className="p-2 border bg-white rounded">
              <span className="text-[#6B7280] text-[10px] block uppercase leading-none mb-1">{text.reportsReceived}</span>
              <span className="text-base font-black text-[#005BAC]">1,482</span>
            </div>
            <div className="p-2 border bg-white rounded">
              <span className="text-[#6B7280] text-[10px] block uppercase leading-none mb-1">{text.resolvedToday}</span>
              <span className="text-base font-black text-emerald-600">1,241</span>
            </div>
            <div className="p-2 border bg-white rounded">
              <span className="text-[#6B7280] text-[10px] block uppercase leading-none mb-1">{text.avgResolution}</span>
              <span className="text-base font-black text-slate-900">4.2 Hours</span>
            </div>
            <div className="p-2 border bg-white rounded">
              <span className="text-[#6B7280] text-[10px] block uppercase leading-none mb-1">{text.pendingHigh}</span>
              <span className="text-base font-black text-red-600">18 Cases</span>
            </div>
          </div>
        </div>

        {/* EMERGENCY DETECTION BANNER - DETECTS ACTIVE CRISES IN REAL-TIME */}
        <AnimatePresence>
          {isEmergency && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-red-600 text-white rounded-xl text-xs font-black space-y-3 shadow-md"
            >
              <div className="flex items-center gap-2">
                <AlertOctagon size={24} className="animate-bounce" />
                <div>
                  <h4 className="uppercase tracking-wide text-sm">{text.emergencyDetected}</h4>
                  <p className="font-normal opacity-90">{text.emergencyMsg}</p>
                </div>
              </div>
              <Link 
                href="/emergency" 
                className="w-full inline-flex items-center justify-center p-3 bg-white text-red-700 rounded-lg font-black uppercase text-center shadow hover:bg-slate-100"
              >
                {text.emergencyBtn}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WIZARD & TRACKING SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: SUBMISSION WIZARD */}
          <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                📝 Grievance Filing Wizard (Step {step} of 5)
              </h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className={cn("w-3 h-1.5 rounded-full", step >= s ? "bg-[#005BAC]" : "bg-slate-200")}></div>
                ))}
              </div>
            </div>

            {/* STEP 1: CATEGORY SELECTION */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-700">{text.step1}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GRIEVANCE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleQuickCategorySelect(cat.id)}
                      className={cn(
                        "p-3 rounded-xl border-2 text-left flex flex-col justify-between gap-3 transition-all hover:border-[#005BAC] cursor-pointer bg-[#FAFBFC]",
                        selectedCategory === cat.id && "border-[#005BAC] bg-[#EBF0FA]"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#005BAC] shadow-sm border">
                        {getLucideIcon(cat.icon, 'w-4 h-4')}
                      </div>
                      <span className="text-[10px] font-black leading-tight uppercase">
                        {lang === 'hi' ? cat.nameHi : lang === 'mr' ? cat.nameMr : cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION CAPTURE */}
            {step === 2 && (
              <div className="space-y-4 text-xs font-bold">
                <p className="text-xs font-bold text-slate-700">{text.step2}</p>
                
                <div>
                  <label className="block text-[#374151] mb-1 uppercase text-[10px]">Select Sector Area</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full p-2.5 border rounded outline-none font-bold"
                  >
                    <option>Sector 1 - Godavari Core</option>
                    <option>Sector 2 - Ram Kund Ghat</option>
                    <option>Sector 3 - Sadhugram</option>
                    <option>Sector 4 - Trimbakeshwar</option>
                    <option>Sector 5 - CBS Central</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#374151] mb-1 uppercase text-[10px]">Nearest Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Water Tank 4 or barrier checkpoint"
                    className="w-full p-2.5 border rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6B7280] mb-1 uppercase text-[10px]">Simulated GPS coordinates (Live telemetry)</label>
                  <input
                    disabled
                    type="text"
                    value={gpsSimulated}
                    className="w-full p-2.5 border rounded outline-none bg-slate-50 text-slate-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: DETAILED DESCRIPTION */}
            {step === 3 && (
              <div className="space-y-4 text-xs font-bold">
                <p className="text-xs font-bold text-slate-700">{text.step3}</p>
                
                <div>
                  <label className="block text-[#374151] mb-1 uppercase text-[10px]">Description</label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => checkEmergencyKeywords(e.target.value)}
                    placeholder="Provide description of the issue. (If reporting a fire or medical case, the system will redirect to emergency portal immediately.)"
                    className="w-full p-2.5 border rounded outline-none resize-none font-medium"
                  />
                </div>

                {/* Auto routed preview */}
                {selectedCategoryObj && (
                  <div className="p-3 bg-slate-50 border rounded space-y-1">
                    <p className="text-[#374151] font-bold">
                      🏢 {text.routedTo} <span className="text-[#005BAC]">{selectedCategoryObj.department}</span>
                    </p>
                    <p className="text-[#374151] font-bold">
                      ⏱️ {text.indicativeTime} <span className="text-amber-700">{selectedCategoryObj.timeframe}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: EVIDENCE ATTACHMENT */}
            {step === 4 && (
              <div className="space-y-4 text-xs font-bold">
                <p className="text-xs font-bold text-slate-700">{text.step4}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-slate-50 flex flex-col items-center justify-center gap-2">
                    <Upload size={24} className="text-[#005BAC]" />
                    <span>Upload Image</span>
                  </div>
                  <div className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-slate-50 flex flex-col items-center justify-center gap-2">
                    <Upload size={24} className="text-[#005BAC]" />
                    <span>Upload Video</span>
                  </div>
                  <div className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-slate-50 flex flex-col items-center justify-center gap-2">
                    <Paperclip size={24} className="text-[#005BAC]" />
                    <span>Attach Document</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: CONTACT INFORMATION */}
            {step === 5 && (
              <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs font-bold">
                <p className="text-xs font-bold text-slate-700">{text.step5}</p>

                <div className="flex items-center gap-2 p-2 border rounded bg-slate-50">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span>{text.anonymousText}</span>
                </div>

                {isAnonymous ? (
                  <p className="p-2 border border-amber-200 bg-amber-50 text-amber-800 rounded font-normal leading-relaxed">
                    ⚠️ {text.anonymousDisclaimer}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#374151] mb-1 uppercase text-[10px]">Full Name</label>
                      <input
                        required
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Citizen Name"
                        className="w-full p-2 border rounded outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#374151] mb-1 uppercase text-[10px]">Mobile Number</label>
                      <input
                        required
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full p-2 border rounded outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#374151] mb-1 uppercase text-[10px]">Email (Optional)</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full p-2 border rounded outline-none text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Consent checkbox */}
                <div className="flex items-start gap-2 pt-2 text-[#374151] leading-relaxed">
                  <input
                    required
                    type="checkbox"
                    checked={termsConsented}
                    onChange={(e) => setTermsConsented(e.target.checked)}
                    className="w-4 h-4 cursor-pointer mt-0.5"
                  />
                  <p className="font-normal text-[10px]">
                    {text.termsConsent}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#005BAC] text-white text-xs font-black uppercase rounded hover:bg-[#0F4C81] shadow"
                >
                  {text.submitBtn}
                </button>
              </form>
            )}

            {/* WIZARD ACTIONS */}
            <div className="flex justify-between border-t pt-4">
              <button
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border rounded text-xs font-black uppercase text-slate-800 disabled:opacity-50"
              >
                {text.wizardPrev}
              </button>

              {step < 5 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-[#005BAC] text-white text-xs font-black uppercase rounded"
                >
                  {text.wizardNext}
                </button>
              ) : null}
            </div>
          </div>

          {/* RIGHT: TRACK COMPLAINT & MY REPORTS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* TRACK GRIEVANCE CARD */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                🔍 {text.complaintTracking}
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={text.complaintInput}
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="flex-grow p-2.5 border rounded outline-none text-xs"
                />
                <button
                  onClick={() => {
                    const found = myGrievances.find(g => g.id.toLowerCase().includes(trackingInput.toLowerCase()));
                    if (found) {
                      setTrackedReport(found);
                    } else {
                      alert("No active Grievance matching that ID was found in local storage.");
                    }
                  }}
                  className="px-3 bg-slate-900 text-white font-black text-xs uppercase rounded"
                >
                  Go
                </button>
              </div>

              {/* TRACK COMPLAINT WORKFLOW */}
              {trackedReport && (
                <div className="p-4 border rounded bg-slate-50 space-y-4 text-xs font-bold">
                  <div className="border-b pb-2 flex justify-between items-center">
                    <span className="text-[10px] text-[#6B7280] uppercase">Complaint ID: <span className="font-mono text-[#005BAC]">{trackedReport.id}</span></span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8px] uppercase",
                      trackedReport.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    )}>
                      {trackedReport.status}
                    </span>
                  </div>

                  {/* Grievance progress timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</div>
                      <div>
                        <p className="text-slate-900">{text.statusReceived}</p>
                        <p className="text-[9px] text-[#6B7280] font-normal">Grievance lodged in central audit logs.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={cn("w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px]", trackedReport.status !== 'Received' ? 'bg-emerald-600' : 'bg-slate-300')}>
                        {trackedReport.status !== 'Received' ? '✓' : '2'}
                      </div>
                      <div>
                        <p className="text-slate-900">{text.statusAssigned}</p>
                        <p className="text-[9px] text-[#6B7280] font-normal">Dispatched to: {trackedReport.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={cn("w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px]", ['Under Review', 'Resolved'].includes(trackedReport.status) ? 'bg-emerald-600' : 'bg-slate-300')}>
                        {['Under Review', 'Resolved'].includes(trackedReport.status) ? '✓' : '3'}
                      </div>
                      <div>
                        <p className="text-slate-900">{text.statusReview}</p>
                        <p className="text-[9px] text-[#6B7280] font-normal">Nodal officer executing site audit.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={cn("w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px]", trackedReport.status === 'Resolved' ? 'bg-emerald-600' : 'bg-slate-300')}>
                        {trackedReport.status === 'Resolved' ? '✓' : '4'}
                      </div>
                      <div>
                        <p className="text-slate-900">{text.statusResolved}</p>
                        <p className="text-[9px] text-[#6B7280] font-normal">Action taken by department team.</p>
                      </div>
                    </div>
                  </div>

                  {/* CITIZEN SATISFACTION RATING MATRIX (ONLY RENDERED AFTER STATUS RESOLVED) */}
                  {trackedReport.status === 'Resolved' && (
                    <div className="p-3 border border-emerald-200 bg-emerald-50/50 rounded-lg space-y-3">
                      <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-wide">
                        ⭐ {text.satisfactionTitle}
                      </h4>
                      <div className="space-y-2">
                        {['Quality', 'Time', 'Overall'].map((metric) => {
                          const ratingVal = trackedReport[`rate_${metric}`] || 0;
                          return (
                            <div key={metric} className="flex justify-between items-center">
                              <span className="text-[10px] capitalize">{metric}</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRateResolution(trackedReport.id, metric, star)}
                                    className="bg-transparent border-none cursor-pointer"
                                  >
                                    <Star size={12} className={cn(star <= ratingVal ? "text-amber-500 fill-current" : "text-slate-300")} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {trackedReport.status === 'Resolved' && (
                    <button
                      onClick={() => handleReopen(trackedReport.id)}
                      className="w-full py-2 bg-[#005BAC] text-white font-black text-[10px] uppercase rounded hover:bg-[#0F4C81]"
                    >
                      {text.reopenBtn}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* MY COMPLAINTS LIST */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                🗃️ {text.myReportsTitle}
              </h3>

              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {myGrievances.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setTrackedReport(item)}
                    className="p-3 border rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 text-xs font-bold text-left transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[#005BAC] text-[10px]">{item.id}</span>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] uppercase",
                        item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      )}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-700 leading-normal truncate">{item.desc}</p>
                    <span className="text-[9px] text-[#6B7280] font-normal block mt-1">Routed to: {item.department}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 8: SUPPORT EXISTING REPORTS */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-4 text-left">
          <div>
            <h3 className="text-md font-black text-slate-900 uppercase tracking-wide">
              📢 {text.supportExisting}
            </h3>
            <p className="text-xs text-[#6B7280] font-medium mt-1">
              {text.supportExistingText}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_EXISTING_REPORTS.map((report) => {
              const extraSupports = supportedReports[report.id] || 0;
              return (
                <div key={report.id} className="p-4 border rounded-xl bg-slate-50 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#005BAC] font-mono font-black text-[9px]">{report.id}</span>
                      <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded">
                        {report.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-normal font-bold truncate">{report.landmark}</p>
                    <p className="text-slate-500 font-normal leading-normal text-[10px]">{report.desc}</p>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-[10px] text-[#6B7280] font-black">
                      📢 {report.count + extraSupports} Citizens Reported
                    </span>
                    <button
                      onClick={() => handleSupportClick(report.id)}
                      className="px-3 py-1 bg-white border border-[#E5E7EB] hover:bg-[#F5F7FA] text-[9px] font-black text-slate-800 rounded uppercase flex items-center gap-1"
                    >
                      <ThumbsUp size={10} />
                      <span>{text.supportBtn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 13: CITIZEN CHARTER & FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* FAQ Accordion */}
          <div className="p-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm text-left space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase">
              ❔ {text.faqTitle}
            </h3>

            <div className="space-y-2">
              {FAQS.map((faq, index) => {
                const isExpanded = expandedFaq === index;
                return (
                  <div key={index} className="border-b pb-2 text-left">
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                      className="w-full flex items-center justify-between text-xs font-black text-slate-900 py-1.5 focus:outline-none border-none bg-transparent cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isExpanded && (
                      <p className="text-[10px] leading-relaxed text-[#374151] mt-1 font-semibold">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Citizen charter expectations */}
          <div className="p-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm text-left space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-black text-[#005BAC] uppercase">
                📜 {text.charterTitle}
              </h3>
              <p className="text-xs text-[#374151] leading-relaxed font-semibold">
                {text.charterBody}
              </p>
            </div>
            
            <div className="p-3 bg-slate-950 text-white rounded-lg text-[9px] font-mono uppercase tracking-wide border border-white/10 text-center">
              Verified & Audited by Maharashtra IT Cell
            </div>
          </div>
        </div>

        {/* SECTION 20: ADMINISTRATIVE INSIGHTS PANEL */}
        <div className="bg-slate-950 text-white rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-500">
              📊 {text.insightsTitle}
            </h3>
            <span className="text-[9px] text-slate-400 font-mono">{text.insightsSub}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            {/* Chart 1: most reported */}
            <div className="p-3 bg-white/5 rounded border border-white/10 space-y-2">
              <h4 className="text-[10px] text-slate-400 uppercase">{text.mostReported}</h4>
              <div className="space-y-1.5 font-mono text-[9px]">
                <div>
                  <div className="flex justify-between"><span>1. Sanitation</span><span>42%</span></div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5"><div className="bg-red-500 h-full w-[42%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between"><span>2. Toilets & Water</span><span>28%</span></div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5"><div className="bg-amber-500 h-full w-[28%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between"><span>3. Electricity</span><span>15%</span></div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5"><div className="bg-blue-500 h-full w-[15%]"></div></div>
                </div>
              </div>
            </div>

            {/* Chart 2: hotspot statistics */}
            <div className="p-3 bg-white/5 rounded border border-white/10 space-y-2">
              <h4 className="text-[10px] text-slate-400 uppercase">{text.hotspots}</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="border border-white/5 p-1 text-center bg-white/5">Sector 2: 142</div>
                <div className="border border-white/5 p-1 text-center bg-white/5">Sector 3: 98</div>
                <div className="border border-white/5 p-1 text-center bg-white/5">Sector 1: 52</div>
                <div className="border border-white/5 p-1 text-center bg-white/5">Sector 4: 21</div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
