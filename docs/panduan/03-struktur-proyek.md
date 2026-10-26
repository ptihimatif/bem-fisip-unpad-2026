# 03 – Struktur proyek

## Folder utama

```text
app/                      Route Next.js (App Router)
  layout.tsx              Layout global: font Inter, Navbar, metadata default, JSON-LD, <SanityLive />
  page.tsx                Beranda
  about/                  /about
  article/                /article (arsip artikel & kajian) + error.tsx
  post/[slug]/            /post/<slug> (detail artikel/kajian) + error.tsx
  penjelasan/[birdep]/    /penjelasan/<slug unit> (detail Departemen/Biro/Bidang)
  hima/                   /hima (direktori Himpunan/Huria) + error.tsx
  studio/[[...tool]]/     /studio (Sanity Studio)
  api/revalidate/         Webhook revalidasi dari Sanity
  sitemap.ts, robots.ts   SEO
  error.tsx, not-found.tsx, loading.tsx   State global
  globals.css             Token warna/font Tailwind dan animasi carousel
components/               Komponen bersama
  about/                  Komponen khusus halaman About
sanity/
  env.ts                  Membaca dan memvalidasi environment Sanity
  structure.ts            Susunan menu di Studio (Site Settings & Cabinet Profile sebagai singleton)
  schemaTypes/            Definisi schema konten (lihat bab 04)
  lib/
    client.ts             Klien Sanity (CDN on)
    live.ts               sanityFetch + SanityLive (hanya konten published)
    queries.ts            Semua query GROQ + CONTENT_TERM = "2026"
    image.ts              urlFor(): pembuat URL gambar Sanity
    urls.ts               safeExternalUrl(): hanya izinkan link https
    cache.ts              Nama cache tag bersama: sanity-content
  fixtures/               Contoh data lokal (jangan diimpor ke production)
sanity.config.ts          Konfigurasi Studio (basePath /studio)
sanity.types.ts           Tipe hasil `pnpm typegen` (jangan diedit manual)
schema.json               Ekstrak schema hasil `pnpm typegen` (jangan diedit manual)
scripts/                  Script impor data satu kali (lihat di bawah)
tests/                    Unit test
public/                   Aset statis (logo, gambar dekorasi, font)
docs/                     Dokumentasi (folder ini)
next.config.ts            Header keamanan (CSP), remotePatterns gambar Sanity
```

## Daftar halaman

| Route | File | Data dari Sanity | Isi |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | siteSettings, cabinetProfile, program unggulan, publikasi terbaru, mapres | Hero, "Mengapa Pendar Mentari?" (overview + video YouTube), Program Kami, Mahasiswa Berprestasi, Siaran Pers (embed Instagram), Artikel dan Kajian (3 terbaru lintas kategori menurut tanggal) |
| `/about` | `app/about/page.tsx` | siteSettings, organizationUnit, member | Filosofi logo, Visi, Misi, Budaya Kerja, Nilai, Ketua & Wakil, Sekretariat & Kepala Bidang, Pimpinan Departemen & Biro, tombol ke 17 Departemen/Biro |
| `/article` | `app/article/page.tsx` | post | Arsip artikel & kajian. Filter `?category=semua|artikel|kajian`, urut `?sort=terbaru|terlama`, halaman `?page=` (5 per halaman) |
| `/post/[slug]` | `app/post/[slug]/page.tsx` | post, siteSettings | Detail artikel/kajian: judul, kategori, tanggal (WIB), gambar, isi, link Instagram |
| `/penjelasan/[birdep]` | `app/penjelasan/[birdep]/page.tsx` | organizationUnit (+ program dan member yang mereferensikannya) | Nama unit, deskripsi, daftar Program Kerja, Pimpinan, anggota |
| `/hima` | `app/hima/page.tsx` | studentAssociation | Grid logo Hima/Huria, klik untuk detail |
| `/studio` | `app/studio/[[...tool]]/page.tsx` | — | Sanity Studio |
| `/sitemap.xml` | `app/sitemap.ts` | post, organizationUnit | Halaman statis + semua post + semua unit |
| `/robots.txt` | `app/robots.ts` | — | Izinkan semua kecuali `/studio/` dan `/api/` |

`/penjelasan/<slug>` yang tidak ada menampilkan halaman not-found. Detailnya ada di bab 07, bagian keterbatasan.

## Komponen

### Bersama (`components/`)

