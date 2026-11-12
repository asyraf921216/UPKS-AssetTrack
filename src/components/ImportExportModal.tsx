import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { 
  downloadSampleCSVTemplate, 
  parseAndValidateCSVText, 
  CSVParseResultRow, 
  exportAssetsToCSV 
} from '../utils/csvHelper';
import { addAssetRecord, getStoredAssets } from '../services/storage';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  AlertTriangle,
  FileText,
  RotateCcw
} from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  
  // Import State
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<CSVParseResultRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [importSummary, setImportSummary] = useState<{ success: number; failed: number } | null>(null);

  if (!isOpen) return null;

  const validRows = parsedRows.filter(r => r.isValid);
  const errorRows = parsedRows.filter(r => !r.isValid);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
        const rows = await parseAndValidateCSVText(text);
        setParsedRows(rows);
      }
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    let successCount = 0;
    let failCount = 0;

    validRows.forEach(row => {
      const data = row.data as Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;
      const res = addAssetRecord(data);
      if (res.success) {
        successCount++;
      } else {
        failCount++;
      }
    });

    setImportSummary({ success: successCount, failed: failCount });
    onImportComplete();
  };

  const handleExportAll = () => {
    const assets = getStoredAssets();
    exportAssetsToCSV(assets, 'Inventori-Penuh');
  };

  const handleExportMissing = () => {
    const assets = getStoredAssets().filter(a => a.status === 'Hilang' || a.status === 'Dalam Siasatan');
    exportAssetsToCSV(assets, 'Aset-Hilang-Siasatan');
  };

  const handleExportBorrowed = () => {
    const assets = getStoredAssets().filter(a => a.status === 'Dipinjam');
    exportAssetsToCSV(assets, 'Aset-Dipinjam');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Pusat Integrasi Data & Laporan (CSV / Excel)
            </h3>
            <p className="text-xs text-slate-500">
              Mod Pentadbir Aset • Sokongan Penuh Borang KEW.PA
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 mb-4 bg-slate-50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center space-x-2 transition cursor-pointer ${
              activeTab === 'import'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4 text-teal-600" />
            <span>Import Pukal CSV (Excel)</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center space-x-2 transition cursor-pointer ${
              activeTab === 'export'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Eksport Laporan Audit</span>
          </button>
        </div>

        {/* Tab 1: IMPORT CSV */}
        {activeTab === 'import' && (
          <div className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs sm:text-sm">
            
            {/* Step 1: Download Sample Template */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                  1. Muat Turun Templat CSV Rasmi
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gunakan templat ini bagi memastikan format lajur dan kategori sepadan dengan sistem UPKS.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadSampleCSVTemplate}
                className="inline-flex items-center px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
                Muat Turun Templat CSV
              </button>
            </div>

            {/* Step 2: Upload File */}
            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-2">
                2. Pilih Fail Inventori (.csv)
              </h4>
              <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-teal-50/20 transition group">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-teal-600 mb-2 transition" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-teal-700">
                  {fileName ? `Fail Dipilih: ${fileName}` : 'Klik untuk pilih fail CSV dari peranti anda'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Menyokong fail CSV dengan pengepala standard UPKS
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Verification Breakdown */}
            {parsedRows.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    3. Hasil Pengesahan Data Pukal ({parsedRows.length} Baris)
                  </h4>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                      ✓ {validRows.length} Sah
                    </span>
                    {errorRows.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                        ✕ {errorRows.length} Ralat
                      </span>
                    )}
                  </div>
                </div>

                {/* Error preview if any */}
                {errorRows.length > 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 max-h-36 overflow-y-auto space-y-1 text-xs">
                    <div className="font-bold text-rose-900 flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      Baris Mengandungi Ralat (Akan diabaikan secara automatik):
                    </div>
                    {errorRows.map(r => (
                      <div key={r.rowNumber} className="text-rose-800 pl-4 border-l-2 border-rose-300">
                        <span className="font-mono font-bold">Baris {r.rowNumber}:</span> {r.errors.join(' | ')}
                      </div>
                    ))}
                  </div>
                )}

                {/* Valid rows preview */}
                {validRows.length > 0 && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 sticky top-0">
                        <tr>
                          <th className="p-2">No. Pendaftaran</th>
                          <th className="p-2">Nama Aset</th>
                          <th className="p-2">Kategori</th>
                          <th className="p-2">Lokasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {validRows.slice(0, 10).map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2 font-mono font-semibold text-slate-900">{r.data.registrationNo}</td>
                            <td className="p-2 text-slate-800">{r.data.name}</td>
                            <td className="p-2 text-slate-600">{r.data.category}</td>
                            <td className="p-2 text-slate-600">{r.data.defaultLocation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {validRows.length > 10 && (
                      <div className="p-2 bg-slate-50 text-center text-[11px] text-slate-500">
                        ... dan {validRows.length - 10} baris sah yang lain.
                      </div>
                    )}
                  </div>
                )}

                {/* Action button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={validRows.length === 0}
                    onClick={handleConfirmImport}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 transition shadow-xs flex items-center justify-center cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Sahkan Import {validRows.length} Rekod Sah ke Pangkalan Data
                  </button>
                </div>
              </div>
            )}

            {/* Import summary message */}
            {importSummary && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs sm:text-sm flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Import Selesai! </span>
                    {importSummary.success} aset berjaya didaftarkan. Kod QR telah dijana secara automatik.
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Lihat Inventori
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: EXPORT CSV */}
        {activeTab === 'export' && (
          <div className="space-y-4 flex-1 text-xs sm:text-sm">
            <p className="text-slate-600">
              Jana fail CSV berformat piawai yang serasi dengan Microsoft Excel untuk semakan audit tahunan KEW.PA dan laporan integriti aset.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Option 1: All assets */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-500 transition shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-2.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Daftar Induk Lengkap
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Eksport kesemua rekod aset aktif, dipinjam, rosak, dan hilang.
                  </p>
                </div>
                <button
                  onClick={handleExportAll}
                  className="mt-4 w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-2xs flex items-center justify-center cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Eksport Semua
                </button>
              </div>

              {/* Option 2: Missing / Investigation only */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-amber-500 transition shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Laporan Kehilangan
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Aset berstatus Dalam Siasatan & Hilang untuk laporan audit KEW.PA-10.
                  </p>
                </div>
                <button
                  onClick={handleExportMissing}
                  className="mt-4 w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-2xs flex items-center justify-center cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Eksport Aset Hilang
                </button>
              </div>

              {/* Option 3: Borrowed only */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-500 transition shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2.5">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Rekod Pinjaman Semasa
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Senarai aset yang sedang dipindahkan atau dipinjam oleh staf makmal.
                  </p>
                </div>
                <button
                  onClick={handleExportBorrowed}
                  className="mt-4 w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-2xs flex items-center justify-center cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Eksport Pinjaman
                </button>
              </div>

            </div>
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs sm:text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
