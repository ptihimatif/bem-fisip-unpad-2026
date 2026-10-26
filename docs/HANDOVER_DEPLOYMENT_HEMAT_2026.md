# Handover Deployment Hemat — BEM FISIP Unpad 2026

Tanggal: 26 Oktober 2026  
Diperbarui: 27 Oktober 2026, setelah cleanup dan pemeriksaan rilis lokal  
Untuk: pengurus BEM, admin konten, dan developer penerus  
Anggaran: **maksimal Rp300.000 untuk domain; hosting ditargetkan Rp0**  
Status: panduan persiapan dan pelaksanaan; **belum menyatakan website sudah diluncurkan**.

Dokumen tunggal ini dibuat atas permintaan maintainer: “okey berarti deployment plans aman, tolong buatkan handovernya dong dalam 1 file md”. Permintaan tersebut mencakup dokumentasi, bukan pembelian domain, perubahan visibility GitHub, deployment, DNS, atau perubahan data Sanity. Semua langkah layanan di bawah merupakan instruksi untuk operator saat pelaksanaannya disetujui.

## 1. Rekomendasi untuk klien

**Pertahankan domain `.org` lama dengan transfer ke penyedia yang lebih murah, gunakan hosting gratis, dan tetap gunakan Sanity untuk pengelolaan konten.** Dengan begitu identitas website tetap sama dan biaya domain ditargetkan sekitar Rp180–220 ribu, sebelum total checkout dikonfirmasi.

Tidak perlu membeli paket shared hosting, VPS, SSL berbayar, atau email berbayar untuk menjalankan website ini. Domain dapat dibeli di penyedia yang berbeda dari hosting. Email domain, jika memang sudah dipakai, harus dipertahankan konfigurasinya saat pemindahan DNS.

Admin klien tetap dapat membuat, membaca, mengubah, dan menghapus artikel/kajian melalui Sanity Studio. Pembaruan konten tidak memerlukan bantuan developer atau deploy ulang seluruh website setelah webhook dikonfigurasi dan diuji.

## 2. Tiga opsi domain dalam anggaran

Harga berikut adalah hasil survei halaman publik pada 26 Oktober 2026, bukan invoice, reservasi nama, atau jaminan harga termurah seluruh pasar. Harga untuk nama standar/nonpremium. Pajak, biaya pembayaran, ketersediaan nama, dan ketentuan transfer harus diperiksa sebelum membayar. Konversi USD memakai **asumsi Rp17.000/US$**, bukan kurs transaksi yang dijamin.

| Opsi | Tindakan | Harga yang tercantum sekarang | Perpanjangan pada harga survei | Pertimbangan |
| --- | --- | --- | --- | --- |
| A — utama | Transfer `.org` lama ke HostCloud | Rp180.000 | Rp200.000/tahun | Tetap memakai alamat lama dan ekstensi yang diminta klien. Konfirmasi total checkout dan tambahan masa aktif transfer. |
| B — `.org` baru | Daftar nama `.org` baru di Porkbun | US$7,98, sekitar Rp136.000 | US$11,84, sekitar Rp201.000/tahun | Lebih murah di tahun pertama, tetapi alamat berbeda. Nama yang diinginkan harus tersedia dan disetujui klien. |
| C — `.com` baru | Daftar nama `.com` baru di HostCloud | Rp120.000 | Rp165.000/tahun | Harga awal terendah pada tiga opsi ini, tetapi perubahan ekstensi perlu persetujuan klien. |

