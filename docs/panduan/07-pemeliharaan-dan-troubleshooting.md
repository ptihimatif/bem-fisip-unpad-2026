# 07 – Pemeliharaan dan troubleshooting

## Masalah umum

| Gejala | Penyebab paling mungkin | Solusi |
| --- | --- | --- |
| Konten baru tidak muncul | Belum di-Publish, term bukan 2026, atau cache belum dibuang | Ikuti checklist di [bab 05](05-panduan-editor-konten.md#konten-tidak-muncul). Cek log webhook ([bab 06](06-deploy-dan-operasional.md#webhook-revalidasi)). |
| Di localhost konten lama terus | Cache dev | Restart `pnpm dev`. Kalau masih, hentikan server, hapus folder `.next`, jalankan lagi. |
| `ENOENT` pada `.next/dev/server/preview-props.json`, terutama setelah upgrade Next.js | Server lama masih aktif dengan versi/dependensi sebelumnya atau artefak dev sudah hilang | Hentikan server proyek dengan Ctrl+C, lalu jalankan `pnpm dev` lagi. Jika masih gagal, hentikan server dan hapus hanya `.next/dev` dari root repo sebelum restart. Jangan membuat `preview-props.json` secara manual. |
| Menu, carousel, atau modal tidak bisa diklik di production, tapi normal di `pnpm dev` | Script diblokir CSP | Lihat Console browser untuk error `Content-Security-Policy`, tambahkan domain/izin yang kurang di `next.config.ts`, build ulang. |
| Error CORS di Console, Studio tidak bisa login | Alamat belum terdaftar di CORS origins Sanity | Daftarkan di sanity.io/manage → API → CORS origins ([bab 06](06-deploy-dan-operasional.md#cors-sanity)). |
| Error `Missing environment variable: NEXT_PUBLIC_SANITY_…` | `.env.local` belum diisi | Salin `.env.example` ke `.env.local` dan isi. |
| Webhook 401 | Secret di Sanity dan hosting berbeda | Samakan, deploy ulang. |
| Webhook 503 | `SANITY_REVALIDATE_SECRET` belum ada di hosting | Isi env, deploy ulang. |
| Gambar tidak tampil | Gambar belum diupload, belum di-Publish, atau domain gambar bukan `cdn.sanity.io` | Cek dokumen di Studio. Gambar dari domain lain diblokir CSP dan `next.config.ts`. |
| Anggota tidak muncul di section pimpinan About | Penulisan role tidak cocok | Lihat tabel role di [bab 04](04-model-konten-sanity.md#member). |
| Unit tidak muncul di tombol About | `unitKind` bukan departemen/biro | Ubah Unit Kind atau tautkan unit dari tempat lain. |
| Tanggal artikel meleset sehari | Seharusnya sudah diperbaiki (format memakai `Asia/Jakarta`) | Pastikan formatter tanggal baru juga memakai `timeZone: "Asia/Jakarta"`. |
| Setelah ubah schema, `pnpm typecheck` gagal | `sanity.types.ts` belum diperbarui | `pnpm typegen`. |
| CI gagal di `pnpm install --frozen-lockfile` | Lockfile tidak sinkron | Jalankan `pnpm install` lokal dan commit `pnpm-lock.yaml` yang berubah. |
| `pnpm test` gagal: `@sanity/webhook` tidak ditemukan | Instalasi tidak lengkap | Paket sudah devDependency langsung; ulangi frozen install. |

Setelah `pnpm install` yang mengubah Next.js, selalu restart server dev. Hot reload tidak mengganti runtime Next.js yang sudah aktif. Pemeriksaan fixture memakai `.next-check` agar tidak menimpa `.next` milik aplikasi sungguhan.

## Keterbatasan yang diketahui (snapshot 2026-10-26)

### Konten

- 86 program: semua `description` kosong; 81 tanpa `shortDescription` dan `coverImage`.
- Program unggulan (ORASI, FILS, FISTAORA-ART) adalah sisa data lama dengan cover placeholder yang sama. Daftar unggulan resmi belum dikonfirmasi klien.
- Seluruh 10 Mapres punya referensi gambar. Semua penjelasan prestasi Mapres masih kosong.
- 3 anggota tanpa foto.
- 5 Bidang, Pengurus Inti, dan Sekretariat Umum belum punya program. Halamannya menampilkan "Belum ada program kerja yang dipublikasikan."

### Fitur

- Nilai, video, Care Center, sosial, dan kalimat visi sudah membaca CMS. Kartu terstruktur About punya field baru dan fallback salinan saat ini; publikasi manifest empat field menunggu review. Menu dan asset/animasi logo tetap konfigurasi kode. Lihat [bab 09](09-konten-about-dan-favicon.md).
- Belum ada halaman detail per program. `PROGRAM_BY_SLUG_QUERY` dan field `slug` program sudah siap untuk itu.
- Field yang belum ditampilkan: `organizationUnit.coverImage`, `gallery`, `contactLinks`, `abbreviation` di halaman unit; `program.startDate`/`endDate`; `studentAssociation.socialLinks`.
- Gambar di dalam isi artikel (Portable Text) belum didukung.
- Gambar Sanity dimuat `unoptimized`: satu ukuran untuk semua layar, tanpa `srcset`. Ukurannya sudah kecil (sekitar 35 KB untuk foto anggota), tapi HP tetap mengunduh versi yang sama dengan desktop.
- Halaman `/penjelasan/<slug>` yang tidak ada menampilkan isi not-found, tapi kode status awal streaming bisa 200, bukan 404 (dicatat di `.agents/tasks/2026-09-05-integration-hardening-remediation.md`).
- Footer dan JSON-LD sudah memakai helper sosial yang sama. Kelengkapan daftar resmi tetap memerlukan konfirmasi klien.

### Tooling dan dokumen

- Suite Playwright desktop/mobile sudah ada dengan fixture terisolasi. Login Studio, publish webhook pada domain sungguhan, perangkat fisik, pembaca layar, dan acceptance klien masih perlu diuji saat staging.
- Quality gates sudah diperbarui untuk unit test, TypeScript, build terisolasi, dan browser suite.
- Dokumen handover historis tidak tersedia. Dispatcher sekarang menjelaskan ketiadaannya dan mengarahkan operasi 2026 ke panduan ini; jangan mengarang isi dokumen historis.
- Peringatan kecil di Console: font Inter italic di-preload tapi tidak langsung dipakai. Tidak berbahaya.

## Backlog yang disarankan

Urut dari dampak terbesar:

1. Lengkapi konten program (deskripsi, cover) dan konfirmasi program unggulan dengan klien.
2. Review dan setujui manifest migrasi empat field About, lalu publikasikan dengan backup/revision guard secara terpisah.
3. Konfirmasi daftar sosial lengkap dan aktifkan penggantian default setelah disetujui; email/alamat belum ditampilkan pada desain footer.
4. Halaman detail program (`/program/[slug]`) dengan galeri dokumentasi kegiatan. Butuh field galeri baru di schema `program`.
5. Jalankan tes integrasi pada staging sungguhan: CORS, login Studio, publish webhook tanpa tab Live aktif, serta SEO/domain.
6. Isi pemilik, tujuan, jadwal, dan hasil acceptance pada checklist rilis.

## Serah terima ke kepengurusan berikutnya

Website ini dirancang per tahun kepengurusan. Konten 2026 harus tetap bisa dipulihkan.

### Akses yang harus diserahkan

| Akses | Tempat |
| --- | --- |
| Repositori GitHub | `github.com/ptihimatif/bem-fisip-unpad-2026` → Settings → Collaborators |
| Project Sanity `jcpcptq3` | sanity.io/manage → Members |
| Hosting dan environment variable | Dashboard hosting (misalnya Vercel) |
| Domain dan DNS | Registrar domain |
| `SANITY_REVALIDATE_SECRET` | Simpan di password manager organisasi, bukan di chat |

Cabut akses pengurus lama setelah serah terima selesai.

### Pindah ke tahun baru (misalnya 2027)

Ini perubahan besar dan harus direncanakan serta disetujui dulu (`.skills/project-planning/SKILL.md`, `.skills/sanity-cms/SKILL.md`). Gambaran tempat yang perlu diubah:

1. Backup dataset 2026 (`sanity dataset export`, bab 06).
2. `CONTENT_TERM` didefinisikan di **dua** tempat, keduanya harus diubah:
   - `sanity/lib/queries.ts`
   - `sanity/schemaTypes/shared.ts` (juga daftar opsi `term`)
3. ID singleton tertulis langsung di string GROQ `SITE_SETTINGS_QUERY` (`siteSettings-2026`) dan `CABINET_PROFILE_QUERY` (`cabinetProfile-2026`) di `sanity/lib/queries.ts`. `SITE_SETTINGS_ID` dan `CABINET_PROFILE_ID` di schema ikut `CONTENT_TERM`.
4. Teks "2026" yang hardcoded: hero beranda (`app/page.tsx`), metadata dan JSON-LD (`app/layout.tsx`), metadata `/article` dan `/hima`.
5. Konten About yang hardcoded (visi, misi, dan seterusnya), atau pindahkan dulu ke Sanity (backlog nomor 2).
6. Buat dataset baru untuk tahun baru sesuai kebijakan maintainer. Isi Site Settings dan Cabinet Profile pada target baru; pertahankan dataset 2026 serta backup-nya.
7. Aset kabinet di `public/assets/` (logo, dekorasi) untuk kabinet baru.
8. Ulangi seluruh quality gate dan smoke test.

### Sebelum serah terima

- [ ] Frozen install, lint, typecheck, unit/browser test, serta build release lolos pada commit/branch rilis yang disetujui.
- [ ] Dokumentasi ini diperbarui (tanggal di `docs/panduan/README.md`, jumlah konten di bab 04, keterbatasan di bab ini).
- [ ] `.agents/CURRENT_STATE.md` mencerminkan kondisi terakhir.
- [ ] Backup dataset terbaru tersimpan di tempat milik organisasi.
- [ ] Daftar pemilik akses (tabel di atas) sudah diisi nama peran yang bertanggung jawab.
