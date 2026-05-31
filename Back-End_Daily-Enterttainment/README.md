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
```bash
# Masuk ke PostgreSQL via psql atau pgAdmin
psql -U postgres

# Buat database
CREATE DATABASE daily_entertainment;

# Keluar dari psql
\q
```

### 4. Setup Environment Variables
Buat file `.env` di dalam folder `Back-End_Daily-Enterttainment` dan sesuaikan nilainya:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=daily_entertainment
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Server
NODE_ENV=development
PORT=3000
```

### 5. Run Migration (Setup Database Schema)
Database yang digunakan menggunakan struktur spesifik untuk fitur Bookmark, History, Premium, dll.
Jalankan file SQL yang sudah fix:
```bash
psql -U postgres -d daily_entertainment -f database/schema.sql
```
*Catatan: Pastikan untuk menjalankan perintah di atas dari dalam direktori Back-End_Daily-Enterttainment.*

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
