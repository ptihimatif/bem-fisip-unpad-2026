"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCareCenterUrl } from "@/lib/site-content";

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

export default function Navbar({ careCenterUrl }: { careCenterUrl?: string | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  if (pathname === "/studio" || pathname.startsWith("/studio/")) return null;
  const links = navItems.map((item) => item.external ? { ...item, href: getCareCenterUrl({ fisipCareCenterUrl: careCenterUrl }) } : item);

  return (
    <nav className="fixed top-0 left-0 right-0 z-998 w-full bg-[#000c23]/25 backdrop-blur-lg">
      <div className="flex w-full items-center justify-between px-6 sm:px-8 py-4 text-white">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/LOGO%20KABINET/logo-full.png"
            alt="BEM FISIP UNPAD Logo"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
            style={{ height: "auto" }}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="text-base font-bold text-white/80 hover:text-white hover:underline transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="relative h-11 w-11 p-1 md:hidden text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute inset-0 m-auto h-6 w-6 transition-all duration-300 ${
              menuOpen
                ? "rotate-90 scale-50 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute inset-0 m-auto h-6 w-6 transition-all duration-300 ${
              menuOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-50 opacity-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div id={menuId} className="md:hidden overflow-hidden border-t border-b border-white/10">
          <div className="flex flex-col px-6 py-3">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-base font-medium text-white/80 hover:text-white transition-colors py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
