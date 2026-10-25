# 05 – Panduan editor konten

Bab ini untuk pengurus yang mengisi konten. Tidak perlu bisa coding.

## Masuk ke Studio

1. Buka `https://<alamat-website>/studio` (saat development: `http://localhost:3000/studio`).
2. Login dengan akun Sanity yang sudah diundang ke project. Kalau belum punya akses, minta admin project Sanity mengundang email kamu di sanity.io/manage → project `jcpcptq3` → Members.
3. Menu di kiri:
   - **Site Settings** dan **Cabinet Profile**: masing-masing hanya satu dokumen, langsung terbuka.
   - Tipe lain: **Publication**, **Mahasiswa Berprestasi**, **Program**, **Organization Unit**, **Member**, **Student Association (Himpunan / Huria)**.

## Aturan emas

1. **Tekan Publish.** Perubahan yang belum di-publish hanya draft dan tidak pernah tampil di website.
2. **Term harus 2026.** Field ini terisi otomatis untuk dokumen baru. Jangan diubah.
3. **Isi Alternative text di setiap gambar.** Tuliskan isi gambarnya dalam satu kalimat, misalnya "Foto Evelyn Kurniawan". Studio menolak publish kalau gambar tanpa alt text.
4. **Atur titik fokus gambar** dengan tombol hotspot/crop di gambar supaya wajah tidak terpotong.
5. **Link harus `https://`.** Link `http://` ditolak.
6. **Jangan hapus dokumen** kecuali yakin. Penghapusan langsung hilang dari website. Untuk menyembunyikan sementara, pakai Unpublish.

