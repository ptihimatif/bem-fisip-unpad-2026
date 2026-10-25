# 06 – Deploy dan operasional

> Hosting, domain, DNS, dan pemilik akses production **belum dicatat secara resmi** (lihat `.agents/PROJECT_CONTEXT.md`, tabel ownership). Brief merekomendasikan Vercel. Langkah di bawah ditulis untuk Vercel, tapi berlaku juga untuk hosting Node.js lain yang menjalankan `pnpm build` dan `pnpm start`.
>
> Setiap perubahan pada deployment, domain, DNS, pengaturan Sanity, atau konten production butuh persetujuan pemilik akses dan rencana rollback.

## Checklist deploy pertama

1. Hubungkan repositori GitHub ke project hosting. Branch production: `main`.
2. Build command `pnpm build`, install command `pnpm install --frozen-lockfile`, Node.js 22.
3. Isi environment variable production (lihat [bab 02](02-setup-dan-menjalankan.md#environment-variable)):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=jcpcptq3`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `NEXT_PUBLIC_SANITY_API_VERSION=2026-09-04`
   - `NEXT_PUBLIC_SITE_URL=https://<domain-resmi>`
   - `SANITY_REVALIDATE_SECRET=<string acak, minimal 32 karakter>`
4. Daftarkan domain production di **CORS origins** Sanity (lihat [CORS](#cors-sanity)).
5. Buat webhook revalidasi (lihat [Webhook revalidasi](#webhook-revalidasi)).
6. Deploy, lalu jalankan [smoke test](#smoke-test-setelah-deploy).

Membuat secret acak, misalnya: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## Header keamanan

Diatur di `next.config.ts`. Semua route mendapat:

| Header | Nilai | Fungsi |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | Browser tidak menebak tipe file |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Membatasi info referrer ke situs lain |
| `X-Frame-Options` | `SAMEORIGIN` | Website tidak bisa di-iframe situs lain |
| `X-Powered-By` | dimatikan (`poweredByHeader: false`) | Tidak mengumumkan framework |

Khusus production (`NODE_ENV=production`) ada **Content-Security-Policy**:

| Directive | Izin | Alasan |
| --- | --- | --- |
| `default-src` | `'self'` | Default: hanya dari domain sendiri |
| `script-src` | `'self' 'unsafe-inline' https://www.instagram.com https://core.sanity-cdn.com` | Next.js menyisipkan script inline untuk hydration; tanpa nonce, `'unsafe-inline'` wajib (panduan CSP Next.js, bagian "Without Nonces"). Instagram untuk embed, `core.sanity-cdn.com` untuk Studio. |
| `style-src` | `'self' 'unsafe-inline'` | Style inline dari React/Tailwind/Studio |
| `img-src` | `'self' data: https://cdn.sanity.io https://www.instagram.com` | Gambar Sanity dan placeholder blur (data URI) |
| `font-src` | `'self' https://design-system-static.sanity.io` | Inter lokal + font Studio |
| `connect-src` | `'self' https://*.sanity.io wss://*.api.sanity.io` | Query, Live, dan realtime Studio |
| `frame-src` | `'self' https://www.youtube.com https://www.instagram.com` | Video profil dan embed Instagram |
| `object-src` | `'none'` | Tidak ada plugin |
| `base-uri`, `form-action`, `frame-ancestors` | `'self'` | Mencegah pembajakan base URL, form, dan iframe |

**Kalau menambah layanan pihak ketiga** (script, iframe, font, gambar dari domain baru), tambahkan domainnya ke directive yang sesuai. Kalau lupa, fitur itu diam-diam diblokir **hanya di production**, karena `pnpm dev` tidak mengirim CSP. Selalu tes dengan `pnpm build && pnpm start` dan perhatikan error `Content-Security-Policy` di Console browser.

Header dibaca saat build, jadi perubahan `next.config.ts` baru berlaku setelah build ulang.

Opsi lebih ketat di masa depan: CSP dengan nonce per request (panduan yang sama). Konsekuensinya semua halaman jadi dirender per request dan tidak bisa statis.

## Webhook revalidasi

Tujuannya: konten yang di-publish saat tidak ada pengunjung tetap langsung segar di cache.

1. sanity.io/manage → project `jcpcptq3` → **API** → **Webhooks** → **Create webhook**.
2. URL: `https://<domain-resmi>/api/revalidate`.
3. Dataset `production`. Trigger: Create, Update, Delete. HTTP method: POST.
4. Projection: `{_type}`.
5. Secret: sama persis dengan `SANITY_REVALIDATE_SECRET` di hosting.
6. Simpan, publish satu perubahan kecil, lalu cek **Attempts log** webhook.

Respons endpoint (`app/api/revalidate/route.ts`):

| Status | Arti | Tindakan |
| --- | --- | --- |
| 200 `{"revalidated":true}` | Berhasil; cache tag `sanity-content` dibuang | — |
| 503 | `SANITY_REVALIDATE_SECRET` belum diisi di hosting | Isi env, deploy ulang |
| 401 | Signature salah atau tidak ada | Samakan secret di Sanity dan hosting |
| 400 | Body tidak valid atau tidak ada `_type` | Cek projection `{_type}` |

Endpoint menunggu sekitar 3 detik sebelum membuang cache, supaya data di Sanity sudah konsisten. Endpoint ini diuji di `tests/revalidate.test.ts`. Detail tambahan: `docs/SANITY_REVALIDATION.md`.

## CORS Sanity

Browser hanya boleh mengambil data Sanity dari alamat yang terdaftar. Tanpa ini, **update live** di halaman dan **login Studio** gagal dengan error CORS di Console.

sanity.io/manage → project `jcpcptq3` → **API** → **CORS origins**. Daftarkan:

- `https://<domain-resmi>` dengan **Allow credentials** (untuk Studio);
- domain preview kalau dipakai;
- `http://localhost:3000` untuk development.

Port lain (misalnya `localhost:3123` saat tes `pnpm start`) akan kena error CORS kalau tidak didaftarkan. Itu bukan bug kode.

## SEO

- **Metadata default** (`app/layout.tsx`): judul dan deskripsi dari Site Settings, Open Graph dan Twitter card, `lang="id"`, favicon.
- **Per halaman**: `/article` dan `/hima` punya metadata tetap. `/post/[slug]` memakai `seoTitle`/`seoDescription` atau judul/excerpt, plus canonical. `/penjelasan/[slug]` memakai nama dan deskripsi unit.
- **JSON-LD Organization** di layout: nama, URL, logo, akun sosial (hardcoded).
- **`/sitemap.xml`**: beranda, about, article, hima, semua post, semua unit (termasuk Bidang dan Pengurus Inti). Selalu data terbaru.
- **`/robots.txt`**: izinkan semua kecuali `/studio/` dan `/api/`, menunjuk ke sitemap.

Setelah domain aktif: daftarkan di Google Search Console dan submit `https://<domain>/sitemap.xml`.

## Smoke test setelah deploy

1. Buka `/`, `/about`, `/article`, `/hima`, satu `/post/<slug>`, satu `/penjelasan/<slug>`. Semua harus tampil (bukan error).
2. Di ukuran HP: buka/tutup menu, geser carousel program, klik kartu program (modal terbuka), klik logo Hima (detail terbuka).
3. Console browser: tidak ada error `Content-Security-Policy`.
4. `/studio`: bisa login dan membuka dokumen.
5. Publish perubahan kecil, lalu pastikan halaman berubah dan webhook menunjukkan 200.
6. `/sitemap.xml` dan `/robots.txt` bisa dibuka dan memakai domain yang benar.

Langkah 1–3 juga bisa diuji lokal dengan `pnpm build && pnpm start`.

## Rollback

| Masalah | Cara mundur |
| --- | --- |
| Deploy baru rusak | Di Vercel: Deployments → pilih deploy terakhir yang sehat → **Promote to Production**. Lalu `git revert` commit penyebabnya lewat PR. |
| Konten salah ter-publish | Studio → dokumen → **History** → pilih versi sebelumnya → Restore → Publish. |
| Dokumen terhapus | Studio History tidak bisa memulihkan dokumen yang dihapus. Pulihkan dari backup dataset. |
| Webhook bermasalah | Nonaktifkan webhook di Sanity. Situs tetap jalan; konten diperbarui lewat Sanity Live dan deploy berikutnya. |

## Backup konten

Sebelum perubahan besar (impor massal, migrasi schema, pergantian tahun), ekspor dataset:

```bash
pnpm exec sanity dataset export production backup-YYYY-MM-DD.tar.gz
```

Butuh login Sanity CLI (`pnpm exec sanity login`) dengan akses ke project. Simpan file backup di luar repositori; file ini berisi seluruh konten, termasuk nama dan foto anggota.

## Keamanan dan privasi

- Jangan commit file `.env*`. Hanya `.env.example` yang boleh ada di git.
- Website tidak memakai token baca Sanity. Draft tidak bisa bocor ke publik.
- Semua link dari konten dicek `safeExternalUrl()`: hanya `https:`. Link `javascript:` dan `http:` dibuang.
- Embed pihak ketiga hanya YouTube (iframe dengan `sandbox`) dan Instagram.
- `/studio` terbuka untuk siapa saja, tapi hanya akun yang diundang ke project Sanity yang bisa login dan mengedit. Kelola anggota di sanity.io/manage dan cabut akses pengurus yang sudah selesai masa jabatannya.
- Foto dan nama anggota adalah data pribadi. Pastikan ada persetujuan sebelum dipublikasikan.
