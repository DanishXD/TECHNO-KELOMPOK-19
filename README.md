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