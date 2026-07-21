# MotoRent Malang

Platform penyewaan motor terbaik dan terpercaya di Malang Raya. Website ini memudahkan pelanggan untuk menyewa motor secara online dengan fitur unggulan seperti verifikasi dokumen otomatis, manajemen armada, sistem denda keterlambatan, dan dashboard admin yang intuitif.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Database / Backend:** Supabase (PostgreSQL, Auth, Storage)

## Prasyarat
- Node.js versi 18 atau lebih baru.
- Akun Supabase dengan project yang sudah di-setup.

## Cara Install
1. Clone repository ini:
   ```bash
   git clone https://github.com/adityarajadn/web-rental-motor-malang.git
   cd web-rental-motor-malang
   ```
2. Install dependensi:
   ```bash
   npm install
   ```

## Environment Variables
Buat file `.env.local` di root folder proyek Anda. Berikut adalah variabel yang dibutuhkan:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[YOUR_ANON_KEY]
```
> **Catatan:** Jangan pernah menyertakan `SERVICE_ROLE_KEY` di variabel lingkungan publik.

## Cara Menjalankan Proyek
Untuk menjalankan proyek di *local development environment*:
```bash
npm run dev
```
Buka browser dan arahkan ke `http://localhost:3000`.

## Struktur Folder
```text
├── app/                  # Routing utama Next.js (App Router)
│   ├── admin/            # Dashboard khusus Admin
│   ├── auth/             # Halaman Login & Register
│   ├── fleet/            # Katalog Motor
│   └── my-bookings/      # Riwayat pesanan pelanggan
├── components/           # Komponen UI yang reusable
├── constants/            # Berisi magic numbers dan enum konstan
├── lib/                  # Konfigurasi library eksternal (Supabase, dll)
├── services/             # Abstraksi pemanggilan API (Pemisahan Logic)
└── types/                # Definisi Interface dan Type TypeScript
```

## Konvensi Branch dan Commit
Semua anggota tim wajib mengikuti aturan berikut:
- **Branch Naming:** `fitur/nama-fitur`, `bugfix/nama-bug`, `hotfix/darurat`
- **Commit Message:** 
  Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: menambahkan login system`
  - `fix: memperbaiki error di dashboard`
  - `refactor: memisahkan logic dari ui`

## Cara Deployment (Vercel)
1. Push kode Anda ke repository GitHub.
2. Login ke Vercel dan buat *New Project*.
3. Import repository ini.
4. Di bagian **Environment Variables**, tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Klik **Deploy**.

## Daftar Anggota Tim
- **Raja** (Lead Developer)
- *Tim Dev Lainnya*

---
Dibuat dengan ❤️ untuk proyek rental motor Malang.