Sumber harga: [HostCloud](https://hostcloud.id/domain/) dan [Porkbun .org](https://porkbun.com/tld/org). Harga HostCloud masih berupa harga etalase; keberhasilan transaksi, total akhir, dan layanan dukungannya belum diuji dalam pekerjaan ini.

Alternatif transfer `.org`: [Dynadot](https://www.dynadot.com/domain/prices) mencantumkan US$11,64 untuk transfer dan perpanjangan, sekitar Rp198.000 sebelum penyesuaian transaksi. Ini juga berada dalam anggaran dasar. Jika harga atau proses opsi A tidak terkonfirmasi, bandingkan checkout alternatif ini sebelum memilih.

Jangan membiarkan domain lama kedaluwarsa dengan tujuan membelinya kembali memakai promo registrasi. **Transfer mempertahankan nama yang sama; registrasi baru membutuhkan nama yang belum dimiliki pihak lain.** Jika memilih alamat baru sekaligus mempertahankan domain lama untuk redirect, biaya domain lama menjadi tambahan dan harus dihitung dalam batas Rp300.000.

## 3. Hosting gratis dan batas penggunaannya

### Pilihan utama: Vercel Hobby

- Sesuai dengan aplikasi Next.js yang sudah dibuat; tidak perlu mengubah arsitektur menjadi website statis.
- Repo saat pemeriksaan terakhir adalah `ptihimatif/bem-fisip-unpad-2026`, **private milik organisasi GitHub**. Mengubahnya menjadi public mengatasi batas koneksi Git Hobby untuk repo tersebut. Perubahan itu belum dijalankan.
- Sebelum dibuat public, periksa file yang terlacak dan riwayat Git agar kredensial, spreadsheet/foto sumber, backup, dan dokumen internal klien tidak ikut terbuka. `.gitignore` tidak menghapus file atau rahasia yang pernah masuk riwayat.
- Vercel Hobby dibatasi untuk penggunaan nonkomersial. Repo public tidak menghapus syarat ini. Vercel memasukkan pembayaran untuk membuat/memperbarui/hosting website dalam contoh penggunaan komersial. Jangan menyimpulkan kelayakan hanya dari status BEM; cocokkan dengan keadaan proyek yang sebenarnya.
- Gunakan akun individu penanggung jawab yang ditunjuk, dengan email pemulihan dan mekanisme serah terima yang terdokumentasi. Admin konten tidak perlu menjadi anggota hosting untuk bekerja di Sanity.

Rujukan: [Vercel Git](https://vercel.com/docs/git), [Vercel Hobby](https://vercel.com/docs/plans/hobby), dan [Fair Use](https://vercel.com/docs/limits/fair-use-guidelines).

### Alternatif gratis: Netlify Free

Jika syarat Hobby tidak cocok, gunakan Netlify Free. Netlify mengizinkan proyek komersial di Free dan mendukung Next.js App Router, SSR, route handlers, serta revalidasi cache. Dengan repo public, jalur koneksi Git gratis lebih sederhana. Jika repo tetap private milik organisasi, koneksi Git langsung memerlukan Pro; alternatif deploy melalui CLI/API dijelaskan dalam dokumentasi Netlify.

Netlify memakai adapter untuk menjalankan Next.js; validasi build dan webhook pada deployment percobaan sebelum domain diarahkan ke sana. Tidak perlu mengganti CMS atau mengubah konten.

Free memiliki **300 kredit/bulan** saat survei dan bisa menjeda website jika kuota habis. Vercel dan Sanity juga memiliki batas paket. Gratis bukan kuota tak terbatas: aktifkan pemberitahuan penggunaan dan tinjau pemakaian setelah peluncuran. Jangan mengaktifkan paket berbayar atau top-up otomatis tanpa anggaran yang disetujui.

Rujukan: [Netlify Free](https://www.netlify.com/blog/introducing-netlify-free-plan/), [harga dan batas](https://www.netlify.com/pricing/), [dukungan Next.js](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), dan [deploy CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/).

## 4. Kondisi proyek yang diserahkan

| Bagian | Kondisi terakhir yang diperiksa |
| --- | --- |
| Website | Next.js 16.4.3, React 19.3.1, TypeScript 6.0.3 |
| CMS | Sanity Studio tertanam pada `/studio`; Sanity 6.20.0, next-sanity 13.4.0 |
| Runtime lokal/CI | Node 22.18.0 dipatok dalam `.node-version`; laptop saat pemeriksaan masih 22.14.0. Hosting memilih Node 22.x yang didukung platform. |
| Package manager | pnpm 11.1.2, memakai `pnpm-lock.yaml` |
| Sanity project | `jcpcptq3` |
| Sanity dataset | `production` — ejaan yang benar, bukan `prodcution` |
| Term konten | `2026` |
| Branch kerja | `dev`; perubahan follow-up masih ada yang belum di-commit |
| Kandidat branch production | Usulan `main` setelah perubahan yang dimaksud direview dan digabung; bukan berarti sudah siap dipilih tanpa memeriksa commit-nya |
| Tujuan deploy/domain | Belum dicatat sebagai layanan aktif; isi tabel penerima di bawah |

Pemeriksaan terakhir: lint, TypeScript, 14 behavior tests, dan audit dependency production lolos; suite browser terakhir lolos 27 pemeriksaan pada desktop Chromium, mobile Chromium, dan mobile WebKit. Build fixture dan build dengan konten Sanity pernah lolos. Ini bukti lokal sebelumnya, bukan bukti domain production sudah berfungsi. Verifikasi commit rilis melalui CI, lalu jalankan checklist singkat di bagian 10; tidak perlu memulai audit atau penilaian ulang tanpa perubahan material.

Catatan penerimaan yang sudah diketahui: masih ada tiga foto anggota dan koreksi sumber tertentu yang menunggu klien, serta sebagian besar deskripsi program belum lengkap. Pemulihan fokus pada salinan kartu program sudah diperbaiki pada peningkatan lokal 27 Oktober di bagian 15. Pemilik rilis menentukan penerimaan konten yang masih menunggu klien. Jangan mengarang data pengganti atau menambah scope saat deployment.

## 5. Data yang diisi saat serah terima

Isi identitas dan lokasi berikut; **jangan tulis password, token, kode EPP, atau secret webhook di file ini**, terutama jika repo akan public.

| Item | Isi saat pelaksanaan |
| --- | --- |
| Opsi domain dan total checkout | Belum diisi; total maksimal Rp300.000 |
| Domain utama dan varian `www` | Belum diisi |
| Registrar dan tanggal kedaluwarsa | Belum diisi |
| Pemilik akun domain / email pemulihan | Belum diisi |
| Developer lama yang membantu pemindahan | Belum diisi |
| Hosting, nama project, dan URL dashboard | Belum diisi |
| Operator hosting dan penerus/pemulih akun | Belum diisi |
| Branch production dan commit SHA | Belum diisi |
| URL percobaan dan URL production | Belum diisi |
| Admin Sanity klien | Belum diisi; masing-masing menggunakan akun sendiri |
| Penanggung jawab pembayaran dan pengingat | Belum diisi |
| Penyetuju peluncuran / operator rollback | Belum diisi |
| Tanggal dan lokasi backup 2026 | Belum diisi; lokasi organisasi yang aksesnya dibatasi |
| Tanggal peluncuran dan hasil uji | Belum diisi |

Jika dokumen ini akan dibagikan publik, simpan nama/email pribadi dan lokasi backup privat dalam catatan akses internal; cukup isi rujukan/pemegang tanggung jawab di sini.

## 6. Urutan deployment untuk developer

### A. Siapkan commit dan akun

1. Tinjau working tree dan pastikan file yang diperlukan masuk commit. Jangan membuang perubahan rekan frontend atau melakukan force-push.
2. Setelah pemeriksaan file/riwayat selesai dan pemilik repo menyetujui, jadikan repo public jika memilih jalur Git gratis. Langkah ini bukan bagian yang sudah dieksekusi oleh dokumen ini.
3. Pastikan CI pada commit yang akan dirilis lolos. Gunakan lockfile dan pnpm yang sudah ada; jangan mengganti package manager saat rilis.
4. Tentukan akun hosting penanggung jawab serta akses Sanity klien. Siapkan akun domain BEM; ikuti urutan transfer di bagian E sebelum mengubah data registran atau memindahkan pengelolaan.

Perintah pemeriksaan lokal yang tersedia, jika perlu dijalankan pada kandidat rilis:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm audit --prod --audit-level high
pnpm exec playwright install chromium webkit
pnpm test:browser
```

`pnpm test:browser` membangun fixture terisolasi dalam `.next-check`; **jangan mengunggah hasil fixture ini ke hosting**. Hosting harus menjalankan build biasa dengan data asli. Pada shell agent yang mewajibkan RTK, gunakan prefix `rtk proxy` pada perintah di atas.

### B. Buat deployment percobaan di hosting gratis

Untuk Vercel: import repo, pilih preset **Next.js**, root directory repo, Node **22.x**, install command `pnpm install --frozen-lockfile`, dan build command `pnpm build`. Biarkan output directory mengikuti preset Next.js. Jangan mengubah ke `output: export` atau menggunakan build fixture.

Gunakan alamat percobaan stabil yang diberikan project, misalnya `https://NAMA-PROYEK.vercel.app`, dengan `NEXT_PUBLIC_SITE_ENV=staging`. Jika alamat belum diketahui, catat setelah project dibuat, isi origin yang benar, lalu build ulang. Jangan menebak domain milik pihak lain. Deployment percobaan boleh memakai slot Production hosting terlebih dahulu selama aplikasi tetap berstatus `staging` dan belum diarahkan ke domain resmi.

Untuk Netlify: pilih dukungan Next.js otomatis dan jalankan build biasa melalui adapter platform. Sesuaikan origin percobaan ke alamat project Netlify. Jangan memakai Netlify Drop untuk mengunggah folder `.next` mentah; aplikasi ini membutuhkan runtime server dan endpoint webhook.

### C. Isi environment variable

| Variabel | Nilai | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `jcpcptq3` | Identitas publik, bukan secret |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Dataset 2026 yang sudah dipakai |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-09-04` | Pertahankan kontrak API saat ini |
| `NEXT_PUBLIC_SITE_ENV` | `staging` untuk percobaan; `production` saat peluncuran | Menentukan indexability aplikasi, terpisah dari nama environment hosting |
| `NEXT_PUBLIC_SITE_URL` | Origin HTTPS yang benar untuk build tersebut | Contoh `https://NAMA-PROYEK.vercel.app`; production memakai domain kanonis terpilih, tanpa path/query |
| `SANITY_TEST_MODE` | `false` | Wajib untuk hosting; fixture hanya lokal/CI |
| `SANITY_REVALIDATE_SECRET` | Nilai acak kuat yang disimpan privat | Server-only; sama dengan secret webhook Sanity |

Gunakan secret berbeda dari secret fixture dalam test. Jangan memberi prefix `NEXT_PUBLIC_` pada secret, dan jangan memasukkan token tulis Sanity ke browser. Pembacaan konten publik saat ini tidak memerlukan token admin. Perubahan env, terutama `NEXT_PUBLIC_*`, harus diikuti build/deploy ulang.

### D. Konfigurasi akses Studio dan webhook

1. Di Sanity Manage, buka project `jcpcptq3`. Konfirmasi dataset tetap `production`.
2. Tambahkan origin HTTPS yang benar ke **CORS origins**, dengan credentials untuk login Studio. Daftarkan origin percobaan yang digunakan dan kemudian origin domain resmi. Jangan membuka credentials untuk wildcard semua domain.
3. Undang akun admin klien ke project. Sanity Free saat survei menyediakan Administrator dan Viewer; role Editor yang lebih terbatas memerlukan paket yang mendukungnya. Jangan berlangganan paket tambahan tanpa keputusan anggaran. [Paket Sanity](https://www.sanity.io/pricing).
4. Buat webhook **POST** ke `https://ORIGIN-YANG-DIUJI/api/revalidate`, dataset `production`, dengan event **Create, Update, Delete**, projection `{_type}`, dan secret yang sama persis dengan environment hosting.
5. Batasi ke konten published, bukan draft/version, menggunakan pengaturan/filter yang sesuai di Sanity. Pastikan penghapusan/unpublish tetap dapat mengirim event. Endpoint harus dapat diakses oleh Sanity, bukan terhalang login proteksi deployment hosting.
6. Periksa log **Attempts** webhook. HTTP 200 `{"revalidated":true}` berarti endpoint memproses invalidasi, bukan bukti bahwa seluruh alur konten sudah benar; lanjutkan uji di bagian 10.

Jika memakai webhook percobaan dan production terpisah, periksa kuota webhook paket Sanity dan gunakan tujuan/secret yang sesuai. Jika hanya satu webhook dipakai, catat tujuan lama sebelum mengalihkannya. Jangan mengubah webhook website lain tanpa persetujuan pemiliknya.

### E. Transfer `bemfisipunpad.org`: dari persiapan sampai selesai

Bagian ini menjelaskan transfer domain lama yang dibahas maintainer. Registrar aktif, tanggal kedaluwarsa, dan status lock tetap harus dikonfirmasi melalui pemegang akun; dokumen ini bukan bukti bahwa transfer sudah dimulai.

**Mengapa pencarian menyebut “tidak tersedia”?** Menu pencarian domain baru memeriksa apakah nama bisa didaftarkan sebagai domain baru. Domain yang sudah terdaftar tidak dapat dibeli ulang lewat menu itu. Untuk mempertahankan `bemfisipunpad.org`, pilih **Transfer Domain**, bukan **Daftar/Beli Domain**. Transfer mengganti penyedia pengelola, bukan mengganti alamat website. Pembayaran transfer saja tidak memberikan hak atas domain tanpa izin pemegangnya.

#### E1. Hubungi developer lama sebelum membayar

Minta developer yang mengelola akun Hostinger untuk:

1. Memastikan `bemfisipunpad.org` ada di akunnya dan memberi tanggal kedaluwarsanya.
2. Memastikan email pemilik domain masih bisa menerima pesan persetujuan transfer.
3. Memeriksa apakah ada transfer lock, penangguhan, atau pembatasan transfer.
4. Membuka transfer lock dan mengambil **EPP/Auth Code** saat siap memulai transfer. Kode ini merupakan izin transfer; simpan dan kirim secara privat.

Di Hostinger, jalur yang dijelaskan panduan resminya adalah **Domains → pilih domain → Manage → Domain Overview**. Matikan **Transfer lock** untuk membuka kunci. Pada **Authorization code**, pilih **Get code** untuk mendapatkan EPP. Ikuti juga persyaratan privacy/DNSSEC registrar yang berlaku; jika ada perubahan DNSSEC, koordinasikan dengan operator DNS agar record DS tetap sesuai.

**Jangan mengubah nama, organisasi, atau email registran terlebih dahulu tanpa memeriksa dampaknya.** Perubahan registran dapat menimbulkan penguncian transfer 60 hari. Jika tujuan akhirnya pindah registrar sekaligus menyerahkan kepemilikan ke BEM, koordinasikan urutannya dengan registrar; perpindahan antar akun Hostinger bukan hal yang sama dengan transfer keluar ke penyedia lain.

Rujukan: [transfer keluar dari Hostinger](https://www.hostinger.com/support/how-to-transfer-your-domain-out-of-hostinger/) dan [FAQ transfer ICANN](https://www.icann.org/resources/pages/name-holder-faqs-2017-10-10-en/).

#### E2. Periksa kelayakan dan masa aktif

- Konfirmasi domain masih aktif dan bisa ditransfer. Jika sudah kedaluwarsa, redemption, atau ditangguhkan, hubungi support terlebih dahulu; jangan menganggap pembayaran transfer biasa pasti menyelesaikannya.
- Periksa pembatasan setelah registrasi, transfer, atau perubahan registran terbaru. Panduan registrar yang dirujuk saat ini menyebut pembatasan 60 hari untuk kondisi tertentu.
- Mulai proses jauh sebelum kedaluwarsa. Dynadot menyarankan minimal dua minggu sebelumnya; jangan menunggu hari terakhir.
- Simpan catatan nameserver dan seluruh record DNS lama, terutama record email. Pastikan layanan DNS tetap berjalan setelah transfer, karena pengelolaan domain tidak otomatis menyalin seluruh record atau mempertahankan layanan DNS gratis registrar lama.

#### E3. Buat akun di penyedia baru

1. Pilih penyedia sesuai harga checkout yang masuk anggaran bagian 2.
2. Buat akun dengan penanggung jawab dan pemulihan akses BEM yang disepakati. Domain akan dikelola dari akun ini setelah transfer berhasil.
3. Tidak perlu membeli paket hosting, email, atau SSL tambahan untuk menghubungkan domain ke website ini.

#### E4. Ajukan lewat menu Transfer Domain

1. Buka **Transfer Domain** di website penyedia baru.
2. Masukkan `bemfisipunpad.org`, tanpa `https://` atau path halaman.
3. Masukkan EPP/Auth Code pada kolom otorisasi jika diminta.
4. Jalankan pemeriksaan transfer, lalu masukkan pesanan ke keranjang.

Sebagai contoh yang terdokumentasi, Dynadot meminta domain dan kode otorisasi, kemudian menyediakan checkout pesanan transfer. Nama menu dan waktu pengisian EPP bisa berbeda pada penyedia lain. Jika masih melihat pesan “tidak tersedia”, pastikan yang dibuka adalah halaman transfer; jika benar, tanyakan alasan penolakan transfer ke support.

#### E5. Periksa tagihan, lalu bayar di penyedia baru

| Pemeriksaan checkout | Hasil yang harus dipastikan |
| --- | --- |
| Nama domain | Tepat `bemfisipunpad.org` |
| Jenis pesanan | **Transfer**, bukan registrasi baru atau pembelian domain dari pihak lain |
| Tambahan masa aktif | Konfirmasi transfer `.org` mencakup tambahan **satu tahun** |
| Total | Maksimal **Rp300.000**, termasuk pajak dan biaya pembayaran |
| Layanan tambahan | Hapus hosting/email/SSL tambahan yang tidak diperlukan |
| Harga tahun berikutnya | Dicatat dan disetujui penanggung jawab pembayaran |

**Bayar tagihan transfer kepada penyedia baru, bukan membeli domain baru di Hostinger.** Jika domain aktif dan memenuhi syarat, umumnya tidak perlu memperpanjang di Hostinger terlebih dahulu: transfer `.org` biasanya sudah mencakup tambahan satu tahun dari tanggal kedaluwarsa yang ada. Konfirmasikan pengecualian dengan penyedia, terutama jika domain baru saja diperpanjang setelah kedaluwarsa. Jangan membayar renewal dan transfer sekaligus tanpa memahami tambahan masa aktif yang benar-benar diperoleh.

Jika domain terlalu dekat dengan kedaluwarsa atau ternyata membutuhkan pemulihan, minta support menjelaskan biaya dan urutan penanganan sebelum membayar. Jika total melampaui anggaran, hentikan checkout dan pilih penyelesaian yang disetujui BEM.

Simpan invoice/bukti pembayaran di catatan keuangan internal. Jangan menaruh detail pembayaran atau EPP di Markdown public.

#### E6. Selesaikan persetujuan setelah pembayaran

1. Penyedia baru memproses pesanan dan memulai transfer setelah persyaratan terpenuhi.
2. Operator akun baru dan developer lama memantau email serta dashboard masing-masing.
3. Jika registrar lama mengirim permintaan persetujuan/release, pemegang akun menyelesaikannya sesuai instruksi resmi. Beberapa alur tidak membutuhkan klik persetujuan manual; ikuti status aktual, bukan email yang belum tentu dikirim.
4. Selesaikan verifikasi email lain yang diminta penyedia baru.

**Status paid/lunas belum sama dengan transfer selesai.** Tunggu konfirmasi transfer, bukan hanya bukti pembayaran. Jika status gagal karena EPP salah atau domain terkunci, perbaiki penyebabnya bersama pemegang akun/support; jangan membuat pesanan berulang tanpa memeriksa pesanan pertama.

#### E7. Tunggu dan verifikasi hasil transfer

Transfer umumnya memerlukan sekitar **5–7 hari**, dapat lebih cepat atau lebih lama sesuai registrar dan status domain. Setelah mendapat konfirmasi selesai, periksa:

- [ ] `bemfisipunpad.org` muncul di dashboard akun baru dengan status aktif.
- [ ] Tanggal kedaluwarsa sesuai masa aktif hasil transfer, bukan sekadar tanggal pembayaran.
- [ ] Pengelolaan nameserver/DNS tersedia, dan resolusi website/email yang masih digunakan tetap benar.
- [ ] Data registran dan akses BEM diselesaikan secara benar melalui proses penyedia, tanpa memalsukan data pemilik.
- [ ] Transfer lock diaktifkan kembali setelah transfer selesai; periksa kembali pengaturan privacy dan DNSSEC sesuai konfigurasi DNS yang digunakan.
- [ ] Invoice, registrar baru, tanggal kedaluwarsa, dan penanggung jawab di bagian 5 sudah dicatat.

Jangan menghapus domain atau menutup akun/layanan lama yang masih melayani DNS atau email sebelum ketergantungannya selesai dipindahkan. Rujukan proses dan pemberitahuan pembayaran/transfer: [Dynadot](https://www.dynadot.com/help/question/transfer-domain-to-dynadot). Penjelasan tambahan masa aktif `.org`: [Cloudflare Registrar](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/).

#### E8. Pesan yang bisa dikirim kepada developer lama

> Kak, kami mau transfer pengelolaan `bemfisipunpad.org` ke akun BEM di penyedia baru. Boleh bantu cek tanggal expired, status transfer lock, akses email pemilik, dan mengambil kode EPP? Mohon kode EPP dikirim secara privat. Nanti mohon bantu menyelesaikan persetujuan transfer jika diminta. Jangan ubah data registran dulu sebelum urutan transfernya dikonfirmasi. Kami juga perlu salinan pengaturan DNS yang masih digunakan, termasuk email jika ada.

### F. Sambungkan domain dan luncurkan

1. Pastikan transfer pada bagian E selesai atau pembelian domain baru sudah aktif. **Transfer registrar berbeda dari mengarahkan website ke hosting baru.** Jika hanya perlu menghubungkan domain aktif ke Vercel, perubahan DNS dapat dilakukan terpisah dari transfer, selama akses dan izin pemilik tersedia.
2. Simpan catatan DNS dan hosting lama. Pertahankan record email seperti MX/TXT, SPF, DKIM, dan verifikasi layanan yang masih dipakai.
3. Tambahkan domain ke project hosting. Masukkan **record DNS yang diberikan dashboard untuk project itu**; jangan menyalin IP/CNAME generik dari tutorial lama. Transfer registrar tidak harus dilakukan bersamaan dengan perubahan nameserver atau cutover hosting.
4. Pilih satu origin kanonis, dengan atau tanpa `www`, lalu arahkan varian lainnya melalui redirect hosting. Pastikan HTTPS berhasil diterbitkan; tidak perlu membeli SSL tambahan.
5. Setelah domain dan launch disetujui, ubah build rilis menjadi `NEXT_PUBLIC_SITE_ENV=production` dan `NEXT_PUBLIC_SITE_URL=https://DOMAIN-KANONIS`, lalu deploy ulang commit yang disetujui.
6. Cocokkan CORS dan webhook dengan domain kanonis. Pastikan webhook langsung menuju endpoint aktif, bukan mengandalkan redirect dari domain lama.
7. Jalankan checklist bagian 10, catat commit/deployment dan hasilnya, lalu serahkan akses serta panduan admin.

## 7. Cara admin mengelola artikel dan kajian

Alamat admin setelah domain aktif: **`https://DOMAIN-RESMI/studio`**. Login memakai akun Sanity masing-masing yang telah diundang. Pengunjung umum tidak mendapat hak edit hanya karena source repo menjadi public.

### Tambah

1. Buka daftar **Publication** dan buat dokumen baru.
2. Pastikan **Term = 2026**.
3. Pilih **Category = Artikel atau Kajian**. Keduanya memakai tipe dokumen `post` yang sama.
4. Isi **Title**, **Slug**, **Published At**, dan **Body**.
5. Isi **Card Excerpt**, **Cover Image** dengan alternative text, serta SEO/social link bila tersedia. Gunakan foto yang disetujui untuk publikasi.
6. Selesaikan validation error, periksa isi, lalu tekan **Publish**.
7. Periksa `/article`, kategori yang sesuai, dan halaman detail `/post/SLUG`. Tiga publikasi terbaru lintas kategori muncul di homepage sesuai tanggal.

### Ubah

1. Buka dokumen, ubah field yang diperlukan, lalu tekan **Publish** lagi.
2. Simpan draft saja belum mengganti versi publik.
3. Hindari mengganti slug setelah tautan dibagikan; perubahan slug dapat memutus alamat lama tanpa redirect.

### Tarik atau hapus

- **Unpublish** untuk menarik dari website sambil mempertahankan dokumen di Studio.
- **Delete** untuk penghapusan permanen sesuai kewenangan admin. Jangan menghapus asset bersama tanpa memeriksa pemakaiannya.
- Setelah unpublish/delete, periksa bahwa kartu hilang dari daftar dan halaman detail lama menampilkan halaman tidak ditemukan.

`Published At` dipakai untuk tanggal dan urutan; mengisinya dengan tanggal masa depan **bukan** pengaturan publish otomatis. Jangan menjanjikan fitur penjadwalan yang belum disiapkan.

## 8. Bagaimana konten diperbarui

```text
Admin Publish / Unpublish / Delete di Sanity
    -> Sanity mengirim webhook bertanda tangan
    -> /api/revalidate memverifikasi signature
    -> tag cache sanity-content kedaluwarsa
    -> permintaan halaman berikutnya mengambil konten published terbaru
```

Sanity Live membantu tab yang terhubung menerima update; webhook memastikan pembaruan tidak bergantung pada tab Live yang sedang terbuka. Invalidasi cache tidak berarti semua tab pengunjung langsung dirender ulang pada waktu yang sama. Perubahan konten memakai resource API/function/cache sesuai paket, tetapi tidak memicu full build website seperti perubahan kode.

Implementasi yang sudah ada: `sanity/lib/live.ts`, `sanity/lib/cache.ts`, dan `app/api/revalidate/route.ts`. Panduan ini tidak menambahkan backend baru.

## 9. Jika artikel/kajian masih menampilkan data lama

| Pemeriksaan | Tindakan |
| --- | --- |
| Masih draft atau salah term | Publish dokumen dan pastikan term `2026`. |
| Project/dataset salah | Cocokkan env deployment dan Studio ke `jcpcptq3/production`. |
| Webhook 503 | Secret belum tersedia di runtime hosting; isi dengan benar dan redeploy. |
| Webhook 401 | Signature hilang/salah; cocokkan secret hosting dan webhook tanpa membagikan nilainya. |
| Webhook 400 | Cek payload/projection `{_type}` dan format request. |
| Tidak ada Attempts atau request tidak sampai | Cek URL, status enabled, dataset, trigger, filter, dan proteksi deployment. |
| Webhook 200 tetapi tampilan belum sesuai | Periksa versi published, URL/domain/deployment yang dibuka, tanggal/sort/category, lalu bandingkan di tab baru dan log hosting. |
| Hanya localhost yang usang | Restart dev dan periksa env lokal. Penanganan cache lokal tidak otomatis memperbaiki hosting. |

Jangan menyuruh admin menghapus data atau mengimpor ulang dataset untuk mengatasi cache. Jangan menjadikan redeploy manual sebagai prosedur wajib setiap kali admin menerbitkan artikel.

## 10. Checklist peluncuran yang terbatas

Tandai hasil nyata; jangan menandai selesai hanya berdasarkan dokumen atau HTTP 200 endpoint.

- [ ] Total domain, pajak, dan biaya pembayaran tidak melebihi Rp300.000; harga renewal dan pemilik akun tercatat.
- [ ] Hosting gratis sesuai syarat pemakaian, commit rilis diketahui, CI lolos, `SANITY_TEST_MODE=false`.
- [ ] Domain HTTPS membuka `/`, `/about`, `/article`, `/hima`, satu post, satu unit, dan `/studio` dengan benar; menu HP dan modal berfungsi.
- [ ] Production memakai origin kanonis dan dapat diindeks; alamat percobaan tetap `staging`/noindex sesuai env yang digunakan. `/robots.txt`, `/sitemap.xml`, favicon, dan social preview diperiksa.
- [ ] Akun admin klien bisa login Studio; pengunjung tanpa akses tidak bisa mengedit.
- [ ] Uji **tambah** dokumen yang disetujui: kartu, kategori, detail, dan sitemap sesuai. Gunakan materi uji yang disetujui; preview yang membaca dataset production tidak mengisolasi penulisan dari website live.
- [ ] Uji **ubah**: publish perubahan penanda yang disetujui, tutup tab Live, lalu periksa tab baru dan Attempts webhook.
- [ ] Uji **unpublish/delete** pada dokumen uji: daftar dan sitemap tidak lagi memuatnya; halaman lama menjadi tidak ditemukan. Jangan memakai dokumen klien lain sebagai bahan uji.
- [ ] Backup 2026 terbaru dapat diakses pemegang tanggung jawab; titik balik hosting/DNS dan operator pemulihan tercatat.
- [ ] Klien menerima hasil dan pengecualian konten yang sudah diketahui; tanggal peluncuran dan penerima handover diisi.

Ini batas pekerjaan rilis. Optimasi, redesign, atau fitur tambahan masuk pekerjaan terpisah jika diperlukan; jangan menambah audit berulang sebagai syarat baru tanpa masalah material yang terbukti.

## 11. Backup dan rollback

### Backup

- Buat export 2026 dengan dokumen **dan asset** sebelum peluncuran/perubahan massal. Simpan file bertanggal di penyimpanan organisasi yang aksesnya dibatasi, bukan GitHub public.
- Catat lokasi, tanggal, checksum atau hasil pemeriksaan arsip, dan orang yang bisa mengaksesnya. Dataset baru tiap tahun tidak menggantikan backup.
- Backup terbatas dari impor sebelumnya berada lokal di `outputs/progul-2026-10-26/` dan `outputs/pre-release-cms/`; itu bukan bukti backup penuh terkini atau restore rehearsal sudah selesai.
- Jika menguji restore, gunakan target terisolasi yang disetujui dan periksa kuota terlebih dahulu. Jangan menimpa dataset `production` untuk latihan.

### Pemulihan sesuai jenis masalah

| Masalah | Pemulihan |
| --- | --- |
| Deployment baru merusak route utama | Kembalikan ke deployment sehat yang dicatat menggunakan fitur rollback/promote hosting, lalu perbaiki source melalui review. Pada peluncuran pertama tanpa deployment sehat sebelumnya, hentikan cutover atau kembalikan DNS/target lama yang dicatat. |
| Domain/DNS salah | Pulihkan record yang dicatat. Pemulihan DNS mengikuti cache/TTL, tidak selalu langsung. Jangan menghapus konfigurasi email. |
| Isi dokumen salah | Gunakan revision/history yang tersedia atau salinan sebelumnya, lalu publish ulang dan verifikasi webhook. Kemampuan history mengikuti paket/retensinya. |
| Dokumen terhapus | Pulihkan dokumen dari backup melalui operator; jangan mengandalkan History saja atau mengimpor seluruh backup secara buta. |
| Webhook rusak | Pulihkan tujuan/secret/filter yang benar dan uji lagi. Menonaktifkan webhook bukan perbaikan freshness; setelah dinonaktifkan, cache bisa tetap usang sampai ada mekanisme pembaruan lain. |

**Rollback kode tidak mengembalikan data Sanity.** Karena itu penanganan deployment dan konten dipisahkan. Trigger pemulihan: route utama gagal, admin tidak bisa login/publish, konten resmi salah setelah rilis, atau domain menunjuk layanan yang keliru.

## 12. Tugas setelah serah terima

- Setelah peluncuran: periksa log dan penggunaan hosting/Sanity pada hari pertama, minggu pertama, dan saat ada kampanye dengan lonjakan pengunjung.
- Berkala: admin memeriksa link/gambar dan melakukan backup sebelum perubahan besar; penanggung jawab mencatat jadwal backup rutin yang bisa dijalankan.
- Domain: pasang pengingat minimal 30 dan 7 hari sebelum kedaluwarsa. Auto-renew hanya jika metode pembayaran dan otorisasinya memang disiapkan oleh BEM.
- Tahun berikutnya: export dan arsipkan data tahun berjalan, lalu rencanakan dataset baru sesuai kebijakan BEM serta kuota akun. Jangan mengganti `production`, term query, atau menghapus data lama secara spontan saat peluncuran 2026.
- Serah terima berikutnya: alihkan akses melalui undangan/pemulihan resmi, perbarui penanggung jawab domain/hosting/Sanity dan pembayaran. Jangan mengandalkan satu password developer lama.

## 13. Ringkasan yang bisa dikirim ke klien

> Website dapat dijalankan dengan hosting gratis dan pengelolaan konten melalui Sanity. Anggaran Rp300.000 difokuskan untuk domain. Pilihan utama adalah mempertahankan domain .org lama dengan transfer ke penyedia yang lebih murah, dengan harga survei sekitar Rp180–220 ribu sebelum total transaksi dikonfirmasi. Admin BEM dapat menambah, mengedit, dan menarik artikel/kajian sendiri tanpa deploy manual. Domain dan akses layanan diserahkan kepada penanggung jawab BEM. Pilihan penyedia, harga checkout, akses domain lama, dan hasil uji website dicatat sebelum peluncuran.

## 14. Hasil cleanup dan kesiapan rilis — 27 Oktober 2026

Maintainer meminta repository dirapikan sebelum push terakhir ke `dev`, termasuk menghapus folder/skill/dokumen agent yang tidak diperlukan. Pekerjaan ini terbatas pada repository lokal dan pemeriksaan; tidak mencakup commit, push, merge, mengubah repo menjadi public, pembayaran, deployment, atau mutasi Sanity.

### Perubahan yang selesai

- Menghapus tooling lokal `.agents/`, `.skills/`, `.codex/`, dan `.impeccable/`, wrapper `CLAUDE.md`, konteks agent `PRODUCT.md`/`DESIGN.md`, brief scaffolding/rencana prarilis lama, serta `scripts/nuke.ts` yang memang dinonaktifkan. Total 220 file fisik dikeluarkan, termasuk 217 file terlacak Git; ukurannya sekitar 5 MB sebelum kompresi. Ini merapikan source tree, bukan klaim pengurangan bundle website.
- Mempertahankan `AGENTS.md` ringkas beserta blok panduan versi Next.js yang dibuat framework. Aturan brand, otoritas produksi, dan perlindungan perubahan rekan tetap ada.
- Mempertahankan source aplikasi, schema/types, asset, test/CI, dan script impor/verifikasi/pemulihan. Hash 106 file aplikasi/konfigurasi/script/test/CI dibandingkan dengan sebelum cleanup dan tetap sama.
- Memperbarui README dan panduan yang masih menunjuk folder lama. Petunjuk CMS About, lima cover unggulan, urutan publikasi, dan query About/pagination disesuaikan dengan implementasi yang sudah ada. Paragraf troubleshooting/verifikasi yang terduplikasi dihapus.
- Menambahkan ignore untuk tooling lokal dan arsip cleanup. File `.env.local`, spreadsheet/foto sumber, serta output backup tidak ikut daftar file yang akan ditambahkan ke repository.

### Pemulihan cleanup bila diperlukan

Sebelum penghapusan, 237 file diarsipkan beserta hash dan diverifikasi pembacaannya. Lokasi lokal yang diabaikan Git:

```text
outputs/repo-cleanup-20261026T165859Z/before-cleanup.zip
outputs/repo-cleanup-20261026T165859Z/manifest.json
```

Arsip berisi versi working tree saat cleanup, termasuk perubahan agent/docs yang belum di-commit. Jangan mengunggah arsip ini ke repo public. Untuk memulihkan, ekstrak ke folder sementara, pilih file yang diperlukan, dan bandingkan sebelum menyalin; jangan menimpa perubahan terbaru dengan mengekstrak seluruh arsip langsung ke root. Setelah commit cleanup dibuat, file lama yang pernah di-commit juga dapat dilihat melalui Git history. Ini backup perubahan repository, bukan backup dataset Sanity.

### Bukti pemeriksaan setelah cleanup

| Pemeriksaan | Hasil |
| --- | --- |
| ESLint seluruh repo | Lolos |
| TypeScript | Lolos |
| Behavior tests | 14/14 lolos |
| Audit dependency production | Tidak ada advisory yang dilaporkan saat pemeriksaan |
| Build fixture production-mode dan browser | 27/27 lolos: desktop Chromium, mobile Chromium, mobile WebKit |
| Build production-mode dengan published Sanity asli | Lolos; memakai origin lokal non-indexable, bukan domain peluncuran |
| Pemeriksaan hasil build data asli | Tidak memuat nama fixture; memuat kelima hash cover yang diimpor dan noindex untuk konfigurasi lokal |
| Review screenshot fixture | About desktop/mobile dan modal program diperiksa; bukan uji perangkat fisik |
| Dokumen/link lokal | Tautan lokal dan code fence diperiksa; tidak tersisa rujukan aktif ke folder agent yang dihapus |
| Diff whitespace | Lolos |

Log error pada fixture kegagalan CMS dan request tanpa signature memang disengaja oleh test. Satu peringatan detector UI sebelum tooling diarsipkan berasal dari border pada elemen blockquote semantik; itu bukan temuan defect baru. TypeGen tidak dijalankan ulang karena schema/query tidak diubah dalam cleanup. Build lokal tidak membuktikan konfigurasi hosting, pengiriman webhook eksternal, atau hasil Core Web Vitals di lapangan.

### Penilaian product engineering

**Nilai aplikasi tetap 8/10. Siap dilanjutkan ke staging dari sisi kode yang diperiksa.** Tidak ditemukan kegagalan kode yang mengharuskan redesign atau refactor baru akibat cleanup. Nilai ini tidak diturunkan hanya karena domain/akun belum diverifikasi dalam sesi ini.

| Area | Penilaian | Alasan |
| --- | --- | --- |
| Arsitektur | 8,5/10 | Next.js dan Sanity sesuai kebutuhan; data/query terpusat dan komponen interaktif dibatasi |
| Backend/CMS | 8,5/10 | Query bertipe, isolasi term, webhook bertanda tangan, serta script pemulihan terjaga |
| UX/aksesibilitas | 7,5/10 | Alur utama dan reduced motion diuji; edge case fokus kartu duplikat yang sudah diketahui tetap tercatat di bagian 4 |
| Kinerja | 7/10 | Query About dan archive sudah dipersempit; optimasi lanjutan menunggu pengukuran hosting, bukan syarat refactor mendadak |
| Verifikasi | 8,5/10 | Build data asli dan fixture, behavior test, serta tiga konfigurasi browser lolos |
| Dokumentasi | 8/10 | Handover biaya/domain/admin/pemulihan tersedia dan rujukan usang dirapikan |

### Langkah peluncuran yang masih harus dilakukan

1. **Commit dan layanan:** review diff yang dimaksud, pilih commit/branch rilis, push melalui proses tim, tetapkan akun hosting gratis yang memenuhi syarat, selesaikan akses/transfer domain dan environment yang benar. Tidak ada perubahan GitHub/hosting yang dieksekusi oleh cleanup ini.
2. **Verifikasi di hosting:** periksa HTTPS/origin/robots, login admin, serta tambah–ubah–unpublish/delete dokumen uji yang disetujui saat semua tab Live ditutup. Cocokkan Attempts webhook dan hasil website. Ini membuktikan alur admin yang tidak bisa dipastikan hanya dari tes lokal.
3. **Pemulihan dan penerimaan:** pastikan export 2026 terkini dapat diakses, operator/titik balik tersedia, dan klien menerima hasil serta kekurangan konten yang sudah diketahui. Jangan menambah scope atau mutasi konten lain saat menjalankan checklist ini.

Pada akhir sesi cleanup, fokus kartu duplikat, lazy loading video, dan pengurangan salinan carousel masih menjadi backlog. Ketiganya kemudian dikerjakan dengan persetujuan maintainer pada bagian 15. Penilaian di atas adalah rekam hasil cleanup sebelum peningkatan tersebut.

## 15. Peningkatan sebelum deployment dan SEO — 27 Oktober 2026

Maintainer menyetujui rencana peningkatan kualitas dan meminta SEO, dengan ketentuan tampilan serta isi dipertahankan. Pekerjaan ini tidak mencakup commit/push, deployment, perubahan layanan/CORS/webhook, atau mutasi konten Sanity. Arsip lokal sebelum perubahan: `outputs/predeployment-improvements-20261027/before.zip`; tidak ikut Git.

### Implementasi

- **Interaksi:** modal dari kartu visual duplikat mengembalikan fokus ke kartu kanonis yang dapat diakses. Latar belakang menjadi inert selama modal terbuka; timer, observer, listener, dan animasi penutupan dibersihkan saat unmount. Posisi awal carousel disiapkan sebelum paint dan tombol baru aktif setelah hydration agar klik awal tidak hilang di WebKit.
- **Carousel:** lima program memakai tiga salinan, dari 35 menjadi 15 tombol DOM. Pembungkusan berpindah satu kelompok utuh sambil mempertahankan offset program; kumpulan pendek tetap memiliki buffer lebih lebar. Swipe, snap, tampilan, kecepatan carousel otomatis lain, dan preferensi tanpa tombol/arrows/scrollbar dipertahankan.
- **Media:** YouTube dan script Instagram dimuat ketika berjarak sekitar 400 px dari viewport. Kotak video dan tautan fallback Instagram tetap ada; `onReady` menangani pemrosesan ulang setelah navigasi client. Gambar Sanity mendapat kandidat CDN responsif melalui `picture/source`, memakai crop/hotspot dan rasio yang sama, tanpa proxy gambar kedua.
- **Arsitektur data:** pembacaan post/unit serta hasil pagination dibagi antara metadata dan render melalui cache per request. Query post menambahkan `_updatedAt`; TypeGen dijalankan ulang. Schema dan data CMS tidak diubah.
- **SEO:** canonical archive mempertahankan kategori dan halaman aktual, membuang parameter tracking/default, serta membatasi halaman yang melampaui total. Urutan alternatif `terlama` diberi noindex. Metadata memiliki locale dan fallback gambar berbagi dari logo yang sudah ada. Post memakai tanggal publikasi/perubahan asli, JSON-LD Article dan BreadcrumbList yang aman dari penutupan script. Penulis dan gambar artikel tidak dikarang jika sumber tidak menyediakannya. URL sitemap konsisten memakai slug yang di-encode. Studio dan URL percobaan tetap noindex.
- **Operasional:** `scripts/verify_deployment.mjs` memeriksa route, canonical, metadata, data terstruktur post, robots, sitemap, Studio noindex, favicon, dan penolakan fixture terdeploy melalui request GET. Script tidak login atau menulis konten.

### Bukti lokal

| Pemeriksaan | Hasil |
| --- | --- |
| Lint, TypeScript, TypeGen | Lolos |
| Behavior test | 18/18 lolos |
| Browser fixture | 42/42 lolos: desktop Chromium, mobile Chromium, mobile WebKit; termasuk animasi modal, Escape berulang, dan pemulihan saat browser kembali |
| Dependency production | Tidak ada advisory yang dilaporkan saat pemeriksaan |
| Build published Sanity asli | Lolos; origin lokal non-indexable, bukan deployment |
| Perbandingan homepage data asli | 234.334 menjadi 220.796 byte HTML, turun sekitar 5,8%; teks terlihat yang unik sama; 35 menjadi 15 kartu program; tidak ada fixture |
| Smoke check HTTP/SEO data asli | Home, About, archive, Hima, satu post/unit, robots, sitemap, Studio dan favicon lolos pada server lokal |
| Browser data asli | Modal, cover CDN responsif, dan screenshot desktop/mobile diperiksa; port lokal 3124 belum diizinkan untuk Sanity Live, sehingga kegagalan CORS dicatat terpisah |

HTML yang lebih kecil bukan klaim skor Lighthouse atau Core Web Vitals. Tes fixture memakai stub media pihak ketiga agar deterministik; pemutaran/hasil embed asli masih diperiksa pada origin hosting. Tidak ada klaim bahwa domain final, CRUD admin, webhook eksternal, atau akses backup organisasi sudah diuji.

### Pelaksanaan pada hosting

Jalankan setelah origin dan deployment yang disetujui tersedia:

```sh
node scripts/verify_deployment.mjs https://DOMAIN-STAGING --environment staging --post SLUG-PUBLISHED --unit SLUG-UNIT
node scripts/verify_deployment.mjs https://DOMAIN-RESMI --environment production --post SLUG-PUBLISHED --unit SLUG-UNIT
```

Gunakan slug yang benar-benar published, misalnya `audiensi-rektorat-ukt-2026` dan `bidang-kaderisasi-dan-pengembangan` jika masih tersedia saat pengujian. Periksa ulang semua placeholder sebelum menjalankan. Pemeriksaan lokal khusus boleh memakai `--allow-local` dengan mode staging; hasilnya tetap bukan verifikasi hosting.

Tiga langkah rilis tetap sama: **(1)** commit/hosting/domain/env dan CORS, **(2)** HTTPS/admin/CRUD dengan tab Live ditutup serta Attempts webhook, **(3)** backup/rollback dan penerimaan klien. Tambahkan pemeriksaan embed asli, pengukuran mobile dan Search Console di dalam langkah tersebut, tanpa membuka audit/refactor baru. Target pengalaman pengguna adalah LCP ≤2,5 detik, INP ≤200 ms, CLS ≤0,1 pada persentil ke-75; hasil lapangan membutuhkan trafik nyata. Target penilaian ≥9/10 belum dinyatakan tercapai di semua area hanya berdasarkan perubahan kode.

Rujukan teknis: [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article), [canonical pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading), dan [Core Web Vitals](https://web.dev/articles/vitals). Pemilik domain memverifikasi Google Search Console dan mengirim sitemap setelah domain produksi aktif; implementasi SEO tidak menjamin ranking atau indexing seketika.

---

Dokumen ini mencatat rencana dan prosedur, bukan pelaksanaan yang belum terjadi. Pada pembuatannya tidak ada source aplikasi, data Sanity, visibility repo, paket hosting, domain, atau DNS yang diubah. Harga dan kebijakan layanan perlu dibaca kembali saat checkout/pelaksanaan menggunakan tautan resmi di atas.
