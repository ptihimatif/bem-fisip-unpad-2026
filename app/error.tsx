"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-depth text-3xl font-bold text-white">Konten tidak dapat dimuat</h1>
      <p className="mt-3 text-white/70">Silakan coba lagi. Jika masalah berlanjut, hubungi BEM melalui kanal resmi.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-brand-yellow px-4 py-2 font-semibold text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
      >
        Coba lagi
      </button>
    </div>
  );
}
