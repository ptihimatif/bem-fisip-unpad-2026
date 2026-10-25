# 02 – Setup dan menjalankan

## Kebutuhan

- Node.js 22.18.0, mengikuti `.node-version` dan CI.
- pnpm 11.1.2, mengikuti `packageManager` dan `pnpm-lock.yaml`.
- Git dan akses repositori. Editor Studio perlu akun yang diundang ke project Sanity.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Isi identitas project/dataset yang disetujui sebelum menjalankan development. Di PowerShell, gunakan `Copy-Item .env.example .env.local`. Website berada di `http://localhost:3000`, Studio di `/studio`.

## Environment variable

Semua `.env*` selain `.env.example` diabaikan Git. Jangan menyalin secret ke dokumentasi atau browser.

| Nama | Kegunaan |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project yang disetujui untuk lingkungan tersebut. Project 2026 saat audit: `jcpcptq3`. |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset lingkungan tersebut. Dataset yang sudah ada saat audit: `production`. Dataset staging belum dibuat. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Default `2026-09-04`. |
| `NEXT_PUBLIC_SITE_ENV` | `development`, `staging`, atau `production`. Hanya production yang boleh diindeks. |
| `NEXT_PUBLIC_SITE_URL` | Origin lengkap, misalnya `https://<domain-yang-disetujui>`, tanpa path/query/fragment. Wajib untuk staging dan production. Tidak ada lagi fallback ke domain publik yang belum diputuskan. |
| `SANITY_REVALIDATE_SECRET` | Secret server, harus cocok dengan webhook. Jangan gunakan awalan `NEXT_PUBLIC_`. |
| `SANITY_TEST_MODE` | `false` untuk deployment. `true` hanya untuk fixture lokal/CI melalui perintah pemeriksaan. Mode ini ditolak pada build Vercel/Netlify. |

Untuk development lokal, origin default adalah `http://localhost:3000`. Untuk release gunakan HTTPS dan environment eksplisit. Copy `.env.example` memberi nilai `development`; ubah ke `staging` atau `production` pada hosting. Hosting dengan nilai development ditolak.

`CI=true` tidak lagi mengizinkan project/dataset kosong. Pemeriksaan terisolasi harus memilih mode test secara eksplisit. Website publik tetap membaca published saja, tanpa token baca draft.

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `pnpm dev` | Development dengan data lingkungan yang dikonfigurasi. |
| `pnpm build` | Build aplikasi sungguhan; konfigurasi release harus lengkap. |
| `pnpm start` | Menjalankan hasil build; `pnpm start -p 3123` untuk port lain. |
| `pnpm build:check` | Build production-mode dengan fixture di `.next-check`, terpisah dari hasil build aplikasi sungguhan di `.next`. |
| `pnpm test:browser` | Build fixture lalu delapan pemeriksaan Chromium desktop/mobile. Tidak membaca atau menulis dataset klien. |
| `pnpm test:browser:built` | Ulangi suite pada hasil build fixture terakhir di `.next-check`. |
| `pnpm lint` | ESLint. |
| `pnpm typecheck` | Pemeriksaan TypeScript tanpa emit. |
| `pnpm test` | Tes perilaku URL, environment, CMS mapping, dan autentikasi webhook di `tests/*.test.ts`. |
| `pnpm typegen` | Ekstrak schema dan hasilkan ulang `sanity.types.ts` setelah perubahan schema/query. |
| `pnpm audit --prod` | Laporan advisori saat ini; tinjau relevansi setiap laporan. |

Pasang browser sekali sebelum suite: `pnpm exec playwright install chromium`. Di Linux CI, workflow memakai `--with-deps`.

## Quality gate

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm test:browser
```

CI menjalankan urutan tersebut di Node 22.18.0/pnpm 11.1.2 dan mengunggah trace/screenshot ketika browser test gagal. Fixture mencakup program dengan/tanpa rich text, gambar kosong, konten About terstruktur, filter artikel, serta slug yang tidak ada. Build hosting sungguhan harus diuji lagi pada konfigurasi dan domain staging yang dipilih.

Fixture dan data published adalah dua hal berbeda. Lolosnya CI tidak membuktikan CORS, login Studio, webhook yang terpasang, atau data resmi telah disetujui klien.

## Git dan deployment

`dev` adalah branch integrasi saat ini. Pada audit 2026-10-26, `main` masih scaffold awal. Jangan menganggap `main` siap production hanya karena menjadi default branch. Pilih branch rilis, review perbedaan lewat PR, dan tunggu persetujuan merge/deploy.

Perubahan lokal pada pekerjaan ini tidak membuat commit, push, merge, atau deployment. Checklist keputusan ada di [bab 08](08-checklist-rilis.md).
