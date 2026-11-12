# Sejarah Perubahan (Changelog)
## UPKS AssetTrack

Semua perubahan dan penambahbaikan fungsian sistem **UPKS AssetTrack** direkodkan dalam dokumen ini mengikut format standard *Keep a Changelog*.

---

## [1.0.0] - 2026-11-12 (Versi MVP Lengkap)

### Ditambah (Added)
* **Pengurusan Inventori Aset Alih Makmal (KEW.PA-3)**:
  * Sokongan 4 kategori teras makmal: *Instruments*, *Perabot*, *Barangan Komputer*, dan *Peralatan Test Chemical*.
  * Medan khusus makmal seperti tarikh kalibrasi ISO 17025, nombor siri pengilang, dan pembungkusan kuantiti reagen.
  * Pengesahan keunikan No. Siri Pendaftaran bagi mengelakkan pertindihan data.
* **Sistem Kod QR & Pencetakan Makmal**:
  * Penjanaan kod QR masa nyata untuk setiap aset yang didaftarkan.
  * Modul cetakan lembaran pelekat makmal saiz A4 (grid 3 lajur) sedia cetak pada kertas pelekat tahan lasak.
  * Cetakan pelekat individu terus daripada kad spesifikasi aset.
* **Pengimbas Kamera Kod QR & Tindakan Pantas (Contextual Quick Actions)**:
  * Pengimbas kod QR menggunakan kamera peranti tanpa perisian tambahan.
  * Tindakan automatik: *Pinjam Sekarang* (jika aset aktif) dan *Sahkan Pulang Sekarang (1-Tap)* jika aset sedang dipinjam.
* **Aliran Kerja Pinjaman & Pemulangan Lokasi**:
  * Penjejakan perpindahan instrumen antara bilik ujian berserta nama peminjam dan tarikh jangka pulang.
  * Pemulangan automatik 1-ketukan yang mengembalikan status kepada *Aktif* dan lokasi ke penempatan asal (*Return to Base*).
* **Aliran Siasatan Kehilangan Dua Peringkat (KEW.PA-10)**:
  * Kakitangan memfailkan laporan kehilangan awal (*Dalam Siasatan*).
  * Sekatan automatik ke atas peminjaman aset yang sedang disiasat.
  * Pengesahan muktamad oleh Pentadbir Aset: *Disahkan Hilang* atau *Ditemui Semula*.
* **Pengurusan Pelupusan Aset Alih (TPA Bab E)**:
  * Permulaan Perakuan Pelupusan (PEP) bagi aset rosak tidak ekonomi dibaiki, usang, atau rosak dengan status *Dalam Proses Lupus*.
  * Sekatan transaksi pinjaman ke atas aset dalam proses pelupusan.
  * Pengesahan fizikal dan penerbitan Sijil Pelupusan Aset Alih (KEW.PA-21) dengan status akhir *Dilupuskan*.
* **Peraturan Keselamatan Bahan Uji Kimia (Chemical Expiry Rule)**:
  * Pengesanan automatik bahan kimia yang melepasi tarikh luput.
  * Modal amaran keselamatan bagi menyekat penggunaan reagen luput untuk ujian pensijilan UPKS.
* **Carian Pintar & Akses Pantas**:
  * Algoritma carian bertoleransi ejaan (*Fuzzy Search* toleransi 1–2 aksara).
  * Bar cipset pantas *Aset Terkini Dilihat* (*Recently Viewed*) dan *Aset Dipin* (*Pinned Assets*).
* **Penjanaan Borang Rasmi Kerajaan (Format PDF A4)**:
  * **KEW.PA-3**: Kad Daftar Harta Modal.
  * **KEW.PA-7**: Senarai Aset Mengikut Lokasi Bilik (sedia digantung di pintu makmal).
  * **KEW.PA-10**: Laporan Pemeriksaan & Siasatan Kehilangan Aset Alih.
  * **KEW.PA-19**: Borang Perakuan Pelupusan Aset Alih (PEP).
  * **KEW.PA-21**: Sijil Pelupusan Aset Alih Kerajaan.
* **Sokongan Progressive Web App (PWA) & Mod Luar Talian**:
  * Pemasangan aplikasi ke skrin utama peranti Android, iOS, dan komputer desktop.
  * Caching sumber statik dan data aset menggunakan Service Worker.
  * Baris giliran penyelarasan luar talian (*Offline Sync Queue*) yang menyegerakkan rekod secara automatik apabila talian pulih.
* **Import & Eksport Data Audit**:
  * Eksport senarai inventori dan lejar status ke fail CSV.
  * Import inventori pukal melalui fail CSV dengan pengesahan format.

### Diubahsuai (Changed)
* **Penambahbaikan Reka Bentuk Visual & UX Korporat**:
  * Membuang gaya generik "AI slop" seperti lencana bujur tebal (*pill badges*) dan bayang-bayang keterlaluan.
  * Menggunakan palet neutral berasaskan slate dan aksen teal makmal rasmi yang beridentiti tinggi.
  * Memperkenalkan bar telemetri padat makmal (*high-density ledger strip*) yang memaparkan bilangan aset mengikut kategori dan status secara kemas.

---

*Nota: Dokumen ini diselenggara sebagai sebahagian daripada rekod versi rasmi UPKS AssetTrack.*
