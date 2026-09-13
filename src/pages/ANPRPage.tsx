import React, { useState } from 'react';
import { ANPRResult } from '../types';
import { ANPR_RESULT_SAMPLE, CCTV_IMAGES } from '../data/mockData';

interface ANPRPageProps {
  initialPlate?: string;
  onTrackVehicle: (plate: string) => void;
  onViewVehicleSearch: (plate: string) => void;
}

export const ANPRPage: React.FC<ANPRPageProps> = ({
  initialPlate = 'GJ05AB1234',
  onTrackVehicle,
  onViewVehicleSearch,
}) => {
  const [selectedPlate, setSelectedPlate] = useState<string>(initialPlate);
  const [selectedFrame, setSelectedFrame] = useState<number>(4); // Frame 4 is anchor

  const plateOptions = [
    { plate: 'GJ05AB1234', label: 'GJ 05 AB 1234 (Verified White SUV - 96.8%)' },
    { plate: 'DL8CAF7321', label: 'DL 8C AF 7321 (Black Fortuner - BOLO 97.4%)' },
    { plate: 'MH12MK4587', label: 'MH 12 MK 4587 (Silver Scorpio - 90.2%)' },
    { plate: 'UP32AB5678', label: 'UP 32 AB 5678 (Red City - Overspeeding 92.1%)' },
  ];

  const anprData: ANPRResult = {
    ...ANPR_RESULT_SAMPLE,
    plateNumber: selectedPlate,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            ANPR Multi-Frame Deep Learning Pipeline
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            End-to-end edge OCR fusion with Indian HSRP syntax validation and adverse condition de-raining.
          </p>
        </div>

        {/* Plate Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-on-surface-variant uppercase">Inspect Sample:</label>
          <select
            value={selectedPlate}
            onChange={(e) => setSelectedPlate(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-xs font-bold font-mono text-on-surface shadow-xs"
          >
            {plateOptions.map((opt) => (
              <option key={opt.plate} value={opt.plate}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Banner: Recognized Plate Result */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full lg:w-auto">
          {/* Indian Plate Display Component */}
          <div className="flex items-center rounded-xl bg-slate-950 p-2.5 border-2 border-slate-800 shadow-lg">
            <div className="flex flex-col items-center justify-center bg-blue-700 text-white font-bold text-[0.625rem] px-2 py-1 rounded-l">
              <span>IND</span>
              <div className="w-2.5 h-2.5 rounded-full border border-white mt-0.5"></div>
            </div>
            <div className="px-4 py-1 font-mono font-extrabold text-2xl tracking-widest text-white">
              {selectedPlate.slice(0, 2)} {selectedPlate.slice(2, 4)} {selectedPlate.slice(4, 6)} {selectedPlate.slice(6)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-on-surface">{anprData.vehicleType}</span>
              <span className="text-[0.6875rem] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {anprData.recognitionStatus}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Source: {anprData.cameraName} • Timestamp: {anprData.timestamp}
            </p>
          </div>
        </div>

        {/* Confidence & Actions */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
          <div className="text-right">
            <span className="text-[0.625rem] font-bold text-on-surface-variant uppercase tracking-wider block">
              Confidence Fused Score
            </span>
            <span className="font-mono text-2xl font-extrabold text-emerald-600">
              {anprData.ocrConfidence}%
            </span>
          </div>

          <button
            onClick={() => onTrackVehicle(selectedPlate)}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-title-sm text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">alt_route</span>
            <span>Reconstruct Trajectory</span>
          </button>
        </div>
      </div>

      {/* 2 Columns: Visual OCR Inspector & Pipeline Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visual Feed with Bounding Boxes */}
        <div className="space-y-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <h3 className="font-title-sm text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">filter_center_focus</span>
            <span>Edge Spatial Localization &amp; Bounding Boxes</span>
          </h3>

          {/* CCTV Image with Bounding Boxes */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={CCTV_IMAGES.anprCarZoom}
              alt="ANPR Target"
              className="w-full h-full object-cover"
            />
            {/* Vehicle Box */}
            <div
              className="absolute border-2 border-sky-400 bg-sky-500/10 rounded pointer-events-none"
              style={{
                left: `${anprData.vehicleBoundingBox.x}%`,
                top: `${anprData.vehicleBoundingBox.y}%`,
                width: `${anprData.vehicleBoundingBox.width}%`,
                height: `${anprData.vehicleBoundingBox.height}%`,
              }}
            >
              <span className="text-[0.5625rem] font-mono font-bold bg-sky-600 text-white px-1 py-0.5 rounded-xs absolute -top-5 left-0">
                SUV: 99.1%
              </span>
            </div>

            {/* License Plate Box */}
            <div
              className="absolute border-2 border-emerald-400 bg-emerald-500/20 rounded pointer-events-none"
              style={{
                left: `${anprData.plateBoundingBox.x}%`,
                top: `${anprData.plateBoundingBox.y}%`,
                width: `${anprData.plateBoundingBox.width}%`,
                height: `${anprData.plateBoundingBox.height}%`,
              }}
            >
              <span className="text-[0.5625rem] font-mono font-bold bg-emerald-600 text-white px-1 py-0.5 rounded-xs absolute -bottom-5 left-0 whitespace-nowrap">
                PLATE ROI: 98.4%
              </span>
            </div>
          </div>

          {/* High Resolution Plate Crop */}
          <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-on-surface">Super-Resolved Plate Region (SR-CNN x4)</span>
              <span className="font-mono text-[0.6875rem] text-emerald-600 font-semibold">Bilateral Filtered</span>
            </div>
            <div className="h-16 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center p-2 border border-outline-variant/40">
              <img
                src={CCTV_IMAGES.anprPlateLarge}
                alt="License Plate Crop"
                className="max-h-full object-contain filter contrast-125"
              />
            </div>
          </div>
        </div>

        {/* Right: Multi-Frame Temporal Fusion Comparison */}
        <div className="space-y-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-title-sm text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">stacked_line_chart</span>
              <span>5-Frame Temporal OCR Fusion Stack</span>
            </h3>
            <span className="text-xs font-mono font-semibold text-primary">
              Anchor: Frame #{selectedFrame}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            By analyzing multiple successive video frames across vehicle motion, temporal fusion eliminates
            vibration blur, water droplets, and reflection artifacts to deliver 99%+ character certainty.
          </p>

          <div className="space-y-2.5">
            {anprData.frames.map((f) => (
              <div
                key={f.frameNumber}
                onClick={() => setSelectedFrame(f.frameNumber)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedFrame === f.frameNumber
                    ? 'bg-blue-50/60 border-primary ring-1 ring-primary'
                    : 'bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-on-surface">
                      Frame #{f.frameNumber} ({f.timestampOffset})
                    </span>
                    <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      Sharpness: {f.sharpnessScore}/100
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {f.confidence}%
                  </span>
                </div>

                {/* Progress bar representing confidence */}
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      f.confidence > 95 ? 'bg-emerald-500' : 'bg-primary'
                    }`}
                    style={{ width: `${f.confidence}%` }}
                  ></div>
                </div>

                {/* Character Level Breakdown */}
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-outline-variant/20 font-mono text-[0.625rem] text-slate-500">
                  <span>Character Confidences:</span>
                  <span className="tracking-wider text-slate-700 font-semibold">
                    {f.characterConfidences.join('%  ')}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Adverse Condition Environmental Stress Tests */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
        <h3 className="font-title-sm text-base font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">verified_user</span>
          <span>Adverse Environmental Condition Stress Testing</span>
        </h3>
        <p className="text-xs text-on-surface-variant">
          Tested against extreme municipal operating conditions according to SIH 2026 surveillance benchmarks:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {anprData.conditions.map((cond, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-on-surface">{cond.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[0.6875rem] font-mono text-primary font-semibold">{cond.metric}</div>
              <p className="text-[0.6875rem] text-on-surface-variant leading-tight">{cond.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
