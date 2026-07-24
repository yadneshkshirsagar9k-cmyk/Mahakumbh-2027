'use client';
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

interface Props {
  payload: any;
  size?: number;
  showDownload?: boolean;
}

export function QrCodeRenderer({ payload, size = 120, showDownload = true }: Props) {
  const [dataUrl, setDataUrl] = useState<string>('');

  const getFormattedQrString = (data: any): string => {
    if (!data) return 'MAHAKUMBH-2027-VERIFIED';
    if (typeof data === 'string') return data;
    
    // Create an actionable URL that opens in a phone's browser when scanned
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mahakumbh.gov.in';
    
    // MINIFY payload to reduce QR density massively (crucial for Google Lens at small print sizes)
    const ext = data?.extendedData || {};
    const minifiedData = {
      id: data?.documentNumber || 'REG-PENDING',
      ct: data?.credentialType || 'OFFICIAL_PASS',
      vs: data?.verificationSignature || 'SHA256:PENDING',
      nm: ext.fullName || 'Authorized Holder',
      st: ext.verificationStatus || 'Verified & Active',
      dt: ext.journeyDates || 'Event Duration',
      sz: ext.pilgrimCount || '1 Member(s)',
      vh: ext.vehicleRegistration || 'N/A',
      sc: ext.assignedSector || 'Allocated Zone',
      bg: ext.bloodGroup || 'N/A',
      gd: ext.gender || 'N/A',
      db: ext.dob || 'N/A',
      ec: ext.emergencyContact || 'N/A',
      // Note: photograph (base64) is too large for a QR code payload. It must be fetched server-side via the document ID in production.
    };

    try {
      const payloadBase64 = btoa(encodeURIComponent(JSON.stringify(minifiedData)));
      return `${origin}/verify?data=${payloadBase64}`;
    } catch (e) {
      return `${origin}/verify?error=invalid`;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const qrText = getFormattedQrString(payload);
    // Render high resolution (300px min) for crisp printing & sharp screen display,
    // while the container / img tag strictly constrains physical dimensions to `size`.
    const renderSize = Math.max(size * 3, 300);
    
    QRCode.toDataURL(qrText, {
      width: renderSize,
      margin: 1,
      color: { dark: '#111827', light: '#FFFFFF' },
      errorCorrectionLevel: 'M'
    }).then(url => {
      if (isMounted) setDataUrl(url);
    }).catch(console.error);

    return () => { isMounted = false; };
  }, [payload, size]);

  const handleDownloadQr = () => {
    if (!dataUrl) return;
    const docId = (payload && typeof payload === 'object' && payload.documentNumber) ? payload.documentNumber : 'QR_Gatepass';
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Mahakumbh_QR_Gatepass_${docId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center shrink-0" 
      style={{ width: `${size}px` }}
    >
      <div 
        className="flex items-center justify-center overflow-hidden shrink-0"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          minWidth: `${size}px`, 
          minHeight: `${size}px`, 
          maxWidth: `${size}px`, 
          maxHeight: `${size}px` 
        }}
      >
        {dataUrl ? (
          <img 
            src={dataUrl} 
            alt="Official Verification QR Code" 
            style={{ 
              width: `${size}px`, 
              height: `${size}px`, 
              minWidth: `${size}px`, 
              minHeight: `${size}px`, 
              maxWidth: `${size}px`, 
              maxHeight: `${size}px`, 
              objectFit: 'contain',
              display: 'block' 
            }} 
            className="shrink-0"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse rounded" />
        )}
      </div>
      {showDownload && (
        <button
          onClick={handleDownloadQr}
          title="Download standalone QR code as high-res PNG image"
          className="print:hidden mt-1.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#005BAC] bg-blue-50/80 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors cursor-pointer shadow-2xs"
        >
          <Download size={10} />
          <span>Download QR</span>
        </button>
      )}
    </div>
  );
}

