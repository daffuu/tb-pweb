# FTI Logistik - Tugas Besar PWEB
Aplikasi pengelolaan data master logistik menggunakan arsitektur Client-Server. Dibuat untuk memenuhi Tugas Besar mata kuliah Pemrograman Web (PWEB) FTI Universitas Andalas.

## Spesifikasi Teknologi
* **Backend:** Node.js + ExpressJS
* **Database:** MySQL (mysql2 native, non-ORM)
* **Frontend:** EJS + Basecoat UI
* **Version Control:** Git & GitHub

## Tahap 1: Otentikasi & ACL
Repository ini berisi implementasi tahap pertama yang mencakup:
1. Setup database MySQL `fti_logistik`.
2. Implementasi Otentikasi (Login/Logout) menggunakan `express-session` dan `bcrypt`.
3. Implementasi middleware ACL (Access Control List) untuk proteksi *route*.
4. Styling halaman login menggunakan Basecoat UI.

## Cara Instalasi & Menjalankan Aplikasi
1. Clone repository ini: `git clone https://github.com/daffuu/tb-pweb.git`
2. Masuk ke folder project: `cd tb-pweb`
3. Install dependencies: `npm install`
4. Buat database `fti_logistik` di MySQL dan import struktur SQL yang disediakan.
5. Setup file `.env` dengan kredensial database (HOST, USER, PASS, NAME).
6. Jalankan server: `npm start` atau `npx nodemon app.js`
7. Buka browser di `http://localhost:3000/login`

## Pembagian Tugas Anggota
* **Daffa Valiant Hansen (2411523004):** Solo Project. Mengerjakan modul B9 - Kelola Data Item (CRUD + SEI) dan Kelola Data Kategori (CRUD), termasuk setup otentikasi, middleware, database, dan antarmuka UI.