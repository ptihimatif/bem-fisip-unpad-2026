"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { SanityImage } from "@/components/SanityImage";
import { SanityPortableText } from "@/components/SanityPortableText";
import type { FEATURED_PROGRAMS_QUERY_RESULT } from "@/sanity.types";

type Program = FEATURED_PROGRAMS_QUERY_RESULT[number];

interface ProgramCarouselProps {
  programs: FEATURED_PROGRAMS_QUERY_RESULT;
}

export default function ProgramCarousel({ programs }: ProgramCarouselProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProgram = programs.find((p) => p._id === selectedId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Duplicate the programs array 15 times to create a massive track.
  // Combined with the scroll-reset logic below, it creates a true infinite loop.
  const MULTIPLIER = 15;
  const infinitePrograms = Array(MULTIPLIER).fill(programs).flat();

useEffect(() => {
  // Memindahkan posisi carousel ke tengah tanpa membuat seluruh layar web ikut turun
  if (scrollRef.current && itemRefs.current.length > 0) {
    const middleIndex = Math.floor((programs.length * MULTIPLIER) / 2);
    const targetItem = itemRefs.current[middleIndex];
    const container = scrollRef.current;

    if (targetItem && container) {
      // Hitung posisi horizontal elemen agar berada di tengah container
      const centerPosition =
        targetItem.offsetLeft -
        container.clientWidth / 2 +
        targetItem.clientWidth / 2;
      container.scrollLeft = centerPosition;
    }
  }
}, [programs.length]);

const handleScroll = () => {
  if (!scrollRef.current) return;
  const { scrollLeft, scrollWidth} = scrollRef.current;

  const threshold = scrollWidth / MULTIPLIER;
  if (scrollLeft < threshold || scrollLeft > scrollWidth - threshold * 2) {
    scrollRef.current.style.scrollBehavior = "auto";

    const middleIndex = Math.floor((programs.length * MULTIPLIER) / 2);
    const targetItem = itemRefs.current[middleIndex];
    const container = scrollRef.current;

    if (targetItem && container) {
      const centerPosition =
        targetItem.offsetLeft -
        container.clientWidth / 2 +
        targetItem.clientWidth / 2;
      container.scrollLeft = centerPosition;
    }

    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.style.scrollBehavior = "smooth";
    }, 50);
  }
};

  const handleNext = () => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector(
        '[data-card="true"]',
      ) as HTMLElement;
      if (card) {
        const gap = 24; // gap-6 equals 24px
        const scrollAmount = card.offsetWidth + gap;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector(
        '[data-card="true"]',
      ) as HTMLElement;
      if (card) {
        const gap = 24;
        const scrollAmount = card.offsetWidth + gap;
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-7xl">
      {/* Desktop Navigation Buttons - Hidden on sm and md */}
      <button
        onClick={handlePrev}
        className="absolute -left-12 top-1/2 z-10 -translate-y-1/2 hidden lg:flex cursor-pointer items-center justify-center text-white transition-transform hover:scale-110 hover:text-brand-yellow focus:outline-none"
        aria-label="Previous programs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="h-10 w-10"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute -right-12 top-1/2 z-10 -translate-y-1/2 hidden lg:flex cursor-pointer items-center justify-center text-white transition-transform hover:scale-110 hover:text-brand-yellow focus:outline-none"
        aria-label="Next programs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="h-10 w-10"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* 
        Snap Carousel Track:
        - Native swipe support (overflow-x-auto, snap-x)
        - Hides scrollbar
      */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {infinitePrograms.map((program, index) => (
          <button
            key={`${program._id}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            data-card="true"
            type="button"
            onClick={() => setSelectedId(program._id)}
            /* 
              Responsive Layout: 
              Default (Mobile): ~75vw (1 card centered + edges peeking)
              sm: 45vw (2 cards centered + edges peeking)
              lg: 22% (4 cards perfectly aligned with gap-6) 
            */
            className="group relative block w-[75vw] sm:w-[45vw] lg:w-[22%] shrink-0 snap-center cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
          >
            {/* 1x1 Ratio with dimming effect (opacity-55 to opacity-100 on hover) */}
            <div className="relative aspect-square bg-black/10">
              <SanityImage
                value={program.coverImage}
                width={600}
                height={600}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
                priority={false}
                fallbackAlt={`Gambar ${program.name}`}
                className="h-full w-full object-cover brightness-70 transition-brightness duration-300 group-hover:brightness-100"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-5 pb-5 pt-20">
                <h3 className="font-bold text-white text-base leading-snug drop-shadow-md">
                  {program.name}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* GSAP 3D Modal */}
      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

function ProgramModal({
  program,
  onClose,
}: {
  program: Program;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
    );

    gsap.fromTo(
      cardContainerRef.current,
      { rotationY: -180, scale: 0.5, opacity: 0 },
      {
        rotationY: 0,
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.2)",
      },
    );

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    gsap.to(cardContainerRef.current, {
      rotationY: 180,
      scale: 0.5,
      opacity: 0,
      duration: 0.4,
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        style={{ perspective: "1000px" }}
        className="w-full max-w-2xl h-[85vh] md:h-[600px]"
      >
        <div
          ref={cardContainerRef}
          className="relative h-full w-full bg-white shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-48 sm:h-64 shrink-0 bg-slate-100">
            <SanityImage
              value={program.coverImage}
              width={800}
              height={400}
              sizes="(max-width: 768px) 100vw, 800px"
              fallbackAlt={`Gambar ${program.name}`}
              priority={false}
              className="h-full w-full object-cover"
            />
            {/* Unshaped 'X' Close Button with custom cursor on hover */}
            <button
              onClick={handleClose}
              className="absolute right-5 top-5 cursor-pointer text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors hover:text-brand-yellow focus:outline-none"
              aria-label="Tutup"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="bevel"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-[#000c23]">
            <h3 className="mb-4 text-2xl font-extrabold sm:text-3xl text-brand-blue">
              {program.name}
            </h3>

            {program.description?.length ? (
              <div className="prose prose-blue max-w-none">
                <SanityPortableText
                  blocks={
                    program.description as NonNullable<
                      Parameters<typeof SanityPortableText>[0]["blocks"]
                    >
                  }
                />
              </div>
            ) : (
              <p className="text-black leading-relaxed">
                {program.shortDescription ??
                  "Deskripsi program belum tersedia."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}