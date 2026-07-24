'use client';

/**
 * @file Document Downloader Module
 * @description Centralized module for generating and downloading official Mahakumbh certificates directly from the Journey state.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileText, Eye, ShieldAlert } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useJourneyStore, Journey } from '@/store/journey-store';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  fileName: string;
  status: 'ready' | 'pending' | 'unavailable';
  category: string;
}

interface DocumentDownloaderProps {
  userName: string;
  registrationId: string;
}

export function DocumentDownloader({ userName, registrationId }: DocumentDownloaderProps) {
  const router = useRouter();
  const { journey } = useJourneyStore();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  if (!journey) {
    return (
      <div className="p-8 text-center text-[#6B7280]">
        <ShieldAlert size={28} className="mx-auto text-amber-500 mb-2" />
        <p className="text-xs font-semibold">No Documents.</p>
        <p className="text-[10px] text-[#6B7280]/80">Complete Journey Registration first.</p>
      </div>
    );
  }

  const documents: DocumentItem[] = [
    {
      id: 'doc-cert',
      title: 'Mahakumbh Registration Certificate',
      description: 'Official registration verification letter confirming credentials for Simhastha entry.',
      fileName: `Mahakumbh_Registration_Certificate_${journey.id}.pdf`,
      status: 'ready',
      category: 'Credentials',
    },
    {
      id: 'doc-id',
      title: 'Pilgrim Identity Card',
      description: 'Encrypted QR code smart ID card required at inner ring road border checkpoints.',
      fileName: `Mahakumbh_Pilgrim_ID_${journey.id}.pdf`,
      status: 'ready',
      category: 'Passes',
    },
    {
      id: 'doc-vehicle',
      title: 'Official Vehicle Pass',
      description: 'Approved vehicle transit pass authorizing designated outer ring access.',
      fileName: `Mahakumbh_Vehicle_Transit_Pass_${journey.id}.pdf`,
      status: 'ready',
      category: 'Passes',
    },

    {
      id: 'doc-emergency',
      title: 'Emergency Medical & Contact Card',
      description: 'Medical notes, emergency contacts, and sector hospital coordinates for safety.',
      fileName: `Mahakumbh_Emergency_Card_${journey.id}.pdf`,
      status: 'ready',
      category: 'Safety',
    },
  ];

  const getCredentialTypeForDoc = (id: string): string => {
    switch (id) {
      case 'doc-cert': return 'REGISTRATION_CERTIFICATE';
      case 'doc-id': return 'PILGRIM_IDENTITY';
      case 'doc-vehicle': return 'VEHICLE_PASS';
      case 'doc-emergency': return 'EMERGENCY_CARD';
      default: return 'REGISTRATION_CERTIFICATE';
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    setDownloadingId(doc.id);
    setTimeout(() => {
      setDownloadingId(null);
      router.push(`/account/documents/showcase?type=${getCredentialTypeForDoc(doc.id)}`);
    }, 300);
  };

  const handlePreview = (doc: DocumentItem) => {
    router.push(`/account/documents/showcase?type=${getCredentialTypeForDoc(doc.id)}`);
  };

  return (
    <div className="space-y-4" id="downloads">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2 text-left">
        <h3 className="text-sm font-extrabold text-[#111827]">
          Official Documents & Credentials
        </h3>
        <span className="text-[10px] text-[#6B7280] font-medium">NIC Verification Platform</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        {documents.map((doc) => {
          const isDownloading = downloadingId === doc.id;
          const isSuccess = successId === doc.id;

          return (
            <div
              key={doc.id}
              className={cn(
                'bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5',
                isSuccess
                  ? 'border-emerald-500'
                  : 'border-[#E5E7EB]'
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#F5F7FA] text-[#005BAC] border border-[#E5E7EB] uppercase tracking-wide">
                    {doc.category}
                  </span>
                  <FileText size={16} className="text-[#005BAC]" />
                </div>
                <h4 className="font-extrabold text-sm text-[#111827]">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-[#374151] leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex gap-2">
                <button
                  onClick={() => handlePreview(doc)}
                  className="px-2.5 py-2 border border-[#E5E7EB] hover:bg-[#F5F7FA] rounded text-[#374151] hover:text-[#005BAC] transition-all flex items-center justify-center cursor-pointer bg-transparent"
                  title="View Official Credential"
                >
                  <Eye size={13} />
                </button>

                <button
                  onClick={() => handleDownload(doc)}
                  disabled={isDownloading}
                  className={cn(
                    'flex-grow flex items-center justify-center gap-1.5 px-3 py-2 rounded text-[10px] font-bold tracking-wider uppercase transition-all select-none cursor-pointer border-none text-white',
                    isSuccess
                      ? 'bg-emerald-600'
                      : 'bg-[#005BAC] hover:bg-[#005BAC]/90 disabled:opacity-75'
                  )}
                >
                  <Download size={13} />
                  {isDownloading ? (
                    <span>Opening Viewer...</span>
                  ) : (
                    <span>Open & Export</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
