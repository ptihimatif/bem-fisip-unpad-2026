"use client";

import { useEffect, useRef, useState } from "react";
import ParallaxImage from "@/components/ParallaxImage";
import type { ContentCard } from "@/lib/cabinet-content";

const MISI = [
  {
    no: "01",
    title: "Mulai Menata Diri",
    body: "BEM FISIP Unpad menguatkan tata kelola organisasi yang beretika dan profesional dengan menciptakan lingkungan kepengurusan yang aman, setara, dan mendukung pertumbuhan kapasitas fungsionaris.",
  },
  {
    no: "02",
    title: "Mulai Bersama",
    body: "BEM FISIP Unpad mengakselerasi kolaborasi antar elemen Keluarga Mahasiswa FISIP Unpad dengan menumbuhkan budaya dialog konstruktif sebagai dasar pengambilan kebijakan bersama.",
  },
  {
    no: "03",
    title: "Mulai Bertindak dengan Empati",
    body: "BEM FISIP Unpad menjalankan fungsi eksekutif mahasiswa melalui perumusan, perencanaan, dan pelaksanaan kebijakan serta advokasi yang berangkat dari empati dan pemetaan kebutuhan nyata, guna memperjuangkan dan mengawal kesejahteraan Kema FISIP secara berkelanjutan.",
  },
  {
    no: "04",
    title: "Mulai Pengembangan",
    body: "BEM FISIP Unpad mengaktualisasi potensi dan inovasi Kema FISIP melalui penyediaan wadah inkubasi yang melakukan penjaringan dan pembinaan secara terarah, relevan, dan tepat sasaran.",
  },
  {
    no: "05",
    title: "Mulai Penguatan",
    body: "BEM FISIP Unpad mengamplifikasi kesadaran kolektif dalam pengawalan isu sosial-politik serta pengabdian sosial secara holistik dan adaptif, melalui pembacaan konteks yang kritis untuk memperkuat peran mahasiswa dalam menjawab tantangan sosial-lingkungan, sosial-masyarakat, dan sosial-politik.",
  },
];

const STAGGER_MS = 400;

export default function MisiSection({ items }: { items?: ContentCard[] | null }) {
  const cards = items?.length ? items.map((item, index) => ({ no: String(index + 1).padStart(2, "0"), title: item.title, body: item.description })) : MISI;
  const count = cards.length;
  const isDesktop = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches;

  // openSet tracks which indices are open.
  const [open, setOpen] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });

  // Desktop: when the section scrolls into view, open cards one by one.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const open = (desktop: boolean) => {
      if (!desktop) return;
      for (let i = 0; i < count; i++) {
        timers.push(setTimeout(
          () => setOpen((prev) => new Set(prev).add(i)),
          reduceMotion ? 0 : i * STAGGER_MS,
        ));
      }
    };

    const mq = window.matchMedia("(min-width: 768px)");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) open(mq.matches);
      },
      { threshold: 0.15 },
    );
    observer.observe(section);

    return () => { observer.disconnect(); timers.forEach(clearTimeout); };
  }, [count]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="misi-heading"
      className="relative isolate mx-auto max-w-6xl overflow-x-visible overflow-y-clip px-6 py-24 md:px-14"
    >
      <ParallaxImage
        src="/assets/about/asset3.png"
        alt=""
        width={840}
        height={840}
        speed={0.18}
        sizes="(min-width: 768px) max(1800px, 110vw), 150vw"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[150vw] max-w-none -translate-x-1/2 -translate-y-1/2 md:w-[max(1800px,110vw)]"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="mb-10 text-center">
          <h2
            id="misi-heading"
            className="text-depth text-3xl text-brand-yellow font-bold leading-snug sm:text-4xl lg:text-5xl "
            style={{ letterSpacing: "-0.03em" }}
          >
            Misi
          </h2>
        </div>

        <div className="space-y-3">
          {cards.map((m, i) => {
            const isOpen = open.has(i);
            return (
              <div
                key={m.no}
                className="overflow-hidden rounded border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_-8px_rgba(255,255,255,0.12)] ring-1 ring-inset ring-white/10 transition-all duration-300 hover:border-white/25 hover:bg-white/15 hover:shadow-[0_12px_40px_-8px_rgba(255,255,255,0.2)] motion-reduce:transition-none"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => {
                    if (!isDesktop()) toggle(i);
                  }}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-white/15 md:cursor-default md:hover:bg-transparent"
                >
                  <span className="text-xl font-bold text-white">
                    {m.title}
                  </span>
                  <svg
                    aria-hidden
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 text-white transition-transform duration-300 motion-reduce:transition-none md:hidden ${
                      isOpen ? "rotate-180 text-brand-yellow" : ""
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-6 text-white/80 lg:text-justify">
                      {m.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
