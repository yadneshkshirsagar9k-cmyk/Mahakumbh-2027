'use client';

/**
 * @file journey-widgets.tsx
 * @description Highly styled Government portal components for visible timelines, calendars, readiness scores, statistics, and history.
 */

import { useJourneyStore, Journey, SnanBooking, DarshanBooking } from '@/store/journey-store';
import { Calendar as CalendarIcon, Users, Waves, MapPin, ClipboardCheck, QrCode, AlertCircle, FileText, CheckCircle2, Archive, ArrowRight, ShieldAlert, Sparkles, Navigation, Info, Check, Clock, ShieldCheck, Bus, ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { StatusBadge } from './status-badge';

export function JourneyHeaderCard({ onActionClick }: { onActionClick?: (link: string) => void }) {
  const { journey } = useJourneyStore();

  if (!journey) return null;

  // Calculate score dynamically
  let readiness = 50; 
  if (journey.pilgrims.length > 0) readiness += 20;
  if (journey.vehicleInfo && journey.vehicleInfo.vehicleNumber) readiness += 10;
  if (journey.emergencyContacts) readiness += 10;
  const hasMedicalFilled = journey.pilgrims.every(p => p.bloodGroup);
  if (hasMedicalFilled && journey.pilgrims.length > 0) readiness += 10;

  const getNextStep = () => {
    const pipelineStep = useJourneyStore.getState().getPipelineStep();
    if (!pipelineStep) return null;
    return {
      title: pipelineStep.title,
      actionText: pipelineStep.btnText,
      link: pipelineStep.link,
      desc: pipelineStep.desc
    };
  };

  const nextStep = getNextStep();

  return (
    <div className="bg-[#005BAC] text-white rounded-xl border border-[#0F4C81] p-5 shadow-md space-y-4 text-left relative overflow-hidden animate-fadeIn">
      {/* Background Watermark/Stripe */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
        <Sparkles size={250} />
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-5 relative z-10">
        {/* Left Side: Specs */}
        <div className="space-y-2 flex-grow">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-black tracking-widest text-[#FF9933] uppercase bg-white/10 px-2 py-0.5 rounded-full border border-[#FF9933]/30">
              Simhastha Active Permit
            </span>
            <span className="text-[9px] font-bold text-white/60">
              Registered On: {journey.registeredOn || journey.registrationTimestamp.split(',')[0]}
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight">{journey.journeyName}</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-[10.5px] text-white/80 pt-1 font-sans border-t border-white/10 mt-2">
            <div>Journey ID: <span className="font-mono font-bold text-white block mt-0.5">{journey.id}</span></div>
            <div>Reg Number: <span className="font-mono font-bold text-[#FF9933] block mt-0.5">{journey.registrationNumber}</span></div>
            <div>Journey Type: <span className="font-bold text-white block mt-0.5">{journey.journeyType}</span></div>
            <div>Active Dates: <span className="font-bold text-white block mt-0.5">{journey.startDate} to {journey.endDate}</span></div>
            <div>Pilgrim Count: <span className="font-bold text-white block mt-0.5">{journey.pilgrimCount} Members</span></div>
            <div>Current Stage: <span className="font-bold text-[#FF9933] block mt-0.5">{journey.journeyStatus}</span></div>
          </div>
        </div>

        {/* Right Side: Status and Circular Indicators */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between shrink-0 gap-4 border-t lg:border-t-0 border-white/10 pt-3 lg:pt-0">
          <div className="space-y-1 w-full text-left lg:text-right">
            <span className="text-[8px] text-white/60 font-bold uppercase tracking-wider block">Clearance Status</span>
            <StatusBadge status={journey.journeyStatus.toLowerCase().replace(' ', '_') as any} />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-center">
              <span className="text-[8px] text-white/60 font-bold uppercase block mb-1">Progress</span>
              <span className="text-xs font-black text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">{journey.journeyProgress}%</span>
            </div>
            <div className="text-center">
              <span className="text-[8px] text-white/60 font-bold uppercase block mb-1">Readiness</span>
              <span className="text-xs font-black text-[#FF9933] bg-white/10 px-2 py-0.5 rounded border border-[#FF9933]/30">{readiness}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Recommended Next Step Flow (Enhancement 6) */}
      {nextStep && (
        <div className="bg-white/10 border border-white/10 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs relative z-10">
          <div className="space-y-0.5 text-left">
            <span className="text-[9px] text-[#FF9933] font-bold uppercase block">Next Recommended Step</span>
            <p className="font-bold text-white">{nextStep.title}</p>
            <p className="text-[10px] text-white/70">{nextStep.desc}</p>
          </div>
          <button
            onClick={() => onActionClick?.(nextStep.link)}
            className="px-4 py-2 bg-[#FF9933] hover:bg-[#E0852A] text-white text-[10px] font-black uppercase tracking-wider rounded border-none outline-none cursor-pointer transition-all shadow-sm w-full sm:w-auto text-center"
          >
            {nextStep.actionText}
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================================
// 2. VISIBLE JOURNEY TIMELINE (Enhancement 1)
// ==========================================================
export function VisibleJourneyTimeline() {
  const { journey } = useJourneyStore();

  if (!journey) return null;

  // 1. Calculate Government Services Progress (Logistics)
  const hasVehicle = journey.vehicleInfo && !!journey.vehicleInfo.vehicleNumber;
  let govProgress = 0;
  let govDone = false;
  let govDesc = 'Pending';
  
  if (hasVehicle) {
    govDone = true;
    govProgress = 100;
    govDesc = 'Registered';
  } else {
    govDone = false;
    govProgress = 0;
    govDesc = 'Vehicle Pending';
  }

  // 2. Calculate Spiritual Progress
  const hasSnan = journey.snanBookings && journey.snanBookings.length > 0;
  const hasDarshan = journey.darshanBookings && journey.darshanBookings.length > 0;
  let spiritProgress = 0;
  if (hasSnan && hasDarshan) spiritProgress = 100;
  else if (hasSnan || hasDarshan) spiritProgress = 50;
  const spiritDone = spiritProgress === 100;

  // 3. Ready
  const isReady = useJourneyStore.getState().isPipelineComplete();

  const steps = [
    { 
      label: 'Registration', 
      desc: 'Account Active', 
      done: true, 
      progress: 100, 
      icon: <ShieldCheck size={16} /> 
    },
    { 
      label: 'Pilgrims', 
      desc: journey.pilgrims.length > 0 ? `${journey.pilgrims.length} Added` : 'Pending', 
      done: journey.pilgrims.length > 0, 
      progress: journey.pilgrims.length > 0 ? 100 : 0, 
      icon: <Navigation size={16} /> 
    },
    { 
      label: 'Logistics', 
      desc: govDesc, 
      done: govDone, 
      progress: govProgress, 
      icon: <Bus size={16} /> 
    },
    { 
      label: 'Spiritual', 
      desc: spiritDone ? 'Booked' : (spiritProgress > 0 ? 'Partial' : 'Not Started'), 
      done: spiritDone, 
      progress: spiritProgress, 
      icon: <Sparkles size={16} /> 
    },
    { 
      label: 'Kumbh Ready', 
      desc: isReady ? 'All Set' : 'Pending', 
      done: isReady, 
      progress: isReady ? 100 : 0, 
      icon: <MapPin size={16} /> 
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#005BAC]/5 rounded-bl-[100px] z-0 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-wider">
            Master Journey Pipeline
          </h3>
          <p className="text-xs text-[#6B7280] mt-1">Real-time status of your Maha Kumbh preparations</p>
        </div>
        <div className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold border border-[#A5D6A7]">
          {Math.round((steps.reduce((acc, s) => acc + s.progress, 0) / (steps.length * 100)) * 100)}% Complete
        </div>
      </div>
      
      <div className="relative z-10 hidden sm:block">
        <div className="absolute left-0 top-[22px] w-full h-1 bg-stone-100 rounded-full" />
        <div 
          className="absolute left-0 top-[22px] h-1 bg-[#005BAC] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${(steps.filter(s => s.progress === 100).length - 1 + (steps.find(s => s.progress < 100)?.progress || 0) / 100) * (100 / (steps.length - 1))}%` }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((st, idx) => (
            <div key={st.label} className="flex flex-col items-center group w-[100px]">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 relative bg-white z-10",
                  st.done 
                    ? "border-[#2E7D32] text-[#2E7D32] shadow-sm bg-[#F0FDF4]" 
                    : st.progress > 0 
                      ? "border-[#005BAC] text-[#005BAC] shadow-md"
                      : "border-stone-200 text-stone-400"
                )}
              >
                {st.done ? <Check size={20} /> : (st.progress > 0 && st.progress < 100 ? <Clock size={20} className="animate-pulse" /> : st.icon)}
                
                {/* Progress Ring for in-progress items */}
                {st.progress > 0 && st.progress < 100 && (
                   <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="22" fill="none" stroke="#E5E7EB" strokeWidth="2" />
                      <circle cx="24" cy="24" r="22" fill="none" stroke="#005BAC" strokeWidth="2" strokeDasharray={`${(st.progress / 100) * 138} 138`} />
                   </svg>
                )}
              </motion.div>
              
              <div className="text-center mt-3">
                <p className={cn(
                  "text-[11px] font-bold uppercase tracking-wide",
                  st.done ? "text-[#111827]" : (st.progress > 0 ? "text-[#005BAC]" : "text-stone-400")
                )}>
                  {st.label}
                </p>
                <p className="text-[10px] text-stone-500 font-medium mt-0.5">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden space-y-4">
         {steps.map((st, idx) => (
            <div key={st.label} className="flex items-center gap-4 bg-stone-50 p-3 rounded-lg border border-stone-100">
               <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center border",
                  st.done ? "bg-[#F0FDF4] border-[#2E7D32] text-[#2E7D32]" : 
                  st.progress > 0 ? "bg-white border-[#005BAC] text-[#005BAC]" : "bg-white border-stone-200 text-stone-400"
               )}>
                  {st.done ? <Check size={18} /> : st.icon}
               </div>
               <div className="flex-1">
                  <h4 className={cn("text-xs font-bold uppercase", st.done ? "text-[#111827]" : "text-stone-500")}>{st.label}</h4>
                  <p className="text-[10px] text-stone-500">{st.desc}</p>
                  
                  <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
                     <div 
                        className={cn("h-full rounded-full transition-all duration-500", st.done ? "bg-[#2E7D32]" : "bg-[#005BAC]")}
                        style={{ width: `${st.progress}%` }}
                     />
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

// ==========================================================
// 3. JOURNEY READINESS SCORE (Enhancement 5)
// ==========================================================
export function JourneyReadinessScore() {
  const { journey } = useJourneyStore();

  if (!journey) return null;

  // Calculate score dynamically
  let score = 0; 
  const missingMandatory: string[] = [];
  const missingOptional: string[] = [];

  // Mandatory fields check
  if (journey.registrationNumber) score += 20;
  else missingMandatory.push('Complete Journey Registration');

  if (journey.pilgrims && journey.pilgrims.length > 0) score += 20;
  else missingMandatory.push('Add At Least One Pilgrim');

  if (journey.vehicleInfo && journey.vehicleInfo.vehicleNumber) {
    score += 20;
  } else {
    missingMandatory.push('Register Vehicle Details');
  }

  if (journey.snanBookings && journey.snanBookings.length > 0) {
    score += 20;
  } else {
    missingMandatory.push('Book Smart Snan Slot');
  }

  if (journey.darshanBookings && journey.darshanBookings.length > 0) {
    score += 20;
  } else {
    missingMandatory.push('Book Smart Darshan Slot');
  }
  
  // Optional: Accommodation
  if (!journey.accommodation?.name) {
    missingOptional.push('Accommodation Details Missing');
  }

  // Optional: Medical flags / Blood Group
  const hasMedicalFilled = journey.pilgrims.length > 0 && journey.pilgrims.every(p => p.bloodGroup);
  if (!hasMedicalFilled) {
    missingOptional.push('Medical / Blood Group Profile Incomplete');
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 text-left animate-fadeIn">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] border-l-4 border-[#005BAC] pl-2">
        Journey Readiness Audit
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6 justify-between pt-1">
        {/* Circle score chart */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full border-4 border-gray-100 flex flex-col items-center justify-center shrink-0">
            <span className="text-lg font-black text-[#005BAC]">{score}%</span>
            <span className="text-[8px] font-black uppercase text-[#6B7280]">Ready</span>
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle 
                cx="40" cy="40" r="36" 
                fill="none" 
                stroke="#FF9933" 
                strokeWidth="4" 
                strokeDasharray={`${2 * Math.PI * 36}`} 
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - score / 100)}`} 
                className="transition-all duration-550"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-black text-[#111827]">
              {score === 100 ? 'Journey Ready for Departure' : 'Journey Permit Verification Pending'}
            </h4>
            <p className="text-[10px] text-[#6B7280] leading-relaxed">
              {score === 100 
                ? 'All required parameters are verified. You can now download your digital clearances.'
                : 'Complete missing parameters to download verified border passes and generate biometric QR clearances.'}
            </p>
          </div>
        </div>
      </div>

      {/* Audit findings lists */}
      {(missingMandatory.length > 0 || missingOptional.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E5E7EB] text-[10px] leading-relaxed font-semibold">
          {/* Mandatory audit */}
          {missingMandatory.length > 0 && (
            <div className="space-y-1.5">
              <span className="block font-black text-red-600 uppercase tracking-wide">Mandatory Parameters Check</span>
              {missingMandatory.map((m) => (
                <div key={m} className="flex items-center gap-1.5 text-red-800 bg-red-50 px-2.5 py-1 rounded border border-red-150">
                  <ShieldAlert size={12} className="text-red-600 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          )}

          {/* Optional audit */}
          {missingOptional.length > 0 && (
            <div className="space-y-1.5">
              <span className="block font-black text-[#FF9933] uppercase tracking-wide">Recommended Credentials</span>
              {missingOptional.map((o) => (
                <div key={o} className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-150">
                  <Info size={12} className="text-[#FF9933] shrink-0" />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================================
// 4. JOURNEY CALENDAR (Enhancement 6)
// ==========================================================
export function JourneyCalendarWidget() {
  const { journey } = useJourneyStore();

  if (!journey) return null;

  // Generate date list
  const getDatesInRange = (startStr: string, endStr: string) => {
    const dates = [];
    const start = new Date(startStr);
    const end = new Date(endStr);
    const current = new Date(start);

    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dates = getDatesInRange(journey.startDate, journey.endDate);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 text-left animate-fadeIn">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] border-l-4 border-[#005BAC] pl-2">
        Journey Calendar Schedule
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {dates.map((dateStr, idx) => {
          const isToday = dateStr === today;
          const isArrival = idx === 0;
          const isDeparture = idx === dates.length - 1;

          // Bookings mapping
          const snan = journey.snanBookings.find((b) => b.date === dateStr);
          const darshan = journey.darshanBookings.find((b) => b.date === dateStr);

          return (
            <div 
              key={dateStr}
              className={cn(
                "p-3.5 border rounded-xl space-y-2 text-xs transition-all relative flex flex-col justify-between min-h-[100px]",
                isToday 
                  ? "border-[#FF9933] bg-[#FFF5EB] shadow-sm"
                  : "border-[#E5E7EB] bg-[#FAFBFC]"
              )}
            >
              {/* Badge indicator */}
              <div className="flex justify-between items-center">
                <span className="font-black text-[#111827] font-mono">Day {idx + 1}</span>
                {isToday && (
                  <span className="px-2 py-0.5 rounded bg-[#FF9933] text-white text-[8px] font-black uppercase">
                    Today
                  </span>
                )}
              </div>

              <div className="text-[10px] text-stone-500 font-bold">{dateStr}</div>

              {/* Annotations */}
              <div className="space-y-1 pt-1 border-t border-[#E5E7EB] text-[9.5px]">
                {isArrival && (
                  <div className="text-[#005BAC] font-extrabold flex items-center gap-1">
                    <span>🛫</span>
                    <span>Arrival ({journey.arrivalPoint})</span>
                  </div>
                )}
                {snan && (
                  <div className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <span>🌊</span>
                    <span className="truncate">Snan: {snan.ghatName.split(' - ')[0]}</span>
                  </div>
                )}
                {darshan && (
                  <div className="text-purple-700 font-extrabold flex items-center gap-1">
                    <span>🛕</span>
                    <span className="truncate">Darshan: {darshan.templeName.split(' (')[0]}</span>
                  </div>
                )}
                {isDeparture && (
                  <div className="text-[#0F4C81] font-extrabold flex items-center gap-1">
                    <span>🏁</span>
                    <span>Departure</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================================
// 5. DASHBOARD JOURNEY STATISTICS (Enhancement 12)
// ==========================================================
export function DashboardJourneyStatistics() {
  const { journey } = useJourneyStore();

  if (!journey) return null;

  // Calculate days in journey
  const diffTime = Math.abs(new Date(journey.endDate).getTime() - new Date(journey.startDate).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  let activeServicesCount = 0;
  if (journey.accommodation?.name) activeServicesCount++;
  if (journey.vehicleInfo?.vehicleType) activeServicesCount++;

  const stats = [
    { label: 'Journey Days', val: `${diffDays} Day(s)`, icon: CalendarIcon, color: 'text-[#005BAC] bg-[#F5F7FA]' },
    { label: 'Accompanying Pilgrims', val: `${journey.pilgrimCount} Member(s)`, icon: Users, color: 'text-[#FF9933] bg-[#FFF5EB]' },
    { label: 'Active Services', val: `${activeServicesCount} Booked`, icon: MapPin, color: 'text-blue-600 bg-blue-50' },
    { label: 'Ghat Snan Slots', val: `${journey.snanBookings.length} Token(s)`, icon: Waves, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Darshan Passes', val: `${journey.darshanBookings.length} Pass(es)`, icon: MapPin, color: 'text-purple-600 bg-purple-50' },
    { label: 'History Events', val: `${journey.timelineEvents?.length || 0} Event(s)`, icon: FileText, color: 'text-[#0F4C81] bg-gray-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
      {stats.map((st) => {
        const Icon = st.icon;
        return (
          <div key={st.label} className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm flex items-center gap-3.5 animate-fadeIn">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", st.color)}>
              <Icon size={16} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-[#6B7280] font-bold block uppercase tracking-wider">{st.label}</span>
              <p className="text-xs font-black text-[#111827]">{st.val}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================================
// 6. JOURNEY HISTORY & ARCHIVE LIST (Enhancement 9)
// ==========================================================
export function JourneyHistorySection() {
  const { journey, journeyHistory } = useJourneyStore();
  const [isOpen, setIsOpen] = React.useState(false);

  if ((!journeyHistory || journeyHistory.length === 0) && (!journey?.timelineEvents || journey.timelineEvents.length === 0)) return null;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm text-left animate-fadeIn">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between hover:bg-stone-50 transition-colors py-2 px-1 rounded-lg"
      >
         <h3 className="text-base font-extrabold text-[#111827] border-l-4 border-[#005BAC] pl-2 flex items-center gap-2">
            <Archive size={16} className="text-[#FF9933]" />
            <span>Archived Journey History Registry</span>
         </h3>
         {isOpen ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
      </button>

      {isOpen && (
         <div className="space-y-3 mt-4 pt-4 border-t border-stone-100">
           {(journey?.timelineEvents || []).map((evt) => (
             <div key={evt.eventId} className="p-4 border border-[#E5E7EB] rounded-xl bg-[#FAFBFC] space-y-3 text-xs leading-relaxed">
               <div className="flex flex-col sm:flex-row justify-between border-b border-[#E5E7EB] pb-2 gap-2">
                 <div className="space-y-0.5">
                   <h4 className="font-extrabold text-[#111827] text-sm">{evt.eventType}</h4>
                   <p className="text-[10px] text-stone-500 font-semibold">Event ID: <span className="font-mono font-bold text-[#005BAC]">{evt.eventId}</span> • Timestamp: <span className="font-mono font-bold text-[#FF9933]">{new Date(evt.timestamp).toLocaleString()}</span></p>
                 </div>
                 <div className="flex items-center gap-2 shrink-0">
                   <span className="px-2.5 py-0.5 rounded bg-gray-200 border border-gray-300 text-gray-600 text-[8.5px] font-bold uppercase">
                     {evt.status}
                   </span>
                 </div>
               </div>
             </div>
           ))}
           {journeyHistory.map((j) => (
             <div key={j.id} className="p-4 border border-[#E5E7EB] rounded-xl bg-[#FAFBFC] space-y-3 text-xs leading-relaxed">
               <div className="flex flex-col sm:flex-row justify-between border-b border-[#E5E7EB] pb-2 gap-2">
                 <div className="space-y-0.5">
                   <h4 className="font-extrabold text-[#111827] text-sm">{j.journeyName}</h4>
                   <p className="text-[10px] text-stone-500 font-semibold">Reg ID: <span className="font-mono font-bold text-[#005BAC]">{j.id}</span> • Reg No: <span className="font-mono font-bold text-[#FF9933]">{j.registrationNumber}</span></p>
                 </div>
                 <div className="flex items-center gap-2 shrink-0">
                   <span className="px-2.5 py-0.5 rounded bg-gray-200 border border-gray-300 text-gray-600 text-[8.5px] font-bold uppercase">
                     COMPLETED & ARCHIVED
                   </span>
                 </div>
               </div>
   
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] text-stone-600 font-medium">
                 <div>Dates: <strong className="text-[#111827] block">{j.startDate} to {j.endDate}</strong></div>
                 <div>Pilgrims: <strong className="text-[#111827] block">{j.pilgrimCount} Members</strong></div>
                 <div>Snan Bath: <strong className="text-[#2E7D32] block">{j.snanBookings.length} Booked</strong></div>
                 <div>Darshan: <strong className="text-purple-700 block">{j.darshanBookings.length} Pass(es)</strong></div>
               </div>
             </div>
           ))}
         </div>
      )}
    </div>
  );
}
