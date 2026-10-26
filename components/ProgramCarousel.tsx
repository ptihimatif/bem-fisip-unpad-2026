"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { createPortal } from "react-dom";
import { SanityImage } from "@/components/SanityImage";
import { SanityPortableText } from "@/components/SanityPortableText";
import type { FEATURED_PROGRAMS_QUERY_RESULT } from "@/sanity.types";
import { useHydrated } from "@/lib/use-hydrated";

type Program = FEATURED_PROGRAMS_QUERY_RESULT[number];

interface ProgramCarouselProps {
  programs: FEATURED_PROGRAMS_QUERY_RESULT;
}

export default function ProgramCarousel({ programs }: ProgramCarouselProps) {
  const hydrated = useHydrated();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProgram = programs.find((p) => p._id === selectedId);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // A full group on either side is enough for the normal 4–6 program set.
  // Short sets retain a wider buffer so desktop viewports are still filled.
  const MULTIPLIER = programs.length >= 4 ? 3 : 7;
  const infinitePrograms = Array(MULTIPLIER).fill(programs).flat();
  const middleCopyIndex = Math.floor(MULTIPLIER / 2);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    const target = itemRefs.current[middleCopyIndex * programs.length + Math.floor(programs.length / 2)];
    if (!container || !target) return;
    container.scrollLeft =
      target.offsetLeft - container.clientWidth / 2 + target.clientWidth / 2;

    const wrapIfNeeded = () => {
      // Do not move a keyboard user's focused canonical card out of view.
      if (container.contains(document.activeElement) || container.matches(":active")) return;
      const first = itemRefs.current[0];
      const nextGroup = itemRefs.current[programs.length];
      if (!first || !nextGroup) return;
      const groupWidth = nextGroup.offsetLeft - first.offsetLeft;
      if (groupWidth <= 0) return;
      const middleStart = groupWidth * middleCopyIndex;
      const groupsAway = Math.round((container.scrollLeft - middleStart) / groupWidth);
      if (groupsAway !== 0) {
        // Move by whole groups, preserving the visible program and swipe offset.
        container.scrollTo({ left: container.scrollLeft - groupsAway * groupWidth, behavior: "instant" });
      }
    };

    // Also debounce scroll on browsers without reliable native scrollend.
    let debounceTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(wrapIfNeeded, 120);
    };
    const observer = new ResizeObserver(wrapIfNeeded);
    observer.observe(container);
    container.addEventListener("scrollend", wrapIfNeeded);
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(debounceTimer);
      observer.disconnect();
      container.removeEventListener("scrollend", wrapIfNeeded);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [programs, middleCopyIndex]);

  const openProgram = (id: string) => {
    const index = programs.findIndex((program) => program._id === id);
    // Visual copies must restore focus to the accessible instance of that card.
    triggerRef.current = itemRefs.current[middleCopyIndex * programs.length + index];
    setSelectedId(id);
  };

  const closeProgram = useCallback(() => {
    setSelectedId(null);
  }, []);
  const restoreFocus = useCallback(() => {
    const target = triggerRef.current?.isConnected ? triggerRef.current : scrollRef.current;
    target?.focus({ preventScroll: true });
    triggerRef.current?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-7xl">
      {/*
        Snap Carousel Track:
        - Native swipe support (overflow-x-auto, snap-x)
        - Hides scrollbar
      */}
      <div
        ref={scrollRef}
        tabIndex={-1}
        aria-label="Program unggulan"
        aria-busy={!hydrated}
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
              aria-label={program.name}
              disabled={!hydrated}
              tabIndex={isCanonical ? 0 : -1}
              aria-hidden={!isCanonical}
              onClick={() => openProgram(program._id)}
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
      {selectedProgram && createPortal(
        <ProgramModal program={selectedProgram} onClose={closeProgram} restoreFocus={restoreFocus} />, document.body,
      )}
    </div>
  );
}

function ProgramModal({
  program,
  onClose,
  restoreFocus,
}: {
  program: Program;
  onClose: () => void;
  restoreFocus: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotionRef = useRef(false);
  const closingRef = useRef(false);
  const closingTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== overlayRef.current,
    ).map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });
    closeButtonRef.current?.focus();

    const ctx = gsap.context(() => {
      if (reducedMotionRef.current) return;
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
      closingTimelineRef.current?.kill();
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, inert }) => { element.inert = inert; });
      restoreFocus();
    };
  }, [restoreFocus]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (reducedMotionRef.current) { onClose(); return; }
    closingTimelineRef.current = gsap.timeline({ onComplete: onClose }).to(cardContainerRef.current, {
      rotationY: 180,
      scale: 0.5,
      opacity: 0,
      duration: 0.4,
    }, 0).to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
    }, 0);
  }, [onClose]);

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
  }, [handleClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
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
              className="absolute right-5 top-5 flex min-h-11 min-w-11 items-center justify-center cursor-pointer bg-brand-blue text-white transition-colors hover:text-brand-yellow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
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
                  tone="light"
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
