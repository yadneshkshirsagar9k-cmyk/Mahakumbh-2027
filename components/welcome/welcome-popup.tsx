'use client';

/**
 * @file WelcomePopup — Official Government of Maharashtra Welcome Modal
 * @description Premium government address modal displayed once per browser session.
 * Features glassmorphism, parchment texture, Sanskrit shlokas in Devanagari,
 * government seal watermark, and an interactive multilingual selector.
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motionVariants, motionTransitions } from '@/lib/animations';
import { WELCOME_TRANSLATIONS } from '@/constants/welcome-translations';

export interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SHLOKAS = [
  {
    id: 'shloka-1',
    devanagari: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
    translation:
      'May all beings be happy, may all beings be free from illness. May all beings see auspiciousness, may no one suffer.',
  },
] as const;

export function WelcomePopup({ isOpen, onClose, className }: WelcomePopupProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Default to Marathi ('mr') as per requirement
  const [lang, setLang] = useState<string>('mr');
  const t = WELCOME_TRANSLATIONS[lang] || WELCOME_TRANSLATIONS.mr;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setHasScrolledToBottom(true);
      }
    }
  }, []);

  const handleUnderstand = useCallback(() => {
    try {
      sessionStorage.setItem('mahakumbh_welcome_seen', 'true');
    } catch {
      // sessionStorage may be unavailable
    }
    onClose();
  }, [onClose]);

  const handleReadAgain = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setHasScrolledToBottom(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            'fixed inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8',
            'z-[500]',
            className
          )}
          variants={motionVariants.overlayIn}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          role="presentation"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#111827]/40"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Modal container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Official Welcome Message from the Government of Maharashtra"
            className={cn(
              'relative z-10 w-full max-w-[720px] max-h-[90vh]',
              'flex flex-col',
              'rounded-[20px] overflow-hidden',
              'bg-white',
              'border border-[#E5E7EB]',
              'shadow-sm'
            )}
            variants={motionVariants.modalIn}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransitions.modal}
          >
            {/* Government Seal Watermark */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              aria-hidden="true"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='%231A3A6B' stroke-width='3'/%3E%3Ccircle cx='100' cy='100' r='75' fill='none' stroke='%231A3A6B' stroke-width='1.5'/%3E%3Ctext x='100' y='105' text-anchor='middle' font-size='24' fill='%231A3A6B' font-family='serif'%3E%E0%A4%B8%E0%A4%A4%E0%A5%8D%E0%A4%AF%E0%A4%AE%E0%A5%87%E0%A4%B5%20%E0%A4%9C%E0%A4%AF%E0%A4%A4%E0%A5%87%3C/text%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px',
                backgroundRepeat: 'repeat',
              }}
            />

            {/* Temple texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.02]"
              aria-hidden="true"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(212,169,106,0.1) 10px,
                  rgba(212,169,106,0.1) 11px
                )`,
              }}
            />

            {/* Language Selector (Top Right) */}
            <div className="absolute top-4 right-16 z-20">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className={cn(
                  'text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg focus:outline-none border cursor-pointer transition-colors shadow-sm',
                  'bg-white text-[#1F2937]',
                  'border-[#E5E7EB] hover:border-[#005BAC]'
                )}
                aria-label="Select welcome message language"
              >
                <option value="mr">मराठी (Default)</option>
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="sa">संस्कृतम्</option>
              </select>
            </div>

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className={cn(
                'absolute top-4 right-4 z-20',
                'w-9 h-9 rounded-full',
                'flex items-center justify-center',
                'bg-[#F5F7FA] hover:bg-[#E5E7EB]',
                'text-[#6B7280] hover:text-[#111827]',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005BAC]'
              )}
              aria-label="Close welcome message"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Header */}
            <div className="relative px-6 pt-16 pb-4 sm:px-10 sm:pt-16 sm:pb-5 text-center flex-shrink-0">
              {/* Logo Emblem */}
              <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border border-[#E5E7EB] shadow-sm bg-white flex items-center justify-center">
                <img src="/assets/images/logo.svg" className="w-full h-full object-cover" alt="Logo" />
              </div>

              {/* Dynamic Title */}
              <h2
                className={cn(
                  'text-base sm:text-xl font-extrabold tracking-wide',
                  'text-[#111827]',
                  'font-[var(--font-outfit)]'
                )}
              >
                {t.title}
              </h2>

              {/* Subtitle line */}
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-[#E5E7EB]" aria-hidden="true" />
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#6B7280]">
                  {t.subtitle}
                </p>
                <span className="h-px w-8 bg-[#E5E7EB]" aria-hidden="true" />
              </div>

              <p
                className={cn(
                  'mt-1 text-[9px] sm:text-xs tracking-wider uppercase',
                  'text-[#005BAC]',
                  'font-bold'
                )}
              >
                {t.event}
              </p>

              {/* Divider */}
              <div className="mt-4 mx-auto w-24 h-px bg-[#E5E7EB]" aria-hidden="true" />
            </div>

            {/* Scrollable Content */}
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="relative flex-1 overflow-y-auto px-6 sm:px-10 py-2 scroll-smooth"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,91,172,0.3) transparent',
              }}
            >
              {/* Official Address */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#374151] text-left">
                <p className="font-extrabold text-[#111827]">
                  {t.salutation}
                </p>

                {t.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Shlokas (Constant Sacred Invocations) */}
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-px flex-1 bg-[#E5E7EB]" aria-hidden="true" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#1F2937]">
                    Sacred Invocations
                  </span>
                  <span className="h-px flex-1 bg-[#E5E7EB]" aria-hidden="true" />
                </div>

                {SHLOKAS.map((shloka) => (
                  <motion.div
                    key={shloka.id}
                    className={cn(
                      'rounded-2xl p-5 sm:p-6 text-center',
                      'bg-[#F5F7FA]',
                      'border border-[#E5E7EB]'
                    )}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p
                      className={cn(
                        'text-sm sm:text-base leading-loose font-medium',
                        'text-[#111827]',
                        'whitespace-pre-line'
                      )}
                      style={{ fontFamily: "'Noto Sans Devanagari', 'Tiro Devanagari Sanskrit', serif" }}
                      lang="sa"
                    >
                      {shloka.devanagari}
                    </p>

                    <p className="mt-3 text-[10px] sm:text-xs italic text-[#6B7280] leading-relaxed">
                      — {shloka.translation}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Signature area */}
              <div className="mt-10 mb-6 flex flex-col items-end text-right">
                <div className="w-px h-0.5" aria-hidden="true" />

                <div
                  className={cn(
                    'text-2xl sm:text-3xl mb-1',
                    'text-[#1F2937]',
                    'select-none'
                  )}
                  style={{
                    fontFamily: "'Dancing Script', 'Pacifico', cursive",
                    fontWeight: 700,
                    fontStyle: 'italic',
                    letterSpacing: '0.02em',
                    transform: 'rotate(-2deg)',
                  }}
                  aria-label="Signature of Shri Devendra Fadnavis"
                >
                  Devendra Fadnavis
                </div>

                <div className="w-40 h-px bg-[#E5E7EB] mb-2" aria-hidden="true" />

                <p className="text-xs font-bold text-[#111827]">
                  Shri Devendra Fadnavis
                </p>
                <p className="text-[10px] text-[#6B7280] mt-0.5">
                  {t.signatureSubtitle}
                </p>
                <p className="text-[9px] text-[#6B7280]">
                  {t.signatureGovt}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={cn(
                'relative flex-shrink-0 px-6 py-5 sm:px-10',
                'flex flex-col sm:flex-row items-center justify-center gap-3',
                'border-t border-[#E5E7EB]',
                'bg-[#FAFBFC]'
              )}
            >
              <button
                onClick={handleUnderstand}
                className={cn(
                  'w-full sm:w-auto inline-flex items-center justify-center gap-2',
                  'px-8 py-3 rounded-xl',
                  'text-xs font-bold uppercase tracking-wider',
                  'bg-[#005BAC] text-white hover:bg-[#0F4C81]',
                  'shadow-sm',
                  'active:scale-[0.98]',
                  'transition-all duration-200'
                )}
              >
                <CheckCircle2 size={16} />
                {t.understandBtn}
              </button>

              <button
                onClick={handleReadAgain}
                className={cn(
                  'w-full sm:w-auto inline-flex items-center justify-center gap-2',
                  'px-6 py-3 rounded-xl',
                  'text-xs font-bold uppercase tracking-wider',
                  'bg-white border border-[#005BAC] text-[#005BAC] hover:bg-[#F5F7FA]',
                  'shadow-sm',
                  'active:scale-[0.98]',
                  'transition-all duration-200'
                )}
              >
                <BookOpen size={14} />
                {t.readAgainBtn}
              </button>

              <button
                onClick={onClose}
                className={cn(
                  'w-full sm:w-auto inline-flex items-center justify-center',
                  'px-6 py-3 rounded-xl',
                  'text-xs font-bold uppercase tracking-wider',
                  'text-[#6B7280] hover:text-[#111827] hover:bg-[#F5F7FA]',
                  'active:scale-[0.98]',
                  'transition-all duration-200'
                )}
              >
                {t.closeBtn}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WelcomePopup;
