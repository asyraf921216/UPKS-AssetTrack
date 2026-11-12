# UPKS AssetTrack

> **Sistem Pengesanan & Pengurusan Inventori Makmal Berasaskan Kod QR dan Piawaian Pekeliling Perbendaharaan (KEW.PA)**  
> Dibangunkan khusus untuk Unit Pembangunan Ujian dan Standard (UPKS), Lembaga Getah Malaysia (LGM).

---

## A. Penerangan Ringkas

**UPKS AssetTrack** ialah aplikasi web progresif (*Progressive Web App* / PWA) yang memudahkan pegawai makmal dan pentadbir aset merekod, mengimbas pelekat kod QR fizikal, menjejaki pergerakan pinjaman instrumen, dan mengurus kitaran hayat aset makmal dari pendaftaran hingga pelupusan rasmi mengikut Tatacara Pengurusan Aset Alih Kerajaan (TPA).

---

## B. Masalah yang Diselesaikan

Di dalam persekitaran makmal ujian berstandard tinggi (seperti ISO/IEC 17025):
1. **Instrumen Dipindahkan Tanpa Rekod**: Alat seperti neraca analitikal atau meter pH sering dibawa antara bilik makmal tanpa catatan pantas, menyebabkan kekeliruan semasa sesi ujian pensijilan.
2. **Reagen Kimia Tamat Tempoh**: Bahan uji kimia (*Test Chemicals*) yang luput tarikh berisiko menjejaskan keputusan ujian jika digunakan secara tidak sengaja.
3. **Pemberitahuan Kehilangan Aset yang Lambat**: Proses melapor dan menyiasat aset hilang mengambil masa kerana ketiadaan borang pantas di peringkat lapangan.
4. **Beban Dokumentasi Manual**: Menyediakan borang senarai lokasi bilik (KEW.PA-7) atau daftar harta modal (KEW.PA-3) secara manual memakan masa juruteknik makmal.

**UPKS AssetTrack** menyelesaikan masalah ini dengan menyediakan imbasan kod QR kamera telefon secara terus, semakan keselamatan tarikh luput automatik, serta penjanaan borang rasmi kerajaan dalam satu klik.

---

## C. Untuk Siapa Aplikasi Ini?

* **Pegawai Penyelidik & Kakitangan Makmal UPKS**: Mengimbas label aset, meminjam/memulangkan alat dengan 1-ketukan (*1-Tap Return*), serta menyemak tarikh kalibrasi instrumen.
* **Pegawai Aset & Pentadbir Makmal**: Mendaftar aset baharu, mengesahkan laporan kehilangan (KEW.PA-10), mengurus proses Perakuan Pelupusan (PEP / KEW.PA-19), dan menerbitkan Sijil Pelupusan (KEW.PA-21).
* **Juruaudit Dalaman & Pemeriksa Aset**: Menyemak baki fizikal aset mengikut bilik makmal dan mengeksport data audit format CSV/Excel.

---

## D. Apa yang Boleh Dibuat?

* **Pelekat Kod QR Makmal**: Jana dan cetak pelekat QR tahan lasak (format lembaran A4 sedia cetak) untuk ditampal pada instrumen atau perabot makmal.
* **Pengimbas Kamera Pantas**: Imbas kod QR menggunakan kamera peranti untuk melihat spesifikasi aset serta tindakan pantas kontekstual (Pinjam Ekspres / Pulang Ekspres).
* **Penjejakan Lokasi & Pinjaman**: Rekod pemindahan aset antara bilik ujian berserta nama peminjam dan tarikh jangka pulang.
* **Amaran Keselamatan Reagen Kimia**: Sekatan automatik jika bahan kimia melepasi tarikh luput (*expiry date*) untuk mengelakkan ralat ujian standard getah.
* **Siasatan Kehilangan Dua Peringkat**: Kakitangan memfailkan laporan awal (`Dalam Siasatan`), dan pentadbir mengesahkan hasil siasatan sama ada aset ditemui atau disahkan hilang (`Hilang`).
* **Pengurusan Pelupusan (TPA Bab E)**: Rekod Perakuan Pelupusan (PEP) bagi aset rosak tidak ekonomi dibaiki (`Dalam Proses Lupus`) dan jana Sijil Pelupusan (`Dilupuskan`).
* **Penjanaan Borang Rasmi Kerajaan (PDF)**:
  * **KEW.PA-3**: Kad Daftar Harta Modal.
  * **KEW.PA-7**: Senarai Aset Mengikut Lokasi Bilik (sedia digantung di pintu makmal).
  * **KEW.PA-10**: Laporan Pemeriksaan & Siasatan Kehilangan Aset Alih.
  * **KEW.PA-19**: Borang Perakuan Pelupusan Aset Alih (PEP).
  * **KEW.PA-21**: Sijil Pelupusan Aset Alih Kerajaan.
* **Sokongan Luar Talian (PWA)**: Aplikasi boleh dipasang ke skrin utama telefon/komputer dan beroperasi walaupun makmal tiada capaian Wi-Fi (data diselaraskan apabila sambungan pulih).

---

## E. Contoh Cara Penggunaan

> **Senario: Peminjaman Neraca Analitikal ke Makmal Kimia 2**

