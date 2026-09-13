import React, { useState, useRef, useEffect } from 'react';
import { NavigationPath } from './Sidebar';
import { CCTV_IMAGES } from '../../data/mockData';

interface HeaderProps {
  onNavigate: (path: NavigationPath) => void;
  onSearchSelectVehicle: (plate: string) => void;
  onSearchSelectCamera: (cameraId: string) => void;
  currentTime: string;
  currentDate: string;
  onResetDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onSearchSelectVehicle,
  onSearchSelectCamera,
  currentTime,
  currentDate,
  onResetDemo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Suggested database items for instant global search
  const suggestions = [
    { type: 'vehicle', title: 'GJ05AB1234', subtitle: 'SUV • White Hyundai Creta (Verified)', value: 'GJ05AB1234', tag: 'High Confidence 96.8%' },
    { type: 'vehicle', title: 'DL8CAF7321', subtitle: 'SUV • Black Toyota Fortuner (Blacklisted)', value: 'DL8CAF7321', tag: 'BOLO Alert' },
    { type: 'vehicle', title: 'MH12MK4587', subtitle: 'SUV • Mahindra Scorpio (Route Anomaly)', value: 'MH12MK4587', tag: 'Suspicious' },
    { type: 'vehicle', title: 'UP32AB5678', subtitle: 'Sedan • Honda City (Overspeeding 94km/h)', value: 'UP32AB5678', tag: 'Speed Flag' },
    { type: 'camera', title: 'Cam 01 — Expressway North', subtitle: 'Sector 14 Arterial Corridor • 25 FPS', value: 'CAM-01', tag: 'Live' },
    { type: 'camera', title: 'Cam 02 — Central Square Junction', subtitle: 'Civic Plaza Intersection • 30 FPS', value: 'CAM-02', tag: 'Congestion' },
    { type: 'camera', title: 'Cam 03 — Ring Road Flyover Ramp', subtitle: 'NH-44 Interchange Junction • 25 FPS', value: 'CAM-03', tag: 'Live' },
    { type: 'camera', title: 'Cam 05 — Airport Expressway', subtitle: 'Terminal 2 Approach Corridor', value: 'CAM-05', tag: 'Free Flow' },
    { type: 'location', title: 'Airport Road / Concourse', subtitle: 'Radial flow connecting Terminal 2 & Expressway', value: 'CAM-05', tag: 'Corridor' },
    { type: 'location', title: 'Central Square Roundabout', subtitle: 'M.G. Road Arterial Crossing', value: 'CAM-12', tag: 'Corridor' },
  ];

  const filtered = searchQuery.trim() === ''
    ? suggestions.slice(0, 5)
    : suggestions.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.value.toLowerCase().includes(searchQuery.toLowerCase())
      );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: typeof suggestions[0]) => {
    setIsOpen(false);
    setSearchQuery('');
    if (item.type === 'vehicle') {
      onSearchSelectVehicle(item.value);
      onNavigate('vehicle-search');
    } else if (item.type === 'camera' || item.type === 'location') {
      onSearchSelectCamera(item.value);
      onNavigate('live-cameras');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      handleSelect(filtered[0]);
    }
  };

  return (
    <header
      id="top-header"
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-surface-container-lowest border-b border-outline-variant/30 shadow-xs"
    >
      {/* Global Search with Autocomplete */}
      <div className="relative flex-1 max-w-xl" ref={dropdownRef}>
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[1.25rem] pointer-events-none">
            search
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search vehicle number (e.g. GJ05AB1234), camera ID, location..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface rounded-lg border border-outline-variant/60 placeholder:text-on-surface-variant/60 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all font-body-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 mt-1.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-xl z-50 overflow-hidden py-1 max-h-96 overflow-y-auto">
            <div className="px-3 py-1.5 border-b border-outline-variant/20 flex items-center justify-between text-[0.6875rem] font-semibold text-on-surface-variant uppercase tracking-wider">
              <span>Quick Telemetry Lookup</span>
              <span>Press Enter ↵</span>
            </div>
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                No matching vehicles, cameras, or corridors found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              filtered.map((item, idx) => (
                <button
                  key={`${item.type}-${item.value}-${idx}`}
                  onClick={() => handleSelect(item)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-surface-container transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[1.25rem] text-primary p-1.5 rounded-lg bg-surface-container-high group-hover:bg-primary group-hover:text-white transition-colors">
                      {item.type === 'vehicle'
                        ? 'directions_car'
                        : item.type === 'camera'
                        ? 'videocam'
                        : 'location_on'}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-on-surface flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[0.625rem] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-xs text-on-surface-variant">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[0.6875rem] font-medium px-2 py-0.5 rounded-full bg-surface-container text-primary">
                    {item.tag}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Telemetry Status, Clock & Profile */}
      <div className="flex items-center gap-4 ml-6">
        {/* Demo Mode Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[0.6875rem] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>SIH 2026 PROTOTYPE</span>
        </div>

        {/* System Online Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="font-label-telemetry text-xs font-semibold text-emerald-700 tracking-wide">
            System Online
          </span>
        </div>

        {/* Date */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/40">
          <span className="material-symbols-outlined text-[1rem] text-secondary">calendar_today</span>
          <span className="font-label-telemetry text-xs font-semibold text-on-surface-variant">{currentDate}</span>
        </div>

        {/* Time */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/40">
          <span className="material-symbols-outlined text-[1rem] text-secondary">schedule</span>
          <span className="font-label-telemetry text-xs font-semibold text-on-surface-variant">{currentTime}</span>
        </div>

        {onResetDemo && (
          <button
            onClick={onResetDemo}
            title="Reset Simulated Demo State"
            className="p-1.5 text-xs text-slate-500 hover:text-primary hover:bg-surface-container rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
          </button>
        )}

        <div className="h-6 w-px bg-outline-variant/50"></div>

        {/* Admin Profile */}
        <div
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-3 pl-1 cursor-pointer group"
        >
          <div className="relative">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary transition-all"
              src={CCTV_IMAGES.adminAvatar}
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-title-sm text-xs font-bold text-on-surface leading-tight">Amit S.</span>
            <span className="font-caption-caps text-[0.625rem] text-on-surface-variant">Traffic Ops Lead</span>
          </div>
          <span className="material-symbols-outlined text-outline text-[1.125rem] group-hover:text-on-surface transition-colors">
            expand_more
          </span>
        </div>
      </div>
    </header>
  );
};
