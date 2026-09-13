import React, { useState } from 'react';
import { Camera } from '../../types';

interface TacticalMapProps {
  onSelectCamera: (cameraId: string) => void;
  onTrackVehicle: (plate: string) => void;
  cameras: Camera[];
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  onSelectCamera,
  onTrackVehicle,
  cameras,
}) => {
  // Layer toggles
  const [showCameras, setShowCameras] = useState(true);
  const [showRouteVectors, setShowRouteVectors] = useState(true);
  const [showFlowMesh, setShowFlowMesh] = useState(true);
  const [showCongestion, setShowCongestion] = useState(true);

  // Zoom & View state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapMode, setMapMode] = useState<'density' | 'heatmap' | 'vectors' | 'infrared'>('density');
  const [selectedCameraTooltip, setSelectedCameraTooltip] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState({
    plate: 'GJ05AB1234',
    confidence: '98.4%',
    velocity: '62 km/h',
    lastFix: '14:28:44 IST',
    heading: 'Eastbound toward Ring Rd Junction',
  });

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.8));
  const handleRecenter = () => setZoomLevel(1);

  return (
    <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden border border-outline-variant/30">
      {/* GIS Map Control Toolbar */}
      <div className="p-4 bg-surface-container-low flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">map</span>
            <span className="font-title-sm text-title-sm font-bold text-on-surface">
              Live Traffic &amp; Vehicle Tracking GIS
            </span>
          </div>

          {/* Mode Dropdown */}
          <div className="relative">
            <select
              value={mapMode}
              onChange={(e) => setMapMode(e.target.value as any)}
              className="pl-3 pr-8 py-1.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface font-medium shadow-sm focus:outline-none appearance-none cursor-pointer border border-outline-variant/40"
            >
              <option value="density">Traffic Density Layer</option>
              <option value="heatmap">Urban Heatmap View</option>
              <option value="vectors">Flow Vector Analysis</option>
              <option value="infrared">Night Optical Infrared</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Layer Toggles & Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-xs font-caption-caps text-caption-caps border border-outline-variant/30">
            <label className="flex items-center gap-1.5 cursor-pointer text-on-surface font-semibold select-none">
              <input
                type="checkbox"
                checked={showCameras}
                onChange={(e) => setShowCameras(e.target.checked)}
                className="rounded accent-primary w-3.5 h-3.5"
              />
              Cameras
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-on-surface font-semibold select-none">
              <input
                type="checkbox"
                checked={showRouteVectors}
                onChange={(e) => setShowRouteVectors(e.target.checked)}
                className="rounded accent-primary w-3.5 h-3.5"
              />
              Route Vectors
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-on-surface font-semibold select-none">
              <input
                type="checkbox"
                checked={showFlowMesh}
                onChange={(e) => setShowFlowMesh(e.target.checked)}
                className="rounded accent-primary w-3.5 h-3.5"
              />
              Flow Mesh
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-on-surface font-semibold select-none">
              <input
                type="checkbox"
                checked={showCongestion}
                onChange={(e) => setShowCongestion(e.target.checked)}
                className="rounded accent-red-600 w-3.5 h-3.5"
              />
              Congestion
            </label>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-surface-container-lowest rounded-lg p-1 shadow-xs border border-outline-variant/30">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-lg leading-none">add</span>
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-lg leading-none">remove</span>
            </button>
            <button
              onClick={handleRecenter}
              className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
              title="Recenter View"
            >
              <span className="material-symbols-outlined text-lg leading-none">my_location</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('tactical-gis-viewport');
                if (el) {
                  if (!document.fullscreenElement) {
                    el.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }
              }}
              className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
              title="Toggle Fullscreen"
            >
              <span className="material-symbols-outlined text-lg leading-none">fullscreen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tactical GIS Dark Map Canvas */}
      <div
        id="tactical-gis-viewport"
        className={`relative w-full h-[520px] overflow-hidden select-none transition-colors duration-500 ${
          mapMode === 'infrared' ? 'bg-[#180909]' : mapMode === 'heatmap' ? 'bg-[#060c1d]' : 'bg-[#091024]'
        }`}
      >
        {/* Scale container */}
        <div
          className="relative w-full h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Background Grid Gridlines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="tactical-grid" patternUnits="userSpaceOnUse" width="40">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect fill="url(#tactical-grid)" height="100%" width="100%" />
          </svg>

          {/* Vector Road Networks, Flow Lines & Trajectory */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 800 520"
          >
            <defs>
              <linearGradient id="cyanVectorGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="1" />
              </linearGradient>
              <filter height="140%" id="neonGlow" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="3" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Arterial Base Highways (Dark slate wide corridors) */}
            <path d="M 40 260 L 760 260" stroke="#1e293b" strokeLinecap="round" strokeWidth="22" />
            <path d="M 380 30 L 380 490" stroke="#1e293b" strokeLinecap="round" strokeWidth="20" />
            <path d="M 120 480 Q 400 380 680 80" fill="none" stroke="#1e293b" strokeLinecap="round" strokeWidth="16" />
            <path d="M 60 100 Q 240 220 720 440" fill="none" stroke="#1e293b" strokeLinecap="round" strokeWidth="14" />

            {/* Secondary Road Grid */}
            <path d="M 180 80 L 180 450" stroke="#172554" strokeDasharray="4,4" strokeWidth="6" />
            <path d="M 580 60 L 580 460" stroke="#172554" strokeDasharray="4,4" strokeWidth="6" />
            <path d="M 100 160 L 720 160" stroke="#172554" strokeDasharray="4,4" strokeWidth="6" />
            <path d="M 100 370 L 720 370" stroke="#172554" strokeDasharray="4,4" strokeWidth="6" />

            {/* Congestion Flow Overlays */}
            {showFlowMesh && (
              <>
                {/* Green Arteries (Flowing) */}
                <path d="M 40 260 L 340 260" filter="url(#neonGlow)" stroke="#10b981" strokeLinecap="round" strokeWidth="5" />
                <path d="M 120 480 Q 280 420 380 340" fill="none" stroke="#10b981" strokeLinecap="round" strokeWidth="4" />

                {/* Yellow Corridors (Moderate) */}
                <path d="M 380 30 L 380 200" stroke="#eab308" strokeLinecap="round" strokeWidth="4" />
                <path d="M 440 260 L 760 260" stroke="#eab308" strokeLinecap="round" strokeWidth="4" />
              </>
            )}

            {/* Red Corridors (Severe Bottleneck) */}
            {showCongestion && (
              <>
                <path d="M 340 260 L 440 260" filter="url(#neonGlow)" stroke="#ef4444" strokeLinecap="round" strokeWidth="7" />
                <path d="M 380 220 L 380 320" filter="url(#neonGlow)" stroke="#ef4444" strokeLinecap="round" strokeWidth="6" />
                {/* Congestion Heatmap Blurs */}
                <circle cx="380" cy="260" r="38" fill="#ef4444" opacity="0.25" filter="url(#neonGlow)" />
              </>
            )}

            {/* Trajectory Vector Path (Cam 03 -> Cam 07 -> Cam 12 -> Cam 15) */}
            {showRouteVectors && (
              <>
                <path
                  d="M 180 160 L 290 220 L 380 260 L 580 370"
                  fill="none"
                  filter="url(#neonGlow)"
                  stroke="url(#cyanVectorGlow)"
                  strokeDasharray="8,5"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
                {/* Chevrons / Waypoint dots */}
                <circle cx="235" cy="190" fill="#38bdf8" r="3" />
                <circle cx="335" cy="240" fill="#38bdf8" r="3" />
                <circle cx="480" cy="315" fill="#38bdf8" r="3" />
              </>
            )}

            {/* Road Name Labels */}
            <text fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1" x="60" y="250">
              M.G. ROAD CORRIDOR [W]
            </text>
            <text fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1" x="600" y="250">
              M.G. ROAD [E]
            </text>
            <text fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1" x="395" y="60">
              AIRPORT EXPRESSWAY (NORTH)
            </text>
            <text fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1" x="395" y="475">
              NH-44 BYPASS (SOUTH)
            </text>
            <text fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1" x="560" y="110">
              RING ROAD FLYOVER
            </text>
          </svg>

          {/* Camera Node Overlays with Radar Pulses */}
          {showCameras && (
            <>
              {/* Cam 01: West Edge */}
              <div
                onClick={() => onSelectCamera('CAM-01')}
                className="absolute top-[260px] left-[100px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/80 backdrop-blur border border-slate-600 hover:border-sky-400">
                  <span className="material-symbols-outlined text-slate-300 text-sm">videocam</span>
                </div>
                <span className="font-mono text-[0.625rem] text-slate-300 bg-[#0b1329]/90 px-1.5 py-0.5 rounded border border-white/10">
                  CAM-01
                </span>
              </div>

              {/* Cam 03: Highway Node */}
              <div
                onClick={() => onSelectCamera('CAM-03')}
                className="absolute top-[160px] left-[180px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer z-10"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-sky-950/80 backdrop-blur border-2 border-secondary-container">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-40"></span>
                  <span className="material-symbols-outlined text-secondary-container text-sm">videocam</span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0b1329] text-secondary-container border border-secondary-container/40 shadow-lg">
                  CAM-03 • 98%
                </span>
              </div>

              {/* Cam 07: Ring Road Node */}
              <div
                onClick={() => onSelectCamera('CAM-07')}
                className="absolute top-[220px] left-[290px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer z-10"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-sky-950/80 backdrop-blur border-2 border-secondary-container">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-30"></span>
                  <span className="material-symbols-outlined text-secondary-container text-sm">videocam</span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0b1329] text-secondary-container border border-secondary-container/40 shadow-lg">
                  CAM-07 • 96%
                </span>
              </div>

              {/* Cam 12: Central Square Junction (Active Traffic Radar) */}
              <div
                onClick={() => onSelectCamera('CAM-12')}
                className="absolute top-[260px] left-[380px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer z-20"
              >
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-900/40 backdrop-blur border-2 border-blue-500">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60"></span>
                  <span className="material-symbols-outlined text-blue-300 text-base font-bold">radar</span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0b1329] text-blue-300 border border-blue-500/40 shadow-lg">
                  CAM-12 • CBD
                </span>
              </div>

              {/* Cam 15: Airport Node */}
              <div
                onClick={() => onSelectCamera('CAM-15')}
                className="absolute top-[370px] left-[580px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer z-10"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-sky-950/80 backdrop-blur border-2 border-secondary-container">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-50"></span>
                  <span className="material-symbols-outlined text-secondary-container text-sm">videocam</span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0b1329] text-secondary-container border border-secondary-container/40 shadow-lg">
                  CAM-15 • LIVE
                </span>
              </div>
            </>
          )}

          {/* Floating Interactive Selected Vehicle Callout Card */}
          <div className="absolute top-6 right-6 max-w-xs w-72 rounded-xl bg-[#0b1329]/95 backdrop-blur-md p-4 shadow-2xl border border-primary-container/40 text-left z-30">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-caption-caps text-[0.6875rem] font-bold text-red-400 uppercase tracking-wider">
                  Target Acquired
                </span>
              </div>
              <span className="font-label-telemetry text-[0.6875rem] text-secondary-container font-semibold">
                CONF: {selectedVehicle.confidence}
              </span>
            </div>

            {/* License Plate Banner */}
            <div className="flex items-center justify-between my-2 p-2 rounded-lg bg-[#040814] border border-white/10">
              <div className="flex items-center gap-2">
                <span className="font-caption-caps text-[0.625rem] bg-primary text-white px-1.5 py-0.5 rounded font-bold">
                  IND
                </span>
                <span className="font-label-plate-lg text-base tracking-widest text-white font-bold">
                  {selectedVehicle.plate}
                </span>
              </div>
              <span className="font-label-telemetry text-[0.6875rem] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                VERIFIED
              </span>
            </div>

            {/* Vehicle Telemetry */}
            <div className="grid grid-cols-2 gap-2 mt-3 font-body-sm text-xs text-slate-300">
              <div>
                <span className="block text-[0.625rem] uppercase font-caption-caps text-slate-400">Current Velocity</span>
                <span className="font-label-telemetry font-bold text-white text-sm">{selectedVehicle.velocity}</span>
              </div>
              <div>
                <span className="block text-[0.625rem] uppercase font-caption-caps text-slate-400">Last Fix Time</span>
                <span className="font-label-telemetry font-bold text-white text-sm">{selectedVehicle.lastFix}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-white/10">
                <span className="block text-[0.625rem] uppercase font-caption-caps text-slate-400">Vector Heading</span>
                <span className="font-body-sm text-xs text-slate-200 truncate block">{selectedVehicle.heading}</span>
              </div>
            </div>

            <button
              onClick={() => onTrackVehicle(selectedVehicle.plate)}
              className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-title-sm text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <span>Track Trajectory</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* GIS Legend Overlay */}
          <div className="absolute bottom-3 left-4 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#0b1329]/90 backdrop-blur border border-white/10 font-label-telemetry text-[0.6875rem] text-slate-300 z-20">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded bg-emerald-400"></span> Free Flow
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded bg-amber-400"></span> Moderate
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded bg-rose-500"></span> Congestion
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded bg-sky-400"></span> Active Target
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
