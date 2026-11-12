import React from 'react';
import { Asset, AssetCategory, AssetStatus } from '../types/asset';
import { getCategoryImageUrl } from '../utils/categoryImages';
import { 
  Microscope, 
  Armchair, 
  Laptop, 
  FlaskConical, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRightLeft, 
  ShieldAlert, 
  SlidersHorizontal 
} from 'lucide-react';

interface DashboardStatsProps {
  assets: Asset[];
  selectedCategory: AssetCategory | 'SEMUA';
  selectedStatus: AssetStatus | 'SEMUA';
  onSelectCategory: (category: AssetCategory | 'SEMUA') => void;
  onSelectStatus: (status: AssetStatus | 'SEMUA') => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  assets,
  selectedCategory,
  selectedStatus,
  onSelectCategory,
  onSelectStatus,
}) => {
  const totalCount = assets.length;

  const categoryCounts = {
    Instruments: assets.filter(a => a.category === 'Instruments').length,
    Perabot: assets.filter(a => a.category === 'Perabot').length,
    'Barangan Komputer': assets.filter(a => a.category === 'Barangan Komputer').length,
    'Peralatan Test Chemical': assets.filter(a => a.category === 'Peralatan Test Chemical').length,
  };

  const statusCounts = {
    Aktif: assets.filter(a => a.status === 'Aktif').length,
    Dipinjam: assets.filter(a => a.status === 'Dipinjam').length,
    'Dalam Siasatan': assets.filter(a => a.status === 'Dalam Siasatan').length,
    Hilang: assets.filter(a => a.status === 'Hilang').length,
    Rosak: assets.filter(a => a.status === 'Rosak').length,
    'Dalam Proses Lupus': assets.filter(a => a.status === 'Dalam Proses Lupus').length,
    Dilupuskan: assets.filter(a => a.status === 'Dilupuskan').length,
  };

  const categorySegments: Array<{
    category: AssetCategory;
    title: string;
    icon: React.ElementType;
    count: number;
    codeRange: string;
  }> = [
    {
      category: 'Instruments',
      title: 'Instruments',
      icon: Microscope,
      count: categoryCounts.Instruments,
      codeRange: 'GC-MS, Neraca, pH Meter'
    },
    {
      category: 'Perabot',
      title: 'Perabot Makmal',
      icon: Armchair,
      count: categoryCounts.Perabot,
      codeRange: 'Meja Pulau, Kerusi ESD'
    },
    {
      category: 'Barangan Komputer',
      title: 'Komputer & IT',
      icon: Laptop,
      count: categoryCounts['Barangan Komputer'],
      codeRange: 'Workstation, Tablet, Printer'
    },
    {
      category: 'Peralatan Test Chemical',
      title: 'Test Chemical',
      icon: FlaskConical,
      count: categoryCounts['Peralatan Test Chemical'],
      codeRange: 'Reagen, Asid, Pelarut'
    }
  ];

  return (
    <div className="space-y-2.5">
      
      {/* 4 Category Operational Metric Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {categorySegments.map(item => {
          const isSelected = selectedCategory === item.category;
          const Icon = item.icon;
          const thumbnail = getCategoryImageUrl(item.category);

          return (
            <button
              key={item.category}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'SEMUA' : item.category)}
              className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all cursor-pointer relative bg-white flex items-center justify-between ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-600 shadow-2xs'
                  : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                  <img
                    src={thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-900/10" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate flex items-center">
                    <Icon className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate font-mono">
                    {item.codeRange}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 pl-1 border-l border-slate-100">
                <div className="font-mono text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                  {item.count}
                </div>
                <div className="text-[10px] text-slate-600 font-medium leading-none">
                  unit
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* High-density Status Ledger Strip */}
      <div className="bg-white px-3 py-2 sm:py-2.5 rounded-lg border border-slate-200/90 shadow-2xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-700">Status Operasi Aset:</span>
          {selectedCategory !== 'SEMUA' && (
            <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
              Kategori: {selectedCategory}
            </span>
          )}
        </div>

        {/* Status segment buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          
          {/* Semua */}
          <button
            type="button"
            onClick={() => onSelectStatus('SEMUA')}
            className={`h-7 px-2.5 rounded text-xs font-medium shrink-0 transition flex items-center space-x-1.5 cursor-pointer ${
              selectedStatus === 'SEMUA'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Semua</span>
            <span className="font-mono text-[10px] font-bold tabular-nums">
              ({totalCount})
            </span>
          </button>

          {/* Aktif */}
          <button
            type="button"
            onClick={() => onSelectStatus(selectedStatus === 'Aktif' ? 'SEMUA' : 'Aktif')}
            className={`h-7 px-2.5 rounded text-xs font-medium shrink-0 transition flex items-center space-x-1.5 cursor-pointer ${
              selectedStatus === 'Aktif'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Aktif</span>
            <span className="font-mono text-[10px] font-bold tabular-nums">
              ({statusCounts.Aktif})
            </span>
          </button>

          {/* Dipinjam */}
          <button
            type="button"
            onClick={() => onSelectStatus(selectedStatus === 'Dipinjam' ? 'SEMUA' : 'Dipinjam')}
            className={`h-7 px-2.5 rounded text-xs font-medium shrink-0 transition flex items-center space-x-1.5 cursor-pointer ${
              selectedStatus === 'Dipinjam'
                ? 'bg-sky-700 text-white font-semibold'
                : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>Dipinjam</span>
            <span className="font-mono text-[10px] font-bold tabular-nums">
              ({statusCounts.Dipinjam})
            </span>
          </button>

          {/* Dalam Siasatan */}
          <button
            type="button"
            onClick={() => onSelectStatus(selectedStatus === 'Dalam Siasatan' ? 'SEMUA' : 'Dalam Siasatan')}
            className={`h-7 px-2.5 rounded text-xs font-medium shrink-0 transition flex items-center space-x-1.5 cursor-pointer ${
              selectedStatus === 'Dalam Siasatan'
                ? 'bg-amber-600 text-white font-bold ring-1 ring-amber-400'
                : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-600 group-hover:text-white" />
            <span>Siasatan</span>
            <span className="font-mono text-[10px] font-bold tabular-nums">
              ({statusCounts['Dalam Siasatan']})
            </span>
          </button>

          {/* Hilang */}
          <button
            type="button"
            onClick={() => onSelectStatus(selectedStatus === 'Hilang' ? 'SEMUA' : 'Hilang')}
            className={`h-7 px-2.5 rounded text-xs font-medium shrink-0 transition flex items-center space-x-1.5 cursor-pointer ${
              selectedStatus === 'Hilang'
                ? 'bg-rose-700 text-white font-semibold'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Hilang</span>
            <span className="font-mono text-[10px] font-bold tabular-nums">
              ({statusCounts.Hilang})
            </span>
          </button>

          {/* Dalam Proses Lupus */}
          <button
            type="button"
            onClick={() => onSelectStatus(selectedStatus === 'Dalam Proses Lupus' ? 'SEMUA' : 'Dalam Proses Lupus')}
            className={`h-7 px-2.5 rounded text-xs font-medium shrink-0 transition flex items-center space-x-1.5 cursor-pointer ${
              selectedStatus === 'Dalam Proses Lupus'
                ? 'bg-purple-700 text-white font-bold ring-1 ring-purple-400'
                : 'bg-purple-50 text-purple-900 border border-purple-300 hover:bg-purple-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            <span>Proses Lupus</span>
            <span className="font-mono text-[10px] font-bold tabular-nums">
              ({statusCounts['Dalam Proses Lupus']})
            </span>
          </button>

          {/* Dilupuskan */}
          <button
            type="button"
            onClick={() => onSelectStatus(selectedStatus === 'Dilupuskan' ? 'SEMUA' : 'Dilupuskan')}
            className={`h-7 px-2.5 rounded text-xs font-medium shrink-0 transition flex items-center space-x-1.5 cursor-pointer ${
              selectedStatus === 'Dilupuskan'
                ? 'bg-slate-700 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="line-through">Dilupuskan</span>
            <span className="font-mono text-[10px] font-bold tabular-nums">
              ({statusCounts.Dilupuskan})
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};
