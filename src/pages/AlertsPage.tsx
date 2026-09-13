import React, { useState } from 'react';
import { Alert, AlertStatus } from '../types';

interface AlertsPageProps {
  alerts: Alert[];
  onSelectAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onTrackVehicle: (plate: string) => void;
  onInspectANPR: (plate: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onSelectAlert,
  onResolveAlert,
  onTrackVehicle,
  onInspectANPR,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [statusTab, setStatusTab] = useState<'active' | 'resolved'>('active');

  const categories = ['All', 'Blacklisted', 'Anomalies', 'Overspeeding', 'Unusual Stop', 'Low Confidence OCR'];

  const filteredAlerts = alerts.filter((alt) => {
    const matchesStatus =
      statusTab === 'active'
        ? alt.status === 'active' || alt.status === 'investigating'
        : alt.status === 'resolved';

    if (!matchesStatus) return false;
    if (filterCategory === 'All') return true;
    return alt.type.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const activeCount = alerts.filter(a => a.status === 'active' || a.status === 'investigating').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            Alerts &amp; Intelligence Command
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Automated law enforcement BOLO alerts, speed ceiling violations, and anomalous route trajectory flags.
          </p>
        </div>

        {/* Status Switcher Tabs */}
        <div className="flex items-center bg-surface-container rounded-xl p-1 text-xs font-semibold">
          <button
            onClick={() => setStatusTab('active')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              statusTab === 'active'
                ? 'bg-surface-container-lowest text-rose-600 font-bold shadow-xs'
                : 'text-on-surface-variant'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>Active Incidents ({activeCount})</span>
          </button>
          <button
            onClick={() => setStatusTab('resolved')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              statusTab === 'resolved'
                ? 'bg-surface-container-lowest text-emerald-600 font-bold shadow-xs'
                : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Resolved History ({resolvedCount})</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-emerald-600 mb-2 block">
              verified
            </span>
            <p className="font-bold text-sm text-on-surface">No alerts in this category.</p>
            <p className="text-xs mt-1">All incidents in this queue are currently clear.</p>
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[0.625rem] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      alt.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : alt.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {alt.type}
                  </span>
                  <span className="font-mono text-xs text-on-surface-variant">{alt.timestamp}</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-white text-[0.625rem] font-bold px-1.5 py-0.5 rounded">
                      IND
                    </span>
                    <span className="font-mono text-lg font-extrabold text-on-surface tracking-wide">
                      {alt.vehicleNumber}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    Conf: {alt.confidence}%
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  {alt.details}
                </p>

                <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{alt.cameraName}</span>
                  <span>{alt.speed ? `Velocity: ${alt.speed} km/h` : 'Stationary'}</span>
                </div>
              </div>

              {/* Card Bottom Actions */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectAlert(alt.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>Inspect Docket</span>
                </button>

                <div className="flex items-center gap-2">
                  {alt.status !== 'resolved' && (
                    <button
                      onClick={() => onResolveAlert(alt.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => onTrackVehicle(alt.vehicleNumber)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-container transition-colors flex items-center gap-1"
                  >
                    <span>Track Route</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
