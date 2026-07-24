/**
 * @file Government Document Design Tokens
 * @description Single source of truth for all Government Credential visual standards.
 * Defines strictly controlled layouts, safe print areas, grids, typography, and colors
 * to ensure all platform-generated documents are perfectly consistent, secure, and accessible.
 */

// ============================================================
// DOCUMENT FORMAT STANDARDS
// ============================================================
export const documentFormats = {
  a4: {
    width: '210mm',
    height: '297mm',
    orientation: 'portrait' as const,
    safeAreaPadding: '15mm',
    contentPadding: '10mm',
  },
  a5: {
    width: '148mm',
    height: '210mm',
    orientation: 'portrait' as const,
    safeAreaPadding: '10mm',
    contentPadding: '8mm',
  },
  idCard: {
    width: '85.6mm',
    height: '53.98mm',
    orientation: 'landscape' as const,
    safeAreaPadding: '4mm',
    contentPadding: '3mm',
  },
  mobileView: {
    width: '100%',
    height: 'auto',
    orientation: 'portrait' as const,
    safeAreaPadding: '16px',
    contentPadding: '12px',
  },
};

export type DocumentFormat = keyof typeof documentFormats;

// ============================================================
// DOCUMENT GRID SYSTEM
// ============================================================
export const documentGrid = {
  columns: 12,
  gap: {
    a4: '6mm',
    a5: '4mm',
    idCard: '2mm',
    mobileView: '8px',
  },
  rowGap: {
    a4: '8mm',
    a5: '6mm',
    idCard: '3mm',
    mobileView: '12px',
  }
};

// ============================================================
// GOVERNMENT BRANDING COLORS
// ============================================================
export const documentColors = {
  primary: {
    officialBlue: '#003366', // Standard Indian Government Blue
    officialOrange: '#FF9933', // Saffron / Orange
    white: '#FFFFFF',
    black: '#000000',
  },
  secondary: {
    ashokaGold: '#D4AF37', // Gold for emblem / accents
    neutralGray: '#666666',
    borderGray: '#CCCCCC',
    bgLight: '#FAFAFA',
  },
  status: {
    verificationGreen: '#138808', // Indian Flag Green
    emergencyRed: '#CC0000',
    warningYellow: '#FFCC00',
    revokedRed: '#990000',
    pendingBlue: '#0066CC',
    expiredGray: '#999999',
  },
  security: {
    watermark: 'rgba(0, 51, 102, 0.05)', // Very faint blue
    antiCopyLine: 'rgba(204, 204, 204, 0.4)',
    sealRed: '#A30000',
  }
};

// ============================================================
// DOCUMENT TYPOGRAPHY
// ============================================================
// Note: We use system fonts or highly standard fonts for PDF generation compatibility
export const documentTypography = {
  fonts: {
    primary: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    secondary: '"Noto Serif", "Times New Roman", Times, serif', // For official headers
    monospace: '"Roboto Mono", "Courier New", Courier, monospace', // For IDs, MRZ, etc.
  },
  sizes: {
    a4: {
      docTitle: '24pt',
      h1: '18pt',
      h2: '14pt',
      h3: '12pt',
      body1: '10pt',
      body2: '9pt',
      label: '8pt',
      micro: '6pt',
    },
    a5: {
      docTitle: '18pt',
      h1: '14pt',
      h2: '12pt',
      h3: '10pt',
      body1: '9pt',
      body2: '8pt',
      label: '7pt',
      micro: '5pt',
    },
    idCard: {
      docTitle: '10pt',
      h1: '8pt',
      h2: '7pt',
      h3: '6pt',
      body1: '5pt',
      body2: '4.5pt',
      label: '4pt',
      micro: '3pt',
    },
    mobileView: {
      docTitle: '1.25rem',
      h1: '1.125rem',
      h2: '1rem',
      h3: '0.875rem',
      body1: '0.875rem',
      body2: '0.75rem',
      label: '0.625rem',
      micro: '0.5rem',
    }
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  }
};

// ============================================================
// SECURITY LAYER Z-INDEX
// ============================================================
export const securityZIndex = {
  background: 0,
  watermark: 10,
  antiCopy: 20,
  content: 50, // Base layer for data
  seal: 60,
  digitalSignature: 70,
  qr: 80,
  topBorder: 100,
};

// ============================================================
// COMPONENT HEIGHTS (A4 Reference)
// ============================================================
export const zoneHeights = {
  a4: {
    header: '35mm',
    footer: '25mm',
    identityPhoto: '35mm',
    qrCode: '30mm',
  }
};
