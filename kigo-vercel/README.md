# KiGo Game Hub

Situs statis (HTML + CSS + JS), tanpa backend dan tanpa build.

## Struktur
- `index.html`, `css/style.css`, `js/app.js`
- `js/games.js` — daftar game (edit di sini)
- `assets/kigo-icon.jpg` — ikon resmi KiGo (tidak diubah)
- `assets/dihcipline.apk` — file instal DIHCIPLINE (Android)

## Jalankan lokal
Buka `index.html` langsung, atau jalankan `python3 -m http.server` lalu buka http://localhost:8000.

## Deploy (pilih salah satu)
- **Netlify**: app.netlify.com/drop → seret folder `kigo` ke halaman itu.
- **Cloudflare Pages**: Create project → Direct Upload → unggah folder (batas 25 MB per file; APK ini 8,7 MB).
- **GitHub Pages**: unggah semua file ke repo → Settings → Pages → Branch `main` / root.
- **Hosting biasa (cPanel)**: unggah isi folder ke `public_html` lewat File Manager/FTP.
Gunakan HTTPS agar unduhan APK tidak diblokir browser.

## Mengganti APK
Timpa `assets/dihcipline.apk` dengan nama sama (atau ubah `url` di `js/games.js`). Perbarui `size` jika ukurannya berubah.

## Menambah game
Tambahkan objek baru di `js/games.js`. Game web: `type:"web"`, isi `url`, `status:"Available"`. Hanya situs yang mengizinkan embed yang tampil di iframe; yang lain tetap bisa dibuka lewat tombol "Buka di tab baru".

## Catatan
- APK hanya bisa dipasang di Android (tidak di iPhone/desktop).
- Server harus menyajikan `.apk` sebagai file unduhan; host di atas sudah mendukungnya.

## Mode DIHCIPLINE
`index.html` kini halaman khusus DIHCIPLINE. Hub lengkap ada di `hub.html` (tidak ditautkan). Untuk mengembalikan hub: ganti nama `hub.html` menjadi `index.html`.

## Main di browser
Game web ada di `game/dihcipline.html` (diambil dari assets/www/index.html di dalam APK, tanpa diubah). Game memuat three.js dari cdnjs.cloudflare.com, jadi pemain butuh internet.

## Leaderboard bersama (Vercel)
`api/leaderboard.js` menyimpan skor di Upstash Redis. Tidak perlu `npm install`.
1. Deploy folder ini ke Vercel sebagai proyek (lewat GitHub atau `vercel` CLI), bukan sekadar drop zip.
2. Di dashboard Vercel: proyek → Storage → Create Database → Upstash Redis → hubungkan ke proyek.
3. Redeploy. Variabel `KV_REST_API_URL`/`KV_REST_API_TOKEN` (atau `UPSTASH_REDIS_REST_*`) terisi otomatis.
4. Cek `https://DOMAIN-ANDA/api/leaderboard`. Harus tampil `{"top":[],"me":null}`.
Jika API tidak tersedia, game memakai leaderboard lokal seperti semula.
