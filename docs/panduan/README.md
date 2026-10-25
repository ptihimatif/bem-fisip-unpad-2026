# Dokumentasi Website BEM FISIP Unpad 2026

Dokumentasi ini menjelaskan cara kerja, cara menjalankan, cara mengisi konten, dan cara merawat website resmi BEM FISIP Unpad 2026 (Kabinet Pendar Mentari).

Status dokumen: diperbarui 2026-10-26 untuk perbaikan lokal prarilis. Angka konten adalah snapshot audit; hosting dan domain belum dipilih, dan dokumen ini tidak menyatakan deployment sudah dilakukan.

## Pilih sesuai peranmu

| Kamu adalah | Mulai dari |
| --- | --- |
| Pengurus yang mengisi konten (artikel, mapres, proker, anggota) | [05 – Panduan editor konten](05-panduan-editor-konten.md) |
| Developer baru yang mau menjalankan website di laptop | [02 – Setup dan menjalankan](02-setup-dan-menjalankan.md) |
| Developer yang mau mengubah halaman atau komponen | [01 – Gambaran umum](01-gambaran-umum.md), lalu [03 – Struktur proyek](03-struktur-proyek.md) |
| Developer yang mau mengubah schema atau query Sanity | [04 – Model konten Sanity](04-model-konten-sanity.md) |
| Pemegang akses hosting/domain/Sanity | [06 – Deploy dan operasional](06-deploy-dan-operasional.md) |
| Siapa pun yang menemukan masalah | [07 – Pemeliharaan dan troubleshooting](07-pemeliharaan-dan-troubleshooting.md) |

## Daftar isi

1. [Gambaran umum](01-gambaran-umum.md) — tujuan website, teknologi, arsitektur, dan alur data.
2. [Setup dan menjalankan](02-setup-dan-menjalankan.md) — kebutuhan, environment variable, perintah, quality gate, CI.
3. [Struktur proyek](03-struktur-proyek.md) — folder, daftar route, komponen, aset.
4. [Model konten Sanity](04-model-konten-sanity.md) — semua tipe dokumen, field, query, dan halaman yang memakainya.
5. [Panduan editor konten](05-panduan-editor-konten.md) — langkah mengisi konten di Sanity Studio.
6. [Deploy dan operasional](06-deploy-dan-operasional.md) — environment production, keamanan (CSP), webhook, CORS, SEO, rollback.
7. [Pemeliharaan dan troubleshooting](07-pemeliharaan-dan-troubleshooting.md) — masalah umum, keterbatasan yang diketahui, backlog, serah terima tahunan.
8. [Checklist rilis](08-checklist-rilis.md) — keputusan staging/production, otoritas, verifikasi, dan rollback.
9. [Konten About dan favicon](09-konten-about-dan-favicon.md) — field CMS baru, manifest yang belum dipublikasikan, dan icon browser.

## Dokumen lain di repositori

- `docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md` — brief produk dan teknis yang disetujui (bahasa Inggris). Sumber kebenaran untuk scope.
- `docs/SANITY_REVALIDATION.md` — detail teknis webhook revalidasi (bahasa Inggris). Ringkasannya ada di bab 06.
- `PRODUCT.md`, `DESIGN.md` — prinsip produk dan fondasi desain (warna, font).
- `AGENTS.md` dan folder `.agents/` — aturan kerja berbasis rencana dan persetujuan, catatan task, dan status terkini (`.agents/CURRENT_STATE.md`).
- `.skills/` — prosedur kerja per jenis tugas (perencanaan, desain, Sanity, fitur Next.js, review, rilis).

## Istilah singkat

| Istilah | Arti |
| --- | --- |
| Sanity | Layanan CMS (tempat menyimpan konten). Website membaca konten dari sini. |
| Sanity Studio | Halaman admin untuk mengedit konten, ada di `/studio` website ini. |
| Dataset | "Database" konten di Sanity. Website ini memakai project `jcpcptq3`, dataset `production`. |
| Term | Field `term` di setiap dokumen. Website hanya menampilkan dokumen dengan `term = "2026"`. |
| Publish | Konten di Studio baru tampil di website setelah tombol **Publish** ditekan. Draft tidak pernah tampil. |
| GROQ | Bahasa query Sanity. Semua query ada di `sanity/lib/queries.ts`. |
| Route | Alamat halaman, misalnya `/about` atau `/post/[slug]`. |
| Revalidasi | Proses menyegarkan cache halaman setelah konten berubah. |
| CSP | Content-Security-Policy: header keamanan yang menentukan script, gambar, dan font dari mana saja yang boleh dimuat browser. |
