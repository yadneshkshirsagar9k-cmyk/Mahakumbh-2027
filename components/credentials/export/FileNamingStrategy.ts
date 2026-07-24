import type { ExportManifest } from '@/types/export.types';
import { CredentialType } from '@/types/credential.types';

export class FileNamingStrategy {
  /**
   * Generates a deterministic, human-readable filename for an exported credential.
   * Format: [Govt]-[DocumentType]-[DocumentNumber]-[Date].[ext]
   */
  static generateFilename(manifest: ExportManifest, extension: string = 'pdf'): string {
    const cred = manifest.credential;
    
    // Map internal enums to readable acronyms
    const typeMap: Record<CredentialType, string> = {
      [CredentialType.REGISTRATION_CERTIFICATE]: 'RegCert',
      [CredentialType.PILGRIM_IDENTITY]: 'PilgrimID',
      [CredentialType.VEHICLE_PASS]: 'VehiclePass',
      [CredentialType.ACCOMMODATION_PASS]: 'StayPass',
      [CredentialType.EMERGENCY_CARD]: 'EmergencyCard',
      [CredentialType.VOLUNTEER_CARD]: 'VolunteerID',
      [CredentialType.VIP_PASS]: 'VIP',
      [CredentialType.STAFF_ID]: 'GovtID',
    };

    const typeStr = typeMap[cred.credentialType] || 'Doc';
    
    // Clean document number (remove special chars for filename safety)
    const safeDocNumber = cred.documentNumber.replace(/[^a-zA-Z0-9-]/g, '');
    
    // YYYYMMDD format
    const dateObj = new Date();
    const dateStr = `${dateObj.getFullYear()}${(dateObj.getMonth() + 1).toString().padStart(2, '0')}${dateObj.getDate().toString().padStart(2, '0')}`;
    
    return `MahaKumbh_${typeStr}_${safeDocNumber}_${dateStr}.${extension}`;
  }
}
