import { Asset, MovementLog, LossReport, AssetStatus, DisposalRecord, DisposalMethod } from '../types/asset';
import { SEED_ASSETS, SEED_MOVEMENT_LOGS, SEED_LOSS_REPORTS, SEED_DISPOSAL_RECORDS, INITIAL_LOCATIONS } from '../data/seedData';

const ASSETS_KEY = 'upks_assettrack_assets_v1';
const MOVEMENTS_KEY = 'upks_assettrack_movements_v1';
const LOSS_REPORTS_KEY = 'upks_assettrack_loss_reports_v1';
const DISPOSALS_KEY = 'upks_assettrack_disposals_v1';
const LOCATIONS_KEY = 'upks_assettrack_locations_v1';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeToStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach(l => {
    try {
      l();
    } catch (e) {
      console.error('Error notifying store listener', e);
    }
  });
}

export function getStoredAssets(): Asset[] {
  try {
    const raw = localStorage.getItem(ASSETS_KEY);
    if (!raw) {
      localStorage.setItem(ASSETS_KEY, JSON.stringify(SEED_ASSETS));
      return SEED_ASSETS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse assets from storage, using seed data', err);
    return SEED_ASSETS;
  }
}

export function saveAssets(assets: Asset[]): void {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  notifyListeners();
}

export function getStoredMovements(): MovementLog[] {
  try {
    const raw = localStorage.getItem(MOVEMENTS_KEY);
    if (!raw) {
      localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(SEED_MOVEMENT_LOGS));
      return SEED_MOVEMENT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_MOVEMENT_LOGS;
  }
}

export function saveMovements(logs: MovementLog[]): void {
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(logs));
  notifyListeners();
}