Setelah Publish, halaman yang sedang dibuka pengunjung biasanya berubah dalam beberapa detik. Kalau belum berubah, refresh halaman. Kalau masih belum, lihat [Konten tidak muncul](#konten-tidak-muncul).

## Ukuran gambar yang disarankan

| Konten | Rasio | Ukuran minimal | Catatan |
| --- | --- | --- | --- |
| Foto anggota (Member) | Potret, sekitar 2:3 | 600 × 900 px | Latar polos lebih rapi. Foto yang sekarang 590 × 945 PNG. |
| Foto mapres | Potret, sekitar 3:4 | 600 × 800 px | |
| Cover program | Lanskap 16:9 atau persegi | 1200 × 675 px | Kartu beranda dipotong persegi; modal memakai 2:1 |
| Gambar artikel/kajian | Lanskap 16:9 | 1200 × 675 px | |
| Logo Hima/Huria | Persegi 1:1 | 400 × 400 px | Logo bukan persegi akan terpotong |

Format JPG atau PNG. Sanity mengecilkan dan mengonversi gambar otomatis, jadi tidak perlu kompres manual, tapi hindari file di atas 5 MB.

## Tugas umum

### Menulis artikel atau kajian

1. **Publication** → tombol **+** (Create).
2. Isi:
   - **Category**: Artikel atau Kajian.
   - **Title**.
   - **Slug**: klik **Generate**. Slug menjadi alamat `/post/<slug>`. Jangan diubah setelah dibagikan.
   - **Published At**: tanggal dan jam terbit. Website menampilkannya dalam WIB.
   - **Card Excerpt**: ringkasan pendek untuk kartu (maksimal 240 karakter).
   - **Cover Image** + alt text.
   - **Body**: isi artikel. Bisa heading, kutipan, daftar, tebal, miring, dan link. Gambar di dalam isi belum didukung.
   - **Official Instagram URL** (opsional): menampilkan tombol ke unggahan Instagram.
   - **SEO Title / SEO Description** (opsional): judul dan deskripsi untuk Google dan preview link. Kalau kosong, memakai judul dan excerpt.
3. **Publish**.

Artikel muncul di `/article`, di detail `/post/<slug>`, dan di beranda (3 terbaru, kajian didahulukan).

### Menambah atau mengubah Mahasiswa Berprestasi

1. **Mahasiswa Berprestasi** → buka nama yang ada atau **+**.
2. Isi **Student Name**, **Study Program**, **Cohort Year** (wajib).
3. **Achievement / Event** dan **Achievement Year**: isi kalau ada. Kalau kosong, kartu hanya menampilkan nama, prodi, dan angkatan.
4. **Portrait**: upload foto + alt text. Kalau kosong, kartu menampilkan siluet.
5. **Mapres Rank** (1–3) dan **Display order** untuk urutan. Urutan: Display order, lalu rank, lalu nama.
6. **Approved Profile URL** (opsional): kartu jadi bisa diklik ke profil.
7. **Publish**.

Saat ini (2026-10-25) foto Muhammad Adryan Rusdiana belum ada, dan semua field prestasi masih kosong.

### Mengatur Program Unggulan di beranda

1. **Program** → buka program yang mau ditampilkan.
2. Centang **Featured**.
3. Isi **Short Description**, **Full Description**, dan **Cover Image** supaya kartu dan modalnya lengkap.
4. Atur **Display order** (kecil tampil duluan).
5. **Publish**.
6. Hilangkan centang **Featured** di program yang bukan unggulan, lalu Publish.

Beranda menampilkan maksimal 6 program unggulan. Saat ini yang Featured adalah ORASI, FILS, dan FISTAORA-ART, ketiganya sisa data lama dengan cover placeholder. Konfirmasi daftar unggulan ke klien.

### Menambah program kerja ke sebuah unit

1. **Program** → **+**.
2. Isi **Name**, klik **Generate** di **Slug**.
3. **Owning Organization Unit**: pilih unitnya (hanya unit 2026 yang muncul).
4. **Official External Link** (opsional): nama program di halaman unit menjadi link.
5. **Publish**.

Program muncul di `/penjelasan/<slug unit>`, urut Display order lalu nama.

### Menambah atau mengubah anggota

1. **Member** → cari nama atau **+**.
2. Isi **Approved Public Name**, **Role / Position**, **Organization Unit**, dan foto.
3. **Penulisan Role menentukan di mana anggota tampil.** Gunakan pola persis ini:

   | Mau tampil di | Tulis role |
   | --- | --- |
   | About – Ketua dan Wakil | `Ketua` atau `Wakil Ketua` (persis) |
   | About – Sekretariat & Bidang | `Sekretaris Umum` (persis), atau `Kepala Bidang …` |
   | About – Pimpinan Departemen & Biro | `Kepala Departemen …`, `Wakil Kepala Departemen …`, `Kepala Biro …`, `Wakil Kepala Biro …` |
   | Halaman unit – bagian pimpinan | diawali `Kepala`, `Ketua`, `Wakil Kepala`, atau `Wakil Ketua` |
   | Halaman unit – anggota | role lain, misalnya `Staf` |

4. **Publish**.

### Mengubah deskripsi unit (Departemen/Biro/Bidang)

1. **Organization Unit** → pilih unit.
2. Ubah **Description**.
3. Jangan ubah **Slug**: tombol di halaman About dan link yang sudah tersebar memakai slug itu.
4. **Publish**.

Hanya unit dengan **Unit Kind** Departemen atau Biro yang muncul sebagai tombol di About. Bidang dan Pengurus Inti tetap punya halaman sendiri, tapi tidak ditautkan dari About.

### Menambah atau mengubah Hima/Huria

1. **Student Association (Himpunan / Huria)** → pilih atau **+**.
2. Isi nama resmi, singkatan, program studi, nama kabinet, deskripsi, logo persegi, dan **Official Link**.
3. **Publish**.

### Mengubah nama kabinet, overview, dan SEO

- **Cabinet Profile** → **Cabinet Name** (hero beranda) dan **Overview** (bagian "Mengapa Pendar Mentari?").
- **Site Settings** → **Default SEO Title** (maks 60 karakter) dan **Default SEO Description** (maks 160 karakter).

Visi, misi, budaya kerja, nilai, filosofi logo, video profil, dan link media sosial **belum** bisa diubah dari Studio. Mengisinya di Cabinet Profile atau Site Settings tidak mengubah website. Minta developer mengubah kodenya (lihat bab 04).

## Konten tidak muncul

Cek berurutan:

1. **Sudah di-Publish?** Di Studio, dokumen yang belum di-publish punya label draft. Tekan Publish.
2. **Term = 2026?**
3. **Untuk program:** Owning Organization Unit sudah diisi? Untuk program unggulan: Featured sudah dicentang, dan jumlah unggulan tidak lebih dari 6?
4. **Untuk anggota di About:** penulisan Role sesuai tabel di atas?
5. **Untuk unit di About:** Unit Kind sudah Departemen atau Biro?
6. **Refresh halaman** (Ctrl+F5).
7. Masih tidak muncul setelah beberapa menit: laporkan ke developer dengan nama dokumen, halaman yang dicek, dan jam publish. Developer mengecek webhook revalidasi (bab 06).

## Jangan lakukan

- Jangan mengimpor data massal atau menjalankan script di folder `scripts/` tanpa developer. Script itu menulis langsung ke production.
- Jangan membuat dokumen Site Settings atau Cabinet Profile kedua.
- Jangan mengubah slug yang sudah dibagikan.
- Jangan mengunggah foto orang tanpa izin yang bersangkutan.
