import React, { useState, useEffect } from 'react';
import { TrajectoryData } from '../types';
import { TRAJECTORY_DATA_SAMPLE } from '../data/mockData';

interface TrajectoryTrackingPageProps {
  plateNumber?: string;
  onSelectCamera: (cameraId: string) => void;
  onInspectANPR: (plate: string) => void;
}

export const TrajectoryTrackingPage: React.FC<TrajectoryTrackingPageProps> = ({
  plateNumber = 'GJ05AB1234',
  onSelectCamera,
  onInspectANPR,
}) => {
  const [activeCheckpointIndex, setActiveCheckpointIndex] = useState<number>(3); // last checkpoint
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const trajectory: TrajectoryData = {
    ...TRAJECTORY_DATA_SAMPLE,
    plateNumber: plateNumber || TRAJECTORY_DATA_SAMPLE.plateNumber,
  };

  // Trajectory playback loop simulation
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveCheckpointIndex((prev) => {
          if (prev >= trajectory.checkpoints.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, trajectory.checkpoints.length]);

  const activeCp = trajectory.checkpoints[activeCheckpointIndex] || trajectory.checkpoints[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
              Spatio-Temporal Trajectory Reconstruction
            </h1>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-extrabold text-sm border border-slate-700">
              <span className="bg-primary px-1.5 py-0.5 rounded text-[0.625rem]">IND</span>
              <span>{trajectory.plateNumber}</span>
            </div>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Automated multi-camera correlation, velocity interpolation, and predictive corridor egress tracking.
          </p>
        </div>

        {/* Playback Controls & ANPR Crosslink */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveCheckpointIndex(0);
              setIsPlaying(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-title-sm text-xs font-semibold shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-base">
              {isPlaying ? 'pause' : 'replay'}
            </span>
            <span>{isPlaying ? 'Pause Playback' : 'Replay Path'}</span>
          </button>
          <button
            onClick={() => onInspectANPR(trajectory.plateNumber)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-title-sm text-xs font-semibold shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-base">document_scanner</span>
            <span>Inspect ANPR Frame</span>
          </button>
        </div>
      </div>

      {/* Trajectory Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="text-[0.625rem] font-bold uppercase text-on-surface-variant block">Total Route Distance</span>
          <div className="font-mono text-lg font-extrabold text-on-surface mt-0.5">{trajectory.totalDistanceKm} km</div>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="text-[0.625rem] font-bold uppercase text-on-surface-variant block">Corridor Duration</span>
          <div className="font-mono text-lg font-extrabold text-on-surface mt-0.5">{trajectory.durationMin} mins</div>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="text-[0.625rem] font-bold uppercase text-on-surface-variant block">Average Velocity</span>
          <div className="font-mono text-lg font-extrabold text-on-surface mt-0.5">{trajectory.avgSpeedKmh} km/h</div>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="text-[0.625rem] font-bold uppercase text-on-surface-variant block">Overall Conf Score</span>
          <div className="font-mono text-lg font-extrabold text-emerald-600 mt-0.5">{trajectory.confidenceOverall}%</div>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="text-[0.625rem] font-bold uppercase text-on-surface-variant block">Camera Matching</span>
          <div className="font-mono text-lg font-extrabold text-secondary mt-0.5">{trajectory.cameraMatchingConf}%</div>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="text-[0.625rem] font-bold uppercase text-on-surface-variant block">Current State</span>
          <div className="font-title-sm text-xs font-extrabold text-primary mt-1 uppercase">{trajectory.currentStatus}</div>
        </div>
      </div>

      {/* Main Grid: GIS Trajectory Map + Checkpoint Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Animated Tactical Path Map */}
        <div className="lg:col-span-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs overflow-hidden flex flex-col">
          {/* Map Top Bar */}
          <div className="p-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">timeline</span>
              <span className="font-title-sm text-sm font-bold text-on-surface">
                Reconstructed Coordinate Path (4 Checkpoints)
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-primary">
              Active: {activeCp.cameraName}
            </span>
          </div>

          {/* GIS Map Visualization */}
          <div className="relative w-full h-[460px] bg-[#091024] overflow-hidden select-none">
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern height="40" id="traj-grid" patternUnits="userSpaceOnUse" width="40">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect fill="url(#traj-grid)" height="100%" width="100%" />
            </svg>

            {/* Roads and Animated Glowing Trajectory */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 460">
              <defs>
                <linearGradient id="trajGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {/* Road Corridors */}
              <path d="M 40 230 L 660 230" stroke="#1e293b" strokeLinecap="round" strokeWidth="20" />
              <path d="M 350 30 L 350 430" stroke="#1e293b" strokeLinecap="round" strokeWidth="18" />
              <path d="M 120 420 Q 350 340 600 80" fill="none" stroke="#1e293b" strokeLinecap="round" strokeWidth="16" />

              {/* Trajectory Polyline */}
              <path
                d="M 180 160 L 290 220 L 380 260 L 580 370"
                fill="none"
                stroke="url(#trajGlow)"
                strokeDasharray="6,4"
                strokeLinecap="round"
                strokeWidth="4"
              />

              {/* Waypoint Nodes */}
              {trajectory.checkpoints.map((cp, idx) => {
                const isActive = idx === activeCheckpointIndex;
                const isPassed = idx <= activeCheckpointIndex;
                return (
                  <g key={cp.checkpointId}>
                    <circle
                      cx={cp.coordinateX}
                      cy={cp.coordinateY}
                      r={isActive ? 16 : 8}
                      fill={isActive ? '#38bdf8' : isPassed ? '#2563eb' : '#64748b'}
                      opacity={isActive ? 0.35 : 0.8}
                    />
                    <circle
                      cx={cp.coordinateX}
                      cy={cp.coordinateY}
                      r={isActive ? 7 : 4}
                      fill={isActive ? '#ffffff' : '#38bdf8'}
                    />
                    <text
                      x={cp.coordinateX + 12}
                      y={cp.coordinateY - 10}
                      fill="#e2e8f0"
                      fontFamily="JetBrains Mono"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {cp.cameraId} ({cp.timestamp.slice(0, 5)})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Next Predicted Handoff Card Overlay */}
            {trajectory.nextPredictedHandoff && (
              <div className="absolute bottom-4 right-4 max-w-xs bg-[#0b1329]/95 backdrop-blur border border-primary/40 rounded-xl p-3 text-xs text-white shadow-xl">
                <div className="flex items-center gap-1.5 text-secondary-container font-semibold text-[0.6875rem] uppercase">
                  <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
                  <span>Predicted Handoff Egress</span>
                </div>
                <div className="font-bold text-sm text-white mt-1">
                  {trajectory.nextPredictedHandoff.predictedCameraName}
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 font-mono text-[0.6875rem] text-slate-300">
                  <span>ETA: {trajectory.nextPredictedHandoff.estimatedArrival}</span>
                  <span className="text-emerald-400 font-bold">
                    {trajectory.nextPredictedHandoff.probability}% Prob
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Checkpoint Details & Snapshot */}
        <div className="space-y-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs p-5">
          <h3 className="font-title-sm text-base font-bold text-on-surface">
            Checkpoint Telemetry Log
          </h3>

          {/* Active Checkpoint Snapshot */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={activeCp.snapshotUrl}
              alt={activeCp.cameraName}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs p-2 rounded-lg text-white font-mono text-[0.625rem] flex items-center justify-between">
              <span>{activeCp.cameraName}</span>
              <span className="text-emerald-400 font-bold">{activeCp.speed} km/h</span>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between bg-surface-container rounded-xl p-1.5">
            <button
              onClick={() => setActiveCheckpointIndex(prev => Math.max(0, prev - 1))}
              disabled={activeCheckpointIndex === 0}
              className="p-1.5 rounded-lg text-on-surface hover:bg-surface-container-highest disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <span className="font-mono text-xs font-bold text-on-surface">
              Waypoint {activeCheckpointIndex + 1} of {trajectory.checkpoints.length}
            </span>
            <button
              onClick={() => setActiveCheckpointIndex(prev => Math.min(trajectory.checkpoints.length - 1, prev + 1))}
              disabled={activeCheckpointIndex === trajectory.checkpoints.length - 1}
              className="p-1.5 rounded-lg text-on-surface hover:bg-surface-container-highest disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>

          {/* Chronological Checkpoints List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {trajectory.checkpoints.map((cp, idx) => (
              <div
                key={cp.checkpointId}
                onClick={() => setActiveCheckpointIndex(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                  idx === activeCheckpointIndex
                    ? 'bg-blue-50/70 border-primary shadow-xs'
                    : 'bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">{cp.cameraName}</span>
                  <span className="font-mono text-emerald-600 font-bold">{cp.confidence}%</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[0.6875rem] text-on-surface-variant font-mono">
                  <span>{cp.timestamp}</span>
                  <span>{cp.speed} km/h • {cp.heading}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
