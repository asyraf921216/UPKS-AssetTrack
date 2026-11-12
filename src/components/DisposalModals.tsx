import React, { useState } from 'react';
import { Asset, DisposalRecord, DisposalMethod } from '../types/asset';
import { initiateDisposalAction, completeDisposalAction, cancelDisposalAction } from '../services/storage';
import { X, Flame, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck2, Trash2 } from 'lucide-react';

const DISPOSAL_METHODS: DisposalMethod[] = [
  'E-Waste (Sisa Elektronik)',
  'Buangan Terjadual / Sisa Toksik',
  'Musnah / Tanam',
  'Jualan Sisa / Tender',
  'Pindahan Jabatan / Hadiah'
];

const PRESET_REASONS = [
  'Tidak Ekonomi Dibaiki (Anggaran pembaikan > 70% nilai perolehan mengikut TPA Bab E)',
  'Usang / Ketinggalan Teknologi dan tidak lagi menyokong piawaian pengujian ISO 17025',
  'Rosak teruk & alat ganti tiada lagi dikeluarkan oleh pihak pengilang (End-of-Life)',
  'Tamat tarikh luput & berlaku degradasi kualiti bahan kimia / reagen makmal',
  'Melepasi hayat guna optimum makmal dan tidak selamat untuk pengoperasian kakitangan'
];

