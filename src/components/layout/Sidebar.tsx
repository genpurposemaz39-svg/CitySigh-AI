import React from 'react';

export type NavigationPath =
  | 'dashboard'
  | 'live-cameras'
  | 'anpr-ocr'
  | 'vehicle-search'
  | 'trajectory-tracking'
  | 'traffic-analytics'
  | 'alerts-intelligence'
  | 'camera-management'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  activeAlertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  activeAlertCount = 7,
}) => {
  const navItems: { id: NavigationPath; label: string; icon: string; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'live-cameras', label: 'Live Cameras', icon: 'videocam' },
    { id: 'anpr-ocr', label: 'ANPR / OCR', icon: 'document_scanner' },
    { id: 'vehicle-search', label: 'Vehicle Search', icon: 'directions_car' },
    { id: 'trajectory-tracking', label: 'Trajectory Tracking', icon: 'route' },
    { id: 'traffic-analytics', label: 'Traffic Analytics', icon: 'analytics' },
    { id: 'alerts-intelligence', label: 'Alerts & Intelligence', icon: 'notifications_active', badge: activeAlertCount > 0 ? activeAlertCount : undefined },
    { id: 'camera-management', label: 'Camera Management', icon: 'settings_suggest' },
    { id: 'reports', label: 'Reports', icon: 'description' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <aside
      id="main-sidebar"
      className="fixed left-0 top-0 h-screen w-64 bg-[#0b1329] border-r border-[#1e293b] z-50 flex flex-col justify-between overflow-hidden shadow-2xl"
    >
      <div className="flex flex-col h-full">
        {/* Brand Header */}
        <div className="px-5 pt-5 pb-4 border-b border-[#1e293b]">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            {/* SVG Logo Emblem from Stitch Screen 10 */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1d4ed8] to-[#0284c7] p-1.5 flex items-center justify-center shadow-lg shadow-blue-900/30 flex-shrink-0">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <path d="M12 38V26L18 26V20L24 16L30 20V24L36 24V38H12Z" fill="white" fillOpacity="0.25" />
                <path d="M16 38V28H20V38H16Z" fill="white" fillOpacity="0.8" />
                <path d="M22 38V22H26V38H22Z" fill="#38bdf8" />
                <path d="M28 38V29H32V38H28Z" fill="white" fillOpacity="0.8" />
                <circle cx="24" cy="24" r="14" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="24" cy="24" r="4" fill="#00f0ff" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="font-bold tracking-tight text-white leading-none text-base">CitySight</span>
                <span className="font-bold tracking-tight text-[#38bdf8] leading-none text-base">.AI</span>
              </div>
              <span className="text-[0.625rem] text-[#94a3b8] tracking-wider uppercase mt-1 font-semibold">
                Vision Intelligence
              </span>
            </div>
          </div>
          <p className="text-[0.6875rem] text-[#64748b] mt-3.5 tracking-tight font-medium">
            Smarter Cities. Safer Tomorrow.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
          <p className="px-3 pb-2 text-[0.625rem] font-bold uppercase tracking-wider text-[#64748b]">
            Command Operations
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm text-left group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2563eb] to-[#0284c7] text-white shadow-md font-semibold'
                      : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[1.25rem] transition-colors ${
                        isActive ? 'text-white' : 'text-[#94a3b8] group-hover:text-white'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[0.625rem] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Telemetry Card */}
        <div className="p-4 border-t border-[#1e293b] bg-[#070d1e]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#57dffe] animate-ping"></div>
            <span className="text-[0.625rem] uppercase tracking-wider text-[#57dffe] font-semibold">
              Telemetry Edge Mesh
            </span>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-2.5 text-center shadow-inner">
            <p className="text-[0.6875rem] text-[#94a3b8] font-medium leading-relaxed">
              AI-Powered Urban Mobility for Safer, Smarter Cities
            </p>
            <span className="inline-block mt-1 font-mono text-[0.625rem] tracking-wider text-[#64748b]">
              v2.4 SIH Enterprise Build
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
