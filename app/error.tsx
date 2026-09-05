"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-2xl px-6 py-20"><h1 className="text-3xl font-bold text-[var(--color-brand-blue)]">Konten tidak dapat dimuat</h1><p className="mt-3 text-slate-600">Silakan coba lagi. Jika masalah berlanjut, hubungi BEM melalui kanal resmi.</p><button type="button" onClick={reset} className="mt-6 rounded-md bg-[var(--color-brand-blue)] px-4 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4">Coba lagi</button></main>;
}
