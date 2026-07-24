import React from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="border-b border-slate-800 pb-4 shrink-0">
        <h1 className="text-2xl font-bold text-white tracking-wide">PLATFORM SETTINGS</h1>
        <p className="text-slate-500 text-sm mt-1">Configuration, Access Control, and Preferences</p>
      </header>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center">
        <div className="text-slate-500 text-center space-y-4">
          <span className="text-4xl block">⚙️</span>
          <p className="text-sm font-semibold tracking-wide uppercase">Module In Development</p>
          <p className="text-xs max-w-md">Global notification routing rules, display preferences, and integration API keys can be managed here.</p>
        </div>
      </div>
    </div>
  );
}
