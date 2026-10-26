"use client";

import ErrorBoundary from "@/components/ErrorBoundary";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <ErrorBoundary
      error={error}
      retry={retry}
      message="Maaf, artikel yang Anda cari tidak dapat dimuat saat ini."
      backLink="/article"
      backLabel="Kembali ke Artikel"
    />
  );
}
