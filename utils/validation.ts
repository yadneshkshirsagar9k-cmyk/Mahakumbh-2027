/**
 * @file Validation Utilities
 * @description Centralized validation logic for Indian Government portal data formats.
 * Provides user-friendly validation messages suitable for a Government registration portal.
 */

// ============================================================
// PHONE VALIDATION
// ============================================================

/** Validate Indian 10-digit mobile number (optionally with +91 prefix). */
export function validatePhone(phone: string): { valid: boolean; message: string } {
  if (!phone) return { valid: false, message: 'Mobile number is required.' };
  const cleaned = phone.replace(/[\s\-+]/g, '');
  // Accept 10 digits or 91 + 10 digits
  const pattern = /^(91)?[6-9]\d{9}$/;
  if (!pattern.test(cleaned)) {
    return { valid: false, message: 'Please enter a valid 10-digit Indian mobile number starting with 6-9.' };
  }
  return { valid: true, message: '' };
}

// ============================================================
// EMAIL VALIDATION
// ============================================================

/** Validate standard email format. */
export function validateEmail(email: string): { valid: boolean; message: string } {
  if (!email) return { valid: true, message: '' }; // Email may be optional
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!pattern.test(email)) {
    return { valid: false, message: 'Please enter a valid email address (e.g. name@example.com).' };
  }
  return { valid: true, message: '' };
}

// ============================================================
// DATE OF BIRTH VALIDATION
// ============================================================

/** Validate DOB is a valid past date within a reasonable age range (0-120 years). */
export function validateDOB(dob: string): { valid: boolean; message: string } {
  if (!dob) return { valid: false, message: 'Date of Birth is required.' };
  const date = new Date(dob);
  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Please enter a valid date.' };
  }
  const today = new Date();
  if (date > today) {
    return { valid: false, message: 'Date of Birth cannot be in the future.' };
  }
  const age = calculateAge(dob);
  if (age > 120) {
    return { valid: false, message: 'Please enter a valid Date of Birth.' };
  }
  return { valid: true, message: '' };
}

/** Calculate age from a DOB string (YYYY-MM-DD). */
export function calculateAge(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

// ============================================================
// PIN CODE VALIDATION
// ============================================================

/** Validate Indian 6-digit PIN code. */
export function validatePinCode(pin: string): { valid: boolean; message: string } {
  if (!pin) return { valid: true, message: '' }; // PIN may be optional
  const pattern = /^[1-9]\d{5}$/;
  if (!pattern.test(pin)) {
    return { valid: false, message: 'Invalid PIN Code. Please enter a valid 6-digit Indian PIN code.' };
  }
  return { valid: true, message: '' };
}

// ============================================================
// VEHICLE NUMBER VALIDATION
// ============================================================

/** Validate Indian vehicle registration format (e.g. MH-04-AB-1234 or MH04AB1234). */
export function validateVehicleNumber(num: string): { valid: boolean; message: string } {
  if (!num) return { valid: true, message: '' }; // Vehicle may be optional
  const cleaned = num.replace(/[\s\-]/g, '').toUpperCase();
  // Indian vehicle registration: 2 letters (state) + 2 digits (district) + 1-3 letters + 1-4 digits
  const pattern = /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{1,4}$/;
  if (!pattern.test(cleaned)) {
    return { valid: false, message: 'Vehicle registration format: XX-00-XX-0000 (e.g. MH-04-AB-1234).' };
  }
  return { valid: true, message: '' };
}

// ============================================================
// AADHAAR VALIDATION
// ============================================================

/** Validate Aadhaar number format (12 digits, optionally space-separated in groups of 4). */
export function validateAadhaar(num: string): { valid: boolean; message: string } {
  if (!num) return { valid: false, message: 'Aadhaar number is required.' };
  const cleaned = num.replace(/[\s\-]/g, '');
  if (!/^\d{12}$/.test(cleaned)) {
    return { valid: false, message: 'Aadhaar number must be exactly 12 digits.' };
  }
  // Aadhaar cannot start with 0 or 1
  if (cleaned.startsWith('0') || cleaned.startsWith('1')) {
    return { valid: false, message: 'Aadhaar number cannot start with 0 or 1.' };
  }
  return { valid: true, message: '' };
}

// ============================================================
// PASSPORT VALIDATION
// ============================================================

/** Validate Indian passport format (1 letter + 7 digits). */
export function validatePassport(num: string): { valid: boolean; message: string } {
  if (!num) return { valid: false, message: 'Passport number is required.' };
  const cleaned = num.replace(/[\s\-]/g, '').toUpperCase();
  if (!/^[A-Z]\d{7}$/.test(cleaned)) {
    return { valid: false, message: 'Passport format: 1 letter followed by 7 digits (e.g. A1234567).' };
  }
  return { valid: true, message: '' };
}

// ============================================================
// DRIVING LICENCE VALIDATION
// ============================================================

/** Validate Indian Driving Licence format (state code + various formats). */
export function validateDrivingLicence(num: string): { valid: boolean; message: string } {
  if (!num) return { valid: false, message: 'Driving Licence number is required.' };
  const cleaned = num.replace(/[\s\-]/g, '').toUpperCase();
  // Flexible format: 2 letters (state) + 2 digits (RTO) + rest alphanumeric, total 15-16 chars
  if (!/^[A-Z]{2}\d{2}\d{4}\d{7}$/.test(cleaned) && !/^[A-Z]{2}\d{13,14}$/.test(cleaned) && cleaned.length < 10) {
    return { valid: false, message: 'Please enter a valid Driving Licence number (e.g. MH0420190012345).' };
  }
  return { valid: true, message: '' };
}

// ============================================================
// PAN VALIDATION
// ============================================================

/** Validate PAN card format (5 letters + 4 digits + 1 letter). */
export function validatePAN(num: string): { valid: boolean; message: string } {
  if (!num) return { valid: true, message: '' }; // PAN is optional
  const cleaned = num.replace(/[\s\-]/g, '').toUpperCase();
  if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(cleaned)) {
    return { valid: false, message: 'PAN format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F).' };
  }
  return { valid: true, message: '' };
}

