import React, { useState, useEffect, useRef } from 'react';
import { Lock, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_PIN = '1234';

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DEFAULT_PIN) {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('Kod PIN tidak sah. Sila cuba lagi.');
      setPin('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pin-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 id="pin-modal-title" className="text-lg font-bold text-slate-900">
              Pengesahan Mod Admin
            </h3>
            <p className="text-xs text-slate-500">
              Unit Pembangunan Ujian & Standard
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Masukkan Kod PIN Pegawai Aset untuk mengakses fungsi pendaftaran, penyuntingan, import/eksport, dan pengesahan kehilangan rasmi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Kod PIN Admin (4 Digit)
            </label>
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setError('');
                setPin(e.target.value);
              }}
              placeholder="••••"
              className="w-full text-center text-2xl tracking-[0.5em] font-mono py-2.5 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-800"
              autoComplete="one-time-code"
              required
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-rose-600 text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-lg animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-500 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-700">Petunjuk MVP: </span>
              Kod PIN lalai pentadbiran UPKS ialah <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-slate-800">1234</code>.
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 transition shadow-sm"
            >
              Sahkan PIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
