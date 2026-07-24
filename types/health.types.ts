/**
 * @file Health registration PDF viewer type definitions
 * @description Central interfaces representing reading progress tracking,
 * document details, guidelines, and helpline contact entries.
 */

export interface ReadingProgress {
  currentPage: number;
  totalPages: number;
  percentageComplete: number;
  recentlyViewedPage: number;
}

export interface PDFDocument {
  id: string;
  name: string;
  url: string;
  totalPages: number;
  lastUpdated: string;
  issuedBy: string;
}

export interface QuickGuideline {
  id: string;
  title: string;
  content: string[];
}

export interface HelpContact {
  department: string;
  phone: string;
  availability: string;
}
