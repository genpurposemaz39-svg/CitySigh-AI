import React, { useState } from 'react';
import { TrafficAnalyticsData } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

interface TrafficAnalyticsPageProps {
  analytics: TrafficAnalyticsData;
  onNavigateSector?: (sectorName: string) => void;
}

export const TrafficAnalyticsPage: React.FC<TrafficAnalyticsPageProps> = ({
  analytics,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'od' | 'bottlenecks' | 'modal'>('flow');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            Municipal Traffic Analytics &amp; Flow Dynamics
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Origin-Destination trip matrices, diurnal corridor velocity profiling, and adaptive traffic signal control.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center bg-surface-container rounded-xl p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'flow' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'
            }`}
          >
            24h Diurnal Flow
          </button>
          <button
            onClick={() => setActiveTab('od')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'od' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'
            }`}
          >
            Origin-Destination
          </button>
          <button
            onClick={() => setActiveTab('bottlenecks')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bottlenecks' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'
            }`}
          >
            Chokepoints
          </button>
          <button
            onClick={() => setActiveTab('modal')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'modal' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'
            }`}
          >
            Modal Split
          </button>
        </div>
      </div>

      {/* Top 3 Analytical KPI Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="font-caption-caps text-xs text-on-surface-variant font-bold uppercase">
              Peak Hourly City Flow
            </span>
            <div className="font-display-lg text-3xl font-extrabold text-on-surface mt-2">
              {analytics.peakHourlyFlow.toLocaleString()} <span className="text-sm font-semibold text-on-surface-variant">veh/hr</span>
            </div>
            <span className="text-xs text-rose-600 font-semibold mt-1 block">Recorded at 18:00 Peak Window</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-primary">
            <span className="material-symbols-outlined text-2xl">traffic</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="font-caption-caps text-xs text-on-surface-variant font-bold uppercase">
              Average Network Velocity
            </span>
            <div className="font-display-lg text-3xl font-extrabold text-on-surface mt-2">
              {analytics.averageCitySpeed} <span className="text-sm font-semibold text-on-surface-variant">km/h</span>
            </div>
            <span className="text-xs text-amber-600 font-semibold mt-1 block">-14% during evening congestion</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-tertiary">
            <span className="material-symbols-outlined text-2xl">speed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="font-caption-caps text-xs text-on-surface-variant font-bold uppercase">
              Active Adaptive Signals
            </span>
            <div className="font-display-lg text-3xl font-extrabold text-emerald-600 mt-2">
              {analytics.totalActiveSignals} / {analytics.totalActiveSignals}
            </div>
            <span className="text-xs text-emerald-700 font-semibold mt-1 block">100% Dynamic SCATS Optimization</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <span className="material-symbols-outlined text-2xl">sensors</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          {/* Diurnal Traffic Area Chart */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-title-sm text-base font-bold text-on-surface">
                  24-Hour Diurnal Volume &amp; Speed Curves
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Real-time aggregation across all 42 municipal monitoring nodes.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  Hourly Volume (Vehicles)
                </span>
                <span className="flex items-center gap-1.5 text-secondary">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  Speed (km/h)
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.hourlyFlow}>
                  <defs>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b1329',
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="vehicles"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#volGrad)"
                    name="Vehicles/Hour"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector Capacity Table */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <h3 className="font-title-sm text-base font-bold text-on-surface">
              Sector Capacity &amp; Corridor Traversal Saturation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.sectors.map((sec) => (
                <div key={sec.id} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-on-surface">{sec.name}</span>
                    <span
                      className={`text-[0.625rem] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                        sec.status === 'CONG'
                          ? 'bg-rose-100 text-rose-800'
                          : sec.status === 'HEAVY'
                          ? 'bg-amber-100 text-amber-800'
                          : sec.status === 'MOD'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sec.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-on-surface-variant mb-1">
                      <span>Corridor Saturation:</span>
                      <span className="font-mono text-on-surface">{sec.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sec.percentage > 80
                            ? 'bg-rose-500'
                            : sec.percentage > 60
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${sec.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs pt-1 border-t border-outline-variant/20 font-mono text-[0.6875rem] text-slate-500">
                    <span>Flow: {sec.flowPerHour} veh/hr</span>
                    <span>Avg: {sec.avgSpeed} km/h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'od' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
          <h3 className="font-title-sm text-base font-bold text-on-surface">
            Origin-Destination (O-D) Matrix Corridors
          </h3>
          <p className="text-xs text-on-surface-variant">
            Trips reconstructed via multi-camera handoffs across morning and evening commuter intervals:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low font-caption-caps text-[0.625rem] text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3 px-4">Origin Node</th>
                  <th className="py-3 px-4">Destination Node</th>
                  <th className="py-3 px-4">Connecting Corridor</th>
                  <th className="py-3 px-4">Hourly Volume</th>
                  <th className="py-3 px-4">Trend vs Baseline</th>
                  <th className="py-3 px-4">Peak Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-xs font-body-md">
                {analytics.odFlows.map((flow, i) => (
                  <tr key={i} className="hover:bg-surface-container transition-colors">
                    <td className="py-3.5 px-4 font-bold text-on-surface">{flow.origin}</td>
                    <td className="py-3.5 px-4 font-bold text-on-surface">{flow.destination}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{flow.corridor}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-on-surface">
                      {flow.count.toLocaleString()} veh/hr
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        flow.changePercent > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {flow.changePercent > 0 ? `+${flow.changePercent}%` : `${flow.changePercent}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-slate-500">
                      {flow.peakHour}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bottlenecks' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
          <h3 className="font-title-sm text-base font-bold text-on-surface">
            Congestion Chokepoint &amp; Adaptive Signal Intervention
          </h3>
          <p className="text-xs text-on-surface-variant">
            Automated queue length detection and adaptive green-extension interventions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.congestionChokepoints.map((cp, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface">{cp.name}</span>
                  <span
                    className={`text-[0.625rem] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                      cp.status === 'Severe' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cp.status}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant">{cp.corridor}</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-outline-variant/20">
                  <div>
                    <span className="text-[0.625rem] text-slate-400 block uppercase">Queue Length</span>
                    <span className="font-bold text-rose-600 text-sm">{cp.queueLengthMeters} meters</span>
                  </div>
                  <div>
                    <span className="text-[0.625rem] text-slate-400 block uppercase">Travel Delay</span>
                    <span className="font-bold text-on-surface text-sm">+{cp.delaySeconds} seconds</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">tune</span>
                  <span>{cp.adaptiveSignalState}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'modal' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-6">
          <h3 className="font-title-sm text-base font-bold text-on-surface">
            Modal Vehicle Classification Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.modalSplit.map((modal, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-on-surface">{modal.type}</span>
                  <span className="font-mono text-base font-extrabold text-primary">{modal.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${modal.percentage}%` }}></div>
                </div>
                <div className="font-mono text-xs text-on-surface-variant pt-1">
                  {modal.count.toLocaleString()} vehicles logged
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
