// routes/users.js
const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET semua user (tanpa password)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nama, nim, email, created_at FROM users ORDER BY id ASC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST register user baru
router.post('/register', async (req, res) => {
  const { nama, nim, email, password } = req.body;
  if (!nama || !email || !password) {
    return res.status(400).json({ success: false, message: 'nama, email, password wajib diisi' });
  }
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    const [result] = await db.query(
      'INSERT INTO users (nama, nim, email, password) VALUES (?, ?, ?, ?)',
      [nama, nim || '', email, password]
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'email & password wajib diisi' });
  }
  try {
    const [rows] = await db.query('SELECT id, nama, nim, email FROM users WHERE email=? AND password=?', [email, password]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Email atau password salah' });
    res.json({ success: true, message: 'Login berhasil', user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
