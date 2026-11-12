import React from 'react';
import { Asset } from '../types/asset';
import { deleteAssetRecord } from '../services/storage';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  asset,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !asset) return null;

  const handleDelete = () => {
    const res = deleteAssetRecord(asset.id);
    if (res.success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150"
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

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Pengesahan Padam Rekod Aset
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {asset.registrationNo}
            </p>
          </div>
        </div>

        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl mb-4 text-xs text-rose-900 space-y-1">
          <div className="font-bold flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1 text-rose-600" />
            Amaran Sistem (BR-006):
          </div>
          <p>
            Tindakan memadam aset <strong>"{asset.name}"</strong> adalah muktamad dan rekod ini <u>tidak boleh dikembalikan</u> selepas dipadam.
          </p>
        </div>

        <p className="text-xs text-slate-600 mb-5">
          Adakah anda pasti mahu mengeluarkan aset ini daripada pangkalan data inventori rasmi UPKS?
        </p>

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
            onClick={handleDelete}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-xs flex items-center justify-center cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Sahkan Padam
          </button>
        </div>
      </div>
    </div>
  );
};
