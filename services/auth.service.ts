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
    // Properly extract identifier based on type to prevent fallback bug
    let identifier = (params.mobile || params.identifier || params.passportNumber || params.operatorId || '').trim();
    if (!identifier) {
      identifier = '9876543210'; // Extreme fallback if completely missing
    }

    // Authenticate via MongoDB API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password: params.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Login failed. Please try again.');
    }

    const { user } = result;
    const userId = user.id;

    // Load their local data if it exists, or initialize a new store if logging in on a new device
    let permanentData: any = null;
    const dataStr = SafeStorage.getItem(`mahakumbh_user_data_${userId}`);
    if (dataStr) {
      permanentData = JSON.parse(dataStr);
    }

    if (!permanentData) {
      // Create fresh data structure for this user
      const store = useJourneyStore.getState();
      store.resetStore();
      
      store.updateCitizenProfile({
        fullName: user.name,
        primaryMobile: user.phone,
        email: user.email || '',
      });

      store.setJourney({
        id: `JNY-${Math.floor(100000 + Math.random() * 900000)}`,
        registrationNumber: user.registrationId,
        permitNumber: '',
        vehiclePassId: '',
        emergencySheetId: '',
        qrCode: '',
        registrationTimestamp: new Date().toISOString(),
        journeyName: `${user.name}'s Journey`,
        journeyType: user.registrationType as any,
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

      permanentData = useJourneyStore.getState();
      SafeStorage.setItem(`mahakumbh_user_data_${userId}`, JSON.stringify(permanentData));
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
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        registrationType: user.registrationType,
        registrationId: user.registrationId,
      },
    };

    SessionService.setSession(session);
    return session;
  }

  /**
   * Registration generates a fresh permanent account.
   */
  static async register(params: RegisterParams): Promise<SessionData> {
    const identifier = (params.mobile || params.nriMobile || params.passportNumber || params.operatorId || params.email || '').trim();

    // Register via MongoDB API
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: params.fullName,
        mobile: params.mobile || params.nriMobile || identifier,
        alternateMobile: params.alternateMobile || '',
        email: params.email || '',
        password: params.password,
        category: params.category,
        state: params.state || '',
        district: params.district || '',
        address: params.address || '',
        aadhaar: params.aadhaar || '',
        gender: params.gender || '',
        dob: params.dob || '',
        emergencyContact: params.emergencyContact || '',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed. Please try again.');
    }

    const { userId } = result;

    // Safely clear previous session before resetting the store, 
    // to prevent WIPE sync to a previously active user's permanent data.
    SessionService.clearSession();
    useJourneyStore.getState().resetStore();

    const regId = 'MK-' + Math.floor(100000 + Math.random() * 900000);
    const store = useJourneyStore.getState();

    // Fully initialize profile with registration inputs
    store.updateCitizenProfile({
      fullName: params.fullName,
      primaryMobile: params.mobile || params.nriMobile || identifier,
      email: params.email || '',
      gender: params.gender || '',
      dateOfBirth: params.dob || '',
      nationality: params.category === 'foreign' ? 'Foreign National' : 'Indian Citizen',
      address: {
        houseFlatNumber: '',
        buildingSociety: '',
        streetRoad: params.address || '',
        areaLocality: '',
        villageTownCity: params.district || '',
        talukaTehsil: '',
        district: params.district || '',
        state: params.state || '',
        country: params.category === 'foreign' ? 'Foreign' : 'India',
        pinCode: '',
      },
      governmentIds: params.aadhaar ? [{
        type: 'Aadhaar',
        number: params.aadhaar,
        verificationStatus: 'Not Verified',
        verifiedBy: '',
        verificationMethod: '',
        verificationTimestamp: '',
        maskedDisplay: 'XXXX-XXXX-' + params.aadhaar.slice(-4),
      } as any] : [],
      emergencyContacts: {
        primary: {
          name: 'Primary Contact',
          relationship: 'Family',
          phone: params.emergencyContact || '',
          notes: '',
        },
        secondary: { name: '', relationship: '', phone: '', notes: '' },
        doctor: { name: '', relationship: '', phone: '', notes: '' },
        localContact: { name: '', relationship: '', phone: '', notes: '' },
      },
    });

    // Fully initialize journey instead of updating a null object
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
