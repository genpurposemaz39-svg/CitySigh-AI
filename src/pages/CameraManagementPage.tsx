import React, { useState } from 'react';
import { Camera, CameraStatus } from '../types';

interface CameraManagementPageProps {
  cameras: Camera[];
  onSelectCamera: (cameraId: string) => void;
  onStatusChange: (cameraId: string, status: CameraStatus) => void;
}

export const CameraManagementPage: React.FC<CameraManagementPageProps> = ({
  cameras,
  onSelectCamera,
  onStatusChange,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCameraName, setNewCameraName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newIp, setNewIp] = useState('10.240.12.120');

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCameraName) return;
    // In demo mode, show feedback
    alert(`Edge Camera ${newCameraName} registered successfully on subnet ${newIp}!`);
    setShowAddModal(false);
    setNewCameraName('');
    setNewLocation('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            Edge Camera Network Infrastructure
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Configure CCTV node endpoints, IP routing gateways, edge inference weights, and hardware heartbeat schedules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-title-sm text-xs font-bold shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Register Edge Node</span>
        </button>
      </div>

      {/* Camera Infrastructure Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
          <span className="font-title-sm text-sm font-bold text-on-surface">
            Provisioned Hardware Nodes ({cameras.length} Nodes)
          </span>
          <span className="text-xs text-on-surface-variant font-mono">
            RTSP Stream Aggregator: Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-lowest font-caption-caps text-[0.625rem] text-on-surface-variant uppercase tracking-wider">
                <th className="py-3 px-4">Node ID</th>
                <th className="py-3 px-4">Corridor &amp; Location</th>
                <th className="py-3 px-4">Hardware Model</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Telemetry (FPS)</th>
                <th className="py-3 px-4">Operating Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs font-body-md">
              {cameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-surface-container transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {cam.id}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface">
                    <div className="font-bold">{cam.name}</div>
                    <div className="text-[0.6875rem] text-on-surface-variant">{cam.location}</div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface text-[0.6875rem]">
                    {cam.model}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-on-surface">
                    {cam.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                    {cam.fps > 0 ? `${cam.fps.toFixed(1)} FPS` : '0 FPS'}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={cam.status}
                      onChange={(e) => onStatusChange(cam.id, e.target.value as CameraStatus)}
                      className={`text-xs font-bold font-mono px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                        cam.status === 'live'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : cam.status === 'maintenance'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      <option value="live">LIVE</option>
                      <option value="maintenance">MAINTENANCE</option>
                      <option value="offline">OFFLINE</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectCamera(cam.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary transition-colors"
                    >
                      View Stream
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Camera Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full border border-outline-variant/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="font-bold text-base text-on-surface">Register New Edge Camera</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCamera} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Camera Name / Corridor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ring Road Junction East"
                  value={newCameraName}
                  onChange={(e) => setNewCameraName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Physical Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 18 Flyover Approach"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Subnet IP Address</label>
                <input
                  type="text"
                  required
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/40 font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold"
                >
                  Register Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
