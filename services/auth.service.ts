/**
 * @file Authentication Service
 * @description Authentication service with permanent user mapping, isolated storage, exactly-once ID generation, and password validation.
 */

import { SessionService, SessionData } from './session.service';
import { useJourneyStore } from '@/store/journey-store';
import { SafeStorage } from '@/utils/safe-storage';

export interface LoginParams {
  mobile?: string;
  passportNumber?: string;
  operatorId?: string;
  identifier?: string;
  password?: string;
  captcha?: string;
  type: 'indian' | 'nri' | 'foreign' | 'operator';
}

export interface RegisterParams {
  fullName: string;
  mobile: string;
  email: string;
  category: string;
  state?: string;
  district?: string;
  password?: string;
  [key: string]: any;
}

export class AuthService {
  private static USER_INDEX_KEY = 'mahakumbh_user_index';

  private static getUserIndex(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    try {
      const data = SafeStorage.getItem(this.USER_INDEX_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private static saveUserIndex(index: Record<string, string>) {
    if (typeof window === 'undefined') return;
    SafeStorage.setItem(this.USER_INDEX_KEY, JSON.stringify(index));
  }

  private static getUserAuth(userId: string) {
    if (typeof window === 'undefined') return null;
    try {
      const data = SafeStorage.getItem(`mahakumbh_user_auth_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private static saveUserAuth(userId: string, authData: any) {
    if (typeof window === 'undefined') return;
    SafeStorage.setItem(`mahakumbh_user_auth_${userId}`, JSON.stringify(authData));
  }

  private static generateUserId(): string {
    return 'USR-2027-' + Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Login using credentials to find the permanent user record.
   */
  static async login(params: LoginParams): Promise<SessionData> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Properly extract identifier based on type to prevent fallback bug
    let identifier = (params.mobile || params.identifier || params.passportNumber || params.operatorId || '').trim();
    if (!identifier) {
      identifier = '9876543210'; // Extreme fallback if completely missing
    }
    
    const index = this.getUserIndex();
    
    let userId = index[identifier];
    let permanentData: any = null;

    if (userId) {
      // Check password first
      const auth = this.getUserAuth(userId);
      
      if (!auth || !auth.password) {
        throw new Error('Authentication configuration error. Please register again.');
      }
      if (params.password !== auth.password) {
        throw new Error('Incorrect password. Please try again.');
      }

      // User exists in index, load their data
      const dataStr = SafeStorage.getItem(`mahakumbh_user_data_${userId}`);
      if (dataStr) {
        permanentData = JSON.parse(dataStr);
      }
    }

    if (!permanentData) {
      // Attempt to migrate legacy data or fallback to active store if the user has no permanent record yet
      if (typeof window !== 'undefined') {
        const legacyStr = SafeStorage.getItem('mahakumbh_journey_store');
        if (legacyStr) {
          try {
            const legacyParsed = JSON.parse(legacyStr);
            const legacyState = legacyParsed.state || legacyParsed; // handle persist wrapper
            
            // Check if the current store state belongs to this identifier
            const isMatch = legacyState.citizenProfile && (
              legacyState.citizenProfile.primaryMobile === identifier || 
              legacyState.citizenProfile.email === identifier ||
              (legacyState.journey && legacyState.journey.registrationNumber === identifier)
            );
            
            if (isMatch) {
              // Valid legacy match! Migrate it.
              userId = userId || this.generateUserId();
              permanentData = legacyState;
              index[identifier] = userId;
              this.saveUserIndex(index);
              this.saveUserAuth(userId, { password: params.password }); // Save auth for migrated user
              SafeStorage.setItem(`mahakumbh_user_data_${userId}`, JSON.stringify(permanentData));
            }
          } catch (e) {
            // Silently ignore legacy migration failures
          }
        }
      }
    }

    if (!permanentData) {
      // Reject login if account does not exist
      throw new Error('No account found with this identifier. Please register first.');
    } else {
      // Hydrate the existing permanent data into the active JourneyStore
      useJourneyStore.setState(permanentData);
      useJourneyStore.getState().recalculateStatus(); // Ensure status is calculated post-hydration
    }

    // Build Session Data
    const session: SessionData = {
      token: 'jwt-' + Math.random().toString(36).substring(2),
      user: {
        id: userId,
        name: permanentData.citizenProfile?.fullName || 'User',
        phone: permanentData.citizenProfile?.primaryMobile || identifier,
        email: permanentData.citizenProfile?.email || '',
        role: params.type === 'operator' ? 'operator' : 'pilgrim',
        registrationType: permanentData.journey?.journeyType || 'Individual',
        registrationId: permanentData.journey?.registrationNumber || '',
      },
    };

    SessionService.setSession(session);
    return session;
  }

  /**
   * Registration generates a fresh permanent account.
   */
  static async register(params: RegisterParams): Promise<SessionData> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const identifier = (params.mobile || params.nriMobile || params.passportNumber || params.operatorId || params.email || '').trim();
    const index = this.getUserIndex();
    
    // Bug 1 fix: Prevent overwriting existing user
    if (identifier && index[identifier]) {
      throw new Error('An account is already registered with this identifier.');
    }

    // Bug 1 fix: Safely clear previous session before resetting the store, 
    // to prevent WIPE sync to a previously active user's permanent data.
    SessionService.clearSession();
    useJourneyStore.getState().resetStore();

    // Create new immutable user
    const userId = this.generateUserId();
    
    // Map all potential identifiers to the new userId
    if (params.mobile) index[params.mobile.trim()] = userId;
    if (params.nriMobile) index[params.nriMobile.trim()] = userId;
    if (params.passportNumber) index[params.passportNumber.trim()] = userId;
    if (params.operatorId) index[params.operatorId.trim()] = userId;
    if (params.email) index[params.email.trim()] = userId;
    if (identifier && !index[identifier]) index[identifier] = userId;
    
    this.saveUserIndex(index);
    this.saveUserAuth(userId, { password: params.password });

    const regId = 'MK-' + Math.floor(100000 + Math.random() * 900000);
    
    const store = useJourneyStore.getState();

    // Fully initialize profile
    store.updateCitizenProfile({
      fullName: params.fullName,
      primaryMobile: identifier, // Ensure primaryMobile has the core identifier
      email: params.email || '',
    });

    // Fully initialize journey instead of updating a null object
    // This fixes Profile Completion score drop issues by providing the base structure.
    store.setJourney({
      id: `JNY-${Math.floor(100000 + Math.random() * 900000)}`,
      registrationNumber: regId,
      permitNumber: '',
      vehiclePassId: '',
      emergencySheetId: '',
      qrCode: '',
      registrationTimestamp: new Date().toISOString(),
      journeyName: `${params.fullName}'s Journey`,
      journeyType: params.category.charAt(0).toUpperCase() + params.category.slice(1) as any,
      journeyStatus: 'Journey Registered',
      startDate: '',
      endDate: '',
      arrivalMode: '',
      arrivalPoint: '',
      accommodation: { type: '', name: '', address: '', audit: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'System', updatedBy: 'System' } },
      vehicleInfo: { vehicleNumber: '', vehicleType: '', audit: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'System', updatedBy: 'System' } },
      primaryRegistrantId: userId,
      emergencyContacts: '',
      pilgrimCount: 0,
      pilgrims: [],
      selectedGhats: [],
      selectedTemples: [],
      snanBookings: [],
      darshanBookings: [],
      journeyPlannerData: null,
      journeyProgress: 25,
      journeyMetadata: { ipAddress: '127.0.0.1', deviceId: 'REG-1', registrationOfficer: 'Self', verificationOfficer: 'Pending' },
      audit: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'Self Registration', updatedBy: 'Self Registration' },
    } as any);

    const permanentData = useJourneyStore.getState();
    SafeStorage.setItem(`mahakumbh_user_data_${userId}`, JSON.stringify(permanentData));

    const session: SessionData = {
      token: 'jwt-' + Math.random().toString(36).substring(2),
      user: {
        id: userId,
        name: params.fullName,
        phone: params.mobile,
        email: params.email,
        role: 'pilgrim',
        registrationType: params.category.charAt(0).toUpperCase() + params.category.slice(1),
        registrationId: regId,
      },
    };

    SessionService.setSession(session);
    return session;
  }

  /**
   * Log out active session
   */
  static logout(): void {
    const session = SessionService.getSession();
    if (session && session.user && session.user.id) {
      // Ensure the very latest state is flushed to permanent storage
      SafeStorage.setItem(`mahakumbh_user_data_${session.user.id}`, JSON.stringify(useJourneyStore.getState()));
    }
    
    // Clear session FIRST to avoid debouncer syncing wiped state to the old user
    SessionService.clearSession();
    
    // Reset volatile UI state for the next user
    useJourneyStore.getState().resetStore();
  }
}
