const express = require('express');
const app = express();
const db = require('./config/db'); // Menginisialisasi koneksi database
require('dotenv').config();
const session = require('express-session');
const bcrypt = require('bcrypt');

// Menyiapkan EJS sebagai view engine
app.set('view engine', 'ejs');

// Konfigurasi session untuk manajemen login
app.use(session({
    secret: 'rahasia_negara_b9', // Secret key untuk session
    resave: false,
    saveUninitialized: false
}));

// Middleware untuk membaca form input & JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route test awal
app.get('/', (req, res) => {
    res.send('Server FTI Logistik Berjalan Baik.');
});

// Menampilkan Form Login
app.get('/login', (req, res) => {
    res.render('login');
});

// Proses Form Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Mengecek ketersediaan user di database berdasarkan email
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        // Handling jika email tidak ditemukan
        if (users.length === 0) {
            return res.send('Email tidak ditemukan.');
        }

        const user = users[0];

        // Memverifikasi kecocokan password dengan hash di database
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.send('Password tidak valid.');
        }

        // Menyimpan data kredensial ke dalam session jika login berhasil
        req.session.userId = user.id;
        req.session.role = 'admin_logistik';
        res.send(`Login Berhasil! Selamat datang, ${user.name}. <br><br><a href="/dashboard">Masuk ke Dashboard</a>`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server: ' + error.message);
    }
});

// Import middleware isAuth
const { isAuth } = require('./middlewares/auth');

// Route Dashboard dengan proteksi middleware
app.get('/dashboard', isAuth, (req, res) => {
    res.render('dashboard', { role: req.session.role });
});

// Route Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Gagal melakukan logout.');
        }
        res.send('Anda telah berhasil logout. <a href="/login">Kembali ke Login</a>');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});