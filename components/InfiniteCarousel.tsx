"use client";

import { Children, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
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
  const [mode, setMode] = useState<"auto" | "manual" | "resumed">("auto");
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pointerDownRef = useRef(false);
  const keyboardFocusRef = useRef(false);
  const dragRef = useRef<{ pointerId: number; x: number; distance: number } | null>(null);
  const draggedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewportId = useId();
  const manual = mode === "manual" || reducedMotion || !hydrated;
  const items = Children.toArray(children);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    if (reducedMotion || !hydrated) return;
    resumeTimerRef.current = setTimeout(() => {
      const viewport = viewportRef.current;
      // Keyboard users keep control until focus leaves; a touch/click focus
      // must not leave autoplay permanently paused.
      if (!viewport || pointerDownRef.current || keyboardFocusRef.current) return;
      offsetRef.current = viewport.scrollLeft;
      setMode("resumed");
    }, 1500);
  }, [reducedMotion, hydrated]);

  useEffect(() => {
    const endPointer = () => {
      if (!pointerDownRef.current) return;
      pointerDownRef.current = false;
      dragRef.current = null;
      scheduleResume();
    };
    window.addEventListener("pointerup", endPointer);
    window.addEventListener("pointercancel", endPointer);
    window.addEventListener("blur", endPointer);
    return () => {
      window.removeEventListener("pointerup", endPointer);
      window.removeEventListener("pointercancel", endPointer);
      window.removeEventListener("blur", endPointer);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [scheduleResume]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    if (manual) {
      viewport.scrollLeft = offsetRef.current;
    } else {
      // Continue the CSS loop at the last scrolled card, without snapping back.
      const width = primaryRef.current?.offsetWidth || 1;
      const animation = track.getAnimations()[0];
      const durationMs = Number(animation?.effect?.getTiming().duration);
      viewport.scrollLeft = 0;
      if (animation && durationMs > 0) {
        animation.currentTime = ((offsetRef.current % width) / width) * durationMs;
      }
    }
  }, [manual]);

  // Keep the currently visible cards when switching from animation to native scrolling.
  const enableManualScrolling = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const transform = getComputedStyle(track).transform;
    offsetRef.current = manual || transform === "none" ? viewport.scrollLeft :
      (viewport.scrollLeft + Math.abs(new DOMMatrixReadOnly(transform).m41)) % (primaryRef.current?.offsetWidth || 1);
    // Apply the scroll position before the first native swipe or wheel delta.
    flushSync(() => setMode("manual"));
  }, [manual]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) && !(event.shiftKey && event.deltaY)) return;
      // React's wheel listeners are passive. A native listener avoids losing
      // the first delta or applying it twice while switching out of animation.
      event.preventDefault();
      keyboardFocusRef.current = false;
      if (!manual) enableManualScrolling();
      const delta = event.deltaX || (event.shiftKey ? event.deltaY : 0);
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1;
      viewport.scrollLeft += delta * unit;
      scheduleResume();
    };
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [enableManualScrolling, manual, scheduleResume]);

  if (items.length === 0) return null;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={ariaLabel} aria-busy={!hydrated}>
      <div ref={viewportRef} id={viewportId} tabIndex={0} aria-label={`Geser ${ariaLabel}`}
        onFocus={() => {
          keyboardFocusRef.current = !pointerDownRef.current;
          if (!manual) enableManualScrolling();
        }}
        onBlur={() => {
          keyboardFocusRef.current = false;
          scheduleResume();
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          draggedRef.current = false;
          keyboardFocusRef.current = false;
          pointerDownRef.current = true;
          if (!manual) enableManualScrolling();
          if (event.pointerType === "mouse") {
            event.preventDefault();
            dragRef.current = { pointerId: event.pointerId, x: event.clientX, distance: 0 };
          }
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== event.pointerId) return;
          const delta = drag.x - event.clientX;
          drag.distance += Math.abs(delta);
          drag.x = event.clientX;
          if (drag.distance <= 5) return;
          draggedRef.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.scrollLeft += delta;
        }}
        onClickCapture={(event) => {
          if (!draggedRef.current || event.detail === 0) return;
          event.preventDefault();
          event.stopPropagation();
          draggedRef.current = false;
        }}
        onDragStart={(event) => event.preventDefault()}
        onScroll={() => { if (manual) scheduleResume(); }}
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || event.target !== event.currentTarget) return;
          event.preventDefault();
          keyboardFocusRef.current = true;
          if (!manual) enableManualScrolling();
          const viewport = event.currentTarget;
          const style = getComputedStyle(viewport);
          const maxScroll = Math.max(0, (primaryRef.current?.offsetWidth || 0) - viewport.clientWidth +
            parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));
          if (event.key === "Home" || event.key === "End") {
            viewport.scrollTo({ left: event.key === "Home" ? 0 : maxScroll, behavior: "instant" });
          } else {
            viewport.scrollTo({ left: Math.max(0, Math.min(maxScroll,
              viewport.scrollLeft + (event.key === "ArrowRight" ? 1 : -1) * viewport.clientWidth * 0.85)),
              behavior: reducedMotion ? "instant" : "smooth" });
          }
        }}
        className={`infinite-carousel scrollbar-hide overflow-x-auto px-6 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow${manual ? " infinite-carousel--manual" : ""}${!pauseOnHover || mode === "resumed" ? " infinite-carousel--always-moving" : ""}`}>
        <div ref={trackRef} className="infinite-carousel-track flex w-max pb-4" style={duration ? ({ "--infinite-carousel-duration": `${duration}s` } as CSSProperties) : undefined}>
          <div ref={primaryRef} className={`flex shrink-0 ${gap} pr-2`}>{items}</div>
          {hydrated && !reducedMotion && <div className={`infinite-carousel-copy flex shrink-0 ${gap} pr-2`} aria-hidden="true" inert>{items}</div>}
        </div>
      </div>
    </div>
  );
}
