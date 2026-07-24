'use client';

/**
 * @file Reusable Temple Page Components
 * @description Premium documented components for the temple detail architecture.
 * Used exclusively inside `/temples/[slug]` routes.
 */

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  Clock,
  Car,
  Shield,
  Stethoscope,
  Info,
  CloudSun,
  MapPin,
  Compass,
  Train,
  Plane,
  Footprints,
  Bus,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

// ============================================================
// TEMPLE HERO
// ============================================================

export interface TempleHeroProps {
  title: string;
  subtitle: string;
  heroImage?: string;
  className?: string;
}

/**
 * @description Renders a large banner for the temple details header.
 * @param props - TempleHeroProps
 * @example
 * <TempleHero title="Trimbakeshwar Jyotirlinga" subtitle="Twelve Sacred Shrines" />
 * @accessibility
 * - Proper semantic heading hierarchy (H1)
 * - Contrast-compliant text overlays
 * @extension
 * - Integrates with dynamic background imagery carousel
 */
export function TempleHero({ title, subtitle, heroImage, className }: TempleHeroProps) {
  return (
    <div
      className={cn(
        'relative w-full h-[320px] md:h-[400px]',
        'flex flex-col justify-end',
        'overflow-hidden',
        className
      )}
    >
      {/* Background Image */}
      {heroImage && (
        <img
          src={heroImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
      )}

      {/* Background gradients for dark stone theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1621] via-[#0E1F33]/85 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1621] via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-[#0E1F33]/20 z-10" />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 pb-8 md:pb-12 text-white">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2 md:space-y-3"
        >
          <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#F26F21] bg-[#F26F21]/15 px-3.5 py-1 rounded-full border border-[#F26F21]/20 inline-block">
            Administrative Information
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-[var(--font-heading)] leading-none text-gold-200">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-stone-grey-300 max-w-2xl font-medium">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================
// TEMPLE FACTS
// ============================================================

export interface TempleFactsProps {
  facts: { label: string; value: string }[];
  className?: string;
}

/**
 * @description Renders a quick facts key-value pairing grid.
 * @param props - TempleFactsProps
 * @example
 * <TempleFacts facts={[{ label: 'Diety', value: 'Lord Shiva' }]} />
 * @accessibility
 * - Standard grid list structure navigable by screen readers
 */
export function TempleFacts({ facts, className }: TempleFactsProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-5 rounded-2xl',
        'bg-white dark:bg-[#011D40] border border-[#F26F21]/10 dark:border-[#D4A843]/10',
        'shadow-[0_4px_16px_rgba(0,0,0,0.02)]',
        className
      )}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-1 border-r border-[#F26F21]/10 dark:border-white/5 last:border-0 pr-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A8A] dark:text-[#B0B0B0]">
            {fact.label}
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#022B5D] dark:text-gold-300">
            {fact.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// TEMPLE INFO CARD
// ============================================================

export interface TempleInfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

/**
 * @param props - TempleInfoCardProps
 */
export function TempleInfoCard({ icon, title, description, className }: TempleInfoCardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl transition-all duration-200',
        'bg-white dark:bg-[#011D40] border border-stone-grey-100 dark:border-[#022B5D]',
        'hover:border-[#F26F21]/30 dark:hover:border-[#D4A843]/30',
        className
      )}
    >
      <div className="p-2.5 rounded-lg bg-[#F26F21]/10 dark:bg-[#D4A843]/10 text-[#F26F21] dark:text-[#D4A843]">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-[#8A8A8A] dark:text-[#B0B0B0] uppercase tracking-wider">
          {title}
        </span>
        <span className="text-sm font-semibold text-[#022B5D] dark:text-stone-grey-200">
          {description}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// TEMPLE SECTION
// ============================================================

export interface TempleSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * @description Section wrapper with consistent padding, typography, and borders.
 * @param props - TempleSectionProps
 */
export function TempleSection({ title, children, icon, className }: TempleSectionProps) {
  return (
    <section className={cn('py-8 border-b border-stone-grey-100 dark:border-white/5 last:border-0', className)}>
      <div className="flex items-center gap-3 mb-5">
        {icon && (
          <div className="p-1.5 rounded-lg bg-gov-blue-500/10 text-gov-blue-500 dark:text-gold-400">
            {icon}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#022B5D] dark:text-[#D4A843] font-[var(--font-heading)]">
          {title}
        </h2>
      </div>
      <div className="text-sm sm:text-base leading-relaxed text-[#525252] dark:text-[#B0B0B0] space-y-4">
        {children}
      </div>
    </section>
  );
}

// ============================================================
// TEMPLE WEATHER CARD
// ============================================================

export interface TempleWeatherCardProps {
  placeholder: string;
  className?: string;
}

/**
 * @description Weather info block placeholder.
 * @param props - TempleWeatherCardProps
 */
export function TempleWeatherCard({ placeholder, className }: TempleWeatherCardProps) {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl border',
        'bg-gradient-to-br from-[#FFFDF5] to-[#FAF0E1]',
        'dark:from-[#011D40] dark:to-[#0E1F33]',
        'border-[#F26F21]/15 dark:border-[#D4A843]/15',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-500/15 text-[#F26F21]">
            <CloudSun size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#8A8A8A] dark:text-[#B0B0B0] tracking-wider">
              Current Weather
            </span>
            <span className="text-sm font-bold text-[#022B5D] dark:text-gold-300">
              {placeholder}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TEMPLE NAVIGATION CARD
// ============================================================

export interface TempleNavigationCardProps {
  howToReach: {
    road: string;
    rail: string;
    air: string;
    publicTransport: string;
    walkingRoute: string;
  };
  className?: string;
}

/**
 * @description Structured transit route instructions mapping.
 * @param props - TempleNavigationCardProps
 */
export function TempleNavigationCard({ howToReach, className }: TempleNavigationCardProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-3 p-4 rounded-xl bg-white dark:bg-[#011D40] border border-stone-grey-100 dark:border-white/5">
          <Bus className="text-[#F26F21] flex-shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] dark:text-[#B0B0B0]">By Road</h4>
            <p className="text-xs sm:text-sm text-[#525252] dark:text-stone-grey-300 mt-1">{howToReach.road}</p>
          </div>
        </div>

        <div className="flex gap-3 p-4 rounded-xl bg-white dark:bg-[#011D40] border border-stone-grey-100 dark:border-white/5">
          <Train className="text-gov-blue-500 dark:text-gold-400 flex-shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] dark:text-[#B0B0B0]">By Rail</h4>
            <p className="text-xs sm:text-sm text-[#525252] dark:text-stone-grey-300 mt-1">{howToReach.rail}</p>
          </div>
        </div>

        <div className="flex gap-3 p-4 rounded-xl bg-white dark:bg-[#011D40] border border-stone-grey-100 dark:border-white/5">
          <Plane className="text-river-blue-500 flex-shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] dark:text-[#B0B0B0]">By Air</h4>
            <p className="text-xs sm:text-sm text-[#525252] dark:text-stone-grey-300 mt-1">{howToReach.air}</p>
          </div>
        </div>

        <div className="flex gap-3 p-4 rounded-xl bg-white dark:bg-[#011D40] border border-stone-grey-100 dark:border-white/5">
          <Footprints className="text-emerald-500 flex-shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] dark:text-[#B0B0B0]">Walking Route</h4>
            <p className="text-xs sm:text-sm text-[#525252] dark:text-stone-grey-300 mt-1">{howToReach.walkingRoute}</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 p-4 rounded-xl bg-[#022B5D]/5 dark:bg-[#D4A843]/5 border border-[#F26F21]/15 dark:border-[#D4A843]/15">
        <Compass className="text-[#F26F21] flex-shrink-0" size={22} />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#022B5D] dark:text-[#D4A843]">Public Shuttle / Transit</h4>
          <p className="text-xs sm:text-sm text-[#525252] dark:text-stone-grey-300 mt-1">{howToReach.publicTransport}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TEMPLE GALLERY
// ============================================================

export interface TempleGalleryProps {
  images?: string[];
  className?: string;
}

/**
 * @description Renders the thumbnail images for the gallery.
 * @param props - TempleGalleryProps
 */
export function TempleGallery({ images, className }: TempleGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className={cn(
              'aspect-[3/2] rounded-xl flex flex-col items-center justify-center gap-2 border border-dashed border-[#F26F21]/30',
              'bg-white dark:bg-[#011D40] text-[#8A8A8A] dark:text-white/30'
            )}
          >
            <ImageIcon size={28} />
            <span className="text-xs font-medium">Gallery Item #{item} Placeholder</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
      {images.map((imgUrl, idx) => (
        <div
          key={idx}
          className="aspect-[3/2] rounded-xl overflow-hidden relative group border border-stone-grey-200 shadow-sm"
        >
          <img
            src={imgUrl}
            alt={`Gallery item ${idx + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#022B5D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// TEMPLE SIDEBAR
// ============================================================

export interface TempleSidebarProps {
  timings: string;
  medical: string;
  police: string;
  helpCentre: string;
  weather: string;
  className?: string;
}

/**
 * @description Contextual administrative metadata sidebar.
 * @param props - TempleSidebarProps
 */
export function TempleSidebar({
  timings,
  medical,
  police,
  helpCentre,
  weather,
  className,
}: TempleSidebarProps) {
  return (
    <aside className={cn('space-y-6', className)}>
      {/* Weather Info */}
      <TempleWeatherCard placeholder={weather} />

      {/* Timing Card */}
      <TempleInfoCard icon={<Clock size={20} />} title="Sanctum Timings" description={timings} />

      {/* Emergency & Utilities Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#011D40] border border-stone-grey-100 dark:border-white/5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#022B5D] dark:text-[#D4A843] border-b border-stone-grey-100 dark:border-white/5 pb-2">
          Ghat & City Utilities
        </h3>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <Car size={16} className="text-[#F26F21] flex-shrink-0 mt-0.5" />
            <div>
            </div>
          </div>

          <div className="flex gap-2">
            <Stethoscope size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#8A8A8A] dark:text-[#B0B0B0] uppercase">Medical Desk</p>
              <p className="text-xs text-[#525252] dark:text-stone-grey-300">{medical}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Shield size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#8A8A8A] dark:text-[#B0B0B0] uppercase">Police Command Post</p>
              <p className="text-xs text-[#525252] dark:text-stone-grey-300">{police}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Info size={16} className="text-gov-blue-500 dark:text-gold-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#8A8A8A] dark:text-[#B0B0B0] uppercase">Pilgrim Help Desk</p>
              <p className="text-xs text-[#525252] dark:text-stone-grey-300">{helpCentre}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
