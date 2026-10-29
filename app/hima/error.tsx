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
      message="Maaf, halaman Hima/Huria tidak dapat dimuat saat ini."
    />
  );
}
