import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle, Clock, FileText, Download, Activity, AlertCircle, RefreshCw 
} from 'lucide-react';
import { GovernmentApplication } from '@/types/citizen.types';
import { cn } from '@/utils/cn';

export function ApplicationDetailsDrawer({ 
  application, 
  isOpen, 
  onClose,
  onCancelService
}: { 
  application: GovernmentApplication | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onCancelService?: (app: GovernmentApplication) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents'>('overview');

  if (!application) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F5F7FA]">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                  {application.serviceType} Application
                </span>
                <h2 className="text-lg font-extrabold text-[#111827]">
                  {application.referenceNumber || 'Pending Ref'}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-stone-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Status Banner */}
            <div className={cn(
              "px-6 py-3 flex items-center gap-3 border-b",
              application.status === 'Approved' || application.status === 'Confirmed' 
                ? "bg-green-50 border-green-100 text-green-800"
                : application.status === 'Under Review' || application.status === 'Submitted'
                  ? "bg-amber-50 border-amber-100 text-amber-800"
                  : application.status === 'Cancelled'
                    ? "bg-red-50 border-red-100 text-red-800"
                    : "bg-stone-50 border-stone-200 text-stone-600"
            )}>
              {application.status === 'Approved' || application.status === 'Confirmed' ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : application.status === 'Cancelled' ? (
                <X size={20} className="text-red-600" />
              ) : (
                <Clock size={20} className="text-amber-600" />
              )}
              <div className="flex-1">
                <h4 className="text-sm font-bold">{application.status}</h4>
                <p className="text-xs opacity-80">{application.currentStage}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center px-6 border-b border-[#E5E7EB]">
              {['overview', 'timeline', 'documents'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors",
                    activeTab === tab 
                      ? "border-[#005BAC] text-[#005BAC]" 
                      : "border-transparent text-[#6B7280] hover:text-[#111827]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#FAFBFC]">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Generic Key-Value Pairs from the application object */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
                      Application Details
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                      <div>
                        <span className="block text-[10px] text-[#6B7280] uppercase">Submitted On</span>
                        <span className="font-semibold text-[#111827]">
                          {application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#6B7280] uppercase">Last Updated</span>
                        <span className="font-semibold text-[#111827]">
                          {application.lastUpdated ? new Date(application.lastUpdated).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      {/* Dynamic fields based on serviceType */}
                      {Object.entries(application).map(([key, value]) => {
                        if (
                          ['applicationId', 'serviceType', 'status', 'referenceNumber', 'applicationDate', 'lastUpdated', 'currentStage', 'availableDocuments', 'activityTimeline', 'audit'].includes(key)
                        ) return null;
                        
                        if (typeof value === 'object') return null;

                        return (
                          <div key={key} className="col-span-2 sm:col-span-1">
                            <span className="block text-[10px] text-[#6B7280] uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="font-semibold text-[#111827]">{String(value) || '—'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
                    Activity Timeline
                  </h3>
                  <div className="relative border-l border-stone-200 ml-3 space-y-6">
                    {application.activityTimeline?.map((evt, idx) => (
                      <div key={evt.eventId || idx} className="relative pl-6">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#005BAC] border-2 border-white" />
                        <p className="text-xs font-bold text-[#111827]">{evt.eventType}</p>
                        <p className="text-[10px] text-[#6B7280]">{new Date(evt.timestamp).toLocaleString()}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-stone-100 text-stone-600 text-[9px] rounded font-semibold">
                          {evt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
                    Official Documents
                  </h3>
                  
                  {(!application.availableDocuments || application.availableDocuments.length === 0) ? (
                    <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg text-center space-y-2">
                      <AlertCircle size={24} className="mx-auto text-stone-400" />
                      <p className="text-sm font-semibold text-stone-700">No Documents Available</p>
                      <p className="text-xs text-stone-500">
                        Documents will be generated automatically once your application is {application.serviceType === 'Vehicle' ? 'Approved' : 'Confirmed'}.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {application.availableDocuments.map(doc => (
                        <div key={doc.id} className="bg-white border border-[#E5E7EB] p-4 rounded-lg flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#F5F7FA] rounded flex items-center justify-center text-[#005BAC]">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#111827]">{doc.title}</p>
                              <p className="text-xs text-[#6B7280]">{doc.fileName}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const getCredentialType = (service: string) => {
                                switch (service) {
                                  case 'Vehicle': return 'VEHICLE_PASS';
                                  case 'Accommodation': return 'ACCOMMODATION_PASS';
                                  case 'Darshan':
                                  case 'Snan': return 'PILGRIM_IDENTITY';
                                  default: return 'REGISTRATION_CERTIFICATE';
                                }
                              };
                              window.location.href = `/account/documents/showcase?type=${getCredentialType(application.serviceType)}`;
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#005BAC] text-white text-xs font-bold rounded hover:bg-[#0F4C81] transition-colors cursor-pointer border-none"
                          >
                            <Download size={14} />
                            OPEN & EXPORT
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#E5E7EB] bg-white grid grid-cols-2 gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-[#374151] bg-[#F3F4F6] rounded-lg hover:bg-[#E5E7EB] transition-colors"
              >
                Close
              </button>
              {(application.status === 'Submitted' || application.status === 'Under Review') ? (
                <button 
                  disabled
                  className="px-4 py-2 text-sm font-bold text-white bg-amber-500 rounded-lg flex items-center justify-center gap-2 opacity-80 cursor-not-allowed"
                >
                  <RefreshCw size={14} className="animate-spin" />
                  Processing
                </button>
              ) : application.status !== 'Cancelled' && application.status !== 'Completed' ? (
                <button 
                  onClick={() => onCancelService && onCancelService(application)}
                  className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Cancel Service
                </button>
              ) : (
                 <button 
                  disabled
                  className="px-4 py-2 text-sm font-bold text-[#6B7280] bg-[#F3F4F6] rounded-lg flex items-center justify-center gap-2 opacity-80 cursor-not-allowed"
                >
                  Cancelled
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
