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
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Duplicate the programs array to create a track long enough to fake an
  // infinite loop. Lowered from 15 -> 7: still plenty of buffer for arrow
  // clicks and normal swipe momentum, but ~55% fewer DOM nodes/images.
  const MULTIPLIER = 7;
  const infinitePrograms = Array(MULTIPLIER).fill(programs).flat();
  const middleCopyIndex = Math.floor(MULTIPLIER / 2);

  const jumpToMiddle = () => {
    const middleIndex = Math.floor((programs.length * MULTIPLIER) / 2);
    const target = itemRefs.current[middleIndex];
    const container = scrollRef.current;
    if (!target || !container) return;
    container.scrollLeft =
      target.offsetLeft - container.clientWidth / 2 + target.clientWidth / 2;
  };

  const wrapIfNeeded = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    const threshold = scrollWidth / MULTIPLIER;
    if (scrollLeft < threshold || scrollLeft > scrollWidth - threshold * 2) {
      jumpToMiddle();
    }
  };

  useEffect(() => {
    jumpToMiddle();
    const container = scrollRef.current;
    if (!container) return;

    // `scrollend` isn't supported on every browser in the wild yet (older
    // Safari in particular). Without it wrapIfNeeded() never runs there,
    // so the loop silently breaks once a user scrolls past the buffer.
    const supportsScrollEnd = "onscrollend" in window;

    if (supportsScrollEnd) {
      container.addEventListener("scrollend", wrapIfNeeded);
      return () => container.removeEventListener("scrollend", wrapIfNeeded);
    }

    // Debounced-scroll fallback for browsers without native `scrollend`.
    let debounceTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(wrapIfNeeded, 120);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(debounceTimer);
      container.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programs.length]);

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

  const openProgram = (id: string, el: HTMLButtonElement | null) => {
    triggerRef.current = el;
    setSelectedId(id);
  };

  const closeProgram = () => {
    setSelectedId(null);
    // Return focus to whatever card opened the modal.
    triggerRef.current?.focus();
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
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {infinitePrograms.map((program, index) => {
          // Only the middle copy is reachable by keyboard/screen reader;
          // the other copies exist purely for the visual infinite-loop
          // illusion and would otherwise flood tab order with duplicates.
          const copyIndex = Math.floor(index / programs.length);
          const isCanonical = copyIndex === middleCopyIndex;

          return (
            <button
              key={`${program._id}-${index}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              data-card="true"
              type="button"
              tabIndex={isCanonical ? 0 : -1}
              aria-hidden={!isCanonical}
              onClick={(e) => openProgram(program._id, e.currentTarget)}
              /*
                Responsive Layout:
                Default (Mobile): ~75vw (1 card centered + edges peeking)
                sm: 45vw (2 cards centered + edges peeking)
                lg: 22% (4 cards perfectly aligned with gap-6)
              */
              className="rounded-lg group relative block w-[75vw] sm:w-[45vw] lg:w-[22%] shrink-0 snap-center cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
            >
              {/* 1x1 Ratio with dimming effect (dims to 75%, full brightness on hover) */}
              <div className="relative aspect-square bg-black/10">
                <SanityImage
                  value={program.coverImage}
                  width={600}
                  height={600}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
                  priority={false}
                  fallbackAlt={`Gambar ${program.name}`}
                  className="h-full w-full object-cover brightness-75 transition duration-300 group-hover:brightness-100 rounded-lg"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/40 to-transparent px-5 pb-5 pt-20 rounded-lg">
                  <h3 className="font-bold text-white text-base leading-snug drop-shadow-md">
                    {program.name}
                  </h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* GSAP 3D Modal */}
      {selectedProgram && (
        <ProgramModal program={selectedProgram} onClose={closeProgram} />
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const ctx = gsap.context(() => {
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
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
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

  // Escape-to-close + a minimal focus trap so keyboard users can't tab out
  // of the modal into the carousel behind it.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !cardContainerRef.current) return;

      const focusable = cardContainerRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        style={{ perspective: "1000px" }}
        className="w-full max-w-2xl h-[85vh] md:h-150"
      >
        <div
          ref={cardContainerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="program-modal-title"
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
              ref={closeButtonRef}
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
            <h3
              id="program-modal-title"
              className="mb-4 text-2xl font-extrabold sm:text-3xl text-brand-blue"
            >
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
