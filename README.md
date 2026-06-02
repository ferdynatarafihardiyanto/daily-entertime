# Daily Entertainment - Frontend

Aplikasi web portal hiburan harian (Film, Musik, Berita) yang dibangun menggunakan **Next.js**. Proyek ini merupakan antarmuka pengguna (Frontend) yang terhubung secara dinamis dengan Backend Express.js & PostgreSQL.

**Made by Grup 4 - Kak Alvi - Celerates**

---

## 🚀 Fitur Utama

- **Autentikasi Aman:** Sistem Login dan Register menggunakan JWT (JSON Web Token) yang diamankan di `localStorage`.
- **Katalog Dinamis:** Menampilkan daftar Film, Musik, dan Berita yang bersumber langsung dari database (Live Data).
- **Sistem Bookmark & Riwayat:** Pengguna dapat menyimpan konten favorit (Bookmark) dan melihat riwayat konten yang terakhir dilihat (History) secara terpusat.
- **Dashboard Admin Terpisah:** Halaman khusus bagi Admin untuk menambah/menghapus konten (Film, Musik, Berita) dan mengatur jadwal tayang mingguan.
- **UI/UX Modern:** Antarmuka responsif dan gelap (Dark Mode) bergaya premium dengan animasi interaktif.
- **Pencarian Cepat:** Fitur pencarian *real-time* di berbagai kategori konten.

---

## 📋 Prasyarat Sistem

Pastikan perangkat Anda telah terinstal:
- **Node.js** versi 18.x atau lebih tinggi ([Unduh di sini](https://nodejs.org/))
- **NPM** atau **Yarn**
- **Backend Server** (Daily Entertainment Backend) harus sudah berjalan (biasanya di `http://localhost:3000`).

---

## 🛠️ Instalasi & Persiapan

1. **Clone Repository (Jika belum)**
   ```bash
   git clone https://github.com/ferdynatarafihardiyanto/daily-entertime.git
   cd "daily-entertime"
   ```

2. **Install Semua Dependencies**
   Install pustaka yang dibutuhkan menggunakan NPM:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment (Penting!)**
   Buat file bernama `.env.local` di folder *root* proyek ini. File ini digunakan untuk menyambungkan Frontend dengan Backend API. Tambahkan baris berikut:
   ```env
   # Ganti URL ini sesuai dengan alamat Backend Anda berjalan
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

---

## 💻 Panduan Menjalankan Aplikasi

### Mode Development (Pengembangan)
Gunakan perintah ini saat Anda sedang memodifikasi kode. Halaman akan otomatis dimuat ulang jika ada perubahan kode.
```bash
npm run dev
```
Buka `http://localhost:3001` (atau port yang diberikan oleh Next.js di terminal) pada browser Anda.

### Mode Production (Siap Rilis)
Gunakan perintah ini untuk mencoba versi akhir aplikasi yang sudah dioptimalkan sebelum di-hosting.
```bash
npm run build
npm start
```

### Memeriksa Kualitas Kode (Linting)
```bash
npm run lint
```

---

## 📁 Struktur Direktori

Berikut adalah penjelasan struktur folder agar Anda mudah menavigasi kode:

```text
Final Project/
├── components/          # Komponen UI yang digunakan berulang kali
│   ├── AdminSidebar.js  # Navigasi samping khusus Admin
│   ├── Sidebar.js       # Navigasi samping khusus Pengguna
│   ├── Layout.js        # Tata letak global aplikasi
│   ├── GlobalPlayer.js  # Pemutar musik global
│   └── Schedule.js      # Jadwal mingguan UI
├── pages/               # Semua halaman rute Next.js
│   ├── admin/           # Folder rute Dashboard Admin (jadwal, tambah konten)
│   ├── berita/          # Folder rute detail berita
│   ├── film/            # Folder rute detail film
│   ├── musik/           # Folder rute detail musik
│   ├── bookmark.js      # Halaman menu Simpan
│   ├── history.js       # Halaman menu Riwayat
│   ├── index.js         # Halaman Beranda utama
│   └── login.js         # Halaman Login
├── styles/              # Konfigurasi CSS secara Global
├── lib/                 # Utilitas fungsional
│   └── api.js           # SELURUH FUNGSI KOMUNIKASI KE BACKEND ADA DI SINI
├── public/              # Tempat penyimpanan gambar logo, ilustrasi, dll
└── package.json         # Daftar dependencies NPM
```

---

## 🚀 Panduan Deployment (Vercel / Hosting)

Aplikasi ini sangat cocok dan disarankan untuk di-*deploy* menggunakan [Vercel](https://vercel.com).

### Deployment via Vercel:
1. Dorong (*push*) proyek Anda ke GitHub/GitLab.
2. Buat proyek baru di Vercel dan hubungkan repository tersebut.
3. Di bagian **Environment Variables** pada Vercel, tambahkan `NEXT_PUBLIC_API_URL` dan isi dengan alamat domain backend *production* Anda (misal: `https://api-daily-entertainment.com`).
4. Klik **Deploy** dan Vercel akan mengurus sisanya.

---

## ⚙️ Catatan Arsitektur

- **Pengelolaan State:** Tidak menggunakan Redux; mengandalkan React Hooks (`useState`, `useEffect`) dan Context API jika diperlukan.
- **Keamanan Token:** Token sesi Login tidak disimpan di *cookie*, melainkan di `localStorage`. `lib/api.js` memuat logika *Interceptor* untuk otomatis melampirkan token pada setiap kueri ke Backend.
- **Strict Mode:** Diaktifkan di `next.config.js` untuk deteksi bug lebih dini saat mode Development.

---
*Dokumentasi ini ditulis untuk mempermudah anggota tim maupun penerus proyek dalam melanjutkan atau memelihara kode Frontend Daily Entertainment.*
