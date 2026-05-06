# 📚 Study Ringkas — v2

> Platform belajar digital mahasiswa · Ringkasan materi, bank soal interaktif, dan pembahasan lengkap.

**Kelompok 19 — Institut Pertanian Bogor 2026**

| Nama | NIM |
|------|-----|
| Naila Fadilla Stevhany Lestari | M0405241025 |
| Danish Hafid Wibisono | M0405241055 |
| Cornelius Bernadr Harefa | M0405241084 |

---

## 📁 Struktur Project

```
study-ringkas/
├── frontend/
│   ├── index.html      ← Semua halaman (SPA)
│   ├── style.css       ← Dark green theme
│   └── script.js       ← Logika & API calls
│
├── backend/
│   ├── server.js       ← Express server
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js       ← MySQL connection pool
│   └── routes/
│       ├── materi.js   ← CRUD materi
│       ├── soal.js     ← CRUD soal
│       └── users.js    ← Register & login
│
├── database/
│   └── study_ringkas.sql  ← Schema + seed data
│
└── README.md
```

---

## 🚀 Cara Menjalankan

### 1. Clone Repository
```bash
git clone https://github.com/kelompok19-ipb/study-ringkas.git
cd study-ringkas
```

### 2. Setup Database
```bash
mysql -u root -p < database/study_ringkas.sql
```

### 3. Setup Backend
```bash
cd backend
cp .env.example .env        # Sesuaikan DB_USER & DB_PASS
npm install
npm run dev                 # Development mode (nodemon)
# atau: npm start           # Production
```

### 4. Buka Frontend
Akses di browser: **http://localhost:3000**

---

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/status` | Health check + DB status |
| GET | `/api/materi` | Semua materi (filter: ?kategori=&q=) |
| GET | `/api/materi/:id` | Detail materi |
| POST | `/api/materi` | Tambah materi baru |
| PUT | `/api/materi/:id` | Update materi |
| DELETE | `/api/materi/:id` | Hapus materi |
| GET | `/api/soal` | Semua soal + nama materi |
| GET | `/api/soal/materi/:id` | Soal by materi |
| POST | `/api/soal` | Tambah soal |
| GET | `/api/users` | Daftar user |
| POST | `/api/users/register` | Registrasi user baru |
| POST | `/api/users/login` | Login user |

### Contoh Response `/api/status`
```json
{
  "status": "OK",
  "db": "connected",
  "project": "Study Ringkas",
  "kelompok": 19,
  "timestamp": "2026-05-06T10:00:00.000Z"
}
```

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML5, CSS3 (Custom Properties), Vanilla JS |
| Backend | Node.js, Express.js |
| Database | MySQL 8.x (mysql2) |
| Font | Sora, JetBrains Mono |
| Version Control | Git + GitHub |

---

## 🎨 Halaman Aplikasi

| Halaman | Deskripsi |
|---------|-----------|
| Beranda | Dashboard: status sensor, progress, jadwal, aksi cepat |
| Materi | Search, filter kategori, materi cards dengan progress bar |
| Bank Soal | Soal interaktif, timer, cek jawaban, pembahasan |
| Setelan | Profil user, toggle mode gelap, info kelompok |
