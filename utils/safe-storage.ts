/**
 * @file Safe Storage Utility
 * @description Provides quota-safe localStorage operations with automatic cleanup,
 * eviction of old/inactive user records, and pruning of oversized data to prevent QuotaExceededErrors.
 */

export class SafeStorage {
  /**
   * Safely set an item in localStorage, automatically cleaning up if QuotaExceededError occurs.
   */
  static setItem(key: string, value: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err: any) {
      if (this.isQuotaError(err)) {
        // Attempt eviction and cleanup of inactive user accounts / old data to recover quota
        this.evictAndClean(key);
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (retryErr: any) {
          if (this.isQuotaError(retryErr)) {
            // If still quota exceeded, prune history/large strings inside value and retry
            const prunedValue = this.prunePayload(key, value);
            try {
              localStorage.setItem(key, prunedValue);
              return true;
            } catch (finalErr) {
              console.warn(`[SafeStorage] Could not store key "${key}" due to quota limits even after cleanup.`);
              return false;
            }
          }
        }
      }
      return false;
    }
  }

  /**
   * Safely get an item from localStorage.
   */
  static getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  /**
   * Safely remove an item from localStorage.
   */
  static removeItem(key: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  private static isQuotaError(err: any): boolean {
    return (
      err &&
      (err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err.code === 22 ||
        err.code === 1014)
    );
  }

  /**
   * Cleans up inactive or redundant keys in localStorage when quota is reached.
   */
  private static evictAndClean(currentKey: string): void {
    if (typeof window === 'undefined') return;
    try {
      // 1. Get current active session user ID so we don't evict the active user
      let activeUserId: string | null = null;
      try {
        const sessionStr = localStorage.getItem('mahakumbh_session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          activeUserId = session?.user?.id || null;
        }
      } catch {}

      // 2. Evict any old inactive user records (`mahakumbh_user_data_*` and `mahakumbh_user_auth_*`)
      // that do not match the currently logged in user ID or currentKey.
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;

        if (k.startsWith('mahakumbh_user_data_') || k.startsWith('mahakumbh_user_auth_')) {
          const userId = k.replace('mahakumbh_user_data_', '').replace('mahakumbh_user_auth_', '');
          if (activeUserId && userId !== activeUserId && k !== currentKey) {
            keysToRemove.push(k);
          }
        }
      }

      keysToRemove.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch {}
      });

      // 3. If still low on space, trim mahakumbh_journey_store history if oversized
      try {
        const journeyStoreStr = localStorage.getItem('mahakumbh_journey_store');
        if (journeyStoreStr && journeyStoreStr.length > 800000 && currentKey !== 'mahakumbh_journey_store') {
          const parsed = JSON.parse(journeyStoreStr);
          if (parsed?.state?.journeyHistory && parsed.state.journeyHistory.length > 2) {
            parsed.state.journeyHistory = parsed.state.journeyHistory.slice(-2);
            localStorage.setItem('mahakumbh_journey_store', JSON.stringify(parsed));
          }
        }
      } catch {}
    } catch (e) {
      // Ignore errors during cleanup
    }
  }

  /**
   * Prunes oversized strings/arrays inside JSON payloads if quota is critical.
   */
  private static prunePayload(key: string, valueStr: string): string {
    try {
      const parsed = JSON.parse(valueStr);
      const state = parsed.state || parsed;

      // Prune journeyHistory to last 1 item if still over quota
      if (Array.isArray(state.journeyHistory) && state.journeyHistory.length > 1) {
        state.journeyHistory = state.journeyHistory.slice(-1);
      }

      // If any photo inside citizenProfile or pilgrims is a massive raw base64 string (>150KB),
      // clear or truncate it to free up quota
      if (state.citizenProfile && typeof state.citizenProfile.photo === 'string' && state.citizenProfile.photo.length > 150000) {
        state.citizenProfile.photo = '';
      }
      if (state.journey && Array.isArray(state.journey.pilgrims)) {
        state.journey.pilgrims.forEach((p: any) => {
          if (p && typeof p.photo === 'string' && p.photo.length > 150000) {
            p.photo = '';
          }
        });
      }

      return JSON.stringify(parsed);
    } catch {
      return valueStr;
    }
  }
}
