import React, { useState } from 'react';
import { Vehicle, Sighting } from '../types';
import { SIGHTINGS_DATA } from '../data/mockData';

interface VehicleSearchPageProps {
  vehicles: Vehicle[];
  initialSearch?: string;
  onTrackVehicle: (plate: string) => void;
  onInspectANPR: (plate: string) => void;
}

export const VehicleSearchPage: React.FC<VehicleSearchPageProps> = ({
  vehicles,
  initialSearch = '',
  onTrackVehicle,
  onInspectANPR,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    vehicles.find(v => v.plateNumber === initialSearch) || vehicles[0]
  );

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.makeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.registeredOwnerState && v.registeredOwnerState.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRisk =
      filterRisk === 'all' || v.riskStatus === filterRisk;

    return matchesSearch && matchesRisk;
  });

  const sightings: Sighting[] = selectedVehicle
    ? SIGHTINGS_DATA[selectedVehicle.plateNumber] || SIGHTINGS_DATA['GJ05AB1234']
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            Vehicle Registry &amp; Spatio-Temporal Query Engine
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Query across historical license plate reads, correlated travel corridors, and automated BOLO risk registers.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[300px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plate (e.g. GJ05AB1234, DL8CAF7321)..."
            className="w-full pl-10 pr-4 py-2 text-xs font-mono font-bold rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setFilterRisk('all')}
          className={`px-3.5 py-1.5 rounded-full transition-all ${
            filterRisk === 'all'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container'
          }`}
        >
          All Vehicles ({vehicles.length})
        </button>
        <button
          onClick={() => setFilterRisk('normal')}
          className={`px-3.5 py-1.5 rounded-full transition-all ${
            filterRisk === 'normal'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-surface-container-lowest text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          Normal Verified ({vehicles.filter(v => v.riskStatus === 'normal').length})
        </button>
        <button
          onClick={() => setFilterRisk('watchlist')}
          className={`px-3.5 py-1.5 rounded-full transition-all ${
            filterRisk === 'watchlist'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-surface-container-lowest text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          Watchlist / Citations ({vehicles.filter(v => v.riskStatus === 'watchlist').length})
        </button>
        <button
          onClick={() => setFilterRisk('blacklisted')}
          className={`px-3.5 py-1.5 rounded-full transition-all ${
            filterRisk === 'blacklisted'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-surface-container-lowest text-rose-700 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          Blacklisted BOLO ({vehicles.filter(v => v.riskStatus === 'blacklisted').length})
        </button>
        <button
          onClick={() => setFilterRisk('anomaly')}
          className={`px-3.5 py-1.5 rounded-full transition-all ${
            filterRisk === 'anomaly'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-surface-container-lowest text-purple-700 border border-purple-200 hover:bg-purple-50'
          }`}
        >
          Route Anomalies ({vehicles.filter(v => v.riskStatus === 'anomaly').length})
        </button>
      </div>

      {/* Main Grid: Vehicles Table + Detail Dossier Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table: 2 Cols */}
        <div className="lg:col-span-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
            <span className="font-title-sm text-sm font-bold text-on-surface">
              Matched Vehicle Records ({filteredVehicles.length})
            </span>
            <span className="text-xs text-on-surface-variant font-mono">
              Database: 48,732 Total Edge Sightings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-lowest font-caption-caps text-[0.625rem] text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3 px-4">License Plate</th>
                  <th className="py-3 px-4">Vehicle Model</th>
                  <th className="py-3 px-4">Last Seen</th>
                  <th className="py-3 px-4">Sightings</th>
                  <th className="py-3 px-4">Risk Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-xs font-body-md">
                {filteredVehicles.map((v) => {
                  const isSelected = selectedVehicle?.id === v.id;
                  return (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={`hover:bg-surface-container transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/70 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-on-surface">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.625rem] px-1 py-0.5 rounded bg-primary text-white font-bold">
                            IND
                          </span>
                          <span className="tracking-wider">{v.plateNumber}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-on-surface">
                        <div>{v.makeModel}</div>
                        <div className="text-[0.6875rem] text-on-surface-variant">{v.color}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-on-surface-variant">
                        {v.lastSeen}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-on-surface">
                        {v.totalSightings} hits ({v.camerasVisited} cams)
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[0.625rem] font-bold uppercase px-2 py-0.5 rounded-full ${
                            v.riskStatus === 'blacklisted'
                              ? 'bg-rose-100 text-rose-800'
                              : v.riskStatus === 'watchlist'
                              ? 'bg-amber-100 text-amber-800'
                              : v.riskStatus === 'anomaly'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {v.riskStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTrackVehicle(v.plateNumber);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-container transition-all"
                        >
                          Track Route
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Vehicle Dossier: 1 Col */}
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs p-5 space-y-4">
          {selectedVehicle ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <div>
                  <span className="text-[0.625rem] uppercase font-bold text-on-surface-variant">
                    Vehicle Dossier
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xl font-extrabold text-on-surface">
                      {selectedVehicle.plateNumber}
                    </span>
                    <span
                      className={`text-[0.625rem] font-bold uppercase px-2 py-0.5 rounded-full ${
                        selectedVehicle.riskStatus === 'blacklisted'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {selectedVehicle.riskStatus}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[0.625rem] text-on-surface-variant uppercase font-semibold">OCR Score</span>
                  <div className="font-mono font-bold text-emerald-600 text-base">
                    {selectedVehicle.confidence}%
                  </div>
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Make &amp; Model:</span>
                  <span className="font-semibold text-on-surface">{selectedVehicle.makeModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Color / Body:</span>
                  <span className="font-semibold text-on-surface">{selectedVehicle.color} • {selectedVehicle.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Registered Region:</span>
                  <span className="font-semibold text-on-surface">{selectedVehicle.registeredOwnerState || 'State Transport'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Average Network Speed:</span>
                  <span className="font-mono font-semibold text-on-surface">{selectedVehicle.averageSpeed} km/h</span>
                </div>
                {selectedVehicle.flagReason && (
                  <div className="pt-2 border-t border-outline-variant/20 text-rose-600 font-semibold">
                    Flag: {selectedVehicle.flagReason}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onTrackVehicle(selectedVehicle.plateNumber)}
                  className="py-2 px-3 rounded-xl bg-primary text-white font-title-sm text-xs font-bold shadow-xs hover:bg-primary-container transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">route</span>
                  <span>Track Route</span>
                </button>
                <button
                  onClick={() => onInspectANPR(selectedVehicle.plateNumber)}
                  className="py-2 px-3 rounded-xl bg-surface-container-high text-on-surface font-title-sm text-xs font-bold hover:bg-surface-variant transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">document_scanner</span>
                  <span>Inspect ANPR</span>
                </button>
              </div>

              {/* Chronological Sightings Stream */}
              <div className="pt-2 space-y-2.5">
                <span className="font-bold text-xs text-on-surface block">
                  Chronological Camera Handoffs ({sightings.length})
                </span>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {sightings.map((s, i) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container transition-colors text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-on-surface">{s.cameraName}</div>
                        <div className="font-mono text-[0.6875rem] text-on-surface-variant">
                          {s.timestamp} • Speed: {s.speed} km/h • Lane #{s.lane}
                        </div>
                      </div>
                      <span className="font-mono text-emerald-600 font-bold text-xs">{s.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-on-surface-variant text-xs">
              Select a vehicle record to inspect its dossier
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
