"use client";

import { Children, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useHydrated } from "@/lib/use-hydrated";

interface InfiniteCarouselProps {
  children: ReactNode;
  ariaLabel: string;
  pauseOnHover?: boolean;
  duration?: number;
  gap?: string;
}

export default function InfiniteCarousel({ children, ariaLabel, pauseOnHover = true, duration, gap = "gap-2" }: InfiniteCarouselProps) {
  const reducedMotion = useReducedMotion();
  const hydrated = useHydrated();
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const viewportId = useId();
  const manual = paused || reducedMotion || !hydrated;
  const items = Children.toArray(children);

  // Keep the currently visible cards when switching from animation to native scrolling.
  const enableManualScrolling = () => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const transform = getComputedStyle(track).transform;
    const offset = manual || transform === "none" ? viewport.scrollLeft :
      Math.abs(new DOMMatrixReadOnly(transform).m41) % (primaryRef.current?.offsetWidth || 1);
    setPaused(true);
    requestAnimationFrame(() => {
      viewport.scrollLeft = offset;
    });
  };

  if (items.length === 0) return null;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={ariaLabel} aria-busy={!hydrated}>
      <div ref={viewportRef} id={viewportId} tabIndex={0} aria-label={`Geser ${ariaLabel}`}
        onFocus={() => { if (!manual) enableManualScrolling(); }}
        onPointerDown={() => { if (!manual) enableManualScrolling(); }}
        onWheel={(event) => { if (!manual && Math.abs(event.deltaX) > Math.abs(event.deltaY)) enableManualScrolling(); }}
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || event.target !== event.currentTarget) return;
          event.preventDefault();
          const viewport = event.currentTarget;
          if (event.key === "Home" || event.key === "End") {
            viewport.scrollTo({ left: event.key === "Home" ? 0 : viewport.scrollWidth, behavior: "instant" });
          } else {
            viewport.scrollBy({ left: (event.key === "ArrowRight" ? 1 : -1) * viewport.clientWidth * 0.85, behavior: reducedMotion ? "instant" : "smooth" });
          }
        }}
        className={`infinite-carousel scrollbar-hide px-6 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow ${manual ? "infinite-carousel--manual overflow-x-auto" : "overflow-hidden"}${pauseOnHover ? "" : " infinite-carousel--always-moving"}`}>
        <div ref={trackRef} className="infinite-carousel-track flex w-max pb-4" style={duration ? ({ "--infinite-carousel-duration": `${duration}s` } as CSSProperties) : undefined}>
          <div ref={primaryRef} className={`flex shrink-0 ${gap} pr-2`}>{items}</div>
          {!manual && <div className={`infinite-carousel-copy flex shrink-0 ${gap} pr-2`} aria-hidden="true" inert>{items}</div>}
        </div>
      </div>
    </div>
  );
}
