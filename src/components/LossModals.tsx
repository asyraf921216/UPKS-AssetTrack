import React, { useState } from 'react';
import { Asset, LossReport } from '../types/asset';
import { reportLossAction, verifyLossAction } from '../services/storage';
import { AlertTriangle, ShieldAlert, CheckCircle2, X, AlertCircle, Calendar, MapPin, User, FileText } from 'lucide-react';

interface LossReportModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LossReportModal: React.FC<LossReportModalProps> = ({
  asset,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reportedBy, setReportedBy] = useState('');
  const [lastSeenDate, setLastSeenDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastKnownLocation, setLastKnownLocation] = useState(asset?.currentLocation || '');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedBy.trim()) {
      setError('Sila masukkan Nama Pelapor.');
      return;
    }
    if (!lastKnownLocation.trim()) {
      setError('Sila masukkan Lokasi Terakhir Diketahui.');
      return;
    }
    if (!description.trim()) {
      setError('Sila masukkan Keterangan Kejadian / Perihal Kehilangan.');
      return;
    }

    const res = reportLossAction(
      asset.id,
      reportedBy,
      lastSeenDate,
      lastKnownLocation,
      description
    );

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Gagal menghantar laporan kehilangan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Lapor Kehilangan Aset
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {asset.registrationNo} • {asset.name}
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-xl mb-4">
          <strong>Perhatian Aliran Kerja (BR-003):</strong> Menghantar borang ini akan menukar status aset kepada <span className="font-bold underline">Dalam Siasatan</span> untuk semakan makmal. Status hanya akan bertukar kepada <em>Hilang</em> selepas disahkan oleh Pegawai Aset (Admin).
        </div>

        {error && (
          <div className="mb-4 flex items-center space-x-2 text-rose-700 text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Nama Pelapor <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => {
                  setError('');
                  setReportedBy(e.target.value);
                }}
                placeholder="Nama penuh & jawatan pelapor..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tarikh Terakhir Dilihat <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={lastSeenDate}
                onChange={(e) => setLastSeenDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Lokasi Terakhir Diketahui <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={lastKnownLocation}
                onChange={(e) => setLastKnownLocation(e.target.value)}
                placeholder="Contoh: Meja Ujian 3 Makmal Kimia"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Keterangan Kejadian / Catatan Kronologi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan keadaan semasa aset didapati tiada, usaha pencarian yang telah dilakukan, atau saksi terlibat..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              required
            />
          </div>

          <div className="flex space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 transition shadow-xs flex items-center justify-center cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              Hantar Laporan Siasatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AdminLossResolutionModalProps {
  report: LossReport | null;
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLossResolutionModal: React.FC<AdminLossResolutionModalProps> = ({
  report,
  asset,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !report || !asset) return null;

  const handleResolve = (decision: 'confirm_lost' | 'mark_found') => {
    setIsSubmitting(true);
    const res = verifyLossAction(report.id, decision, adminNotes);
    setIsSubmitting(false);
    if (res.success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Pengesahan Kehilangan Aset (Admin)
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {asset.registrationNo} • {asset.name}
            </p>
          </div>
        </div>

        {/* Existing report details summary */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 mb-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Dilaporkan Oleh:</span>
            <span className="font-semibold text-slate-800">{report.reportedBy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tarikh Terakhir Dilihat:</span>
            <span className="font-semibold text-slate-800">{report.lastSeenDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Lokasi Terakhir:</span>
            <span className="font-semibold text-slate-800">{report.lastKnownLocation}</span>
          </div>
          <div className="pt-1 text-slate-700 italic border-t border-slate-200">
            "{report.description}"
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan Pegawai Aset / Pengesahan Siasatan (Audit KEW.PA)
          </label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Contoh: Siasatan CCTV dan semakan fizikal makmal telah dilaksanakan..."
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {/* Mark as Found button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleResolve('mark_found')}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition flex items-center justify-center cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
            Tanda Ditemui (Pulih Aktif)
          </button>

          {/* Confirm Lost button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleResolve('confirm_lost')}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-xs flex items-center justify-center cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 mr-1.5" />
            Sahkan Hilang (Hilang)
          </button>
        </div>
      </div>
    </div>
  );
};
