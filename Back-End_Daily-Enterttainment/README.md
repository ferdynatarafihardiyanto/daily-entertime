# Backend - Daily Entertainment

Backend API untuk aplikasi Daily Entertainment.

**Made by Grup 4 - Kak Alvi - Celerates**

## 📋 Prerequisites

Sebelum install, pastikan sudah install:
- **Node.js** v14+ ([download](https://nodejs.org))
- **PostgreSQL** v12+ ([download](https://www.postgresql.org))
- **Git**

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/pingkydwi/Final_Project.git
cd "Final Project/Back-End_Daily-Enterttainment"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database

**Opsi 1: Menggunakan pgAdmin (Disarankan - Visual/GUI)**
1. Buka aplikasi **pgAdmin 4** di laptopmu dan login.
2. Pada panel sebelah kiri, buka dropdown **Servers** -> **PostgreSQL**.
3. Klik kanan pada **Databases** -> pilih **Create** -> **Database...**
4. Isi kolom `Database` dengan nama `final_daily_entertainment` (atau `daily_entertainment` sesuai kemauanmu).
5. Klik tombol **Save**. Database kosong berhasil dibuat!

**Opsi 2: Menggunakan Terminal / CMD (psql)**
```bash
psql -U postgres
# Buat database
CREATE DATABASE final_daily_entertainment;
# Keluar dari psql
\q
```

### 4. Setup Environment Variables
1. Cari file bernama `.env.example` di dalam folder `Back-End_Daily-Enterttainment`.
2. *Copy* (salin) file tersebut dan ubah nama salinannya menjadi **`.env`** (tanpa ekstensi .example).
3. Buka file `.env` tersebut.
4. **Wajib:** Ubah nilai `DB_PASSWORD` dengan password PostgreSQL milikmu sendiri. Jika kamu mengubah nama database pada langkah 3, ubah juga nilai `DB_NAME`.

### 5. Run Migration (Setup Database Schema)
Aplikasi butuh tabel khusus untuk fitur Bookmark, History, dll. Kamu harus memasukkan strukturnya (schema):

**Cara via pgAdmin:**
1. Klik kanan pada database yang baru kamu buat tadi (misal: `final_daily_entertainment`).
2. Pilih menu **Query Tool**.
3. Klik icon "Folder" (Open File) pada barisan atas *Query Tool*, lalu cari file `database/schema.sql` di folder project ini.
4. Setelah file terbuka dan teks SQL-nya muncul, klik icon **Play (Execute/F5)** di atasnya untuk membuat semua tabel secara otomatis.

**Cara via Terminal (Opsional):**
```bash
# Pastikan terminal berada di direktori Back-End_Daily-Enterttainment
psql -U postgres -d final_daily_entertainment -f database/schema.sql
```

### 6. Generate Admin & Data Awal (Opsional)
Ada beberapa script yang disediakan di folder `scripts/` untuk membantu setup awal:
```bash
# Membuat akun admin secara otomatis
node scripts/createAdmin.js

# Mengisi data dummy user
node scripts/seedUsers.js
```

### 7. Start Server
```bash
# Development (menggunakan nodemon)
npm run dev

# Production
npm start
```
Server akan running di `http://localhost:3000`

## 📁 Struktur Project
```text
src/
├── config/          # Database connection
├── controllers/     # Request handlers
├── middleware/      # Auth, Role middleware
├── models/          # Database queries
├── routes/          # API routes
├── services/        # Business logic
└── utils/           # Constants & helpers
database/
└── schema.sql       # SQL Database Structure (Fix Version)
scripts/             # Setup and Migration Scripts
server.js            # Entry point
```

## 🔧 Fitur API Utama
- **Authentication**: Register, Login, Token Refresh, Logout
- **Content**: Manajemen Film, Musik, Berita (Admin)
- **Bookmark & History**: Penyimpanan dinamis (User)
- **Schedule**: Manajemen jadwal acara
- **User Management**: Lihat daftar pengguna (Admin)

---
*Dokumentasi ini telah disederhanakan dan dibersihkan agar mempermudah pemeliharaan (maintenance) aplikasi di masa mendatang.*
