# 08 – Checklist staging dan production

Status 2026-10-26: kode perbaikan dikerjakan lokal; tujuan hosting, domain, branch deploy, approver, operator rollback, dan tanggal rilis belum diputuskan. Dokumen ini tidak menyatakan website sudah di-deploy.

## Isi keputusan sebelum membuat layanan

| Keputusan | Staging | Production |
| --- | --- | --- |
| Hosting/project | Belum ditentukan | Belum ditentukan |
| Domain/origin HTTPS | Belum ditentukan | Belum ditentukan |
| Branch/commit deploy | Belum ditentukan | Belum ditentukan |
| Sanity project/dataset | Belum ditentukan | Data 2026 saat ini: `jcpcptq3/production`; konfirmasi target rilis. |
| Pemilik akses | Belum ditentukan | Belum ditentukan |
| Approver rilis | Belum ditentukan | Belum ditentukan |
| Operator rollback | Belum ditentukan | Belum ditentukan |
| Jadwal | Belum ditentukan | Belum ditentukan |

Setiap tahun memakai dataset baru, sesuai keputusan maintainer. Untuk latihan publish/migrasi, staging sebaiknya memakai dataset 2026 yang terisolasi. Jika staging hanya membaca production, batasi untuk review tampilan dan jangan melakukan latihan edit yang dapat mengubah konten live. Periksa kuota/biaya akun sebelum membuat layanan.

## Sebelum staging

- [ ] Commit yang akan diuji ditentukan dan diff sudah direview.
- [ ] Frozen install, lint, typecheck, unit test, TypeGen, audit relevansi, dan browser test lolos.
- [ ] Environment memakai `staging`, origin HTTPS yang dipilih, dan `SANITY_TEST_MODE=false`.
- [ ] Sanity project/dataset benar; tidak ada secret di variabel `NEXT_PUBLIC_`.
- [ ] Header `X-Robots-Tag` dan meta robots menyatakan `noindex`; robots melarang crawling.
- [ ] CORS origin dan akses Studio dikonfigurasi oleh pemilik akses yang berwenang.
- [ ] Webhook bertanda tangan mengarah ke domain staging dengan dataset/secret yang cocok.

## Pemeriksaan pada domain staging sungguhan

1. Buka home, About, artikel, Hima/Huria, post, unit, serta Studio. Periksa favicon BEM dan canonical tiap halaman.
2. Uji menu HP, modal program, Escape/Tab/focus kembali, pembaca layar dasar, reduced motion, lebar sempit, dan zoom 200%. Periksa console CSP/hydration.
3. Uji URL post/unit yang tidak ada: isi not-found dan `noindex` harus benar. HTTP 200 pada respons yang sudah streaming adalah perilaku Next.js yang didokumentasikan; jangan menyamakan status itu saja dengan halaman valid yang boleh diindeks.
4. Login Studio memakai akun editor. Publish perubahan kecil pada dokumen uji di dataset terisolasi saat semua tab Live ditutup. Buka halaman baru dan pastikan kontennya berubah; cocokkan log Attempts webhook.
5. Uji create/update/delete, signature salah, dan payload tidak valid tanpa mengubah dokumen klien yang tidak terkait.
6. Periksa tautan resmi dan gambar social preview. Persetujuan klien saat audit masih parsial; minta konfirmasi program unggulan dan kelengkapan konten.

Pemeriksaan HTTP/SEO baca-saja yang dapat diulang:

```sh
node scripts/verify_deployment.mjs https://DOMAIN-STAGING --environment staging --post SLUG-PUBLISHED --unit SLUG-UNIT
```

Gunakan `--environment production` untuk rilis resmi. Script sengaja menolak fixture yang terdeploy. Hasil lolos tidak menggantikan login admin, pemeriksaan media pihak ketiga asli, uji CRUD, atau Attempts webhook.

## SEO saat peluncuran

- [ ] `NEXT_PUBLIC_SITE_URL` berisi origin kanonis HTTPS sebenarnya, dan production memakai `NEXT_PUBLIC_SITE_ENV=production`.
- [ ] Canonical archive mempertahankan kategori/halaman yang berbeda, membuang parameter tracking/default, dan membatasi nomor halaman sesuai konten. Urutan alternatif `terlama` memakai noindex untuk menghindari duplikasi.
- [ ] Post memiliki judul/deskripsi, tanggal asli, metadata social, serta JSON-LD Article dan BreadcrumbList; jangan mengarang penulis atau foto untuk melengkapi field opsional.
- [ ] Sitemap memuat post/unit published, tidak memuat Studio/API, dan tidak mempertahankan post yang ditarik.
- [ ] Preview berbagi menampilkan gambar CMS atau fallback logo yang sudah ada; validasi satu post dan domain produksi di Google Rich Results Test.
- [ ] Setelah domain aktif, pemilik memverifikasi properti Google Search Console, mengirim `/sitemap.xml`, dan memeriksa satu URL. Ini konfigurasi akun setelah deploy, bukan jaminan ranking atau indexing seketika.

## Backup dan rollback 2026

- [ ] Export 2026 terkini tersimpan di lokasi organisasi dengan pemilik dan tanggal yang jelas.
- [ ] Akses ke file tersebut diperiksa. Jika melakukan restore rehearsal, gunakan target terisolasi; jangan menimpa production.
- [ ] Deployment sebelumnya yang sehat dan commit-nya dicatat.
- [ ] Trigger rollback ditetapkan: route utama gagal, login/publish gagal, error server meningkat, atau data salah akibat perubahan rilis.
- [ ] Operator tahu cara mempromosikan deployment sebelumnya dan membuat revert lewat proses review.
- [ ] Jika ada migrasi konten terpisah, simpan backup, revision, daftar ID/field, dan pemulihan hanya untuk target itu.

## Sebelum production

Minta persetujuan eksplisit atas daftar konkret: commit, hosting project, origin, dataset, perubahan environment/CORS/webhook, operator, backup, rollback, serta pengecualian yang diterima. Domain/DNS dan pengaturan GitHub memerlukan otoritas pemilik masing-masing.

Setelah persetujuan dan deployment, ulangi smoke test, pastikan production indexable pada domain kanonis, jalankan publish test yang disetujui, pantau log, dan isi catatan rilis dengan versi serta pemilik handover. Rahasia tetap disimpan di secret/password manager organisasi.
