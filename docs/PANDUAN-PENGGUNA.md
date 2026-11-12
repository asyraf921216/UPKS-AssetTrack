# Panduan Pengguna (User Guide)
## UPKS AssetTrack — Unit Pembangunan Ujian dan Standard (LGM)

Dokumen ini menyediakan panduan langkah demi langkah cara mengendalikan sistem **UPKS AssetTrack** untuk kegunaan harian kakitangan makmal dan pegawai aset.

---

## 1. Peranan Pengguna & Mod Akses

Sistem ini mempunyai dua tahap capaian:

| Peranan | Penerangan Capaian | Akses Lalai |
| :--- | :--- | :--- |
| **Kakitangan Makmal (Staff)** | Boleh mengimbas kod QR, menyemak spesifikasi aset, merekod pinjaman, memulangkan aset, dan memfailkan laporan kehilangan awal. | Mod lalai apabila membuka aplikasi. |
| **Pentadbir Aset (Admin)** | Boleh mendaftar aset baharu, menyunting data, memadam aset, mengesahkan siasatan kehilangan, meluluskan perakuan pelupusan (PEP), dan menerbitkan sijil pelupusan. | Dilindungi dengan nombor PIN keselamatan. |

### Cara Mengaktifkan Mod Pentadbir:
1. Tekan butang **"Kakitangan"** berikon mangga di sudut kanan atas menu navigasi.
2. Masukkan nombor PIN pentadbir: `1234`.
3. Tekan **"Sahkan & Masuk"**. Label peranan akan bertukar kepada **"Pentadbir"** (berwarna emas) dan butang kawalan tambahan akan dipaparkan.

---

## 2. Pendaftaran Aset Baharu (Daftar Harta Modal)

*Hanya boleh dilakukan dalam Mod Pentadbir.*

1. Tekan butang **"+ Tambah Aset"** pada bar navigasi utama.
2. Lengkapkan maklumat aset:
   * **No. Siri Pendaftaran**: Format rasmi KEW.PA (cth: `KEW.PA-3/UPKS/2026/015`). *Mesti unik.*
   * **Nama Aset**: Cth: *Digital Viscometer Model DV-II+*.
   * **Kategori**: Pilih salah satu daripada:
     * *Instruments* (Peralatan pengujian makmal)
     * *Perabot* (Meja makmal, kerusi ESD, dsb.)
     * *Barangan Komputer* (PC makmal, tablet lapangan, printer)
     * *Peralatan Test Chemical* (Reagen kimia, asid, pelarut)
   * **Jenama & Model**: Cth: *Brookfield DV2T*.
   * **No. Siri Pembuat**: Nombor siri kilang (cth: *SN-882910-B*).
   * **Lokasi Penempatan Asal**: Bilik tetap aset (cth: *Makmal Ujian Kimia 2*).
   * **Pegawai Bertanggungjawab**: Nama saintis/pegawai penjaga.
   * **Harga Perolehan Asal (RM)**: Kos belian mengikut pesanan kerajaan (LO).
3. **Data Khusus Mengikut Kategori**:
   * Jika *Instruments*: Masukkan **Tarikh Kalibrasi Seterusnya** (untuk audit ISO 17025).
   * Jika *Peralatan Test Chemical*: Masukkan **Kuantiti/Pembungkusan** (cth: `500 mL`) dan **Tarikh Luput**.
4. Tekan **"Daftar Aset Baharu"**. Rekod akan disimpan serta kod QR unik dijana secara automatik.

---

## 3. Menjana & Mencetak Pelekat Kod QR Makmal

Pelekat kod QR digunakan untuk ditampal pada instrumen fizikal.

### A. Cetak Pelekat Individu (Satu Unit):
1. Buka perincian aset dengan menekan nama aset dalam senarai.
2. Tekan butang **"Cetak Pelekat QR"** di bahagian atas kad dossier.
3. Cetak menggunakan pencetak label atau simpan sebagai PDF.

### B. Cetak Lembaran Pukal (Kertas Pelekat A4):
1. Pada senarai aset utama, tekan butang **"Pilihan Cetak"** (atau tandakan kotak pilihan pada setiap aset yang ingin dicetak).
2. Tekan butang **"Cetak Pelekat QR (X Dipilih)"**.
3. Sistem akan memaparkan susun atur format lembaran pelekat A4 (grid 3 lajur) lengkap dengan kod QR beresolusi tinggi, logo pengenalan UPKS, No. Siri Pendaftaran, dan lokasi bilik.
4. Tekan **"Cetak Lembaran"** untuk mencetak terus ke kertas pelekat makmal.

---

