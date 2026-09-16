import Link from "next/link";
import Image from "next/image";
import { safeExternalUrl } from "@/sanity/lib/urls";

interface FooterProps {
  settings?: {
    fisipCareCenterUrl?: string | null;
  } | null;
  careCenterUrl?: string | null;
}

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang" },
  { href: "/article", label: "Artikel dan Kajian" },
  { href: "/hima", label: "Hima/Huria" },
  {
    href: "https://www.instagram.com/fisipcarecenter/",
    label: "Fisip Care Center",
    external: true,
  },
];

const socialItems = [
  {
    label: "Instagram",
    src: "/assets/logo/ig.svg",
  },
  {
    label: "TikTok",
    src: "/assets/logo/tiktok.svg",
  },
  {
    label: "LinkedIn",
    src: "/assets/logo/linkedin.svg",
  },
  {
    label: "YouTube",
    src: "/assets/logo/yt.svg",
  },
  {
    label: "LINE",
    src: "/assets/logo/line.svg",
  },
];

export default function Footer({
  settings,
  careCenterUrl,
}: FooterProps = {}) {
  const rawCareCenter = settings?.fisipCareCenterUrl ?? careCenterUrl;
  const safeCareCenter = safeExternalUrl(rawCareCenter);

  return (
    <footer className="border-t py-12 text-white">
      <div className="w-full px-6 sm:px-8">
        <div className="flex flex-col items-stretch justify-between gap-14 md:flex-row md:gap-10">
          <div className="flex flex-1 flex-col justify-between gap-8 md:gap-6">
            <div className="flex min-h-40 items-center gap-4 md:self-stretch">
              <Image
                src="/assets/LOGO%20KABINET/logo-gabungan.png"
                alt="Logo Pendar Mentari BEM FISIP UNPAD"
                width={480}
                height={160}
                className="h-40 w-auto max-w-full object-contain object-left"
              />
            </div>

          </div>

          <nav
            aria-label="Navigasi footer"
            className="flex flex-1 flex-col items-start gap-5 md:items-end md:gap-3"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-right text-md font-bold text-white transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
              >
                {item.label}
              </Link>
            ))}
          </nav>

        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-10 sm:flex-row sm:items-center sm:gap-6 md:border-t md:border-white/10 md:pt-6">
          <p className="w-full border-t border-white/10 pt-6 text-xs text-white/50 sm:w-auto sm:border-t-0 sm:pt-0">
            &copy; {new Date().getFullYear()} BEM FISIP UNPAD. All Rights
            Reserved.
          </p>
          <div
            className="flex items-center gap-10"
            aria-label="Media sosial BEM FISIP UNPAD"
          >
            {socialItems.map((item) => (
              <span
                key={item.label}
                title={item.label}
                role="img"
                aria-label={item.label}
                className="text-white/80 transition-colors hover:text-white"
              >
                <Image
                  src={item.src}
                  alt=""
                  width={28}
                  height={28}
                  aria-hidden="true"
                  className="h-7 w-7"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
