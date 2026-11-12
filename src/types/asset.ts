export type AssetCategory = 
  | 'Instruments'
  | 'Perabot'
  | 'Barangan Komputer'
  | 'Peralatan Test Chemical';

export type AssetStatus = 
  | 'Aktif'
  | 'Dipinjam'
  | 'Dalam Siasatan'
  | 'Hilang'
  | 'Rosak'
  | 'Dalam Proses Lupus'
  | 'Dilupuskan';

export type DisposalMethod = 
  | 'Buangan Terjadual / Sisa Toksik'
  | 'E-Waste (Sisa Elektronik)'
  | 'Musnah / Tanam'
  | 'Jualan Sisa / Tender'
  | 'Pindahan Jabatan / Hadiah';

export interface DisposalRecord {
  id: string;
  assetId: string;
  pepNo: string; // No. Perakuan Pelupusan (PEP) e.g. PEP/UPKS/2026/001
  reason: string; // Sebab pelupusan: Rosak Tidak Ekonomi Dibaiki, Usang, Luput
  proposedMethod: DisposalMethod;
  actualMethod?: DisposalMethod;
  initiatedBy: string;
  initiatedDate: string; // YYYY-MM-DD
  status: 'Dalam Proses' | 'Selesai Dilupuskan' | 'Dibatalkan';
  approvedBy?: string;
  completedDate?: string; // YYYY-MM-DD
  certificateNo?: string; // No. Sijil Pelupusan KEW.PA-21
  notes?: string;
  createdAt: string;
}

export interface MovementLog {
  id: string;
  assetId: string;
  borrowerName: string;
  fromLocation: string;
  toLocation: string;
  borrowedDate: string; // YYYY-MM-DD
  expectedReturnDate?: string;
  returnedDate?: string;
  notes?: string;
  isActive: boolean; // true if currently out
}

export type LossReportStatus = 'Dalam Siasatan' | 'Disahkan Hilang' | 'Ditemui';

export interface LossReport {
  id: string;
  assetId: string;
  reportedBy: string;
  lastSeenDate: string; // YYYY-MM-DD
  lastKnownLocation: string;
  description: string;
  reportStatus: LossReportStatus;
  verifiedByAdminAt?: string; // ISO string
  adminNotes?: string;
  createdAt: string; // ISO string
}

export interface Asset {
  id: string;
  registrationNo: string; // Unique KEW.PA Registration Number, e.g. KEW.PA-3/UPKS/2024/001
  name: string;
  category: AssetCategory;
  brandModel?: string;
  serialNo?: string;
  acquisitionDate?: string; // YYYY-MM-DD
  acquisitionCost?: number; // RM
  defaultLocation: string;
  currentLocation: string;
  custodian: string; // Pegawai Bertanggungjawab
  status: AssetStatus;
  
  // Specific to 'Instruments'
  calibrationDueDate?: string; // YYYY-MM-DD
  
  // Specific to 'Peralatan Test Chemical'
  quantityUnit?: string; // e.g. "500 mL", "2.5 L", "1 kg"
  expiryDate?: string; // YYYY-MM-DD
  
  // Visual Asset Photography
  imageUrl?: string;
  
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'staff' | 'admin';

export interface FilterState {
  searchQuery: string;
  category: AssetCategory | 'SEMUA';
  status: AssetStatus | 'SEMUA';
  location: string | 'SEMUA';
}
