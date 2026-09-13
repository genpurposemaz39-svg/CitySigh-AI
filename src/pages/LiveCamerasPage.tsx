import React, { useState } from 'react';
import { Camera, CameraStatus } from '../types';

interface LiveCamerasPageProps {
  cameras: Camera[];
  onSelectCamera: (cameraId: string) => void;
  onTrackVehicle: (plate: string) => void;
  onInspectANPR: (plate: string) => void;
  onStatusChange: (cameraId: string, status: CameraStatus) => void;
}

export const LiveCamerasPage: React.FC<LiveCamerasPageProps> = ({
  cameras,
  onSelectCamera,
  onTrackVehicle,
  onInspectANPR,
  onStatusChange,
}) => {
  const [filterCorridor, setFilterCorridor] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const corridors = ['All', 'Expressway', 'Central', 'Ring Road', 'Tech Corridor', 'Airport'];

  const filteredCameras = cameras.filter((cam) => {
    const matchesCorridor =
      filterCorridor === 'All' ||
      cam.name.toLowerCase().includes(filterCorridor.toLowerCase()) ||
      cam.location.toLowerCase().includes(filterCorridor.toLowerCase()) ||
      cam.corridor.toLowerCase().includes(filterCorridor.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || cam.status.toLowerCase() === filterStatus.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCorridor && matchesStatus && matchesSearch;
  });

  const onlineCount = cameras.filter(c => c.status === 'live').length;
  const maintenanceCount = cameras.filter(c => c.status === 'maintenance').length;
  const offlineCount = cameras.filter(c => c.status === 'offline').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            Live CCTV Camera Fleet &amp; Edge Surveillance
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Real-time H.265 video telemetry, edge YOLO inference nodes, and automated license plate capture feeds.
          </p>
        </div>

        {/* Quick Fleet Health Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{onlineCount} Live Feeds</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>{maintenanceCount} Maintenance</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>{offlineCount} Offline</span>
          </div>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          {/* Search box */}
          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search camera name or ID (e.g. CAM-03)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Corridor Tabs */}
          <div className="flex items-center bg-surface-container rounded-lg p-1 text-xs font-semibold">
            {corridors.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCorridor(c)}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterCorridor === c
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface border border-outline-variant/40 text-xs font-semibold text-on-surface"
          >
            <option value="All">All Statuses</option>
            <option value="live">Live Feeds Only</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-outline hover:text-on-surface'
            }`}
            title="Grid View"
          >
            <span className="material-symbols-outlined text-lg leading-none">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'compact' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-outline hover:text-on-surface'
            }`}
            title="Compact View"
          >
            <span className="material-symbols-outlined text-lg leading-none">view_list</span>
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCameras.map((cam) => {
            const isLive = cam.status === 'live';
            return (
              <div
                key={cam.id}
                className="group flex flex-col rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs overflow-hidden hover:border-primary/60 hover:shadow-md transition-all"
              >
                {/* Video Feed Canvas */}
                <div
                  onClick={() => onSelectCamera(cam.id)}
                  className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
                >
                  {isLive ? (
                    <>
                      <img
                        src={cam.streamUrl}
                        alt={cam.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Top Overlay */}
                      <div className="absolute top-2.5 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur font-mono text-[0.625rem] text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-bold">{cam.id}</span>
                      </div>
                      <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur font-mono text-[0.625rem] text-emerald-300 font-bold">
                        {cam.fps.toFixed(1)} FPS
                      </div>

                      {/* Bottom Info Bar */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between bg-black/70 backdrop-blur px-2.5 py-1 rounded text-white font-mono text-[0.625rem]">
                        <span>{cam.vehiclesPerMin} VEH/MIN</span>
                        <span
                          className={`font-bold ${
                            cam.trafficLevel === 'CONG'
                              ? 'text-red-400'
                              : cam.trafficLevel === 'HEAVY'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {cam.trafficLevel}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                      <span className="material-symbols-outlined text-4xl">videocam_off</span>
                      <span className="font-mono text-xs uppercase font-semibold">
                        {cam.status === 'maintenance' ? 'Camera Maintenance' : 'Feed Offline'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Info & Actions */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                        {cam.name}
                      </h3>
                      <span
                        className={`text-[0.625rem] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${
                          cam.status === 'live'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cam.status === 'maintenance'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {cam.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">{cam.location}</p>
                    <p className="text-[0.6875rem] text-slate-400 font-mono mt-1">
                      {cam.resolution} • {cam.ipAddress}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectCamera(cam.id)}
                      className="flex-1 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">fullscreen</span>
                      <span>Enlarge Viewport</span>
                    </button>
                    <button
                      onClick={() => {
                        const newStatus: CameraStatus = cam.status === 'live' ? 'maintenance' : 'live';
                        onStatusChange(cam.id, newStatus);
                      }}
                      title="Toggle Camera Status"
                      className="p-1.5 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-xs"
                    >
                      <span className="material-symbols-outlined text-base">
                        {cam.status === 'live' ? 'pause_circle' : 'play_circle'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden shadow-xs divide-y divide-outline-variant/20">
          {filteredCameras.map((cam) => (
            <div
              key={cam.id}
              className="p-4 flex items-center justify-between hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden relative flex-shrink-0">
                  <img src={cam.streamUrl} alt={cam.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{cam.id}</span>
                    <span className="font-bold text-sm text-on-surface">{cam.name}</span>
                    <span
                      className={`text-[0.625rem] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                        cam.status === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cam.status}
                    </span>
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    {cam.location} • {cam.corridor}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <span className="font-mono text-xs text-emerald-600 font-bold block">{cam.fps.toFixed(1)} FPS</span>
                  <span className="text-[0.6875rem] text-on-surface-variant">{cam.vehiclesPerMin} veh/min</span>
                </div>
                <button
                  onClick={() => onSelectCamera(cam.id)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-container transition-all"
                >
                  Inspect Feed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
