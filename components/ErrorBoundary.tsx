"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
  backLink?: string;
  backLabel?: string;
}

export default function ErrorBoundary({
  error,
  reset,
  title = "Terjadi Kesalahan",
  message = "Maaf, halaman ini tidak dapat dimuat saat ini.",
  backLink = "/",
  backLabel = "Kembali ke Beranda",
}: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">{title}</h1>
        <p className="mb-8 text-white/80">{message}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-brand-yellow px-6 py-3 font-bold text-brand-blue transition-colors hover:bg-brand-yellow/90"
          >
            Coba Lagi
          </button>
          <Link
            href={backLink}
            className="rounded-lg border border-white/20 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
