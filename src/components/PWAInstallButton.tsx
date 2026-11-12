import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center h-8 px-2.5 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition cursor-pointer"
        title="Pasang Aplikasi ini pada Skrin Utama Peranti"
      >
        <Download className="w-3.5 h-3.5 mr-1" />
        <span className="hidden xs:inline">Pasang App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center h-8 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer"
          title="Panduan Pasang pada iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 mr-1 text-slate-400" />
          <span className="hidden xs:inline">Pasang PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl border border-slate-200 text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center">
                  <Smartphone className="w-4 h-4 mr-1.5 text-teal-600" />
                  Pasang pada iPhone / iPad (iOS)
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-3 text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  1. Tekan butang <strong>Kongsi (Share / <span className="font-mono">􀈂</span>)</strong> pada bar pelayar Safari.
                </p>
                <p>
                  2. Tatal ke bawah dan pilih <strong>"Tambah ke Skrin Utama" (Add to Home Screen)</strong>.
                </p>
                <p>
                  3. Tekan <strong>Tambah (Add)</strong> di penjuru kanan atas.
                </p>
                <div className="p-2.5 bg-teal-50 rounded border border-teal-200 text-teal-900 text-[11px]">
                  ✓ Selepas dipasang, UPKS AssetTrack boleh dibuka terus dari skrin utama dan berfungsi di makmal walaupun tiada sambungan internet.
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full mt-2 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition"
              >
                Faham & Tutup
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
