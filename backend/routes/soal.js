// routes/soal.js
const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET semua soal (join materi)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, m.judul AS materi_judul, m.kategori
      FROM soal s
      JOIN materi m ON s.materi_id = m.id
      ORDER BY s.id ASC
    `);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET soal by materi_id
router.get('/materi/:materi_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM soal WHERE materi_id = ? ORDER BY id ASC',
      [req.params.materi_id]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET soal by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM soal WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Soal tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST tambah soal
router.post('/', async (req, res) => {
  const { materi_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban, pembahasan } = req.body;
  if (!materi_id || !pertanyaan || !jawaban) {
    return res.status(400).json({ success: false, message: 'materi_id, pertanyaan, jawaban wajib diisi' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO soal (materi_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban, pembahasan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [materi_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban, pembahasan]
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Soal berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
