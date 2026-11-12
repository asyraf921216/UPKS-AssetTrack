import React, { useState } from 'react';
import { Asset, LossReport, DisposalRecord } from '../types/asset';
import { Printer, Download, X, FileText, Building2, CheckCircle2, Flame, ShieldCheck } from 'lucide-react';

export type KewPaFormType = 'KEW.PA-3' | 'KEW.PA-7' | 'KEW.PA-10' | 'KEW.PA-19' | 'KEW.PA-21';

interface KewPaFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  locations: string[];
  lossReports: LossReport[];
  disposalRecords?: DisposalRecord[];
  defaultForm?: KewPaFormType;
  targetAsset?: Asset | null;
}

export const KewPaFormsModal: React.FC<KewPaFormsModalProps> = ({
  isOpen,
  onClose,
  assets,
  locations,
  lossReports,
  disposalRecords = [],
  defaultForm = 'KEW.PA-7',
  targetAsset,
}) => {
  const [selectedForm, setSelectedForm] = useState<KewPaFormType>(defaultForm);
  const [selectedLocation, setSelectedLocation] = useState(locations[0] || 'Makmal Kimia Analisis 1');
  const [selectedAssetId, setSelectedAssetId] = useState(targetAsset?.id || assets[0]?.id || '');

  if (!isOpen) return null;

  const currentAsset = assets.find(a => a.id === selectedAssetId) || assets[0];
  const locationAssets = assets.filter(a => a.currentLocation === selectedLocation);
  const activeLossReports = lossReports.filter(l => l.reportStatus === 'Dalam Siasatan' || l.reportStatus === 'Disahkan Hilang');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div 
        className="bg-white rounded-xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-auto max-h-[94vh] flex flex-col print:shadow-none print:border-none print:max-w-none print:max-h-none print:p-0 print:m-0"
        role="dialog"
        aria-modal="true"
      >
        {/* Screen Header (Hidden on Print) */}
        <div className="print:hidden flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Penjanaan Borang Rasmi Kerajaan (Pekeliling Perbendaharaan)
              </h3>
              <p className="text-[11px] text-slate-500">
                Piawaian Tatacara Pengurusan Aset Alih Kerajaan (TPA) Malaysia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Selector Tabs & Controls (Hidden on Print) */}
        <div className="print:hidden py-3 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg my-2">
          
          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedForm('KEW.PA-7')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                selectedForm === 'KEW.PA-7'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              KEW.PA-7 (Senarai Bilik)
            </button>

            <button
              onClick={() => setSelectedForm('KEW.PA-3')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                selectedForm === 'KEW.PA-3'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              KEW.PA-3 (Daftar Harta Modal)
            </button>

            <button
              onClick={() => setSelectedForm('KEW.PA-10')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                selectedForm === 'KEW.PA-10'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              KEW.PA-10 (Kehilangan)
            </button>

            <button
              onClick={() => setSelectedForm('KEW.PA-19')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                selectedForm === 'KEW.PA-19'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-white text-purple-900 border border-purple-300 hover:bg-purple-50'
              }`}
            >
              KEW.PA-19 (PEP Pelupusan)
            </button>

            <button
              onClick={() => setSelectedForm('KEW.PA-21')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                selectedForm === 'KEW.PA-21'
                  ? 'bg-emerald-900 text-white shadow-2xs'
                  : 'bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              KEW.PA-21 (Sijil Pelupusan)
            </button>
          </div>

          {/* Form Context Dropdowns */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {selectedForm === 'KEW.PA-7' && (
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="py-1 px-2.5 text-xs bg-white border border-slate-300 rounded font-medium text-slate-800"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            )}

            {selectedForm === 'KEW.PA-3' && (
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="py-1 px-2.5 text-xs bg-white border border-slate-300 rounded font-medium text-slate-800 max-w-[220px] truncate"
              >
                {assets.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.registrationNo} — {a.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-2xs transition flex items-center cursor-pointer shrink-0"
              title="Cetak atau Simpan sebagai PDF (A4)"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 print:overflow-visible print:p-0 font-serif text-slate-900 bg-white">
          
          {/* ======================================================== */}
          {/* FORM 1: KEW.PA-7 (Senarai Aset Alih Mengikut Lokasi Bilik) */}
          {/* ======================================================== */}
          {selectedForm === 'KEW.PA-7' && (
            <div className="space-y-4 text-xs">
              <div className="text-right font-sans font-bold text-sm tracking-widest uppercase">
                KEW.PA-7
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase">
                  SENARAI ASET ALIH MENGIKUT LOKASI
                </h2>
                <p className="text-xs font-sans text-slate-600 uppercase">
                  UNIT PEMBANGUNAN UJIAN DAN STANDARD (UPKS) • LEMBAGA GETAH MALAYSIA
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-y border-black font-sans text-xs">
                <div>
                  <span className="font-bold">BAHAGIAN / UNIT: </span>
                  <span>Unit Pembangunan Ujian & Standard (UPKS)</span>
                </div>
                <div>
                  <span className="font-bold">LOKASI / BILIK: </span>
                  <span className="font-bold underline">{selectedLocation}</span>
                </div>
              </div>

              {/* Table of Assets */}
              <table className="w-full border-collapse border border-black text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 font-sans text-[11px] font-bold text-center">
                    <th className="border border-black p-1.5 w-10">BIL.</th>
                    <th className="border border-black p-1.5">NOMBOR SIRI PENDAFTARAN</th>
                    <th className="border border-black p-1.5">KETERANGAN / NAMA ASET</th>
                    <th className="border border-black p-1.5 w-24">KATEGORI</th>
                    <th className="border border-black p-1.5 w-16">KUANTITI</th>
                    <th className="border border-black p-1.5 w-24">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {locationAssets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="border border-black p-4 text-center italic text-slate-500">
                        Tiada aset direkodkan di lokasi {selectedLocation} pada masa ini.
                      </td>
                    </tr>
                  ) : (
                    locationAssets.map((asset, index) => (
                      <tr key={asset.id} className="font-sans">
                        <td className="border border-black p-1.5 text-center">{index + 1}</td>
                        <td className="border border-black p-1.5 font-mono font-bold">{asset.registrationNo}</td>
                        <td className="border border-black p-1.5 font-semibold">
                          {asset.name}
                          {asset.brandModel && <div className="text-[10px] text-slate-600 font-normal">Model: {asset.brandModel}</div>}
                        </td>
                        <td className="border border-black p-1.5 text-center">{asset.category}</td>
                        <td className="border border-black p-1.5 text-center">1 unit</td>
                        <td className="border border-black p-1.5 text-center">{asset.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Official Signatures Footer */}
              <div className="grid grid-cols-2 gap-8 pt-8 font-sans text-xs">
                <div>
                  <p className="font-bold mb-12">(a) Disediakan oleh Pegawai Bertanggungjawab:</p>
                  <div className="border-t border-black pt-1">
                    <p>Tandatangan: ........................................................</p>
                    <p>Nama: <strong>{locationAssets[0]?.custodian || 'Pegawai Makmal UPKS'}</strong></p>
                    <p>Jawatan: Pegawai Penyelidik / Pegawai Makmal</p>
                    <p>Tarikh: {new Date().toLocaleDateString('ms-MY')}</p>
                  </div>
                </div>

                <div>
                  <p className="font-bold mb-12">(b) Disahkan oleh Pegawai Aset:</p>
                  <div className="border-t border-black pt-1">
                    <p>Tandatangan: ........................................................</p>
                    <p>Nama: <strong>Ts. Mohd Asyraf bin Zulkifli</strong></p>
                    <p>Jawatan: Pegawai Aset UPKS</p>
                    <p>Tarikh: {new Date().toLocaleDateString('ms-MY')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* FORM 2: KEW.PA-3 (Kad Daftar Harta Modal)                 */}
          {/* ======================================================== */}
          {selectedForm === 'KEW.PA-3' && currentAsset && (
            <div className="space-y-4 text-xs font-sans">
              <div className="text-right font-bold text-sm tracking-widest uppercase">
                KEW.PA-3
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase">
                  DAFTAR HARTA MODAL
                </h2>
                <p className="text-xs text-slate-600 uppercase">
                  LEMBAGA GETAH MALAYSIA • UNIT PEMBANGUNAN UJIAN DAN STANDARD (UPKS)
                </p>
              </div>

              <div className="border border-black p-3 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 border-b border-black pb-2">
                  <div>
                    <span className="font-bold">Kementerian / Jabatan: </span>
                    <span>Lembaga Getah Malaysia (LGM)</span>
                  </div>
                  <div>
                    <span className="font-bold">No. Siri Pendaftaran: </span>
                    <span className="font-mono font-bold text-sm">{currentAsset.registrationNo}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold">Nama Aset: </span>
                    <span className="font-bold">{currentAsset.name}</span>
                  </div>
                  <div>
                    <span className="font-bold">Kategori: </span>
                    <span>{currentAsset.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold">Jenama & Model: </span>
                    <span>{currentAsset.brandModel || '—'}</span>
                  </div>
                  <div>
                    <span className="font-bold">No. Siri Pembuat: </span>
                    <span className="font-mono">{currentAsset.serialNo || '—'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold">Tarikh Perolehan: </span>
                    <span>{currentAsset.acquisitionDate || '—'}</span>
                  </div>
                  <div>
                    <span className="font-bold">Harga Perolehan Asal: </span>
                    <span>{currentAsset.acquisitionCost !== undefined ? `RM ${currentAsset.acquisitionCost.toFixed(2)}` : '—'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-black pt-2">
                  <div>
                    <span className="font-bold">Lokasi Penempatan Asal: </span>
                    <span>{currentAsset.defaultLocation}</span>
                  </div>
                  <div>
                    <span className="font-bold">Lokasi Semasa: </span>
                    <span className="font-bold">{currentAsset.currentLocation}</span>
                  </div>
                </div>

                {currentAsset.calibrationDueDate && (
                  <div className="border-t border-black pt-2 bg-slate-50 p-1.5">
                    <span className="font-bold">Jadual Kalibrasi Seterusnya (ISO 17025): </span>
                    <span className="font-mono font-bold">{currentAsset.calibrationDueDate}</span>
                  </div>
                )}
              </div>

              {/* Signature Verification */}
              <div className="border border-black p-3 grid grid-cols-2 gap-8 text-xs">
                <div>
                  <p className="font-bold mb-10">Tandatangan Pegawai Penerima:</p>
                  <p>Nama: <strong>{currentAsset.custodian}</strong></p>
                  <p>Tarikh: {new Date().toLocaleDateString('ms-MY')}</p>
                </div>
                <div>
                  <p className="font-bold mb-10">Tandatangan Ketua Unit / Pegawai Aset:</p>
                  <p>Nama: <strong>Ts. Mohd Asyraf bin Zulkifli</strong></p>
                  <p>Tarikh: {new Date().toLocaleDateString('ms-MY')}</p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* FORM 3: KEW.PA-10 (Laporan Pemeriksaan & Siasatan Kehilangan) */}
          {/* ======================================================== */}
          {selectedForm === 'KEW.PA-10' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="text-right font-bold text-sm tracking-widest uppercase">
                KEW.PA-10
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase">
                  LAPORAN PEMERIKSAAN DAN SIASATAN KEHILANGAN ASET ALIH
                </h2>
                <p className="text-xs text-slate-600 uppercase">
                  LEMBAGA GETAH MALAYSIA • UNIT PEMBANGUNAN UJIAN DAN STANDARD (UPKS)
                </p>
              </div>

              <table className="w-full border-collapse border border-black text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold text-center">
                    <th className="border border-black p-1.5 w-10">BIL</th>
                    <th className="border border-black p-1.5">NO. PENDAFTARAN</th>
                    <th className="border border-black p-1.5">KETERANGAN ASET</th>
                    <th className="border border-black p-1.5">TARIKH & TEMPAT HILANG</th>
                    <th className="border border-black p-1.5">STATUS SIASATAN & CATATAN</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLossReports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border border-black p-4 text-center italic text-slate-500">
                        Tiada rekod siasatan kehilangan aset aktif dalam sistem UPKS pada masa ini.
                      </td>
                    </tr>
                  ) : (
                    activeLossReports.map((report, idx) => {
                      const matched = assets.find(a => a.id === report.assetId);
                      return (
                        <tr key={report.id}>
                          <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-black p-1.5 font-mono font-bold">{matched?.registrationNo}</td>
                          <td className="border border-black p-1.5 font-semibold">
                            {matched?.name}
                            <div className="text-[10px] text-slate-600">Pelapor: {report.reportedBy}</div>
                          </td>
                          <td className="border border-black p-1.5">
                            <div>{report.lastSeenDate}</div>
                            <div className="text-[10px] text-slate-600">{report.lastKnownLocation}</div>
                          </td>
                          <td className="border border-black p-1.5">
                            <span className="font-bold uppercase underline">{report.reportStatus}</span>
                            <div className="text-[10px] italic mt-0.5">{report.description}</div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              <div className="border border-black p-3 space-y-6">
                <p className="font-bold">Perakuan Jawatankuasa Siasatan / Pegawai Pemeriksa:</p>
                <p className="text-xs leading-relaxed">
                  Kami mengesahkan bahawa pemeriksaan dan siasatan fizikal ke atas kehilangan aset-aset di atas telah dijalankan mengikut Tatacara Pengurusan Aset Alih Kerajaan (TPA).
                </p>
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div>
                    <p className="font-bold">1. Pegawai Pemeriksa I:</p>
                    <p>Tandatangan: .....................................................</p>
                    <p>Nama: Ts. Mohd Asyraf bin Zulkifli</p>
                  </div>
                  <div>
                    <p className="font-bold">2. Pegawai Pemeriksa II:</p>
                    <p>Tandatangan: .....................................................</p>
                    <p>Nama: Dr. Halimah binti Sulaiman</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* FORM 4: KEW.PA-19 (Borang Perakuan Pelupusan Aset Alih)   */}
          {/* ======================================================== */}
          {selectedForm === 'KEW.PA-19' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="text-right font-bold text-sm tracking-widest uppercase">
                KEW.PA-19
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase">
                  PERAKUAN PELUPUSAN ASET ALIH KERAJAAN (PEP)
                </h2>
                <p className="text-xs text-slate-600 uppercase">
                  LEMBAGA GETAH MALAYSIA • UNIT PEMBANGUNAN UJIAN DAN STANDARD (UPKS)
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  (Pekeliling Perbendaharaan Malaysia — Tatacara Pengurusan Aset Alih Kerajaan Bab E)
                </p>
              </div>

              <div className="border border-black p-2.5 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold">Kementerian / Agensi: </span>
                  <span>Kementerian Perladangan dan Komoditi (LGM)</span>
                </div>
                <div>
                  <span className="font-bold">Tarikh Perakuan: </span>
                  <span>{new Date().toLocaleDateString('ms-MY')}</span>
                </div>
              </div>

              <table className="w-full border-collapse border border-black text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold text-center">
                    <th className="border border-black p-1.5 w-8">BIL</th>
                    <th className="border border-black p-1.5 w-32">NO. PENDAFTARAN & NO. PEP</th>
                    <th className="border border-black p-1.5">KETERANGAN ASET</th>
                    <th className="border border-black p-1.5 w-24">HARGA ASAL (RM)</th>
                    <th className="border border-black p-1.5">JUSTIFIKASI & SEBAB PELUPUSAN</th>
                    <th className="border border-black p-1.5 w-32">CADANGAN KAEDAH</th>
                  </tr>
                </thead>
                <tbody>
                  {disposalRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="border border-black p-4 text-center italic text-slate-500">
                        Tiada rekod perakuan pelupusan (PEP) dalam sistem UPKS pada masa ini.
                      </td>
                    </tr>
                  ) : (
                    disposalRecords.map((disp, idx) => {
                      const matched = assets.find(a => a.id === disp.assetId);
                      return (
                        <tr key={disp.id}>
                          <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-black p-1.5">
                            <div className="font-mono font-bold">{matched?.registrationNo || '—'}</div>
                            <div className="text-[10px] text-purple-900 font-mono font-bold mt-0.5">{disp.pepNo}</div>
                          </td>
                          <td className="border border-black p-1.5 font-semibold">
                            {matched?.name || 'Aset Pelupusan'}
                            <div className="text-[10px] text-slate-600 font-normal">
                              Model: {matched?.brandModel || '—'} • Lokasi: {matched?.currentLocation}
                            </div>
                          </td>
                          <td className="border border-black p-1.5 text-right font-mono tabular-nums">
                            {matched?.acquisitionCost ? matched.acquisitionCost.toFixed(2) : '—'}
                          </td>
                          <td className="border border-black p-1.5 text-[11px]">
                            <div className="font-medium">{disp.reason}</div>
                            <div className="text-[10px] text-slate-600 mt-0.5">Pemohon: {disp.initiatedBy}</div>
                          </td>
                          <td className="border border-black p-1.5 text-center font-bold text-[11px]">
                            {disp.proposedMethod}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              <div className="border border-black p-3 space-y-4">
                <p className="font-bold">Perakuan Lembaga Pemeriksa Pelupusan:</p>
                <p className="text-xs leading-relaxed">
                  Kami mengesahkan bahawa pemeriksaan fizikal dan teknikal telah dijalankan ke atas aset alih di atas. Didapati aset berkenaan memenuhi kriteria pelupusan dan disyorkan untuk dilupuskan mengikut kaedah yang dicadangkan.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-2">
                  <div>
                    <p className="font-bold">1. Pegawai Pemeriksa I:</p>
                    <p className="mt-6">Tandatangan: .....................................................</p>
                    <p>Nama: <strong>Ts. Mohd Asyraf bin Zulkifli</strong></p>
                    <p>Jawatan: Pegawai Aset UPKS</p>
                  </div>
                  <div>
                    <p className="font-bold">2. Pegawai Pemeriksa II:</p>
                    <p className="mt-6">Tandatangan: .....................................................</p>
                    <p>Nama: <strong>Dr. Halimah binti Sulaiman</strong></p>
                    <p>Jawatan: Jurutera Penyelidik Kanan LGM</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* FORM 5: KEW.PA-21 (Sijil Pelupusan Aset Alih Kerajaan)    */}
          {/* ======================================================== */}
          {selectedForm === 'KEW.PA-21' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="text-right font-bold text-sm tracking-widest uppercase">
                KEW.PA-21
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase">
                  SIJIL PELUPUSAN ASET ALIH KERAJAAN
                </h2>
                <p className="text-xs text-slate-600 uppercase">
                  LEMBAGA GETAH MALAYSIA • UNIT PEMBANGUNAN UJIAN DAN STANDARD (UPKS)
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  (Pekeliling Perbendaharaan Malaysia — Tatacara Pengurusan Aset Alih Kerajaan Bab E)
                </p>
              </div>

              {/* Filter completed records */}
              {(() => {
                const completedDisposals = disposalRecords.filter(d => d.status === 'Selesai Dilupuskan');
                return (
                  <>
                    <table className="w-full border-collapse border border-black text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-black p-1.5 w-8">BIL</th>
                          <th className="border border-black p-1.5 w-32">NO. SIJIL PELUPUSAN</th>
                          <th className="border border-black p-1.5">NO. PENDAFTARAN & KETERANGAN ASET</th>
                          <th className="border border-black p-1.5 w-28">KAEDAH PELUPUSAN</th>
                          <th className="border border-black p-1.5 w-24">TARIKH SELESAI</th>
                          <th className="border border-black p-1.5">PENGESAHAN & RESIT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedDisposals.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="border border-black p-4 text-center italic text-slate-500">
                              Tiada rekod pelupusan yang selesai (Sijil KEW.PA-21) pada masa ini.
                            </td>
                          </tr>
                        ) : (
                          completedDisposals.map((disp, idx) => {
                            const matched = assets.find(a => a.id === disp.assetId);
                            return (
                              <tr key={disp.id}>
                                <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                                <td className="border border-black p-1.5 font-mono font-bold text-emerald-950">
                                  {disp.certificateNo || 'SIJIL-LUPUS/UPKS'}
                                </td>
                                <td className="border border-black p-1.5 font-semibold">
                                  <div className="font-mono text-slate-900">{matched?.registrationNo || '—'}</div>
                                  <div>{matched?.name || 'Aset Telah Dilupuskan'}</div>
                                </td>
                                <td className="border border-black p-1.5 text-center font-bold">
                                  {disp.actualMethod || disp.proposedMethod}
                                </td>
                                <td className="border border-black p-1.5 text-center font-mono">
                                  {disp.completedDate || '—'}
                                </td>
                                <td className="border border-black p-1.5 text-[11px]">
                                  <div>Diluluskan oleh: <strong>{disp.approvedBy || 'Lembaga Pelupusan'}</strong></div>
                                  {disp.notes && <div className="text-[10px] text-slate-600 italic mt-0.5">"{disp.notes}"</div>}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>

                    <div className="border border-black p-3 space-y-4">
                      <p className="font-bold">Pengesahan Ketua Jabatan / Pegawai Pengawal:</p>
                      <p className="text-xs leading-relaxed">
                        Saya mengesahkan bahawa aset alih yang disenaraikan di atas telah dilupuskan secara fizikal mengikut kaedah yang diluluskan dan mengikut peruntukan Tatacara Pengurusan Aset Alih Kerajaan (TPA). Rekod daftar induk telah dikemaskini.
                      </p>
                      <div className="pt-4 max-w-sm">
                        <p>Tandatangan: .....................................................</p>
                        <p>Nama: <strong>Dato' Dr. Zairossani bin Mohd Nor</strong></p>
                        <p>Jawatan: Ketua Pengarah Lembaga Getah Malaysia</p>
                        <p>Tarikh: {new Date().toLocaleDateString('ms-MY')}</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

        </div>

        {/* Modal Footer (Hidden on Print) */}
        <div className="print:hidden pt-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Format mengikut Pekeliling Perbendaharaan Malaysia sedia simpan sebagai fail PDF bersaiz A4.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
