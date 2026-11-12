import { Asset, MovementLog, LossReport } from '../types/asset';

export const INITIAL_LOCATIONS = [
  'Makmal Kimia Analisis 1',
  'Makmal Ujian Kimia 2',
  'Makmal Standard Fizikal',
  'Bilik Timbangan & Instrumen',
  'Bilik Spektrometri & Kromatografi',
  'Stor Reagen Kimia',
  'Pejabat Pentadbiran UPKS'
];

export const SEED_ASSETS: Asset[] = [
  {
    id: 'upks-asset-001',
    registrationNo: 'KEW.PA-3/UPKS/2023/INS-001',
    name: 'Gas Chromatography-Mass Spectrometer (GC-MS)',
    category: 'Instruments',
    brandModel: 'Agilent 8890 / 5977B',
    serialNo: 'GCMS-MY-230981',
    acquisitionDate: '2023-04-15',
    acquisitionCost: 485000,
    defaultLocation: 'Bilik Spektrometri & Kromatografi',
    currentLocation: 'Bilik Spektrometri & Kromatografi',
    custodian: 'Ts. Mohd Asyraf bin Zulkifli',
    status: 'Aktif',
    calibrationDueDate: '2027-04-14',
    createdAt: '2023-04-15T08:30:00Z',
    updatedAt: '2026-10-10T11:00:00Z'
  },
  {
    id: 'upks-asset-002',
    registrationNo: 'KEW.PA-3/UPKS/2023/INS-004',
    name: 'High Precision Analytical Balance 0.0001g',
    category: 'Instruments',
    brandModel: 'Mettler Toledo XSR205DU',
    serialNo: 'MT-BAL-882190',
    acquisitionDate: '2023-06-10',
    acquisitionCost: 28500,
    defaultLocation: 'Bilik Timbangan & Instrumen',
    currentLocation: 'Makmal Ujian Kimia 2',
    custodian: 'Nur Hidayah binti Razak',
    status: 'Dipinjam',
    calibrationDueDate: '2027-06-09',
    createdAt: '2023-06-10T09:15:00Z',
    updatedAt: '2026-11-01T14:20:00Z'
  },
  {
    id: 'upks-asset-003',
    registrationNo: 'KEW.PA-3/UPKS/2024/INS-011',
    name: 'Benchtop Digital pH / Conductivity Meter',
    category: 'Instruments',
    brandModel: 'Thermo Scientific Orion Star A215',
    serialNo: 'PHM-TS-77123',
    acquisitionDate: '2024-02-18',
    acquisitionCost: 14200,
    defaultLocation: 'Makmal Kimia Analisis 1',
    currentLocation: 'Makmal Kimia Analisis 1',
    custodian: 'Khairul Anwar bin Basir',
    status: 'Dalam Siasatan',
    calibrationDueDate: '2026-12-15',
    createdAt: '2024-02-18T10:00:00Z',
    updatedAt: '2026-11-10T16:45:00Z'
  },
  {
    id: 'upks-asset-004',
    registrationNo: 'KEW.PA-3/UPKS/2023/PRB-008',
    name: 'Chemical Resistant Heavy-Duty Lab Island Bench',
    category: 'Perabot',
    brandModel: 'Kewaunee Supreme Epoxy Top',
    serialNo: 'KWN-BENCH-4412',
    acquisitionDate: '2023-02-05',
    acquisitionCost: 32000,
    defaultLocation: 'Makmal Kimia Analisis 1',
    currentLocation: 'Makmal Kimia Analisis 1',
    custodian: 'Zainal Abidin bin Kassim',
    status: 'Aktif',
    createdAt: '2023-02-05T08:00:00Z',
    updatedAt: '2023-02-05T08:00:00Z'
  },
  {
    id: 'upks-asset-005',
    registrationNo: 'KEW.PA-3/UPKS/2024/PRB-023',
    name: 'Ergonomic ESD Anti-Static Lab Chair',
    category: 'Perabot',
    brandModel: 'Bimos Neon ESD Lab',
    serialNo: 'BMS-ESD-9901',
    acquisitionDate: '2024-01-20',
    acquisitionCost: 2450,
    defaultLocation: 'Bilik Spektrometri & Kromatografi',
    currentLocation: 'Bilik Spektrometri & Kromatografi',
    custodian: 'Ts. Mohd Asyraf bin Zulkifli',
    status: 'Aktif',
    createdAt: '2024-01-20T11:30:00Z',
    updatedAt: '2024-01-20T11:30:00Z'
  },
  {
    id: 'upks-asset-006',
    registrationNo: 'KEW.PA-3/UPKS/2023/KOMP-015',
    name: 'HP Z2 Mini G9 Workstation PC (Lab Instrument Controller)',
    category: 'Barangan Komputer',
    brandModel: 'HP Z2 Mini G9 / Intel Core i7 / 32GB RAM / 1TB SSD',
    serialNo: 'HP-CZC3491KLP',
    acquisitionDate: '2023-04-15',
    acquisitionCost: 11800,
    defaultLocation: 'Bilik Spektrometri & Kromatografi',
    currentLocation: 'Bilik Spektrometri & Kromatografi',
    custodian: 'Farid bin Othman',
    status: 'Aktif',
    createdAt: '2023-04-15T09:00:00Z',
    updatedAt: '2023-04-15T09:00:00Z'
  },
  {
    id: 'upks-asset-007',
    registrationNo: 'KEW.PA-3/UPKS/2024/KOMP-032',
    name: 'Industrial QR / Barcode Thermal Transfer Label Printer',
    category: 'Barangan Komputer',
    brandModel: 'Zebra ZD621t 300dpi',
    serialNo: 'ZBR-ZD62-66710',
    acquisitionDate: '2024-03-01',
    acquisitionCost: 4950,
    defaultLocation: 'Pejabat Pentadbiran UPKS',
    currentLocation: 'Pejabat Pentadbiran UPKS',
    custodian: 'Nur Hidayah binti Razak',
    status: 'Aktif',
    createdAt: '2024-03-01T14:00:00Z',
    updatedAt: '2024-03-01T14:00:00Z'
  },
  {
    id: 'upks-asset-008',
    registrationNo: 'KEW.PA-3/UPKS/2022/KOMP-005',
    name: 'Field Rugged Tablet PC 10-inch for On-Site Inspection',
    category: 'Barangan Komputer',
    brandModel: 'Panasonic Toughbook G2',
    serialNo: 'TB-G2-550123',
    acquisitionDate: '2022-11-12',
    acquisitionCost: 15600,
    defaultLocation: 'Pejabat Pentadbiran UPKS',
    currentLocation: 'Stor Reagen Kimia',
    custodian: 'Khairul Anwar bin Basir',
    status: 'Hilang',
    createdAt: '2022-11-12T10:00:00Z',
    updatedAt: '2026-10-05T09:30:00Z'
  },
  {
    id: 'upks-asset-009',
    registrationNo: 'KEW.PA-3/UPKS/2024/CHM-007',
    name: 'Sulfuric Acid 98% AR Grade Reagent Bottle Set',
    category: 'Peralatan Test Chemical',
    brandModel: 'Merck EMSURE ISO Grade',
    serialNo: 'CHM-SA98-B892',
    acquisitionDate: '2024-05-10',
    acquisitionCost: 1850,
    defaultLocation: 'Stor Reagen Kimia',
    currentLocation: 'Stor Reagen Kimia',
    custodian: 'Dr. Halimah binti Sulaiman',
    status: 'Aktif',
    quantityUnit: '4 x 2.5 L Glass Bottles',
    expiryDate: '2027-05-09',
    createdAt: '2024-05-10T13:40:00Z',
    updatedAt: '2024-05-10T13:40:00Z'
  },
  {
    id: 'upks-asset-010',
    registrationNo: 'KEW.PA-3/UPKS/2024/CHM-018',
    name: 'Karl Fischer Volumetric Titration Solvent & Reagent Kit',
    category: 'Peralatan Test Chemical',
    brandModel: 'Honeywell Hydranal-Composite 5',
    serialNo: 'KF-HYD-1104',
    acquisitionDate: '2024-08-22',
    acquisitionCost: 3200,
    defaultLocation: 'Makmal Ujian Kimia 2',
    currentLocation: 'Makmal Ujian Kimia 2',
    custodian: 'Dr. Halimah binti Sulaiman',
    status: 'Aktif',
    quantityUnit: '6 x 1 L Bottles',
    expiryDate: '2027-08-20',
    createdAt: '2024-08-22T09:30:00Z',
    updatedAt: '2024-08-22T09:30:00Z'
  },
  {
    id: 'upks-asset-011',
    registrationNo: 'KEW.PA-3/UPKS/2023/CHM-002',
    name: 'Nitric Acid 65% AR Grade (Sampel Ujian Keselamatan Luput)',
    category: 'Peralatan Test Chemical',
    brandModel: 'Sigma-Aldrich TraceSELECT',
    serialNo: 'CHM-NA65-EXP',
    acquisitionDate: '2023-01-10',
    acquisitionCost: 1450,
    defaultLocation: 'Stor Reagen Kimia',
    currentLocation: 'Stor Reagen Kimia',
    custodian: 'Dr. Halimah binti Sulaiman',
    status: 'Aktif',
    quantityUnit: '2 x 2.5 L Glass Bottles',
    expiryDate: '2024-05-15', // Past date: Expired!
    createdAt: '2023-01-10T10:00:00Z',
    updatedAt: '2024-05-15T12:00:00Z'
  },
  {
    id: 'upks-asset-012',
    registrationNo: 'KEW.PA-3/UPKS/2021/INS-008',
    name: 'High-Speed Laboratory Benchtop Centrifuge 15,000 RPM',
    category: 'Instruments',
    brandModel: 'Eppendorf 5424R Refrigerated',
    serialNo: 'EPP-CENT-5424-99',
    acquisitionDate: '2021-03-12',
    acquisitionCost: 38000,
    defaultLocation: 'Makmal Kimia Analisis 1',
    currentLocation: 'Makmal Kimia Analisis 1',
    custodian: 'Khairul Anwar bin Basir',
    status: 'Dalam Proses Lupus',
    calibrationDueDate: '2024-03-11',
    createdAt: '2021-03-12T08:00:00Z',
    updatedAt: '2026-11-02T10:15:00Z'
  },
  {
    id: 'upks-asset-013',
    registrationNo: 'KEW.PA-3/UPKS/2019/KOMP-001',
    name: 'Dell OptiPlex 7050 Tower (Komputer Arkib Ujian Lama)',
    category: 'Barangan Komputer',
    brandModel: 'Dell OptiPlex 7050 i5 8GB RAM',
    serialNo: 'DELL-OPT-7050-MY',
    acquisitionDate: '2019-07-15',
    acquisitionCost: 4600,
    defaultLocation: 'Pejabat Pentadbiran UPKS',
    currentLocation: 'Stor Pelupusan UPKS',
    custodian: 'Farid bin Othman',
    status: 'Dilupuskan',
    createdAt: '2019-07-15T09:00:00Z',
    updatedAt: '2026-09-30T16:00:00Z'
  }
];

