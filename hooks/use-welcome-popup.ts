'use client';

/**
 * @file useWelcomePopup — Session-aware hook for welcome popup visibility
 * @description Controls the display logic for the welcome popup.
 * Shows once per browser session using sessionStorage.
 * Provides method to re-trigger from Help menu.
 *
 * @example
 * const { isOpen, close, reopen } = useWelcomePopup();
 * <WelcomePopup isOpen={isOpen} onClose={close} />
 * // In Help menu: <button onClick={reopen}>Read Welcome Again</button>
 *
 * @extension
 * - Add cookie-based persistence option
 * - Add version-aware display (show again on new version)
 * - Add A/B testing support
 */

import { useState, useEffect, useCallback } from 'react';

const SESSION_KEY = 'mahakumbh_welcome_seen';

export interface UseWelcomePopupReturn {
  /** Whether the popup should be displayed */
  isOpen: boolean;
  /** Close the popup and mark as seen in session */
  close: () => void;
  /** Re-open the popup (for Help menu "Read Again" action) */
  reopen: () => void;
  /** Whether the popup has been seen this session */
  hasBeenSeen: boolean;
}

export function useWelcomePopup(): UseWelcomePopupReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(true); // default true to prevent flash

  useEffect(() => {
    // Only run on client
    try {
      const seen = sessionStorage.getItem(SESSION_KEY);
      if (!seen) {
        setIsOpen(true);
        setHasBeenSeen(false);
      } else {
        setHasBeenSeen(true);
      }
    } catch {
      // sessionStorage unavailable (e.g., incognito in some browsers)
      // Show the popup anyway
      setIsOpen(true);
      setHasBeenSeen(false);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setHasBeenSeen(true);
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // Silently fail if storage is unavailable
    }
  }, []);

  const reopen = useCallback(() => {
    setIsOpen(true);
  }, []);

  return { isOpen, close, reopen, hasBeenSeen };
}

export default useWelcomePopup;
