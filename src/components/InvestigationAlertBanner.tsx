import React from 'react';
import { Asset, UserRole } from '../types/asset';
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface InvestigationAlertBannerProps {
  assetsInInvestigation: Asset[];
  role: UserRole;
  onSelectAsset: (asset: Asset) => void;
  onOpenPinModal: () => void;
}

export const InvestigationAlertBanner: React.FC<InvestigationAlertBannerProps> = ({
  assetsInInvestigation,
  role,
  onSelectAsset,
  onOpenPinModal,
}) => {
  if (assetsInInvestigation.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 sm:p-3.5 shadow-2xs">
      <div className="flex items-start justify-between flex-wrap gap-2.5">
        <div className="flex items-start space-x-2.5 min-w-0">
          <div className="p-1.5 rounded bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-amber-950 flex items-center">
              <span>Perhatian: {assetsInInvestigation.length} Aset Sedang Dalam Siasatan Kehilangan</span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-800 mt-0.5 leading-relaxed">
              Laporan kehilangan telah difailkan oleh kakitangan. Sila semak fizikal di makmal atau sahkan status rasmi KEW.PA.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {assetsInInvestigation.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white border border-amber-300 text-xs font-medium text-amber-950 hover:bg-amber-100 transition shadow-2xs cursor-pointer"
                >
                  <span className="font-mono font-bold">{asset.registrationNo}</span>
                  <span className="text-slate-400">•</span>
                  <span className="truncate max-w-[140px]">{asset.name}</span>
                  <ArrowRight className="w-3 h-3 text-amber-700" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {role === 'staff' ? (
          <button
            onClick={onOpenPinModal}
            className="self-center px-2.5 py-1.5 rounded bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-2xs flex items-center space-x-1 cursor-pointer transition shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sahkan Sebagai Admin</span>
          </button>
        ) : (
          <span className="self-center px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[11px] font-bold shrink-0">
            Mod Admin Aktif
          </span>
        )}
      </div>
    </div>
  );
};
