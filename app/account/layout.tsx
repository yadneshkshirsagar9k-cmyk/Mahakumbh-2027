'use client';

/**
 * @file Account Layout
 * @description Master layout for pilgrim dashboard containing left profile sidebar
 * and main view panel. Seamlessly matches Government portal guidelines.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Map,
  Users,
  Compass,
  MessageSquare,
  Lock,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  X,
  MapPin,
  HeartHandshake,
  AlertTriangle,
  Info,
  Layers,
  PhoneCall,
  Globe
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/utils/cn';
import { translate } from '@/utils/translate';

import { useJourneyStore } from '@/store/journey-store';
import { Calendar } from 'lucide-react';

interface SidebarItem {
  labelKey: string;
  href: string;
  icon: any;
  requiresJourney: boolean;
  requiresPipelineComplete: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { labelKey: 'dashboard', href: '/account/dashboard', icon: LayoutDashboard, requiresJourney: false, requiresPipelineComplete: false },
  { labelKey: 'profile', href: '/account/profile', icon: User, requiresJourney: false, requiresPipelineComplete: true },
  { labelKey: 'manage_journey', href: '/account/manage-tour', icon: Calendar, requiresJourney: true, requiresPipelineComplete: true },
  { labelKey: 'manage_pilgrims', href: '/account/manage-pilgrims', icon: Users, requiresJourney: true, requiresPipelineComplete: true },
  { labelKey: 'family_tracking', href: '/account/family', icon: Map, requiresJourney: true, requiresPipelineComplete: true },
  { labelKey: 'ai_journey_planner', href: '/account/ai-journey-planner', icon: Compass, requiresJourney: true, requiresPipelineComplete: true },
  { labelKey: 'smart_darshan', href: '/account/smart-darshan', icon: MapPin, requiresJourney: true, requiresPipelineComplete: true },
  { labelKey: 'smart_snan', href: '/account/smart-snan', icon: Users, requiresJourney: true, requiresPipelineComplete: true },
  { labelKey: 'discover_maharashtra', href: '/account/discover-maharashtra', icon: Globe, requiresJourney: false, requiresPipelineComplete: true },
  { labelKey: 'tourism_explorer', href: '/account/tourism-explorer', icon: Map, requiresJourney: false, requiresPipelineComplete: true },
  { labelKey: 'feedback_grievance', href: '/account/feedback', icon: MessageSquare, requiresJourney: false, requiresPipelineComplete: true },
  { labelKey: 'emergency_sos', href: '/emergency', icon: AlertTriangle, requiresJourney: false, requiresPipelineComplete: false },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, language } = useAuthStore();
  const { journey, citizenProfile } = useJourneyStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Authenticate user and mount check
  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Handle direct navigation to locked pages
  useEffect(() => {
    if (mounted) {
      const activeItem = SIDEBAR_ITEMS.find(item => pathname === item.href);
      if (activeItem) {
        const isPipelineComplete = useJourneyStore.getState().isPipelineComplete();
        
        // Allowed direct routes for the pipeline steps so the "Next" button works
        const pipelineSteps = [
          '/account/manage-tour',
          '/account/manage-pilgrims',
          '/account/family',
          '/bookings/vehicle',
          '/account/smart-snan',
          '/account/smart-darshan'
        ];
        const isPipelineStep = pipelineSteps.includes(pathname);
        
        const isLocked = (activeItem.requiresJourney && !journey && !isPipelineStep) || 
                         (activeItem.requiresPipelineComplete && !isPipelineComplete && !isPipelineStep);
                         
        if (isLocked) {
          router.replace('/account/dashboard');
        }
      }
    }
  }, [pathname, journey, mounted, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#374151] font-semibold">Redirecting to login portal...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-[#E5E7EB] p-4 justify-between overflow-y-auto">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl p-4 text-center space-y-2.5">
          <div className="relative w-14 h-14 mx-auto rounded-full bg-[#005BAC] text-white flex items-center justify-center font-bold text-lg border-2 border-[#FF9933] overflow-hidden">
            {citizenProfile?.photo ? (
              <img src={citizenProfile.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              (citizenProfile?.fullName || user.name).charAt(0).toUpperCase()
            )}
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-sm text-[#111827] truncate">
              {citizenProfile?.fullName || user.name}
            </h4>
            <p className="text-[10px] font-bold text-[#FF9933] uppercase tracking-wide">
              {user.registrationType || 'Pilgrim'}
            </p>
          </div>
          <div className="text-[11px] text-[#374151] space-y-0.5 border-t border-[#E5E7EB] pt-2">
            <div>Mobile: <span className="font-semibold text-[#111827]">{user.phone}</span></div>
            <div>Reg ID: <span className="font-mono font-bold text-[#005BAC]">{journey?.registrationNumber || user.registrationId}</span></div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1" aria-label="Account sidebar menu">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isPipelineComplete = useJourneyStore.getState().isPipelineComplete();
            const isLocked = (item.requiresJourney && !journey) || (item.requiresPipelineComplete && !isPipelineComplete);

            // Hide Family Tracking menu item if there is only 1 pilgrim or no active journey
            if (item.href === '/account/family' && (!journey || !journey.pilgrims || journey.pilgrims.length <= 1)) {
              return null;
            }

            return (
              <button
                key={item.labelKey}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isLocked) {
                    if (item.requiresPipelineComplete && !isPipelineComplete) {
                      alert('This feature is locked. Please complete your master journey pipeline first (Create Journey, Add Pilgrims, Book Snan & Darshan).');
                    } else {
                      alert('This feature is locked. Please Register Your Mahakumbh Journey first.');
                    }
                  } else {
                    router.push(item.href);
                  }
                }}
                disabled={isLocked && isActive}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all group cursor-pointer text-left border-none bg-transparent',
                  isActive && !isLocked
                    ? 'bg-[#005BAC] text-white shadow-sm'
                    : isLocked
                    ? 'text-[#9CA3AF] cursor-not-allowed hover:bg-[#F3F4F6]'
                    : 'text-[#374151] hover:text-[#005BAC] hover:bg-[#F5F7FA]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={14} className={cn(isActive && !isLocked ? 'text-[#FF9933]' : isLocked ? 'text-[#9CA3AF]' : 'text-[#6B7280] group-hover:text-[#005BAC]')} />
                  <span>{translate(item.labelKey, language)}</span>
                </div>
                {isLocked ? (
                  <Lock size={12} className="text-[#9CA3AF] shrink-0" />
                ) : (
                  <ChevronRight size={12} className={cn('opacity-0 group-hover:opacity-100 transition-opacity', isActive && 'opacity-100')} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 transition-all select-none cursor-pointer mt-6 border-none outline-none"
      >
        <LogOut size={14} />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC] text-[#111827]">
      <Navbar />

      <div className="flex-grow pt-[80px] flex bg-[#FAFBFC]">
        {/* Sticky Sidebar Left (Desktop) */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0 h-[calc(100vh-80px)] sticky top-[80px] bg-white border-r border-[#E5E7EB]">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Trigger / Drawer */}
        <div className="lg:hidden fixed bottom-4 right-4 z-[390]">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-12 h-12 bg-[#005BAC] hover:bg-[#0F4C81] text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer border-none outline-none"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[380] top-[80px] flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <aside className="relative w-64 bg-white h-full shadow-2xl">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content Area Right */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1100px] mx-auto space-y-4 bg-[#FAFBFC]">
          {/* Lightweight Breadcrumbs */}
          {(() => {
            const parts = pathname.split('/').filter(Boolean);
            const mapping: Record<string, string> = {
              dashboard: 'Dashboard',
              'manage-tour': 'Manage Journey',
              'manage-pilgrims': 'Manage Pilgrims',
              'smart-snan': 'Smart Snan',
              'smart-darshan': 'Smart Darshan',
              'ai-journey-planner': 'AI Journey Planner',
              notifications: 'Notifications',
              profile: 'Profile',
              'change-password': 'Change Password',
              'discover-maharashtra': 'Discover Maharashtra',
              'tourism-explorer': 'Tourism Explorer',
              feedback: 'Feedback & Grievance',
            };

            if (parts.length <= 1) return null;

            const crumbs = [{ label: 'Dashboard', href: '/account/dashboard' }];
            const lastPart = parts[parts.length - 1];
            if (lastPart !== 'dashboard' && mapping[lastPart]) {
              crumbs.push({ label: mapping[lastPart], href: pathname });
            }

            return (
              <div className="flex items-center gap-1 text-[9.5px] font-black text-[#6B7280] uppercase tracking-wider select-none text-left">
                {crumbs.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    {idx > 0 && <span className="text-gray-300 font-normal">&gt;</span>}
                    <Link href={c.href} className="hover:text-[#005BAC] transition-colors">
                      {c.label}
                    </Link>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Universal Journey Context Header */}
          {journey && pathname !== '/account/dashboard' && (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-sm text-left flex flex-wrap items-center justify-between gap-4 font-sans text-xs animate-fadeIn">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div>
                  <span className="text-[9px] text-[#6B7280] font-bold uppercase block">Active Journey</span>
                  <span className="font-extrabold text-[#111827]">{journey.journeyName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#6B7280] font-bold uppercase block">Permit ID</span>
                  <span className="font-mono font-bold text-[#005BAC]">{journey.id}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#6B7280] font-bold uppercase block">Reg Number</span>
                  <span className="font-mono font-bold text-[#FF9933]">{journey.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#6B7280] font-bold uppercase block">Travel Range</span>
                  <span className="font-bold text-[#374151]">{journey.startDate} to {journey.endDate}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#6B7280] font-bold uppercase block">Pilgrims</span>
                  <span className="font-bold text-[#111827]">{journey.pilgrimCount} Members</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#6B7280] font-bold uppercase block">Stage / Status</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase bg-[#F5F7FA] text-[#005BAC] border border-[#E5E7EB]">
                      {journey.journeyStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[10px] font-bold text-[#FF9933] bg-[#FFF5EB] border border-amber-150 px-2 py-0.5 rounded">
                  Readiness: {journey.journeyProgress}%
                </span>
              </div>
            </div>
          )}

          <div className="pt-2">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
