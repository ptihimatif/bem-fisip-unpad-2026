# Dokumentasi Website BEM FISIP Unpad 2026

Dokumentasi ini menjelaskan cara kerja, cara menjalankan, cara mengisi konten, dan cara merawat website resmi BEM FISIP Unpad 2026 (Kabinet Pendar Mentari).

Status dokumen: dirapikan 2026-10-27 untuk handover pradeployment. Angka konten adalah snapshot sebelumnya. Anggaran domain maksimal Rp300.000 dan hosting ditargetkan gratis; pemilihan akun, checkout, domain aktif, dan deployment tetap dicatat saat pelaksanaan. Mulai dari [handover deployment hemat](../HANDOVER_DEPLOYMENT_HEMAT_2026.md).

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
9. [Konten About dan favicon](09-konten-about-dan-favicon.md) — field CMS yang dipublikasikan, verifikasi/pemulihan, dan icon browser.
10. [Progul dan verifikasi](10-progul-dan-verifikasi.md) — lima cover klien, batas perubahan, backup, dan bukti pemeriksaan.

## Dokumen lain di repositori

- [Handover deployment hemat](../HANDOVER_DEPLOYMENT_HEMAT_2026.md) — anggaran, pilihan hosting/domain, transfer domain, admin, dan rollback.
- `docs/SANITY_REVALIDATION.md` — detail teknis webhook revalidasi; ringkasannya ada di bab 06.
- `docs/DEPENDENCY_SECURITY_2026-10-26.md` — alasan override dependency dan bukti audit versi saat remediation.
- `AGENTS.md` — aturan maintenance ringkas. Tooling agent dan rencana historis dikeluarkan dari working tree setelah diarsipkan lokal; tidak diperlukan untuk menjalankan website.
- [Panduan admin singkat di Google Docs](https://docs.google.com/document/d/1WUWX1EqEH65x5WhbnqzRFuC-HRcywVLblcPnjKbZ-Fo) — login, tambah/edit publikasi, unpublish/delete, dan kontak bantuan.

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
