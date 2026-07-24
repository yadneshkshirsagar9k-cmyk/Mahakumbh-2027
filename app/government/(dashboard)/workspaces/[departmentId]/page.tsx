'use client';

import { use } from 'react';
import DepartmentWorkspaceLayout from '@/components/government/workspace/DepartmentWorkspaceLayout';
import IncidentManager from '@/components/government/workspace/IncidentManager';

export default function DepartmentWorkspacePage({ params }: { params: Promise<{ departmentId: string }> }) {
  const { departmentId: deptId } = use(params);
  const deptName = deptId.charAt(0).toUpperCase() + deptId.slice(1);

  return (
    <DepartmentWorkspaceLayout departmentId={deptId} departmentName={deptName}>
      {(activeTab) => (
        <>
          {activeTab === 'incidents' && <IncidentManager deptId={deptId} />}
          
          {activeTab === 'resources' && (
            <div className="flex items-center justify-center h-full text-slate-500 italic">
              Resource & Asset Manager module will mount here.
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="flex items-center justify-center h-full text-slate-500 italic">
              Task & Mission Board module will mount here.
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="flex items-center justify-center h-full text-slate-500 italic">
              Operational Calendar & Schedule module will mount here.
            </div>
          )}

          {activeTab === 'comms' && (
            <div className="flex items-center justify-center h-full text-slate-500 italic">
              Communications & Shift Handover module will mount here.
            </div>
          )}

          {activeTab === 'kb' && (
            <div className="flex items-center justify-center h-full text-slate-500 italic">
              Department Knowledge Base & SOPs will mount here.
            </div>
          )}
        </>
      )}
    </DepartmentWorkspaceLayout>
  );
}
