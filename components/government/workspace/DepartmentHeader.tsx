'use client';
import { useDepartmentStore } from '@/store/government/operations/departmentStore';

export default function DepartmentHeader({ deptName }: { deptName: string }) {
  const { status, shiftInfo, slaHealth } = useDepartmentStore();

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-4 shrink-0 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide uppercase">{deptName} COMMAND</h1>
        <div className="flex gap-4 mt-2 text-xs font-semibold tracking-wide">
          <span className={`px-2 py-0.5 rounded ${status === 'Operational' ? 'bg-green-900/50 text-green-400' : 'bg-orange-900/50 text-orange-400'}`}>
            STATUS: {status.toUpperCase()}
          </span>
          <span className="text-slate-400 border-l border-slate-700 pl-4">
            SHIFT: {shiftInfo.activeShift.toUpperCase()}
          </span>
          <span className="text-slate-400 border-l border-slate-700 pl-4">
            SUPERVISOR: {shiftInfo.supervisor.toUpperCase()}
          </span>
          <span className="text-slate-400 border-l border-slate-700 pl-4">
            STRENGTH: {shiftInfo.strength}
          </span>
        </div>
      </div>
      
      <div className="flex gap-6 items-center">
        {/* Placeholder: Workforce Capacity */}
        <div className="text-right border-r border-slate-700 pr-4">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Workforce Capacity</span>
          <span className="text-xs font-semibold text-white">82% Available</span>
        </div>

        {/* Placeholder: Department Health Score */}
        <div className="text-right border-r border-slate-700 pr-4">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Dept Health</span>
          <span className="text-xs font-semibold text-green-400">9.4/10</span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">SLA Health</span>
          <div className="w-32 bg-slate-800 h-2 rounded overflow-hidden">
            <div className={`h-full ${slaHealth > 90 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${slaHealth}%` }}></div>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded transition-colors shadow shadow-blue-900/20">
          Quick Actions ⚡
        </button>
      </div>
    </div>
  );
}
