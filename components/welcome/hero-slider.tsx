'use client';

/**
 * @file HeroSlider component
 * @description Premium hero image slider with fade transitions, autoplay,
 * hover pause, prev/next arrows, pagination dots, touch swipe support,
 * left content layout, right thumbnail deck (3 visible thumbnails with active highlight),
 * and an animated "Explore Now" button that routes to /temples/[slug].
 *
 * All slides render dynamically from the centralized TEMPLES_DATA config.
 *
 * @accessibility
 * - Aria role="region" with label "Hero Image Slider"
 * - Keyboard navigation support (ArrowLeft, ArrowRight)
 * - Screen readers read active slide details
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { TEMPLES_DATA } from '@/constants/temples-data';
import { cn } from '@/utils/cn';
import { motionVariants, motionTransitions } from '@/lib/animations';

export function HeroSlider() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Swipe gesture tracking state
  const touchStartXRef = useRef<number | null>(null);

  const totalSlides = TEMPLES_DATA.length;

  // ---- Navigation actions ----
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleSelectSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // ---- Autoplay logic ----
  useEffect(() => {
    if (isHovered) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    } else {
      autoplayTimerRef.current = setInterval(handleNext, 6000);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [isHovered, handleNext]);

  // ---- Keyboard navigation ----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // ---- Touch Swipe Support ----
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    // Minimum swipe threshold (50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  // ---- Navigation to details page ----
  const handleExplore = useCallback((slug: string) => {
    router.push(`/temples/${slug}`);
  }, [router]);

  // Active slide item
  const activeSlide = TEMPLES_DATA[currentIndex];

  // Helper to get 3 thumbnails (active, active+1, active+2)
  const getThumbnailSlides = () => {
    const indices = [
      currentIndex,
      (currentIndex + 1) % totalSlides,
      (currentIndex + 2) % totalSlides,
    ];
    return indices.map((idx) => ({
      slide: TEMPLES_DATA[idx],
      index: idx,
    }));
  };

  return (
    <section
      role="region"
      aria-label="Nashik Temples Hero Slider"
      className="relative w-full h-[90vh] min-h-[600px] flex flex-col justify-between overflow-hidden select-none bg-[#FAFBFC]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ---- Background Fade Slides ---- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.slug}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Ambient image placeholder overlay with rich color overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30 z-10" />
            
            {/* Background image style with absolute fallback gradient */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700"
              style={{
                backgroundImage: `linear-gradient(135deg, #F5F7FA 0%, #FAFBFC 100%)`
              }}
            >
              <Image
                src={activeSlide.heroImage}
                alt={activeSlide.name}
                fill
                priority={currentIndex === 0}
                className="object-cover object-center transition-all duration-700"
                sizes="100vw"
                quality={85}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- Left Navigation Arrow ---- */}
      <button
        onClick={handlePrev}
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 z-20',
          'w-12 h-12 rounded-full',
          'flex items-center justify-center',
          'bg-white hover:bg-[#F5F7FA]',
          'text-[#6B7280] hover:text-[#111827]',
          'border border-[#E5E7EB]',
          'shadow-sm',
          'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005BAC]'
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      {/* ---- Right Navigation Arrow ---- */}
      <button
        onClick={handleNext}
        className={cn(
          'absolute right-4 top-1/2 -translate-y-1/2 z-20',
          'w-12 h-12 rounded-full',
          'flex items-center justify-center',
          'bg-white hover:bg-[#F5F7FA]',
          'text-[#6B7280] hover:text-[#111827]',
          'border border-[#E5E7EB]',
          'shadow-sm',
          'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005BAC]'
        )}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* ---- Content Layout Grid ---- */}
      <div className="relative z-10 w-full max-w-[1440px] h-full mx-auto px-6 sm:px-12 md:px-16 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: Active Slide Details */}
          <div className="lg:col-span-10 flex flex-col justify-center space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.slug}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                transition={motionTransitions.moderate}
                className="space-y-4"
              >
                {/* Active Tagline */}
                <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#005BAC] bg-[#005BAC]/10 px-3.5 py-1.5 rounded-full border border-[#005BAC]/20 inline-block">
                  {activeSlide.tagline}
                </span>

                {/* Active Place Name */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-[var(--font-heading)] leading-none text-[#111827]">
                  {activeSlide.name}
                </h1>

                {/* Short introduction (2-3 lines) */}
                <p className="text-base sm:text-lg text-[#374151] max-w-xl leading-relaxed">
                  {activeSlide.shortDescription}
                </p>
              </motion.div>
            </AnimatePresence>
 
            {/* Explore CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => handleExplore(activeSlide.slug)}
                className={cn(
                  'inline-flex items-center gap-2',
                  'px-8 py-4 rounded-xl',
                  'text-sm font-bold tracking-wider uppercase',
                  'bg-[#005BAC] hover:bg-[#0F4C81] text-white',
                  'shadow-sm hover:shadow',
                  'hover:-translate-y-0.5 active:scale-[0.98]',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005BAC]'
                )}
              >
                <Compass size={18} className="animate-spin-slow" />
                <span>Explore Now</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ---- Pagination Dots & Slide Number Indicator ---- */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 pb-8 flex items-center justify-between">
        
        {/* Pagination Dots */}
        <div className="flex gap-2">
          {TEMPLES_DATA.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSelectSlide(index)}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 bg-[#005BAC]'
                  : 'w-2.5 bg-[#E5E7EB] hover:bg-[#6B7280]/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-sm font-semibold tracking-widest text-[#6B7280]">
          <span className="text-[#111827]">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="mx-1">/</span>
          <span>{String(totalSlides).padStart(2, '0')}</span>
        </div>

      </div>

      {/* Ambient slider animation timing speed */}
      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

export default HeroSlider;
