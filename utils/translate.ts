/**
 * @file translate.ts
 * @description Quick translation dictionary helper for English, Hindi, and Marathi.
 * Supports labels, buttons, and select options for the Pilgrim Portal.
 */

const DICTIONARY: Record<string, Record<string, string>> = {
  English: {
    // Dashboard & Sidebar
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'plan_tour': 'Plan Your Tour',
    'manage_pilgrims': 'Manage Pilgrims / Tourist',
    'manage_journey': 'Manage Journey',
    'timings_route': 'Timings & Route Map',
    'feedback_grievance': 'Feedback / Grievance',
    'discover_maharashtra': 'Discover Maharashtra',
    'ai_journey_planner': 'AI Journey Planner',
    'smart_darshan': 'Smart Darshan Booking',
    'smart_snan': 'Smart Snan Booking',
    'tourism_explorer': 'Tourism Explorer',
    'journey_assistant': 'Journey Assistant',
    'emergency_sos': 'Emergency (SOS)',
    'volunteer_portal': 'Volunteer Portal',
    'project_roadmap': 'Project Roadmap',
    'about_project': 'About Project',
    'contact_us': 'Contact Us',
    
    // Form labels
    'journey_start': 'Journey Start Date',
    'journey_end': 'Journey End Date',
    'num_pilgrims': 'Total Accompanying Pilgrims',
    'purpose': 'Purpose of Pilgrimage',
    'travel_mode': 'Mode of Inbound Travel',
    'accommodation': 'Accommodation Allocation',
    'emergency_contact': 'Emergency Contact Number',
    'blood_group': 'Blood Group',
    'medical_conditions': 'Known Medical Conditions (if any)',
    'special_assistance': 'Special Assistance Requests',
    
    // Purpose options
    'purpose_darshan': 'General Darshan',
    'purpose_snan': 'Holy Snan (Bath) Slot',
    'purpose_seva': 'Volunteer Service (Seva)',
    
    // Travel modes
    'travel_train': 'Indian Railways',
    'travel_bus': 'Commercial Bus',
    'travel_vehicle': 'Private Vehicle',
    'travel_flight': 'Flight',
    
    // Accommodation options
    'acc_camp': 'Government Camp',
    'acc_dharamshala': 'Dharamshala',
    'acc_hotel': 'Hotel Booking',
    'acc_own': 'Own Arrangement',
    
    // Buttons
    'back': 'Back',
    'cancel': 'Cancel',
    'continue': 'Continue',
    'submit_permit': 'Submit Permit',
  },
  Hindi: {
    // Dashboard & Sidebar
    'dashboard': 'डैशबोर्ड',
    'profile': 'प्रोफ़ाइल',
    'plan_tour': 'अपनी यात्रा की योजना बनाएं',
    'manage_pilgrims': 'तीर्थयात्री / पर्यटक प्रबंधित करें',
    'manage_journey': 'यात्रा प्रबंधित करें',
    'timings_route': 'समय और मार्ग मानचित्र',
    'feedback_grievance': 'प्रतिक्रिया / शिकायत',
    'discover_maharashtra': 'महाराष्ट्र खोजें',
    'ai_journey_planner': 'एआई यात्रा योजनाकार',
    'smart_darshan': 'स्मार्ट दर्शन बुकिंग',
    'smart_snan': 'स्मार्ट स्नान बुकिंग',
    'tourism_explorer': 'पर्यटन खोजकर्ता',
    'journey_assistant': 'यात्रा सहायक',
    'emergency_sos': 'आपातकालीन (SOS)',
    'volunteer_portal': 'स्वयंसेवक पोर्टल',
    'project_roadmap': 'परियोजना रोडमैप',
    'about_project': 'परियोजना के बारे में',
    'contact_us': 'संपर्क करें',
    
    // Form labels
    'journey_start': 'यात्रा शुरू होने की तिथि',
    'journey_end': 'यात्रा समाप्त होने की तिथि',
    'num_pilgrims': 'कुल साथ आने वाले तीर्थयात्री',
    'purpose': 'तीर्थयात्रा का उद्देश्य',
    'travel_mode': 'आगमन का साधन',
    'accommodation': 'आवास का आवंटन',
    'emergency_contact': 'आपातकालीन संपर्क नंबर',
    'blood_group': 'रक्त समूह',
    'medical_conditions': 'ज्ञात चिकित्सा स्थितियां (यदि कोई हो)',
    'special_assistance': 'विशेष सहायता अनुरोध',
    
    // Purpose options
    'purpose_darshan': 'सामान्य दर्शन',
    'purpose_snan': 'पवित्र स्नान घाट',
    'purpose_seva': 'स्वयंसेवक सेवा (सेवा)',
    
    // Travel modes
    'travel_train': 'भारतीय रेलवे',
    'travel_bus': 'कमर्शियल बस',
    'travel_vehicle': 'निजी वाहन',
    'travel_flight': 'फ्लाइट',
    
    // Accommodation options
    'acc_camp': 'सरकारी शिविर',
    'acc_dharamshala': 'धर्मशाला',
    'acc_hotel': 'होटल बुकिंग',
    'acc_own': 'स्वयं की व्यवस्था',
    
    // Buttons
    'back': 'पीछे',
    'cancel': 'रद्द करें',
    'continue': 'जारी रखें',
    'submit_permit': 'परमिट जमा करें',
  },
  Marathi: {
    // Dashboard & Sidebar
    'dashboard': 'डॅशबोर्ड',
    'profile': 'प्रोफाइल',
    'plan_tour': 'तुमच्या यात्रेचे नियोजन करा',
    'manage_pilgrims': 'यात्रेकरू / पर्यटक व्यवस्थापित करा',
    'manage_journey': 'प्रवास व्यवस्थापित करा',
    'timings_route': 'वेळापत्रक आणि मार्ग नकाशा',
    'feedback_grievance': 'अभिप्राय / तक्रार',
    'discover_maharashtra': 'महाराष्ट्र शोधा',
    'ai_journey_planner': 'एआय प्रवास नियोजक',
    'smart_darshan': 'स्मार्ट दर्शन बुकिंग',
    'smart_snan': 'स्मार्ट स्नान बुकिंग',
    'tourism_explorer': 'पर्यटन मार्गदर्शक',
    'journey_assistant': 'प्रवास सहाय्यक',
    'emergency_sos': 'आणीबाणी (SOS)',
    'volunteer_portal': 'स्वयंसेवक पोर्टल',
    'project_roadmap': 'प्रकल्प आराखडा',
    'about_project': 'प्रकल्पाविषयी',
    'contact_us': 'संपर्क साधा',
    
    // Form labels
    'journey_start': 'प्रवासाची सुरुवात तारीख',
    'journey_end': 'प्रवासाची समाप्ती तारीख',
    'num_pilgrims': 'एकूण सोबत येणारे यात्रेकरू',
    'purpose': 'यात्रेचा उद्देश',
    'travel_mode': 'आगमनाचा मार्ग',
    'accommodation': 'निवासाची सोय',
    'emergency_contact': 'आणीबाणीच्या वेळचा संपर्क क्रमांक',
    'blood_group': 'रक्त गट',
    'medical_conditions': 'ज्ञात वैद्यकीय आजार (काही असल्यास)',
    'special_assistance': 'विशेष मदतीची विनंती',
    
    // Purpose options
    'purpose_darshan': 'सामान्य दर्शन',
    'purpose_snan': 'पवित्र स्नान (घट)',
    'purpose_seva': 'स्वयंसेवक सेवा (सेवा)',
    
    // Travel modes
    'travel_train': 'भारतीय रेल्वे',
    'travel_bus': 'खाजगी/एसटी बस',
    'travel_vehicle': 'खाजगी वाहन',
    'travel_flight': 'विमान प्रवास',
    
    // Accommodation options
    'acc_camp': 'सरकारी तंबू निवास',
    'acc_dharamshala': 'धर्मशाळा',
    'acc_hotel': 'हॉटेल बुकिंग',
    'acc_own': 'स्वतःची सोय',
    
    // Buttons
    'back': 'मागे',
    'cancel': 'रद्द करा',
    'continue': 'पुढे जा',
    'submit_permit': 'परवानगी अर्ज सादर करा'
  }
};

export function translate(key: string, lang: string): string {
  const currentLang = DICTIONARY[lang] ? lang : 'English';
  return DICTIONARY[currentLang][key] || DICTIONARY['English'][key] || key;
}
