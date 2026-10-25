# 04 – Model konten Sanity

Project `jcpcptq3`, dataset `production`. Schema ada di `sanity/schemaTypes/`, query di `sanity/lib/queries.ts`.

## Aturan yang berlaku untuk semua tipe

- **`term`**: setiap dokumen punya field `term` yang hanya bisa bernilai `2026` (default otomatis). Semua query memfilter `term == $term`. Dokumen tanpa term 2026 tidak tampil.
- **Hanya published**: website membaca dengan `perspective: "published"`. Draft tidak pernah tampil.
- **Gambar** dibuat dengan helper `imageField()` (`shared.ts`):
  - hotspot aktif, jadi editor bisa menentukan titik fokus potongan gambar;
  - field `alt` (teks alternatif) **wajib** diisi kalau ada gambar;
  - field `attribution` (kredit foto) opsional.
- **URL** dibuat dengan `httpsUrlField()`: hanya menerima `https://`. Di website, link juga dicek lagi dengan `safeExternalUrl()`.
- **`displayOrder`**: angka bulat ≥ 0 untuk mengatur urutan tampil. Angka kecil tampil lebih dulu. Kalau kosong, urutan jatuh ke kriteria berikutnya (biasanya nama).

## Ringkasan tipe dokumen

| Tipe (`_type`) | Judul di Studio | Jumlah published (snapshot 2026-10-26) | Dipakai di |
| --- | --- | --- | --- |
| `siteSettings` | Site Settings (singleton) | 1 | Metadata SEO global |
| `cabinetProfile` | Cabinet Profile (singleton) | 1 | Beranda (nama kabinet, overview) |
| `organizationUnit` | Organization Unit | 24 (13 departemen, 4 biro, 5 bidang, 2 pengurus inti) | About, `/penjelasan/[slug]`, sitemap |
| `member` | Member | 268 (3 tanpa foto) | About, `/penjelasan/[slug]` |
| `program` | Program | 86 (3 unggulan) | Beranda, `/penjelasan/[slug]` |
| `mapres` | Mahasiswa Berprestasi | 10 (semua punya referensi foto) | Beranda |
| `post` | Publication | 6 (3 artikel, 3 kajian) | Beranda, `/article`, `/post/[slug]`, sitemap |
| `studentAssociation` | Student Association (Himpunan / Huria) | 9 | `/hima` |

## Detail per tipe

Kolom "Tampil?" menunjukkan apakah field itu benar-benar dirender website saat ini. Field yang "Belum" aman diisi, tapi tidak akan terlihat sampai kodenya dibuat.

### `siteSettings` (ID tetap `siteSettings-2026`)

| Field | Tipe | Wajib | Tampil? |
| --- | --- | --- | --- |
| `organizationName` | string | Ya | Ya, fallback judul SEO |
| `seoTitle` | string (≤60) | | Ya, `<title>` default |
| `seoDescription` | text (≤160) | | Ya, meta description default |
| `ogImage` | gambar | | Ya, default social preview. |
| `officialEmail`, `officialAddress` | string/text | | Belum |
| `socialLinks[]` | {platform, url} | | Ya, footer dan JSON-LD; daftar lama menjadi fallback sampai `replaceDefaultSocialLinks` diaktifkan. |
| `fisipCareCenterUrl` | url | | Ya, navbar/footer. |

### `cabinetProfile` (ID tetap `cabinetProfile-2026`)

| Field | Tipe | Tampil? |
| --- | --- | --- |
| `cabinetName` (wajib) | string | Ya, di hero beranda |
| `overview` | rich text | Ya, "Mengapa Pendar Mentari?" di beranda |
| `profileVideoUrl` | url | Ya, host/ID YouTube divalidasi sebelum menjadi iframe. |
| `vision` | text | Ya, kalimat visi. |
| `values[]` | {title, description} | Ya, kartu Nilai; ada fallback salinan lama. |
| `visionHighlights[]` | {phrase, description} | Penjelasan phrase visi, dengan fallback sampai migrasi disetujui. |
| `missionItems[]`, `workCultureItems[]` | {title, description} | Kartu terstruktur baru, dengan fallback salinan lama. |
| `logoExplanationItems[]` | {elementKey, title, description} | Teks elemen logo dengan kunci presentasi tetap. |
| `missions[]`, `workCulture[]`, `logoPhilosophy[]`, `tagline` | legacy | Dipertahankan sebagai referensi; tidak diparse otomatis untuk kartu baru. |

`siteSettings` dan `cabinetProfile` adalah singleton: Studio membukanya langsung lewat menu "Site Settings" dan "Cabinet Profile", dan tombol buat dokumen baru untuk kedua tipe ini disembunyikan (`sanity.config.ts`, `sanity/structure.ts`).

### `organizationUnit`

