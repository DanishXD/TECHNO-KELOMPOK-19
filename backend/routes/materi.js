// routes/materi.js
const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET semua materi
router.get('/', async (req, res) => {
  try {
    const { kategori, q } = req.query;
    let sql = 'SELECT * FROM materi';
    const params = [];
    const conditions = [];
    if (kategori && kategori !== 'Semua') { conditions.push('kategori = ?'); params.push(kategori); }
    if (q) { conditions.push('(judul LIKE ? OR isi_ringkasan LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET materi by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM materi WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST tambah materi
router.post('/', async (req, res) => {
  const { judul, kategori, isi_ringkasan, icon, progress_pct } = req.body;
  if (!judul || !kategori || !isi_ringkasan) {
    return res.status(400).json({ success: false, message: 'judul, kategori, isi_ringkasan wajib diisi' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO materi (judul, kategori, isi_ringkasan, icon, progress_pct) VALUES (?, ?, ?, ?, ?)',
      [judul, kategori, isi_ringkasan, icon || '📚', progress_pct || 0]
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Materi berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update materi
router.put('/:id', async (req, res) => {
  const { judul, kategori, isi_ringkasan, progress_pct } = req.body;
  try {
    await db.query(
      'UPDATE materi SET judul=?, kategori=?, isi_ringkasan=?, progress_pct=? WHERE id=?',
      [judul, kategori, isi_ringkasan, progress_pct, req.params.id]
    );
    res.json({ success: true, message: 'Materi berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE materi
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM materi WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Materi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