export function getStoredLossReports(): LossReport[] {
  try {
    const raw = localStorage.getItem(LOSS_REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(LOSS_REPORTS_KEY, JSON.stringify(SEED_LOSS_REPORTS));
      return SEED_LOSS_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_LOSS_REPORTS;
  }
}

export function saveLossReports(reports: LossReport[]): void {
  localStorage.setItem(LOSS_REPORTS_KEY, JSON.stringify(reports));
  notifyListeners();
}

export function getStoredDisposals(): DisposalRecord[] {
  try {
    const raw = localStorage.getItem(DISPOSALS_KEY);
    if (!raw) {
      localStorage.setItem(DISPOSALS_KEY, JSON.stringify(SEED_DISPOSAL_RECORDS));
      return SEED_DISPOSAL_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_DISPOSAL_RECORDS;
  }
}

export function saveDisposals(records: DisposalRecord[]): void {
  localStorage.setItem(DISPOSALS_KEY, JSON.stringify(records));
  notifyListeners();
}

export function getStoredLocations(): string[] {
  try {
    const raw = localStorage.getItem(LOCATIONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCATIONS_KEY, JSON.stringify(INITIAL_LOCATIONS));
      return INITIAL_LOCATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOCATIONS;
  }
}

export function addStoredLocation(newLocation: string): void {
  const trimmed = newLocation.trim();
  if (!trimmed) return;
  const current = getStoredLocations();
  if (!current.includes(trimmed)) {
    const updated = [...current, trimmed];
    localStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
    notifyListeners();
  }
}

// Check uniqueness of registrationNo (BR-001)
export function isRegistrationNoUnique(registrationNo: string, excludeAssetId?: string): boolean {
  const assets = getStoredAssets();
  const normalized = registrationNo.trim().toUpperCase();
  return !assets.some(
    a => a.registrationNo.trim().toUpperCase() === normalized && a.id !== excludeAssetId
  );
}

export function addAssetRecord(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): { success: boolean; error?: string; asset?: Asset } {
  if (!isRegistrationNoUnique(asset.registrationNo)) {
    return {
      success: false,
      error: `No. Siri Pendaftaran "${asset.registrationNo}" sudah wujud dalam sistem UPKS. Sila gunakan nombor unik.`
    };
  }

  const newAsset: Asset = {
    ...asset,
    id: `upks-asset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const assets = [newAsset, ...getStoredAssets()];
  saveAssets(assets);
  addStoredLocation(asset.defaultLocation);
  addStoredLocation(asset.currentLocation);

  return { success: true, asset: newAsset };
}

export function updateAssetRecord(id: string, updates: Partial<Asset>): { success: boolean; error?: string; asset?: Asset } {
  const assets = getStoredAssets();
  const index = assets.findIndex(a => a.id === id);
  if (index === -1) {
    return { success: false, error: 'Aset tidak dijumpai.' };
  }

  if (updates.registrationNo && !isRegistrationNoUnique(updates.registrationNo, id)) {
    return {
      success: false,
      error: `No. Siri Pendaftaran "${updates.registrationNo}" sudah digunakan oleh aset lain.`
    };
  }

  const updatedAsset: Asset = {
    ...assets[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  assets[index] = updatedAsset;
  saveAssets(assets);

  if (updatedAsset.defaultLocation) addStoredLocation(updatedAsset.defaultLocation);
  if (updatedAsset.currentLocation) addStoredLocation(updatedAsset.currentLocation);

  return { success: true, asset: updatedAsset };
}

export function deleteAssetRecord(id: string): { success: boolean; error?: string } {
  const assets = getStoredAssets();
  const remaining = assets.filter(a => a.id !== id);
  if (remaining.length === assets.length) {
    return { success: false, error: 'Aset tidak ditemui untuk dipadam.' };
  }
  saveAssets(remaining);
  return { success: true };
}

// BR-002: Sekatan Pinjaman Aset Tidak Aktif
// Asset with status Hilang, Dalam Siasatan, Dilupuskan, Dalam Proses Lupus cannot be borrowed.
export function canBorrowAsset(asset: Asset): { allowed: boolean; reason?: string } {
  if (asset.status === 'Hilang') {
    return { allowed: false, reason: 'Aset berstatus HILANG tidak boleh dipinjam sehingga disahkan ditemui.' };
  }
  if (asset.status === 'Dalam Siasatan') {
    return { allowed: false, reason: 'Aset sedang DALAM SIASATAN kehilangan dan tidak boleh dipinjam.' };
  }
  if (asset.status === 'Dalam Proses Lupus') {
    return { allowed: false, reason: 'Aset sedang DALAM PROSES PELUPUSAN (PEP) dan tidak dibenarkan dipinjam atau dikeluarkan dari makmal.' };
  }
  if (asset.status === 'Dilupuskan') {
    return { allowed: false, reason: 'Aset telah DILUPUSKAN daripada rekod perkhidmatan kerajaan.' };
  }
  if (asset.status === 'Dipinjam') {
    return { allowed: false, reason: 'Aset ini sedang dipinjam oleh kakitangan lain. Sila rekod pemulangan terlebih dahulu.' };
  }
  return { allowed: true };
}

export function borrowAssetAction(
  assetId: string,
  borrowerName: string,
  toLocation: string,
  borrowedDate: string,
  expectedReturnDate?: string,
  notes?: string
): { success: boolean; error?: string } {
  const assets = getStoredAssets();
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return { success: false, error: 'Aset tidak ditemui.' };

  const check = canBorrowAsset(asset);
  if (!check.allowed) return { success: false, error: check.reason };

  const newLog: MovementLog = {
    id: `mv-${Date.now()}`,
    assetId,
    borrowerName: borrowerName.trim(),
    fromLocation: asset.currentLocation,
    toLocation: toLocation.trim(),
    borrowedDate,
    expectedReturnDate,
    notes: notes?.trim() || undefined,
    isActive: true
  };

  const movements = [newLog, ...getStoredMovements()];
  saveMovements(movements);

  updateAssetRecord(assetId, {
    status: 'Dipinjam',
    currentLocation: toLocation.trim()
  });

  addStoredLocation(toLocation.trim());
  return { success: true };
}

// BR-004: Pemulangan Aset Dipinjam mengembalikan status kepada Aktif & lokasi kepada defaultLocation
export function returnAssetAction(assetId: string, returnedDate: string = new Date().toISOString().split('T')[0]): { success: boolean; error?: string } {
  const assets = getStoredAssets();
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return { success: false, error: 'Aset tidak ditemui.' };

  const movements = getStoredMovements();
  let updatedMovements = false;
  const updatedLogs = movements.map(m => {
    if (m.assetId === assetId && m.isActive) {
      updatedMovements = true;
      return {
        ...m,
        isActive: false,
        returnedDate
      };
    }
    return m;
  });

  if (updatedMovements) {
    saveMovements(updatedLogs);
  }

  updateAssetRecord(assetId, {
    status: 'Aktif',
    currentLocation: asset.defaultLocation
  });

  return { success: true };
}

// BR-003: Pengesahan Dua Peringkat Aset Hilang
// Staff submits -> status becomes 'Dalam Siasatan'
export function reportLossAction(
  assetId: string,
  reportedBy: string,
  lastSeenDate: string,
  lastKnownLocation: string,
  description: string
): { success: boolean; error?: string; report?: LossReport } {
  const assets = getStoredAssets();
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return { success: false, error: 'Aset tidak ditemui.' };

  if (asset.status === 'Dilupuskan') {
    return { success: false, error: 'Aset telah dilupuskan dan tidak lagi berada dalam senarai pegangan aset aktif.' };
  }

  const report: LossReport = {
    id: `loss-${Date.now()}`,
    assetId,
    reportedBy: reportedBy.trim(),
    lastSeenDate,
    lastKnownLocation: lastKnownLocation.trim(),
    description: description.trim(),
    reportStatus: 'Dalam Siasatan',
    createdAt: new Date().toISOString()
  };

  const reports = [report, ...getStoredLossReports()];
  saveLossReports(reports);

  updateAssetRecord(assetId, {
    status: 'Dalam Siasatan'
  });

  return { success: true, report };
}

// Admin confirms missing (Hilang) or marks found (Ditemui -> Aktif)
export function verifyLossAction(
  reportId: string,
  decision: 'confirm_lost' | 'mark_found',
  adminNotes?: string
): { success: boolean; error?: string } {
  const reports = getStoredLossReports();
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) return { success: false, error: 'Rekod laporan kehilangan tidak ditemui.' };

  const report = reports[reportIndex];
  const newReportStatus = decision === 'confirm_lost' ? 'Disahkan Hilang' : 'Ditemui';
  const newAssetStatus: AssetStatus = decision === 'confirm_lost' ? 'Hilang' : 'Aktif';

  reports[reportIndex] = {
    ...report,
    reportStatus: newReportStatus,
    verifiedByAdminAt: new Date().toISOString(),
    adminNotes: adminNotes?.trim() || undefined
  };

  saveLossReports(reports);

  updateAssetRecord(report.assetId, {
    status: newAssetStatus
  });

  return { success: true };
}

// ==========================================
// PENGURUSAN PELUPUSAN ASET (TPA BAB E)
// ==========================================

// 1. Memulakan Perakuan Pelupusan (PEP) -> Status: Dalam Proses Lupus
export function initiateDisposalAction(
  assetId: string,
  pepNo: string,
  reason: string,
  proposedMethod: DisposalMethod,
  initiatedBy: string,
  notes?: string
): { success: boolean; error?: string; record?: DisposalRecord } {
  const assets = getStoredAssets();
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return { success: false, error: 'Aset tidak ditemui.' };

  if (asset.status === 'Dipinjam') {
    return { success: false, error: 'Aset sedang dipinjam. Sila rekod pemulangan terlebih dahulu sebelum memulakan pelupusan.' };
  }
  if (asset.status === 'Dalam Siasatan' || asset.status === 'Hilang') {
    return { success: false, error: 'Aset yang dalam siasatan atau hilang tidak boleh dilupuskan sehingga selesai prosiding hapuskira.' };
  }
  if (asset.status === 'Dilupuskan') {
    return { success: false, error: 'Aset ini sudah pun selesai dilupuskan.' };
  }

  const newRecord: DisposalRecord = {
    id: `disp-${Date.now()}`,
    assetId,
    pepNo: pepNo.trim(),
    reason: reason.trim(),
    proposedMethod,
    initiatedBy: initiatedBy.trim(),
    initiatedDate: new Date().toISOString().split('T')[0],
    status: 'Dalam Proses',
    notes: notes?.trim() || undefined,
    createdAt: new Date().toISOString()
  };

  const records = [newRecord, ...getStoredDisposals()];
  saveDisposals(records);

  updateAssetRecord(assetId, {
    status: 'Dalam Proses Lupus'
  });

  return { success: true, record: newRecord };
}

// 2. Mengesahkan Selesai Pelupusan (Sijil Pelupusan KEW.PA-21) -> Status: Dilupuskan
export function completeDisposalAction(
  disposalId: string,
  actualMethod: DisposalMethod,
  certificateNo: string,
  approvedBy: string,
  notes?: string
): { success: boolean; error?: string } {
  const disposals = getStoredDisposals();
  const index = disposals.findIndex(d => d.id === disposalId);
  if (index === -1) return { success: false, error: 'Rekod pelupusan tidak ditemui.' };

  const disposal = disposals[index];
  const completedDate = new Date().toISOString().split('T')[0];

  disposals[index] = {
    ...disposal,
    actualMethod,
    certificateNo: certificateNo.trim(),
    approvedBy: approvedBy.trim(),
    completedDate,
    status: 'Selesai Dilupuskan',
    notes: notes?.trim() ? `${disposal.notes ? disposal.notes + ' | ' : ''}${notes.trim()}` : disposal.notes
  };

  saveDisposals(disposals);

  updateAssetRecord(disposal.assetId, {
    status: 'Dilupuskan'
  });

  return { success: true };
}

// 3. Batalkan Proses Pelupusan -> Kembalikan kepada status asal (Aktif / Rosak)
export function cancelDisposalAction(
  disposalId: string,
  revertStatus: 'Aktif' | 'Rosak' = 'Aktif'
): { success: boolean; error?: string } {
  const disposals = getStoredDisposals();
  const index = disposals.findIndex(d => d.id === disposalId);
  if (index === -1) return { success: false, error: 'Rekod pelupusan tidak ditemui.' };

  const disposal = disposals[index];
  disposals[index] = {
    ...disposal,
    status: 'Dibatalkan'
  };

  saveDisposals(disposals);

  updateAssetRecord(disposal.assetId, {
    status: revertStatus
  });

  return { success: true };
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(SEED_ASSETS));
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(SEED_MOVEMENT_LOGS));
  localStorage.setItem(LOSS_REPORTS_KEY, JSON.stringify(SEED_LOSS_REPORTS));
  localStorage.setItem(DISPOSALS_KEY, JSON.stringify(SEED_DISPOSAL_RECORDS));
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(INITIAL_LOCATIONS));
  notifyListeners();
}
