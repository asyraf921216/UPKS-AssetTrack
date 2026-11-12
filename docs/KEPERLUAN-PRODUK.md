# Dokumen Keperluan Produk (Product Requirements Document)
## UPKS AssetTrack v1.0

Dokumen ini merekodkan keperluan fungsian, peraturan perniagaan (*business rules*), dan kriteria penerimaan bagi sistem **UPKS AssetTrack** berdasarkan dokumen spesifikasi asal **UPKS-AssetTrack-PRD-v1.0**.

---

## 1. Maklumat Asas Projek

* **Nama Produk**: UPKS AssetTrack
* **Versi**: 1.0 (MVP)
* **Organisasi**: Unit Pembangunan Ujian dan Standard (UPKS), Lembaga Getah Malaysia (LGM).
* **Objektif**: Menggantikan pengesanan inventori berasaskan kertas kepada sistem digital pintar kod QR bagi memenuhi standard audit pensijilan makmal ISO/IEC 17025 dan Tatacara Pengurusan Aset Alih Kerajaan (TPA).
* **Rujukan Dokumen Sumber**: Fail PDF asal tersimpan di dalam direktori projek pada `public/assets/aistudio/UPKS-AssetTrack-PRD-v1.0_3ef5480f.pdf`.

---

## 2. Pengguna Sasaran (Target Personas)

1. **Pegawai Makmal / Penyelidik**:
   * Bertanggungjawab menjalankan ujian fizikal dan kimia sampel getah.
   * Keperluan: Imbas kod QR dengan telefon pintar, pinjam alat untuk ujian sementara, rekod pulangan pantas tanpa mengisi borang kertas.
2. **Pegawai Aset Makmal (Admin)**:
   * Bertanggungjawab mengurus pendaftaran, penempatan, semakan stok tahunan, dan pelupusan aset.
   * Keperluan: Jana pelekat QR, urus kes kehilangan aset (KEW.PA-10), cetak senarai bilik (KEW.PA-7), dan urus Perakuan Pelupusan (PEP / KEW.PA-19).
3. **Ketua Unit & Juruaudit**:
   * Memastikan pematuhan tatacara perbendaharaan dan integriti data inventori.

---

## 3. Skop Fungsian MVP (Functional Requirements)

| Kod | Keperluan Fungsian | Penerangan | Status |
| :--- | :--- | :--- | :--- |
| **FR-001** | Pengurusan Data Aset | Tambah, kemaskini, papar, dan padam aset alih bagi 4 kategori makmal. | Selesai Dibina |
| **FR-002** | Pengelasan Kategori Makmal | Sokongan kategori *Instruments*, *Perabot*, *Barangan Komputer*, dan *Peralatan Test Chemical*. | Selesai Dibina |
| **FR-003** | Penjanaan & Cetakan Kod QR | Penjanaan payload kod QR piawai dan paparan cetakan lembaran pelekat makmal. | Selesai Dibina |
| **FR-004** | Pengimbas Kamera QR | Imbasan kod QR terus menggunakan kamera peranti web dengan tindakan pantas kontekstual. | Selesai Dibina |
| **FR-005** | Penjejakan Pinjaman & Lokasi | Rekod perpindahan aset antara bilik makmal dan pemulangan automatik 1-ketukan. | Selesai Dibina |
| **FR-006** | Pengurusan Kehilangan Dua Peringkat | Pelaporan awal kehilangan oleh staf makmal disusuli pengesahan muktamad oleh pentadbir. | Selesai Dibina |
| **FR-007** | Pengurusan Pelupusan (TPA Bab E) | Pendaftaran PEP (`Dalam Proses Lupus`) dan pengesahan fizikal sijil (`Dilupuskan`). | Selesai Dibina |
| **FR-008** | Penjanaan Borang Rasmi PDF | Format jadual Pekeliling Perbendaharaan: KEW.PA-3, KEW.PA-7, KEW.PA-10, KEW.PA-19, KEW.PA-21. | Selesai Dibina |
| **FR-009** | Sokongan Luar Talian (PWA) | Pemasangan aplikasi ke telefon pintar dan caching data luar talian dengan baris giliran simpanan. | Selesai Dibina |

---

## 4. Peraturan Perniagaan (Business Rules)

