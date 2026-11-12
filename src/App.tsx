import React, { useState, useEffect, useMemo } from 'react';
import { 
  Asset, 
  MovementLog, 
  LossReport, 
  DisposalRecord,
  UserRole, 
  FilterState, 
  AssetCategory, 
  AssetStatus 
} from './types/asset';
import { 
  getStoredAssets, 
  getStoredMovements, 
  getStoredLossReports, 
  getStoredDisposals,
  getStoredLocations, 
  subscribeToStore, 
  resetAllDataToDefault,
  returnAssetAction
} from './services/storage';

import { filterAssetsFuzzy, getRecentlyViewedIds, recordRecentlyViewed, getPinnedAssetIds, togglePinnedAsset } from './utils/fuzzySearch';
import { isChemicalExpired } from './utils/chemicalExpiry';
import { useOnlineStatus, addOfflineSyncItem } from './hooks/useOnlineStatus';

import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { InvestigationAlertBanner } from './components/InvestigationAlertBanner';
import { AssetFilters } from './components/AssetFilters';
import { AssetList } from './components/AssetList';
import { AssetDetailModal } from './components/AssetDetailModal';
import { PinModal } from './components/PinModal';
import { AssetFormModal } from './components/AssetFormModal';
import { BorrowModal, ReturnModal } from './components/BorrowReturnModals';
import { LossReportModal, AdminLossResolutionModal } from './components/LossModals';
import { QRScannerModal } from './components/QRScannerModal';
import { QRPrintSheetModal } from './components/QRPrintSheetModal';
import { ImportExportModal } from './components/ImportExportModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { KewPaFormsModal } from './components/KewPaFormsModal';
import { ChemicalExpiryModal } from './components/ChemicalExpiryModal';
import { InitiateDisposalModal, CompleteDisposalModal } from './components/DisposalModals';

import { 
  CheckCircle2, 
  Printer, 
  RotateCcw, 
  Plus, 
  Building2, 
  QrCode, 
  ShieldCheck,
  WifiOff,
  FileText
} from 'lucide-react';

