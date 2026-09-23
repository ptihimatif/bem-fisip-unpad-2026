"use client";

import ErrorBoundary from "@/components/ErrorBoundary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      error={error}
      reset={reset}
      message="Maaf, artikel yang Anda cari tidak dapat dimuat saat ini."
      backLink="/article"
      backLabel="Kembali ke Artikel"
    />
  );
}
