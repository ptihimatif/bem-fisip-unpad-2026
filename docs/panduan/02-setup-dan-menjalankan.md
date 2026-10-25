# 02 – Setup dan menjalankan

## Kebutuhan

- Node.js 22 (CI memakai 22.18.0).
- pnpm 11.1.2. Repositori menyatakan `packageManager: pnpm@11.1.2` dan memakai `pnpm-lock.yaml`. Aktifkan dengan `corepack enable` atau install pnpm versi itu.
- Git.
- Akses baca ke repositori GitHub `ptihimatif/bem-fisip-unpad-2026`.
- Untuk mengedit konten lewat Studio: akun Sanity yang sudah diundang ke project `jcpcptq3`.

`npm run <script>` juga bisa menjalankan script yang sama. Untuk install dependency, tetap pakai pnpm supaya lockfile tidak berubah.

## Langkah pertama

```bash
git clone https://github.com/ptihimatif/bem-fisip-unpad-2026.git
cd bem-fisip-unpad-2026
pnpm install
cp .env.example .env.local   # lalu isi nilainya, lihat tabel di bawah
pnpm dev
```

Buka `http://localhost:3000`. Studio ada di `http://localhost:3000/studio`.

## Environment variable

Semua file `.env*` kecuali `.env.example` diabaikan oleh git (`.gitignore`). Jangan pernah commit nilai rahasia.

| Nama | Wajib | Rahasia | Isi | Dipakai di |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Ya | Tidak | `jcpcptq3` | `sanity/env.ts` |
| `NEXT_PUBLIC_SANITY_DATASET` | Ya | Tidak | `production` | `sanity/env.ts` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Tidak | Tidak | `2026-09-04` (default kalau kosong) | `sanity/env.ts` |
| `NEXT_PUBLIC_SITE_URL` | Untuk production | Tidak | Alamat utama website, misalnya `https://bemfisipunpad.com`. Default `https://bemfisipunpad.com`. | metadata, canonical, sitemap, robots, JSON-LD |
| `SANITY_REVALIDATE_SECRET` | Untuk production | **Ya** | String acak panjang, sama dengan secret webhook di Sanity | `app/api/revalidate/route.ts` |

Catatan:

- Jangan beri awalan `NEXT_PUBLIC_` pada secret. Variabel berawalan itu ikut terkirim ke browser.
- Website tidak memakai token Sanity untuk membaca. `defineLive` sengaja diset `serverToken: false` dan `browserToken: false`, jadi draft tidak mungkin bocor ke publik.
- Kalau project ID atau dataset kosong di luar CI/test, aplikasi berhenti dengan error `Missing environment variable: …`.

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `pnpm dev` | Server development dengan hot reload di port 3000. CSP **tidak** aktif di mode ini. |
| `pnpm build` | Build production. Wajib lolos sebelum merge. |
| `pnpm start` | Menjalankan hasil build (mode production, CSP aktif). Port lain: `PORT=3123 pnpm start`. |
| `pnpm lint` | ESLint untuk seluruh repo. |
| `pnpm typecheck` | `tsc --noEmit`, cek tipe tanpa build. |
| `pnpm test` | Unit test di `tests/**/*.test.ts` (`node:test` lewat `tsx`). |
| `pnpm typegen` | Ekstrak schema Sanity ke `schema.json` lalu generate tipe ke `sanity.types.ts`. Jalankan setiap kali schema atau query berubah. |

## Quality gate sebelum push

Urutan yang sama dengan CI:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Untuk perubahan tampilan, tambahkan:

- `pnpm start` lalu cek halaman yang terkait di browser, termasuk ukuran HP (lebar sekitar 390px). Perhatikan Console: tidak boleh ada error `Content-Security-Policy`.
- Detector Impeccable untuk file UI yang diubah: `node .agents/skills/impeccable/scripts/detect.mjs <path>`.

### Test yang ada

| File | Yang diuji |
| --- | --- |
| `tests/urls.test.ts` | `safeExternalUrl` hanya menerima URL `https:` dan menolak `http:` serta `javascript:` |
| `tests/revalidate.test.ts` | Webhook menolak tanpa secret (503), tanpa signature atau signature palsu (401), dan menerima signature yang benar |

Test webhook mengimpor `@sanity/webhook`, yang terpasang sebagai dependency dari `next-sanity`. Kalau suatu saat tidak ditemukan, tambahkan sebagai devDependency.

## CI (GitHub Actions)

File: `.github/workflows/quality.yml`.

- Berjalan pada push ke `main` dan `dev`, serta setiap pull request.
- Langkah: checkout, pnpm 11.1.2, Node 22.18.0, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` dan `NEXT_PUBLIC_SANITY_DATASET` diambil dari **repository variables** GitHub (`vars.*`), bukan secrets, karena nilainya publik.

## Alur kerja Git

- `main` harus selalu siap rilis. `dev` adalah branch integrasi.
- Kerjakan fitur di branch pendek (`page/about`, `feat/members`, dan seterusnya), lalu buat pull request ke `dev`.
- Satu PR untuk satu pekerjaan yang utuh. Satu orang mengerjakan, satu orang mereview.
- Ambil perubahan terbaru dari `dev` sebelum push:

  ```bash
  git add .
  git commit -m "feat: ..."
  git pull origin dev      # selesaikan konflik kalau ada
  git push origin <nama-branch>
  ```

- Aturan proyek (`AGENTS.md`): rencanakan dulu, minta persetujuan, baru ubah file. Ini berlaku untuk manusia maupun AI agent.
