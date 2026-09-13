import React, { useState } from 'react';
import { EvidentiaryReport } from '../types';
import { apiService } from '../services/apiService';

interface ReportsPageProps {
  reports: EvidentiaryReport[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ reports }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadCsv = (report: EvidentiaryReport) => {
    setDownloadingId(report.id);
    const csvContent = apiService.exportCsvData(report.title);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingId(null), 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            Evidentiary Dossiers &amp; Municipal Reports
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Export legally compliant CSV/PDF traffic audits, ANPR recognition ledgers, and trajectory tracking logs.
          </p>
        </div>

        <button
          onClick={() => {
            const first = reports[0];
            if (first) handleDownloadCsv(first);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-title-sm text-xs font-bold shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-base">file_download</span>
          <span>Download Daily Bundle (CSV)</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                  {rep.category}
                </span>
                <span className="text-xs text-on-surface-variant font-mono">{rep.fileSizeBytes}</span>
              </div>

              <h3 className="font-bold text-base text-on-surface mt-3">
                {rep.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                {rep.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-outline-variant/20 text-xs font-mono text-slate-500">
                <div>
                  <span className="text-[0.625rem] text-slate-400 block uppercase">Reporting Period</span>
                  <span className="text-on-surface font-semibold">{rep.period}</span>
                </div>
                <div>
                  <span className="text-[0.625rem] text-slate-400 block uppercase">Record Ledger</span>
                  <span className="text-on-surface font-semibold">{rep.recordCount.toLocaleString()} Entries</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[0.6875rem] text-on-surface-variant">
                Generated: {rep.generatedDate}
              </span>

              <button
                onClick={() => handleDownloadCsv(rep)}
                disabled={downloadingId === rep.id}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-title-sm text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  {downloadingId === rep.id ? 'sync' : 'download'}
                </span>
                <span>{downloadingId === rep.id ? 'Exporting...' : 'Download CSV'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
