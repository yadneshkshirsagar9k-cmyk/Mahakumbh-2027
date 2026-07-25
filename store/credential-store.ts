import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SafeStorage } from '@/utils/safe-storage';
import { 
  GovernmentCredential, 
  CredentialType, 
  DocumentSummary,
  CredentialStatus,
  CredentialEventType,
  VerificationStatus,
  DocumentCategory
} from '@/types/credential.types';
import { CredentialGenerationService } from '@/services/credential-generation.service';
import { generateCredentialId } from '@/utils/document-numbering';
import { useJourneyStore, Journey } from './journey-store';
import type { CitizenProfile } from '@/types/citizen.types';

interface CredentialState {
  credentials: GovernmentCredential[];
  
  // Actions
  issueCredential: (type: CredentialType, journeyId: string, applicationId?: string) => GovernmentCredential | null;
  syncJourneyCredentials: (journey: Journey, citizen: CitizenProfile) => GovernmentCredential[];
  revokeCredential: (documentNumber: string, reason?: string) => void;
  recordAction: (documentNumber: string, action: 'DOWNLOAD' | 'PRINT' | 'VIEW') => void;
  createVersion: (documentNumber: string) => GovernmentCredential | null;
  
  // Selectors
  getCredentialsByCitizen: (citizenId: string) => GovernmentCredential[];
  getMyDocumentsSummary: (citizenId: string) => DocumentSummary[];
}

