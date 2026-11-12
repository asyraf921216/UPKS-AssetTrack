import React from 'react';
import { Asset } from '../types/asset';
import { AlertOctagon, X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ChemicalExpiryModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedAnyway?: () => void;
}

export const ChemicalExpiryModal: React.FC<ChemicalExpiryModalProps> = ({
  asset,
  isOpen,
  onClose,
  onProceedAnyway,
}) => {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-rose-500 relative animate-in fade-in zoom-in duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-3 mb-3">
          <div className="w-11 h-11 rounded-lg bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
              Sekatan Keselamatan Makmal UPKS
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight mt-1">
              Amaran: Reagen Tamat Tempoh
            </h3>
          </div>
        </div>

        {/* Official Warning Quote */}
        <div className="p-3 bg-rose-50 border-l-4 border-rose-600 rounded-r text-xs text-rose-950 font-semibold mb-3 leading-relaxed">
          "Bahan uji ini telah tamat tempoh dan tidak boleh digunakan untuk ujian pensijilan UPKS."
        </div>

        {/* Chemical Metadata */}
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1.5 mb-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Nama Bahan Kimia:</span>
            <span className="font-bold text-slate-900 text-right">{asset.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">No. Siri KEW.PA:</span>
            <span className="font-mono font-bold text-slate-800">{asset.registrationNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tarikh Luput:</span>
            <span className="font-mono font-bold text-rose-700">{asset.expiryDate} (Telah Lepas)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Kuantiti Baki:</span>
            <span className="font-semibold text-slate-800">{asset.quantityUnit || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Lokasi Semasa:</span>
            <span className="font-semibold text-slate-800">{asset.currentLocation}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Penggunaan bahan reagen tamat tempoh boleh menjejaskan integriti keputusan ujian getah dan melanggar audit akreditasi makmal <strong>ISO/IEC 17025</strong>. Sila asingkan reagen ini ke stor kuarantin sisa kimia.
        </p>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition"
          >
            Tutup & Batalkan
          </button>
          {onProceedAnyway && (
            <button
              type="button"
              onClick={onProceedAnyway}
              className="py-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
              title="Akses khas jika perlu merekod pelupusan"
            >
              Teruskan Butiran
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
