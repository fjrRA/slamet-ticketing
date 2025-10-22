# Slamet Ticketing

Aplikasi pemesanan tiket pendakian Gunung Slamet. Pengunjung bisa cek kuota, membuat booking, membayar via Midtrans (Snap), mengunduh tiket PDF, sementara admin mengelola jalur/slot/harga/penutupan, memantau pembayaran, serta melakukan check-in.

---

## Fitur

### Pengunjung
- Cek kuota per jalur & tanggal (filter rentang hari).
- Form anggota sesuai jumlah party.
- Buat booking (**wajib login**).
- Pembayaran via **Midtrans Snap**.
- Unduh tiket **PDF** setelah status **PAID**.
- Kelola **profil** & ganti **password**.

### Admin
- Dashboard ringkas (Pending, Paid, Today, Revenue).
- Daftar booking + pencarian & filter status.
- Ubah status (mark as **PAID/EXPIRED**) & detail booking.
- Kelola anggota, **check-in per anggota** atau **check-in semua** (hanya setelah **PAID**).
- CRUD **Trails**, **Slots** (bulk create), **Prices**, **Closures**.
- Daftar & manajemen **Users** (role).

---

## Teknologi

- **Frontend:** React + Vite, React Router, TanStack Query, Zod, Tailwind CSS (utility classes), Sonner (toast), `react-day-picker`
- **Backend:** Node.js + Express
- **Database:** MySQL (Prisma)
- **Auth:** JWT (httpOnly cookie)
- **Pembayaran:** Midtrans Snap (Client Key/Server Key)
- **PDF:** pdf-lib
- **TypeScript:** 5.8

---

## Menjalankan Secara Lokal

### Prasyarat
- **Node.js 18+**
- **MySQL** (lokal) atau layanan kompatibel (PlanetScale, dsb.)

### Konfigurasi `.env`

Buat file `.env` di root:

```env
# Server
NODE_ENV=development
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
COOKIE_NAME=sid
# COOKIE_DOMAIN dikosongkan saat dev (jangan isi 'localhost')
# COOKIE_DOMAIN=example.com

# Database (sesuaikan user/pass/host/db)
DATABASE_URL=mysql://root:password@localhost:3306/slamet_ticketing

# Base URL publik untuk callback Snap
PUBLIC_BASE_URL=http://localhost:5173

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx

# Optional: aktifkan mock pembayaran saat dev
# PAYMENTS_MOCK=1
```

---
## install deps
npm install

## generate prisma client
npx prisma generate

## migrasi database
npx prisma migrate dev

## jalankan client + server secara bersamaan
npm run dev

## atau terpisah:
npm run dev:server    # http://localhost:3000
npm run dev:client    # http://localhost:5173

---

## Midtrans + ngrok (local webhook)

Saat development, Midtrans perlu mengirim **Payment Notification** (webhook) ke server kamu. Karena server lokal tidak publik, gunakan **ngrok** untuk membuat URL HTTPS sementara.

### 1) Jalankan server lokal
Pastikan API kamu jalan di port 3000:
```bash
npm run dev:server       # http://localhost:3000
```

### 2) Jalankan ngrok
Unduh ngrok (Windows: ngrok.exe), login, lalu buat tunnel ke port 3000.
```bash
ngrok config add-authtoken <TOKEN_KAMU>
ngrok http 3000
```
Catat URL HTTPS yang muncul, misal:
```bash
https://ab12-34-56-78-90.ngrok-free.app
```

### 3) Konfigurasi di Midtrans Dashboard (Sandbox)
Masuk ke Midtrans Dashboard → Settings → Configuration (Sandbox).
- Payment Notification URL
Set ke:
```bash
https://<NGROK_HTTPS>/api/payments/midtrans/notifications
```
- Finish / Pending / Error Redirect URL (Snap)
Di app ini sudah di-override per transaksi via parameter callbacks saat create Snap token, yang diarahkan ke:
```bash
${PUBLIC_BASE_URL}/me/bookings
```

### 4) Cek konektivitas cepat
Coba akses endpoint health melalui ngrok (harus 200 OK):
```bash
GET https://<NGROK_HTTPS>/api/health
```

### 5) Uji alur pembayaran
- Buat booking → klik Bayar → selesaikan pembayaran sandbox.
- Midtrans akan memanggil webhook:
  
  ```bash
  POST https://<NGROK_HTTPS>/api/payments/midtrans/notifications
  ```

  Pastikan server tidak melindungi route ini dengan auth (memang tidak di app ini) dan memverifikasi signature Midtrans.
---

## Troubleshooting
- Ngrok URL tidak HTTPS → pastikan pakai URL https://… (Midtrans mensyaratkan HTTPS).
- Webhook 404 → pastikan route backend benar: /api/payments/midtrans/notifications.
- 401/403 → jangan pasang middleware auth di endpoint webhook.
- Status booking tidak update → cek log server; pastikan handler webhook mengubah status dan tidak error validasi.