export const SEED_DISPOSAL_RECORDS: import('../types/asset').DisposalRecord[] = [
  {
    id: 'disp-001',
    assetId: 'upks-asset-012', // Centrifuge
    pepNo: 'PEP/UPKS/2026/003',
    reason: 'Kerosakan motor pemutar dalaman dan papan litar utama. Anggaran kos baiki melebihi 70% nilai semasa (Tidak Ekonomi Dibaiki mengikut TPA Bab E).',
    proposedMethod: 'E-Waste (Sisa Elektronik)',
    initiatedBy: 'Khairul Anwar bin Basir',
    initiatedDate: '2026-11-02',
    status: 'Dalam Proses',
    notes: 'Perakuan Pelupusan (PEP) telah ditandatangani oleh jurutera mekanikal UPKS. Menunggu kelulusan Lembaga Pelupusan.',
    createdAt: '2026-11-02T10:15:00Z'
  },
  {
    id: 'disp-002',
    assetId: 'upks-asset-013', // Dell OptiPlex
    pepNo: 'PEP/UPKS/2026/001',
    reason: 'Usang dan tidak menyokong sistem operasi terkini makmal serta sistem rangkaian keselamatan LGM.',
    proposedMethod: 'E-Waste (Sisa Elektronik)',
    actualMethod: 'E-Waste (Sisa Elektronik)',
    initiatedBy: 'Farid bin Othman',
    initiatedDate: '2026-08-15',
    status: 'Selesai Dilupuskan',
    approvedBy: 'Ts. Mohd Asyraf bin Zulkifli (Pegawai Aset UPKS)',
    completedDate: '2026-09-30',
    certificateNo: 'SIJIL-LUPUS/UPKS/2026/001',
    notes: 'Diserahkan kepada kontraktor berlesen E-Waste Jabatan Alam Sekitar (DOE). Resit dan Sijil Pelupusan KEW.PA-21 telah difailkan.',
    createdAt: '2026-08-15T09:00:00Z'
  }
];

