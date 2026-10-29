# BEM FISIP Unpad 2026

Website Kabinet Pendar Mentari, menggunakan Next.js dan Sanity. Halaman admin tersedia di `/studio`.

## Menjalankan lokal

Gunakan Node.js 22.x dan pnpm 11.1.2. Salin [.env.example](.env.example) menjadi `.env.local`, lalu isi konfigurasinya.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Buka `http://localhost:3000`. Konten memakai Sanity project `jcpcptq3`, dataset `production`, term `2026`.

## Pemeriksaan

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm audit --prod --audit-level high
```

Untuk tes browser, jalankan `pnpm exec playwright install chromium webkit`, lalu `pnpm test:browser`. Fixture tes berada di `.next-check` dan tidak boleh di-deploy.

## Deployment

- Import branch/commit rilis ke Vercel dengan preset Next.js dan Node 22.x. Install: `pnpm install --frozen-lockfile`. Build: `pnpm build`. Output directory mengikuti default Next.js.
- Isi environment sesuai `.env.example`. Production memakai `NEXT_PUBLIC_SITE_ENV=production`, `NEXT_PUBLIC_SITE_URL=https://bemfisipunpad.com`, dan `SANITY_TEST_MODE=false`. Preview memakai `staging` agar tidak diindeks.
- Tambahkan domain di Vercel dan pasang record DNS sesuai dashboard project. Pilih satu alamat utama dan pastikan HTTPS aktif.
- Di Sanity, daftarkan origin pada CORS dengan credentials untuk Studio. Buat webhook POST ke `https://bemfisipunpad.com/api/revalidate`, dataset `production`, event Create/Update/Delete untuk konten published, projection `{_type}`, dan secret yang sama dengan `SANITY_REVALIDATE_SECRET` di hosting.
- Setelah deploy, cek halaman publik, login Studio, serta perubahan konten melalui webhook saat tab Live ditutup. Perubahan environment memerlukan redeploy.

Pemeriksaan HTTP/SEO setelah deploy:

```sh
node scripts/verify_deployment.mjs https://bemfisipunpad.com --environment production
```

## Pemeliharaan

Simpan export Sanity beserta asset di penyimpanan privat sebelum perubahan besar. Jangan commit secret, data sumber klien, atau backup.

Jika rilis bermasalah, kembalikan deployment sehat. Konten Sanity dipulihkan melalui revisi yang tersedia atau backup; rollback kode tidak mengembalikan data. Catat pemilik akun dan tanggal renewal domain.
