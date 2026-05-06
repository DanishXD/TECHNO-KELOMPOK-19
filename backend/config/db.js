// config/db.js — MySQL Connection Pool
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASS     || '',
  database:         process.env.DB_NAME     || 'study_ringkas',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅  Database MySQL terhubung!');
    conn.release();
  } catch (err) {
    console.error('❌  Gagal konek DB:', err.message);
  }
})();

module.exports = pool;
