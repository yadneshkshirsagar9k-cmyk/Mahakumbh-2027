/**
 * @file Session Service
 * @description Manages authentication tokens and sessions in local storage.
 * Prepared for future API integration.
 */

import { SafeStorage } from '@/utils/safe-storage';

export interface SessionData {
  token: string;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    registrationType: string;
    registrationId: string;
    avatar?: string;
  };
}

export class SessionService {
  private static STORAGE_KEY = 'mahakumbh_session';

  /**
   * Retrieves active session details
   */
  static getSession(): SessionData | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = SafeStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get session:', e);
      return null;
    }
  }

  /**
   * Creates or updates user session
   */
  static setSession(session: SessionData): void {
    if (typeof window === 'undefined') return;
    try {
      SafeStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }

  /**
   * Clears active session
   */
  static clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      SafeStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  }
}

