import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{
        backgroundImage: `
    radial-gradient(ellipse 120% 45% at 50% 0%, rgba(0, 48, 137, 0.85) 0%, transparent 70%),
    radial-gradient(ellipse 80% 35% at 15% 45%, rgba(0, 102, 204, 0.55) 0%, transparent 65%),
    radial-gradient(ellipse 90% 30% at 90% 60%, rgba(90, 140, 255, 0.45) 0%, transparent 65%),
    radial-gradient(ellipse 70% 40% at 40% 100%, rgba(0, 30, 90, 0.95) 0%, transparent 70%),
    radial-gradient(circle at 75% 82%, rgba(255, 138, 0, 0.25) 0%, transparent 20%),
    radial-gradient(circle at 8% 68%, rgba(255, 186, 58, 0.25) 0%, transparent 18%),
    linear-gradient(180deg, #000c23 0%, #003089 48%, #000c23 100%)
  `,
      }}
    >
      <div className="max-w-md text-center">
        <h1 className="text-[8rem] font-bold leading-none text-brand-yellow sm:text-[10rem] md:text-[13rem]">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-white">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mt-3 text-white/80">
          Konten mungkin belum dipublikasikan atau tautannya telah berubah.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex bg-brand-yellow px-6 py-3 font-bold text-brand-blue transition-colors hover:bg-brand-yellow/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
