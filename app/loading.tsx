import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <main
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#000c23]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6">
        <LoadingSpinner />

        <p className="text-md font-bold text-white">
          MEMUAT
        </p>
      </div>
    </main>
  );
}