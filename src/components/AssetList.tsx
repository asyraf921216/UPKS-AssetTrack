import React from 'react';
import { Asset, UserRole } from '../types/asset';
import { StatusBadge, CategoryBadge } from './AssetBadge';
import { getAssetDisplayImage } from '../utils/categoryImages';
import { isChemicalExpired } from '../utils/chemicalExpiry';
import { 
  Eye, 
  QrCode, 
  ArrowRightLeft, 
  RotateCcw, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  MapPin, 
  User, 
  Inbox, 
  Calendar,
  AlertOctagon
} from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  role: UserRole;
  onSelectAsset: (asset: Asset) => void;
  onOpenQR: (asset: Asset) => void;
  onBorrow: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
  onReportLoss: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  onResetFilters: () => void;
  selectedAssetIdsForPrint: string[];
  onToggleSelectForPrint: (assetId: string) => void;
  showPrintCheckboxes: boolean;
}

export const AssetList: React.FC<AssetListProps> = ({
  assets,
  role,
  onSelectAsset,
  onOpenQR,
  onBorrow,
  onReturn,
  onReportLoss,
  onEdit,
  onDelete,
  onResetFilters,
  selectedAssetIdsForPrint,
  onToggleSelectForPrint,
  showPrintCheckboxes,
}) => {
  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 sm:p-12 text-center shadow-2xs">
        <div className="w-12 h-12 mx-auto mb-3 rounded-md bg-slate-100 text-slate-400 flex items-center justify-center">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Tiada Rekod Aset Sepadan
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
          Tiada padanan aset dengan kata kunci atau gabungan penapis yang dipilih. Sila laraskan kriteria atau set semula penapis.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center px-3.5 py-2 rounded-md bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Set Semula Penapis
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile Structured Ledger Cards */}
      <div className="md:hidden space-y-2.5">
        {assets.map((asset) => {
          const isSelectedForPrint = selectedAssetIdsForPrint.includes(asset.id);
          const displayImg = getAssetDisplayImage(asset);
          const isExpired = isChemicalExpired(asset);

          return (
            <div
              key={asset.id}
              className={`bg-white rounded-lg border p-3.5 shadow-2xs transition-all relative ${
                isSelectedForPrint 
                  ? 'border-teal-500 ring-1 ring-teal-500' 
                  : isExpired
                  ? 'border-rose-400 bg-rose-50/20'
                  : asset.status === 'Dalam Siasatan'
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header: RegNo, Expiry Warning & Status */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-1.5 min-w-0">
                  {showPrintCheckboxes && (
                    <input
                      type="checkbox"
                      checked={isSelectedForPrint}
                      onChange={() => onToggleSelectForPrint(asset.id)}
                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer shrink-0"
                    />
                  )}
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/90 truncate">
                    {asset.registrationNo}
                  </span>
                  {isExpired && (
                    <span className="inline-flex items-center text-[10px] bg-rose-100 text-rose-900 border border-rose-300 px-1 py-0.5 rounded font-black shrink-0 animate-pulse">
                      <AlertOctagon className="w-3 h-3 mr-0.5 text-rose-600" />
                      LUPUT
                    </span>
                  )}
                </div>
                <StatusBadge status={asset.status} size="sm" />
              </div>

              {/* Title, Category & Visual Image Thumbnail */}
              <div className="flex items-start gap-3 mb-2.5">
                <button
                  type="button"
                  onClick={() => onSelectAsset(asset)}
                  className="w-14 h-14 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group shadow-2xs cursor-pointer"
                  title="Lihat Butiran & Foto Aset"
                >
                  <img
                    src={displayImg}
                    alt={asset.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => onSelectAsset(asset)}
                    className="text-xs sm:text-sm font-bold text-slate-900 hover:text-teal-700 transition cursor-pointer leading-snug line-clamp-2"
                  >
                    {asset.name}
                  </h4>
                  <div className="mt-1 flex items-center space-x-1.5 flex-wrap gap-1">
                    <CategoryBadge category={asset.category} />
                  </div>
                </div>
              </div>

              {/* Technical meta: Location, Custodian, Calibration */}
              <div className="space-y-1 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded border border-slate-100">
                <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-teal-600 shrink-0" />
                  <span className="font-medium text-slate-900 truncate">{asset.currentLocation}</span>
                  {asset.currentLocation !== asset.defaultLocation && (
                    <span className="ml-1 text-[10px] text-amber-800 bg-amber-100 px-1 rounded font-medium">
                      (Asal: {asset.defaultLocation})
                    </span>
                  )}
                </div>
                <div className="flex items-center text-slate-600">
                  <User className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate">{asset.custodian}</span>
                </div>
                {asset.calibrationDueDate && (
                  <div className="flex items-center text-indigo-900 font-medium pt-0.5">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-600 shrink-0" />
                    <span>Kalibrasi ISO: {asset.calibrationDueDate}</span>
                  </div>
                )}
                {asset.quantityUnit && (
                  <div className={`flex items-center font-medium pt-0.5 ${isExpired ? 'text-rose-900 font-bold' : 'text-teal-900'}`}>
                    <span className="w-3.5 text-center text-[10px] mr-1.5">🧪</span>
                    <span>Kuantiti: {asset.quantityUnit} {asset.expiryDate ? `(Luput: ${asset.expiryDate})` : ''}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Minimal & Accessible */}
              <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectAsset(asset)}
                  className="flex-1 min-h-[38px] px-2 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center cursor-pointer transition"
                >
                  <Eye className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  <span>Butiran</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenQR(asset)}
                  className="min-h-[38px] min-w-[38px] px-2 py-1.5 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs font-medium flex items-center justify-center border border-slate-200 cursor-pointer transition"
                  title="Lihat Kod QR"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                {asset.status === 'Aktif' && (
                  <button
                    type="button"
                    onClick={() => onBorrow(asset)}
                    className="flex-1 min-h-[38px] px-2 py-1.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-center border border-sky-200 cursor-pointer transition"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 mr-1 text-sky-600" />
                    <span>Pinjam</span>
                  </button>
                )}

                {asset.status === 'Dipinjam' && (
                  <button
                    type="button"
                    onClick={() => onReturn(asset)}
                    className="flex-1 min-h-[38px] px-2 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center border border-emerald-300 cursor-pointer transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>Pulangkan</span>
                  </button>
                )}

                {asset.status !== 'Hilang' && asset.status !== 'Dalam Siasatan' && (
                  <button
                    type="button"
                    onClick={() => onReportLoss(asset)}
                    className="min-h-[38px] min-w-[38px] px-2 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center justify-center border border-amber-200 cursor-pointer transition"
                    title="Lapor Hilang"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </button>
                )}

                {/* Admin Actions */}
                {role === 'admin' && (
                  <div className="flex items-center space-x-1 pl-1">
                    <button
                      type="button"
                      onClick={() => onEdit(asset)}
                      className="min-h-[38px] min-w-[38px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition"
                      title="Sunting Aset"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(asset)}
                      className="min-h-[38px] min-w-[38px] rounded bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center cursor-pointer transition"
                      title="Padam Rekod Aset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Structured Ledger Table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-[#0B192C] text-slate-200 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                {showPrintCheckboxes && (
                  <th scope="col" className="px-3.5 py-3 w-10 text-center">
                    <span className="sr-only">Pilih</span>
                  </th>
                )}
                <th scope="col" className="px-3.5 py-3">No. Pendaftaran KEW.PA</th>
                <th scope="col" className="px-3.5 py-3">Nama & Kategori Aset</th>
                <th scope="col" className="px-3.5 py-3">Lokasi Penempatan</th>
                <th scope="col" className="px-3.5 py-3">Pegawai Bertanggungjawab</th>
                <th scope="col" className="px-3.5 py-3 text-center">Status</th>
                <th scope="col" className="px-3.5 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset, index) => {
                const isSelectedForPrint = selectedAssetIdsForPrint.includes(asset.id);
                const displayImg = getAssetDisplayImage(asset);
                const isExpired = isChemicalExpired(asset);

                return (
                  <tr 
                    key={asset.id} 
                    className={`transition-colors ${
                      isExpired
                        ? 'bg-rose-50/40 hover:bg-rose-50/60'
                        : asset.status === 'Dalam Siasatan'
                        ? 'bg-amber-50/50 hover:bg-amber-50'
                        : isSelectedForPrint
                        ? 'bg-teal-50/40 hover:bg-teal-50/60'
                        : index % 2 === 1
                        ? 'bg-slate-50/40 hover:bg-slate-50'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    {showPrintCheckboxes && (
                      <td className="px-3.5 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelectedForPrint}
                          onChange={() => onToggleSelectForPrint(asset.id)}
                          className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                      </td>
                    )}

                    <td className="px-3.5 py-3 font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onOpenQR(asset)}
                          className="text-slate-400 hover:text-teal-700 p-1 rounded hover:bg-teal-50 transition cursor-pointer"
                          title="Lihat / Cetak Kod QR Aset Ini"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <span className="tabular-nums tracking-tight">{asset.registrationNo}</span>
                        {isExpired && (
                          <span className="text-[10px] bg-rose-100 text-rose-900 border border-rose-300 px-1 py-0.2 rounded font-bold">
                            LUPUT
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-3.5 py-3">
                      <div className="flex items-center space-x-2.5">
                        <div 
                          onClick={() => onSelectAsset(asset)}
                          className="w-10 h-10 rounded overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer shadow-2xs group relative"
                          title={`Kategori: ${asset.category}`}
                        >
                          <img
                            src={displayImg}
                            alt={asset.category}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0">
                          <div 
                            onClick={() => onSelectAsset(asset)}
                            className="font-bold text-slate-900 hover:text-teal-700 cursor-pointer transition leading-snug line-clamp-1"
                          >
                            {asset.name}
                          </div>
                          <div className="mt-0.5 flex items-center space-x-2">
                            <CategoryBadge category={asset.category} />
                            {asset.brandModel && (
                              <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                {asset.brandModel}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3.5 py-3 text-xs text-slate-700">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-teal-600 shrink-0" />
                        <span className="font-medium text-slate-900">{asset.currentLocation}</span>
                      </div>
                      {asset.currentLocation !== asset.defaultLocation && (
                        <div className="text-[11px] text-amber-800 pl-4.5 mt-0.5">
                          Asal: {asset.defaultLocation}
                        </div>
                      )}
                    </td>

                    <td className="px-3.5 py-3 text-xs text-slate-700">
                      <div className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                        <span>{asset.custodian}</span>
                      </div>
                    </td>

                    <td className="px-3.5 py-3 text-center whitespace-nowrap">
                      <StatusBadge status={asset.status} size="sm" />
                    </td>

                    <td className="px-3.5 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => onSelectAsset(asset)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition cursor-pointer flex items-center"
                          title="Buka Maklumat Terperinci"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                          <span>Butiran</span>
                        </button>

                        {asset.status === 'Aktif' && (
                          <button
                            type="button"
                            onClick={() => onBorrow(asset)}
                            className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-medium transition cursor-pointer flex items-center"
                            title="Rekod Pinjaman / Pindah Lokasi"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 mr-1 text-sky-600" />
                            <span>Pinjam</span>
                          </button>
                        )}

                        {asset.status === 'Dipinjam' && (
                          <button
                            type="button"
                            onClick={() => onReturn(asset)}
                            className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold transition cursor-pointer flex items-center"
                            title="Rekod Pemulangan Aset"
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            <span>Pulang</span>
                          </button>
                        )}

                        {asset.status !== 'Hilang' && asset.status !== 'Dalam Siasatan' && (
                          <button
                            type="button"
                            onClick={() => onReportLoss(asset)}
                            className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
                            title="Lapor Hilang"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          </button>
                        )}

                        {role === 'admin' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onEdit(asset)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title="Sunting Aset (Mod Admin)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(asset)}
                              className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                              title="Padam Rekod (Mod Admin)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