export const SEED_MOVEMENT_LOGS: MovementLog[] = [
  {
    id: 'mv-001',
    assetId: 'upks-asset-002', // Analytical balance
    borrowerName: 'Siti Sarah binti Idris',
    fromLocation: 'Bilik Timbangan & Instrumen',
    toLocation: 'Makmal Ujian Kimia 2',
    borrowedDate: '2026-11-01',
    expectedReturnDate: '2026-11-15',
    notes: 'Dipinjam untuk penyediaan sampel uji standard getah Siri 4',
    isActive: true
  },
  {
    id: 'mv-002',
    assetId: 'upks-asset-003', // pH Meter
    borrowerName: 'Wan Ahmad bin Wan Yaacob',
    fromLocation: 'Makmal Kimia Analisis 1',
    toLocation: 'Makmal Ujian Kimia 2',
    borrowedDate: '2026-10-15',
    expectedReturnDate: '2026-10-20',
    returnedDate: '2026-10-20',
    notes: 'Ujian larutan buffer selesai',
    isActive: false
  }
];

export const SEED_LOSS_REPORTS: LossReport[] = [
  {
    id: 'loss-001',
    assetId: 'upks-asset-003', // pH Meter
    reportedBy: 'Muhammad Fauzi bin Yusof (Pegawai Penyelidik)',
    lastSeenDate: '2026-11-08',
    lastKnownLocation: 'Makmal Kimia Analisis 1 (Meja Ujian 3)',
    description: 'Unit pH Meter tidak ditemui di rak simpanan biasa selepas waktu makmal petang Jumaat. Semakan log pinjaman fizikal tidak menunjukkan catatan nama peminjam.',
    reportStatus: 'Dalam Siasatan',
    createdAt: '2026-11-10T16:45:00Z'
  },
  {
    id: 'loss-002',
    assetId: 'upks-asset-008', // Rugged Tablet
    reportedBy: 'Khairul Anwar bin Basir',
    lastSeenDate: '2026-09-28',
    lastKnownLocation: 'Stor Reagen Kimia',
    description: 'Tablet periksa lapangan tidak dapat dikesan semasa persediaan audit dalaman suku tahunan.',
    reportStatus: 'Disahkan Hilang',
    verifiedByAdminAt: '2026-10-05T09:30:00Z',
    adminNotes: 'Siasatan fizikal dan semakan CCTV selama 7 hari tidak menemui tablet. Disahkan hilang untuk laporan KEW.PA-10 ke peringkat jawatankuasa.',
    createdAt: '2026-09-29T08:15:00Z'
  }
];
