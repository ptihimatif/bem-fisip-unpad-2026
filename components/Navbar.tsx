'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/about', label: 'Tentang' },
  { href: '/article', label: 'Artikel dan Kajian' },
  { href: '/hima', label: 'Hima/Huria' },
  { href: 'https://www.instagram.com/fisipcarecenter/', label: 'Fisip Care Center', external: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setMenuOpen(false);
    setPrevPathname(pathname);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#000c23]/5 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-6 sm:px-8 py-4 text-white">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/LOGO%20KABINET/logo-full.png"
            alt="BEM FISIP UNPAD Logo"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="text-sm font-bold text-white/90 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="relative h-9 w-9 p-1 md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute inset-0 m-auto h-6 w-6 transition-all duration-300 ${
              menuOpen ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute inset-0 m-auto h-6 w-6 transition-all duration-300 ${
              menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#000c23]/95 backdrop-blur-md ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col px-6 py-3 gap-1 border-t border-white/10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="text-sm font-medium text-white/90 hover:text-white transition-colors py-2.5"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}