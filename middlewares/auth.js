// Middleware untuk ngecek user udah login atau belum
const isAuth = (req, res, next) => {
    // Kalau ada userId di session = udah login
    if (req.session.userId) {
        next();
    } else {
        // Kalau belum login = balik ke login
        res.send('Wah, lo dilarang masuk bro! Harus login dulu. <a href="/login">Balik ke Login</a>');
    }
};

module.exports = { isAuth };