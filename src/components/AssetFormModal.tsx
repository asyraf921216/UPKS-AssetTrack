import React, { useState, useEffect } from 'react';
import { Asset, AssetCategory, AssetStatus } from '../types/asset';
import { addAssetRecord, updateAssetRecord } from '../services/storage';
import { VALID_CATEGORIES, VALID_STATUSES } from '../utils/csvHelper';
import { getCategoryImageUrl } from '../utils/categoryImages';
import { Plus, Edit3, X, AlertCircle, CheckCircle2, Calendar, DollarSign, MapPin, User, FileText, Image as ImageIcon } from 'lucide-react';

interface AssetFormModalProps {
  assetToEdit: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  locations: string[];
  onSuccess: (savedAsset: Asset) => void;
}

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  assetToEdit,
  isOpen,
  onClose,
  locations,
  onSuccess,
}) => {
  const isEditing = Boolean(assetToEdit);

  const [registrationNo, setRegistrationNo] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Instruments');
  const [brandModel, setBrandModel] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [defaultLocation, setDefaultLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [custodian, setCustodian] = useState('');
  const [status, setStatus] = useState<AssetStatus>('Aktif');
  const [imageUrl, setImageUrl] = useState('');

  // Category specific fields
  const [calibrationDueDate, setCalibrationDueDate] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    if (assetToEdit) {
      setRegistrationNo(assetToEdit.registrationNo);
      setName(assetToEdit.name);
      setCategory(assetToEdit.category);
      setBrandModel(assetToEdit.brandModel || '');
      setSerialNo(assetToEdit.serialNo || '');
      setAcquisitionDate(assetToEdit.acquisitionDate || '');
      setAcquisitionCost(assetToEdit.acquisitionCost !== undefined ? String(assetToEdit.acquisitionCost) : '');
      setDefaultLocation(assetToEdit.defaultLocation);
      setUseCustomLocation(false);
      setCustodian(assetToEdit.custodian);
      setStatus(assetToEdit.status);
      setImageUrl(assetToEdit.imageUrl || '');
      setCalibrationDueDate(assetToEdit.calibrationDueDate || '');
      setQuantityUnit(assetToEdit.quantityUnit || '');
      setExpiryDate(assetToEdit.expiryDate || '');
      setError('');
    } else {
      // New asset defaults
      const randomSeq = Math.floor(100 + Math.random() * 900);
      setRegistrationNo(`KEW.PA-3/UPKS/2026/INS-${randomSeq}`);
      setName('');
      setCategory('Instruments');
      setBrandModel('');
      setSerialNo('');
      setAcquisitionDate(new Date().toISOString().split('T')[0]);
      setAcquisitionCost('');
      setDefaultLocation(locations[0] || 'Makmal Kimia Analisis 1');
      setUseCustomLocation(false);
      setCustodian('Ts. Mohd Asyraf bin Zulkifli');
      setStatus('Aktif');
      setImageUrl('');
      setCalibrationDueDate('');
      setQuantityUnit('');
      setExpiryDate('');
      setError('');
    }
  }, [assetToEdit, isOpen, locations]);

  if (!isOpen) return null;

  const currentCategoryImg = getCategoryImageUrl(category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationNo.trim()) {
      setError('No. Siri Pendaftaran KEW.PA wajib diisi.');
      return;
    }
    if (!name.trim()) {
      setError('Nama Aset wajib diisi.');
      return;
    }

    const finalLocation = useCustomLocation ? customLocation.trim() : defaultLocation;
    if (!finalLocation) {
      setError('Lokasi Penempatan wajib diisi.');
      return;
    }
    if (!custodian.trim()) {
      setError('Pegawai Bertanggungjawab wajib diisi.');
      return;
    }

    let parsedCost: number | undefined = undefined;
    if (acquisitionCost.trim()) {
      const num = parseFloat(acquisitionCost);
      if (isNaN(num) || num < 0) {
        setError('Harga Perolehan mestilah nombor positif (RM ≥ 0).');
        return;
      }
      parsedCost = num;
    }

    if (isEditing && assetToEdit) {
      const res = updateAssetRecord(assetToEdit.id, {
        registrationNo: registrationNo.trim(),
        name: name.trim(),
        category,
        brandModel: brandModel.trim() || undefined,
        serialNo: serialNo.trim() || undefined,
        acquisitionDate: acquisitionDate || undefined,
        acquisitionCost: parsedCost,
        defaultLocation: finalLocation,
        currentLocation: assetToEdit.currentLocation === assetToEdit.defaultLocation ? finalLocation : assetToEdit.currentLocation,
        custodian: custodian.trim(),
        status,
        imageUrl: imageUrl.trim() || undefined,
        calibrationDueDate: category === 'Instruments' && calibrationDueDate ? calibrationDueDate : undefined,
        quantityUnit: category === 'Peralatan Test Chemical' && quantityUnit ? quantityUnit.trim() : undefined,
        expiryDate: category === 'Peralatan Test Chemical' && expiryDate ? expiryDate : undefined
      });

      if (res.success && res.asset) {
        onSuccess(res.asset);
        onClose();
      } else {
        setError(res.error || 'Gagal mengemas kini aset.');
      }
    } else {
      const res = addAssetRecord({
        registrationNo: registrationNo.trim(),
        name: name.trim(),
        category,
        brandModel: brandModel.trim() || undefined,
        serialNo: serialNo.trim() || undefined,
        acquisitionDate: acquisitionDate || undefined,
        acquisitionCost: parsedCost,
        defaultLocation: finalLocation,
        currentLocation: finalLocation,
        custodian: custodian.trim(),
        status,
        imageUrl: imageUrl.trim() || undefined,
        calibrationDueDate: category === 'Instruments' && calibrationDueDate ? calibrationDueDate : undefined,
        quantityUnit: category === 'Peralatan Test Chemical' && quantityUnit ? quantityUnit.trim() : undefined,
        expiryDate: category === 'Peralatan Test Chemical' && expiryDate ? expiryDate : undefined
      });

      if (res.success && res.asset) {
        onSuccess(res.asset);
        onClose();
      } else {
        setError(res.error || 'Gagal mendaftar aset baharu.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
            {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {isEditing ? 'Kemaskini Rekod Aset KEW.PA' : 'Pendaftaran Aset Baharu UPKS'}
            </h3>
            <p className="text-xs text-slate-500">
              Mod Pentadbiran Aset • Unit Pembangunan Ujian & Standard
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center space-x-2 text-rose-700 text-xs bg-rose-50 border border-rose-200 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs sm:text-sm">
          
          {/* Section: Asas KEW.PA */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1" />
              Maklumat Asas KEW.PA
            </h4>

            {/* Visual Category Photo Preview Banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-2xs">
                <img
                  src={imageUrl || currentCategoryImg}
                  alt={category}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 flex items-center">
                  <ImageIcon className="w-3.5 h-3.5 mr-1 text-teal-600" />
                  Gambar Pengecaman Visual Kategori
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Foto rujukan bagi kategori <strong className="text-teal-700">{category}</strong> akan dipaparkan secara automatik pada kad aset & butiran untuk memudahkan semakan staf di makmal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  No. Siri Pendaftaran Aset <span className="text-rose-500">* (Mesti Unik)</span>
                </label>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => {
                    setError('');
                    setRegistrationNo(e.target.value);
                  }}
                  placeholder="cth: KEW.PA-3/UPKS/2026/INS-015"
                  className="w-full px-3 py-2 bg-slate-50 font-mono text-xs font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kategori Aset <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AssetCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium"
                >
                  {VALID_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Nama Penuh Aset <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setError('');
                  setName(e.target.value);
                }}
                placeholder="cth: Gas Chromatography-Mass Spectrometer (GC-MS)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Jenama & Model
                </label>
                <input
                  type="text"
                  value={brandModel}
                  onChange={(e) => setBrandModel(e.target.value)}
                  placeholder="cth: Agilent 8890 / 5977B"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  No. Siri Pembuat (Serial No.)
                </label>
                <input
                  type="text"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  placeholder="cth: GCMS-MY-230981"
                  className="w-full px-3 py-2 bg-slate-50 font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section: Lokasi & Penempatan */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              Lokasi & Pegawai Bertanggungjawab
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">
                    Lokasi Penempatan Asal <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomLocation(!useCustomLocation)}
                    className="text-xs text-teal-700 hover:underline"
                  >
                    {useCustomLocation ? 'Pilih Senarai' : '+ Lokasi Baru'}
                  </button>
                </div>
                {useCustomLocation ? (
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Nama bilik / makmal baharu..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                ) : (
                  <select
                    value={defaultLocation}
                    onChange={(e) => setDefaultLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Pegawai Bertanggungjawab (Custodian) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={custodian}
                  onChange={(e) => setCustodian(e.target.value)}
                  placeholder="Nama pegawai yang memegang amanah aset..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Status Operasi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AssetStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                >
                  {VALID_STATUSES.map(stat => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tarikh Perolehan
                </label>
                <input
                  type="date"
                  value={acquisitionDate}
                  onChange={(e) => setAcquisitionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Harga Perolehan (RM)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={acquisitionCost}
                  onChange={(e) => setAcquisitionCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-50 font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section: Dynamic Category Specific Fields */}
          {category === 'Instruments' && (
            <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 space-y-2">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                Medan Khusus: Instruments (Piawaian ISO 17025)
              </h4>
              <div>
                <label className="block text-indigo-950 font-semibold mb-1 text-xs">
                  Tarikh Calibration Seterusnya
                </label>
                <input
                  type="date"
                  value={calibrationDueDate}
                  onChange={(e) => setCalibrationDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 text-xs"
                />
                <p className="text-[11px] text-indigo-800/80 mt-1">
                  Tarikh ini penting untuk pemantauan jadual penyelenggaraan dan audit makmal.
                </p>
              </div>
            </div>
          )}

          {category === 'Peralatan Test Chemical' && (
            <div className="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200 space-y-2">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center">
                🧪 Medan Khusus: Peralatan Test Chemical
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-teal-950 font-semibold mb-1 text-xs">
                    Kuantiti & Unit Pembungkusan
                  </label>
                  <input
                    type="text"
                    value={quantityUnit}
                    onChange={(e) => setQuantityUnit(e.target.value)}
                    placeholder="cth: 4 x 2.5 L Glass Bottles"
                    className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-teal-950 font-semibold mb-1 text-xs">
                    Tarikh Luput Reagen
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex space-x-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 transition shadow-sm flex items-center justify-center cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {isEditing ? 'Simpan Perubahan' : 'Daftar Aset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