export default function App() {
  // Core application state
  const [role, setRole] = useState<UserRole>('staff');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [movementLogs, setMovementLogs] = useState<MovementLog[]>([]);
  const [lossReports, setLossReports] = useState<LossReport[]>([]);
  const [disposalRecords, setDisposalRecords] = useState<DisposalRecord[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Recently viewed & pinned assets
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'SEMUA',
    status: 'SEMUA',
    location: 'SEMUA'
  });

  // Modals state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [assetForEdit, setAssetForEdit] = useState<Asset | null>(null);
  const [assetForDelete, setAssetForDelete] = useState<Asset | null>(null);
  const [assetForBorrow, setAssetForBorrow] = useState<Asset | null>(null);
  const [assetForReturn, setAssetForReturn] = useState<Asset | null>(null);
  const [assetForLossReport, setAssetForLossReport] = useState<Asset | null>(null);
  const [lossReportForResolution, setLossReportForResolution] = useState<LossReport | null>(null);
  const [assetForInitiateDisposal, setAssetForInitiateDisposal] = useState<Asset | null>(null);
  const [disposalForComplete, setDisposalForComplete] = useState<{ disposal: DisposalRecord; asset: Asset } | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isKewPaFormsOpen, setIsKewPaFormsOpen] = useState(false);
  const [expiredAssetWarning, setExpiredAssetWarning] = useState<Asset | null>(null);
  
  // Print & Selection state
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);
  const [selectedAssetIdsForPrint, setSelectedAssetIdsForPrint] = useState<string[]>([]);
  const [showPrintCheckboxes, setShowPrintCheckboxes] = useState(false);
  const [singleAssetToPrint, setSingleAssetToPrint] = useState<Asset | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // PWA Offline status & background sync handler
  const { isOnline, pendingSyncCount } = useOnlineStatus((syncedCount) => {
    showToast(`${syncedCount} tindakan luar talian telah diselaraskan ke pangkalan data!`, 'success');
    reloadFromStore();
  });

  // Sync state with storage
  const reloadFromStore = () => {
    const loadedAssets = getStoredAssets();
    setAssets(loadedAssets);
    setMovementLogs(getStoredMovements());
    setLossReports(getStoredLossReports());
    setDisposalRecords(getStoredDisposals());
    setLocations(getStoredLocations());
    setRecentIds(getRecentlyViewedIds());
    setPinnedIds(getPinnedAssetIds());

    // Update selectedAssetForDetail if open
    setSelectedAssetForDetail(prev => {
      if (!prev) return null;
      return loadedAssets.find(a => a.id === prev.id) || null;
    });
  };

  useEffect(() => {
    reloadFromStore();
    const unsubscribe = subscribeToStore(() => {
      reloadFromStore();
    });
    return () => unsubscribe();
  }, []);

  // Filtered Assets Computation with Fuzzy Matching
  const filteredAssets = useMemo(() => {
    let result = assets;

    // 1. Category filter
    if (filters.category !== 'SEMUA') {
      result = result.filter(a => a.category === filters.category);
    }

    // 2. Status filter
    if (filters.status !== 'SEMUA') {
      result = result.filter(a => a.status === filters.status);
    }

    // 3. Location filter
    if (filters.location !== 'SEMUA') {
      result = result.filter(a => a.currentLocation === filters.location);
    }

    // 4. Fuzzy search match (1-2 character tolerance)
    if (filters.searchQuery.trim()) {
      result = filterAssetsFuzzy(result, filters.searchQuery);
    }

    return result;
  }, [assets, filters]);

  // Assets in investigation for alert banner
  const assetsInInvestigation = useMemo(() => {
    return assets.filter(a => a.status === 'Dalam Siasatan');
  }, [assets]);

  // Recently viewed assets list
  const recentlyViewedAssets = useMemo(() => {
    return recentIds
      .map(id => assets.find(a => a.id === id))
      .filter((a): a is Asset => Boolean(a));
  }, [assets, recentIds]);

  // Pinned assets list
  const pinnedAssets = useMemo(() => {
    return pinnedIds
      .map(id => assets.find(a => a.id === id))
      .filter((a): a is Asset => Boolean(a));
  }, [assets, pinnedIds]);

  // Handle viewing asset details & record to recent history
  const handleSelectAssetForDetail = (asset: Asset) => {
    recordRecentlyViewed(asset.id);
    setRecentIds(getRecentlyViewedIds());

    // Check chemical expiry safety business rule
    if (isChemicalExpired(asset)) {
      setExpiredAssetWarning(asset);
    }

    setSelectedAssetForDetail(asset);
  };

  // Handlers for filter controls
  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'SEMUA',
      status: 'SEMUA',
      location: 'SEMUA'
    });
  };

  const handleCategorySelect = (cat: AssetCategory | 'SEMUA') => {
    setFilters(prev => ({
      ...prev,
      category: cat
    }));
  };

  const handleStatusSelect = (stat: AssetStatus | 'SEMUA') => {
    setFilters(prev => ({
      ...prev,
      status: stat
    }));
  };

  // Toggle print selection
  const handleToggleSelectForPrint = (id: string) => {
    setSelectedAssetIdsForPrint(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Express 1-Tap Return Action from Scanner
  const handleExpressReturn = (asset: Asset) => {
    if (!isOnline) {
      addOfflineSyncItem({
        type: 'return',
        assetId: asset.id,
        payload: { returnedDate: new Date().toISOString().split('T')[0] }
      });
      showToast(`Tindakan disimpan luar talian (Diselaraskan apabila ada talian).`, 'info');
    } else {
      returnAssetAction(asset.id, new Date().toISOString().split('T')[0]);
      showToast(`Aset ${asset.registrationNo} telah berjaya dipulangkan ke lokasi asal (Aktif)!`, 'success');
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Adakah anda pasti mahu mengeset semula data kepada inventori sampel asal UPKS?')) {
      resetAllDataToDefault();
      handleResetFilters();
      showToast('Pangkalan data telah diset semula kepada data sampel UPKS.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 antialiased font-sans">
      
      {/* 1. Global Navigation Bar with PWA Install & Offline Awareness */}
      <Navbar
        role={role}
        isOnline={isOnline}
        onRoleChange={(newRole) => {
          setRole(newRole);
          showToast(`Beralih kepada ${newRole === 'admin' ? 'Mod Admin' : 'Mod Staf'}.`, 'info');
        }}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAddAsset={() => {
          setAssetForEdit(null);
          setIsAddAssetOpen(true);
        }}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onOpenPrintSheet={() => {
          setSingleAssetToPrint(null);
          setIsPrintSheetOpen(true);
        }}
        onOpenKewPaForms={() => setIsKewPaFormsOpen(true)}
      />

      {/* Offline Alert Ribbon (When Device is Disconnected) */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 font-semibold px-4 py-1.5 text-xs text-center flex items-center justify-center space-x-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>
            <strong>Mod Luar Talian (Offline Resilience):</strong> Aplikasi menggunakan data simpanan cache peranti. Sebarang rekod pinjaman/pemulangan disimpan dalam giliran tempatan ({pendingSyncCount} giliran) dan akan diselaraskan secara automatik apabila menerima sambungan semula.
          </span>
        </div>
      )}

      {/* 2. Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-3.5">
        
        {/* Sleek Operational Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                Pangkalan Data & Pengesanan Aset UPKS
              </h1>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                Piawaian KEW.PA
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Unit Pembangunan Ujian & Standard • Pengesanan pantas QR, tindakan kontekstual, dan penjanaan borang rasmi kerajaan.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-stretch sm:self-auto flex-wrap gap-y-1">
            <button
              onClick={() => setIsScannerOpen(true)}
              type="button"
              className="flex-1 sm:flex-none h-8 px-3 rounded bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-2xs transition flex items-center justify-center cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 mr-1.5" />
              <span>Imbas Kamera QR</span>
            </button>

            <button
              onClick={() => setIsKewPaFormsOpen(true)}
              type="button"
              className="flex-1 sm:flex-none h-8 px-3 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs transition flex items-center justify-center cursor-pointer border border-slate-700"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              <span>Borang Rasmi PDF</span>
            </button>

            {role === 'admin' ? (
              <button
                onClick={() => {
                  setAssetForEdit(null);
                  setIsAddAssetOpen(true);
                }}
                type="button"
                className="flex-1 sm:flex-none h-8 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-teal-400" />
                <span>Tambah Aset</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPinModalOpen(true)}
                type="button"
                className="flex-1 sm:flex-none h-8 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs transition flex items-center justify-center cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-600" />
                <span>Akses Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Investigation Alert Banner (Shown when any asset is 'Dalam Siasatan') */}
        <InvestigationAlertBanner
          assetsInInvestigation={assetsInInvestigation}
          role={role}
          onSelectAsset={handleSelectAssetForDetail}
          onOpenPinModal={() => setIsPinModalOpen(true)}
        />

        {/* 3. High-Density Category & Status Telemetry Bar */}
        <DashboardStats
          assets={assets}
          selectedCategory={filters.category}
          selectedStatus={filters.status}
          onSelectCategory={handleCategorySelect}
          onSelectStatus={handleStatusSelect}
        />

        {/* 4. Unified Operational Filter & Fuzzy Search Toolbar with Recently Viewed Chips */}
        <AssetFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          locations={locations}
          totalMatches={filteredAssets.length}
          recentlyViewedAssets={recentlyViewedAssets}
          pinnedAssets={pinnedAssets}
          onSelectRecentAsset={handleSelectAssetForDetail}
        />

        {/* Batch Print Controls (Visible when Admin toggles batch mode) */}
        {role === 'admin' && (
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 shadow-2xs">
            <button
              type="button"
              onClick={() => setShowPrintCheckboxes(!showPrintCheckboxes)}
              className="font-medium text-teal-800 hover:underline flex items-center cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-teal-600" />
              {showPrintCheckboxes ? 'Sembunyikan Pilihan Cetakan Pukal' : 'Pilih Berbilang Aset untuk Cetakan Label Pelekat QR'}
            </button>

            {showPrintCheckboxes && selectedAssetIdsForPrint.length > 0 && (
              <button
                onClick={() => {
                  setSingleAssetToPrint(null);
                  setIsPrintSheetOpen(true);
                }}
                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded font-semibold flex items-center shadow-2xs cursor-pointer"
              >
                <Printer className="w-3 h-3 mr-1" />
                Cetak {selectedAssetIdsForPrint.length} Label Dipilih
              </button>
            )}
          </div>
        )}

        {/* 5. Authoritative Ledger List / Table View */}
        <AssetList
          assets={filteredAssets}
          role={role}
          onSelectAsset={handleSelectAssetForDetail}
          onOpenQR={(asset) => {
            setSingleAssetToPrint(asset);
            setIsPrintSheetOpen(true);
          }}
          onBorrow={(asset) => {
            if (isChemicalExpired(asset)) {
              setExpiredAssetWarning(asset);
            } else {
              setAssetForBorrow(asset);
            }
          }}
          onReturn={(asset) => setAssetForReturn(asset)}
          onReportLoss={(asset) => setAssetForLossReport(asset)}
          onEdit={(asset) => {
            setAssetForEdit(asset);
            setIsAddAssetOpen(true);
          }}
          onDelete={(asset) => setAssetForDelete(asset)}
          onResetFilters={handleResetFilters}
          selectedAssetIdsForPrint={selectedAssetIdsForPrint}
          onToggleSelectForPrint={handleToggleSelectForPrint}
          showPrintCheckboxes={showPrintCheckboxes}
        />
      </main>

      {/* 6. Professional Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 mt-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              <strong>UPKS AssetTrack PWA</strong> • Unit Pembangunan Ujian & Standard, Lembaga Getah Malaysia (LGM).
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-500 text-[11px]">
              Sesi: <strong className="text-slate-300 uppercase font-mono">{role}</strong>
            </span>
            <button
              onClick={handleResetDemoData}
              className="text-slate-400 hover:text-teal-400 underline transition cursor-pointer flex items-center text-[11px]"
              title="Set semula data storan tempatan kepada sampel permulaan UPKS"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Set Semula Sampel
            </button>
          </div>
        </div>
      </footer>

      {/* 7. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-lg shadow-xl text-xs font-medium border ${
            toastMessage.type === 'success' 
              ? 'bg-[#0B192C] text-emerald-300 border-emerald-500/30'
              : toastMessage.type === 'error'
              ? 'bg-[#0B192C] text-rose-300 border-rose-500/30'
              : 'bg-[#0B192C] text-slate-100 border-slate-700'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* 8. Modals Registry */}
      
      {/* Admin PIN Authentication Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setRole('admin');
          showToast('Akses Mod Pentadbir berjaya diaktifkan.', 'success');
        }}
      />

      {/* Camera QR Scanner Modal with Contextual Quick Actions */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        assets={assets}
        onAssetFound={(matchedAsset) => {
          handleSelectAssetForDetail(matchedAsset);
          showToast(`Aset ditemui: ${matchedAsset.registrationNo}`, 'success');
        }}
        onQuickBorrow={(asset) => {
          if (isChemicalExpired(asset)) {
            setExpiredAssetWarning(asset);
          } else {
            setAssetForBorrow(asset);
          }
        }}
        onQuickReturn={handleExpressReturn}
      />

      {/* Chemical Expiry Safety Warning Modal */}
      <ChemicalExpiryModal
        asset={expiredAssetWarning}
        isOpen={Boolean(expiredAssetWarning)}
        onClose={() => setExpiredAssetWarning(null)}
        onProceedAnyway={() => {
          setExpiredAssetWarning(null);
        }}
      />

      {/* Asset Detail Drawer / Modal */}
      <AssetDetailModal
        asset={selectedAssetForDetail}
        onClose={() => setSelectedAssetForDetail(null)}
        role={role}
        movementLogs={movementLogs}
        lossReports={lossReports}
        disposalRecords={disposalRecords}
        onOpenBorrow={(a) => {
          if (isChemicalExpired(a)) {
            setExpiredAssetWarning(a);
          } else {
            setAssetForBorrow(a);
          }
        }}
        onOpenReturn={(a) => {
          setAssetForReturn(a);
        }}
        onOpenReportLoss={(a) => {
          setAssetForLossReport(a);
        }}
        onOpenVerifyLoss={(report) => {
          setLossReportForResolution(report);
        }}
        onOpenInitiateDisposal={(a) => {
          setAssetForInitiateDisposal(a);
        }}
        onOpenCompleteDisposal={(disp, a) => {
          setDisposalForComplete({ disposal: disp, asset: a });
        }}
        onOpenEdit={(a) => {
          setSelectedAssetForDetail(null);
          setAssetForEdit(a);
          setIsAddAssetOpen(true);
        }}
        onOpenDelete={(a) => {
          setSelectedAssetForDetail(null);
          setAssetForDelete(a);
        }}
        onOpenSinglePrint={(a) => {
          setSingleAssetToPrint(a);
          setIsPrintSheetOpen(true);
        }}
      />

      {/* Official Government Forms PDF Generator (KEW.PA-3, KEW.PA-7, KEW.PA-10, KEW.PA-19, KEW.PA-21) */}
      <KewPaFormsModal
        isOpen={isKewPaFormsOpen}
        onClose={() => setIsKewPaFormsOpen(false)}
        assets={assets}
        locations={locations}
        lossReports={lossReports}
        disposalRecords={disposalRecords}
        targetAsset={selectedAssetForDetail}
      />

      {/* Add / Edit Asset Form Modal */}
      <AssetFormModal
        assetToEdit={assetForEdit}
        isOpen={isAddAssetOpen}
        onClose={() => {
          setIsAddAssetOpen(false);
          setAssetForEdit(null);
        }}
        locations={locations}
        onSuccess={(savedAsset) => {
          showToast(`Aset "${savedAsset.registrationNo}" berjaya ${assetForEdit ? 'dikemaskini' : 'didaftarkan'}.`, 'success');
        }}
      />

      {/* Borrow / Relocation Modal */}
      <BorrowModal
        asset={assetForBorrow}
        isOpen={Boolean(assetForBorrow)}
        onClose={() => setAssetForBorrow(null)}
        locations={locations}
        onSuccess={() => {
          showToast('Pinjaman / pemindahan aset berjaya direkodkan.', 'success');
        }}
      />

      {/* Return Asset Modal */}
      <ReturnModal
        asset={assetForReturn}
        isOpen={Boolean(assetForReturn)}
        onClose={() => setAssetForReturn(null)}
        onSuccess={() => {
          showToast('Aset telah berjaya dikembalikan ke lokasi asal dan status Aktif.', 'success');
        }}
      />

      {/* Report Loss Modal */}
      <LossReportModal
        asset={assetForLossReport}
        isOpen={Boolean(assetForLossReport)}
        onClose={() => setAssetForLossReport(null)}
        onSuccess={() => {
          showToast('Laporan kehilangan telah dimajukan. Status aset kini Dalam Siasatan.', 'info');
        }}
      />

      {/* Admin Loss Resolution Modal */}
      <AdminLossResolutionModal
        report={lossReportForResolution}
        asset={selectedAssetForDetail}
        isOpen={Boolean(lossReportForResolution)}
        onClose={() => setLossReportForResolution(null)}
        onSuccess={() => {
          showToast('Tindakan rasmi terhadap laporan kehilangan telah disahkan.', 'success');
          setLossReportForResolution(null);
        }}
      />

      {/* Printable QR Code Sheet Modal */}
      <QRPrintSheetModal
        isOpen={isPrintSheetOpen}
        onClose={() => {
          setIsPrintSheetOpen(false);
          setSingleAssetToPrint(null);
        }}
        allAssets={assets}
        initialSelectedAssetIds={
          singleAssetToPrint 
            ? [singleAssetToPrint.id] 
            : selectedAssetIdsForPrint.length > 0 
            ? selectedAssetIdsForPrint 
            : undefined
        }
      />

      {/* Bulk CSV / Excel Import & Audit Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImportComplete={() => {
          showToast('Rekod inventori pukal berjaya diimport.', 'success');
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        asset={assetForDelete}
        isOpen={Boolean(assetForDelete)}
        onClose={() => setAssetForDelete(null)}
        onSuccess={() => {
          showToast('Rekod aset telah dipadam secara kekal.', 'info');
        }}
      />

      {/* Initiate Disposal (PEP) Modal */}
      <InitiateDisposalModal
        asset={assetForInitiateDisposal}
        isOpen={Boolean(assetForInitiateDisposal)}
        onClose={() => setAssetForInitiateDisposal(null)}
        onSuccess={() => {
          showToast('Perakuan Pelupusan (PEP) telah didaftarkan. Status aset kini Dalam Proses Lupus.', 'info');
          setAssetForInitiateDisposal(null);
        }}
      />

      {/* Complete Disposal (KEW.PA-21) Modal */}
      <CompleteDisposalModal
        disposalRecord={disposalForComplete?.disposal || null}
        asset={disposalForComplete?.asset || null}
        isOpen={Boolean(disposalForComplete)}
        onClose={() => setDisposalForComplete(null)}
        onSuccess={() => {
          showToast('Pelupusan aset telah disahkan selesai. Sijil KEW.PA-21 telah diterbitkan.', 'success');
          setDisposalForComplete(null);
        }}
      />

    </div>
  );
}
