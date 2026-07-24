/**
 * @file Feedback and Grievance Data Models and API Contracts
 * @description Central type definitions for the Feedback & Grievance Portal,
 * specifying type contracts for complaints, ratings, attachments, and tracking codes.
 */

// ============================================================
// DATA MODELS (Section 8)
// ============================================================

export type FeedbackCategory = 
  | 'general' 
  | 'facilities' 
  | 'cleanliness' 
  | 'crowd_management' 
  | 'medical' 
  | 'police' 
  | 'accommodation' 
  | 'transportation' 
  | 'website' 
  | 'mobile_app' 
  | 'suggestions' 
  | 'others';

export interface Attachment {
  fileId: string;
  fileName: string;
  fileType: 'image/jpeg' | 'image/png' | 'application/pdf' | 'application/msword';
  fileSizeMb: number;
  uploadedUrl: string;
}

export interface Rating {
  overallExperience: number; // 1-5 scale
  websiteExperience: number;
  navigation: number;
  facilities: number;
  administration: number;
  cleanliness: number;
  medicalSupport: number;
  security: number;
  crowdManagement: number;
}

export type FeedbackStatus = 
  | 'submitted' 
  | 'acknowledged' 
  | 'investigating' 
  | 'resolved' 
  | 'closed';

export interface Feedback {
  feedbackId: string;
  trackingId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  district: string;
  category: FeedbackCategory;
  subject: string;
  description: string;
  ratings: Rating;
  attachments: Attachment[];
  status: FeedbackStatus;
  createdAt: string;
  termsConsented: boolean;
}

export interface Complaint extends Feedback {
  grievanceOfficerAssigned?: string;
  resolutionDeadline?: string;
  officialRemarks?: string;
}

export interface Suggestion extends Feedback {
  departmentReviewed?: string;
  feasibilityScore?: number; // 1-100 scale
}

// ============================================================
// API CONTRACTS (Section 9)
// ============================================================

export interface FeedbackAPI {
  submitFeedback: (feedbackData: Omit<Feedback, 'feedbackId' | 'trackingId' | 'status' | 'createdAt'>) => Promise<{
    success: boolean;
    trackingId: string;
    status: FeedbackStatus;
  }>;
  getFeedbackStatus: (trackingId: string) => Promise<Feedback | null>;
}

export interface ComplaintAPI {
  escalateGrievance: (trackingId: string, remarks: string) => Promise<boolean>;
  getGrievanceOfficerLogs: (trackingId: string) => Promise<{
    timestamp: string;
    officerName: string;
    actionTaken: string;
  }[]>;
}

export interface ImageUploadAPI {
  uploadFeedbackImage: (imageBlob: Blob, trackingId: string) => Promise<Attachment>;
  deleteFeedbackImage: (fileId: string) => Promise<boolean>;
}

export interface DocumentUploadAPI {
  uploadGrievanceDocument: (docBlob: Blob, trackingId: string) => Promise<Attachment>;
  deleteGrievanceDocument: (fileId: string) => Promise<boolean>;
}

export interface TrackingAPI {
  generateTrackingID: (category: FeedbackCategory) => string;
  subscribeToStatusSMS: (trackingId: string, mobileNumber: string) => Promise<boolean>;
}