| Komponen | Client? | Fungsi |
| --- | --- | --- |
| `Navbar.tsx` | Ya | Navigasi atas tetap (fixed), menu HP dengan tombol buka/tutup. Daftar menu statis; link Care Center memakai Site Settings. |
| `Footer.tsx` | Tidak | Logo, menu, dan sosial. Site Settings mengatur Care Center serta sosial; default lama dipakai sampai daftar CMS ditandai lengkap. |
| `SanityImage.tsx` | Tidak | Gambar Sanity: membuat URL berukuran tertentu, alt text, placeholder blur (LQIP), `unoptimized`. |
| `SanityPortableText.tsx` | Tidak | Merender rich text Sanity (paragraf, h1/h2, quote, list, bold/italic, link https). |
| `ArticleCard.tsx` | Tidak | Kartu artikel/kajian untuk beranda dan arsip. Tanggal diformat dalam zona waktu `Asia/Jakarta`. |
| `ArticleFilterSort.tsx` | Tidak | Tombol filter dan urutan di `/article`, berupa link (tanpa JavaScript). |
| `ProgramCarousel.tsx` | Ya | Carousel program unggulan di beranda + modal detail program. |
| `ProgramList.tsx` | Ya | Daftar nama program di halaman unit, dipisah garis `|`. Mengukur ulang saat lebar layar berubah. |
| `InfiniteCarousel.tsx` | Ya | Carousel berjalan otomatis (mapres, pimpinan). Berhenti saat hover/fokus kecuali `pauseOnHover={false}`. |
| `HimaGallery.tsx` | Ya | Grid logo Hima/Huria dan panel detail. |
| `InstagramEmbed.tsx` | Ya | Embed profil Instagram `@bemfisipunpad` lewat `embed.js` Instagram. |
| `ParallaxImage.tsx` | Ya | Gambar dekorasi yang bergeser pelan saat scroll. |
| `ScrollToSectionButton.tsx` | Ya | Tombol "Lebih Lanjut Tentang Kami" di hero. |
| `ErrorBoundary.tsx` | Ya | Tampilan error yang dipakai `error.tsx` per route. |
| `PageLoading.tsx` | Tidak | Tampilan loading global (`app/loading.tsx`). |

### Halaman About (`components/about/`)

| Komponen | Fungsi | Sumber isi |
| --- | --- | --- |
| `LogoSection.tsx` + `logo-section.ts` | Filosofi logo: pecahan logo yang dijelaskan satu per satu saat scroll | Sanity `cabinetProfile.logoExplanationItems`, fallback di `logo-section.ts` |
| `VisiSection.tsx` | Visi + penjabaran | Sanity `cabinetProfile.vision` dan `visionHighlights`, fallback di kode |
| `MisiSection.tsx` | Misi | Sanity `cabinetProfile.missionItems`, fallback di kode |
| `BudayaKerjaSection.tsx` | Budaya kerja | Sanity `cabinetProfile.workCultureItems`, fallback di kode |
| `NilaiSection.tsx` | Nilai kabinet | Sanity `cabinetProfile.values`, fallback di kode |
| `KetuaWakilSection.tsx` | Ketua & Wakil Ketua | Sanity `member`, role tepat `Ketua` / `Wakil Ketua` |
| `PetinggiCarouselSections.tsx` | Dua carousel: Sekretaris Umum + Kepala Bidang; Kepala/Wakil Kepala Departemen & Biro | Sanity `member`, dicocokkan dengan pola role (lihat bab 04) |
| `LeadershipCard.tsx` | Kartu foto pimpinan/anggota, placeholder inisial jika tanpa foto | — |
| `DepartemenBiroSection.tsx` | 17 tombol Departemen/Biro dengan latar mesh dari `public/assets/about/depbir/` | Sanity `organizationUnit` dengan `unitKind` `departemen`/`biro` |
| `MeshBackground.tsx`, `MeshBackgroundBright.tsx` | Latar gradasi dekoratif | — |

## Aset statis (`public/`)

| Folder | Isi |
| --- | --- |
| `assets/LOGO KABINET/` | Logo kabinet lengkap (`logo-full.png`, `logo-gabungan.png`) dan pecahan logo untuk section filosofi |
| `assets/home/` | Gambar dekorasi beranda (`asset1.png` sampai `asset5.png`) |
| `assets/about/` | Gambar dekorasi About; `depbir/` berisi latar tombol Departemen/Biro |
| `assets/logo/` | Ikon media sosial (SVG) |
| `assets/FOTO HIMHUR/`, `assets/artikel/` | Aset lama/pendukung |
| `assets/favicon.ico` | Favicon |
| `fonts/Inter/` | Font Inter variable (normal dan italic) |

Nama folder yang mengandung spasi harus ditulis dengan `%20` di URL, misalnya `/assets/LOGO%20KABINET/logo-full.png`.

## Script (`scripts/`)

Script impor dipertahankan untuk verifikasi/pemulihan data klien. Mode tulis menyentuh **production**; jalankan hanya dengan otoritas dan backup. Preflight, dry run, dan verify harus dibedakan dari apply/rollback. `check_browser.mjs` hanya menjalankan fixture lokal/CI.

| Script | Fungsi |
| --- | --- |
| `preflight_members.py` | Memvalidasi file anggota dari klien dan menyiapkan rencana impor tanpa menulis ke Sanity |
| `import_members.mjs` | Mengimpor daftar anggota 2026 dan foto ID card (`--dry-run`, `--apply`, `--verify`) |
| `update_cabinet_values.mjs` | Mengisi 4 nilai kabinet beserta penjelasannya |
| `import_mapres_proker.mjs` + `mapres-proker-source.json` | Mengimpor 10 mapres dan 86 proker |
| `import_progul_covers.mjs` | Impor/verify/pemulihan lima cover yang disetujui; lihat bab 10 |
| `prepare_about_content.mjs`, `apply_about_content.mjs` | Menyiapkan, memverifikasi, dan memulihkan empat field About; lihat bab 09 |
| `check_browser.mjs` | Build dan browser test fixture tanpa mengakses data klien |

Cara menjalankan (contoh): `pnpm exec sanity exec scripts/import_members.mjs --with-user-token -- --dry-run`. Hasil backup dan daftar ID yang dibuat disimpan di folder `outputs/` yang diabaikan git.
