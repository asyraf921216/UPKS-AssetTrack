# Panduan Setup & Penyelenggaraan (Setup & Maintenance Guide)
## UPKS AssetTrack

Dokumen ini menyediakan panduan teknikal bagi pembangun (*developer*) atau pegawai teknologi maklumat (IT) yang ingin memasang, menjalankan, dan menyelenggara aplikasi ini di komputer sendiri atau pelayan agensi.

---

## 1. Keperluan Sistem (Prerequisites)

Sebelum memulakan, pastikan komputer anda telah dipasang dengan perisian berikut:

* **Node.js**: Versi `18.0.0` atau terkini (disyorkan versi LTS seperti Node.js 20 atau 22).
* **Pengurus Pakej (*Package Manager*)**: `npm` (didatangkan bersama Node.js), `yarn`, `pnpm`, atau `bun`.
* **Git**: Untuk memuat turun (*clone*) repositori kod sumber.
* **Pelayar Web Moden**: Google Chrome, Microsoft Edge, Safari, atau Mozilla Firefox yang menyokong standard ECMAScript 2022 dan API MediaDevices (kamera).

---

## 2. Langkah Memasang & Menjalankan Projek

### Langkah 1: Klon Repositori
Muat turun kod sumber dari GitHub ke komputer anda:
```bash
git clone https://github.com/USERNAME/upks-assettrack.git
cd upks-assettrack
```

### Langkah 2: Memasang Dependencies
Pasang semua pustaka luaran yang dinyatakan dalam fail `package.json`:
```bash
npm install
```
*Tujuan: Memuat turun pustaka React, Tailwind CSS, Vite, html5-qrcode, qrcode, dan pustaka sokongan lain ke dalam direktori `node_modules`.*

### Langkah 3: Menetapkan Environment Variables (Pilihan)
Salin fail contoh `.env.example` kepada `.env`:
```bash
cp .env.example .env
```
Kandungan `.env`:
* `APP_URL`: Alamat URL aplikasi apabila dihoskan (cth: `http://localhost:3000`).
* `GEMINI_API_KEY`: Kunci API sekiranya fungsi AI tambahan diaktifkan pada masa hadapan (tidak diperlukan untuk operasi asas inventori).

### Langkah 4: Menjalankan Pelayan Pembangunan (Dev Server)
Mulakan pelayan tempatan:
```bash
npm run dev
```
Pelayan akan beroperasi pada:
```
  VITE v8.3.0  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```
Buka pelayar web anda dan layari `http://localhost:3000`.

---

## 3. Skrip Perintah yang Disediakan (`package.json`)

| Perintah | Fungsi / Tujuan |
| :--- | :--- |
| `npm run dev` | Menjalankan pelayan pembangunan Vite pada port 3000 dengan sokongan Hot Module Replacement (HMR). |
| `npm run build` | Mengompilasi dan mengoptimumkan kod sumber kepada fail pengeluaran statik (*production bundle*) dalam folder `dist/`. |
| `npm run preview` | Menguji paparan fail binaan `dist/` secara tempatan sebelum dihantar ke pelayan pengeluaran. |
| `npm run lint` | Menjalankan semakan keselamatan jenis TypeScript (`tsc --noEmit`) untuk memastikan tiada ralat jenis atau sintaks. |
| `npm run clean` | Memadam fail binaan lama (`rm -rf dist server.js`). |

---

## 4. Struktur Direktori Projek

```
upks-assettrack/
├── .env.example              # Templat pembolehubah persekitaran (tiada data sensitif)
├── .gitignore                # Senarai fail/folder yang dikecualikan daripada Git
├── CHANGELOG.md              # Rekod sejarah penambahbaikan sistem
├── README.md                 # Pintu masuk dan dokumentasi utama
├── docs/                     # Dokumentasi terperinci
│   ├── DATA-DAN-PRIVASI.md
│   ├── KEPERLUAN-PRODUK.md
│   ├── PANDUAN-PENGGUNA.md
│   ├── SETUP-DAN-PENYELENGGARAAN.md
│   └── STATUS-DAN-ROADMAP.md
├── index.html                # Fail HTML utama
├── metadata.json             # Konfigurasi metadata aplikasi
├── package.json              # Senarai dependencies dan skrip projek
├── public/                   # Aset statik awam (ikon PWA, gambar kategori makmal)
│   ├── assets/               # Fail dokumen PRD asal
│   ├── favicon.svg           # Ikon tab pelayar
│   ├── manifest.webmanifest  # Konfigurasi PWA Web App Manifest
│   └── pwa-*.png             # Ikon aplikasi mudah alih pelbagai resolusi
├── src/                      # Kod sumber utama aplikasi
│   ├── components/           # Komponen UI modular (Navbar, Modal, Kad Aset, dsb.)
│   ├── data/                 # Data sampel permulaan makmal UPKS (seed data)
│   ├── hooks/                # Custom React hooks (useOnlineStatus, dsb.)
│   ├── services/             # Logik capaian dan penyimpanan data (storage.ts)
│   ├── types/                # Definisi jenis data TypeScript (Asset, Disposal, dsb.)
│   ├── utils/                # Fungsi bantuan (kod QR, eksport CSV, carian kabur)
│   ├── App.tsx               # Komponen induk aplikasi
│   ├── index.css             # Gaya CSS Tailwind global
│   └── main.tsx              # Titik masuk pemulaan React
├── tsconfig.json             # Konfigurasi pengkompil TypeScript
└── vite.config.ts            # Konfigurasi pembina Vite & plugin PWA
```

---

## 5. Arahan Deployment (Penyebaran ke Pelayan)

### Kaedah A: Hos Statik / Cloud Storage / CDN
Oleh kerana aplikasi ini adalah Single Page Application (SPA), fail di dalam folder `dist` boleh dihoskan pada mana-mana pelayan statik:
1. Jalankan `npm run build`.
2. Muat naik kandungan direktori `dist/` ke perkhidmatan seperti Cloud Storage, Firebase Hosting, Netlify, atau Vercel.
3. Pastikan pelayan menyokong peraturan penulisan semula URL (*rewrite rule*) supaya semua laluan URL diarahkan kembali ke `index.html`.

### Kaedah B: Bekas Docker / Cloud Run
Contoh fail `Dockerfile` ringkas berasaskan Nginx:
```dockerfile
# Peringkat 1: Bina kod sumber
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Peringkat 2: Pelayan Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 6. Penyelesaian Masalah Teknikal (Troubleshooting)

### A. Ralat Kebenaran Kamera (*Camera Permission Denied*)
* **Punca**: Pelayar web moden hanya membenarkan capaian perkakasan kamera melalui sambungan selamat (`https://` atau `http://localhost`).
* **Penyelesaian**: Jika mengakses melalui alamat IP rangkaian makmal (cth: `http://192.168.1.50:3000`), sediakan sijil SSL/TLS atau aktifkan bendera *unsafely-treat-insecure-origin-as-secure* pada tetapan Chrome untuk tujuan ujian.

### B. Masalah Kemas Kini Service Worker PWA (*Stale Cache*)
* **Punca**: Service Worker menyimpan versi lama aplikasi untuk membolehkan mod luar talian berfungsi.
* **Penyelesaian**: Dalam pelayar Chrome, buka *Developer Tools (F12)* > tab *Application* > pilih *Service Workers* > tandakan kotak *"Update on reload"* atau tekan *"Unregister"*.

### C. Ralat Kompilasi Port Digunakan (*Port 3000 in use*)
* Jika port 3000 digunakan oleh perisian lain, anda boleh mengubah nombor port dengan arahan:
  ```bash
  npx vite --port=3001
  ```