| Field | Tipe | Wajib | Tampil? |
| --- | --- | --- | --- |
| `officialName` | string | Ya | Ya |
| `abbreviation` | string | | Belum di halaman unit |
| `slug` | slug (dari `officialName`) | Ya | Ya, alamat `/penjelasan/<slug>` |
| `unitKind` | `biro` / `departemen` / `pengurus_inti` / `bidang` | Ya | Ya, menentukan apakah unit muncul di tombol About (hanya `departemen` dan `biro`) |
| `description` | text | Ya | Ya |
| `coverImage`, `gallery[]`, `contactLinks[]` | | | Belum ditampilkan |
| `displayOrder` | number | | Ya, urutan di About |

### `member`

| Field | Tipe | Wajib | Tampil? |
| --- | --- | --- | --- |
| `name` | string | Ya | Ya (alt text foto) |
| `role` | string | Ya | Ya, **menentukan section** (lihat di bawah) |
| `organizationUnit` | reference | Ya | Ya |
| `photo` | gambar | | Ya. Tanpa foto, kartu menampilkan inisial nama. |
| `displayOrder` | number | | Ya |
| `socialLink` | url | | Belum |
| `isLeader` | boolean | | Hanya untuk urutan query |

**Penting: penempatan anggota ditentukan oleh teks `role` persis.**

| Section | Aturan role | File |
| --- | --- | --- |
| About – Ketua dan Wakil Ketua | tepat `Ketua` atau `Wakil Ketua` | `components/about/KetuaWakilSection.tsx` |
| About – Sekretariat & Bidang | tepat `Sekretaris Umum`, atau diawali `Kepala Bidang` | `components/about/PetinggiCarouselSections.tsx` |
| About – Pimpinan Departemen & Biro | diawali `Kepala Departemen`, `Wakil Kepala Departemen`, `Kepala Biro`, `Wakil Kepala Biro` | sama |
| Halaman unit – pimpinan | diawali `Kepala`, `Ketua`, `Wakil Kepala`, atau `Wakil Ketua` | `app/penjelasan/[birdep]/page.tsx` |
| Halaman unit – anggota | role lain | sama |

Salah ketik (misalnya `Kepala departemen` tetap cocok karena tidak peka huruf besar, tapi `Kadep` tidak) membuat anggota tidak muncul di section pimpinan.

### `program`

| Field | Tipe | Wajib | Tampil? |
| --- | --- | --- | --- |
| `name` | string | Ya | Ya |
| `slug` | slug (dari `name`) | Ya | Belum dipakai (belum ada halaman detail program) |
| `shortDescription` | text (≤240 disarankan) | | Ya, di kartu dan modal program unggulan |
| `description` | rich text | | Ya, di modal program unggulan |
| `coverImage` | gambar | | Ya, kartu program unggulan |
| `organizationUnit` | reference (unit 2026) | Ya | Ya, menentukan di halaman unit mana program muncul |
| `isFeatured` | boolean | | Ya: hanya program `true` yang masuk "Program Kami" di beranda (maksimal 6) |
| `displayOrder` | number | | Ya |
| `externalLink` | url | | Ya: nama program di halaman unit menjadi link |
| `startDate`, `endDate` | date | | Belum |

### `mapres`

| Field | Tipe | Wajib | Tampil? |
| --- | --- | --- | --- |
| `nama_mapres` | string | Ya | Ya |
| `studyProgram` | string | Ya | Ya, "Ilmu Politik 2023" |
| `cohortYear` | number | Ya | Ya |
| `rank` | 1–3 | | Hanya untuk urutan |
| `achievementTitle` | string | | Ya, hanya kalau diisi |
| `achievementYear` | number | | Ya, dalam kurung setelah prestasi |
| `image` | gambar | | Ya. Tanpa foto, kartu menampilkan siluet. |
| `instagramUrl` | url | | Ya, kartu menjadi link |
| `displayOrder` | number | | Ya |

Urutan di beranda: `displayOrder`, lalu `rank`, lalu nama. Maksimal 12.

### `post` (artikel/kajian)

| Field | Tipe | Wajib | Tampil? |
| --- | --- | --- | --- |
| `postCategory` | `artikel` / `kajian` | Ya | Ya |
| `judul` | string | Ya | Ya |
| `slug` | slug (dari `judul`) | Ya | Ya, `/post/<slug>` |
| `publishedAt` | datetime | Ya | Ya, ditampilkan dalam WIB |
| `excerpt` | text (≤240) | | Ya, di kartu |
| `image` | gambar | | Ya |
| `body` | rich text | Ya | Ya. Mendukung paragraf, heading, quote, list, bold, italic, link https. Gambar di dalam isi belum didukung. |
| `instagramUrl` | url | | Ya, tombol "Lihat Unggahan Resmi di Instagram" |
| `seoTitle`, `seoDescription` | string/text | | Ya, metadata halaman post |
| `seoImage` | gambar | | Ya, social preview post; fallback cover/default global. |
| `isFeatured`, `displayOrder` | | | Belum |

