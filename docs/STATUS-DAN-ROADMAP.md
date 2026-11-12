# Status Pembangunan & Roadmap
## UPKS AssetTrack

Dokumen ini merekodkan status fungsian sebenar aplikasi, ciri yang telah diuji, perkara yang belum disahkan di lapangan, serta cadangan penambahbaikan masa hadapan.

---

## 1. Ciri yang Sudah Dibina (*Built Features*)

* [x] **Daftar Induk Inventori**: Pengurusan data aset (CRUD) dengan pengesahan nombor unik pendaftaran KEW.PA.
* [x] **Pengelasan Kategori 4 Makmal**:
  * *Instruments* (dengan medan jadual kalibrasi ISO 17025).
  * *Perabot* (dengan medan penempatan dan pegawai penjaga).
  * *Barangan Komputer* (dengan medan spesifikasi dan nombor siri pembuat).
  * *Peralatan Test Chemical* (dengan medan pembungkusan/kuantiti dan tarikh luput).
* [x] **Pelekat Kod QR Makmal**:
  * Penjanaan kod QR masa nyata (*real-time QR generation*).
  * Cetakan pelekat individu.
  * Cetakan lembaran pelekat pukal bersaiz A4 (grid 3 lajur bersesuaian dengan kertas pelekat kalis air makmal).
* [x] **Pengimbas Kamera Kod QR Pantas**:
  * Sokongan kamera belakang mudah alih (*environment facing camera*).
  * Kad tindakan pantas kontekstual (Pinjam Ekspres / Pulang Ekspres 1-Tap).
* [x] **Penjejakan Pergerakan & Lokasi**:
  * Peminjaman instrumen antara bilik makmal.
  * Log kronologi lengkap peminjam, tarikh pinjam, dan tarikh jangka pulang.
  * Pemulangan automatik ke lokasi penempatan asal aset (*return to base*).
* [x] **Siasatan Kehilangan Dua Peringkat (KEW.PA-10)**:
  * Pelaporan awal oleh kakitangan (*Dalam Siasatan*).
  * Banner amaran penyiasatan pada papan pemuka.
  * Pengesahan muktamad oleh pentadbir (*Disahkan Hilang* atau *Ditemui Semula*).
* [x] **Pengurusan Pelupusan Aset Alih (TPA Bab E)**:
  * Pendaftaran Perakuan Pelupusan (PEP) dan penukaran status kepada *Dalam Proses Lupus*.
  * Penetapan justifikasi dan kaedah pelupusan piawai (E-Waste, Sisa Toksik, Musnah, Tender, dsb.).
  * Pengesahan fizikal dan penerbitan Sijil Pelupusan Aset Alih (KEW.PA-21) dengan status *Dilupuskan*.
* [x] **Sistem Keselamatan Bahan Uji Kimia**:
  * Pengesanan automatik tarikh luput reagen.
  * Paparan modal amaran sekatan penggunaan untuk ujian pensijilan.
* [x] **Carian Pintar & Penapis Telemetri**:
  * Carian bertoleransi ejaan (*Fuzzy Search* 1-2 aksara).
  * Cipset pintasan "Aset Terkini Dilihat" (*Recently Viewed*) dan aset dipin (*Pinned Assets*).
  * Penapis status operasi dan kategori masa nyata.
* [x] **Modul Penjanaan Borang Rasmi Kerajaan (PDF)**:
  * Format sedia cetak A4 mengikut Pekeliling Perbendaharaan bagi KEW.PA-3, KEW.PA-7, KEW.PA-10, KEW.PA-19, dan KEW.PA-21.
* [x] **Sokongan PWA & Luar Talian (*Offline*)**:
  * Web App Manifest dan ikon bersesuaian peranti.
  * Caching aset teras menggunakan Service Worker.
  * Pengesanan status rangkaian dan baris giliran simpanan luar talian (*offline sync queue*).
* [x] **Import & Eksport Data Audit**:
  * Eksport format CSV untuk audit tahunan.
  * Import inventori pukal berasaskan format templat CSV piawai.

---

## 2. Ciri yang Telah Diuji (*Tested*)

