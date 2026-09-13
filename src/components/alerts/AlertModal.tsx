import React from 'react';
import { Alert } from '../../types';

interface AlertModalProps {
  alert: Alert | null;
  onClose: () => void;
  onResolve: (alertId: string) => void;
  onTrackVehicle: (plate: string) => void;
  onInspectANPR: (plate: string) => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  alert,
  onClose,
  onResolve,
  onTrackVehicle,
  onInspectANPR,
}) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            alert.severity === 'critical'
              ? 'bg-rose-950/40 border-rose-800/40 text-rose-200'
              : alert.severity === 'warning'
              ? 'bg-amber-950/40 border-amber-800/40 text-amber-200'
              : 'bg-blue-950/40 border-blue-800/40 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-xl material-symbols-outlined text-xl ${
                alert.severity === 'critical'
                  ? 'bg-rose-600 text-white'
                  : alert.severity === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {alert.severity === 'critical' ? 'warning' : 'notifications_active'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{alert.type}</h3>
                <span className="text-[0.6875rem] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Event ID: {alert.id.toUpperCase()} • Incident Logged at {alert.timestamp}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Target Vehicle Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#0b1329] border border-[#1e293b] text-white">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">IND</span>
              <span className="font-mono text-xl tracking-widest font-extrabold text-white">
                {alert.vehicleNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[0.6875rem] text-slate-400 uppercase block font-semibold">OCR Confidence</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{alert.confidence}%</span>
            </div>
          </div>

          {/* CCTV Snapshot Preview */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Evidentiary CCTV Snapshot
            </span>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-outline-variant/40 shadow-inner">
              <img
                src={alert.snapshotUrl}
                alt={alert.vehicleNumber}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-3 bg-black/70 backdrop-blur px-2 py-1 rounded font-mono text-[0.6875rem] text-white">
                Captured by {alert.cameraName} • Velocity: {alert.speed || 55} km/h
              </div>
            </div>
          </div>

          {/* Details & Telemetry */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3 text-xs">
            <div>
              <span className="font-bold text-on-surface block text-sm mb-1">Intelligence Details</span>
              <p className="text-on-surface-variant leading-relaxed">{alert.details}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/20">
              <div>
                <span className="text-on-surface-variant block font-semibold">Camera Node:</span>
                <span className="text-on-surface font-medium">{alert.cameraName} ({alert.cameraId})</span>
              </div>
              <div>
                <span className="text-on-surface-variant block font-semibold">Location / Corridor:</span>
                <span className="text-on-surface font-medium">{alert.location}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block font-semibold">Assigned Responder:</span>
                <span className="text-on-surface font-medium">{alert.assignedOfficer || 'Control Room Desk 2'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block font-semibold">Dispatch Status:</span>
                <span className="text-primary font-medium">{alert.dispatchActionTaken || 'Patrol Unit En Route'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-low flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onResolve(alert.id);
              onClose();
            }}
            disabled={alert.status === 'resolved'}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              alert.status === 'resolved'
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
            }`}
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{alert.status === 'resolved' ? 'Alert Resolved' : 'Mark Resolved'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onInspectANPR(alert.vehicleNumber);
              }}
              className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold text-xs transition-colors"
            >
              Inspect ANPR
            </button>
            <button
              onClick={() => {
                onClose();
                onTrackVehicle(alert.vehicleNumber);
              }}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Track Trajectory</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
