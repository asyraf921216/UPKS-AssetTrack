import Papa from 'papaparse';
import { Asset, AssetCategory, AssetStatus } from '../types/asset';
import { isRegistrationNoUnique } from '../services/storage';

export const CSV_TEMPLATE_HEADERS = [
  'No Siri Pendaftaran',
  'Nama Aset',
  'Kategori',
  'Jenama & Model',
  'No Siri Pembuat',
  'Tarikh Perolehan (YYYY-MM-DD)',
  'Harga Perolehan (RM)',
  'Lokasi Penempatan',
  'Pegawai Bertanggungjawab',
  'Status',
  'Tarikh Calibration Seterusnya (Instruments)',
  'Kuantiti & Unit (Chemical)',
  'Tarikh Luput (Chemical)'
];

export const VALID_CATEGORIES: AssetCategory[] = [
  'Instruments',
  'Perabot',
  'Barangan Komputer',
  'Peralatan Test Chemical'
];

export const VALID_STATUSES: AssetStatus[] = [
  'Aktif',
  'Dipinjam',
  'Dalam Siasatan',
  'Hilang',
  'Rosak',
  'Dalam Proses Lupus',
  'Dilupuskan'
];

export interface CSVParseResultRow {
  rowNumber: number;
  data: Partial<Asset>;
  isValid: boolean;
  errors: string[];
}

export function generateCSVTemplateString(): string {
  const sampleRows = [
    [
      'KEW.PA-3/UPKS/2026/INS-099',
      'Digital Ultrasonic Cleaner 10L',
      'Instruments',
      'Elmasonic P120H',
      'ELMA-2026-99',
      '2026-01-10',
      '8500',
      'Makmal Kimia Analisis 1',
      'Nurul Izzah binti Ahmad',
      'Aktif',
      '2027-01-09',
      '',
      ''
    ],
    [
      'KEW.PA-3/UPKS/2026/CHM-055',
      'Hydrochloric Acid 37% ACS Reagent',
      'Peralatan Test Chemical',
      'Sigma-Aldrich ReagentPlus',
      'SIG-HCL-8812',
      '2026-03-05',
      '680',
      'Stor Reagen Kimia',
      'Dr. Halimah binti Sulaiman',
      'Aktif',
      '',
      '2 x 2.5 L',
      '2028-03-04'
    ],
    [
      'KEW.PA-3/UPKS/2026/KOMP-088',
      'Barangan Komputer - Laptop Analisis Data',
      'Barangan Komputer',
      'Dell Latitude 5540 i7 16GB',
      'DELL-LAT-44120',
      '2026-02-14',
      '5400',
      'Bilik Spektrometri & Kromatografi',
      'Farid bin Othman',
      'Aktif',
      '',
      '',
      ''
    ],
    [
      'KEW.PA-3/UPKS/2026/PRB-042',
      'Kabinet Keselamatan Bahan Kimia Mudah Terbakar',
      'Perabot',
      'Justrite Sure-Grip EX 45 Gallon',
      'JST-CAB-0045',
      '2026-01-20',
      '9200',
      'Stor Reagen Kimia',
      'Zainal Abidin bin Kassim',
      'Aktif',
      '',
      '',
      ''
    ]
  ];

  const csv = Papa.unparse({
    fields: CSV_TEMPLATE_HEADERS,
    data: sampleRows
  });

  return '\uFEFF' + csv; // UTF-8 BOM for Excel
}

