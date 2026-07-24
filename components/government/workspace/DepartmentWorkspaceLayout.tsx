'use client';
import { useState } from 'react';
import DepartmentHeader from './DepartmentHeader';

interface LayoutProps {
  departmentId: string;
  departmentName: string;
  children: (activeTab: string) => React.ReactNode;
}

export default function DepartmentWorkspaceLayout({ departmentId, departmentName, children }: LayoutProps) {
  const [activeTab, setActiveTab] = useState('incidents');

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#0a0f18] -m-8">
      <DepartmentHeader deptName={departmentName} />
      
      <div className="flex bg-slate-900 border-b border-slate-800 shrink-0 px-4">
        {[
          { id: 'incidents', label: 'Incident Command' },
          { id: 'resources', label: 'Assets & Resources' },
          { id: 'tasks', label: 'Missions & Tasks' },
          { id: 'schedule', label: 'Calendar & Schedule' },
          { id: 'comms', label: 'Communications & Handover' },
          { id: 'kb', label: 'Knowledge Base' },
          { id: 'activity', label: 'Activity Feed' } // Placeholder for future Activity Feeds
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === tab.id ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden relative p-4 bg-black">
        <div className="h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl flex flex-col">
          {children(activeTab)}
        </div>
      </div>
    </div>
  );
}
