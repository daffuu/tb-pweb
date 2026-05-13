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

// Tes koneksi 
pool.getConnection()
    .then(conn => {
        console.log('Database fti_logistik berhasil connect bro!');
        conn.release();
    })
    .catch(err => {
        console.error('Waduh, gagal connect database:', err);
    });

module.exports = pool;