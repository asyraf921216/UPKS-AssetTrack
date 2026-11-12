import React, { useState, useEffect } from 'react';
import { Asset, MovementLog, LossReport, DisposalRecord, UserRole } from '../types/asset';
import { StatusBadge, CategoryBadge } from './AssetBadge';
import { generateQRCodeDataUrl, getAssetQRPayload } from '../utils/qrHelper';
import { getAssetDisplayImage } from '../utils/categoryImages';
import { 
  X, 
  QrCode, 
  Printer, 
  ArrowRightLeft, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  Edit3, 
  Trash2, 
  MapPin, 
  User, 
  Calendar, 
  FileText, 
  History,
  Flame,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: Asset | null;
  onClose: () => void;
  role: UserRole;
  movementLogs: MovementLog[];
  lossReports: LossReport[];
  disposalRecords: DisposalRecord[];
  onOpenBorrow: (asset: Asset) => void;
  onOpenReturn: (asset: Asset) => void;
  onOpenReportLoss: (asset: Asset) => void;
  onOpenVerifyLoss: (report: LossReport) => void;
  onOpenInitiateDisposal: (asset: Asset) => void;
  onOpenCompleteDisposal: (disposal: DisposalRecord, asset: Asset) => void;
  onOpenEdit: (asset: Asset) => void;
  onOpenDelete: (asset: Asset) => void;
  onOpenSinglePrint: (asset: Asset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  role,
  movementLogs,
  lossReports,
  disposalRecords,
  onOpenBorrow,
  onOpenReturn,
  onOpenReportLoss,
  onOpenVerifyLoss,
  onOpenInitiateDisposal,
  onOpenCompleteDisposal,
  onOpenEdit,
  onOpenDelete,
  onOpenSinglePrint,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'movement' | 'loss' | 'disposal'>('info');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (asset) {
      const payload = getAssetQRPayload(asset);
      generateQRCodeDataUrl(payload).then(url => setQrDataUrl(url));
    }
  }, [asset]);

  if (!asset) return null;

  const displayImg = getAssetDisplayImage(asset);
  const assetMovements = movementLogs.filter(m => m.assetId === asset.id);
  const assetLossReports = lossReports.filter(l => l.assetId === asset.id);
  const assetDisposals = disposalRecords.filter(d => d.assetId === asset.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Official Dossier Header */}
        <div className="bg-[#0B192C] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs font-bold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded">
              {asset.registrationNo}
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">•</span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">Daftar Induk KEW.PA-3</span>
          </div>

          <div className="flex items-center space-x-2">
            <StatusBadge status={asset.status} size="sm" />
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Identity & Asset Visual Strip */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex items-start space-x-3.5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 shadow-2xs">
              <img
                src={displayImg}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {asset.name}
              </h3>
              <div className="mt-1 flex items-center space-x-2 flex-wrap gap-y-1">
                <CategoryBadge category={asset.category} />
                {asset.brandModel && (
                  <span className="text-xs text-slate-600 font-medium">
                    {asset.brandModel}
                  </span>
                )}
              </div>
              <div className="mt-1 text-[11px] text-slate-500 font-mono">
                S/N: {asset.serialNo || 'TIADA NO. SIRI'}
              </div>
            </div>
          </div>

          {/* Direct QR Print Trigger */}
          <div className="self-end sm:self-center shrink-0 flex items-center space-x-2">
            <button
              onClick={() => onOpenSinglePrint(asset)}
              type="button"
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
              Cetak Pelekat QR
            </button>
          </div>
        </div>

        {/* Operational Status Notices for Disposal */}
        {asset.status === 'Dalam Proses Lupus' && (
          <div className="bg-purple-50 border-b border-purple-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-purple-950 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-purple-700 shrink-0" />
              <span>
                <strong>PROSES PELUPUSAN (PEP):</strong> Aset ini sedang dalam proses pelupusan. Sebarang transaksi pinjaman dibekukan.
              </span>
            </div>
            {role === 'admin' && assetDisposals.length > 0 && assetDisposals[0].status === 'Dalam Proses' && (
              <button
                type="button"
                onClick={() => onOpenCompleteDisposal(assetDisposals[0], asset)}
                className="px-2.5 py-1 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] shrink-0 shadow-2xs cursor-pointer"
              >
                Sahkan Selesai (KEW.PA-21)
              </button>
            )}
          </div>
        )}

        {asset.status === 'Dilupuskan' && (
          <div className="bg-slate-100 border-b border-slate-300 px-4 sm:px-6 py-2 flex items-center space-x-2 text-xs text-slate-700">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              <strong>STATUS DILUPUSKAN:</strong> Aset ini telah dilupuskan daripada perkhidmatan kerajaan di bawah Sijil Pelupusan KEW.PA-21.
            </span>
          </div>
        )}

        {/* Dossier Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'info'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Spesifikasi KEW.PA</span>
          </button>

          <button
            onClick={() => setActiveTab('movement')}
            className={`py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'movement'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Pergerakan ({assetMovements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('loss')}
            className={`py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'loss'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Kehilangan ({assetLossReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disposal')}
            className={`py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'disposal'
                ? 'border-purple-600 text-purple-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 text-purple-600" />
            <span>Pelupusan ({assetDisposals.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 text-xs sm:text-sm">
          {/* TAB 1: INFO KEW.PA */}
          {activeTab === 'info' && (
            <div className="space-y-3.5">
              
              {/* QR Code Verification Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center gap-3.5">
                <div className="bg-white p-1.5 rounded border border-slate-200 shrink-0">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt={`QR Code ${asset.registrationNo}`} 
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-slate-400">
                      <QrCode className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    Pelekat QR Makmal
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-900">
                    {asset.registrationNo}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Gunakan kamera telefon untuk mengimbas pelekat ini di makmal bagi semakan data segera.
                  </p>
                </div>
              </div>

              {/* Data Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                <div className="bg-white p-3 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tight">Lokasi Penempatan Asal</div>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {asset.defaultLocation}
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tight">Lokasi Semasa</div>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    <span>{asset.currentLocation}</span>
                    {asset.currentLocation !== asset.defaultLocation && (
                      <span className="ml-1.5 text-[10px] text-amber-800 bg-amber-100 px-1 rounded font-medium">
                        Pindah Sementara
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tight">Pegawai Bertanggungjawab</div>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {asset.custodian}
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tight">Kos & Tarikh Perolehan</div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {asset.acquisitionCost !== undefined ? `RM ${asset.acquisitionCost.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}` : '—'}{' '}
                    <span className="text-slate-500 font-normal">
                      ({asset.acquisitionDate || 'Tarikh tidak direkod'})
                    </span>
                  </div>
                </div>

                {/* Category specific: Instruments Calibration */}
                {asset.category === 'Instruments' && (
                  <div className="bg-indigo-50/50 p-3 rounded border border-indigo-200 sm:col-span-2">
                    <div className="text-indigo-900 text-[10px] uppercase font-bold flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      Tarikh Kalibrasi Seterusnya (Piawaian ISO/IEC 17025)
                    </div>
                    <div className="font-mono font-bold text-indigo-950 mt-1 text-sm tabular-nums">
                      {asset.calibrationDueDate || 'Belum Dijadualkan'}
                    </div>
                  </div>
                )}

                {/* Category specific: Test Chemical */}
                {asset.category === 'Peralatan Test Chemical' && (
                  <div className="bg-teal-50/50 p-3 rounded border border-teal-200 sm:col-span-2">
                    <div className="text-teal-900 text-[10px] uppercase font-bold">
                      🧪 Spesifikasi Reagen & Test Chemical
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <span className="text-[11px] text-teal-800">Kuantiti / Pembungkusan:</span>
                        <div className="font-semibold text-teal-950">{asset.quantityUnit || '—'}</div>
                      </div>
                      <div>
                        <span className="text-[11px] text-teal-800">Tarikh Luput:</span>
                        <div className="font-mono font-bold text-teal-950 tabular-nums">{asset.expiryDate || '—'}</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 2: MOVEMENT / LOAN LOGS */}
          {activeTab === 'movement' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                  Sejarah Pergerakan & Pinjaman
                </span>
                {asset.status === 'Aktif' && (
                  <button
                    onClick={() => onOpenBorrow(asset)}
                    className="inline-flex items-center text-xs font-semibold text-sky-800 hover:text-sky-950 bg-sky-50 px-2.5 py-1 rounded border border-sky-200 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 mr-1 text-sky-600" />
                    Pinjam Aset Ini
                  </button>
                )}
              </div>

              {assetMovements.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded border border-dashed border-slate-200 text-slate-400 text-xs">
                  Tiada rekod pinjaman bagi aset ini. Aset berada di lokasi penempatan asalnya.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded overflow-hidden">
                  {assetMovements.map(m => (
                    <div key={m.id} className="p-3 bg-white hover:bg-slate-50 transition text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          {m.borrowerName}
                        </span>
                        {m.isActive ? (
                          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 text-[10px] font-bold border border-sky-200">
                            Sedang Dipinjam
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-medium border border-emerald-200">
                            Dipulangkan
                          </span>
                        )}
                      </div>

                      <div className="text-slate-600 flex items-center space-x-1">
                        <span>Dari: <strong>{m.fromLocation}</strong></span>
                        <span>→</span>
                        <span>Ke: <strong className="text-teal-800">{m.toLocation}</strong></span>
                      </div>

                      <div className="flex items-center space-x-3 text-slate-500 pt-0.5 font-mono text-[11px] tabular-nums">
                        <span>Pinjam: {m.borrowedDate}</span>
                        {m.expectedReturnDate && (
                          <span>Jangka: {m.expectedReturnDate}</span>
                        )}
                        {m.returnedDate && (
                          <span className="text-emerald-700 font-bold">Pulang: {m.returnedDate}</span>
                        )}
                      </div>

                      {m.notes && (
                        <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded mt-1">
                          "{m.notes}"
                        </p>
                      )}

                      {m.isActive && (
                        <div className="pt-2">
                          <button
                            onClick={() => onOpenReturn(asset)}
                            className="inline-flex items-center px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            Rekod Pemulangan
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOSS REPORTS */}
          {activeTab === 'loss' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                  Rekod Laporan Kehilangan
                </span>
                {asset.status !== 'Hilang' && asset.status !== 'Dalam Siasatan' && (
                  <button
                    onClick={() => onOpenReportLoss(asset)}
                    className="inline-flex items-center text-xs font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-300 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Lapor Kehilangan
                  </button>
                )}
              </div>

              {assetLossReports.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded border border-dashed border-slate-200 text-slate-400 text-xs">
                  Tiada laporan kehilangan direkodkan untuk aset ini.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {assetLossReports.map(report => (
                    <div 
                      key={report.id} 
                      className={`p-3.5 rounded border text-xs space-y-2 ${
                        report.reportStatus === 'Dalam Siasatan'
                          ? 'bg-amber-50/60 border-amber-300'
                          : report.reportStatus === 'Disahkan Hilang'
                          ? 'bg-rose-50/60 border-rose-300'
                          : 'bg-emerald-50/60 border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          Pelapor: {report.reportedBy}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          report.reportStatus === 'Dalam Siasatan'
                            ? 'bg-amber-200 text-amber-950 border border-amber-300'
                            : report.reportStatus === 'Disahkan Hilang'
                            ? 'bg-rose-200 text-rose-950 border border-rose-300'
                            : 'bg-emerald-200 text-emerald-950 border border-emerald-300'
                        }`}>
                          {report.reportStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <div>Tarikh Terakhir: <strong>{report.lastSeenDate}</strong></div>
                        <div>Lokasi Terakhir: <strong>{report.lastKnownLocation}</strong></div>
                      </div>

                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="font-semibold text-slate-700 block mb-0.5">Kronologi Kejadian:</span>
                        <p className="text-slate-800 italic">{report.description}</p>
                      </div>

                      {report.adminNotes && (
                        <div className="bg-slate-100 p-2 rounded border border-slate-300">
                          <span className="font-semibold text-slate-800 block mb-0.5">Nota Pengesahan Admin:</span>
                          <p className="text-slate-800">{report.adminNotes}</p>
                        </div>
                      )}

                      {report.reportStatus === 'Dalam Siasatan' && (
                        <div className="pt-1 flex items-center justify-end space-x-2">
                          {role === 'admin' ? (
                            <button
                              onClick={() => onOpenVerifyLoss(report)}
                              className="px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-2xs flex items-center cursor-pointer"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                              Tindakan Admin: Sahkan / Ditemui
                            </button>
                          ) : (
                            <div className="text-[11px] text-amber-900 bg-amber-100 px-2 py-1 rounded">
                              Menunggu pengesahan rasmi Pegawai Aset.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DISPOSAL (PELUPUSAN TPA BAB E) */}
          {activeTab === 'disposal' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                  Tatacara Pelupusan Aset Alih (TPA Bab E)
                </span>
                {role === 'admin' && (asset.status === 'Aktif' || asset.status === 'Rosak') && (
                  <button
                    type="button"
                    onClick={() => onOpenInitiateDisposal(asset)}
                    className="inline-flex items-center text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded border border-purple-300 cursor-pointer shadow-2xs transition"
                  >
                    <Flame className="w-3.5 h-3.5 mr-1 text-purple-600" />
                    Mula Proses Pelupusan (PEP)
                  </button>
                )}
              </div>

              {assetDisposals.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-500 text-xs space-y-2 p-4">
                  <Flame className="w-8 h-8 mx-auto text-slate-300" />
                  <div className="font-semibold text-slate-700">Tiada Rekod Pelupusan</div>
                  <p className="max-w-md mx-auto text-slate-500 text-[11px]">
                    Aset ini belum pernah didaftarkan untuk Perakuan Pelupusan (PEP). Aset masih dalam kitaran hayat aktif perkhidmatan makmal UPKS.
                  </p>
                  {role === 'admin' && (asset.status === 'Aktif' || asset.status === 'Rosak') && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onOpenInitiateDisposal(asset)}
                        className="inline-flex items-center text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 px-3 py-1.5 rounded-md shadow-2xs cursor-pointer"
                      >
                        <Flame className="w-3.5 h-3.5 mr-1" />
                        Daftar PEP Pelupusan Sekarang
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {assetDisposals.map((disp) => (
                    <div 
                      key={disp.id}
                      className={`p-3.5 rounded-lg border text-xs space-y-2.5 ${
                        disp.status === 'Dalam Proses'
                          ? 'bg-purple-50/60 border-purple-300'
                          : disp.status === 'Selesai Dilupuskan'
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-slate-50 border-slate-300'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                            {disp.pepNo}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Dimulakan: {disp.initiatedDate}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          disp.status === 'Dalam Proses'
                            ? 'bg-purple-200 text-purple-950 border border-purple-300'
                            : disp.status === 'Selesai Dilupuskan'
                            ? 'bg-emerald-200 text-emerald-950 border border-emerald-300'
                            : 'bg-slate-200 text-slate-800 border border-slate-300'
                        }`}>
                          {disp.status}
                        </span>
                      </div>

                      {/* Reason */}
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="font-bold text-slate-700 block mb-0.5 text-[11px] uppercase tracking-wide">
                          Sebab & Justifikasi Pelupusan:
                        </span>
                        <p className="text-slate-900 font-medium">{disp.reason}</p>
                      </div>

                      {/* Method & Initiator Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                        <div className="bg-white/80 p-2 rounded border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Kaedah Dicadangkan</span>
                          <span className="font-semibold text-slate-900">{disp.proposedMethod}</span>
                        </div>
                        <div className="bg-white/80 p-2 rounded border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Pegawai Pemohon / Pemeriksa</span>
                          <span className="font-semibold text-slate-900">{disp.initiatedBy}</span>
                        </div>
                      </div>

                      {/* Completed Details (KEW.PA-21) */}
                      {disp.status === 'Selesai Dilupuskan' && (
                        <div className="bg-emerald-100/70 p-3 rounded-lg border border-emerald-300 space-y-1.5 text-emerald-950">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="font-bold text-xs flex items-center">
                              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-700" />
                              Sijil Pelupusan Aset Alih (KEW.PA-21)
                            </span>
                            <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900">
                              {disp.certificateNo || 'KEW.PA-21/UPKS'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                            <div>
                              <span className="text-emerald-800">Kaedah Sebenar:</span>{' '}
                              <strong>{disp.actualMethod || disp.proposedMethod}</strong>
                            </div>
                            <div>
                              <span className="text-emerald-800">Tarikh Selesai:</span>{' '}
                              <strong>{disp.completedDate || '—'}</strong>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-emerald-800">Pegawai Pelulus:</span>{' '}
                              <strong>{disp.approvedBy || 'Lembaga Pelupusan UPKS'}</strong>
                            </div>
                          </div>

                          {disp.notes && (
                            <p className="text-[11px] italic bg-white/80 p-1.5 rounded border border-emerald-200 mt-1">
                              "{disp.notes}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* In Progress Action */}
                      {disp.status === 'Dalam Proses' && (
                        <div className="bg-purple-100/80 p-2.5 rounded-lg border border-purple-200 flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[11px] text-purple-900">
                            Menunggu kelulusan Lembaga Pelupusan & penerbitan Sijil KEW.PA-21.
                          </span>
                          {role === 'admin' && (
                            <button
                              type="button"
                              onClick={() => onOpenCompleteDisposal(disp, asset)}
                              className="px-3 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-2xs flex items-center cursor-pointer ml-auto"
                            >
                              <FileCheck2 className="w-3.5 h-3.5 mr-1" />
                              Sahkan Selesai (KEW.PA-21)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {role === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenEdit(asset)}
                  className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Sunting
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDelete(asset)}
                  className="px-3 py-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold flex items-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-600" />
                  Padam
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
