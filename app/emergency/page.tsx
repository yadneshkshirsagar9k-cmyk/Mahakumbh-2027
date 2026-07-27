'use client';

/**
 * @file Emergency Portal Page
 * @description REDESIGNED emergency command center for Nashik Kumbh Mela 2027.
 * Built for high contrast, rapid one-handed access, low battery, and zero internet resiliency.
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  HeartPulse, 
  Ambulance, 
  Flame, 
  UserCheck, 
  Users, 
  AlertOctagon, 
  Smile, 
  HelpCircle, 
  Compass, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Search, 
  Plus, 
  Filter, 
  Info,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Send,
  Sparkles,
  Calendar,
  X,
  Volume2,
  Mic,
  Camera,
  Share2,
  WifiOff,
  User,
  Heart,
  FileText,
  Activity,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Clock,
  Radio,
  FileDown
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { 
  HELP_CENTRES_DATA, 
  HelpCentre 
} from '@/constants/emergency-data';
import { EmergencyMapWrapper } from '@/components/maps/emergency-map-wrapper';
import { cn } from '@/utils/cn';

// ============================================================
// TRANSLATIONS DATA (English, Hindi, Marathi)
// ============================================================

const TRANSLATIONS = {
  en: {
    bannerTitle: "🚨 HIGH ALERT: RAM KUND CROWD SURGE",
    bannerAdvisory: "Govt Advisory: Direct access to Ram Kund ghat temporarily restricted. Diversion maps active via Ahilya Bridge. Godavari river level: Normal.",
    crowdStatus: "Crowd: HIGH DENSITY",
    riverStatus: "River level: NORMAL",
    roadStatus: "Road Closures: CBS core zone restricted",
    sosTitle: "EMERGENCY SOS",
    sosSubtitle: "1-Tap Location & Request Telemetry",
    sosButtonText: "TAP TO TRIGGER EMERGENCY SOS",
    sosSubtext: "Sends current GPS and alerts Central Command",
    sosActiveText: "SOS DISPATCH ACTIVE",
    sosSent: "Request Submitted",
    sosWait: "Waiting for Dispatcher",
    sosAssigned: "Rescue Team Dispatched",
    sosRef: "Request ID",
    sosLocShared: "Location Shared",
    describeEmerg: "Describe Your Emergency",
    describePlaceholder: "Type or say 'My father fainted', 'Child is missing', 'Fire'...",
    describeHint: "AI classifies and opens direct department dispatcher workflow below.",
    categoriesTitle: "Select Emergency Type",
    categoriesSub: "Instant Dispatch Forms",
    nearestHelpTitle: "Nearest Help & Medical Camps",
    nearestHelpSub: "One-tap navigation & direct helplines",
    mapTitle: "Live GIS Emergency Map",
    mapSub: "Evacuation gates & emergency stations",
    missingTitle: "Missing & Found Registry Desk",
    missingSub: "Match lost families with biometrics",
    safetyTitle: "Visual Safety Guidelines",
    safetySub: "Actionable protocols under stress",
    helplinesTitle: "Rapid-Dial Helplines",
    helplinesSub: "Direct emergency line triggers",
    offlineTitle: "AUTOMATIC OFFLINE MODE ACTIVE",
    offlineMsg: "Network connection lost. Emergency features running on local cache storage.",
    offlineGPS: "Last Known Coordinates",
    offlineQR: "Emergency Responder QR Code",
    medicalTitle: "Emergency Medical Profile",
    medicalSub: "For Responders (Offline Compatible)",
    medicalBlood: "Blood Group",
    medicalAllergies: "Allergies",
    medicalCond: "Conditions",
    medicalContacts: "Emergency Contacts",
    medicalMedicines: "Current Medications",
    medicalPref: "Hospital Preference",
    medicalEdit: "Edit details in Profile",
    shareTitle: "Share Location via Offline Channels",
    shareSMS: "Share Coordinates via SMS",
    shareWhatsApp: "Share Location via WhatsApp",
    ccTitle: "Emergency Systems Command Status",
    ccControlRoom: "Command Room: ONLINE",
    ccMedicalActive: "Medical Teams: 24 active squads",
    ccPoliceActive: "Police: Sadhugram grid active",
    ccNetworkStatus: "Kumbh Private Grid: 100% capacity",
    reunionCenters: "Reunion & Transit Hubs",
    reportMissing: "Report Missing Person",
    reportFound: "Register Found Person",
    formName: "Full Name",
    formAge: "Age Group",
    formLastSector: "Last Seen Sector",
    formContact: "Your Contact Number",
    formSubmit: "Submit Report to Command Center",
    photoUpload: "Take Photo / Upload",
    child: "Child (0-14 Years)",
    adult: "Adult (15+ Years)",
    guideDo: "DO",
    guideDoNot: "DO NOT",
    guideNumber: "Emergency Hotline",
    langEn: "English",
    langHi: "हिन्दी",
    langMr: "मराठी",
    contrastMode: "High Contrast UI"
  },
  hi: {
    bannerTitle: "🚨 उच्च सतर्कता: राम कुंड भीड़ का बढ़ाव",
    bannerAdvisory: "सरकारी सलाह: राम कुंड घाट पर सीधा प्रवेश अस्थायी रूप से प्रतिबंधित है। अहिल्या ब्रिज के माध्यम से डायवर्जन चालू है। गोदावरी जल स्तर: सामान्य।",
    crowdStatus: "भीड़: अत्यधिक घनत्व",
    riverStatus: "नदी का स्तर: सामान्य",
    roadStatus: "सड़क बंदी: सीबीएस कोर क्षेत्र प्रतिबंधित",
    sosTitle: "आपातकालीन एसओएस (SOS)",
    sosSubtitle: "1-टैप स्थान और अनुरोध टेलीमेट्री",
    sosButtonText: "आपातकालीन SOS शुरू करें",
    sosSubtext: "यह आपके जीपीएस और केंद्रीय कमान को सचेत करता है",
    sosActiveText: "SOS बचाव सक्रिय",
    sosSent: "अनुरोध सबमिट किया गया",
    sosWait: "प्रेषक की प्रतीक्षा",
    sosAssigned: "बचाव दल रवाना किया गया",
    sosRef: "अनुरोध आईडी",
    sosLocShared: "स्थान साझा किया गया",
    describeEmerg: "अपनी आपात स्थिति बताएं",
    describePlaceholder: "लिखें या बोलें 'पिताजी बेहोश हो गए', 'बच्चा गुम है', 'आग लगी है'...",
    describeHint: "एआई स्वचालित रूप से वर्गीकृत करके नीचे विभाग प्रेषक को खोल देगा।",
    categoriesTitle: "आपातकाल का प्रकार चुनें",
    categoriesSub: "त्वरित सहायता फॉर्म",
    nearestHelpTitle: "निकटतम सहायता एवं चिकित्सा शिविर",
    nearestHelpSub: "वन-टैप नेविगेशन और डायरेक्ट हेल्पलाइन",
    mapTitle: "लाइव जीआईएस आपातकालीन मानचित्र",
    mapSub: "निकासी द्वार और आपातकालीन स्टेशन",
    missingTitle: "लापता और पाए गए लोगों का डेस्क",
    missingSub: "बायोमेट्रिक्स के साथ खोए परिवारों का मिलान करें",
    safetyTitle: "दृश्य सुरक्षा दिशानिर्देश",
    safetySub: "तनाव में तुरंत उठाए जाने वाले कदम",
    helplinesTitle: "रैपिड-डायल हेल्पलाइन",
    helplinesSub: "सीधा आपातकालीन कॉल",
    offlineTitle: "स्वचालित ऑफ़लाइन मोड सक्रिय",
    offlineMsg: "नेटवर्क कनेक्शन टूट गया है। आपातकालीन सुविधाएँ स्थानीय कैश पर चल रही हैं।",
    offlineGPS: "अंतिम ज्ञात निर्देशांक (GPS)",
    offlineQR: "आपातकालीन प्रतिक्रियाकर्ता QR कोड",
    medicalTitle: "आपातकालीन चिकित्सा प्रोफ़ाइल",
    medicalSub: "बचाव दल के लिए (ऑफ़लाइन उपलब्ध)",
    medicalBlood: "रक्त समूह",
    medicalAllergies: "एलर्जी",
    medicalCond: "स्वास्थ्य स्थिति",
    medicalContacts: "आपातकालीन संपर्क",
    medicalMedicines: "नियमित दवाएं",
    medicalPref: "अस्पताल प्राथमिकता",
    medicalEdit: "प्रोफ़ाइल में विवरण संपादित करें",
    shareTitle: "ऑफ़लाइन चैनलों के माध्यम से स्थान साझा करें",
    shareSMS: "एसएमएस के माध्यम से स्थान साझा करें",
    shareWhatsApp: "व्हाट्सएप के माध्यम से स्थान साझा करें",
    ccTitle: "आपातकालीन प्रणाली कमान स्थिति",
    ccControlRoom: "कंट्रोल रूम: ऑनलाइन",
    ccMedicalActive: "चिकित्सा दल: 24 सक्रिय दस्ते",
    ccPoliceActive: "पुलिस: साधुग्राम ग्रिड सक्रिय",
    ccNetworkStatus: "कुंभ निजी नेटवर्क: 100% क्षमता",
    reunionCenters: "पुनर्मिलन और पारगमन केंद्र",
    reportMissing: "लापता व्यक्ति की रिपोर्ट करें",
    reportFound: "पाए गए व्यक्ति का पंजीकरण करें",
    formName: "पूरा नाम",
    formAge: "आयु वर्ग",
    formLastSector: "अंतिम बार देखा गया सेक्टर",
    formContact: "आपका संपर्क नंबर",
    formSubmit: "कंट्रोल रूम में रिपोर्ट जमा करें",
    photoUpload: "फोटो लें / अपलोड करें",
    child: "बच्चा (0-14 वर्ष)",
    adult: "वयस्क (15+ वर्ष)",
    guideDo: "क्या करें",
    guideDoNot: "क्या न करें",
    guideNumber: "आपातकालीन हॉटलाइन",
    langEn: "English",
    langHi: "हिन्दी",
    langMr: "मराठी",
    contrastMode: "उच्च कंट्रास्ट UI"
  },
  mr: {
    bannerTitle: "🚨 हाय अलर्ट: राम कुंड गर्दी वाढली",
    bannerAdvisory: "शासकीय सल्ला: राम कुंड घाटावर थेट प्रवेश तात्पुरता मर्यादित आहे. अहिल्या पुलावरून वळसा मार्ग सुरू आहे. गोदावरी जलस्तर: सामान्य.",
    crowdStatus: "गर्दी: अति घनता",
    riverStatus: "नदीची पातळी: सामान्य",
    roadStatus: "रस्ते बंद: सीबीएस कोर झोन प्रतिबंधित",
    sosTitle: "आपत्कालीन एसओएस (SOS)",
    sosSubtitle: "१-टॅप स्थान आणि विनंती माहिती प्रसार",
    sosButtonText: "आपत्कालीन SOS सुरू करा",
    sosSubtext: "तुमचे जीपीएस आणि केंद्रीय नियंत्रण केंद्राला अलर्ट पाठवते",
    sosActiveText: "SOS बचाव सक्रिय",
    sosSent: "विनंती सादर केली",
    sosWait: "नियंत्रक प्रतिसाद प्रलंबित",
    sosAssigned: "बचाव पथक रवाना झाले",
    sosRef: "विनंती आयडी",
    sosLocShared: "स्थान शेअर केले",
    describeEmerg: "आपल्या समस्येचे वर्णन करा",
    describePlaceholder: "लिहा किंवा बोला 'वडील बेशुद्ध पडले', 'मूल गहाळ आहे', 'आग लागली आहे'...",
    describeHint: "AI स्वयंचलित वर्गीकरण करून थेट विभाग नियंत्रक विभाग उघडेल.",
    categoriesTitle: "आपत्कालीन प्रकार निवडा",
    categoriesSub: "त्वरित मदत फॉर्म",
    nearestHelpTitle: "जवळचे मदत केंद्र आणि वैद्यकीय शिबिर",
    nearestHelpSub: "वन-टैप नेव्हिगेशन आणि थेट हेल्पलाईन",
    mapTitle: "थेट जीआयएस आपत्कालीन नकाशा",
    mapSub: "बाहेर पडण्याचे मार्ग आणि आपत्कालीन केंद्रे",
    missingTitle: "गहाळ आणि सापडलेल्या व्यक्तींची नोंदणी",
    missingSub: "बायोमेट्रिक्सच्या साहाय्याने गहाळ कुटुंबांना एकत्र आणा",
    safetyTitle: "दृश्य सुरक्षा मार्गदर्शक तत्त्वे",
    safetySub: "तणावामध्ये त्वरित करायच्या कृती",
    helplinesTitle: "रॅपिड-डायल हेल्पलाईन",
    helplinesSub: "थेट आपत्कालीन कॉल",
    offlineTitle: "स्वयंचलित ऑफलाइन मोड सक्रिय",
    offlineMsg: "नेटवर्क जोडणी खंडित झाली आहे. आपत्कालीन सुविधा स्थानिक कॅशवर सुरू आहेत.",
    offlineGPS: "शेवटची ज्ञात जीपीएस अक्षवृत्ते",
    offlineQR: "आपत्कालीन प्रतिसादासाठी QR कोड",
    medicalTitle: "आपत्कालीन वैद्यकीय माहिती",
    medicalSub: "बचाव पथकासाठी (ऑफलाईन उपलब्ध)",
    medicalBlood: "रक्तगट",
    medicalAllergies: "अ‍ॅलर्जी",
    medicalCond: "आरोग्य स्थिती",
    medicalContacts: "आपत्कालीन संपर्क",
    medicalMedicines: "नियमित औषधे",
    medicalPref: "रुग्णालय प्राधान्य",
    medicalEdit: "प्रोफाइलमध्ये माहिती दुरुस्त करा",
    shareTitle: "ऑफलाइन मार्गाने स्थान सामायिक करा",
    shareSMS: "एसएमएस द्वारे स्थान शेअर करा",
    shareWhatsApp: "व्हॉट्सॲप द्वारे स्थान शेअर करा",
    ccTitle: "आपत्कालीन यंत्रणा नियंत्रण स्थिती",
    ccControlRoom: "कंट्रोल रूम: ऑनलाइन",
    ccMedicalActive: "वैद्यकीय पथक: २४ सक्रिय पथके",
    ccPoliceActive: "पोलीस: साधुग्राम ग्रिड सक्रिय",
    ccNetworkStatus: "कुंभ खाजगी नेटवर्क: १००% क्षमता",
    reunionCenters: "पुनर्मिलन आणि संक्रमण केंद्रे",
    reportMissing: "गहाळ व्यक्तीची तक्रार करा",
    reportFound: "सापडलेल्या व्यक्तीची नोंदणी करा",
    formName: "पूर्ण नाव",
    formAge: "वयोगट",
    formLastSector: "शेवटचे पाहिलेले ठिकाण",
    formContact: "तुमचा संपर्क क्रमांक",
    formSubmit: "कंट्रोल रूमकडे तक्रार सादर करा",
    photoUpload: "फोटो घ्या / अपलोड करा",
    child: "मूल (०-१४ वर्षे)",
    adult: "प्रौढ (१५+ वर्षे)",
    guideDo: "करा",
    guideDoNot: "करू नका",
    guideNumber: "आपत्कालीन हेल्पलाईन",
    langEn: "English",
    langHi: "हिन्दी",
    langMr: "मराठी",
    contrastMode: "उच्च कंट्रास्ट UI"
  }
};

// ============================================================
// EMERGENCY CONSTANTS INLINE FOR HIGH PERFORMANCE & ROBUSTNESS
// ============================================================

const CATEGORIES_DATA = [
  { id: 'cat-medical', label: 'Medical Emergency', labelHi: 'चिकित्सा आपातकाल', labelMr: 'वैद्यकीय आपत्कालीन', icon: HeartPulse, color: 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400', colorRaw: 'red' },
  { id: 'cat-police', label: 'Police Assistance', labelHi: 'पुलिस सहायता', labelMr: 'पोलीस मदत', icon: ShieldAlert, color: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400', colorRaw: 'blue' },
  { id: 'cat-fire', label: 'Fire Emergency', labelHi: 'अग्निशमन आपातकाल', labelMr: 'अग्निशमन आपत्कालीन', icon: Flame, color: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400', colorRaw: 'amber' },
  { id: 'cat-women', label: "Women's Safety", labelHi: 'महिला सुरक्षा', labelMr: 'महिला सुरक्षा', icon: UserCheck, color: 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400', colorRaw: 'rose' },
  { id: 'cat-missing', label: 'Missing Child / Adult', labelHi: 'लापता बच्चा / वयस्क', labelMr: 'गहाळ बालके / प्रौढ', icon: Users, color: 'border-slate-500 bg-slate-50 text-slate-700 dark:bg-slate-900/50 dark:text-slate-400', colorRaw: 'slate' },
  { id: 'cat-water', label: 'Water Rescue', labelHi: 'जल बचाव (नदी)', labelMr: 'जल बचाव पथक', icon: AlertOctagon, color: 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400', colorRaw: 'cyan' },
  { id: 'cat-accident', label: 'Road Accident', labelHi: 'सड़क दुर्घटना', labelMr: 'रस्ता अपघात', icon: Ambulance, color: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400', colorRaw: 'emerald' },
  { id: 'cat-volunteer', label: 'Volunteer Assistance', labelHi: 'स्वयंसेवक सहायता', labelMr: 'स्वयंसेवक मदत', icon: Smile, color: 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/20 dark:text-violet-400', colorRaw: 'violet' }
];

const QUICK_HELPLINES = [
  { name: 'Kumbh Central Police', number: '112', coverage: 'All Sectors' },
  { name: 'Medical Emergency Desk', number: '108', coverage: 'Trauma & Transit' },
  { name: 'Simhastha Fire Control', number: '101', coverage: 'Camp Hydrants' },
  { name: 'Damini Squad (Women)', number: '1091', coverage: 'Ghats & Saddhugram' },
  { name: 'Child Rescue Tracking', number: '1098', coverage: 'Sector Hubs' },
  { name: 'NDRF Disaster Command', number: '+91-22-29202570', coverage: 'All Maharashtra' },
  { name: 'Volunteer Grid Dispatch', number: '1913', coverage: 'Sector Guides' }
];

const SAFETY_GUIDES_DATA = [
  {
    id: 'guide-stampede',
    title: 'Stampede Surge',
    titleHi: 'भीड़ का रेला',
    titleMr: 'चेंगराचेंगरी सुरक्षा',
    dos: ['Move diagonally to crowd flow.', 'Keep hands up in front of chest.', 'Slide sideways if pushed.'],
    donts: ['Do not stop to pick up shoes.', 'Do not scream to create panic.', 'Do not push against barriers.'],
    hotline: '112 / police'
  },
  {
    id: 'guide-heatstroke',
    title: 'Heatstroke Prevention',
    titleHi: 'लू से बचाव',
    titleMr: 'उष्माघात प्रतिबंध',
    dos: ['Drink water from municipal filters.', 'Wear wet cotton cover on head.', 'Report thermal fatigue immediately.'],
    donts: ['Do not drink unverified open water.', 'Do not stand under direct sun.', 'Do not skip dehydration cues.'],
    hotline: '108 / medical'
  },
  {
    id: 'guide-river',
    title: 'River Safety',
    titleHi: 'नदी स्नान सुरक्षा',
    titleMr: 'नदी स्नान सुरक्षा',
    dos: ['Hold safety chains securely.', 'Bathe only in designated zones.', 'Watch slippery concrete ghats.'],
    donts: ['Do not cross barrier ropes.', 'Do not dive from high platforms.', 'Do not bathe alone at night.'],
    hotline: '1091 / water'
  },
  {
    id: 'guide-snake',
    title: 'Snake Bite Alert',
    titleHi: 'सर्पदंश आपातकाल',
    titleMr: 'सर्पदंश आपत्कालीन',
    dos: ['Immobilize the bitten limb.', 'Note down time and snake color.', 'Call immediate trauma squad.'],
    donts: ['Do not cut or suck the venom.', 'Do not apply ice or tight bands.', 'Do not run or move excessively.'],
    hotline: '108 / trauma'
  },
  {
    id: 'guide-fire',
    title: 'Tent Camp Fire',
    titleHi: 'तंबू शिविर में आग',
    titleMr: 'तंबू आग सुरक्षा',
    dos: ['Crawl low beneath smoke layers.', 'Use local sand bucket stations.', 'Alert neighbors immediately.'],
    donts: ['Do not throw water on electric fires.', 'Do not lock tent doors when exit.', 'Do not stay back to fetch items.'],
    hotline: '101 / fire'
  },
  {
    id: 'guide-lightning',
    title: 'Lightning & Storm',
    titleHi: 'आकाशीय बिजली / तूफान',
    titleMr: 'वीज आणि वादळ',
    dos: ['Take shelter in solid structures.', 'Squat low if caught in open.', 'Unplug camp batteries.'],
    donts: ['Do not stand under single tall trees.', 'Do not hold iron poles or fences.', 'Do not use mobile phones in open.'],
    hotline: '112 / control'
  }
];

export default function EmergencyPortal() {
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  const highContrast = false;
  const [isOffline, setIsOffline] = useState(false);

  // SOS States
  const [sosActive, setSosActive] = useState(false);
  const [sosId, setSosId] = useState<string | null>(null);
  const [sosStep, setSosStep] = useState(0); // 0: submitted, 1: location shared, 2: responder assigned
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Missing Persons State
  const [missingTab, setMissingTab] = useState<'missing' | 'found'>('missing');
  const [missingList, setMissingList] = useState<{ name: string; ageGroup: string; sector: string; phone: string; type: string }[]>([]);
  const [missingForm, setMissingForm] = useState({ name: '', ageGroup: 'child', sector: 'Sector 4 Hub', phone: '' });

  // AI assistant states
  const [aiText, setAiText] = useState('');
  const [aiDetectedCategory, setAiDetectedCategory] = useState<string | null>(null);

  // Active Emergency Category Workflow State
  const [activeCategoryWorkflow, setActiveCategoryWorkflow] = useState<string | null>(null);

  // Map settings and focus
  const [selectedHelpCentre, setSelectedHelpCentre] = useState<HelpCentre | null>(null);
  const [mapLayer, setMapLayer] = useState<'routes' | 'density' | 'camps'>('camps');

  const text = TRANSLATIONS[lang];

  // Load missing/found person reports from database on mount
  useEffect(() => {
    const fetchMissingReports = async () => {
      try {
        const res = await fetch('/api/emergency/missing');
        if (res.ok) {
          const data = await res.json();
          setMissingList(data);
        }
      } catch (err) {
        console.error('Failed to fetch missing reports:', err);
      }
    };
    fetchMissingReports();
  }, []);

  // Offline detection hook
  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Location Telemetry simulation
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default to Ram Kund coordinates
          setGpsCoordinates({ lat: 20.0058, lng: 73.7919 });
        }
      );
    }
  }, []);

  // Auto-progress the SOS steps to simulate dispatcher response
  useEffect(() => {
    if (sosActive) {
      setSosStep(0);
      const t1 = setTimeout(() => setSosStep(1), 3000);
      const t2 = setTimeout(() => setSosStep(2), 7000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [sosActive]);

  // Handle Universal SOS Click
  const triggerUniversalSOS = () => {
    const randomId = `KMC-${Math.floor(1000 + Math.random() * 9000)}-SOS`;
    setSosId(randomId);
    setSosActive(true);
  };

  // AI Classification engine in background
  const handleAiTextChange = (val: string) => {
    setAiText(val);
    const query = val.toLowerCase().trim();
    if (query.includes('faint') || query.includes('unconscious') || query.includes('ambulance') || query.includes('heart') || query.includes('doctor') || query.includes('pain') || query.includes('मेडिकल') || query.includes('रुग्णवाहिका')) {
      setAiDetectedCategory('cat-medical');
    } else if (query.includes('police') || query.includes('thief') || query.includes('fight') || query.includes('crowd') || query.includes('पोलीस') || query.includes('गर्दी')) {
      setAiDetectedCategory('cat-police');
    } else if (query.includes('fire') || query.includes('smoke') || query.includes('blast') || query.includes('आग') || query.includes('जळाले')) {
      setAiDetectedCategory('cat-fire');
    } else if (query.includes('woman') || query.includes('harass') || query.includes('safety') || query.includes('महिला') || query.includes('छेडछाड')) {
      setAiDetectedCategory('cat-women');
    } else if (query.includes('missing') || query.includes('child') || query.includes('lost') || query.includes('गहाळ') || query.includes('गुम')) {
      setAiDetectedCategory('cat-missing');
    } else if (query.includes('drown') || query.includes('river') || query.includes('water') || query.includes('पूर') || query.includes('नदीत')) {
      setAiDetectedCategory('cat-water');
    } else if (query.includes('accident') || query.includes('road') || query.includes('car') || query.includes('अपघात') || query.includes('दुर्घटना')) {
      setAiDetectedCategory('cat-accident');
    } else {
      setAiDetectedCategory(null);
    }
  };

  const executeClassifiedWorkflow = () => {
    if (aiDetectedCategory) {
      setActiveCategoryWorkflow(aiDetectedCategory);
      setAiText('');
      setAiDetectedCategory(null);
      // Scroll smoothly to dispatch panel
      const el = document.getElementById('workflows-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Missing Persons form submission to database
  const handleMissingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missingForm.name || !missingForm.phone) return;
    try {
      const res = await fetch('/api/emergency/missing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: missingForm.name,
          ageGroup: missingForm.ageGroup,
          sector: missingForm.sector,
          phone: missingForm.phone,
          type: missingTab
        })
      });
      if (res.ok) {
        const savedReport = await res.json();
        setMissingList(prev => [savedReport, ...prev]);
        setMissingForm({ name: '', ageGroup: 'child', sector: 'Sector 4 Hub', phone: '' });
        alert(`Submit Successful. Details saved to database and shared with all Sector Biometric Command booths.`);
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Failed to save report.');
    }
  };

  const handlePhoneDial = (num: string) => {
    window.open(`tel:${num.replace(/\D/g, '')}`, '_self');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFBFC] text-[#111827] transition-all">
      <Navbar />

      {/* TOP CONTROLS FOR QUICK CONFIGURATION */}
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

        {/* Offline indicator */}
        {isOffline ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs font-black rounded-lg animate-pulse">
            <WifiOff size={16} />
            <span>{text.offlineTitle}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>SYSTEM ONLINE (24x7)</span>
          </div>
        )}
      </div>

      <main className="flex-grow pb-24 px-4 sm:px-6 lg:px-8 space-y-6 max-w-[1280px] mx-auto w-full pt-4">
        
        {/* SECTION 1: EMERGENCY ALERT BANNER (CRITICAL) */}
        <div className="border rounded-xl p-4 bg-red-50 border-red-200 text-xs font-bold text-[#374151]">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
              <div>
                <h2 className="text-sm font-black text-red-700 uppercase tracking-wide">
                  {text.bannerTitle}
                </h2>
                <p className="mt-1 leading-relaxed text-xs">
                  {text.bannerAdvisory}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <span className="px-2.5 py-1 bg-red-600 text-white rounded text-[10px] uppercase font-black">
                {text.crowdStatus}
              </span>
              <span className="px-2.5 py-1 bg-amber-600 text-white rounded text-[10px] uppercase font-black">
                {text.riverStatus}
              </span>
              <span className="px-2.5 py-1 bg-slate-700 text-white rounded text-[10px] uppercase font-black">
                {text.roadStatus}
              </span>
            </div>
          </div>
        </div>

        {/* TOP CRITICAL ACTION AREA (SOS & HELPLINES SIDE-BY-SIDE OR VERTICAL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Universal SOS Button (Col-span 7) */}
          <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-md text-center flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-red-600 uppercase tracking-tight flex items-center justify-center gap-2">
                <ShieldAlert className="text-red-600 animate-bounce" size={28} />
                <span>{text.sosTitle}</span>
              </h2>
              <p className="text-xs text-[#6B7280] font-bold">
                {text.sosSubtitle}
              </p>

              <button
                onClick={triggerUniversalSOS}
                className={cn(
                  "w-full py-8 rounded-2xl border-4 text-xl font-black text-white transition-all shadow-lg active:scale-95 flex flex-col items-center justify-center gap-2 cursor-pointer",
                  sosActive 
                    ? "bg-emerald-600 border-emerald-700 animate-pulse" 
                    : "bg-red-600 border-red-700 hover:bg-red-700"
                )}
              >
                <span>{sosActive ? text.sosActiveText : text.sosButtonText}</span>
                <span className="text-xs font-medium tracking-wide opacity-90">
                  {sosActive ? "GPS BROADCAST ONGOING..." : text.sosSubtext}
                </span>
              </button>

              {gpsCoordinates && (
                <p className="text-[10px] text-stone-grey-500 font-mono">
                  Telemetry Coordinates: {gpsCoordinates.lat.toFixed(6)}, {gpsCoordinates.lng.toFixed(6)}
                </p>
              )}
            </div>

            {/* REQUEST STATUS SECTION (VISIBLE AFTER SOS CLICK) */}
            <AnimatePresence>
              {sosActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-5 border-2 border-emerald-500 bg-emerald-50/50 rounded-xl text-left space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                      {text.sosLocShared}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {text.sosRef}: <span className="font-mono font-black">{sosId}</span>
                    </span>
                  </div>

                  {/* Progress Tracker mimicking Government system */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold", sosStep >= 0 ? "bg-emerald-600" : "bg-slate-300")}>✓</div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{text.sosSent}</p>
                        <p className="text-[10px] text-[#6B7280]">Central Command Room alerted.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold", sosStep >= 1 ? "bg-emerald-600 animate-pulse" : "bg-slate-300")}>
                        {sosStep >= 1 ? "✓" : "2"}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{text.sosLocShared}</p>
                        <p className="text-[10px] text-[#6B7280]">Broadcasting telemetry on local grid sector.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold", sosStep >= 2 ? "bg-emerald-600" : "bg-slate-300")}>
                        {sosStep >= 2 ? "✓" : "3"}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{text.sosAssigned}</p>
                        <p className="text-[10px] text-[#6B7280]">Emergency responders route locked from Sector 2 Hub.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSosActive(false)}
                    className="w-full py-2 bg-slate-900 text-white font-black text-xs uppercase rounded hover:bg-slate-800"
                  >
                    CANCEL SOS ALARM
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick-Dial Helplines (Col-span 5) */}
          <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#111827] uppercase tracking-tight flex items-center gap-2">
                <Phone className="text-red-600 animate-pulse" size={24} />
                <span>{text.helplinesTitle}</span>
              </h2>
              <p className="text-xs text-[#6B7280] font-bold mt-1">
                {text.helplinesSub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {QUICK_HELPLINES.map((line, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePhoneDial(line.number)}
                  className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-between text-left cursor-pointer transition-all active:scale-95 text-red-900 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[9px] font-black uppercase tracking-wide leading-tight text-red-900 truncate">{line.name}</h4>
                    <p className="text-sm font-black mt-1 font-mono text-red-650">{line.number}</p>
                  </div>
                  <Phone size={14} className="text-red-600 flex-shrink-0 ml-1.5" />
                </button>
              ))}
            </div>

            <div className="p-3 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB] text-[10px] text-[#6B7280] leading-normal font-semibold">
              ⚠️ In case of phone network failure, use the telemetry SMS sharing tools below to bypass voice cellular grid.
            </div>
          </div>
        </div>

        {/* GPS TELEMETRY & OFFLINE CHANNELS */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-2">
            <div>
              <h3 className="text-sm font-black text-[#111827] uppercase tracking-wide">
                {text.shareTitle}
              </h3>
              <p className="text-[10px] text-[#6B7280] font-semibold">Offline message bypass using mobile SMS/WhatsApp links.</p>
            </div>
            {gpsCoordinates && (
              <span className="font-mono text-xs font-black bg-stone-100 px-2 py-1 rounded text-stone-700 border">
                🛰️ Lat: {gpsCoordinates.lat.toFixed(6)} | Lng: {gpsCoordinates.lng.toFixed(6)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`sms:?body=Kumbh emergency coordinates trigger: ${gpsCoordinates?.lat.toFixed(6) || '20.0058'}, ${gpsCoordinates?.lng.toFixed(6) || '73.7919'}`}
              className="p-3 border-2 border-[#005BAC] text-[#005BAC] hover:bg-blue-50 rounded-xl text-xs font-black uppercase tracking-wide text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <Send size={14} />
              <span>{text.shareSMS}</span>
            </a>
            <a
              href={`https://wa.me/?text=Kumbh emergency coordinates: ${gpsCoordinates?.lat.toFixed(6) || '20.0058'}, ${gpsCoordinates?.lng.toFixed(6) || '73.7919'}`}
              target="_blank"
              className="p-3 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-black uppercase tracking-wide text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <Share2 size={14} />
              <span>{text.shareWhatsApp}</span>
            </a>
          </div>
        </div>

        {/* SECTION 3: DESCRIBE YOUR EMERGENCY AI CLASSIFIER */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-wider flex items-center gap-2">
            <Radio className="text-[#005BAC] animate-pulse" size={18} />
            <span>{text.describeEmerg}</span>
          </h3>
          <div className="relative">
            <input
              type="text"
              value={aiText}
              onChange={(e) => handleAiTextChange(e.target.value)}
              placeholder={text.describePlaceholder}
              className="w-full pl-4 pr-12 py-3 rounded-lg border border-[#E5E7EB] text-xs font-semibold focus:border-red-500 outline-none"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-600">
              <Mic size={18} />
            </button>
          </div>
          {aiDetectedCategory && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between animate-pulse">
              <span className="text-xs font-black text-red-700">
                Auto-Detected: {CATEGORIES_DATA.find(c => c.id === aiDetectedCategory)?.label}
              </span>
              <button
                onClick={executeClassifiedWorkflow}
                className="px-3 py-1 bg-red-600 text-white font-black text-xs rounded uppercase hover:bg-red-700"
              >
                Launch Workflow
              </button>
            </div>
          )}
          <p className="text-[10px] text-[#6B7280] font-medium leading-normal">
            {text.describeHint}
          </p>
        </div>

        {/* SECTION 4: EMERGENCY CATEGORIES GRID */}
        <div className="space-y-3" id="workflows-section">
          <div className="flex flex-col">
            <h3 className="text-md font-black text-slate-900 uppercase tracking-wide">
              {text.categoriesTitle}
            </h3>
            <span className="text-xs text-[#6B7280] font-medium">{text.categoriesSub}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES_DATA.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategoryWorkflow === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryWorkflow(isActive ? null : cat.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left flex flex-col justify-between gap-3 transition-all cursor-pointer select-none",
                    cat.color,
                    isActive && "ring-4 ring-offset-2 ring-red-600"
                  )}
                >
                  <IconComp size={24} />
                  <span className="text-xs font-black leading-tight">
                    {lang === 'hi' ? cat.labelHi : lang === 'mr' ? cat.labelMr : cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* DYNAMIC EMERGENCY CATEGORIES WORKFLOW FORMS */}
          <AnimatePresence>
            {activeCategoryWorkflow && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 border border-[#E5E7EB] rounded-xl bg-white space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-black text-red-600 uppercase tracking-wider">
                    Active Crisis Channel: {CATEGORIES_DATA.find(c => c.id === activeCategoryWorkflow)?.label}
                  </h4>
                  <button onClick={() => setActiveCategoryWorkflow(null)} className="text-slate-500">
                    <X size={16} />
                  </button>
                </div>

                {/* Specific form actions per category */}
                {activeCategoryWorkflow === 'cat-medical' && (
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-slate-800">Critical Medical Callout: Send dispatch request instantly</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={triggerUniversalSOS} className="px-4 py-2.5 bg-red-600 text-white font-black rounded uppercase">Request Ambulance Now</button>
                      <button onClick={() => handlePhoneDial('108')} className="px-4 py-2.5 border border-red-500 text-red-700 font-black rounded uppercase">Call Hospital Direct (108)</button>
                    </div>
                  </div>
                )}

                {activeCategoryWorkflow === 'cat-police' && (
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-slate-800">Discreet Police Alert: Share live coordinates with police patrol grid</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={triggerUniversalSOS} className="px-4 py-2.5 bg-[#005BAC] text-white font-black rounded uppercase">Dispatch Police Patrol</button>
                      <button onClick={() => handlePhoneDial('112')} className="px-4 py-2.5 border border-blue-500 text-blue-700 font-black rounded uppercase">Call Police Hotline (112)</button>
                    </div>
                  </div>
                )}

                {activeCategoryWorkflow === 'cat-fire' && (
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-slate-800">Camp Fire Report: Send telemetry and trigger sand cannon backup</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={triggerUniversalSOS} className="px-4 py-2.5 bg-amber-600 text-white font-black rounded uppercase">Send Fire Brigade</button>
                      <button onClick={() => handlePhoneDial('101')} className="px-4 py-2.5 border border-amber-500 text-amber-700 font-black rounded uppercase">Call Fire Desk (101)</button>
                    </div>
                  </div>
                )}

                {activeCategoryWorkflow === 'cat-women' && (
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-slate-800">Discreet Women Squad Dispatch: Silent tracking alert sent</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={triggerUniversalSOS} className="px-4 py-2.5 bg-rose-600 text-white font-black rounded uppercase">Silent SOS Dispatch</button>
                      <button onClick={() => handlePhoneDial('1091')} className="px-4 py-2.5 border border-rose-500 text-rose-700 font-black rounded uppercase">Call Damini Squad (1091)</button>
                    </div>
                  </div>
                )}

                {activeCategoryWorkflow === 'cat-missing' && (
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-slate-800">Please report via the specialized registry form below.</p>
                    <button
                      onClick={() => {
                        const el = document.getElementById('missing-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2.5 bg-slate-800 text-white font-black rounded uppercase"
                    >
                      Go to Missing & Found Registry
                    </button>
                  </div>
                )}

                {activeCategoryWorkflow === 'cat-water' && (
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-slate-800">Ghat & River Rescue Alert: SDRF water patrols notified</p>
                    <button onClick={triggerUniversalSOS} className="px-4 py-2.5 bg-cyan-600 text-white font-black rounded uppercase">Dispatch Water Patrol</button>
                  </div>
                )}

                {activeCategoryWorkflow === 'cat-accident' && (
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-slate-800">Road Traffic & Accident Help: Clear highway gridlock</p>
                    <button onClick={() => handlePhoneDial('108')} className="px-4 py-2.5 bg-emerald-600 text-white font-black rounded uppercase">Dispatch Road Trauma</button>
                  </div>
                )}

                {activeCategoryWorkflow === 'cat-volunteer' && (
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-slate-800">Request volunteer escort or crowd guidance</p>
                    <button onClick={triggerUniversalSOS} className="px-4 py-2.5 bg-violet-600 text-white font-black rounded uppercase">Call Volunteer Team</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION 5: NEAREST HELP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 space-y-4 flex flex-col">
            <div>
              <h3 className="text-md font-black text-slate-900 uppercase tracking-wide">
                {text.nearestHelpTitle}
              </h3>
              <span className="text-xs text-[#6B7280] font-medium">{text.nearestHelpSub}</span>
            </div>

            <div className="space-y-2 flex-grow overflow-y-auto max-h-[380px] p-2 bg-white border border-[#E5E7EB] rounded-xl shadow-inner">
              {HELP_CENTRES_DATA.map((centre) => {
                const isSelected = selectedHelpCentre?.id === centre.id;
                
                return (
                  <div
                    key={centre.id}
                    onClick={() => setSelectedHelpCentre(centre)}
                    className={cn(
                      'p-3 rounded-lg border transition-all cursor-pointer text-left',
                      isSelected 
                        ? 'bg-red-50 border-red-500 shadow-sm'
                        : 'bg-white border-[#E5E7EB] hover:border-red-500'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide bg-red-100 text-red-800">
                        {centre.category === 'camp' ? 'Medical Camp' : centre.category}
                      </span>
                      <span className="text-[9px] text-[#6B7280] font-bold">Focus Map</span>
                    </div>

                    <h4 className="font-black text-xs text-[#111827] mt-1">
                      {centre.name}
                    </h4>

                    <div className="flex gap-4 mt-2 text-[9px] text-[#374151] font-bold">
                      <span>📏 350m</span>
                      <span>⏱️ 5 min walk</span>
                    </div>

                    <div className="flex gap-2 mt-2 pt-2 border-t border-[#E5E7EB]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHelpCentre(centre);
                          alert(`Navigating to ${centre.name}. Simulated directional markers loaded on GIS Map.`);
                        }}
                        className="px-3 py-1 bg-[#005BAC] text-white rounded text-[9px] font-bold uppercase tracking-wider hover:bg-[#0F4C81] transition"
                      >
                        Navigate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhoneDial(centre.contact);
                        }}
                        className="px-3 py-1 border border-[#E5E7EB] text-slate-700 rounded text-[9px] font-bold uppercase tracking-wider hover:bg-slate-50 transition"
                      >
                        Call
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: GIS Live Map wrapper */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-black text-slate-900 uppercase tracking-wide">
                  {text.mapTitle}
                </h3>
                <span className="text-xs text-[#6B7280] font-medium">{text.mapSub}</span>
              </div>

              {/* Map layer switch buttons */}
              <div className="flex items-center gap-1 bg-[#FAFBFC] border border-[#E5E7EB] p-1 rounded-lg">
                <button
                  onClick={() => setMapLayer('camps')}
                  className={cn("px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition", mapLayer === 'camps' ? 'bg-[#005BAC] text-white' : 'text-slate-600 hover:bg-slate-50')}
                >
                  Camps
                </button>
                <button
                  onClick={() => setMapLayer('routes')}
                  className={cn("px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition", mapLayer === 'routes' ? 'bg-[#005BAC] text-white' : 'text-slate-600 hover:bg-slate-50')}
                >
                  Routes
                </button>
                <button
                  onClick={() => setMapLayer('density')}
                  className={cn("px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition", mapLayer === 'density' ? 'bg-[#005BAC] text-white' : 'text-slate-600 hover:bg-slate-50')}
                >
                  Density
                </button>
              </div>
            </div>

            <div className="flex-grow aspect-video lg:aspect-auto min-h-[350px] border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm relative bg-slate-50">
              <EmergencyMapWrapper
                centres={HELP_CENTRES_DATA}
                selectedCentre={selectedHelpCentre}
              />
            </div>
          </div>
        </div>

        {/* MISSING & FOUND REGISTRY DESK */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4" id="missing-section">
          <div className="border-b pb-2">
            <h3 className="text-md font-black text-slate-900 uppercase tracking-wide">
              {text.missingTitle}
            </h3>
            <span className="text-xs text-[#6B7280] font-medium">{text.missingSub}</span>
          </div>

          {/* Registry navigation tabs */}
          <div className="flex items-center border-b">
            <button
              onClick={() => setMissingTab('missing')}
              className={cn("px-4 py-2 text-xs font-black uppercase border-b-2 tracking-wide transition-all", missingTab === 'missing' ? 'border-red-600 text-red-650 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900')}
            >
              {text.reportMissing}
            </button>
            <button
              onClick={() => setMissingTab('found')}
              className={cn("px-4 py-2 text-xs font-black uppercase border-b-2 tracking-wide transition-all", missingTab === 'found' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900')}
            >
              {text.reportFound}
            </button>
          </div>

          <form onSubmit={handleMissingSubmit} className="space-y-4 text-xs font-bold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#374151] mb-1 uppercase tracking-wide">{text.formName}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={missingForm.name}
                  onChange={(e) => setMissingForm({ ...missingForm, name: e.target.value })}
                  className="w-full p-2.5 border rounded outline-none focus:border-red-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[#374151] mb-1 uppercase tracking-wide">{text.formAge}</label>
                <select
                  value={missingForm.ageGroup}
                  onChange={(e) => setMissingForm({ ...missingForm, ageGroup: e.target.value })}
                  className="w-full p-2.5 border rounded outline-none font-semibold bg-white cursor-pointer"
                >
                  <option value="child">{text.child}</option>
                  <option value="adult">{text.adult}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#374151] mb-1 uppercase tracking-wide">{text.formLastSector}</label>
                <select
                  value={missingForm.sector}
                  onChange={(e) => setMissingForm({ ...missingForm, sector: e.target.value })}
                  className="w-full p-2.5 border rounded outline-none font-semibold bg-white cursor-pointer"
                >
                  <option value="Sector 4 Core Zone">Sector 4 Core Zone</option>
                  <option value="Sector 2 Transit Hub">Sector 2 Transit Hub</option>
                  <option value="Ram Kund Ghat Entry">Ram Kund Ghat Entry</option>
                  <option value="Trimbak Temple Outer Area">Trimbak Temple Outer Area</option>
                </select>
              </div>

              <div>
                <label className="block text-[#374151] mb-1 uppercase tracking-wide">{text.formContact}</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={missingForm.phone}
                  onChange={(e) => setMissingForm({ ...missingForm, phone: e.target.value })}
                  className="w-full p-2.5 border rounded outline-none focus:border-red-500 font-semibold"
                />
              </div>
            </div>

            {/* Photo Upload Placeholder */}
            <div>
              <label className="block font-bold text-[#374151] mb-1 uppercase tracking-wide">{text.photoUpload}</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 flex flex-col items-center justify-center gap-2">
                <Camera className="text-slate-400" size={24} />
                <span className="text-[10px] text-[#6B7280] font-bold">Tap to open Camera / Upload picture</span>
              </div>
            </div>

            <button
              type="submit"
              className={cn(
                "w-full py-3 text-xs font-black uppercase text-white rounded cursor-pointer",
                missingTab === 'missing' ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
              )}
            >
              {text.formSubmit}
            </button>
          </form>

          {/* List of active entries submitted by user in this session */}
          {missingList.length > 0 && (
            <div className="border-t pt-3 space-y-2">
              <h4 className="text-[10px] font-black text-slate-900 uppercase">Recent Submissions:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {missingList.map((entry, idx) => (
                  <div key={idx} className="p-2 border rounded bg-slate-50 text-[10px] font-bold">
                    <span className={cn("px-1 rounded text-[8px] uppercase", entry.type === 'missing' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800')}>
                      {entry.type.toUpperCase()}
                    </span>
                    <p className="mt-1">{entry.name} ({entry.ageGroup === 'child' ? text.child : text.adult})</p>
                    <p className="text-slate-500">Sector: {entry.sector}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reunion center locations */}
          <div className="border-t pt-3 space-y-2">
            <h4 className="text-[10px] font-black text-[#005BAC] uppercase">
              🏠 {text.reunionCenters}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-bold">
              <div className="p-2 border rounded">
                <p className="text-[#111827]">Sector 4 Reunion Camp</p>
                <p className="text-[#6B7280]">Sector 4 grounds</p>
              </div>
              <div className="p-2 border rounded">
                <p className="text-[#111827]">Ghat Gate 2 Desk</p>
                <p className="text-[#6B7280]">Ram Kund entry</p>
              </div>
              <div className="p-2 border rounded">
                <p className="text-[#111827]">Central Railway Transit</p>
                <p className="text-[#6B7280]">Nashik Road station</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 12: MEDICAL PROFILE CARD */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="text-md font-black text-slate-900 uppercase tracking-wide">
                {text.medicalTitle}
              </h3>
              <span className="text-xs text-[#6B7280] font-medium">{text.medicalSub}</span>
            </div>
            <a href="/account" className="text-xs font-black text-[#005BAC] uppercase hover:underline">
              {text.medicalEdit} →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Read-only medical metadata */}
            <div className="md:col-span-8 grid grid-cols-2 gap-4 text-xs font-bold">
              <div className="p-2 border rounded bg-slate-50">
                <span className="text-[#6B7280] uppercase text-[9px] block">{text.medicalBlood}</span>
                <span className="text-sm font-black text-[#111827]">O-Positive (O+)</span>
              </div>
              <div className="p-2 border rounded bg-slate-50">
                <span className="text-[#6B7280] uppercase text-[9px] block">{text.medicalAllergies}</span>
                <span className="text-sm font-black text-[#111827]">Penicillin, Peanuts</span>
              </div>
              <div className="p-2 border rounded bg-slate-50">
                <span className="text-[#6B7280] uppercase text-[9px] block">{text.medicalCond}</span>
                <span className="text-sm font-black text-[#111827]">Mild Hypertension</span>
              </div>
              <div className="p-2 border rounded bg-slate-50">
                <span className="text-[#6B7280] uppercase text-[9px] block">{text.medicalContacts}</span>
                <span className="text-sm font-black text-[#111827]">+91-98765-43210</span>
              </div>
            </div>

            {/* Responder QR Generator placeholder */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3 border rounded bg-slate-50 text-center space-y-2">
              <div className="w-24 h-24 bg-white border flex items-center justify-center font-bold text-[10px] text-[#6B7280]">
                {/* Visual QR mock */}
                <div className="w-20 h-20 bg-slate-900 flex flex-wrap p-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={cn("w-5 h-5 border-[1px] border-white", (i % 3 === 0 || i % 5 === 0) ? "bg-white" : "bg-black")}></div>
                  ))}
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wide text-slate-800">
                {text.offlineQR}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 9: QUICK VISUAL SAFETY GUIDES (DO / DO NOT) */}
        <div className="space-y-3">
          <div>
            <h3 className="text-md font-black text-slate-900 uppercase tracking-wide">
              {text.safetyTitle}
            </h3>
            <span className="text-xs text-[#6B7280] font-medium">{text.safetySub}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SAFETY_GUIDES_DATA.map((guide) => (
              <div key={guide.id} className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex flex-col justify-between space-y-3 shadow-sm">
                <div className="border-b pb-1.5 flex items-center justify-between">
                  <h4 className="font-black text-xs text-[#111827] uppercase">
                    {lang === 'hi' ? guide.titleHi : lang === 'mr' ? guide.titleMr : guide.title}
                  </h4>
                  <span className="text-[8px] font-bold text-red-600 bg-red-50 border border-red-200 px-1 rounded uppercase">
                    Hotline: {guide.hotline}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {/* DO COLUMN */}
                  <div className="space-y-1.5 border-r pr-2">
                    <span className="text-emerald-700 font-black block border-b pb-0.5 uppercase tracking-wide">
                      ✅ {text.guideDo}
                    </span>
                    <ul className="space-y-1 text-slate-800 font-bold list-none">
                      {guide.dos.map((d, i) => (
                        <li key={i} className="leading-tight">• {d}</li>
                      ))}
                    </ul>
                  </div>

                  {/* DO NOT COLUMN */}
                  <div className="space-y-1.5 pl-1">
                    <span className="text-red-700 font-black block border-b pb-0.5 uppercase tracking-wide">
                      ❌ {text.guideDoNot}
                    </span>
                    <ul className="space-y-1 text-slate-800 font-bold list-none">
                      {guide.donts.map((d, i) => (
                        <li key={i} className="leading-tight">• {d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 14: COMMAND CENTER STATUS & ADMINISTRATIVE INTEGRATION PLACEHOLDERS */}
        <div className="bg-slate-950 text-white rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-500">
              🛡️ {text.ccTitle}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Updated: Real-time telemetry feed</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-bold text-slate-300">
            <div className="p-2 bg-white/5 rounded border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>{text.ccControlRoom}</span>
            </div>
            <div className="p-2 bg-white/5 rounded border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>{text.ccMedicalActive}</span>
            </div>
            <div className="p-2 bg-white/5 rounded border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>{text.ccPoliceActive}</span>
            </div>
            <div className="p-2 bg-white/5 rounded border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>{text.ccNetworkStatus}</span>
            </div>
          </div>

          {/* PLACEHOLDERS FOR ADMINISTRATIVE INTEGRATIONS (future control portals) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[8px] font-mono tracking-wider uppercase text-slate-500">
            <div className="p-1 border border-dashed border-slate-800 text-center">Control Room Hook [Placeholder]</div>
            <div className="p-1 border border-dashed border-slate-800 text-center">NDRF Command [Placeholder]</div>
            <div className="p-1 border border-dashed border-slate-800 text-center">SDRF Live Feed [Placeholder]</div>
            <div className="p-1 border border-dashed border-slate-800 text-center">Traffic Control [Placeholder]</div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

