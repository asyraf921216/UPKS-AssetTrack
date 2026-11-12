import React, { useState, useEffect } from 'react';
import { Asset } from '../types/asset';
import { generateQRCodeDataUrl, getAssetQRPayload } from '../utils/qrHelper';
import { Printer, X, CheckSquare, Square, QrCode } from 'lucide-react';

interface QRPrintSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAssets: Asset[];
  initialSelectedAssetIds?: string[];
}

interface PrintableLabelData {
  asset: Asset;
  qrDataUrl: string;
}

export const QRPrintSheetModal: React.FC<QRPrintSheetModalProps> = ({
  isOpen,
  onClose,
  allAssets,
  initialSelectedAssetIds,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [labels, setLabels] = useState<PrintableLabelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (initialSelectedAssetIds && initialSelectedAssetIds.length > 0) {
        setSelectedIds(initialSelectedAssetIds);
      } else {
        // default select all
        setSelectedIds(allAssets.map(a => a.id));
      }
    }
  }, [isOpen, initialSelectedAssetIds, allAssets]);

  useEffect(() => {
    let isCancelled = false;
    const generateLabels = async () => {
      setLoading(true);
      const targetAssets = allAssets.filter(a => selectedIds.includes(a.id));
      const results: PrintableLabelData[] = [];

      for (const asset of targetAssets) {
        const payload = getAssetQRPayload(asset);
        const qrUrl = await generateQRCodeDataUrl(payload);
        results.push({
          asset,
          qrDataUrl: qrUrl
        });
      }

      if (!isCancelled) {
        setLabels(results);
        setLoading(false);
      }
    };

    if (isOpen && selectedIds.length > 0) {
      generateLabels();
    } else {
      setLabels([]);
      setLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [selectedIds, allAssets, isOpen]);

  if (!isOpen) return null;

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === allAssets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allAssets.map(a => a.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Container - on print this fills the page */}
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] flex flex-col print:shadow-none print:border-none print:max-w-none print:max-h-none print:p-0 print:m-0"
        role="dialog"
        aria-modal="true"
      >
        {/* Screen Header (Hidden on Print) */}
        <div className="print:hidden flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Cetak Helaian Label Pelekat QR Aset
              </h3>
              <p className="text-xs text-slate-500">
                Pelekat fizikal berformat kemas untuk ditampal pada instrumen dan perabot UPKS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Screen Control Bar (Hidden on Print) */}
        <div className="print:hidden py-3 flex items-center justify-between flex-wrap gap-2 border-b border-slate-100">
          <div className="flex items-center space-x-3 text-xs text-slate-700">
            <button
              onClick={handleSelectAll}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold cursor-pointer"
            >
              {selectedIds.length === allAssets.length ? (
                <>
                  <CheckSquare className="w-4 h-4 text-teal-600" />
                  <span>Nyahpilih Semua</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-slate-400" />
                  <span>Pilih Semua ({allAssets.length})</span>
                </>
              )}
            </button>

            <span>
              <strong>{selectedIds.length}</strong> daripada {allAssets.length} aset dipilih untuk cetakan
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={selectedIds.length === 0 || loading}
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white text-xs sm:text-sm font-semibold shadow-sm transition flex items-center cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              <span>Cetak Sekarang (window.print)</span>
            </button>
          </div>
        </div>

        {/* Labels Content (Screen & Print Layout) */}
        <div className="overflow-y-auto p-2 sm:p-4 flex-1 print:overflow-visible print:p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-400">
              <QrCode className="w-8 h-8 animate-spin mx-auto mb-2 text-teal-600" />
              <p className="text-xs">Menjana kod QR bagi setiap label aset...</p>
            </div>
          ) : labels.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Sila pilih sekurang-kurangnya satu aset untuk mencetak label pelekat.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
              {labels.map(({ asset, qrDataUrl }) => {
                const isSelected = selectedIds.includes(asset.id);
                return (
                  <div
                    key={asset.id}
                    className={`border-2 rounded-xl p-3.5 bg-white relative flex items-center gap-3.5 break-inside-avoid print:border-black print:rounded-none ${
                      isSelected ? 'border-slate-800' : 'border-slate-300 opacity-40'
                    }`}
                  >
                    {/* Checkbox for screen toggling (Hidden on print) */}
                    <div className="print:hidden absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(asset.id)}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </div>

                    {/* QR Code Column */}
                    <div className="shrink-0 bg-white p-1 rounded border border-slate-200 print:border-none">
                      {qrDataUrl && (
                        <img
                          src={qrDataUrl}
                          alt={asset.registrationNo}
                          className="w-24 h-24 sm:w-28 sm:h-28 object-contain print:w-24 print:h-24"
                        />
                      )}
                    </div>

                    {/* Label Metadata Column */}
                    <div className="flex-1 min-w-0 pr-4 print:pr-0 space-y-0.5">
                      <div className="text-[10px] font-bold tracking-wider uppercase text-teal-800 print:text-black">
                        UPKS • UNIT STANDARD
                      </div>
                      <div className="font-mono text-xs sm:text-sm font-black text-slate-900 print:text-black tracking-tight">
                        {asset.registrationNo}
                      </div>
                      <div className="font-bold text-xs text-slate-800 print:text-black line-clamp-2 leading-tight">
                        {asset.name}
                      </div>
                      <div className="text-[11px] text-slate-600 print:text-black font-medium pt-0.5">
                        Kategori: {asset.category}
                      </div>
                      <div className="text-[10px] text-slate-500 print:text-black truncate">
                        Lokasi: {asset.defaultLocation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer (Hidden on print) */}
        <div className="print:hidden pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Tip: Format susun atur dioptimumkan untuk kertas pelekat label bersaiz A4 (2 lajur).</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
