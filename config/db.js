const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verifikasi koneksi ke database saat server dijalankan
pool.getConnection()
    .then(conn => {
        console.log('Koneksi ke database fti_logistik berhasil.');
        conn.release();
    })
    .catch(err => {
        console.error('Gagal terhubung ke database:', err);
    });

module.exports = pool;