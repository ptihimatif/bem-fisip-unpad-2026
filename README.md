# BEM FISIP Unpad 2026

Website resmi Kabinet Pendar Mentari: profil organisasi, program kerja, mahasiswa berprestasi, artikel/kajian, dan direktori Himpunan/Huria.

Next.js 16 App Router, React 19, Tailwind CSS 4, dan Sanity Studio di `/studio`. Identitas yang dipertahankan: Inter, biru `#003089`, dan kuning `#FFBA3A`.

## Mulai sesuai kebutuhan

- **Deployment, domain, biaya, dan pemulihan:** [Handover deployment hemat](docs/HANDOVER_DEPLOYMENT_HEMAT_2026.md). Anggaran domain maksimal Rp300.000; hosting ditargetkan gratis. Termasuk transfer `bemfisipunpad.org`.
- **Admin non-IT:** [Panduan singkat di Google Docs](https://docs.google.com/document/d/1WUWX1EqEH65x5WhbnqzRFuC-HRcywVLblcPnjKbZ-Fo), atau [panduan editor lengkap](docs/panduan/05-panduan-editor-konten.md). Cukup browser dan akun Sanity yang diundang.
- **Developer penerus:** [indeks dokumentasi](docs/panduan/README.md), [setup](docs/panduan/02-setup-dan-menjalankan.md), [struktur proyek](docs/panduan/03-struktur-proyek.md), dan [model konten](docs/panduan/04-model-konten-sanity.md).

## Menjalankan lokal — developer

Gunakan Node 22.x (lokal/CI dipatok 22.18.0) dan pnpm 11.1.2.

```sh
pnpm install --frozen-lockfile
```

Salin `.env.example` menjadi `.env.local`, isi environment yang diperlukan, lalu:

```sh
pnpm dev
```

Website dan Studio tersedia di `http://localhost:3000` dan `http://localhost:3000/studio`.

## Pemeriksaan sebelum rilis

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm audit --prod --audit-level high
pnpm exec playwright install chromium webkit
pnpm test:browser
```

Suite browser membangun fixture terisolasi di `.next-check`. **Jangan deploy fixture.** Hosting menjalankan `pnpm build` dengan `SANITY_TEST_MODE=false`, origin HTTPS yang benar, dan environment rilis eksplisit. Build data asli memakai `.next`; jangan menghapus cache dev saat server berjalan.

## Operasional dan batas perubahan

Konten 2026 berada di project Sanity `jcpcptq3`, dataset `production`, term `2026`. Admin menerbitkan melalui Studio; webhook bertanda tangan ke `/api/revalidate` menyegarkan cache tanpa full redeploy.

Script impor/pemulihan di `scripts/` dipertahankan untuk developer, bukan admin konten. Jangan menjalankannya terhadap production tanpa otoritas dan backup. Source klien, export, foto mentah, serta arsip cleanup lokal diabaikan Git.

Aturan maintenance ringkas: [AGENTS.md](AGENTS.md). Periksa [checklist rilis](docs/panduan/08-checklist-rilis.md) pada target hosting; lolos tes lokal tidak menyatakan domain atau webhook sudah aktif.

Setelah hosting tersedia, jalankan pemeriksaan baca-saja berikut dengan origin dan slug published yang sebenarnya:

```sh
node scripts/verify_deployment.mjs https://DOMAIN-RESMI --environment staging --post SLUG-POST --unit SLUG-UNIT
```

Ganti menjadi `--environment production` saat domain resmi sudah siap diindeks. Script memeriksa route, metadata, canonical, JSON-LD, robots, sitemap, Studio noindex, dan favicon; tidak login atau mengubah konten. Uji admin/webhook dan pemulihan tetap mengikuti checklist handover.
