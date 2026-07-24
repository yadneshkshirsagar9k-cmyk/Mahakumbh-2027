'use client';

import { useState, useEffect } from 'react';
import { useCredentialStore } from '@/store/credential-store';
import { useJourneyStore } from '@/store/journey-store';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye,
  ShieldCheck,
  AlertTriangle,
  History,
  QrCode
} from 'lucide-react';
import { CredentialStatus, VerificationStatus, CredentialType, DocumentCategory } from '@/types/credential.types';

export default function MyDocumentsPage() {
  const citizenProfile = useJourneyStore(state => state.citizenProfile);
  const getMyDocumentsSummary = useCredentialStore(state => state.getMyDocumentsSummary);
  const recordAction = useCredentialStore(state => state.recordAction);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !citizenProfile) {
    return <div className="p-8 text-center text-gray-500">Loading documents...</div>;
  }

  const documents = getMyDocumentsSummary(citizenProfile.citizenId || '');

  // Group documents by category
  const groupedDocs = documents.reduce((acc, doc) => {
    const cat = doc.credentialType; // For simplicity in UI grouping
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  const handleAction = (docNum: string, action: 'VIEW' | 'DOWNLOAD' | 'PRINT', credType: CredentialType) => {
    recordAction(docNum, action);
    window.location.href = `/account/documents/showcase?type=${credType}`;
  };

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED_ACTIVE:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200"><ShieldCheck size={12} /> VERIFIED</span>;
      case VerificationStatus.REVOKED:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200"><AlertTriangle size={12} /> REVOKED</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">UNVERIFIED</span>;
    }
  };

  const getCredentialName = (type: CredentialType) => {
    return type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-[#111827] font-[var(--font-heading)] tracking-tight flex items-center gap-2">
              <FileText size={24} className="text-[#005BAC]" />
              My Documents
            </h1>
            <p className="text-xs font-bold text-[#6B7280]">
              View, download, and manage your official Government credentials.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/account/documents/showcase'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F7FA] border border-[#E5E7EB] text-[#0F4C81] text-xs font-bold rounded hover:bg-white transition-colors shadow-sm"
          >
            <Eye size={14} />
            Visual Design Showcase
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 rounded-lg text-center shadow-sm">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-sm font-bold text-gray-700 mb-1">No Documents Issued Yet</h3>
          <p className="text-xs text-gray-500">Your official credentials will appear here once your applications are approved.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedDocs).map(([type, docs]) => (
            <div key={type} className="space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                {getCredentialName(type as CredentialType)}
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
                  {docs.length}
                </span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {docs.map(doc => (
                  <div key={doc.documentNumber} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-[#005BAC]">
                    {/* Card Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-start">
                      <div>
                        <div className="text-[10px] font-bold text-gray-500 mb-0.5 tracking-wider uppercase">Document Number</div>
                        <div className="font-mono text-sm font-bold text-[#0F4C81]">{doc.documentNumber}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        {getVerificationBadge(doc.verificationBadge)}
                        <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                          {doc.version}
                        </span>
                      </div>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-4 flex-1 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <div className="text-[10px] font-bold text-gray-500 uppercase">Issue Date</div>
                          <div className="text-xs font-bold text-gray-900">{new Date(doc.issueDate).toLocaleDateString()}</div>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <div className="text-[10px] font-bold text-gray-500 uppercase">Status</div>
                          <div className={`text-xs font-bold ${doc.status === CredentialStatus.ACTIVE ? 'text-green-600' : 'text-gray-600'}`}>
                            {doc.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                        <ShieldCheck size={12} className="text-[#005BAC]" />
                        Official Government Credential
                      </div>
                    </div>
                    
                    {/* Card Actions */}
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(doc.documentNumber, 'VIEW', doc.credentialType)}
                        className="p-1.5 text-gray-500 hover:text-[#0F4C81] hover:bg-gray-100 rounded transition-colors"
                        title="View Document"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleAction(doc.documentNumber, 'PRINT', doc.credentialType)}
                        disabled={!doc.printAvailable}
                        className="p-1.5 text-gray-500 hover:text-[#0F4C81] hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                        title="Print Document"
                      >
                        <Printer size={16} />
                      </button>
                      <button 
                        onClick={() => handleAction(doc.documentNumber, 'DOWNLOAD', doc.credentialType)}
                        disabled={!doc.downloadAvailable}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#005BAC] text-white text-xs font-bold rounded hover:bg-[#0F4C81] transition-colors disabled:opacity-50"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
