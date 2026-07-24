import { create } from 'zustand';
import { SessionService } from '@/services/session.service';
import { useJourneyStore } from '@/store/journey-store';
import { SafeStorage } from '@/utils/safe-storage';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  registrationType: string;
  registrationId: string;
  avatar?: string;
}

interface AuthState {
  /** Authentication status */
  isAuthenticated: boolean;
  /** Active user profile data */
  user: UserProfile | null;
  /** Active language preference */
  language: string;
  /** Set authentication state */
  setIsAuthenticated: (val: boolean) => void;
  /** Set user details */
  setUser: (user: UserProfile | null) => void;
  /** Set language preference */
  setLanguage: (lang: string) => void;
  /** Logout and clear authentication */
  logout: () => void;
}

// Read initial session from SessionService for persistence
const initialSession = SessionService.getSession();
const initialLanguage = typeof window !== 'undefined' ? SafeStorage.getItem('mahakumbh_lang') || 'English' : 'English';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!initialSession,
  user: initialSession ? initialSession.user : null,
  language: initialLanguage,
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  setUser: (user) => {
    set({ user });
    if (user && user.id) {
      // Load user-specific journey data or reset if new user
      const storedUserData = SafeStorage.getItem(`mahakumbh_user_data_${user.id}`);
      if (storedUserData) {
        try {
          useJourneyStore.setState(JSON.parse(storedUserData));
        } catch (e) {
          useJourneyStore.getState().resetStore();
        }
      } else {
        useJourneyStore.getState().resetStore();
      }
    }
  },
  setLanguage: (lang) => {
    SafeStorage.setItem('mahakumbh_lang', lang);
    set({ language: lang });
  },
  logout: () => {
    SessionService.clearSession();
    useJourneyStore.getState().resetStore();
    set({ isAuthenticated: false, user: null });
  },
}));

export default useAuthStore;

// ============================================================
// JOURNEY STORE SYNCHRONIZATION
// ============================================================
// Automatically sync the active JourneyStore state to the authenticated user's
// permanent record. Uses a debounce to optimize storage writes.
if (typeof window !== 'undefined') {
  let syncTimer: NodeJS.Timeout;
  useJourneyStore.subscribe((state) => {
    const session = SessionService.getSession();
    if (session && session.user && session.user.id) {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        try {
          SafeStorage.setItem(`mahakumbh_user_data_${session.user.id}`, JSON.stringify(state));
        } catch (err) {
          // Handled safely without triggering console error overlays
        }
      }, 500);
    }
  });
}


