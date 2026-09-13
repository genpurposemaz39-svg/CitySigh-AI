import React, { useState } from 'react';
import { Camera, CameraStatus } from '../../types';
import { CCTV_IMAGES } from '../../data/mockData';

interface CameraModalProps {
  camera: Camera | null;
  onClose: () => void;
  onStatusChange: (cameraId: string, newStatus: CameraStatus) => void;
  onTrackVehicle: (plate: string) => void;
  onInspectANPR: (plate: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  camera,
  onClose,
  onStatusChange,
  onTrackVehicle,
  onInspectANPR,
}) => {
  if (!camera) return null;

  const [currentStatus, setCurrentStatus] = useState<CameraStatus>(camera.status);
  const [activeTab, setActiveTab] = useState<'stream' | 'telemetry' | 'detections'>('stream');

  const recentDetections = [
    { plate: 'GJ05AB1234', type: 'SUV • Creta', time: '14:28:12 IST', speed: '61.2 km/h', conf: '96.8%' },
    { plate: 'DL8CAF7321', type: 'SUV • Fortuner', time: '14:21:40 IST', speed: '72.1 km/h', conf: '97.4%', alert: 'Blacklisted' },
    { plate: 'UP32AB5678', type: 'Sedan • City', time: '14:08:19 IST', speed: '94.5 km/h', conf: '92.1%', alert: 'Overspeeding' },
    { plate: 'KA01MJ9921', type: 'Truck • Container', time: '13:58:30 IST', speed: '48.0 km/h', conf: '98.1%' },
  ];

  const handleStatusToggle = (newStatus: CameraStatus) => {
    setCurrentStatus(newStatus);
    onStatusChange(camera.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-white">
              <span className="material-symbols-outlined text-xl">videocam</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  {camera.id} — {camera.name}
                </h3>
                <span
                  className={`text-[0.6875rem] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                    currentStatus === 'live'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentStatus === 'maintenance'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {currentStatus}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">{camera.location} • {camera.corridor}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status switcher */}
            <div className="flex items-center bg-surface-container rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => handleStatusToggle('live')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currentStatus === 'live' ? 'bg-emerald-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Live
              </button>
              <button
                onClick={() => handleStatusToggle('maintenance')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currentStatus === 'maintenance' ? 'bg-amber-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Maintenance
              </button>
              <button
                onClick={() => handleStatusToggle('offline')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currentStatus === 'offline' ? 'bg-rose-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Offline
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tabs */}
          <div className="flex border-b border-outline-variant/30 gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('stream')}
              className={`pb-2.5 transition-all border-b-2 ${
                activeTab === 'stream'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Live Video Feed
            </button>
            <button
              onClick={() => setActiveTab('detections')}
              className={`pb-2.5 transition-all border-b-2 ${
                activeTab === 'detections'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Recent Sightings (ANPR)
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`pb-2.5 transition-all border-b-2 ${
                activeTab === 'telemetry'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Hardware &amp; Network Health
            </button>
          </div>

          {activeTab === 'stream' && (
            <div className="space-y-4">
              {/* Large CCTV Feed Canvas */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                {currentStatus === 'live' ? (
                  <>
                    <img
                      src={camera.streamUrl}
                      alt={camera.name}
                      className="w-full h-full object-cover"
                    />
                    {/* CCTV Telemetry Overlay HUD */}
                    <div className="absolute top-3 left-4 font-mono text-xs text-white/90 bg-black/60 backdrop-blur px-2.5 py-1 rounded">
                      <span>{camera.id} // {camera.name.toUpperCase()}</span>
                      <span className="ml-3 text-emerald-400 font-bold">● {camera.fps.toFixed(1)} FPS</span>
                    </div>

                    <div className="absolute top-3 right-4 font-mono text-xs text-white/90 bg-black/60 backdrop-blur px-2.5 py-1 rounded flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                      <span>REC [H.265 4K]</span>
                    </div>

                    <div className="absolute bottom-3 left-4 font-mono text-xs text-white/90 bg-black/60 backdrop-blur px-2.5 py-1 rounded">
                      TRAFFIC DENSITY: <span className="font-bold text-amber-300">{camera.trafficLevel}</span> • {camera.vehiclesPerMin} VEH/MIN
                    </div>

                    {/* Simulated Detection Bounding Box */}
                    <div className="absolute top-[38%] left-[45%] w-32 h-20 border-2 border-emerald-400 bg-emerald-500/10 rounded-xs flex flex-col justify-between p-1 pointer-events-none">
                      <span className="text-[0.625rem] font-mono font-bold text-emerald-300 bg-black/70 px-1 rounded-xs w-fit">
                        GJ05AB1234 • 96%
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                    <span className="material-symbols-outlined text-5xl">videocam_off</span>
                    <p className="font-mono text-sm">
                      Camera stream is currently {currentStatus.toUpperCase()}.
                    </p>
                    <button
                      onClick={() => handleStatusToggle('live')}
                      className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold"
                    >
                      Restore to Live Stream
                    </button>
                  </div>
                )}
              </div>

              {/* Quick stats grid */}
              <div className="grid grid-cols-4 gap-3 font-body-sm">
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30">
                  <span className="text-[0.6875rem] uppercase text-on-surface-variant font-semibold">Sensor Resolution</span>
                  <div className="font-mono font-bold text-sm text-on-surface mt-0.5">{camera.resolution}</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30">
                  <span className="text-[0.6875rem] uppercase text-on-surface-variant font-semibold">Active FPS</span>
                  <div className="font-mono font-bold text-sm text-emerald-600 mt-0.5">{camera.fps.toFixed(1)} Frames/Sec</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30">
                  <span className="text-[0.6875rem] uppercase text-on-surface-variant font-semibold">Total Vehicles Today</span>
                  <div className="font-mono font-bold text-sm text-on-surface mt-0.5">{camera.vehicleCount}</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30">
                  <span className="text-[0.6875rem] uppercase text-on-surface-variant font-semibold">IP Address</span>
                  <div className="font-mono font-bold text-sm text-on-surface mt-0.5">{camera.ipAddress}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'detections' && (
            <div className="space-y-3">
              <p className="text-xs text-on-surface-variant">
                Live license plate reads captured by OCR pipeline on this camera node in the last 60 minutes:
              </p>
              <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest">
                {recentDetections.map((det, i) => (
                  <div key={i} className="p-3 flex items-center justify-between hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded bg-slate-900 text-white font-mono font-bold text-sm tracking-wider">
                        {det.plate}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-on-surface flex items-center gap-2">
                          <span>{det.type}</span>
                          {det.alert && (
                            <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold uppercase">
                              {det.alert}
                            </span>
                          )}
                        </div>
                        <div className="text-[0.6875rem] text-on-surface-variant font-mono">
                          {det.time} • Speed: {det.speed} • Conf: {det.conf}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onInspectANPR(det.plate);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-surface-container-high hover:bg-surface-container-highest text-primary transition-all"
                      >
                        Inspect OCR
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onTrackVehicle(det.plate);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-primary text-white hover:bg-primary-container transition-all"
                      >
                        Track Trajectory
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                <span className="font-bold text-on-surface block text-sm">Edge Hardware Profile</span>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Device Model:</span>
                  <span className="font-semibold text-on-surface">{camera.model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Sensor Firmware:</span>
                  <span className="font-mono text-on-surface">v4.8.2-build92</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Core Temperature:</span>
                  <span className="font-mono text-emerald-600 font-semibold">41.2°C (Optimal)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">Power Mode:</span>
                  <span className="font-semibold text-on-surface">PoE+ (IEEE 802.3at)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                <span className="font-bold text-on-surface block text-sm">Network Transmission</span>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Streaming Bitrate:</span>
                  <span className="font-mono text-on-surface">8.4 Mbps CBR</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Packet Drop Rate:</span>
                  <span className="font-mono text-emerald-600 font-semibold">0.02%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Subnet Gateway:</span>
                  <span className="font-mono text-on-surface">10.240.12.1</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">Edge Inference Engine:</span>
                  <span className="font-semibold text-primary">NVIDIA TensorRT 8.6</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-outline-variant/30 bg-surface-container-low flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Coordinate: {camera.latitude.toFixed(4)}° N, {camera.longitude.toFixed(4)}° E
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-variant text-on-surface font-semibold text-xs transition-colors"
          >
            Close Viewport
          </button>
        </div>
      </div>
    </div>
  );
};
