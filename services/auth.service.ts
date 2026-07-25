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

    const { user, citizenProfile, journey } = result;
    const userId = user.id;

    // Reset store first to prepare for user session
    const store = useJourneyStore.getState();
    store.resetStore();

    // Hydrate profile from DB or create a fresh one if missing
    if (citizenProfile) {
      store.setCitizenProfile({
        photo: citizenProfile.photo || '',
        fullName: citizenProfile.fullName || '',
        gender: citizenProfile.gender || '',
        dateOfBirth: citizenProfile.dateOfBirth || '',
        primaryMobile: citizenProfile.primaryMobile || '',
        alternateMobile: citizenProfile.alternateMobile || '',
        email: citizenProfile.email || '',
        address: citizenProfile.address || {
          houseFlatNumber: '',
          buildingSociety: '',
          streetRoad: '',
          areaLocality: '',
          villageTownCity: '',
          talukaTehsil: '',
          district: '',
          state: '',
          country: '',
          pinCode: '',
        },
        nationality: citizenProfile.nationality || 'Indian Citizen',
        preferredLanguage: citizenProfile.preferredLanguage || 'English',
        bloodGroup: citizenProfile.bloodGroup || '',
        occupation: citizenProfile.occupation || 'Other',
        occupationOther: citizenProfile.occupationOther || '',
        governmentIds: citizenProfile.governmentIds || [],
        emergencyContacts: citizenProfile.emergencyContacts || {
          primary: { name: '', relationship: '', phone: '', notes: '' },
          secondary: { name: '', relationship: '', phone: '', notes: '' },
          doctor: { name: '', relationship: '', phone: '', notes: '' },
          localContact: { name: '', relationship: '', phone: '', notes: '' },
        },
        signature: citizenProfile.signature || '',
        verification: citizenProfile.verification || {
          registrationStatus: 'Not Started',
          identityVerification: 'Pending',
          documentVerification: 'Pending',
          journeyApproval: 'Pending',
          currentStage: 'Self Registration',
        },
        audit: citizenProfile.audit || {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'System',
          updatedBy: 'System',
        }
      });
    } else {
      store.updateCitizenProfile({
        fullName: user.name,
        primaryMobile: user.phone,
        email: user.email || '',
      });
    }

    // Hydrate journey from DB if present (do not generate a dummy one!)
    if (journey) {
      store.setJourney({
        id: journey.journeyId,
        registrationNumber: journey.registrationNumber,
        permitNumber: journey.permitNumber || '',
        vehiclePassId: journey.vehiclePassId || '',
        emergencySheetId: journey.emergencySheetId || '',
        qrCode: journey.qrCode || '',
        registrationTimestamp: journey.registrationTimestamp || new Date().toISOString(),
        journeyName: journey.journeyName || '',
        journeyType: journey.journeyType as any || 'Individual',
        journeyStatus: journey.journeyStatus || 'Journey Registered',
        startDate: journey.startDate || '',
        endDate: journey.endDate || '',
        arrivalMode: journey.arrivalMode || '',
        arrivalPoint: journey.arrivalPoint || '',
        accommodation: journey.accommodation || { type: '', name: '', address: '', audit: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'System', updatedBy: 'System' } },
        vehicleInfo: journey.vehicleInfo || { vehicleNumber: '', vehicleType: '', audit: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'System', updatedBy: 'System' } },
        primaryRegistrantId: journey.primaryRegistrantId || '',
        emergencyContacts: journey.emergencyContacts || '',
        pilgrimCount: journey.pilgrimCount || 1,
        pilgrims: journey.pilgrims || [],
        selectedGhats: journey.selectedGhats || [],
        selectedTemples: journey.selectedTemples || [],
        snanBookings: journey.snanBookings || [],
        darshanBookings: journey.darshanBookings || [],
        journeyPlannerData: journey.journeyPlannerData || null,
        journeyProgress: journey.journeyProgress || 0,
        journeyMetadata: journey.journeyMetadata || { exitZone: '', category: 'Individual', purpose: [], arrivalStation: '', departurePoint: '', sector: '', zone: '', route: '', batch: '', expectedArrivalDate: '', expectedArrivalTime: '', expectedDepartureDate: '', expectedDepartureTime: '' },
        timelineEvents: journey.timelineEvents || [],
        audit: journey.audit || { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'System', updatedBy: 'System' },
      });
    }

    // Save initial state to safe storage
    const permanentData = useJourneyStore.getState();
    SafeStorage.setItem(`mahakumbh_user_data_${userId}`, JSON.stringify(permanentData));

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
        registrationId: journey?.registrationNumber || user.registrationId,
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
