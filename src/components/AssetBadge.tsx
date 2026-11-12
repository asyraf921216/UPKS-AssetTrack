import React from 'react';
import { AssetStatus, AssetCategory } from '../types/asset';
import { Microscope, Armchair, Laptop, FlaskConical } from 'lucide-react';

interface StatusBadgeProps {
  status: AssetStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  switch (status) {
    case 'Aktif':
      return (
        <span className={`inline-flex items-center font-medium rounded border bg-emerald-50 text-emerald-800 border-emerald-300 ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 shrink-0" />
          Aktif
        </span>
      );
    case 'Dipinjam':
      return (
        <span className={`inline-flex items-center font-medium rounded border bg-sky-50 text-sky-900 border-sky-300 ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mr-1.5 shrink-0" />
          Dipinjam
        </span>
      );
    case 'Dalam Siasatan':
      return (
        <span className={`inline-flex items-center font-bold rounded border bg-amber-50 text-amber-950 border-amber-400 ${sizeClasses[size]}`}>
          <span className="w-2 h-2 rounded-full bg-amber-600 mr-1.5 shrink-0 animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5 shrink-0 -ml-3" />
          Dalam Siasatan
        </span>
      );
    case 'Hilang':
      return (
        <span className={`inline-flex items-center font-bold rounded border bg-rose-50 text-rose-900 border-rose-300 ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5 shrink-0" />
          Hilang
        </span>
      );
    case 'Rosak':
      return (
        <span className={`inline-flex items-center font-medium rounded border bg-slate-100 text-slate-800 border-slate-300 ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5 shrink-0" />
          Rosak
        </span>
      );
    case 'Dalam Proses Lupus':
      return (
        <span className={`inline-flex items-center font-bold rounded border bg-purple-50 text-purple-900 border-purple-300 ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-1.5 shrink-0" />
          Dalam Proses Lupus
        </span>
      );
    case 'Dilupuskan':
      return (
        <span className={`inline-flex items-center font-medium rounded border bg-slate-100 text-slate-600 border-slate-300 ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5 shrink-0" />
          <span className="line-through">Dilupuskan</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded border bg-slate-100 text-slate-700 border-slate-300 ${sizeClasses[size]}`}>
          {status}
        </span>
      );
  }
};

interface CategoryBadgeProps {
  category: AssetCategory;
  showIcon?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, showIcon = true }) => {
  let icon = <Microscope className="w-3.5 h-3.5 mr-1 shrink-0 text-slate-500" />;
  let borderClass = 'border-slate-200 bg-slate-50 text-slate-800';

  if (category === 'Instruments') {
    icon = <Microscope className="w-3.5 h-3.5 mr-1 shrink-0 text-indigo-600" />;
    borderClass = 'border-indigo-200/80 bg-indigo-50/60 text-indigo-900';
  } else if (category === 'Perabot') {
    icon = <Armchair className="w-3.5 h-3.5 mr-1 shrink-0 text-emerald-600" />;
    borderClass = 'border-emerald-200/80 bg-emerald-50/60 text-emerald-900';
  } else if (category === 'Barangan Komputer') {
    icon = <Laptop className="w-3.5 h-3.5 mr-1 shrink-0 text-blue-600" />;
    borderClass = 'border-blue-200/80 bg-blue-50/60 text-blue-900';
  } else if (category === 'Peralatan Test Chemical') {
    icon = <FlaskConical className="w-3.5 h-3.5 mr-1 shrink-0 text-teal-600" />;
    borderClass = 'border-teal-200/80 bg-teal-50/60 text-teal-900';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${borderClass}`}>
      {showIcon && icon}
      {category}
    </span>
  );
};
