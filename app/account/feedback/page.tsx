'use client';

/**
 * @file Feedback & Grievance Page
 * @description Official Grievance tracking portal for filing complaints, suggestions, or missing reports.
 */

import { useState } from 'react';
import { MessageSquare, ListFilter, PlusCircle, CheckCircle, AlertTriangle, Upload, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

interface GrievanceItem {
  id: string;
  category: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'Submitted' | 'Under Investigation' | 'Resolved';
  date: string;
}

const INITIAL_GRIEVANCES: GrievanceItem[] = [
  { id: 'GR-9921', category: 'Complaint', subject: 'Inoperative water tap near Sadhugram Sector-C', priority: 'medium', status: 'Resolved', date: '2027-07-10' },
  { id: 'GR-9945', category: 'Technical Issue', subject: 'Digital Pass QR not rendering on dashboard', priority: 'high', status: 'Under Investigation', date: '2027-07-12' },
];

export default function FeedbackGrievancePage() {
  const [grievances, setGrievances] = useState<GrievanceItem[]>(INITIAL_GRIEVANCES);
  const [category, setCategory] = useState('Complaint');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'emergency'>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    const newId = 'GR-' + Math.floor(9000 + Math.random() * 1000);
    const newG: GrievanceItem = {
      id: newId,
      category,
      subject,
      priority,
      status: 'Submitted',
      date: new Date().toISOString().split('T')[0],
    };

    setGrievances([newG, ...grievances]);
    setSuccessMsg(`Grievance submitted successfully. Reference ID: ${newId}`);
    setSubject('');
    setDescription('');
    setUploadedFile(null);

    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-[#111827] font-[var(--font-heading)]">
          Feedback & Grievance Lodging
        </h1>
        <p className="text-xs text-[#6B7280]">
          File complaints, submit general suggestions, or report technical and medical issues to the administration.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800 animate-fadeIn">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lodging Form */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <PlusCircle size={16} className="text-[#005BAC]" />
            <h3 className="font-extrabold text-sm text-[#111827]">Lodge Official Request</h3>
          </div>

          <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#374151] block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none font-semibold"
                >
                  <option value="Complaint">Complaint</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Missing Person Report">Missing Person Report</option>
                  <option value="Emergency Report">Emergency Report</option>
                  <option value="Technical Issue">Technical Issue</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#374151] block">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none font-semibold"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="emergency">Emergency / Alert</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#374151] block">Subject / Short Title</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject heading"
                className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#374151] block">Detailed Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed description of your request or issue..."
                className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none resize-none"
              />
            </div>

            {/* Mock Image Upload */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#374151] block">Attachment (JPEG/PNG)</label>
              <div className="relative border border-dashed border-[#E5E7EB] hover:border-[#005BAC] rounded p-4 text-center cursor-pointer transition-colors bg-[#FAFBFC]">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setUploadedFile(e.target.files[0].name);
                    }
                  }}
                />
                <div className="flex flex-col items-center gap-1">
                  <Upload size={16} className="text-[#005BAC]" />
                  <span className="text-[11px] font-semibold text-[#374151]">
                    {uploadedFile || 'Upload reference image / medical clearance copy'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#005BAC] hover:bg-[#0F4C81] text-white font-bold rounded uppercase tracking-wider transition-all select-none cursor-pointer border-none outline-none"
            >
              Lodge Request
            </button>
          </form>
        </div>

        {/* History Tracker */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <MessageSquare size={16} className="text-[#005BAC]" />
            <h3 className="font-extrabold text-sm text-[#111827]">Track Grievances</h3>
          </div>

          <div className="space-y-3">
            {grievances.map((g) => (
              <div key={g.id} className="p-3 border border-[#E5E7EB] rounded bg-[#FAFBFC] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#005BAC]">{g.id}</span>
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider',
                    g.status === 'Resolved'
                      ? 'bg-[#F0FDF4] text-[#2E7D32]'
                      : 'bg-[#FFFBEB] text-[#F59E0B]'
                  )}>
                    {g.status}
                  </span>
                </div>
                <h4 className="font-bold text-[#111827] truncate">{g.subject}</h4>
                <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-1.5 border-t border-[#E5E7EB]">
                  <span>Category: {g.category}</span>
                  <span>Date: {g.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
