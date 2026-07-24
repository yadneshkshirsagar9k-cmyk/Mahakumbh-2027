'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { operationalModuleRegistry } from '@/services/registry/OperationalModuleRegistry';
import { governmentWorkspaceRegistry } from '@/services/registry/GovernmentWorkspaceRegistry';
import { useGovernmentAuthStore } from '@/store/government/governmentAuthStore';

const STATIC_ROUTES = [
  { name: 'Overview', href: '/government/dashboard', icon: '📊' },
  { name: 'Integrated Command Centre', href: '/government/iccc', icon: '🌍' },
  { name: 'Citizen Services', href: '/government/citizen-services', icon: '👥' },
  { name: 'Incident Management', href: '/government/incidents', icon: '🚨' },
  { name: 'Resource Management', href: '/government/resources', icon: '🚒' },
  { name: 'Emergency Operations', href: '/government/emergency', icon: '⚠️' },
  { name: 'Analytics', href: '/government/analytics', icon: '📈' },
  { name: 'Audit Centre', href: '/government/audit', icon: '📋' },
  { name: 'System Monitoring', href: '/government/monitoring', icon: '🖥️' },
  { name: 'Officer Directory', href: '/government/directory', icon: '📇' },
  { name: 'Settings', href: '/government/settings', icon: '⚙️' },
];

export default function GovernmentSidebar() {
  const pathname = usePathname();
  const dynamicModules = operationalModuleRegistry.getAll();
  const dynamicWorkspaces = governmentWorkspaceRegistry.getAll();
  const profile = useGovernmentAuthStore((state) => state.profile);

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-wide">GOV OPERATIONS</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Mahakumbh 2027</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {STATIC_ROUTES.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{route.icon}</span>
                {route.name}
              </Link>
            );
          })}

          {dynamicWorkspaces.length > 0 && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Department Workspaces
                </p>
              </div>
              {dynamicWorkspaces.map((ws) => (
                <Link
                  key={ws.workspaceId}
                  href={ws.route}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                    pathname.startsWith(ws.route)
                      ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🏢</span>
                  {ws.department}
                </Link>
              ))}
            </>
          )}

          {dynamicModules.length > 0 && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Modules
                </p>
              </div>
              {dynamicModules.map((mod) => (
                <Link
                  key={mod.moduleId}
                  href={mod.navigationRoute}
                  className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium hover:bg-slate-800 hover:text-white"
                >
                  <span>🧩</span>
                  {mod.displayName}
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>

      {profile && (
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{profile.fullName}</p>
              <p className="text-xs text-slate-500">{profile.designation}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