Ujian dijalankan dalam persekitaran pembangunan pelayar web moden (Chromium / Firefox / WebKit):
* [x] **Kompilasi Kod & Linting**: Kod melepasi semakan `tsc --noEmit` dan `eslint` tanpa sebarang ralat sintaks atau ralat jenis (*TypeScript type-safety*).
* [x] **Aliran Pinjam-Pulang**: Disahkan status bertukar dengan tepat antara `Aktif` ↔ `Dipinjam` serta lokasi kembali ke `defaultLocation` apabila dipulangkan.
* [x] **Sekatan Business Rules**:
  * Aset `Hilang`, `Dalam Siasatan`, `Dalam Proses Lupus`, dan `Dilupuskan` berjaya disekat daripada sebarang cubaan pinjaman.
  * Aset kimia tamat tempoh berjaya mencetuskan modal amaran keselamatan.
* [x] **Penyimpanan Tempatan**: Data diuji kekal tersimpan dan dimuatkan semula dengan tepat daripada `localStorage`.
* [x] **Penjanaan PDF**: Borang KEW.PA berjaya dipaparkan dalam susun atur format cetakan (*CSS print styles*) tanpa elemen antara muka skrin yang mengganggu.

---

## 3. Perkara yang Belum Disahkan di Lapangan Fizikal (*Unverified in Field*)

Perkara berikut memerlukan pengesahan lanjut dalam persekitaran fizikal makmal sebenar:
* [ ] **Ketahanan Label Pelekat QR Fizikal**: Prestasi pengimbasan kamera telefon pada pelekat fizikal yang terkena tumpahan pelarut kimia makmal atau diletakkan di bawah pencahayaan malap.
* [ ] **Pelbagai Model Telefon Pintar Kakitangan**: Pengujian keserasian lensa kamera sudut lebar atau peranti Android/iOS versi lama.
* [ ] **Kelajuan Carian Pangkalan Data Skala Besar**: Prestasi carian kabur (*fuzzy search*) apabila jumlah rekod inventori makmal melebihi 10,000 unit instrumen.

---

## 4. Isu & Batasan Diketahui (*Known Limitations*)

1. **Penyimpanan Data Berasaskan Pelayar**:
   * Pada masa ini, data inventori disimpan di dalam `localStorage` pelayar web peranti. Ini bermakna perubahan data pada satu komputer tidak diselaraskan ke komputer kakitangan lain secara masa nyata tanpa pangkalan data awan berpusat.
2. **Pengesahan Pentadbir Ringkas**:
   * Mod pentadbir menggunakan kod PIN tetap (`1234`) pada bahagian depan perisian, sesuai untuk demonstrasi MVP tetapi memerlukan integrasi log masuk korporat (SSO / Single Sign-On atau Firebase Authentication) untuk penggunaan produksi rasmi.

---

## 5. Perancangan Seterusnya (*Future Roadmap*)

*Perancangan berikut disenaraikan mengikut keutamaan teknikal tanpa sebarang jaminan tarikh siap khusus:*

* **Fasa 1: Integrasi Pangkalan Data Berpusat**:
  * Menyambungkan aplikasi kepada pangkalan data relasi terpusat (seperti PostgreSQL / Google Cloud SQL) supaya semua kakitangan makmal berkongsi satu pangkalan rekod inventori yang sama dalam masa nyata.
* **Fasa 2: Pengesahan Pengguna Korporat (SSO / LDAP)**:
  * Menggantikan nombor PIN pentadbir dengan log masuk emel rasmi agensi (`@lgm.gov.my`) berserta kawalan akses berasaskan peranan (*Role-Based Access Control* / RBAC).
* **Fasa 3: Peringatan Kalibrasi Automatik**:
  * Menghantar emel pemberitahuan automatik kepada Pegawai Bertanggungjawab 30 hari sebelum tarikh luput kalibrasi instrumen bagi memastikan makmal sentiasa bersedia menghadapi audit ISO 17025.
* **Fasa 4: Log Audit Keselamatan Berperingkat**:
  * Merekodkan setiap aktiviti penyuntingan atau pemadaman aset ke dalam lejar audit yang tidak boleh diubah (*immutable audit trail*) untuk tujuan ketelusan perakaunan kerajaan.