// ============================================================
// GOVERNMENT ID MASKING
// ============================================================

import type { GovernmentIdType } from '@/types/citizen.types';

/** Generate a masked display version of a government ID number. */
export function maskGovernmentId(type: GovernmentIdType, number: string): string {
  if (!number) return '';
  const cleaned = number.replace(/[\s\-]/g, '');

  switch (type) {
    case 'Aadhaar': {
      // Show last 4 digits: XXXX XXXX 4589
      const last4 = cleaned.slice(-4);
      return `XXXX XXXX ${last4}`;
    }
    case 'Passport': {
      // Show first letter + last 3: A****567
      return cleaned.charAt(0) + '****' + cleaned.slice(-3);
    }
    case 'Driving Licence': {
      // Show state code + last 4: MH**********2345
      const state = cleaned.slice(0, 2);
      const last4 = cleaned.slice(-4);
      return state + '*'.repeat(Math.max(0, cleaned.length - 6)) + last4;
    }
    case 'Voter ID': {
      // Show first 3 + last 3: ABC****789
      return cleaned.slice(0, 3) + '****' + cleaned.slice(-3);
    }
    case 'PAN': {
      // Show first 2 + last 2: AB******4F
      return cleaned.slice(0, 2) + '******' + cleaned.slice(-2);
    }
    default:
      return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
  }
}

// ============================================================
// GOVERNMENT ID DISPATCH VALIDATOR
// ============================================================

/** Validate a government ID number based on its type. */
export function validateGovernmentId(type: GovernmentIdType, number: string): { valid: boolean; message: string } {
  switch (type) {
    case 'Aadhaar': return validateAadhaar(number);
    case 'Passport': return validatePassport(number);
    case 'Driving Licence': return validateDrivingLicence(number);
    case 'PAN': return validatePAN(number);
    case 'Voter ID': {
      if (!number) return { valid: false, message: 'Voter ID number is required.' };
      const cleaned = number.replace(/[\s\-]/g, '').toUpperCase();
      if (!/^[A-Z]{3}\d{7}$/.test(cleaned)) {
        return { valid: false, message: 'Voter ID format: 3 letters + 7 digits (e.g. ABC1234567).' };
      }
      return { valid: true, message: '' };
    }
    default: return { valid: false, message: 'Unsupported ID type.' };
  }
}

// ============================================================
// GENERAL FIELD VALIDATION MESSAGE HELPER
// ============================================================

/** Return a user-friendly Government portal validation message for common field errors. */
export function getValidationMessage(field: string, error: string): string {
  const prefix = '⚠ ';
  const fieldLabels: Record<string, string> = {
    phone: 'Mobile Number',
    email: 'Email Address',
    dob: 'Date of Birth',
    pinCode: 'PIN Code',
    vehicleNumber: 'Vehicle Registration',
    aadhaar: 'Aadhaar Number',
    passport: 'Passport Number',
    drivingLicence: 'Driving Licence',
    pan: 'PAN',
    voterId: 'Voter ID',
  };
  const label = fieldLabels[field] || field;
  return `${prefix}${label}: ${error}`;
}
