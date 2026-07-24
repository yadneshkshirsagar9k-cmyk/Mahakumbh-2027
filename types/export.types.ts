import type { GovernmentCredential } from './credential.types';
import type { RenderProfile, RenderingManifest } from './rendering.types';
import type { DocumentFormat } from '@/config/document-tokens';

// ============================================================
// EXPORT TARGETS & PROFILES
// ============================================================
export enum ExportTarget {
  PRINT = 'PRINT',
  PDF = 'PDF',
  HTML = 'HTML',
  PNG = 'PNG',
  WALLET_PASS = 'WALLET_PASS'
}

export interface PrintProfile {
  id: string;
  format: DocumentFormat;
  paperSize: 'A4' | 'A5' | 'ID_CARD';
  orientation: 'portrait' | 'landscape';
  margins: 'none' | 'standard';
  grayscale: boolean;
}

// ============================================================
// EXPORT MANIFEST
// ============================================================
export interface ExportManifest {
  jobId: string;
  credential: GovernmentCredential;
  renderProfile: RenderProfile;
  exportTarget: ExportTarget;
  printProfile: PrintProfile;
  outputFilename: string;
  mimeType: string;
  
  // Security Configurations
  securityConfiguration: {
    includeWatermark: boolean;
    includeDigitalSignatureSpace: boolean;
    lockDocument: boolean; // For future PDF locking
  };
  
  // Extensions for future hashes / metadata
  exportMetadata: Record<string, any>;
  
  // The actual rendered document passed down from the engine
  renderedManifest?: RenderingManifest;
}

// ============================================================
// EXPORT JOB STATE
// ============================================================
export enum ExportJobStatus {
  PENDING = 'PENDING',
  RENDERING = 'RENDERING',
  EXPORTING = 'EXPORTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ExportJob {
  id: string;
  manifest: ExportManifest;
  status: ExportJobStatus;
  createdAt: number;
  completedAt?: number;
  error?: string;
}

// ============================================================
// EXPORT PROVIDER INTERFACE
// ============================================================
export interface ExportProviderResult {
  success: boolean;
  jobId: string;
  url?: string;
  blob?: Blob;
  error?: string;
}

export interface ExportProvider {
  /** Uniquely identifies this provider (e.g., 'browser-print', 'client-jspdf') */
  providerId: string;
  
  /** Declares which targets this provider can handle */
  supportedTargets: ExportTarget[];
  
  /** Executes the export job */
  execute(job: ExportJob, htmlElement?: HTMLElement): Promise<ExportProviderResult>;
}