interface InitiateDisposalModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InitiateDisposalModal: React.FC<InitiateDisposalModalProps> = ({
  asset,
  isOpen,
  onClose,
  onSuccess
}) => {
  const currentYear = new Date().getFullYear();
  const defaultPepNo = `PEP/UPKS/${currentYear}/${Math.floor(100 + Math.random() * 900)}`;

  const [pepNo, setPepNo] = useState(defaultPepNo);
  const [reason, setReason] = useState(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [proposedMethod, setProposedMethod] = useState<DisposalMethod>(
    asset?.category === 'Barangan Komputer' ? 'E-Waste (Sisa Elektronik)' :
    asset?.category === 'Peralatan Test Chemical' ? 'Buangan Terjadual / Sisa Toksik' :
    'Musnah / Tanam'
  );
  const [initiatedBy, setInitiatedBy] = useState('Ts. Mohd Asyraf bin Zulkifli (Pegawai Aset UPKS)');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalReason = customReason.trim() ? customReason.trim() : reason;
    if (!pepNo.trim()) {
      setError('Sila masukkan No. Perakuan Pelupusan (PEP).');
      return;
    }
    if (!finalReason) {
      setError('Sila nyatakan justifikasi / sebab pelupusan.');
      return;
    }
    if (!initiatedBy.trim()) {
      setError('Sila masukkan nama pegawai pemohon / pemeriksa.');
      return;
    }

    const result = initiateDisposalAction(
      asset.id,
      pepNo,
      finalReason,
      proposedMethod,
      initiatedBy,
      notes
    );

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Gagal memulakan proses pelupusan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Mula Proses Pelupusan Aset (PEP)
              </h3>
              <p className="text-[11px] text-slate-500">
                Pekeliling Perbendaharaan Malaysia — Tatacara Pengurusan Aset (TPA Bab E)
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

        {/* Asset Brief */}
        <div className="my-3 p-3 bg-purple-50/60 rounded-lg border border-purple-200 text-xs">
          <div className="font-mono text-purple-900 font-bold">{asset.registrationNo}</div>
          <div className="font-semibold text-slate-800 text-sm mt-0.5">{asset.name}</div>
          <div className="text-slate-500 text-[11px] mt-0.5">
            Lokasi: {asset.currentLocation} • Pegawai: {asset.custodian}
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              No. Perakuan Pelupusan (PEP) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={pepNo}
              onChange={(e) => setPepNo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-purple-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Justifikasi / Sebab Pelupusan <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setCustomReason('');
              }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-purple-600"
            >
              {PRESET_REASONS.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
              <option value="Lain-lain">Lain-lain (Nyatakan secara khusus di bawah)</option>
            </select>
            {reason === 'Lain-lain' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nyatakan sebab pelupusan secara terperinci..."
                rows={2}
                className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-purple-600"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Kaedah Pelupusan Dicadangkan <span className="text-rose-500">*</span>
            </label>
            <select
              value={proposedMethod}
              onChange={(e) => setProposedMethod(e.target.value as DisposalMethod)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-purple-600"
            >
              {DISPOSAL_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Pegawai Pemohon / Pemeriksa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={initiatedBy}
              onChange={(e) => setInitiatedBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-purple-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Catatan Teknikal Tambahan (Pilihan)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Telah disahkan oleh jurutera makmal UPKS pada borang PEP fizikal..."
              rows={2}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Perhatian:</strong> Apabila dimulakan, status aset akan bertukar kepada <strong>Dalam Proses Lupus</strong>. Aset tidak lagi dibenarkan untuk dipinjam atau dikeluarkan.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-2xs flex items-center cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 mr-1.5" />
              Sahkan Permulaan PEP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CompleteDisposalModalProps {
  disposalRecord: DisposalRecord | null;
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CompleteDisposalModal: React.FC<CompleteDisposalModalProps> = ({
  disposalRecord,
  asset,
  isOpen,
  onClose,
  onSuccess
}) => {
  const currentYear = new Date().getFullYear();
  const defaultCertNo = `SIJIL-LUPUS/UPKS/${currentYear}/${Math.floor(100 + Math.random() * 900)}`;

  const [actualMethod, setActualMethod] = useState<DisposalMethod>(
    disposalRecord?.proposedMethod || 'E-Waste (Sisa Elektronik)'
  );
  const [certificateNo, setCertificateNo] = useState(defaultCertNo);
  const [approvedBy, setApprovedBy] = useState('Ts. Mohd Asyraf bin Zulkifli (Pegawai Aset UPKS)');
  const [completionNotes, setCompletionNotes] = useState(
    'Tindakan fizikal pelupusan telah disahkan selesai mengikut kaedah yang diluluskan. Sijil Pelupusan KEW.PA-21 telah dijana dan difailkan.'
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !disposalRecord || !asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!certificateNo.trim()) {
      setError('Sila masukkan No. Sijil Pelupusan (KEW.PA-21).');
      return;
    }
    if (!approvedBy.trim()) {
      setError('Sila masukkan nama pegawai yang mengesahkan.');
      return;
    }

    const result = completeDisposalAction(
      disposalRecord.id,
      actualMethod,
      certificateNo,
      approvedBy,
      completionNotes
    );

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Gagal mengesahkan pelupusan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Sahkan Selesai Pelupusan (KEW.PA-21)
              </h3>
              <p className="text-[11px] text-slate-500">
                Penyempurnaan Sijil Pelupusan Aset Alih Kerajaan
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

        {/* Existing PEP Details */}
        <div className="my-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-purple-900 font-bold">{asset.registrationNo}</span>
            <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
              {disposalRecord.pepNo}
            </span>
          </div>
          <div className="font-bold text-slate-900">{asset.name}</div>
          <div className="text-slate-600 text-[11px]">
            Sebab: <span className="italic">{disposalRecord.reason}</span>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              No. Sijil Pelupusan (KEW.PA-21) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={certificateNo}
              onChange={(e) => setCertificateNo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Kaedah Pelupusan Sebenar Yang Dilaksanakan <span className="text-rose-500">*</span>
            </label>
            <select
              value={actualMethod}
              onChange={(e) => setActualMethod(e.target.value as DisposalMethod)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-600"
            >
              {DISPOSAL_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Pegawai / Lembaga Yang Mengesahkan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Catatan Pengesahan Fizikal & Resit Pelupusan
            </label>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Contoh: Telah diserahkan kepada kontraktor berlesen DOE. Resit akuan penerimaan dilampirkan..."
              rows={2.5}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-[11px] text-slate-700 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Tindakan ini akan mengemaskini status aset secara muktamad kepada <strong>Dilupuskan</strong> dan melengkapkan Sijil KEW.PA-21.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xs flex items-center cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Sahkan Selesai & Terbitkan Sijil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
