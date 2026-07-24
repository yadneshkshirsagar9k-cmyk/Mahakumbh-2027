import { CredentialType } from '@/types/credential.types';

/**
 * Maps a CredentialType to its standard 3-letter Government Document prefix.
 */
function getPrefixForCredential(type: CredentialType): string {
  switch (type) {
    case CredentialType.REGISTRATION_CERTIFICATE:
      return 'REG';
    case CredentialType.PILGRIM_IDENTITY:
      return 'PID';
    case CredentialType.VEHICLE_PASS:
      return 'VEH';
      return 'PRK';
    case CredentialType.ACCOMMODATION_PASS:
      return 'ACC';
    case CredentialType.EMERGENCY_CARD:
      return 'EMR';
    case CredentialType.VOLUNTEER_CARD:
      return 'VOL';
    case CredentialType.STAFF_ID:
      return 'STF';
    case CredentialType.VIP_PASS:
      return 'VIP';
    default:
      return 'DOC';
  }
}

/**
 * Standardized Government Document Number Generator.
 * Generates sequences like REG-MH27-2027-000001
 * 
 * In a real backend, this would use an atomic database sequence. 
 * For this client-side mock architecture, we use a combination of timestamp and random padding 
 * to ensure high likelihood of uniqueness while adhering to the format.
 */
export function generateDocumentNumber(type: CredentialType): string {
  const prefix = getPrefixForCredential(type);
  const stateCode = 'MH27'; // Nashik Kumbh specific code
  const year = new Date().getFullYear();
  
  // Generate a mock 6-digit sequence
  const sequence = Math.floor(100000 + Math.random() * 900000).toString();
  
  return `${prefix}-${stateCode}-${year}-${sequence}`;
}

export function generateCredentialId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `cred-${Date.now()}-${Math.floor(Math.random()*10000)}`;
}
