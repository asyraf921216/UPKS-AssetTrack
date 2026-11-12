import React, { useState } from 'react';
import { UserRole } from '../types/asset';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Shield, 
  ShieldCheck, 
  QrCode, 
  Plus, 
  FileSpreadsheet, 
  Printer, 
  FileText, 
  LogOut, 
  CheckCircle2,
  WifiOff
} from 'lucide-react';

interface NavbarProps {
  role: UserRole;
  isOnline: boolean;
  onRoleChange: (newRole: UserRole) => void;
  onOpenPinModal: () => void;
  onOpenScanner: () => void;
  onOpenAddAsset: () => void;
  onOpenImportExport: () => void;
  onOpenPrintSheet: () => void;
  onOpenKewPaForms: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  isOnline,
  onRoleChange,
  onOpenPinModal,
  onOpenScanner,
  onOpenAddAsset,
  onOpenImportExport,
  onOpenPrintSheet,
  onOpenKewPaForms,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleRoleToggle = () => {
    if (role === 'staff') {
      onOpenPinModal();
    } else {
      setShowExitConfirm(true);
    }
  };

  const confirmExitAdmin = () => {
    onRoleChange('staff');
    setShowExitConfirm(false);
  };

  return (
    <header className="bg-[#0B192C] text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Operational Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">UPKS AssetTrack</span>
                <span className="font-mono text-[10px] text-teal-300 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800/80">
                  KEW.PA
                </span>
                {!isOnline && (
                  <span className="inline-flex items-center text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Luar Talian
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
                Unit Pembangunan Ujian & Standard • Lembaga Getah Malaysia
              </p>
            </div>
          </div>

          {/* Controls & Role Management */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* PWA In-App Install Button */}
            <PWAInstallButton />

            {/* Direct QR Scanner Button */}
            <button
              onClick={onOpenScanner}
              type="button"
              className="inline-flex items-center justify-center h-8 sm:h-9 px-3 sm:px-3.5 rounded-md bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer active:bg-teal-700 shadow-2xs"
              title="Buka Pengimbas Kamera QR"
            >
              <QrCode className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline font-semibold">Imbas QR</span>
            </button>

            {/* Official Government Forms Button (KEW.PA-3, KEW.PA-7, KEW.PA-10) */}
            <button
              onClick={onOpenKewPaForms}
              type="button"
              className="inline-flex items-center justify-center h-8 sm:h-9 px-2.5 sm:px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
              title="Jana Borang Rasmi PDF (KEW.PA-3, KEW.PA-7, KEW.PA-10)"
            >
              <FileText className="w-3.5 h-3.5 sm:mr-1.5 text-teal-300" />
              <span className="hidden md:inline">Borang KEW.PA</span>
            </button>

            {/* Admin Toolbar Actions */}
            {role === 'admin' && (
              <>
                <button
                  onClick={onOpenAddAsset}
                  type="button"
                  className="hidden md:inline-flex items-center justify-center h-8 sm:h-9 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                  title="Daftar Aset Baharu"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-teal-400" />
                  <span>Daftar Aset</span>
                </button>

                <button
                  onClick={onOpenImportExport}
                  type="button"
                  className="hidden md:inline-flex items-center justify-center h-8 sm:h-9 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                  title="Import/Eksport CSV & Audit"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-sky-400" />
                  <span>Data CSV</span>
                </button>

                <button
                  onClick={onOpenPrintSheet}
                  type="button"
                  className="hidden lg:inline-flex items-center justify-center h-8 sm:h-9 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                  title="Cetak Helaian Label QR"
                >
                  <Printer className="w-3.5 h-3.5 mr-1 text-amber-300" />
                  <span>Cetak Label</span>
                </button>
              </>
            )}

            {/* Role Switcher Button */}
            <div className="flex items-center border-l border-slate-800 pl-2 sm:pl-2.5">
              {role === 'staff' ? (
                <button
                  onClick={handleRoleToggle}
                  className="inline-flex items-center h-8 sm:h-9 px-2.5 sm:px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium transition cursor-pointer"
                  title="Klik untuk membuka Mod Pentadbir (perlu PIN)"
                >
                  <Shield className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <span className="hidden xs:inline text-slate-400 mr-1">Mod:</span>
                  <span className="font-semibold text-white">Staf</span>
                  <span className="ml-2 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">PIN</span>
                </button>
              ) : (
                <button
                  onClick={handleRoleToggle}
                  className="inline-flex items-center h-8 sm:h-9 px-2.5 sm:px-3 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 text-xs font-medium transition cursor-pointer"
                  title="Mod Pentadbir Aktif. Klik untuk keluar ke Mod Staf"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  <span className="font-bold text-amber-300">ADMIN</span>
                  <LogOut className="w-3 h-3 ml-2 text-amber-400/80" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Role Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <LogOut className="w-4 h-4 mr-2 text-slate-600" />
              Keluar daripada Mod Admin?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Anda akan beralih semula ke Mod Staf terbuka. Fungsi pendaftaran, kemaskini, dan pengesahan kehilangan akan dikunci.
            </p>
            <div className="mt-5 flex justify-end space-x-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={confirmExitAdmin}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0B192C] hover:bg-slate-800 rounded-md flex items-center"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Sahkan Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
