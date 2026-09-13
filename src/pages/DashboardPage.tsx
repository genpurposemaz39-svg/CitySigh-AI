import React from 'react';
import { Camera, Alert, DashboardStats } from '../types';
import { TacticalMap } from '../components/dashboard/TacticalMap';
import { CCTV_IMAGES } from '../data/mockData';
import { NavigationPath } from '../components/layout/Sidebar';

interface DashboardPageProps {
  stats: DashboardStats;
  cameras: Camera[];
  alerts: Alert[];
  onNavigate: (path: NavigationPath) => void;
  onSelectCamera: (cameraId: string) => void;
  onSelectAlert: (alertId: string) => void;
  onTrackVehicle: (plate: string) => void;
  onInspectANPR: (plate: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  cameras,
  alerts,
  onNavigate,
  onSelectCamera,
  onSelectAlert,
  onTrackVehicle,
  onInspectANPR,
}) => {
  const previewCameras = cameras.slice(0, 3);
  const activeAlerts = alerts.filter(a => a.status === 'active').slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            Traffic Intelligence &amp; Surveillance Command
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Real-time municipal edge telemetry, automated ANPR tracking, and corridor congestion surveillance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('vehicle-search')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 font-title-sm text-xs font-semibold text-on-surface transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-base text-primary">search</span>
            <span>Search Plate</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container font-title-sm text-xs font-semibold text-white transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Intel</span>
          </button>
        </div>
      </div>

      {/* Top 4 Real-time Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Vehicles */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption-caps text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Total Vehicles Detected
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">directions_car</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display-lg text-3xl font-extrabold text-on-surface tracking-tight">
              {stats.totalVehiclesDetected.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 font-semibold">
              <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
              <span>+12.4% vs. Diurnal Baseline</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Trajectories */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption-caps text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Active Trajectories
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">alt_route</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display-lg text-3xl font-extrabold text-on-surface tracking-tight">
              {stats.activeTrajectories.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-secondary font-semibold">
              <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
              <span>94.8% Spatio-Temporal Match</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Alerts */}
        <div
          onClick={() => onNavigate('alerts-intelligence')}
          className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between cursor-pointer hover:border-red-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-caption-caps text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Active Alerts &amp; Incidents
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">warning</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display-lg text-3xl font-extrabold text-rose-600 tracking-tight flex items-baseline gap-2">
              <span>{stats.activeAlerts}</span>
              <span className="text-xs font-semibold text-rose-500 font-body-sm">3 Critical BOLO</span>
            </div>
            <div className="flex items-center justify-between mt-1.5 text-xs text-rose-700 font-semibold">
              <span>Requires Dispatch Review</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* Card 4: Average Traffic Speed */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption-caps text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Average Network Speed
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">speed</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display-lg text-3xl font-extrabold text-on-surface tracking-tight">
              {stats.averageTrafficSpeed} <span className="text-lg font-bold text-on-surface-variant">km/h</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-600 font-semibold">
              <span className="material-symbols-outlined text-sm font-bold">arrow_downward</span>
              <span>-4 km/h Peak Evening Load</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left GIS Map + Right Telemetry Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tactical GIS Map + Camera Feeds Strip */}
        <div className="xl:col-span-2 space-y-6">
          <TacticalMap
            cameras={cameras}
            onSelectCamera={onSelectCamera}
            onTrackVehicle={onTrackVehicle}
          />

          {/* Live Camera Surveillance Feeds */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">videocam</span>
                <h3 className="font-title-sm text-base font-bold text-on-surface">
                  Live Edge CCTV Streams
                </h3>
              </div>
              <button
                onClick={() => onNavigate('live-cameras')}
                className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1"
              >
                <span>View All {cameras.length} Cameras</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {previewCameras.map((cam) => (
                <div
                  key={cam.id}
                  onClick={() => onSelectCamera(cam.id)}
                  className="group relative rounded-xl overflow-hidden bg-slate-900 border border-outline-variant/30 shadow-xs cursor-pointer hover:border-primary transition-all"
                >
                  <div className="aspect-video w-full relative overflow-hidden">
                    <img
                      src={cam.streamUrl}
                      alt={cam.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur font-mono text-[0.625rem] text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{cam.id}</span>
                    </div>
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur font-mono text-[0.625rem] text-emerald-300">
                      {cam.fps.toFixed(1)} FPS
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[0.6875rem] text-white/90 bg-gradient-to-t from-black/80 to-transparent p-1 pt-4">
                      <span className="font-semibold truncate">{cam.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[0.5625rem] font-bold uppercase ${
                        cam.trafficLevel === 'CONG' ? 'bg-red-600' : cam.trafficLevel === 'HEAVY' ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}>
                        {cam.trafficLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: ANPR Focus + Alerts + OD Flow Highlights */}
        <div className="space-y-6">
          {/* ANPR OCR Focus Card */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">document_scanner</span>
                <h3 className="font-title-sm text-base font-bold text-on-surface">
                  ANPR Recognition Focus
                </h3>
              </div>
              <span className="text-[0.6875rem] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                96.8% ACCURACY
              </span>
            </div>

            {/* Target Vehicle Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-outline-variant/40">
              <img
                src={CCTV_IMAGES.anprCarZoom}
                alt="Target Vehicle"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs p-2 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[0.625rem] text-slate-300 uppercase font-semibold">Localized Plate</div>
                  <div className="font-mono text-sm font-bold text-white tracking-wider">GJ05AB1234</div>
                </div>
                <div className="text-right">
                  <div className="text-[0.625rem] text-emerald-400 font-semibold">Verified Plate</div>
                  <div className="text-xs text-white">Cam 03 • 14:28:12</div>
                </div>
              </div>
            </div>

            {/* Indian HSRP Plate Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-[0.6875rem] bg-primary text-white px-2 py-1 rounded">
                  IND
                </span>
                <span className="font-mono text-base font-extrabold tracking-widest text-white">
                  GJ 05 AB 1234
                </span>
              </div>
              <button
                onClick={() => onInspectANPR('GJ05AB1234')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>Inspect Pipeline</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <button
              onClick={() => onTrackVehicle('GJ05AB1234')}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-title-sm text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">route</span>
              <span>Reconstruct Full Spatio-Temporal Trajectory</span>
            </button>
          </div>

          {/* Recent Intelligence Alerts */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600 text-xl">notifications_active</span>
                <h3 className="font-title-sm text-base font-bold text-on-surface">
                  Recent Intelligence Alerts
                </h3>
              </div>
              <button
                onClick={() => onNavigate('alerts-intelligence')}
                className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1"
              >
                <span>View All</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {activeAlerts.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => onSelectAlert(alt.id)}
                  className="p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[0.625rem] font-bold uppercase px-2 py-0.5 rounded-full ${
                        alt.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : alt.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {alt.type}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">{alt.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono font-bold text-sm text-on-surface tracking-wide">
                      {alt.vehicleNumber}
                    </span>
                    <span className="text-xs text-on-surface-variant truncate max-w-[150px]">
                      {alt.cameraName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Origin-Destination Teaser */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-title-sm text-sm font-bold text-on-surface">
                Key Origin-Destination Corridors
              </span>
              <button
                onClick={() => onNavigate('traffic-analytics')}
                className="text-xs font-semibold text-primary hover:text-primary-container"
              >
                Analytics
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">North Hub → East Port</span>
                <span className="font-mono font-bold text-on-surface">1,840 veh/hr (+14%)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">West Tech → Central CBD</span>
                <span className="font-mono font-bold text-on-surface">3,650 veh/hr (-4%)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-on-surface-variant">Central CBD → South Logistics</span>
                <span className="font-mono font-bold text-on-surface">2,980 veh/hr (+6%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
