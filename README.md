# BEM FISIP Unpad 2026

Website resmi BEM FISIP Universitas Padjadjaran 2026 (Kabinet Pendar Mentari): company profile, struktur organisasi, program kerja, mahasiswa berprestasi, artikel dan kajian, serta direktori Himpunan/Huria.

Dibangun dengan Next.js 16 (App Router), React 19, Tailwind CSS 4, dan Sanity sebagai CMS (Studio di `/studio`).

## Mulai cepat

```bash
pnpm install
cp .env.example .env.local   # isi project ID, dataset, dan seterusnya
pnpm dev                     # http://localhost:3000, Studio di /studio
```

Sebelum push:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Dokumentasi

Dokumentasi lengkap (bahasa Indonesia) ada di [`docs/panduan/`](docs/panduan/README.md):

1. [Gambaran umum](docs/panduan/01-gambaran-umum.md)
2. [Setup dan menjalankan](docs/panduan/02-setup-dan-menjalankan.md)
3. [Struktur proyek](docs/panduan/03-struktur-proyek.md)
4. [Model konten Sanity](docs/panduan/04-model-konten-sanity.md)
5. [Panduan editor konten](docs/panduan/05-panduan-editor-konten.md)
6. [Deploy dan operasional](docs/panduan/06-deploy-dan-operasional.md)
7. [Pemeliharaan dan troubleshooting](docs/panduan/07-pemeliharaan-dan-troubleshooting.md)

Aturan kerja proyek (rencana dan persetujuan sebelum mengubah apa pun) ada di [`AGENTS.md`](AGENTS.md) dan folder `.agents/`. Brief produk dan teknis: [`docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md`](docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md).
