const express = require('express');
const app = express();
const db = require('./config/db'); // Manggil koneksi DB yang tadi
require('dotenv').config();

const session = require('express-session');

// Setup EJS untuk render HTML
app.set('view engine', 'ejs');

// Setup Session biar user tetap login
app.use(session({
    secret: 'rahasia_negara_b9', // Password Bebas
    resave: false,
    saveUninitialized: false
}));

// Middleware biar bisa baca form input & JSON (ini udah ada dari sebelumnya)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route test awal
app.get('/', (req, res) => {
    res.send('Server FTI Logistik Jalan Bro!');
});

const bcrypt = require('bcrypt');

// Route sementara
app.get('/setup-admin', async (req, res) => {
    try {
        //hash password 'admin123'
        const passwordHash = await bcrypt.hash('admin123', 10);
        
        //Insert ke tabel users
        const [userResult] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            ['Admin FTI', 'admin@logistik.com', passwordHash]
        );
        
        const userId = userResult.insertId;

        // 3. Assign role 'admin_logistik' (id = 1) ke user ini
        await db.execute(
            'INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES (?, ?, ?)',
            [1, 'User', userId] 
        );

        res.send('Mantap bro! Akun Admin berhasil dibuat. Coba cek phpMyAdmin lo. Email: admin@logistik.com | Pass: admin123');
    } catch (error) {
        console.error(error);
        res.status(500).send('Waduh, error bro: ' + error.message);
    }
});

//Form Login
app.get('/login', (req, res) => {
    res.render('login'); // Nanti kita bikin file login.ejs
});

//Proses Form Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        //Cari user di database berdasarkan email
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        //Kalau email nggak ketemu
        if (users.length === 0) {
            return res.send('Waduh, email tidak ditemukan bro!');
        }

        const user = users[0];

        //Cocokin password yang diketik sama yang udah di hash di database
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.send('Password salah bro!');
        }

        //Kalau sukses, simpan data user ke dalam session
        req.session.userId = user.id;
        req.session.role = 'admin_logistik';
        res.send(`Login Sukses! Selamat datang, ${user.name}. Session lo aman.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error di server: ' + error.message);
    }
});

// Import middleware isAuth
const { isAuth } = require('./middlewares/auth');

// Route Dashboard (Cuma bisa diakses kalau lolos isAuth)
app.get('/dashboard', isAuth, (req, res) => {
    res.send(`
        <h2>Halo ${req.session.role}! Ini halaman Dashboard rahasia.</h2>
        <p>Cuma user yang udah login yang bisa liat halaman ini.</p>
        <a href="/logout"><button>Logout</button></a>
    `);
});

// Route Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Gagal logout bro!');
        }
        res.send('Sip, lo udah berhasil logout. <a href="/login">Login lagi</a>');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server nyala di http://localhost:${PORT}`);
});