import Link from "next/link";
import { safeExternalUrl, safeMailto } from "@/sanity/lib/urls";

const navigation = [
  ["Home", "/"],
  ["Tentang", "/about"],
  ["Publikasi", "/article"],
  ["Hima / Huria", "/hima"],
] as const;

export function SiteHeader({ organizationName, cabinetName }: { organizationName?: string | null; cabinetName?: string | null }) {
  return (
    <header className="border-b-4 border-[var(--color-brand-yellow)] bg-[var(--color-brand-blue)] px-6 py-6 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href="/" className="text-xl font-extrabold focus-visible:outline-2 focus-visible:outline-offset-4">
            {organizationName ?? "BEM FISIP Unpad 2026"}
          </Link>
          {cabinetName && <p className="mt-1 text-sm text-white/80">{cabinetName}</p>}
        </div>
        <nav aria-label="Navigasi utama">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            {navigation.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ officialEmail, careCenterUrl }: { officialEmail?: string | null; careCenterUrl?: string | null } = {}) {
  const safeCareCenterUrl = safeExternalUrl(careCenterUrl);
  const safeEmail = safeMailto(officialEmail);
  return (
    <footer className="border-t bg-white px-6 py-8 text-sm text-slate-600">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>BEM FISIP Unpad 2026</p>
          {safeEmail && officialEmail && <a href={safeEmail} className="block underline underline-offset-4">{officialEmail}</a>}
        </div>
        <div className="flex flex-wrap gap-4">
          {safeCareCenterUrl && <a href={safeCareCenterUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-brand-blue)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">FISIP Care Center</a>}
          <Link href="/" className="font-semibold text-[var(--color-brand-blue)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Kembali ke beranda</Link>
        </div>
      </div>
    </footer>
  );
}