### `studentAssociation` (Hima/Huria)

| Field | Tipe | Wajib | Tampil? |
| --- | --- | --- | --- |
| `officialName` | string | Ya | Ya |
| `abbreviation` | string | | Ya |
| `studyProgram` | string | Ya | Ya |
| `cabinetName` | string | | Ya |
| `description` | text | | Ya |
| `logo` | gambar | | Ya. Disarankan persegi; logo dipotong ke 200×200. |
| `officialLink` | url | | Ya |
| `socialLinks[]` | {platform, url} | | Belum |
| `displayOrder` | number | | Ya |

## Query (`sanity/lib/queries.ts`)

| Query | Dipakai di | Isi |
| --- | --- | --- |
| `SITE_SETTINGS_QUERY` | layout, semua halaman (footer) | Dokumen `siteSettings-2026` |
| `CABINET_PROFILE_QUERY` | beranda | Dokumen `cabinetProfile-2026` |
| `FEATURED_PROGRAMS_QUERY` | beranda | Program `isFeatured`, urut `displayOrder` lalu nama, maks 6 |
| `PROGRAM_BY_SLUG_QUERY` | belum dipakai | Disiapkan untuk halaman detail program |
| `PUBLICATION_CARDS_QUERY` | beranda | 6 post terbaru |
| `PUBLICATION_PAGE_QUERY` | `/article` | Semua post, terbaru dulu |
| `POST_BY_SLUG_QUERY` | `/post/[slug]` | Satu post lengkap |
| `MAPRES_QUERY` | beranda | Maks 12 mapres |
| `ORGANIZATION_UNITS_QUERY` | `/about` | Semua unit |
| `ORGANIZATION_UNIT_BY_SLUG_QUERY` | `/penjelasan/[slug]` | Satu unit + program + anggota yang mereferensikannya |
| `MEMBERS_QUERY` | `/about` | Semua anggota dari unit 2026 |
| `STUDENT_ASSOCIATIONS_QUERY` | `/hima` | Semua Hima/Huria |
| `SITEMAP_POSTS_QUERY`, `SITEMAP_UNITS_QUERY` | sitemap | Slug dan tanggal update |

## Mengubah schema atau query

1. Ubah file di `sanity/schemaTypes/` atau `sanity/lib/queries.ts`.
2. Jalankan `pnpm typegen` supaya `schema.json` dan `sanity.types.ts` ikut berubah.
3. Perbaiki error tipe dengan `pnpm typecheck`.
4. Kalau field baru wajib, data lama mungkin jadi tidak valid di Studio. Rencanakan pengisian atau migrasinya.
5. Studio di production baru menampilkan field baru setelah kode di-deploy.
6. Menghapus atau mengganti nama field **tidak** menghapus data lama di Sanity. Data lama tetap ada sampai dimigrasi.

Perubahan schema yang menyentuh data production termasuk perubahan berisiko. Ikuti `.skills/sanity-cms/SKILL.md` dan buat rencana + backup sebelum menulis ke dataset.

## Konten yang masih hardcoded

Per 2026-10-26, komponen sudah membaca field aktif di bawah. Salinan statis menjadi fallback untuk field terstruktur yang belum diisi; manifest migrasi empat field disiapkan tetapi belum dipublikasikan. Lihat [bab 09](09-konten-about-dan-favicon.md). Menu navigasi dan asset/animasi logo tetap menjadi konfigurasi kode.

| Konten | Lokasi kode | Field Sanity yang sebenarnya sudah ada |
| --- | --- | --- |
| Filosofi logo | `components/about/logo-section.ts` | `cabinetProfile.logoExplanationItems` |
| Visi dan penjabarannya | `components/about/VisiSection.tsx` | `cabinetProfile.vision` + `visionHighlights` |
| Misi | `components/about/MisiSection.tsx` | `cabinetProfile.missionItems` |
| Budaya kerja | `components/about/BudayaKerjaSection.tsx` | `cabinetProfile.workCultureItems` |
| Nilai | `components/about/NilaiSection.tsx` | `cabinetProfile.values` |
| Video profil YouTube | `app/page.tsx` (`znT9GP-2LYo`) | `cabinetProfile.profileVideoUrl` |
| Menu navigasi dan link FISIP Care Center | `components/Navbar.tsx`, `components/Footer.tsx` | `siteSettings.fisipCareCenterUrl` |
| Ikon dan link media sosial | `components/Footer.tsx` | `siteSettings.socialLinks` |
| Akun sosial di JSON-LD | `app/layout.tsx` | `siteSettings.socialLinks` |
| Profil Instagram di "Siaran Pers" | `components/InstagramEmbed.tsx` | — |

Footer dan JSON-LD sekarang memakai helper sosial yang sama di `lib/site-content.ts`.
