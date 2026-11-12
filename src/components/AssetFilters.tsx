import React from 'react';
import { Asset, AssetCategory, AssetStatus, FilterState } from '../types/asset';
import { Search, X, RotateCcw, Filter, MapPin, Tag, Clock, Pin } from 'lucide-react';
import { VALID_CATEGORIES, VALID_STATUSES } from '../utils/csvHelper';

interface AssetFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  locations: string[];
  totalMatches: number;
  recentlyViewedAssets: Asset[];
  pinnedAssets: Asset[];
  onSelectRecentAsset: (asset: Asset) => void;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  locations,
  totalMatches,
  recentlyViewedAssets,
  pinnedAssets,
  onSelectRecentAsset,
}) => {
  const isFiltered =
    filters.searchQuery.trim() !== '' ||
    filters.category !== 'SEMUA' ||
    filters.status !== 'SEMUA' ||
    filters.location !== 'SEMUA';

  return (
    <div className="bg-white p-3 sm:p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2.5">
      {/* Search Input & Reset Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Cari pantas (Fuzzy toleransi 1-2 huruf): No. KEW.PA, nama, jenama, siri pembuat..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white text-slate-900 placeholder-slate-400 font-sans"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Kosongkan carian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            type="button"
            className="inline-flex items-center justify-center h-9 px-3 rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <span>Set Semula</span>
          </button>
        )}
      </div>

      {/* Aset Terkini Dilihat & Disemat (Recently Viewed / Pinned Chips Bar) */}
      {(pinnedAssets.length > 0 || recentlyViewedAssets.length > 0) && (
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight shrink-0 flex items-center mr-1">
            <Clock className="w-3 h-3 mr-1 text-teal-600" />
            Aset Terkini:
          </span>

          {/* Pinned Assets */}
          {pinnedAssets.map(asset => (
            <button
              key={`pin-${asset.id}`}
              onClick={() => onSelectRecentAsset(asset)}
              type="button"
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs shrink-0 cursor-pointer transition shadow-2xs font-medium"
              title="Aset Disemat / Penting"
            >
              <Pin className="w-3 h-3 text-amber-600 shrink-0 rotate-45" />
              <span className="font-mono font-bold text-[11px]">{asset.registrationNo.split('/').pop()}</span>
              <span className="truncate max-w-[100px]">{asset.name}</span>
            </button>
          ))}

          {/* Recently Viewed Assets */}
          {recentlyViewedAssets.map(asset => (
            <button
              key={`recent-${asset.id}`}
              onClick={() => onSelectRecentAsset(asset)}
              type="button"
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs shrink-0 cursor-pointer transition font-medium"
            >
              <span className="font-mono font-semibold text-[11px] text-teal-800">{asset.registrationNo.split('/').pop()}</span>
              <span className="truncate max-w-[110px] text-slate-700">{asset.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Structured Inline Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
        
        {/* Category Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight shrink-0 flex items-center">
            <Tag className="w-3 h-3 mr-1 text-slate-500" />
            Kategori:
          </span>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value as AssetCategory | 'SEMUA' })}
            className="flex-1 py-1 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 text-slate-800"
          >
            <option value="SEMUA">Semua Kategori (4)</option>
            {VALID_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight shrink-0 flex items-center">
            <Filter className="w-3 h-3 mr-1 text-slate-500" />
            Status:
          </span>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value as AssetStatus | 'SEMUA' })}
            className="flex-1 py-1 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 text-slate-800"
          >
            <option value="SEMUA">Semua Status</option>
            {VALID_STATUSES.map(stat => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
          </select>
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight shrink-0 flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-slate-500" />
            Lokasi:
          </span>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="flex-1 py-1 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 text-slate-800"
          >
            <option value="SEMUA">Semua Bilik/Makmal</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Operational Match Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
        <span className="tabular-nums">
          Memaparkan <strong className="text-slate-900 font-mono font-bold">{totalMatches}</strong> rekod aset inventori
        </span>
        {isFiltered && (
          <span className="text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-medium">
            Penapis Tersuai Aktif
          </span>
        )}
      </div>
    </div>
  );
};
