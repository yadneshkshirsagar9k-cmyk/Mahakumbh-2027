'use client';

/**
 * @file LiveAnnouncements component
 * @description Renders two separate, premium, independently scrolling marquee bars
 * representing (1) News & Official Updates, and (2) Weather Alerts & Travel Advisory.
 * Supports auto-scroll, pause on hover, and responsive layouts.
 *
 * @accessibility
 * - Aria role="log" or "marquee" with labels
 * - Readable text for screen readers
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Megaphone, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Droplet, 
  Thermometer, 
  Compass, 
  Sparkles 
} from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================================
// DATA MODELS & PLACEHOLDERS
// ============================================================

export interface Announcement {
  id: string;
  category: string;
  content: string;
  time: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface TravelAdvisory {
  id: string;
  type: 'weather' | 'traffic' | 'river' | 'festival' | 'emergency';
  content: string;
  severity: 'red' | 'amber' | 'green' | 'blue';
}

const OFFICIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    category: 'Registration',
    content: 'Smart QR Pass Registration opens tomorrow at 09:00 AM IST. Ensure mobile number is active.',
    time: '10m ago',
    priority: 'high',
  },
  {
    id: 'ann-2',
    category: 'VVIP Visit',
    content: 'Hon\'ble Chief Minister to inaugurate the newly constructed Sadhugram sector 4 shelter camp.',
    time: '1h ago',
    priority: 'medium',
  },
  {
    id: 'ann-3',
    category: 'Health Advisory',
    content: 'Free vaccination camps established at all Nashik Road entry toll booths. Keep health cards ready.',
    time: '3h ago',
    priority: 'high',
  },
  {
    id: 'ann-4',
    category: 'Darshan Slots',
    content: 'Trimbakeshwar VIP special darshan bookings are now available for the evening slots.',
    time: '5h ago',
    priority: 'low',
  },
  {
    id: 'ann-5',
    category: 'Lost & Found',
    content: 'Help desks at Sector 4 equipped with instant biometrics for lost pilgrim tracking.',
    time: '6h ago',
    priority: 'medium',
  }
];

const TRAVEL_ADVISORIES: TravelAdvisory[] = [
  {
    id: 'adv-1',
    type: 'emergency',
    content: 'CRITICAL: Crowd control diversion active near Ram Kund. Pedestrian route diverted via Ahilya Bridge.',
    severity: 'red',
  },
  {
    id: 'adv-2',
    type: 'weather',
    content: 'Advisory: Light thunderstorms predicted in Sector 4 region from 4:00 PM to 6:00 PM.',
    severity: 'amber',
  },
  {
    id: 'adv-3',
    type: 'river',
    content: 'Water Level: Godavari river levels at Ram Kund are normal. Bathing ghat safety chains active.',
    severity: 'green',
  },

  {
    id: 'adv-5',
    type: 'festival',
    content: 'Update: Evening Godavari Maha Aarti scheduled at 6:45 PM. Devotees requested to queue early.',
    severity: 'blue',
  }
];

// ============================================================
// COMPONENT
// ============================================================

export function LiveAnnouncements() {
  const [newsPaused, setNewsPaused] = useState(false);
  const [advisoryPaused, setAdvisoryPaused] = useState(false);

  // Helper to resolve priority/severity color badges
  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'red':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high':
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'medium':
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'low':
      case 'green':
      default:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    }
  };

  // Helper to render advisory icons
  const getAdvisoryIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <Thermometer size={14} />;
      case 'river':
        return <Droplet size={14} />;
      case 'traffic':
        return <Compass size={14} />;
      case 'festival':
        return <Sparkles size={14} />;
      case 'emergency':
      default:
        return <AlertTriangle size={14} />;
    }
  };

  // Duplicate items to ensure seamless infinite looping marquee
  const newsTickerItems = [...OFFICIAL_ANNOUNCEMENTS, ...OFFICIAL_ANNOUNCEMENTS, ...OFFICIAL_ANNOUNCEMENTS];
  const advisoryTickerItems = [...TRAVEL_ADVISORIES, ...TRAVEL_ADVISORIES, ...TRAVEL_ADVISORIES];

  return (
    <div className="w-full flex flex-col gap-1 bg-[#FAFBFC] py-1">
      
      {/* ---- BAR 1: News & Official Updates (Marquee) ---- */}
      <div 
        className={cn(
          'w-full h-10 relative flex items-center overflow-hidden',
          'bg-white text-[#111827]',
          'shadow-sm border-y border-[#E5E7EB]'
        )}
        onMouseEnter={() => setNewsPaused(true)}
        onMouseLeave={() => setNewsPaused(false)}
        role="log"
        aria-label="Official announcements marquee"
      >
        {/* Sticky Label */}
        <div className="absolute left-0 top-0 bottom-0 px-4 z-20 flex items-center gap-1.5 bg-[#005BAC] border-r border-[#005BAC]/20 font-bold text-xs tracking-wider uppercase text-white shadow-sm">
          <Megaphone size={14} className="animate-bounce" />
          <span className="whitespace-nowrap">Official News</span>
        </div>

        {/* Scrolling Strip */}
        <motion.div
          animate={newsPaused ? { x: undefined } : { x: ['0%', '-33.33%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 35,
            ease: 'linear',
          }}
          className="flex items-center gap-12 pl-[160px] pr-6 whitespace-nowrap"
        >
          {newsTickerItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-4 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#005BAC]" />
              {/* Category Badge */}
              <span className="px-2 py-0.5 rounded border text-[9px] uppercase font-bold tracking-wider bg-[#F5F7FA] border-[#E5E7EB] text-[#005BAC]">
                {item.category}
              </span>
              {/* Message */}
              <span className="text-[#374151]">{item.content}</span>
              {/* Time */}
              <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                <Calendar size={10} />
                {item.time}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ---- BAR 2: Weather Alerts & Travel Advisory ---- */}
      <div 
        className={cn(
          'w-full h-10 relative flex items-center overflow-hidden',
          'bg-[#F5F7FA]',
          'border-b border-[#E5E7EB]'
        )}
        onMouseEnter={() => setAdvisoryPaused(true)}
        onMouseLeave={() => setAdvisoryPaused(false)}
        role="log"
        aria-label="Weather alerts and travel advisory marquee"
      >
        {/* Sticky Label */}
        <div className="absolute left-0 top-0 bottom-0 px-4 z-20 flex items-center gap-1.5 bg-[#0F4C81] border-r border-[#E5E7EB] text-white font-bold text-xs tracking-wider uppercase shadow-sm">
          <Bell size={14} className="text-[#E5E7EB] animate-pulse" />
          <span className="whitespace-nowrap">Advisories</span>
        </div>

        {/* Scrolling Strip */}
        <motion.div
          animate={advisoryPaused ? { x: undefined } : { x: ['0%', '-33.33%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          }}
          className="flex items-center gap-12 pl-[160px] pr-6 whitespace-nowrap"
        >
          {advisoryTickerItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-4 text-xs font-semibold text-[#1F2937]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#005BAC]" />
              {/* Severity Badge */}
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] uppercase font-bold tracking-wider',
                getPriorityClasses(item.severity)
              )}>
                {getAdvisoryIcon(item.type)}
                {item.type}
              </span>
              {/* Message */}
              <span className="text-[#374151]">{item.content}</span>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}

export default LiveAnnouncements;