export const useCredentialStore = create<CredentialState>()(
  persist(
    (set, get) => ({
      credentials: [],
      
      issueCredential: (type, journeyId, applicationId) => {
        const journeyStore = useJourneyStore.getState();
        const journey = journeyStore.journey?.id === journeyId ? journeyStore.journey : journeyStore.journeyHistory.find(j => j.id === journeyId);
        const citizen = journeyStore.citizenProfile;
        
        if (!journey || !citizen) return null;
        
        const newCred = CredentialGenerationService.generateNewCredential(type, journey, citizen, applicationId);
        
        set((state) => ({
          credentials: [...state.credentials, newCred]
        }));
        
        return newCred;
      },

      syncJourneyCredentials: (journey, citizen) => {
        if (!journey || !citizen) return [];
        
        // Define strict validation gates for credential generation
        const hasPilgrims = journey.pilgrims && journey.pilgrims.length >= 1;
        const hasBookings = (journey.snanBookings && journey.snanBookings.length >= 1) || 
                            (journey.darshanBookings && journey.darshanBookings.length >= 1);
        const pilgrimPassCondition = hasPilgrims && hasBookings;

        const hasVehicleDetails = journey.vehicleInfo && 
                                  journey.vehicleInfo.vehicleNumber && 
                                  journey.vehicleInfo.vehicleNumber.trim() !== '';
        const vehiclePassCondition = hasVehicleDetails;

        const hasEmergencyContact = citizen.emergencyContacts?.primary?.phone && 
                                    citizen.emergencyContacts.primary.phone.trim() !== '';
        const emergencyCardCondition = hasEmergencyContact;
        
        set((state) => {
          // 1. Deduplicate existing credentials (keep the latest one)
          const uniqueCredentials = new Map<string, GovernmentCredential>();
          state.credentials.forEach(cred => {
            const key = `${cred.credentialType}-${cred.linkedJourneyId}-${cred.linkedCitizenId}`;
            if (!uniqueCredentials.has(key) || new Date(cred.issueDate) > new Date(uniqueCredentials.get(key)!.issueDate)) {
              uniqueCredentials.set(key, cred);
            }
          });
          const dedupedCredentials = Array.from(uniqueCredentials.values());

          // 2. Generate missing credentials ONLY if respective conditions are satisfied
          const newCreds: GovernmentCredential[] = [];
          const citizenId = citizen.citizenId || '';
          
          // REGISTRATION_CERTIFICATE: always generated once journey is active
          if (!dedupedCredentials.some(c => c.credentialType === CredentialType.REGISTRATION_CERTIFICATE && c.linkedJourneyId === journey.id && c.linkedCitizenId === citizenId && c.isActive)) {
            newCreds.push(CredentialGenerationService.generateNewCredential(CredentialType.REGISTRATION_CERTIFICATE, journey, citizen));
          }

          // PILGRIM_IDENTITY: requires pilgrims added & snan/darshan slots booked
          if (pilgrimPassCondition && !dedupedCredentials.some(c => c.credentialType === CredentialType.PILGRIM_IDENTITY && c.linkedJourneyId === journey.id && c.linkedCitizenId === citizenId && c.isActive)) {
            newCreds.push(CredentialGenerationService.generateNewCredential(CredentialType.PILGRIM_IDENTITY, journey, citizen));
          }

          // VEHICLE_PASS: requires private vehicle details completed
          if (vehiclePassCondition && !dedupedCredentials.some(c => c.credentialType === CredentialType.VEHICLE_PASS && c.linkedJourneyId === journey.id && c.linkedCitizenId === citizenId && c.isActive)) {
            newCreds.push(CredentialGenerationService.generateNewCredential(CredentialType.VEHICLE_PASS, journey, citizen));
          }

          // EMERGENCY_CARD: requires emergency contact numbers
          if (emergencyCardCondition && !dedupedCredentials.some(c => c.credentialType === CredentialType.EMERGENCY_CARD && c.linkedJourneyId === journey.id && c.linkedCitizenId === citizenId && c.isActive)) {
            newCreds.push(CredentialGenerationService.generateNewCredential(CredentialType.EMERGENCY_CARD, journey, citizen));
          }
          
          if (newCreds.length === 0 && dedupedCredentials.length === state.credentials.length) {
            return state; // No changes needed
          }
          
          return {
            credentials: [...dedupedCredentials, ...newCreds]
          };
        });
        
        return get().credentials.filter(c => c.linkedCitizenId === (citizen.citizenId || '') && c.credentialType !== CredentialType.ACCOMMODATION_PASS);
      },
      
      revokeCredential: (documentNumber, reason = 'Administrative Revocation') => {
        set((state) => ({
          credentials: state.credentials.map(cred => {
            if (cred.documentNumber === documentNumber && cred.isActive) {
              return {
                ...cred,
                isActive: false,
                isRevoked: true,
                status: CredentialStatus.REVOKED,
                lastUpdated: new Date().toISOString(),
                timeline: [
                  ...cred.timeline,
                  {
                    eventId: generateCredentialId(),
                    timestamp: new Date().toISOString(),
                    eventType: CredentialEventType.REVOKED,
                    actor: 'Admin' as const,
                    actorId: 'ADMIN-1',
                    notes: reason,
                  }
                ]
              };
            }
            return cred;
          })
        }));
      },
      
      recordAction: (documentNumber, action) => {
        set((state) => ({
          credentials: state.credentials.map(cred => {
            if (cred.documentNumber === documentNumber && cred.isActive) {
              const eventType = 
                action === 'DOWNLOAD' ? CredentialEventType.DOWNLOADED :
                action === 'PRINT' ? CredentialEventType.PRINTED :
                CredentialEventType.VIEWED;
                
              return {
                ...cred,
                downloadCount: action === 'DOWNLOAD' ? cred.downloadCount + 1 : cred.downloadCount,
                printCount: action === 'PRINT' ? cred.printCount + 1 : cred.printCount,
                viewCount: action === 'VIEW' ? cred.viewCount + 1 : cred.viewCount,
                timeline: [
                  ...cred.timeline,
                  {
                    eventId: generateCredentialId(),
                    timestamp: new Date().toISOString(),
                    eventType,
                    actor: 'Citizen' as const,
                    actorId: cred.linkedCitizenId,
                    notes: `Document ${action.toLowerCase()}ed by citizen`,
                  }
                ]
              };
            }
            return cred;
          })
        }));
      },
      
      createVersion: (documentNumber) => {
        const state = get();
        const activeCred = state.credentials.find(c => c.documentNumber === documentNumber && c.isActive);
        if (!activeCred) return null;
        
        const journeyStore = useJourneyStore.getState();
        const journey = journeyStore.journey?.id === activeCred.linkedJourneyId ? journeyStore.journey : journeyStore.journeyHistory.find((j: any) => j.id === activeCred.linkedJourneyId);
        const citizen = journeyStore.citizenProfile;
        
        if (!journey || !citizen) return null;
        
        const newVersion = CredentialGenerationService.createNewVersion(activeCred, journey, citizen);
        
        set((state) => ({
          credentials: state.credentials.map(cred => {
            // Supersede the old active version
            if (cred.credentialId === activeCred.credentialId) {
              return {
                ...cred,
                isActive: false,
                status: CredentialStatus.SUPERSEDED,
                lastUpdated: new Date().toISOString(),
                timeline: [
                  ...cred.timeline,
                  {
                    eventId: generateCredentialId(),
                    timestamp: new Date().toISOString(),
                    eventType: CredentialEventType.SUPERSEDED,
                    actor: 'System' as const,
                    actorId: 'SYS',
                    notes: `Superseded by version ${newVersion.versionNumber}`,
                  }
                ]
              };
            }
            return cred;
          }).concat(newVersion) // Add the new version
        }));
        
        return newVersion;
      },
      
      getCredentialsByCitizen: (citizenId) => {
        const creds = get().credentials.filter(c => c.linkedCitizenId === citizenId && c.credentialType !== CredentialType.ACCOMMODATION_PASS);
        
        // Deduplicate: keep only the latest active credential per type
        const unique = new Map<CredentialType, any>();
        creds.forEach(cred => {
          if (!unique.has(cred.credentialType) || new Date(cred.issueDate) > new Date(unique.get(cred.credentialType)!.issueDate)) {
            unique.set(cred.credentialType, cred);
          }
        });
        
        return Array.from(unique.values());
      },
      
      getMyDocumentsSummary: (citizenId) => {
        // Only return the active version of each non-accommodation document
        const creds = get().credentials.filter(c => c.linkedCitizenId === citizenId && c.isActive && c.credentialType !== CredentialType.ACCOMMODATION_PASS);
        
        // Deduplicate on the fly to prevent any ghost duplicates
        const unique = new Map<CredentialType, any>();
        creds.forEach(cred => {
          if (!unique.has(cred.credentialType) || new Date(cred.issueDate) > new Date(unique.get(cred.credentialType)!.issueDate)) {
            unique.set(cred.credentialType, cred);
          }
        });
        
        const activeCreds = Array.from(unique.values());
        
        return activeCreds.map(cred => ({
          documentNumber: cred.documentNumber,
          credentialType: cred.credentialType,
          status: cred.status,
          issueDate: cred.issueDate,
          version: `v${cred.versionNumber}.0`,
          verificationBadge: cred.isRevoked ? VerificationStatus.REVOKED : VerificationStatus.VERIFIED_ACTIVE,
          downloadAvailable: cred.isActive && !cred.isRevoked,
          printAvailable: cred.isActive && !cred.isRevoked,
          linkedJourneyId: cred.linkedJourneyId,
        }));
      }
    }),
    {
      name: 'kumbh-credential-registry-v1',
      storage: createJSONStorage(() => SafeStorage),
    }
  )
);
