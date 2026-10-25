import Link from "next/link";
import Image from "next/image";

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
    href: "https://www.instagram.com/bemfisipunpad/",
  },
  {
    label: "TikTok",
    src: "/assets/logo/tiktok.svg",
    href: "https://www.tiktok.com/@bemfisipunpad",
  },
  {
    label: "LinkedIn",
    src: "/assets/logo/linkedin.svg",
    href: "https://id.linkedin.com/company/bemfisipunpad",
  },
  {
    label: "YouTube",
    src: "/assets/logo/yt.svg",
    href: "https://www.youtube.com/@bemfisipunpad4007",
  },
  {
    label: "X",
    src: "/assets/logo/x.svg",
    href: "https://x.com/bemfisipunpad",
  },
];

export default function Footer({}: FooterProps = {}) {
  return (
    <footer className="border-t py-12 text-white">
      <div className="w-full px-6 sm:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <div className="flex flex-col items-stretch justify-between gap-14 md:flex-row md:gap-10">
          <div className="flex flex-1 flex-col justify-between items-center gap-8 md:gap-6">
            <div className="flex min-h-40 items-center gap-4 md:self-stretch">
              <Image
                src="/assets/LOGO%20KABINET/logo-gabungan.png"
                alt="Logo Pendar Mentari BEM FISIP UNPAD"
                width={480}
                height={160}
                className="h-40 w-auto max-w-full object-contain object-center lg:object-left"
                style={{ width: "auto" }}
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
                className="text-right text-base font-bold text-white transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-10 sm:flex-row sm:items-center sm:gap-6 md:border-t md:border-white/10 md:pt-6">
          <p className="w-full border-t border-white/10 pt-6 text-xs text-white sm:w-auto sm:border-t-0 sm:pt-0 tracking-tighter">
            &copy; {new Date().getFullYear()} BEM FISIP UNPAD. All Rights
            Reserved.
          </p>
          <div
            className="flex items-center gap-10"
            aria-label="Media sosial BEM FISIP UNPAD"
          >
            {socialItems.map((item) => (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                title={item.label}
                className="text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  width={28}
                  height={28}
                  className="h-7 w-7"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
