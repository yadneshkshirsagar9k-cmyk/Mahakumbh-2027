'use client';

/**
 * @file RegistrationOverview component
 * @description Official Government Process Timeline/Stepper for the Nashik Mahakumbh.
 * Redesigned to be a clean, minimal, trustworthy, and highly accessible stepper workflow.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Smartphone, 
  FileText, 
  Heart, 
  Home, 
  Car, 
  QrCode, 
  MapPin, 
  CheckCircle,
  Play,
  ShieldCheck,
  Info,
  X
} from 'lucide-react';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';
import { cn } from '@/utils/cn';

export interface RegistrationStep {
  step: number;
  title: string;
  description: string;
  details: string;
  icon: React.ReactNode;
  isProtected: boolean;
  featureName: string;
  actualUrl: string;
}

const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    step: 1,
    title: 'Create Account',
    description: 'Register with basic personal details and email identifier.',
    details: 'Fill in your primary credentials on the official portal. This registers your identity key in the central database.',
    icon: <UserPlus size={18} />,
    isProtected: false,
    featureName: 'Registration',
    actualUrl: '/auth/register'
  },
  {
    step: 2,
    title: 'Verify Mobile',
    description: 'Authenticate your identity using SMS OTP.',
    details: 'Verify your phone via a 6-digit OTP code to enable secure mobile transactions, SMS passes, and broadcast alerts.',
    icon: <Smartphone size={18} />,
    isProtected: false,
    featureName: 'SMS Verification',
    actualUrl: '/auth/register'
  },
  {
    step: 3,
    title: 'Complete Profile',
    description: 'Provide details like Aadhaar/ID and address verification.',
    details: 'Complete your profile details. Uploading a valid national ID card ensures verified pass generation.',
    icon: <FileText size={18} />,
    isProtected: false,
    featureName: 'Profile Update',
    actualUrl: '/account/profile'
  },
  {
    step: 4,
    title: 'Health Advisory',
    description: 'Review safety guidelines and health advisories.',
    details: 'Read the official Swasthya Yatra health advisory document to learn about medical zones, medical safety checklists, and health helpline contacts.',
    icon: <Heart size={18} />,
    isProtected: false,
    featureName: 'Health Advisory',
    actualUrl: '/health-registration'
  },
  
  { step: 5,
    title: 'Smart QR Pass',
    description: 'Generate your digital passport to pass checkpoints.',
    details: 'Receive your encrypted, high-fidelity secure QR Pass on mobile for checkpoint scanning across Nashik.',
    icon: <QrCode size={18} />,
    isProtected: true,
    featureName: 'Smart QR Pass',
    actualUrl: '/account/dashboard'
  },
  {
    step: 7,
    title: 'Arrival Check',
    description: 'Scan QR at city entry checkpoints on arrival.',
    details: 'Upon reaching the outer checkpoints, administrators scan your QR pass to update city crowd density metrics in real-time.',
    icon: <MapPin size={18} />,
    isProtected: false,
    featureName: 'Arrival Verification',
    actualUrl: '/account/dashboard'
  },
  {
    step: 8,
    title: 'Complete Darshan',
    description: 'Proceed to ghats and temples for holy rituals.',
    details: 'Follow real-time route instructions to enjoy a smooth, peaceful, and auspicious Darshan experience at the temples.',
    icon: <CheckCircle size={18} />,
    isProtected: false,
    featureName: 'Darshan',
    actualUrl: '/account/smart-darshan'
  }
];

export function RegistrationOverview() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const currentStepData = REGISTRATION_STEPS.find(s => s.step === activeStep) || REGISTRATION_STEPS[0];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#005BAC] bg-[#005BAC]/10 px-3 py-1 rounded-md border border-[#005BAC]/20 inline-block">
            Information Guide
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] font-[var(--font-heading)]">
            Using the Smart Mahakumbh Portal
          </h2>
          <p className="text-sm sm:text-base text-[#374151] max-w-2xl mx-auto leading-relaxed">
            Follow the official digital onboarding timeline below to register and obtain your mandatory Smart QR credentials.
          </p>
        </div>

        {/* GOVERNMENT PROCESS TIMELINE (Stepper Track) */}
        <div className="relative p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-x-auto scrollbar-none">
          <div className="min-w-[800px] flex items-center justify-between relative px-4">
            
            {/* Background Line Connector */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-[#E5E7EB] -translate-y-1/2 z-0" />
            
            {/* Active Progress Overlay */}
            <div 
              className="absolute top-1/2 left-8 h-1 bg-[#005BAC] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((activeStep - 1) / (REGISTRATION_STEPS.length - 1)) * 94}%` }}
            />

            {REGISTRATION_STEPS.map((stepItem) => {
              const isSelected = stepItem.step === activeStep;
              const isCompleted = stepItem.step < activeStep;

              return (
                <button
                  key={stepItem.step}
                  onClick={() => setActiveStep(stepItem.step)}
                  className="flex flex-col items-center relative z-10 focus:outline-none group"
                >
                  {/* Circular Step Node */}
                  <div 
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                      isSelected 
                        ? 'bg-[#005BAC] border-[#005BAC] text-white shadow-sm scale-110'
                        : isCompleted
                        ? 'bg-[#0F4C81] border-[#0F4C81] text-white'
                        : 'bg-white border-[#E5E7EB] text-[#005BAC] hover:border-[#005BAC]/50'
                    )}
                  >
                    {stepItem.icon}
                  </div>

                  {/* Step Metadata labels */}
                  <span className={cn(
                    'text-[10px] font-bold mt-2 tracking-wide uppercase',
                    isSelected ? 'text-[#005BAC]' : 'text-[#6B7280] group-hover:text-[#005BAC]'
                  )}>
                    Step 0{stepItem.step}
                  </span>
                  <span className={cn(
                    'text-[10px] font-extrabold max-w-[80px] text-center truncate mt-0.5',
                    isSelected ? 'text-[#111827]' : 'text-[#6B7280] group-hover:text-[#374151]'
                  )}>
                    {stepItem.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP DETAILS & VIDEO CONTAINER (2-column layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: Dynamic Instruction Panel */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#005BAC] tracking-widest">
                    Step {currentStepData.step} of 9
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#111827] font-[var(--font-heading)]">
                    {currentStepData.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#005BAC]/10 text-[#005BAC] flex items-center justify-center">
                  {currentStepData.icon}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#374151] leading-relaxed font-semibold">
                {currentStepData.description}
              </p>

              {/* In-depth instructions */}
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {currentStepData.details}
              </p>

              {/* Information Row */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-[#F5F7FA] border border-[#E5E7EB] text-xs mt-6">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-[#6B7280]">Security Level</span>
                  {currentStepData.isProtected ? (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-bold mt-1">
                      <ShieldCheck size={12} /> Restricted Access
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold mt-1">
                      <ShieldCheck size={12} /> Public Access
                    </span>
                  )}
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-[#6B7280]">Task Scope</span>
                  <span className="font-bold text-[#111827] mt-1 block">
                    {currentStepData.featureName}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Side: Video User Walkthrough Card */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111827] font-[var(--font-heading)] flex items-center gap-2">
                <Info size={16} className="text-[#005BAC]" />
                <span>Onboarding Video Guide</span>
              </h3>

               <div 
                className="relative w-full aspect-video rounded-lg overflow-hidden flex flex-col justify-end p-5 cursor-pointer group bg-stone-900 border border-[#E5E7EB]"
                onClick={() => {
                  setVideoError(false);
                  setVideoModalOpen(true);
                }}
              >
                {/* YouTube Thumbnail Background */}
                <img 
                  src="https://img.youtube.com/vi/c_QMcLKFPjY/maxresdefault.jpg" 
                  alt="Onboarding walkthrough guide video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-all duration-300 z-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://img.youtube.com/vi/c_QMcLKFPjY/hqdefault.jpg";
                  }}
                />

                {/* Dark Gradient Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/30 to-transparent z-10"></div>

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-12 h-12 rounded-full bg-[#005BAC] hover:bg-[#0F4C81] flex items-center justify-center transition-all duration-200 transform group-hover:scale-110 text-white shadow-lg border-2 border-white/20">
                    <Play size={20} className="ml-0.5 fill-current" />
                  </div>
                </div>
                
                <div className="relative z-20 text-white space-y-0.5">
                  <span className="block text-[9px] text-[#FF9933] font-bold uppercase tracking-widest">Walkthrough</span>
                  <span className="block text-xs font-black text-white truncate drop-shadow-sm">How to register and log in</span>
                </div>
              </div>
              
              <p className="text-xs text-[#6B7280] leading-relaxed">
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-[10px] text-[#6B7280] font-bold uppercase">
              <span>{GOVERNMENT_PORTAL_ENABLED ? 'Mahakumbh 2026 Admin' : 'Mahakumbh 2027 Committee'}</span>
              <span>Official Media compliant</span>
            </div>
          </div>

        </div>

      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[600]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#111827]/40 z-[610]"
              onClick={() => setVideoModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-[620] w-full max-w-[640px] p-6 rounded-lg bg-white border border-[#E5E7EB] shadow-sm text-center"
            >
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827] transition-colors"
                aria-label="Close video player"
              >
                <X size={20} />
              </button>

              <h4 className="text-base font-bold text-[#111827] mb-4">
                Mahakumbh Onboarding Walkthrough Guide
              </h4>
              
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center border border-[#E5E7EB] relative">
                <iframe 
                  src="https://www.youtube.com/embed/c_QMcLKFPjY?autoplay=1" 
                  title="Mahakumbh Onboarding Walkthrough Guide" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default RegistrationOverview;
