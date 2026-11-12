import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { borrowAssetAction, returnAssetAction } from '../services/storage';
import { ArrowRightLeft, RotateCcw, X, AlertCircle, MapPin, Calendar, User, FileText } from 'lucide-react';

interface BorrowModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  locations: string[];
  onSuccess: () => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  asset,
  isOpen,
  onClose,
  locations,
  onSuccess,
}) => {
  const [borrowerName, setBorrowerName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(locations[0] || 'Makmal Ujian Kimia 2');
  const [customLocation, setCustomLocation] = useState('');
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [borrowedDate, setBorrowedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerName.trim()) {
      setError('Sila masukkan Nama Peminjam.');
      return;
    }

    const targetLocation = useCustomLocation ? customLocation.trim() : selectedLocation;
    if (!targetLocation) {
      setError('Sila pilih atau masukkan Lokasi Baharu.');
      return;
    }

    const result = borrowAssetAction(
      asset.id,
      borrowerName,
      targetLocation,
      borrowedDate,
      expectedReturnDate || undefined,
      notes || undefined
    );

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Gagal merekod pinjaman.');
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
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Rekod Pinjaman / Pindah Lokasi
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {asset.registrationNo} • {asset.name}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center space-x-2 text-rose-700 text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Nama Peminjam / Pegawai Mengambil <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={borrowerName}
                onChange={(e) => {
                  setError('');
                  setBorrowerName(e.target.value);
                }}
                placeholder="Contoh: Siti Sarah binti Idris (Pegawai Penyelidik)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-semibold">
                Lokasi Baharu / Tujuan Penempatan <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setUseCustomLocation(!useCustomLocation)}
                className="text-xs text-teal-700 hover:underline"
              >
                {useCustomLocation ? 'Pilih daripada senarai' : '+ Lokasi Lain'}
              </button>
            </div>

            {useCustomLocation ? (
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Taip nama makmal atau bilik baharu..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                required
              />
            ) : (
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            )}
            <p className="text-[11px] text-slate-500 mt-1">
              Lokasi semasa: <span className="font-medium text-slate-700">{asset.currentLocation}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tarikh Pinjam <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={borrowedDate}
                onChange={(e) => setBorrowedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Jangka Pulang (Pilihan)
              </label>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Tujuan & Catatan Tambahan (Pilihan)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Digunakan untuk analisis getah standard ISO..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
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
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-xs flex items-center justify-center cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4 mr-1.5" />
              Sahkan Pinjaman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ReturnModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  asset,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || !asset) return null;

  const handleReturn = () => {
    const res = returnAssetAction(asset.id, returnDate);
    if (res.success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Rekod Pemulangan Aset
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {asset.registrationNo}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-700 mb-4">
          Aset <strong>{asset.name}</strong> akan dikembalikan kepada status <span className="text-emerald-700 font-bold">Aktif</span> dan lokasi fizikal akan disetkan semula ke lokasi asal:
        </p>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 mb-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Lokasi Semasa Semasa Dipinjam:</span>
            <span className="font-semibold text-slate-800">{asset.currentLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Lokasi Penempatan Asal (Dipulihkan):</span>
            <span className="font-bold text-teal-800">{asset.defaultLocation}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tarikh Pemulangan Sebenar
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleReturn}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-xs flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Sahkan Pemulangan
          </button>
        </div>
      </div>
    </div>
  );
};
