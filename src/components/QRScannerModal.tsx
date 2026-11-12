import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Asset } from '../types/asset';
import { parseScannedQRData } from '../utils/qrHelper';
import { getAssetDisplayImage } from '../utils/categoryImages';
import { isChemicalExpired } from '../utils/chemicalExpiry';
import { StatusBadge } from './AssetBadge';
import { 
  Camera, 
  X, 
  Search, 
  AlertTriangle, 
  ArrowRightLeft, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  RefreshCw,
  AlertOctagon,
  MapPin
} from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onAssetFound: (asset: Asset) => void;
  onQuickBorrow: (asset: Asset) => void;
  onQuickReturn: (asset: Asset) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  assets,
  onAssetFound,
  onQuickBorrow,
  onQuickReturn,
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [manualError, setManualError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'upks-qr-reader-container';

  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      setCameraError(null);
      setManualInput('');
      setManualError('');
      setScannedAsset(null);

      const timer = setTimeout(async () => {
        try {
          const scanner = new Html5Qrcode(scannerContainerId);
          scannerRef.current = scanner;

          await scanner.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 240, height: 240 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              if (!isMounted) return;
              handleScannedResult(decodedText);
            },
            () => {
              // Ignore frame decode misses
            }
          );

          if (isMounted) {
            setIsScanning(true);
          }
        } catch (err: any) {
          if (!isMounted) return;
          console.warn('QR Camera initialization error:', err);
          const errorMsg = 
            err?.name === 'NotAllowedError' 
              ? 'Kebenaran kamera disekat oleh pelayar. Sila berikan akses kamera atau gunakan carian manual.'
              : err?.name === 'NotFoundError'
              ? 'Tiada peranti kamera dikesan pada perkakasan ini. Sila gunakan carian manual.'
              : 'Gagal memulakan kamera peranti. Sila gunakan carian manual nombor siri pendaftaran.';
          setCameraError(errorMsg);
          setIsScanning(false);
        }
      }, 200);

      return () => {
        isMounted = false;
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [isOpen]);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScannedResult = (rawText: string) => {
    const key = parseScannedQRData(rawText).toLowerCase().trim();
    
    // Look up by registrationNo or ID
    const matched = assets.find(a => 
      a.registrationNo.toLowerCase().trim() === key ||
      a.id.toLowerCase() === key ||
      key.includes(a.registrationNo.toLowerCase().trim())
    );

    if (matched) {
      // Pause scanner video to save resources & display contextual actions
      stopScanner();
      setScannedAsset(matched);
    } else {
      setCameraError(`Kod QR diimbas ("${rawText}") tidak sepadan dengan mana-mana aset berdaftar di UPKS.`);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = manualInput.trim().toLowerCase();
    if (!query) {
      setManualError('Sila masukkan nombor siri pendaftaran.');
      return;
    }

    const matched = assets.find(a => 
      a.registrationNo.toLowerCase().includes(query) ||
      a.serialNo?.toLowerCase().includes(query) ||
      a.name.toLowerCase().includes(query)
    );

    if (matched) {
      stopScanner();
      setScannedAsset(matched);
    } else {
      setManualError(`Tiada aset ditemui dengan kata kunci "${manualInput}".`);
    }
  };

  const handleResumeScan = () => {
    setScannedAsset(null);
    setCameraError(null);
    // Restart camera
    const scanner = new Html5Qrcode(scannerContainerId);
    scannerRef.current = scanner;
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 },
      (decodedText) => handleScannedResult(decodedText),
      () => {}
    ).then(() => setIsScanning(true)).catch(err => {
      setCameraError('Gagal menyambung semula kamera.');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-3">
          <div className="w-9 h-9 rounded-md bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Pengimbas QR Makmal
            </h3>
            <p className="text-[11px] text-slate-500">
              Imbas pelekat kod QR pada aset fizikal di makmal
            </p>
          </div>
        </div>

        {/* 1. If an asset is scanned: Show Contextual Quick Actions */}
        {scannedAsset ? (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-2.5">
                <span className="font-mono text-xs font-bold bg-white text-slate-900 px-2 py-0.5 rounded border border-slate-300">
                  {scannedAsset.registrationNo}
                </span>
                <StatusBadge status={scannedAsset.status} size="sm" />
              </div>

              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-md overflow-hidden bg-white border border-slate-200 shrink-0 shadow-2xs">
                  <img
                    src={getAssetDisplayImage(scannedAsset)}
                    alt={scannedAsset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {scannedAsset.name}
                  </h4>
                  <div className="text-xs text-slate-600 mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-teal-600 shrink-0" />
                    <span className="truncate">{scannedAsset.currentLocation}</span>
                  </div>
                </div>
              </div>

              {/* Chemical Expiry Warning inside scanned card */}
              {isChemicalExpired(scannedAsset) && (
                <div className="mt-2.5 p-2 bg-rose-50 border border-rose-300 rounded text-rose-950 text-xs flex items-center space-x-1.5 font-bold">
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>TAMAT TEMPOH: Reagen tidak boleh digunakan untuk ujian!</span>
                </div>
              )}
            </div>

            {/* Contextual Action Buttons */}
            <div className="space-y-2 pt-1">
              
              {/* If Aktif -> Pinjam Sekarang */}
              {scannedAsset.status === 'Aktif' && (
                <button
                  onClick={() => {
                    onClose();
                    onQuickBorrow(scannedAsset);
                  }}
                  className="w-full py-2.5 px-3 rounded-md bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-1" />
                  <span>Pinjam Sekarang (Tindakan Pantas)</span>
                </button>
              )}

              {/* If Dipinjam -> Sahkan Pulang Sekarang (1-Tap) */}
              {scannedAsset.status === 'Dipinjam' && (
                <button
                  onClick={() => {
                    onClose();
                    onQuickReturn(scannedAsset);
                  }}
                  className="w-full py-2.5 px-3 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  <span>Sahkan Pulang Sekarang (1-Tap)</span>
                </button>
              )}

              {/* Full Details Button */}
              <button
                onClick={() => {
                  onClose();
                  onAssetFound(scannedAsset);
                }}
                className="w-full py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span>Buka Maklumat Penuh KEW.PA</span>
              </button>

              {/* Resume Scanner Button */}
              <button
                onClick={handleResumeScan}
                className="w-full py-1.5 px-3 rounded text-slate-600 hover:text-slate-900 text-xs font-medium transition flex items-center justify-center"
              >
                <RefreshCw className="w-3 h-3 mr-1 text-slate-500" />
                <span>Imbas Aset Seterusnya</span>
              </button>
            </div>
          </div>
        ) : (
          /* 2. Live Camera Viewport */
          <div className="space-y-3">
            <div 
              id={scannerContainerId}
              className="w-full bg-slate-950 rounded-lg overflow-hidden min-h-[240px] relative flex items-center justify-center border border-slate-800"
            >
              {!isScanning && !cameraError && (
                <div className="text-center p-6 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-400" />
                  <p className="text-xs">Memulakan kamera peranti...</p>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded text-amber-950 text-xs flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Makluman Kamera (BR-005): </span>
                  {cameraError}
                </div>
              </div>
            )}

            {/* Manual Registration Number Search */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                <Search className="w-3.5 h-3.5 mr-1 text-teal-600" />
                Carian Manual No. Pendaftaran KEW.PA
              </label>
              <form onSubmit={handleManualSearch} className="flex gap-1.5">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => {
                    setManualError('');
                    setManualInput(e.target.value);
                  }}
                  placeholder="cth: INS-001 atau 001"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 text-slate-900"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded shadow-2xs transition cursor-pointer"
                >
                  Cari
                </button>
              </form>

              {manualError && (
                <p className="text-rose-600 text-xs mt-1 font-medium">
                  {manualError}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="w-full py-1.5 px-3 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
