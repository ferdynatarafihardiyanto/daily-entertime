# Final Project - Setup Next.js Produksi

Setup Next.js dengan JavaScript murni untuk tahap produksi.

## 🚀 Fitur

- Next.js 14 dengan JavaScript murni
- Konfigurasi produksi yang dioptimalkan
- Struktur folder yang terorganisir
- ESLint untuk kualitas kode
- Komponen yang dapat digunakan kembali

## 📋 Prasyarat

- Node.js 18.x atau lebih tinggi
- npm atau yarn

## 🛠️ Instalasi

1. Install dependencies:
```bash
npm install
```

## 📝 Perintah yang Tersedia

### Development
```bash
npm run dev
```
Menjalankan server development di http://localhost:3000

### Production Build
```bash
npm run build
```
Membangun aplikasi untuk produksi

### Production Start
```bash
npm start
```
Menjalankan aplikasi produksi

### Linting
```bash
npm run lint
```
Memeriksa kualitas kode dengan ESLint

## 📁 Struktur Folder

```
final-project/
├── components/       # Komponen yang dapat digunakan kembali
│   ├── Layout.js
│   ├── Header.js
│   └── Footer.js
├── pages/           # Halaman aplikasi
│   ├── _app.js
│   ├── _document.js
│   ├── index.js
│   └── about.js
├── styles/          # File CSS global
│   └── globals.css
├── lib/             # Fungsi utilitas
│   ├── utils.js
│   └── api.js
├── public/          # File statis
└── package.json
```

## 🔧 Konfigurasi Lingkungan

Buat file `.env` di root project dan tambahkan variabel lingkungan:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
```

Lihat `.env.example` untuk referensi.

## 🚀 Deployment

### Vercel (Disarankan)
1. Push ke GitHub/GitLab
2. Import project ke Vercel
3. Deploy otomatis

### Manual Deployment
1. Build aplikasi:
```bash
npm run build
```

2. Start produksi:
```bash
npm start
```

## 📝 Catatan Produksi

- React Strict Mode diaktifkan
- SWC Minify diaktifkan untuk build lebih cepat
- Kompresi diaktifkan
- Optimasi gambar diaktifkan
- Source maps dinonaktifkan di produksi
- Powered by header dinonaktifkan untuk keamanan

## 🤝 Kontribusi

Silakan buat issue dan pull request untuk perbaikan.

## 📄 Lisensi

MIT