1. Puan Siti membuka aplikasi UPKS AssetTrack pada telefon pintar beliau.
2. Beliau menekan ikon **Kamera Pengimbas QR** dan menghalakan kamera ke pelekat kod QR di atas neraca analitikal (*Analytical Balance*).
3. Sistem mengesan aset dan terus memaparkan butang pintar **"Pinjam Sekarang"**.
4. Puan Siti memilih lokasi destinasi (*Makmal Ujian Kimia 2*) dan menekan **Sahkan Pinjaman**.
5. Status neraca bertukar serta-merta kepada `Dipinjam` dan lokasinya dikemaskini.
6. Setelah selesai ujian sampel getah, beliau hanya perlu mengimbas semula pelekat tersebut dan menekan **"Sahkan Pulang Sekarang (1-Tap)"** — status neraca kembali kepada `Aktif` di lokasi penempatan asalnya.

---

## F. Cara Mencuba

Aplikasi ini boleh dicapai terus melalui pelayar web (*browser*) tanpa perlu memasang sebarang perisian tambahan:

* **Pautan Aplikasi (Preview Live)**: [https://ais-pre-bmix4prfydozodfhkot7u7-998660528075.asia-east1.run.app](https://ais-pre-bmix4prfydozodfhkot7u7-998660528075.asia-east1.run.app)
* **Pautan Pembangunan (Dev Environment)**: [https://ais-dev-bmix4prfydozodfhkot7u7-998660528075.asia-east1.run.app](https://ais-dev-bmix4prfydozodfhkot7u7-998660528075.asia-east1.run.app)

*Untuk menguji mod pentadbir (Admin Mode), klik ikon mangga di bahagian atas kanan dan masukkan PIN lalai: `1234`.*

---

## G. Status Projek Semasa

* **Tahap Projek**: MVP v1.0 Selesai Dibina (*Feature Complete for Pilot*).
* **Fungsi yang Sudah Dibina & Diuji dalam Pelayar Web**:
  * Pendaftaran, pengeditan dan pemadaman rekod aset.
  * Penjanaan kod QR dan pencetakan lembaran berbilang pelekat.
  * Aliran kerja pinjaman dan pemulangan lokasi.
  * Aliran siasatan kehilangan 2 peringkat.
  * Aliran pelupusan aset (PEP & Sijil KEW.PA-21).
  * Amaran keselamatan luput bahan kimia makmal.
  * Carian pintar berasaskan toleransi ejaan (*Fuzzy Search*).
  * Penjanaan dokumen rasmi KEW.PA-3, 7, 10, 19, dan 21 format A4.
  * Caching Service Worker PWA dan giliran penyelarasan luar talian.
* **Batasan & Perkara yang Belum Diuji di Lapangan Fizikal**:
  * Pengimbasan label fizikal sebenar di bawah pencahayaan bilik gelap makmal belum diuji secara meluas.
  * Penyimpanan data semasa berasaskan `localStorage` pelayar peranti; integrasi ke pangkalan data berpusat pelayan (cth: Cloud SQL / PostgreSQL) dirancang untuk fasa seterusnya.

---

## H. Panduan & Dokumentasi Lanjut

Untuk maklumat terperinci, sila rujuk dokumen berikut:

* [📘 Panduan Pengguna (User Guide)](docs/PANDUAN-PENGGUNA.md) — Langkah demi langkah menggunakan aplikasi.
* [📋 Dokumen Keperluan Produk (PRD)](docs/KEPERLUAN-PRODUK.md) — Skop fungsian, business rules, dan kriteria penerimaan.
* [🗺️ Status Pembangunan & Roadmap](docs/STATUS-DAN-ROADMAP.md) — Senarai semak ciri dan perancangan masa hadapan.
* [🔒 Dasar Data & Privasi](docs/DATA-DAN-PRIVASI.md) — Cara data disimpan, privasi peranti, dan pengendalian rekod.
* [🛠️ Panduan Setup & Penyelenggaraan](docs/SETUP-DAN-PENYELENGGARAAN.md) — Cara memuat turun, memasang, dan menjalankan kod sumber di komputer sendiri.
* [📜 Log Perubahan (CHANGELOG)](CHANGELOG.md) — Sejarah kemas kini dan penambahbaikan versi.

---

## I. Ringkasan Teknologi

* **React (v19)**: Digunakan untuk membina antara muka pengguna (*user interface*) dan interaksi skrin yang pantas.
* **TypeScript**: Memastikan kod lebih selamat daripada ralat pengaturcaraan dan menyokong struktur data yang kemas.
* **Vite**: Alat kompilasi dan pelayan pembangunan yang sangat pantas.
* **Tailwind CSS**: Digunakan untuk gaya reka bentuk visual yang kemas, profesional, dan responsif pada skrin telefon serta komputer.
* **html5-qrcode & qrcode**: Pustaka membaca kod QR menggunakan kamera peranti dan menjana kod QR imej beresolusi tinggi.
* **Vite PWA Plugin (Workbox)**: Menyokong pemasangan aplikasi ke telefon pintar dan fungsi luar talian (*offline caching*).

---

## J. Maklum Balas & Bantuan

Sekiranya anda menemui sebarang isu atau ingin mencadangkan penambahbaikan:
1. Sila buka tiket laporan melalui menu **GitHub Issues** pada repositori ini.
2. Nyatakan langkah untuk menghasilkan semula ralat (*steps to reproduce*) atau lampirkan tangkapan skrin berkaitan.
