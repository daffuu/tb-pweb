// Middleware untuk memvalidasi sesi login user
const isAuth = (req, res, next) => {
    // Lanjutkan request jika session user valid
    if (req.session.userId) {
        next();
    } else {
        // Tolak akses jika belum login
        res.send('Akses ditolak. Silakan login terlebih dahulu. <br><a href="/login">Kembali ke Login</a>');
    }
};

module.exports = { isAuth };