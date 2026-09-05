import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto max-w-2xl px-6 py-20"><h1 className="text-3xl font-bold text-[var(--color-brand-blue)]">Halaman tidak ditemukan</h1><p className="mt-3 text-slate-600">Konten mungkin belum dipublikasikan atau tautannya telah berubah.</p><Link href="/" className="mt-6 inline-flex rounded-md bg-[var(--color-brand-blue)] px-4 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4">Kembali ke beranda</Link></main>;
}
