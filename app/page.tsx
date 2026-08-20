'use client';

/**
 * @file Home Page Component
 * @description Nashik Mahakumbh Home Page entry point. Renders the premium navbar,
 * hero image slider, live announcements, registration overview guides,
 * physical registration network locator maps, explore Maharashtra interactive showcase,
 * welcome popup, and footer.
 */

import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSlider } from '@/components/welcome/hero-slider';
import { LiveAnnouncements } from '@/components/welcome/live-announcements';
import { RegistrationOverview } from '@/components/welcome/registration-overview';
import { useWelcomePopup } from '@/hooks/use-welcome-popup';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

const RegistrationNetwork = dynamic(() => import('@/components/welcome/registration-network'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex flex-col items-center justify-center gap-3 bg-white border border-[#E5E7EB] rounded-2xl animate-pulse">
      <div className="w-8 h-8 border-4 border-gov-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-semibold text-gray-500">Loading GIS Engine...</span>
    </div>
  )
});

const ExploreMaharashtra = dynamic(() => import('@/components/welcome/explore-maharashtra'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex flex-col items-center justify-center gap-3 bg-[#011D40] border border-white/10 rounded-2xl animate-pulse">
      <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-semibold text-stone-400">Loading Interactive Map...</span>
    </div>
  )
});

const WelcomePopup = dynamic(() => import('@/components/welcome/welcome-popup'), {
  ssr: false,
});

export default function Home() {
  const { isOpen, close, reopen } = useWelcomePopup();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFAF8] dark:bg-[#0A1621]">
      {/* Premium Sticky Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pt-[80px]">
        {/* Fullscreen Premium Hero Image Slider */}
        <HeroSlider />

        {/* Live Announcements Tickers (Official updates & Weather alerts) */}
        <LiveAnnouncements />

        {/* Portal Registration & Interactive Workflow Steps Overview */}
        <RegistrationOverview />

        {/* Physical Registration Network Map Locator */}
        <RegistrationNetwork />

        {/* Explore Maharashtra Interactive District Showcase */}
        <ExploreMaharashtra />
      </main>

      {/* Premium Government Footer */}
      <Footer />

      {/* Floating Action Button for CM's Welcome Address */}
      {GOVERNMENT_PORTAL_ENABLED && (
        <div className="fixed bottom-6 right-24 z-[100]">
          <button
            onClick={reopen}
            className={cn(
              'inline-flex items-center gap-2',
              'px-5 py-3 rounded-full',
              'text-sm font-semibold tracking-wide',
              'bg-gov-blue-500 hover:bg-gov-blue-600',
              'text-white border border-gold-500/20',
              'shadow-premium hover:shadow-premium-hover',
              'active:scale-95 transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2'
            )}
            aria-label="Read Chief Minister's message again"
          >
            <HelpCircle size={18} className="text-saffron-300 animate-pulse" />
            <span>CM Message</span>
          </button>
        </div>
      )}

      {/* Official Government Welcome Popup */}
      {GOVERNMENT_PORTAL_ENABLED && <WelcomePopup isOpen={isOpen} onClose={close} />}
    </div>
  );
}
