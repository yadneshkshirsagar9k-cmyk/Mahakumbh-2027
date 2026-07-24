/**
 * @file User Service
 * @description Manages profile operations, password changes, etc.
 * Prepared for future API/backend integration.
 */

import { SessionService } from './session.service';

export interface UpdateProfileParams {
  name: string;
  phone: string;
  email: string;
}

export class UserService {
  /**
   * Mock service updating profile details
   */
  static async updateProfile(params: UpdateProfileParams): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 600)); // simulate API call
    const session = SessionService.getSession();
    if (session) {
      session.user.name = params.name;
      session.user.phone = params.phone;
      session.user.email = params.email;
      SessionService.setSession(session);
      return true;
    }
    return false;
  }

  /**
   * Mock service updating user password
   */
  static async changePassword(oldPass: string, newPass: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate API call
    return true; // simulated success
  }
}
