'use client';

/**
 * @file HeroFoundation — Home page hero section structure
 * @description Foundation layout for the hero section. Provides the structural
 * skeleton with left content area, right carousel placeholder, and bottom explore
 * button placeholder. Glassmorphism overlay and gradient background ready.
 * 
 * NO CONTENT, NO IMAGES, NO SLIDER DATA — only structure.
 *
 * @param className - Optional additional className
 *
 * @example
 * <HeroFoundation />
 *
 * @accessibility
 * - Semantic landmark with role="banner"
 * - Proper heading hierarchy ready
 * - Keyboard navigable placeholders
 * - Reduced motion support via Framer Motion
 *
 * @extension
 * - Add hero slides data and carousel
 * - Add CTA buttons
 * - Add live crowd counter
 * - Add weather widget
 * - Add search bar
 */

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { motionVariants, motionTransitions } from '@/lib/animations';

export interface HeroFoundationProps {
  /** Additional CSS classes */
  className?: string;
}

export function HeroFoundation({ className }: HeroFoundationProps) {
  return (
    <section
      role="banner"
      aria-label="Hero section"
      className={cn(
        'relative w-full min-h-[85vh] md:min-h-[90vh]',
        'flex flex-col',
        'overflow-hidden',
        className
      )}
    >
      {/* ---- Background ---- */}
      <div
        className={cn(
          'absolute inset-0 -z-10',
          'bg-[#F5F7FA]'
        )}
        aria-hidden="true"
      />

      {/* ---- Ambient glow effects ---- */}
      <div
        className="absolute top-0 right-0 w-[60%] h-[60%] -z-[5] opacity-5 blur-[120px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(0,91,172,0.1) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ---- Content Container ---- */}
      <div
        className={cn(
          'relative flex-1 w-full max-w-[1440px] mx-auto',
          'px-4 sm:px-6 md:px-8 lg:px-12',
          'pt-16 sm:pt-20 md:pt-24 lg:pt-28',
          'pb-8 sm:pb-12 md:pb-16',
          'flex flex-col'
        )}
      >
        {/* ---- Main Hero Grid ---- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* ---- Left: Hero Content Area ---- */}
          <motion.div
            className="flex flex-col justify-center space-y-6"
            variants={motionVariants.fadeInLeft}
            initial="initial"
            animate="animate"
            transition={motionTransitions.moderate}
          >
            {/* Content placeholder */}
            <div
              className={cn(
                'rounded-2xl p-8 sm:p-10 md:p-12',
                'min-h-[300px] sm:min-h-[360px]',
                'flex flex-col justify-center',
                'bg-white',
                'border border-[#E5E7EB]',
                'shadow-sm'
              )}
              aria-label="Hero content area — coming soon"
            >
              <div className="space-y-4">
                {/* Title skeleton */}
                <div className="h-10 sm:h-12 w-[80%] rounded-lg bg-[#E5E7EB] animate-pulse" />
                <div className="h-10 sm:h-12 w-[60%] rounded-lg bg-[#E5E7EB]/80 animate-pulse" />

                {/* Subtitle skeleton */}
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-[90%] rounded bg-[#E5E7EB]/60 animate-pulse" />
                  <div className="h-4 w-[75%] rounded bg-[#E5E7EB]/40 animate-pulse" />
                </div>

                {/* CTA button skeleton */}
                <div className="mt-6 flex gap-3">
                  <div className="h-12 w-40 rounded-xl bg-[#E5E7EB] animate-pulse" />
                  <div className="h-12 w-32 rounded-xl bg-[#E5E7EB]/60 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---- Right: Carousel Placeholder ---- */}
          <motion.div
            className="flex items-center justify-center"
            variants={motionVariants.fadeInRight}
            initial="initial"
            animate="animate"
            transition={{ ...motionTransitions.moderate, delay: 0.15 }}
          >
            <div
              className={cn(
                'w-full aspect-[4/3] lg:aspect-square max-w-[540px]',
                'rounded-2xl',
                'bg-white',
                'border border-[#E5E7EB]',
                'shadow-sm',
                'flex items-center justify-center',
                'overflow-hidden'
              )}
              aria-label="Carousel area — coming soon"
            >
              {/* Carousel skeleton */}
              <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E5E7EB] animate-pulse" />
                <div className="h-4 w-32 rounded bg-[#E5E7EB]/80 animate-pulse" />
                <div className="h-3 w-24 rounded bg-[#E5E7EB]/50 animate-pulse" />

                {/* Dots indicator skeleton */}
                <div className="flex gap-2 mt-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full',
                        i === 0 ? 'bg-[#005BAC]' : 'bg-[#E5E7EB]'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---- Bottom: Explore Button Placeholder ---- */}
        <motion.div
          className="mt-8 sm:mt-12 flex justify-center"
          variants={motionVariants.fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...motionTransitions.moderate, delay: 0.3 }}
        >
          <div
            className={cn(
              'inline-flex items-center justify-center',
              'px-8 py-3 rounded-full',
              'bg-[#F5F7FA]',
              'border border-[#E5E7EB]',
              'text-[#6B7280] text-sm font-medium tracking-wider uppercase',
              'animate-pulse'
            )}
            aria-label="Explore button — coming soon"
          >
            <span className="h-4 w-28 rounded bg-[#E5E7EB]" />
          </div>
        </motion.div>
      </div>

      {/* ---- Bottom gradient fade ---- */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-24',
          'bg-gradient-to-t from-[#FAFAF8] to-transparent',
          'pointer-events-none'
        )}
        aria-hidden="true"
      />
    </section>
  );
}

export default HeroFoundation;
