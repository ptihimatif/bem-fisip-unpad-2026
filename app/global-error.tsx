"use client";

import "./globals.css";

// This boundary also works when the root layout cannot fetch CMS settings.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, background: "#000c23", color: "white", fontFamily: "Inter, sans-serif" }}>
        <title>Konten tidak dapat dimuat — BEM FISIP Unpad 2026</title>
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24">
          <h1 className="text-3xl font-bold">Konten tidak dapat dimuat</h1>
          <p className="mt-3 text-white/80">Silakan coba lagi. Jika masalah berlanjut, hubungi BEM melalui kanal resmi.</p>
          <button type="button" onClick={() => retry()} className="mt-6 self-start rounded-md bg-brand-yellow px-5 py-3 font-semibold text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow">Coba lagi</button>
        </main>
      </body>
    </html>
  );
}
