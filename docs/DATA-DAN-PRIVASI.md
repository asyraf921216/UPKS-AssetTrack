# Dasar Data & Privasi (Data & Privacy Notice)
## UPKS AssetTrack

Dokumen ini menjelaskan secara telus jenis data yang diproses oleh aplikasi, lokasi penyimpanan data, dan kawalan privasi berdasarkan pelaksanaan kod perisian semasa.

---

## 1. Data yang Dikumpulkan & Diproses

Aplikasi ini hanya memproses data yang berkaitan dengan operasi inventori makmal UPKS:

1. **Maklumat Aset Alih**:
   * No. Siri Pendaftaran KEW.PA (cth: `KEW.PA-3/UPKS/2024/001`).
   * Nama instrumen/perabot, kategori, jenama, model, dan nombor siri pengilang.
   * Lokasi penempatan asal dan lokasi semasa di dalam bangunan makmal.
   * Nama Pegawai Bertanggungjawab (penjaga aset).
   * Harga perolehan asal (RM) dan tarikh perolehan.
   * Tarikh luput kalibrasi (bagi instrumen) atau kuantiti dan tarikh luput bahan kimia (bagi reagen).
2. **Log Transaksi Pinjaman & Pergerakan**:
   * Nama kakitangan peminjam, bilik destinasi, tarikh pinjam, dan tarikh jangka pulang.
3. **Rekod Laporan Kehilangan**:
   * Nama kakitangan pelapor, tarikh kali terakhir aset dilihat, lokasi kejadian, kronologi, dan catatan siasatan pentadbir.
4. **Rekod Pelupusan Aset (PEP & Sijil KEW.PA-21)**:
   * No. Perakuan Pelupusan, justifikasi pelupusan, kaedah pelupusan, nama pegawai pemeriksa, No. Sijil Pelupusan, dan nombor resit kontraktor.

---

## 2. Di Mana Data Disimpan?

Berdasarkan seni bina MVP semasa:

* **Storan Tempatan Pelayar (*Browser LocalStorage*)**:
  Semua rekod inventori, pergerakan, laporan kehilangan, dan pelupusan disimpan secara tempatan di dalam storan peranti pengguna menggunakan kunci simpanan pelayar (`localStorage`):
  * `upks_assettrack_assets_v1`
  * `upks_assettrack_movements_v1`
  * `upks_assettrack_loss_reports_v1`
  * `upks_assettrack_disposals_v1`
  * `upks_assettrack_locations_v1`
* **Data Luar Talian (*Offline Storage*)**:
  Semasa ketiadaan sambungan internet, sebarang tindakan pinjaman atau pulangan disimpan sementara dalam baris giliran tempatan (`upks_offline_sync_queue`) di peranti yang sama sehingga sambungan dipulihkan.

---

## 3. Adakah Data Dihantar kepada Model AI atau Pihak Ketiga?

* **Tiada Penghantaran Data ke Model AI**:
  Operasi asas inventori, carian kabur (*fuzzy search*), penjejakan pinjaman, pengiraan kalibrasi, dan penjanaan borang KEW.PA dijalankan sepenuhnya di dalam peranti pelayar anda tanpa menghantar data rekod aset kepada model AI luar.
* **Privasi Pengimbas Kamera**:
  Pustaka kamera kod QR (`html5-qrcode`) memproses bingkai video (*video frames*) secara masa nyata di dalam memori peranti pengguna semata-mata untuk mengesan teks kod QR. Tiada rakaman video atau foto yang disimpan atau dimuat naik ke mana-mana pelayan internet.
* **Tiada Pelayan Penjejak Pihak Ketiga (*Third-Party Trackers*)**:
  Aplikasi ini tidak memasang kuki pengiklanan, telemetri komersial, atau penjejak pihak ketiga.

---

## 4. Kawalan Capaian & Keselamatan Semasa

* **Mod Kakitangan (Staff)**: Boleh melihat data dan merekod pergerakan biasa.
* **Mod Pentadbir (Admin)**: Memerlukan nombor PIN (`1234`) untuk menyunting, memadam, atau meluluskan pelupusan.
* **Perhatian Keselamatan**:
  Oleh kerana data disimpan di dalam pelayar peranti, mana-mana individu yang mempunyai akses fizikal kepada komputer atau pelayar yang sama berpotensi melihat maklumat inventori tersebut. Bagi persekitaran komputer kongsi makmal (*shared lab PC*), pentadbir disyorkan untuk tidak meninggalkan sesi aplikasi tanpa pengawasan.

---

## 5. Cara Memadam atau Mengeset Semula Data

Pengguna mempunyai kawalan penuh ke atas data tempatan mereka:

1. **Melalui Antara Muka Aplikasi**:
   * Tekan pautan **"Set Semula Sampel"** di bahagian kaki halaman (*footer*) untuk memadam data terkini dan memuatkan semula data sampel permulaan UPKS.
2. **Melalui Pelayar Web**:
   * Buka tetapan pelayar web anda (*Browser Settings* > *Privacy and Security* > *Clear Browsing Data* / *Delete Cookies and Site Data*). Tindakan ini akan memadam semua rekod tempatan yang tersimpan.

---

## 6. Status Pematuhan & Had Liabiliti

* Dokumen ini menerangkan pengendalian teknikal sebenar bagi perisian prototaip/MVP ini.
* Aplikasi ini belum lagi dihubungkan kepada pangkalan data rasmi kerajaan atau sistem pusat iGFMAS/SPPA. Sebarang penggunaan rasmi bagi tujuan pengauditan negara tertakluk kepada semakan dasar keselamatan data agensi berkaitan.
