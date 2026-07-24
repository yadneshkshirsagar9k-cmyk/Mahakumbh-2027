'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/government/citizen-services/dashboard', icon: '📈' },
    { name: 'Citizen Directory', href: '/government/citizen-services/directory', icon: '👥' },
    { name: 'Verification Centre', href: '/government/citizen-services/verification', icon: '✅' },
    { name: 'Bulk Review', href: '/government/citizen-services/bulk-review', icon: '📋' },
    { name: 'Grievances', href: '/government/citizen-services/grievances', icon: '⚠️' },
    { name: 'Exception Queue', href: '/government/citizen-services/exceptions', icon: '🚨' },
    { name: 'Linked Cases', href: '/government/citizen-services/linked-cases', icon: '🔗' },
    { name: 'Settings', href: '/government/citizen-services/settings', icon: '⚙️' }
  ];

  return (
    <div className="w-56 bg-slate-900 border-r border-slate-800 h-full flex flex-col p-4 shrink-0">
      <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Administration</h2>
      <div className="flex flex-col gap-1">
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-xs font-medium ${
              pathname.includes(l.href)
                ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span>{l.icon}</span>
            {l.name}
          </Link>
        ))}
      </div>
      
      <div className="mt-auto">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Admin KPIs</h3>
        <div className="bg-slate-800/50 rounded p-3 border border-slate-700/50 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400">Admin Health</span>
              <span className="text-[10px] text-green-400 font-mono">98%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden">
              <div className="bg-green-500 h-full w-[98%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400">Workload</span>
              <span className="text-[10px] text-orange-400 font-mono">85%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden">
              <div className="bg-orange-500 h-full w-[85%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400">Performance</span>
              <span className="text-[10px] text-green-400 font-mono">94%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden">
              <div className="bg-green-500 h-full w-[94%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