## 4. Mengimbas Kod QR Menggunakan Kamera Telefon

1. Tekan butang bulat hijau **"Imbas Kod QR"** di bar atas atau bar carian.
2. Benarkan capaian kamera pelayar apabila diminta (*Allow camera permissions*).
3. Halakan kamera ke arah pelekat kod QR pada aset.
4. Kamera akan mengesan kod secara automatik dalam masa kurang 1 saat dan memaparkan kad tindakan pintar kontekstual (*Contextual Quick Action*):
   * **Jika Aset Aktif**: Paparkan butang **"Pinjam Sekarang"**.
   * **Jika Aset Sedang Dipinjam**: Paparkan butang hijau **"Sahkan Pulang Sekarang (1-Tap)"**.
   * **Jika Aset Berstatus Hilang / Dalam Siasatan**: Memaparkan amaran amaran larangan pinjaman.

---

## 5. Aliran Pinjaman & Pemulangan Aset (Loan & Relocation)

### A. Merekod Pinjaman Aset:
1. Klik butang **"Pinjam"** pada baris aset atau melalui kad imbasan kamera.
2. Masukkan maklumat pinjaman:
   * **Nama Peminjam**: Cth: *Dr. Khairul Anwar*.
   * **Lokasi Destinasi**: Cth: *Makmal Ujian Kimia 2*.
   * **Tarikh Pinjam**: Lalai kepada tarikh hari ini.
   * **Jangka Pulang**: Tarikh dijangka aset dikembalikan.
   * **Tujuan / Catatan**: Cth: *Pengujian ketumpatan lateks siri 3*.
3. Tekan **"Sahkan Pinjaman"**. Status aset bertukar kepada `Dipinjam` dan lokasinya dikemaskini.

### B. Merekod Pemulangan Aset (1-Tap Return):
1. Tekan butang **"Pulang"** pada aset atau imbas pelekat kod QR neraca berkenaan.
2. Sahkan pemulangan.
3. Status aset kembali serta-merta kepada `Aktif` dan lokasinya kembali kepada lokasi penempatan asalnya secara automatik mengikut Business Rule BR-004.

---

## 6. Siasatan Kehilangan Aset (Dua Peringkat / BR-003)

### Peringkat 1: Laporan Awal oleh Kakitangan Makmal
1. Jika aset tidak dijumpai di rak atau makmal, buka maklumat aset dan tekan **"Lapor Kehilangan"**.
2. Masukkan nama pelapor, tarikh kali terakhir aset dilihat, lokasi terakhir, dan kronologi kejadian.
3. Tekan **"Hantar Laporan Kehilangan"**.
4. Status aset serta-merta bertukar kepada **`Dalam Siasatan`** (amaran berkedip kuning). Transaksi pinjaman dibekukan secara automatik.

### Peringkat 2: Pengesahan Rasmi oleh Pentadbir Aset
1. Pentadbir log masuk menggunakan PIN pentadbir.
2. Banner amaran merah akan memaparkan senarai aset yang sedang disiasat.
3. Pentadbir meneliti laporan dan memilih salah satu tindakan:
   * **"Ditemui Semula"**: Status dikembalikan kepada `Aktif`.
   * **"Sahkan Hilang"**: Status aset dimuktamadkan kepada `Hilang` untuk penyediaan laporan polis dan tindakan hapuskira jawatankuasa.

---

## 7. Aliran Pelupusan Aset Alih (TPA Bab E)

Proses pelupusan digunakan untuk instrumen atau perabot yang rosak teruk, tidak ekonomi dibaiki, usang, atau reagen yang rosak.

### Langkah 1: Memulakan Perakuan Pelupusan (PEP)
1. Dalam Mod Pentadbir, buka perincian aset dan pilih tab **"Pelupusan"**.
2. Tekan **"Mula Proses Pelupusan (PEP)"**.
3. Sistem menjana No. Perakuan Pelupusan (cth: `PEP/UPKS/2026/004`).
4. Pilih sebab pelupusan (cth: *Tidak Ekonomi Dibaiki mengikut TPA Bab E*).
5. Pilih kaedah yang dicadangkan (cth: *E-Waste (Sisa Elektronik)* atau *Buangan Terjadual*).
6. Tekan **"Sahkan Permulaan PEP"**. Status aset bertukar kepada **`Dalam Proses Lupus`**. Sebarang pinjaman disekat sepenuhnya.

