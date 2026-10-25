# 07 – Pemeliharaan dan troubleshooting

## Masalah umum

| Gejala | Penyebab paling mungkin | Solusi |
| --- | --- | --- |
| Konten baru tidak muncul | Belum di-Publish, term bukan 2026, atau cache belum dibuang | Ikuti checklist di [bab 05](05-panduan-editor-konten.md#konten-tidak-muncul). Cek log webhook ([bab 06](06-deploy-dan-operasional.md#webhook-revalidasi)). |
| Di localhost konten lama terus | Cache dev | Restart `pnpm dev`. Kalau masih, hentikan server, hapus folder `.next`, jalankan lagi. |
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
| `pnpm test` gagal: `@sanity/webhook` tidak ditemukan | Dependency transitif tidak ter-hoist | `pnpm add -D @sanity/webhook`. |

## Keterbatasan yang diketahui (per 2026-10-25)

### Konten

- 86 program: semua `description` kosong; 81 tanpa `shortDescription` dan `coverImage`.
- Program unggulan (ORASI, FILS, FISTAORA-ART) adalah sisa data lama dengan cover placeholder yang sama. Daftar unggulan resmi belum dikonfirmasi klien.
- 1 mapres tanpa foto (Muhammad Adryan Rusdiana). Semua prestasi mapres kosong.
- 3 anggota tanpa foto.
- 5 Bidang, Pengurus Inti, dan Sekretariat Umum belum punya program. Halamannya menampilkan "Belum ada program kerja yang dipublikasikan."

### Fitur

- Visi, misi, budaya kerja, nilai, filosofi logo, video profil, link sosial, dan menu masih hardcoded. Field Sanity-nya sudah ada tapi belum dipakai. Daftar lengkap ada di [bab 04](04-model-konten-sanity.md#konten-yang-masih-hardcoded).
- Belum ada halaman detail per program. `PROGRAM_BY_SLUG_QUERY` dan field `slug` program sudah siap untuk itu.
- Field yang belum ditampilkan: `organizationUnit.coverImage`, `gallery`, `contactLinks`, `abbreviation` di halaman unit; `program.startDate`/`endDate`; `post.seoImage`; `siteSettings.ogImage`; `studentAssociation.socialLinks`.
- Gambar di dalam isi artikel (Portable Text) belum didukung.
- Gambar Sanity dimuat `unoptimized`: satu ukuran untuk semua layar, tanpa `srcset`. Ukurannya sudah kecil (sekitar 35 KB untuk foto anggota), tapi HP tetap mengunduh versi yang sama dengan desktop.
- Halaman `/penjelasan/<slug>` yang tidak ada menampilkan isi not-found, tapi kode status awal streaming bisa 200, bukan 404 (dicatat di `.agents/tasks/2026-09-05-integration-hardening-remediation.md`).
- Link LinkedIn dan YouTube di footer berbeda dengan yang ada di JSON-LD layout.

### Tooling dan dokumen

- Belum ada test end-to-end (misalnya Playwright). Pengecekan tampilan masih manual.
- `.agents/QUALITY_GATES.md` masih menyebut unit test belum dikonfigurasi dan typecheck belum punya script. Keduanya sekarang sudah ada (`pnpm test`, `pnpm typecheck`).
- `AGENTS.md` dan `.agents/README.md` merujuk `docs/2026_PREPARATION_AND_HANDOVER.md`, tapi file itu tidak ada di repositori.
- Peringatan kecil di Console: font Inter italic di-preload tapi tidak langsung dipakai. Tidak berbahaya.

## Backlog yang disarankan

Urut dari dampak terbesar:

1. Lengkapi konten program (deskripsi, cover) dan konfirmasi program unggulan dengan klien.
2. Pindahkan konten About yang hardcoded ke `cabinetProfile` supaya pengurus bisa mengeditnya.
3. Pakai `siteSettings` untuk link sosial, FISIP Care Center, dan email/alamat di footer. Samakan dengan JSON-LD.
4. Halaman detail program (`/program/[slug]`) dengan galeri dokumentasi kegiatan. Butuh field galeri baru di schema `program`.
5. Test end-to-end untuk route utama, termasuk pengecekan CSP di mode production.
6. Perbarui `.agents/QUALITY_GATES.md` dan rujukan dokumen yang hilang.

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
6. Buat dokumen Site Settings dan Cabinet Profile untuk tahun baru, lalu isi konten baru dengan term baru. Konten 2026 tetap ada di dataset dan tidak tampil karena term-nya berbeda.
7. Aset kabinet di `public/assets/` (logo, dekorasi) untuk kabinet baru.
8. Ulangi seluruh quality gate dan smoke test.

### Sebelum serah terima

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` lolos di `main`.
- [ ] Dokumentasi ini diperbarui (tanggal di `docs/panduan/README.md`, jumlah konten di bab 04, keterbatasan di bab ini).
- [ ] `.agents/CURRENT_STATE.md` mencerminkan kondisi terakhir.
- [ ] Backup dataset terbaru tersimpan di tempat milik organisasi.
- [ ] Daftar pemilik akses (tabel di atas) sudah diisi nama peran yang bertanggung jawab.