Sistem ini menguatkuasakan peraturan perniagaan yang ketat mengikut kehendak PRD:

### BR-001: Keunikan No. Siri Pendaftaran (Unique Registration Number)
* Setiap aset mesti mempunyai No. Siri Pendaftaran unik mengikut format KEW.PA (contoh: `KEW.PA-3/UPKS/2024/001`).
* Sistem menolak pendaftaran nombor pendua dan memaparkan mesej ralat khusus.

### BR-002: Sekatan Pinjaman Aset Tidak Aktif (Borrowing Restriction)
* Aset dengan status **`Hilang`**, **`Dalam Siasatan`**, **`Dalam Proses Lupus`**, atau **`Dilupuskan`** disekat sepenuhnya daripada sebarang tindakan pinjaman atau pengeluaran dari makmal.

### BR-003: Aliran Kerja Kehilangan Dua Peringkat (Two-Stage Loss Reporting)
* Apabila kakitangan melaporkan kehilangan aset, status aset serta-merta bertukar kepada **`Dalam Siasatan`**.
* Status hanya boleh dimuktamadkan kepada **`Hilang`** (disahkan hilang) atau dikembalikan kepada **`Aktif`** (jika ditemui) oleh Pentadbir Aset bertauliah.

### BR-004: Pemulangan Automatik ke Lokasi Asal (Return to Base)
* Apabila aset dipulangkan, sistem secara automatik menetapkan semula status aset kepada **`Aktif`** dan mengembalikan nilai lokasi semasa kepada **`defaultLocation`** (lokasi asal aset).

### BR-005: Amaran Keselamatan Bahan Kimia Luput (Chemical Expiry Safety Rule)
* Bagi kategori *Peralatan Test Chemical*, jika tarikh luput mendahului tarikh semasa, modal amaran keselamatan dipaparkan dan transaksi pinjaman disekat bagi melindungi integriti ujian pensijilan UPKS.

### BR-006: Pembekuan Aset Semasa Perakuan Pelupusan (Disposal Freezing)
* Sebaik sahaja borang Perakuan Pelupusan (PEP) didaftarkan, status aset bertukar kepada **`Dalam Proses Lupus`**. Sebarang transaksi pinjaman dibekukan sehingga Sijil Pelupusan KEW.PA-21 diterbitkan.

---

## 5. Ringkasan Aliran Kerja Utama (User Flows)

```
[ Pendaftaran Aset Baru ] ──> [ Jana & Cetak Label QR ] ──> [ Lekat Pada Instrumen ]
                                                                       │
                                                                       ▼
                                                          [ Imbas QR Guna Telefon ]
                                                                       │
                         ┌─────────────────────────────────────────────┴─────────────────────────────────────────────┐
                         ▼                                             ▼                                             ▼
               [ Status: Aktif ]                             [ Status: Dipinjam ]                        [ Status: Siasatan/Lupus ]
                         │                                             │                                             │
             [ Tekan Pinjam Sekarang ]                      [ Sahkan Pulang 1-Tap ]                      [ Sekat Pinjaman & Amaran ]
                         │                                             │
             [ Kemaskini Lokasi Bilik ]                     [ Kembali Ke Lokasi Asal ]
```

---

## 6. Kriteria Penerimaan (Acceptance Criteria)

* **AC-01 (Kamera QR)**: Pengimbasan label kod QR fizikal berjaya dikesan dalam masa kurang daripada 1.5 saat pada peranti mudah alih dengan resolusi kamera standard.
* **AC-02 (Cetakan A4)**: Lembaran pelekat QR memaparkan No. Pendaftaran, Kategori, Nama Aset, dan Kod QR yang jelas dibaca oleh pengimbas.
* **AC-03 (Sekatan Pinjaman)**: Butang pinjaman tidak boleh diklik bagi aset berstatus tidak aktif berserta mesej amaran jelas.
* **AC-04 (Integriti Audit)**: Penjanaan dokumen KEW.PA-7, KEW.PA-3, KEW.PA-10, KEW.PA-19, dan KEW.PA-21 mematuhi format jadual dan ruang tandatangan rasmi perbendaharaan.
* **AC-05 (Kebolehgunaan Luar Talian)**: Aplikasi boleh dimuatkan semasa tiada internet dan rekod yang dibuat disimpan dalam *offline sync queue*.
