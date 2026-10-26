# 10 - Progul dan verifikasi

Pada 2026-10-26, maintainer memberikan folder Drive PROGUL dan menyetujui satu cover per program serta penayangan kelima program sebagai Featured. Dari 17 foto sumber yang diperiksa, hanya lima foto cover yang diupload ke `jcpcptq3/production`.

| Nama di sumber | Dokumen Sanity yang diperbarui | Cover terpilih |
| --- | --- | --- |
| ORASI | `program-003` | `IMG_0194.jpeg` |
| FILS | `program-002` | `IMG_0844.jpeg` |
| Fistaora | `program-004` (FISTAORA-ART, Seni Budaya) | `3abf76f0-dc3a-4f95-bca9-34f022e445e7.jpg` |
| SOSCAMP | `program-008` (Social Camping) | `20251102130844_IMG_1710.jpeg` |
| FISIPAW | `program-007` | `DSCF9008.jpeg` |

Foto FISIPAW menampilkan tulisan FISIP Awards 2025. Alt text menyebut tahun tersebut, tanpa mengklaim dokumentasi acara 2026. Nama folder menentukan pemetaan program; tahun term dokumen mengatur katalog kabinet, bukan bukti tahun pengambilan foto.

Hanya `coverImage` dan `isFeatured` di lima dokumen itu yang berubah. Jumlah 86 program, nama, slug, deskripsi, unit pemilik, urutan, dan field lain dipertahankan. FISTAORA-ART milik Olahraga adalah entri lain dan tidak disentuh. Tidak ada field galeri atau halaman baru.

## Bukti dan pemeriksaan ulang

File sumber, contact sheet, ukuran/hash sumber, peta ID, backup lengkap lima dokumen, rencana, dan receipt asset tersimpan lokal di `outputs/progul-2026-10-26/`, diabaikan Git. Pindahkan salinan backup ke lokasi organisasi yang disetujui saat handover; jangan memasukkan foto/backup mentah ke Git.

```bash
pnpm exec sanity exec scripts/import_progul_covers.mjs --with-user-token -- --verify
```

Verifikasi membandingkan referensi gambar, SHA-1 asset dengan byte sumber, alt text, Featured, semua field lain, jumlah program, dan readback published. Mode `--rollback` mengembalikan hanya `coverImage`/`isFeatured` dari backup, memakai revision guard dan menolak cover yang sudah diedit lagi. Jalankan pemulihan hanya dengan otoritas operator. Asset dipertahankan agar tidak menghapus file yang mungkin digunakan dokumen lain.

Jangan menjalankan ulang `--dry-run` untuk import yang sudah selesai: rencana dan backup asli adalah bukti pemulihan. Gunakan `--verify`; perubahan cover berikutnya memerlukan rencana/output baru.

## Perilaku aplikasi dan batas bukti

- About meminta 46 pemimpin yang sama dengan filter sebelumnya; tidak lagi mengambil seluruh 268 anggota untuk halaman itu.
- Artikel memfilter/mengurutkan di GROQ dan mengambil maksimal lima kartu per halaman. URL kategori/sort/page tetap berlaku; input tidak valid kembali ke default dan halaman terlalu besar memakai halaman terakhir.
- Sesuai permintaan terbaru maintainer, semua tombol Jeda/Putar dan panah carousel dihapus, termasuk panah Progul. Carousel tetap bergerak secara default setelah JavaScript siap. Swipe/trackpad, fokus keyboard (panah/Home/End), dan akses reduced motion tetap tersedia; pada mode manual hanya satu set kartu dirender. Tanpa JavaScript, konten dasar tetap dapat digulir.
- Logo memiliki versi baca biasa pada reduced motion. Menu mobile mendukung Escape/fokus kembali, dan Hima menghormati preferensi motion.
- Error boundary memakai `retry` yang melakukan fetch ulang pada Next.js terpasang; `global-error` menyediakan dokumen pemulihan jika root layout gagal.
- Browser suite menguji sembilan skenario pada tiga konfigurasi engine/viewport (27 pemeriksaan). WebKit desktop yang diemulasikan bukan perangkat Safari/iPhone fisik. Pembesaran teks 200% diuji; browser zoom fisik dan pembaca layar tetap perlu ditinjau.
- Fixture error sengaja menghasilkan pesan error server saat tes; ini tidak berarti dataset klien gagal.
- Pemeriksaan build pertama menemukan cache production lokal masih menyimpan cover placeholder meskipun published readback sudah benar. Hanya `.next/cache/fetch-cache` yang dibersihkan setelah path absolutnya diverifikasi; build berikutnya memuat kelima hash cover yang benar. Tidak ada file sumber, cache dev, atau data Sanity yang dihapus. Ini bukan pengganti verifikasi webhook pada hosting.
- HTML About production turun dari 713.226 menjadi 525.120 byte tanpa kompresi setelah perubahan ini (gzip lokal 205.598 byte). Angka build ini bukan hasil Core Web Vitals atau ukuran transfer hosting yang sudah diukur.

Target staging masih belum ditentukan. Tidak ada deployment, perubahan domain/DNS/CORS/webhook, atau bukti publish-to-site pada domain publik dari pekerjaan ini. Gunakan [checklist rilis](08-checklist-rilis.md) untuk tahap tersebut.
