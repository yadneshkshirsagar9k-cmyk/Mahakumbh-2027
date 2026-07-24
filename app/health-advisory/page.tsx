'use client';

/**
 * @file Health Advisory PDF Portal
 * @description Built-in PDF reader for the official Health Advisory.
 * Offers pagination controls, collapsible sidebars, and reading progress indicators.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCw, 
  Printer, 
  Download, 
  BookOpen, 
  HelpCircle, 
  Info, 
  ShieldAlert, 
  Menu, 
  X,
  Compass,
  Globe
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PDFDocument, QuickGuideline, HelpContact } from '@/types/health.types';
import { cn } from '@/utils/cn';

// ============================================================
// DATA MODELS MOCKS (Section 3 & 4)
// ============================================================

const HEALTH_ADVISORY_DATA: PDFDocument = {
  id: 'doc-advisory-1',
  name: 'Official Health Advisory & Medical Guidelines (Simhastha)',
  url: '/health_advisory.pdf',
  totalPages: 5, // Standard advisory booklet page count
  lastUpdated: '11th July 2026',
  issuedBy: 'Directorate of Health Services (DHS), Govt of Maharashtra'
};

const QUICK_GUIDELINES: QuickGuideline[] = [
  {
    id: 'ha-qg-1',
    title: 'Purpose of this Advisory',
    content: [
      'Sets baseline sanitary precautions, food safety guidelines, and vector-borne outbreak alerts.',
      'Defines safety zones for mass gatherings at Nashik and Trimbakeshwar sectors.'
    ]
  },
  {
    id: 'ha-qg-2',
    title: 'How to Use this Document',
    content: [
      'Reference Section 3 for nearest first-aid coordinates.',
      'Verify quarantine alerts before traveling from high-risk disease states.'
    ]
  },
  {
    id: 'ha-qg-3',
    title: 'Important Health Reminder',
    content: [
      'Vaccination against Cholera and Typhoid is highly recommended prior to arrival.'
    ]
  }
];

const HELP_CONTACTS: HelpContact[] = [
  { department: 'Epidemic Monitoring Cell', phone: '+91-253-2576104', availability: '24 Hours' },
  { department: 'Simhastha Health Helpline', phone: '104', availability: '24 Hours' }
];

// ============================================================
// COMPONENT
// ============================================================

export default function HealthAdvisoryPortal() {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const progressPercent = Math.round((currentPage / HEALTH_ADVISORY_DATA.totalPages) * 100);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= HEALTH_ADVISORY_DATA.totalPages) {
      setCurrentPage(page);
      setIframeKey((prev) => prev + 1);
    }
  };

  const handleZoom = (type: 'in' | 'out' | 'fit-width' | 'fit-page') => {
    if (type === 'in') {
      setZoomLevel((prev) => Math.min(prev + 20, 200));
    } else if (type === 'out') {
      setZoomLevel((prev) => Math.max(prev - 20, 60));
    } else if (type === 'fit-width') {
      setZoomLevel(130);
    } else {
      setZoomLevel(100);
    }
  };

  const toggleFullscreen = () => {
    const viewerElement = document.getElementById('pdf-viewer-container');
    if (!viewerElement) return;

    if (!isFullscreen) {
      if (viewerElement.requestFullscreen) {
        viewerElement.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFBFC] text-[#111827]">
      <Navbar />

      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          
          {/* SECTION 1: PAGE HEADER */}
          <div className="text-left space-y-2 border-b border-[#E5E7EB] pb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF9933]">
              Pilgrim Safety Documents
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] font-[var(--font-heading)]">
              Health Advisory
            </h1>
            <p className="text-xs sm:text-sm text-[#374151]">
              Please read the official Health Advisory carefully before beginning your pilgrimage.
            </p>
          </div>

          {/* SECTION 3: DOCUMENT METADATA */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white border border-[#E5E7EB] text-xs text-left shadow-sm">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#6B7280]">Document Title</span>
              <p className="font-extrabold text-[#111827] truncate">{HEALTH_ADVISORY_DATA.name}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-[#6B7280]">Total Pages</span>
              <p className="font-extrabold text-[#111827]">{HEALTH_ADVISORY_DATA.totalPages} Pages (Optimized)</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-[#6B7280]">Last Updated</span>
              <p className="font-extrabold text-[#111827]">{HEALTH_ADVISORY_DATA.lastUpdated}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-[#6B7280]">Issued Authority</span>
              <p className="font-extrabold text-[#111827] truncate">{HEALTH_ADVISORY_DATA.issuedBy}</p>
            </div>
          </div>

          {/* SPLIT VIEWER INTERFACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Side: PDF Viewer Frame */}
            <div className="lg:col-span-8 flex flex-col bg-white border border-[#E5E7EB] rounded-2xl shadow-md overflow-hidden min-h-[600px] relative">
              
              {/* TOP VIEWER TOOLBAR */}
              <div className="p-3 bg-[#FAFBFC] border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1.5 rounded bg-white border border-[#E5E7EB] hover:bg-[#FAFBFC] cursor-pointer"
                    title="Toggle Sidebar"
                  >
                    <Menu size={14} />
                  </button>
                  
                  <span className="font-bold text-[#111827] hidden sm:inline">
                    Advisory Page
                  </span>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-1.5 rounded bg-white border border-[#E5E7EB] hover:bg-[#FAFBFC] disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={currentPage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= HEALTH_ADVISORY_DATA.totalPages) handlePageChange(val);
                      }}
                      className="w-10 p-1 text-center font-bold bg-white border border-[#E5E7EB] rounded outline-none"
                    />
                    <span className="text-[#6B7280]">/ {HEALTH_ADVISORY_DATA.totalPages}</span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= HEALTH_ADVISORY_DATA.totalPages}
                    className="p-1.5 rounded bg-white border border-[#E5E7EB] hover:bg-[#FAFBFC] disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Zoom & Fullscreen Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleZoom('out')}
                    className="p-1.5 rounded bg-white border border-[#E5E7EB] hover:bg-[#FAFBFC] cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="font-bold w-10 text-center">{zoomLevel}%</span>
                  <button
                    onClick={() => handleZoom('in')}
                    className="p-1.5 rounded bg-white border border-[#E5E7EB] hover:bg-[#FAFBFC] cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>

                  <span className="text-[#E5E7EB]">|</span>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded bg-white border border-[#E5E7EB] hover:bg-[#FAFBFC] cursor-pointer"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 size={14} />
                  </button>

                  <a
                    href={HEALTH_ADVISORY_DATA.url}
                    download
                    className="p-1.5 rounded bg-white border border-[#E5E7EB] hover:bg-[#FAFBFC] text-[#005BAC] cursor-pointer flex items-center justify-center"
                    title="Download Document"
                  >
                    <Download size={14} />
                  </a>
                </div>
              </div>

              {/* MAIN PDF VIEWPORT & SIDEBAR SPLIT */}
              <div className="flex-grow flex items-stretch min-h-[500px]">
                
                {/* Thumbnails Sidebar (Left) */}
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 140, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="border-r border-[#E5E7EB] bg-[#FAFBFC] flex-shrink-0 overflow-y-auto p-3 space-y-2 hidden sm:block"
                    >
                      <span className="block text-[8px] font-bold uppercase tracking-wider text-[#6B7280] mb-2">
                        Thumbnails
                      </span>
                      {Array.from({ length: HEALTH_ADVISORY_DATA.totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isCurrent = pageNum === currentPage;
                        
                        return (
                          <div
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={cn(
                              'p-2.5 rounded-lg border text-center cursor-pointer transition-all duration-150',
                              isCurrent 
                                ? 'bg-[#FFF5EB] border-[#FF9933] text-[#FF9933] font-extrabold shadow-sm'
                                : 'bg-white border-[#E5E7EB] hover:border-[#FF9933]/20'
                            )}
                          >
                            <FileText size={20} className="mx-auto text-[#6B7280] mb-1" />
                            <span className="text-[9px]">Page {pageNum}</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* PDF Frame embed (Center) */}
                <div 
                  id="pdf-viewer-container" 
                  className="flex-grow bg-[#FAFBFC] relative p-4 flex items-center justify-center overflow-auto"
                >
                  <iframe
                    key={`${HEALTH_ADVISORY_DATA.url}-${currentPage}-${iframeKey}`}
                    src={`${HEALTH_ADVISORY_DATA.url}#page=${currentPage}&zoom=${zoomLevel}`}
                    className="w-full h-full border border-[#E5E7EB] shadow-lg rounded-lg"
                    style={{ minHeight: '520px' }}
                    title="Health Advisory PDF Viewer"
                  />
                  <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded bg-white border border-[#E5E7EB] shadow text-[9px] font-bold text-[#005BAC]">
                    Current Page: {currentPage} / {HEALTH_ADVISORY_DATA.totalPages}
                  </div>
                </div>

              </div>

            </div>

            {/* Right Side: Quick Info & Reading Progress (Section 4 & 5) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* SECTION 5: READING PROGRESS */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={16} className="text-[#005BAC]" />
                  <span>Reading Progress</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#374151]">
                    <span>Advisory Read:</span>
                    <span className="text-[#FF9933]">{progressPercent}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#FAFBFC] border border-[#E5E7EB] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#005BAC] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] text-[#6B7280]">
                    <div>
                      <span className="block font-bold">Recently Viewed</span>
                      <p className="font-extrabold text-[#005BAC] mt-0.5">Page {currentPage}</p>
                    </div>

                    <div>
                      <span className="block font-bold">Reading Action</span>
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= HEALTH_ADVISORY_DATA.totalPages}
                        className="text-[#FF9933] hover:underline font-extrabold text-[10px] disabled:opacity-50 disabled:no-underline mt-0.5 block bg-transparent border-none cursor-pointer p-0"
                      >
                        Continue Reading
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: QUICK INFORMATION PANEL */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                  <Info size={16} className="text-[#005BAC]" />
                  <span>Advisory Quick Info</span>
                </h3>

                <div className="space-y-4 text-xs text-left">
                  {QUICK_GUIDELINES.map((guide) => (
                    <div key={guide.id} className="space-y-1.5">
                      <span className="font-bold text-[#FF9933] uppercase text-[9px] tracking-wider">
                        {guide.title}
                      </span>
                      <ul className="space-y-1 text-[#374151] leading-normal list-none p-0 m-0">
                        {guide.content.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-[#FF9933]">•</span>
                            <p>{point}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Multilingual Support indicator */}
                  <div className="p-3.5 rounded-xl bg-[#FFF5EB] border border-[#FF9933]/15 text-[10px] font-bold text-[#FF9933] flex items-center gap-2">
                    <Globe size={16} className="text-[#FF9933]" />
                    <span>Multilingual support pending (Hindi & Marathi versions translating).</span>
                  </div>

                  {/* Emergency contacts */}
                  <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
                    <span className="font-bold text-red-550 uppercase text-[9px] tracking-wider flex items-center gap-1">
                      <ShieldAlert size={10} className="animate-pulse" />
                      <span>Advisory Medical Helplines</span>
                    </span>
                    <div className="space-y-1.5 text-[11px] text-[#374151]">
                      {HELP_CONTACTS.map((hc, idx) => (
                        <div key={idx} className="flex justify-between font-medium">
                          <span>{hc.department}:</span>
                          <span className="font-bold text-[#005BAC]">{hc.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
