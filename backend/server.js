// =====================================================
// STUDY RINGKAS — server.js
// Backend API · Kelompok 19 IPB 2026
// =====================================================

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const db         = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---- MIDDLEWARE ----
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ---- ROUTES ----
app.use('/api/materi', require('./routes/materi'));
app.use('/api/soal',   require('./routes/soal'));
app.use('/api/users',  require('./routes/users'));

// ---- STATUS / HEALTH CHECK ----
app.get('/api/status', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await db.query('SELECT 1');
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'disconnected';
  }
  res.json({
    status:    'OK',
    db:        dbStatus,
    project:   'Study Ringkas',
    kelompok:  19,
    anggota: [
      'Naila Fadilla Stevhany Lestari — M0405241025',
      'Danish Hafid Wibisono — M0405241055',
      'Cornelius Bernadr Harefa — M0405241084',
    ],
    timestamp: new Date().toISOString(),
  });
});

// ---- SERVE FRONTEND ----
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ---- START ----
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║      STUDY RINGKAS — Backend API     ║');
  console.log('║      Kelompok 19 · IPB 2026          ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`\n🚀  Server : http://localhost:${PORT}`);
  console.log(`📡  API    : http://localhost:${PORT}/api`);
  console.log(`❤️   Status : http://localhost:${PORT}/api/status\n`);
});

module.exports = app;
