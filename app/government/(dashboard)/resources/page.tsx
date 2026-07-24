import React from 'react';

export default function ResourceManagementPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="border-b border-slate-800 pb-4 shrink-0">
        <h1 className="text-2xl font-bold text-white tracking-wide">RESOURCE MANAGEMENT</h1>
        <p className="text-slate-500 text-sm mt-1">Cross-Department Asset Tracking and Dispatch</p>
      </header>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center">
        <div className="text-slate-500 text-center space-y-4">
          <span className="text-4xl block">🚒</span>
          <p className="text-sm font-semibold tracking-wide uppercase">Module In Development</p>
          <p className="text-xs max-w-md">The Resource Registry will mount here, mapping active patrol units, medical teams, and emergency vehicles across the city.</p>
        </div>
      </div>
    </div>
  );
}