### Langkah 2: Mengesahkan Selesai Pelupusan (Sijil KEW.PA-21)
1. Setelah kerja pelupusan fizikal selesai dijalankan bersama kontraktor berlesen:
2. Buka tab **"Pelupusan"** pada aset berkenaan.
3. Tekan butang **"Sahkan Selesai (KEW.PA-21)"**.
4. Masukkan nombor Sijil Pelupusan rasmi (cth: `SIJIL-LUPUS/UPKS/2026/002`), pegawai pelulus, dan nombor resit akuan penerimaan e-waste/toksik.
5. Tekan **"Sahkan Selesai & Terbitkan Sijil"**. Status aset bertukar kepada **`Dilupuskan`** (rekod diarkibkan).

---

## 8. Amaran Keselamatan Bahan Uji Kimia (Reagen Luput)

Bagi kategori **Peralatan Test Chemical**:
* Jika tarikh luput bahan kimia telah melepasi tarikh semasa, sistem secara automatik menyekat pinjaman dan memaparkan modal amaran keselamatan berwarna merah:
  > *"Bahan uji ini telah tamat tempoh dan tidak boleh digunakan untuk ujian pensijilan UPKS bagi mengelakkan kompromi piawaian ISO 17025."*
* Staf makmal dinasihatkan untuk mengasingkan botol reagen tersebut untuk tindakan pelupusan sisa berjadual.

---

## 9. Penjanaan Borang Rasmi PDF Pekeliling Perbendaharaan

Tekan butang **"Borang Rasmi (KEW.PA)"** di sudut kanan atas untuk membuka modul cetakan dokumen:

1. **KEW.PA-7 (Senarai Aset Bilik)**:
   * Pilih nama bilik makmal daripada menu *dropdown*.
   * Sistem menyusun jadual aset lengkap dengan ruangan tandatangan Pegawai Penempatan dan Pegawai Aset.
2. **KEW.PA-3 (Daftar Harta Modal)**:
   * Pilih aset individu untuk mencetak kad pendaftaran lengkap dengan harga perolehan, nombor siri kilang, dan rekod kalibrasi.
3. **KEW.PA-10 (Laporan Pemeriksaan Kehilangan)**:
   * Menjana senarai siasatan aset hilang lengkap dengan ruangan tandatangan Pegawai Pemeriksa I & II.
4. **KEW.PA-19 (Perakuan Pelupusan / PEP)**:
   * Menjana borang perakuan pelupusan aset alih bagi aset dalam proses lupus.
5. **KEW.PA-21 (Sijil Pelupusan Aset Alih Kerajaan)**:
   * Menjana dokumen perakuan rasmi selesai pelupusan fizikal berserta ruangan tandatangan Ketua Pengarah LGM.

*Tekan butang **"Cetak / Simpan PDF"** untuk menyimpan dokumen bersaiz A4.*

---

## 10. Maksud Status & Label Penting

| Lencana Status | Warna | Maksud Operasi |
| :--- | :--- | :--- |
| **Aktif** | Hijau | Aset berada dalam makmal penempatan asal, berfungsi, dan sedia untuk digunakan. |
| **Dipinjam** | Biru | Aset sedang dipinjam atau dipindahkan sementara ke bilik ujian lain. |
| **Dalam Siasatan** | Kuning Berkedip | Laporan kehilangan telah difailkan oleh staf; menanti siasatan dan pengesahan admin. |
| **Hilang** | Merah | Telah disahkan hilang oleh Pegawai Aset; menunggu proses hapuskira. |
| **Rosak** | Kelabu | Aset mengalami kerosakan teknikal dan tidak boleh digunakan untuk ujian. |
| **Dalam Proses Lupus** | Ungu | Borang PEP telah dimajukan; menunggu pelupusan fizikal (pinjaman disekat). |
| **Dilupuskan** | Teks Bergaris | Selesai dilupuskan secara fizikal mengikut Sijil KEW.PA-21. |

---

## 11. Penyelesaian Masalah Biasa (Troubleshooting)

* **Kamera Pengimbas QR Tidak Berfungsi**:
  * Pastikan anda telah menekan "Allow" pada dialog kebenaran kamera pelayar web.
  * Pastikan pelayar dijalankan melalui protokol HTTPS yang selamat.
* **Aplikasi Beroperasi Luar Talian (*Offline*)**:
  * Apabila tiada internet, penunjuk **"Mod Luar Talian"** berwarna kelabu akan muncul pada bar atas.
  * Anda tetap boleh mengimbas dan melihat data aset. Transaksi pinjaman/pulangan akan disimpan dalam giliran tempatan (*sync queue*) dan dihantar sebaik sahaja peranti menerima sambungan semula.
* **Terlupa PIN Pentadbir**:
  * PIN lalai untuk persekitaran ini ialah `1234`.
