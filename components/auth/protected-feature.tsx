'use client';

/**
 * @file ProtectedFeature component
 * @description Intercepts click events on protected features, showing
 * a premium Login Required modal if the user is a guest.
 * Includes Login, Register, and Cancel buttons.
 *
 * @accessibility
 * - Aria modal dialog focus trap
 * - Keyboard navigation support (ESC to close)
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, LogIn, UserPlus, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/utils/cn';
import { motionVariants, motionTransitions } from '@/lib/animations';

// ============================================================
// MODAL DIALOG COMPONENT
// ============================================================

export interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export function LoginRequiredModal({ isOpen, onClose, featureName }: LoginRequiredModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleLogin = () => {
    onClose();
    router.push('/auth/login');
  };

  const handleRegister = () => {
    onClose();
    router.push('/auth/register');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[600]" role="dialog" aria-modal="true">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0A1621]/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            variants={motionVariants.modalIn}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransitions.modal}
            className={cn(
              'relative z-10 w-full max-w-[480px]',
              'rounded-2xl p-6 sm:p-8',
              'bg-gradient-to-br from-[#FFF8F0]/95 via-[#FFFDF5]/95 to-[#FAF0E1]/95',
              'dark:from-[#011D40]/95 dark:to-[#0E1F33]/95',
              'border border-[#F26F21]/30 dark:border-[#D4A843]/30',
              'shadow-premium text-center overflow-hidden'
            )}
          >
            {/* Government Seal Watermark Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
              aria-hidden="true"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='%231A3A6B' stroke-width='3'/%3E%3Ctext x='100' y='105' text-anchor='middle' font-size='24' fill='%231A3A6B' font-family='serif'%3E%E0%A4%B8%E0%A4%A4%E0%A5%8D%E0%A4%AF%E0%A4%AE%E0%A5%87%E0%A4%B5%20%E0%A4%9C%E0%A4%AF%E0%A4%A4%E0%A5%87%3C/text%3E%3C/svg%3E")`,
                backgroundSize: '150px 150px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-stone-grey-500 hover:text-stone-grey-800 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-saffron-500/10 text-saffron-500 mb-5">
              <ShieldAlert size={28} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-[#022B5D] dark:text-[#D4A843] font-[var(--font-heading)] leading-tight mb-2">
              Authentication Required
            </h3>

            {/* Description */}
            <p className="text-sm text-[#525252] dark:text-stone-grey-300 leading-relaxed mb-6">
              {featureName ? (
                <>Access to <strong>{featureName}</strong> is restricted. </>
              ) : (
                <>This feature </>
              )}
              is available after successful registration and login.
            </p>

            {/* Actions Grid */}
            <div className="flex flex-col gap-2.5">
              {/* Login Button */}
              <button
                onClick={handleLogin}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl',
                  'text-sm font-bold text-white',
                  'bg-gradient-to-r from-gov-blue-500 to-river-blue-600',
                  'hover:from-gov-blue-600 hover:to-river-blue-700',
                  'shadow-md transition-all duration-200 active:scale-[0.98]'
                )}
              >
                <LogIn size={16} />
                <span>Login to Account</span>
              </button>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl',
                  'text-sm font-bold text-[#F26F21] dark:text-[#D4A843]',
                  'bg-saffron-500/10 hover:bg-saffron-500/15 border border-[#F26F21]/30 dark:border-[#D4A843]/30',
                  'transition-all duration-200 active:scale-[0.98]'
                )}
              >
                <UserPlus size={16} />
                <span>Register for Mahakumbh</span>
              </button>

              {/* Cancel Button */}
              <button
                onClick={onClose}
                className="w-full text-xs font-semibold text-stone-grey-500 hover:text-stone-grey-700 dark:hover:text-[#B0B0B0] py-2 transition-colors"
              >
                Cancel & Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// WRAPPER COMPONENT
// ============================================================

export interface ProtectedFeatureProps {
  /** Feature Name to display inside the modal */
  featureName: string;
  /** Children representing the click target action */
  children: React.ReactNode;
  /** Optional custom onClick wrapper if not using static Link */
  onAccessGranted?: () => void;
  /** Custom class wrap */
  className?: string;
}

export function ProtectedFeature({ featureName, children, onAccessGranted, className }: ProtectedFeatureProps) {
  const { isAuthenticated } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      // Intercept action, block link navigation or triggers
      e.preventDefault();
      e.stopPropagation();
      setModalOpen(true);
    } else {
      // Allow link click / custom callback
      if (onAccessGranted) onAccessGranted();
    }
  };

  return (
    <>
      <div onClickCapture={handleClick} className={cn('inline-block cursor-pointer', className)}>
        {children}
      </div>

      <LoginRequiredModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        featureName={featureName}
      />
    </>
  );
}

export default ProtectedFeature;
