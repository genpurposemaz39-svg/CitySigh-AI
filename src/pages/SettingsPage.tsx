import React, { useState } from 'react';
import { CCTV_IMAGES } from '../data/mockData';

interface SettingsPageProps {
  onResetDemo: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onResetDemo }) => {
  const [ocrThreshold, setOcrThreshold] = useState<number>(85);
  const [expresswayLimit, setExpresswayLimit] = useState<number>(80);
  const [arterialLimit, setArterialLimit] = useState<number>(50);
  const [syncInterval, setSyncInterval] = useState<string>('5');
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            System Administration &amp; Edge Parameters
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Configure detection confidence ceilings, speed violation triggers, and municipal police database hooks.
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-rose-600 font-title-sm text-xs font-bold transition-colors border border-rose-200"
        >
          <span className="material-symbols-outlined text-base">restart_alt</span>
          <span>Reset Prototype State</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Configuration Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: ANPR Deep Learning Parameters */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <h3 className="font-title-sm text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">memory</span>
              <span>Edge ANPR &amp; OCR Inference Ceilings</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-on-surface">Minimum OCR Confidence Threshold:</span>
                  <span className="font-mono text-primary font-bold">{ocrThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={ocrThreshold}
                  onChange={(e) => setOcrThreshold(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <p className="text-[0.6875rem] text-on-surface-variant mt-1">
                  Reads falling below this threshold are routed to human operator review desks.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-outline-variant/20">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Vehicle Detector Architecture</label>
                  <select className="w-full p-2 rounded-lg bg-surface border border-outline-variant/40 font-mono text-xs font-semibold text-on-surface">
                    <option>YOLOv10-X (TensorRT FP16)</option>
                    <option>YOLOv9-E Edge</option>
                    <option>RT-DETR Ultra</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Temporal Fusion Window</label>
                  <select className="w-full p-2 rounded-lg bg-surface border border-outline-variant/40 font-mono text-xs font-semibold text-on-surface">
                    <option>5 Frames (+/- 80ms stack)</option>
                    <option>7 Frames (+/- 120ms stack)</option>
                    <option>3 Frames (Ultra Low Latency)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Speed Ceilings & Enforcement */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <h3 className="font-title-sm text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600">speed</span>
              <span>Corridor Speed Enforcement Limits</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Expressway North Ceiling (km/h)</label>
                <input
                  type="number"
                  value={expresswayLimit}
                  onChange={(e) => setExpresswayLimit(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-surface border border-outline-variant/40 font-mono font-bold text-on-surface"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface block mb-1">Arterial / CBD Ceiling (km/h)</label>
                <input
                  type="number"
                  value={arterialLimit}
                  onChange={(e) => setArterialLimit(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-surface border border-outline-variant/40 font-mono font-bold text-on-surface"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Police BOLO Sync */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <h3 className="font-title-sm text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">sync</span>
              <span>Law Enforcement BOLO Database Federation</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Municipal Police Registry API</label>
                <input
                  type="text"
                  readOnly
                  value="https://police.surat.gov.in/api/v3/bolo/live-feed"
                  className="w-full p-2 rounded-lg bg-surface border border-outline-variant/40 font-mono text-on-surface text-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Auto-Sync Heartbeat</label>
                <select
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface border border-outline-variant/40 font-semibold text-on-surface"
                >
                  <option value="1">Every 1 Minute (High Intensity)</option>
                  <option value="5">Every 5 Minutes (Recommended)</option>
                  <option value="15">Every 15 Minutes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {savedFeedback && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Configuration applied successfully!</span>
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-title-sm text-xs font-bold shadow-md transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>

        {/* Right 1 Col: Admin Profile & Build Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4 text-center">
            <img
              src={CCTV_IMAGES.adminAvatar}
              alt="Amit S."
              className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-primary/20"
            />
            <div>
              <h3 className="font-bold text-base text-on-surface">Amit S.</h3>
              <p className="text-xs text-primary font-semibold">Chief Traffic Operations Lead</p>
              <p className="text-[0.6875rem] text-on-surface-variant mt-0.5">Municipal Command &amp; Control Centre</p>
            </div>

            <div className="pt-3 border-t border-outline-variant/20 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Operator ID:</span>
                <span className="font-mono font-bold text-on-surface">OP-8842</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Security Clearance:</span>
                <span className="font-bold text-emerald-600">Tier 1 (Full Access)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Active Session:</span>
                <span className="font-mono text-on-surface">Surat Smart City WAN</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-3 text-xs">
            <span className="font-bold text-on-surface block">About CitySight AI</span>
            <p className="text-on-surface-variant leading-relaxed">
              Developed for the Smart India Hackathon (SIH 2026). Engineered with React 18, Vite, Tailwind CSS, and edge inference telemetry for next-generation municipal traffic surveillance.
            </p>
            <div className="pt-2 border-t border-outline-variant/20 font-mono text-[0.625rem] text-slate-400">
              Build Hash: sih-2026-edge-release-v2.4.9
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
