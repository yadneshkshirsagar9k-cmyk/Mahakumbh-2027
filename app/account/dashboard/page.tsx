'use client';

/**
 * @file Dashboard Page
 * @description Main dashboard showing summary status, action links, and document download previews with high contrast.
 * Organized into five clearly separated sections for visual hierarchy and readability.
 */

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useJourneyStore } from '@/store/journey-store';
import { useCredentialStore } from '@/store/credential-store';
import { CredentialStatus } from '@/types/credential.types';
import { DocumentDownloader } from '@/components/account/document-downloader';
import { RegistrationWizard } from '@/components/account/registration-wizard';
import { 
  JourneyHeaderCard, 
  VisibleJourneyTimeline, 
  JourneyReadinessScore, 
  JourneyCalendarWidget, 
  DashboardJourneyStatistics, 
  JourneyHistorySection 
} from '@/components/account/journey-widgets';
import { ClipboardList, Calendar, BookOpen, Download, HelpCircle, X, Users, MapPin, Compass, ShieldAlert, QrCode, CheckCircle2, Archive, Navigation, Waves, CarFront, Lock, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils/cn';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { journey, citizenProfile, archiveCurrentJourney } = useJourneyStore();
  const syncJourneyCredentials = useCredentialStore(state => state.syncJourneyCredentials);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (journey && citizenProfile) {
      syncJourneyCredentials(journey, citizenProfile);
    }
  }, [journey, citizenProfile, syncJourneyCredentials]);

  const isRegistering = searchParams.get('action') === 'new';
  const editId = searchParams.get('id');

  if (!user) return null;

  // Render registration wizard when triggered
  if (isRegistering || editId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-left">
          <div>
            <h1 className="text-2xl font-black text-[#111827] font-[var(--font-heading)] tracking-tight">
              Pilgrimage Registration
            </h1>
            <p className="text-xs font-bold text-[#6B7280]">
              Apply for official permits, manage circuits, and coordinates.
            </p>
          </div>
          <button
            onClick={() => router.push('/account/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] hover:bg-[#F5F7FA] hover:text-[#005BAC] rounded text-xs font-bold transition-all text-[#374151] cursor-pointer bg-white"
          >
            <X size={14} />
            <span>Exit Wizard</span>
          </button>
        </div>

        <RegistrationWizard
          editTourId={editId}
          onClose={() => router.push('/account/dashboard')}
        />
      </div>
    );
  }

  // Action Cards mapping
  const featureCards = [
    {
      title: 'Manage Journey',
      description: 'View currently booked destinations, verify status approvals, or modify upcoming travel details.',
      icon: Calendar,
      color: 'text-[#0F4C81] bg-[#F5F7FA] border border-[#E5E7EB]',
      action: () => router.push('/account/manage-tour'),
      requiresPipelineComplete: false,
    },
    {
      title: 'Manage Pilgrims',
      description: 'Add family members or accompanying pilgrims to your registered Mahakumbh journey.',
      icon: Users,
      color: 'text-[#005BAC] bg-[#F5F7FA] border border-[#E5E7EB]',
      action: () => router.push('/account/manage-pilgrims'),
      requiresPipelineComplete: false,
    },
    {
      title: 'Vehicle Registration',
      description: 'Register your vehicle details to get officially allocated checkpost entry passes.',
      icon: CarFront,
      color: 'text-[#0F4C81] bg-[#F5F7FA] border border-[#E5E7EB]',
      action: () => router.push('/bookings/vehicle'),
      requiresPipelineComplete: false,
    },
    {
      title: 'Smart Snan Booking',
      description: 'Reserve highly monitored holy bathing ghat slots within the dates of your journey.',
      icon: Waves,
      color: 'text-[#005BAC] bg-[#F5F7FA] border border-[#E5E7EB]',
      action: () => router.push('/account/smart-snan'),
      requiresPipelineComplete: false,
    },
    {
      title: 'Smart Darshan Booking',
      description: 'Reserve timed queue access passes for Trimbakeshwar and other key temple shrines.',
      icon: MapPin,
      color: 'text-[#0F4C81] bg-[#F5F7FA] border border-[#E5E7EB]',
      action: () => router.push('/account/smart-darshan'),
      requiresPipelineComplete: false,
    },
    {
      title: 'AI Journey Planner',
      description: 'Automatically generate an optimized travel plan, itinerary, and crowd advisory routes.',
      icon: Compass,
      color: 'text-[#2E7D32] bg-[#F0FDF4] border border-[#DCFCE7]',
      action: () => router.push('/account/ai-journey-planner'),
      requiresPipelineComplete: true,
    },
    {
      title: 'Registration User Manual',
      description: GOVERNMENT_PORTAL_ENABLED 
        ? 'Official Government of Maharashtra guidelines, travel instructions, rules, and frequently asked questions.' 
        : 'Official Simhastha Committee guidelines, travel instructions, rules, and frequently asked questions.',
      icon: BookOpen,
      color: 'text-[#374151] bg-[#F5F7FA] border border-[#E5E7EB]',
      action: () => {
        const manualEl = document.getElementById('faq-section');
        if (manualEl) {
          manualEl.scrollIntoView({ behavior: 'smooth' });
        }
      },
      requiresPipelineComplete: false,
    },
  ];

  const handleArchive = () => {
    if (confirm('Archive this completed journey? You will be able to register a new journey, and this one will be saved in your history.')) {
      archiveCurrentJourney();
    }
  };

  const handleActionClick = (link: string) => {
    if (link.startsWith('#')) {
      const el = document.getElementById(link.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(link);
    }
  };

  // Extract upcoming Snan and Darshan
  const upcomingSnan = journey?.snanBookings && journey.snanBookings.length > 0 
    ? journey.snanBookings[0] 
    : null;

  const upcomingDarshan = journey?.darshanBookings && journey.darshanBookings.length > 0 
    ? journey.darshanBookings[0] 
    : null;

  const isPipelineComplete = useJourneyStore.getState().isPipelineComplete();
  const nextStep = useJourneyStore.getState().getPipelineStep();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl font-black text-[#111827] font-[var(--font-heading)] tracking-tight">
          Account Dashboard
        </h1>
        <p className="text-xs font-bold text-[#6B7280]">
          Monitor your active Simhastha registration status, slot passes, and notifications.
        </p>
      </div>

      {/* NO JOURNEY REGISTERED LOCKED STATE */}
      {!journey ? (
        <div className="space-y-6 text-left animate-fadeIn">
          {/* Welcome/Locked callout banner */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[10px] font-bold uppercase tracking-wide">
                <ShieldAlert size={12} className="animate-pulse" />
                <span>No Journey Found</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827] font-[var(--font-heading)] leading-tight">
                Register Your Mahakumbh Journey
              </h2>
              <p className="text-xs font-bold text-[#6B7280] max-w-xl">
                To access features like Smart Snan, Smart Darshan, AI Journey Planner, and download official credentials, you must first register your primary journey.
              </p>
            </div>
            <button
              onClick={() => router.push('/account/dashboard?action=new')}
              className="w-full md:w-auto px-8 py-3.5 bg-[#FF9933] hover:bg-[#E0852A] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-sm cursor-pointer transition-all border-none outline-none text-center shrink-0"
            >
              Start Journey Registration
            </button>
          </div>

          {/* Locked Features Grid Overlay */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-[#111827] border-l-4 border-[#005BAC] pl-2">
              Features Lock status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 opacity-60">
              {featureCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm flex gap-4 items-start cursor-not-allowed select-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-gray-500 leading-tight">
                        {card.title} (Locked)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Journey History Registry List (Enhancement 9) */}
          <JourneyHistorySection />
        </div>
      ) : (
        /* ACTIVE JOURNEY DASHBOARD UNLOCKED STATE */
        <div className="space-y-8 animate-fadeIn">
          
          {/* ==========================================================
              PRIORITY 1: Emergency Alerts (Mock for now, will connect to EventBus)
              ========================================================== */}
          {/* Placeholder for Emergency Alerts */}
          
          {/* ==========================================================
              PRIORITY 2: Journey Status Overview
              ========================================================== */}
          <section className="space-y-4">
            <JourneyHeaderCard onActionClick={handleActionClick} />
            
            {/* INCOMPLETE PIPELINE ACTION BANNER */}
            {!isPipelineComplete && nextStep && (
              <div className="bg-[#FFF5EB] border-2 border-[#FF9933] rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse-soft">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF9933] text-white rounded-full text-[10px] font-black uppercase tracking-wide">
                    <ShieldAlert size={12} />
                    <span>Action Required to Unlock Account Features</span>
                  </div>
                  <h3 className="text-xl font-black text-[#111827]">{nextStep.title}</h3>
                  <p className="text-xs font-bold text-[#6B7280] max-w-xl">
                    {nextStep.desc}
                  </p>
                </div>
                <button
                  onClick={() => router.push(nextStep.link)}
                  className="w-full md:w-auto px-8 py-3.5 bg-[#005BAC] hover:bg-[#0F4C81] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer transition-all border-none shrink-0"
                >
                  {nextStep.btnText}
                </button>
              </div>
            )}

            {/* Archive completed banner if completed */}
            {journey.journeyStatus === 'Journey Completed' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-left animate-fadeIn shadow-sm">
                <div className="space-y-0.5">
                  <p className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 size={14} className="text-emerald-600 animate-pulse" />
                    <span>This Journey is Completed!</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    You can now archive this journey history to register a new pilgrimage.
                  </p>
                </div>
                <button
                  onClick={handleArchive}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shrink-0 border-none outline-none shadow-sm"
                >
                  <Archive size={12} />
                  <span>Archive Journey</span>
                </button>
              </div>
            )}
          </section>

          {isPipelineComplete ? (
            <>
              {/* ==========================================================
                  PRIORITY 3: Family Safety (Appears only if multiple pilgrims)
                  ========================================================== */}
              {journey.pilgrims && journey.pilgrims.length > 1 && (
                <div className="bg-[#FFF5EB] border border-[#FF9933]/30 rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#FF9933] transition-all" onClick={() => router.push('/account/family')}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FF9933]/15 flex items-center justify-center text-[#FF9933]">
                      <Users size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-extrabold text-[#111827]">Family Safety & Tracking</h3>
                      <p className="text-xs text-[#6B7280] font-semibold mt-0.5">Live tracking enabled for {journey.pilgrims.length} members. Safe Radius active.</p>
                    </div>
                  </div>
                  <div className="text-[#005BAC] text-xs font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-md border border-[#E5E7EB]">
                    Open Map <ArrowRight size={14} />
                  </div>
                </div>
              )}

              {/* ==========================================================
                  PRIORITY 4: Today's Bookings (Upcoming Schedule)
                  ========================================================== */}
              <section className="space-y-4 text-left">
                <h2 className="text-base font-extrabold text-[#111827] border-l-4 border-[#005BAC] pl-2 mt-8">
                  Upcoming Bookings & Schedule
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upcoming Snan Card */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-left space-y-2 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                        <span className="text-[10px] font-black uppercase text-[#6B7280] tracking-wider flex items-center gap-1.5">
                          <Waves size={14} className="text-[#005BAC]" />
                          <span>Next Holy Snan Bath</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-250 text-[9px] font-bold uppercase">
                          Reservation Status
                        </span>
                      </div>
                      {upcomingSnan ? (
                        <div className="space-y-1 text-xs">
                          <h4 className="font-extrabold text-[#111827] text-sm">{upcomingSnan.ghatName}</h4>
                          <p className="text-[#374151] font-semibold">Scheduled Date: {upcomingSnan.date}</p>
                          <p className="text-[#374151] font-semibold">Allocated Slot: {upcomingSnan.timeSlot}</p>
                          <span className="text-[9px] font-mono font-bold text-[#005BAC] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E5E7EB] mt-1.5 inline-block">
                            Token: {upcomingSnan.bookingCode}
                          </span>
                        </div>
                      ) : (
                        <div className="py-4 text-center text-[#6B7280] space-y-1 flex flex-col items-center">
                          <p className="text-xs font-bold">No Snan Booking.</p>
                          <button
                            onClick={() => router.push('/account/smart-snan')}
                            className="mt-2 text-[10px] font-bold text-[#005BAC] hover:underline bg-[#F5F7FA] px-3 py-1.5 rounded-md"
                          >
                            Book Snan Slot &rarr;
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Upcoming Darshan Card */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-left space-y-2 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                        <span className="text-[10px] font-black uppercase text-[#6B7280] tracking-wider flex items-center gap-1.5">
                          <MapPin size={14} className="text-purple-600" />
                          <span>Next Temple Darshan</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-250 text-[9px] font-bold uppercase">
                          Access Pass
                        </span>
                      </div>
                      {upcomingDarshan ? (
                        <div className="space-y-1 text-xs">
                          <h4 className="font-extrabold text-[#111827] text-sm">{upcomingDarshan.templeName}</h4>
                          <p className="text-[#374151] font-semibold">Scheduled Date: {upcomingDarshan.date}</p>
                          <p className="text-[#374151] font-semibold">Allocated Slot: {upcomingDarshan.timeSlot}</p>
                          <span className="text-[9px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 mt-1.5 inline-block">
                            Permit: {upcomingDarshan.bookingCode}
                          </span>
                        </div>
                      ) : (
                        <div className="py-4 text-center text-[#6B7280] space-y-1 flex flex-col items-center">
                          <p className="text-xs font-bold">No Darshan Pass.</p>
                          <button
                            onClick={() => router.push('/account/smart-darshan')}
                            className="mt-2 text-[10px] font-bold text-purple-600 hover:underline bg-purple-50 px-3 py-1.5 rounded-md"
                          >
                            Book Darshan Slot &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Read-Only Calendar widget */}
                  <JourneyCalendarWidget />
                </div>
              </section>

              {/* ==========================================================
                  PRIORITY 5, 6, 7: Vehicle
                  ========================================================== */}
              <section className="space-y-4 text-left">
                <h2 className="text-base font-extrabold text-[#111827] border-l-4 border-[#005BAC] pl-2 mt-8">
                  Logistics & Travel
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {/* Vehicle */}
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-left space-y-2 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                      <span className="text-[10px] font-black uppercase text-[#6B7280] tracking-wider flex items-center gap-1.5">
                        <CarFront size={14} className="text-amber-600" />
                        <span>Vehicle Details</span>
                      </span>
                    </div>
                    {journey.vehicleInfo?.vehicleNumber ? (
                      <div className="space-y-1 text-xs py-2">
                        <h4 className="font-extrabold text-[#111827]">{journey.vehicleInfo.vehicleNumber}</h4>
                        <p className="text-[#374151] font-semibold text-[10px]">{journey.vehicleInfo.vehicleType}</p>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-[#6B7280] space-y-1 flex flex-col items-center">
                        <p className="text-xs font-bold">Not Registered.</p>
                        <button onClick={() => router.push('/bookings/vehicle')} className="mt-2 text-[10px] font-bold text-amber-600 hover:underline bg-amber-50 px-3 py-1.5 rounded-md">
                          Register &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-[#E5E7EB] p-8 text-center space-y-3 mt-8 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400">
                <Lock size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-[#111827]">Interactive Dashboard Features Locked</h3>
              <p className="text-xs text-gray-500 font-semibold max-w-sm mx-auto leading-relaxed">
                Complete all mandatory steps above (Add Pilgrims, Register Vehicle, and Book Holy Snan & Darshan Passes) to unlock your schedule, logistics details, and tracking maps.
              </p>
            </div>
          )}

          {/* ==========================================================
              PRIORITY 8: Documents
              ========================================================== */}
          {isPipelineComplete && (
            <div id="downloads" className="pt-4">
              <RecentCredentialsWidget />
            </div>
          )}
          {!isPipelineComplete && (
            <section className="space-y-4 text-left" id="downloads">
              <h2 className="text-base font-extrabold text-[#111827] border-l-4 border-[#005BAC] pl-2 mt-8">
                Official Credentials
              </h2>
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <Lock size={20} />
                </div>
                <h3 className="text-sm font-black text-gray-700">Documents Locked</h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  Complete all mandatory steps in your journey pipeline to unlock and download your official credentials.
                </p>
              </div>
            </section>
          )}

          {/* ==========================================================
              PRIORITY 9: Notifications
              ========================================================== */}
          <section className="space-y-4 text-left mt-8">
            <div className="flex justify-between items-end border-b border-gray-200 pb-2">
              <h2 className="text-base font-extrabold text-[#111827] border-l-4 border-[#005BAC] pl-2">
                Recent Notifications
              </h2>
              <button onClick={() => router.push('/account/notifications')} className="text-[10px] font-bold text-[#005BAC] hover:underline">
                View All &rarr;
              </button>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm text-center text-xs text-gray-500 font-bold">
              No new notifications.
            </div>
          </section>

          {/* ==========================================================
              PRIORITY 10: Operational Quick Actions & AI Planner
              ========================================================== */}
          <section className="space-y-4 text-left pt-4">
            <h2 className="text-base font-extrabold text-[#111827] border-l-4 border-[#005BAC] pl-2">
              Operational Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {featureCards.map((card, idx) => {
                const Icon = card.icon;
                const isLocked = card.requiresPipelineComplete && !isPipelineComplete;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isLocked) {
                        alert('This feature is locked. Please complete your master journey pipeline first.');
                      } else {
                        card.action();
                      }
                    }}
                    className={cn(
                      'border rounded-xl p-4.5 shadow-sm flex gap-3.5 items-start select-none transition-all duration-200',
                      isLocked 
                        ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-75' 
                        : 'bg-white border-[#E5E7EB] cursor-pointer hover:border-[#005BAC] hover:shadow-md hover:-translate-y-0.5'
                    )}
                  >
                    <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', isLocked ? 'bg-gray-200 text-gray-400' : card.color)}>
                      {isLocked ? <Lock size={14} /> : <Icon size={16} />}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className={cn('text-xs font-black transition-colors leading-tight', isLocked ? 'text-gray-500' : 'text-[#111827]')}>
                        {card.title} {isLocked && '(Locked)'}
                      </h3>
                      <p className={cn('text-[10.5px] leading-relaxed font-semibold', isLocked ? 'text-gray-400' : 'text-[#374151]')}>
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==========================================================
              EXTRA: Journey Intelligence (Informative insights)
              ========================================================== */}
          <section className="space-y-4 text-left">
            <h2 className="text-base font-extrabold text-[#111827] border-l-4 border-[#005BAC] pl-2 mt-8">
              Journey Intelligence & Live Insights
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              <div className="space-y-4">
                <DashboardJourneyStatistics />
                <JourneyReadinessScore />
              </div>
              <div className="space-y-4">
                <JourneyHistorySection />
              </div>
            </div>
          </section>

        </div>
      )}

      {/* FAQ Guide Section */}
      <CollapsibleSection title="Registration User Manual & Guidance FAQs" icon={<HelpCircle size={16} className="text-[#005BAC]" />} defaultOpen={false} badge="5 FAQs">
        <div id="faq-section" className="space-y-4 text-left">
          {[
            {
              q: 'What is the required Journey Pipeline sequence?',
              a: 'You must strictly follow these steps to generate your final entry passes: 1) Register your Journey, 2) Add accompanying Pilgrims, 3) Register your Vehicle details, 4) Book your Smart Snan slot, and 5) Reserve your Smart Darshan passes.',
            },
            {
              q: 'How do I download my digital QR Gatepass?',
              a: 'Your Official Credentials and QR Gatepasses will remain locked until your Journey Pipeline is 100% complete. Once all mandatory steps are finished, scroll up to the "Official Credentials" section to securely download your documents.',
            },
            {
              q: 'Is vehicle registration mandatory for everyone?',
              a: 'Yes, regardless of your mode of transport, you must complete the Vehicle Registration step in the pipeline. If you are not arriving by a private vehicle, select your arrival mode so the administration can track arrival volumes effectively.',
            },
            {
              q: 'Can I add or remove family members after submission?',
              a: 'Yes, navigate to the "Manage Pilgrims" page in your Quick Actions. You can update member details anytime before your arrival date to ensure your group roster is accurate.',
            },
            {
              q: 'What should I do in case of a medical emergency?',
              a: 'Immediately dial the emergency assistance number 112, or click the "Emergency (SOS)" tab in the sidebar. Your precise location and medical profile will be securely transmitted to on-ground medical teams.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="space-y-1 bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
              <h4 className="text-xs font-black text-[#111827] flex gap-2"><span className="text-[#005BAC]">Q:</span> {faq.q}</h4>
              <p className="text-xs text-[#374151] pl-5 leading-relaxed font-semibold">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}



function RecentCredentialsWidget() {
  const citizenProfile = useJourneyStore(state => state.citizenProfile);
  const getMyDocumentsSummary = useCredentialStore(state => state.getMyDocumentsSummary);
  const router = useRouter();

  if (!citizenProfile) return null;
  
  const documents = getMyDocumentsSummary(citizenProfile.citizenId || '').slice(0, 3); // Get 3 most recent

  return (
    <section className="space-y-4 text-left">
      <div className="flex justify-between items-end border-b border-gray-100 pb-2">
        <h2 className="text-base font-extrabold text-[#111827] border-l-4 border-[#005BAC] pl-2">
          Recent Official Credentials
        </h2>
        <button 
          onClick={() => router.push('/account/documents')}
          className="text-[10px] font-bold text-[#005BAC] hover:underline"
        >
          View All Documents &rarr;
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center shadow-sm">
          <p className="text-xs text-gray-500 font-bold">No official credentials generated yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.documentNumber} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:border-[#0F4C81] transition-all cursor-pointer" onClick={() => router.push('/account/documents')}>
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">{doc.credentialType.replace(/_/g, ' ')}</div>
              <div className="font-mono text-xs font-bold text-[#0F4C81] mb-2">{doc.documentNumber}</div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className={doc.status === CredentialStatus.ACTIVE ? 'text-green-600' : 'text-gray-600'}>{doc.status}</span>
                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{doc.version}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
