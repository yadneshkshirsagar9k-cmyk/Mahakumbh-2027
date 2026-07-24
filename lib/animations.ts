/**
 * @file Framer Motion animation presets
 * @description Centralized animation variants and transitions for the entire
 * application. All components should use these presets instead of defining
 * custom animations. Ensures consistent, professional motion across the platform.
 *
 * @example
 * import { motionVariants, motionTransitions } from '@/lib/animations';
 * <motion.div variants={motionVariants.fadeIn} initial="initial" animate="animate" />
 *
 * @extension Add new variants here as the design system grows.
 */

import type { Variants, Transition } from 'framer-motion';
import { animationTokens } from '@/config/design-tokens';

const { duration, ease, distance, scale, stagger } = animationTokens;

// ============================================================
// MOTION VARIANTS
// ============================================================

export const motionVariants = {
  /** Fade in from transparent */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } satisfies Variants,

  /** Fade in while sliding up */
  fadeInUp: {
    initial: { opacity: 0, y: distance.md },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: distance.sm },
  } satisfies Variants,

  /** Fade in while sliding down */
  fadeInDown: {
    initial: { opacity: 0, y: -distance.md },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -distance.sm },
  } satisfies Variants,

  /** Fade in while sliding from left */
  fadeInLeft: {
    initial: { opacity: 0, x: -distance.lg },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -distance.md },
  } satisfies Variants,

  /** Fade in while sliding from right */
  fadeInRight: {
    initial: { opacity: 0, x: distance.lg },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: distance.md },
  } satisfies Variants,

  /** Scale in from slightly smaller */
  scaleIn: {
    initial: { opacity: 0, scale: scale.initial },
    animate: { opacity: 1, scale: scale.full },
    exit: { opacity: 0, scale: scale.initial },
  } satisfies Variants,

  /** Scale in with fade for modals/dialogs */
  modalIn: {
    initial: { opacity: 0, scale: 0.92, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 5 },
  } satisfies Variants,

  /** Overlay backdrop animation */
  overlayIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } satisfies Variants,

  /** Slide up from below viewport */
  slideUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  } satisfies Variants,

  /** Slide down from above viewport */
  slideDown: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  } satisfies Variants,

  /** Slide in from left */
  slideLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  } satisfies Variants,

  /** Slide in from right */
  slideRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  } satisfies Variants,

  /** Stagger container — use with child variants */
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: stagger.normal,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: stagger.fast,
        staggerDirection: -1,
      },
    },
  } satisfies Variants,

  /** Stagger child — pair with staggerContainer */
  staggerChild: {
    initial: { opacity: 0, y: distance.sm },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: distance.sm },
  } satisfies Variants,

  /** Page transition */
  pageTransition: {
    initial: { opacity: 0, y: distance.sm },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -distance.sm },
  } satisfies Variants,

  /** Hover scale effect */
  hoverScale: {
    initial: { scale: 1 },
    whileHover: { scale: scale.hover },
    whileTap: { scale: scale.pressed },
  } satisfies Variants,

  /** Expand/collapse for accordion-like components */
  collapse: {
    initial: { height: 0, opacity: 0, overflow: 'hidden' },
    animate: { height: 'auto', opacity: 1, overflow: 'hidden' },
    exit: { height: 0, opacity: 0, overflow: 'hidden' },
  } satisfies Variants,
} as const;

// ============================================================
// MOTION TRANSITIONS
// ============================================================

export const motionTransitions = {
  /** Default smooth transition */
  default: {
    duration: duration.normal,
    ease: ease.default,
  } satisfies Transition,

  /** Fast transition for micro-interactions */
  fast: {
    duration: duration.fast,
    ease: ease.default,
  } satisfies Transition,

  /** Moderate transition */
  moderate: {
    duration: duration.moderate,
    ease: ease.easeInOut,
  } satisfies Transition,

  /** Slow transition for dramatic effects */
  slow: {
    duration: duration.slow,
    ease: ease.easeInOut,
  } satisfies Transition,

  /** Spring physics for natural feel */
  spring: ease.spring,

  /** Gentle spring for subtle movements */
  gentle: ease.gentle,

  /** Bouncy spring for playful interactions */
  bouncy: ease.bouncy,

  /** Page transition timing */
  page: {
    duration: duration.page,
    ease: ease.easeInOut,
  } satisfies Transition,

  /** Modal transition */
  modal: {
    duration: duration.moderate,
    ease: ease.easeOut,
  } satisfies Transition,
} as const;

// ============================================================
// UTILITY
// ============================================================

/**
 * Creates viewport-triggered animation props for use with motion components.
 * @param variant - The variant key from motionVariants
 * @param once - Whether to animate only once (default: true)
 * @param amount - Percentage of element visible to trigger (default: 0.2)
 */
export function createViewportAnimation(
  variant: keyof typeof motionVariants,
  once = true,
  amount = 0.2,
) {
  return {
    variants: motionVariants[variant],
    initial: 'initial',
    whileInView: 'animate',
    viewport: { once, amount },
    transition: motionTransitions.default,
  };
}