export function downloadSampleCSVTemplate(): void {
  const csvContent = generateCSVTemplateString();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'UPKS-Templat-Import-Aset.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseAndValidateCSVText(csvText: string): Promise<CSVParseResultRow[]> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        const rows: CSVParseResultRow[] = [];
        const seenRegNumbersInBatch = new Set<string>();

        results.data.forEach((row, index) => {
          const rowNumber = index + 2; // 1-based, header is row 1
          const errors: string[] = [];

          // Map headers flexibly
          const regNo = (
            row['No Siri Pendaftaran'] || 
            row['No. Siri Pendaftaran'] || 
            row['registrationNo'] || 
            ''
          ).trim();

          const name = (
            row['Nama Aset'] || 
            row['name'] || 
            ''
          ).trim();

          const categoryRaw = (
            row['Kategori'] || 
            row['category'] || 
            ''
          ).trim();

          const defaultLocation = (
            row['Lokasi Penempatan'] || 
            row['Lokasi'] || 
            row['defaultLocation'] || 
            ''
          ).trim();

          const custodian = (
            row['Pegawai Bertanggungjawab'] || 
            row['Pegawai'] || 
            row['custodian'] || 
            ''
          ).trim();

          const statusRaw = (
            row['Status'] || 
            row['status'] || 
            'Aktif'
          ).trim();

          const brandModel = (
            row['Jenama & Model'] || 
            row['brandModel'] || 
            ''
          ).trim();

          const serialNo = (
            row['No Siri Pembuat'] || 
            row['No. Siri Pembuat'] || 
            row['serialNo'] || 
            ''
          ).trim();

          const acquisitionDate = (
            row['Tarikh Perolehan (YYYY-MM-DD)'] || 
            row['Tarikh Perolehan'] || 
            row['acquisitionDate'] || 
            ''
          ).trim();

          const acquisitionCostRaw = (
            row['Harga Perolehan (RM)'] || 
            row['Harga Perolehan'] || 
            row['acquisitionCost'] || 
            ''
          ).trim();

          const calibrationDueDate = (
            row['Tarikh Calibration Seterusnya (Instruments)'] || 
            row['Tarikh Calibration Seterusnya'] || 
            row['calibrationDueDate'] || 
            ''
          ).trim();

          const quantityUnit = (
            row['Kuantiti & Unit (Chemical)'] || 
            row['Kuantiti & Unit'] || 
            row['quantityUnit'] || 
            ''
          ).trim();

          const expiryDate = (
            row['Tarikh Luput (Chemical)'] || 
            row['Tarikh Luput'] || 
            row['expiryDate'] || 
            ''
          ).trim();

          // Validation
          if (!regNo) {
            errors.push('No. Siri Pendaftaran wajib diisi.');
          } else {
            const normalized = regNo.toUpperCase();
            if (seenRegNumbersInBatch.has(normalized)) {
              errors.push(`No. Siri Pendaftaran "${regNo}" diduplikasi dalam fail import ini.`);
            } else if (!isRegistrationNoUnique(regNo)) {
              errors.push(`No. Siri Pendaftaran "${regNo}" sudah wujud dalam pangkalan data sistem.`);
            }
            seenRegNumbersInBatch.add(normalized);
          }

          if (!name) {
            errors.push('Nama Aset wajib diisi.');
          }

          const matchedCategory = VALID_CATEGORIES.find(
            c => c.toLowerCase() === categoryRaw.toLowerCase()
          );
          if (!matchedCategory) {
            errors.push(`Kategori "${categoryRaw}" tidak sah. Pilih antara: ${VALID_CATEGORIES.join(', ')}.`);
          }

          if (!defaultLocation) {
            errors.push('Lokasi Penempatan wajib diisi.');
          }

          if (!custodian) {
            errors.push('Pegawai Bertanggungjawab wajib diisi.');
          }

          let matchedStatus: AssetStatus = 'Aktif';
          if (statusRaw) {
            const found = VALID_STATUSES.find(
              s => s.toLowerCase() === statusRaw.toLowerCase()
            );
            if (found) {
              matchedStatus = found;
            } else {
              errors.push(`Status "${statusRaw}" tidak sah.`);
            }
          }

          let acquisitionCost: number | undefined = undefined;
          if (acquisitionCostRaw) {
            const parsed = parseFloat(acquisitionCostRaw.replace(/[^0-9.]/g, ''));
            if (isNaN(parsed) || parsed < 0) {
              errors.push('Harga Perolehan mestilah nombor positif (RM ≥ 0).');
            } else {
              acquisitionCost = parsed;
            }
          }

          const parsedAsset: Partial<Asset> = {
            registrationNo: regNo,
            name,
            category: matchedCategory || 'Instruments',
            brandModel: brandModel || undefined,
            serialNo: serialNo || undefined,
            acquisitionDate: acquisitionDate || undefined,
            acquisitionCost,
            defaultLocation,
            currentLocation: defaultLocation,
            custodian,
            status: matchedStatus,
            calibrationDueDate: calibrationDueDate || undefined,
            quantityUnit: quantityUnit || undefined,
            expiryDate: expiryDate || undefined
          };

          rows.push({
            rowNumber,
            data: parsedAsset,
            isValid: errors.length === 0,
            errors
          });
        });

        resolve(rows);
      }
    });
  });
}

export function exportAssetsToCSV(assets: Asset[], filenameSuffix: string = 'Laporan'): void {
  const exportRows = assets.map(a => [
    a.registrationNo,
    a.name,
    a.category,
    a.brandModel || '',
    a.serialNo || '',
    a.acquisitionDate || '',
    a.acquisitionCost !== undefined ? a.acquisitionCost.toFixed(2) : '',
    a.defaultLocation,
    a.currentLocation,
    a.custodian,
    a.status,
    a.calibrationDueDate || '',
    a.quantityUnit || '',
    a.expiryDate || '',
    new Date(a.createdAt).toLocaleDateString('ms-MY')
  ]);

  const headers = [
    'No Siri Pendaftaran KEW.PA',
    'Nama Aset',
    'Kategori',
    'Jenama & Model',
    'No Siri Pembuat (Serial No)',
    'Tarikh Perolehan',
    'Harga Perolehan (RM)',
    'Lokasi Asal',
    'Lokasi Semasa',
    'Pegawai Bertanggungjawab',
    'Status Semasa',
    'Tarikh Calibration Seterusnya',
    'Kuantiti & Unit',
    'Tarikh Luput',
    'Tarikh Didaftarkan'
  ];

  const csv = Papa.unparse({
    fields: headers,
    data: exportRows
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const filename = `UPKS-AssetTrack-${filenameSuffix}-${todayStr}.csv`;

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
