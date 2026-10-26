# 09 – Konten About dan favicon

## Field About yang sudah terhubung

Nilai memakai `cabinetProfile.values` (title/description), dan video profil memakai `profileVideoUrl`. URL video hanya boleh berupa YouTube HTTPS dengan host dan ID yang valid. Care Center dan tautan sosial dibaca dari Site Settings; JSON-LD memakai daftar sosial yang sama dengan footer.

Daftar sosial lama dipertahankan sebagai fallback untuk platform yang belum dimasukkan ke CMS, karena data saat audit hanya berisi tiga dari lima platform yang ada di halaman. Untuk membuat daftar CMS menjadi satu-satunya sumber, isi daftar lengkap lalu aktifkan **Use only the social links above** (`replaceDefaultSocialLinks`). Setelah aktif, menghapus item benar-benar menghapus link itu dari footer dan JSON-LD.

## Field terstruktur baru: sudah dipublikasikan pada 2026-10-26

| Field pada `cabinetProfile-2026` | Isi yang disiapkan | Sumber salinan saat ini |
| --- | --- | --- |
| `visionHighlights` | 3 phrase/description | `PENJABARAN` di `VisiSection.tsx` |
| `missionItems` | 5 title/description | `MISI` di `MisiSection.tsx` |
| `workCultureItems` | 3 title/description | `BUDAYA` di `BudayaKerjaSection.tsx` |
| `logoExplanationItems` | 8 elementKey/title/description | `explanations` di `logo-section.ts` |

Field baru bersifat tambahan. `missions`, `workCulture`, dan `logoPhilosophy` lama tidak dihapus atau diubah tipenya. Beberapa teks lama tidak sama persis dengan kartu yang sudah dirender; jangan membelah kalimat atau menyalin otomatis berdasarkan asumsi.

Saat field baru belum diisi, komponen mempertahankan salinan dan tampilan yang ada. Vision memakai kalimat `vision` dan phrase eksplisit; phrase yang tidak ditemukan tidak membuang karakter kalimat. Elemen logo memakai kunci tetap `wave`, `pendar`, `mentari`, `rays`, `sun`, `yellow`, `blue`, `synergy`; editor hanya mengganti teks, bukan asset atau animasinya.

Untuk menyiapkan ulang daftar yang bisa direview:

```bash
pnpm exec sanity exec scripts/prepare_about_content.mjs --with-user-token
```

Script tersebut **hanya membaca Sanity** dan menulis `outputs/pre-release-cms/about-content-plan.json` yang diabaikan Git. Manifest memuat target satu dokumen, revision, empat field yang akan diisi, hash sumber, draft/conflict status, dan semua teks usulan. Script tidak memiliki mode publish.

Publikasi yang disetujui hanya mengisi empat field di atas, memakai teks persis dari kartu yang sudah ada. Preflight menemukan 0 konflik dan tidak ada draft. `scripts/apply_about_content.mjs` menyimpan backup eksklusif, memeriksa revision dan hash sumber, lalu membandingkan seluruh field lain serta query published. Nilai, visi utama, nama kabinet, dan array legacy tidak diubah. Bukti/backup ada di `outputs/pre-release-cms/` yang diabaikan Git. Schema baru tampil di Studio setelah kode aplikasi di-deploy.

Untuk pemeriksaan ulang tanpa mengubah data:

```bash
pnpm exec sanity exec scripts/apply_about_content.mjs --with-user-token -- --verify
```

Mode `--rollback` tersedia untuk pemulihan empat field itu saja setelah operator memperoleh persetujuan. Script menolak rollback jika field sudah diedit lagi sejak publikasi; jangan menimpa perubahan editor.

## Favicon browser

`app/favicon.ico` sekarang berisi logo institusional BEM dengan ukuran 16, 32, 48, dan 256 piksel. Path lama `public/assets/favicon.ico` juga berisi ICO yang valid. Source PNG asli disimpan di `public/assets/bem-fisip-logo.png`; logo tidak digambar ulang.

Next.js menambahkan tag icon dari konvensi `app/favicon.ico`; root layout tidak lagi menunjuk icon lain yang bersaing. Untuk regenerasi di Windows:

```powershell
powershell -NoProfile -File scripts/create_favicon.ps1
```

Browser sering menyimpan favicon lama. Periksa `/favicon.ico`, lalu gunakan sesi browser baru sebelum menyimpulkan ikon gagal diperbarui. Mengganti ke logo kabinet merupakan pilihan aset terpisah yang perlu dikonfirmasi.
