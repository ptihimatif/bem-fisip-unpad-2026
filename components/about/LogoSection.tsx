"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import ParallaxImage from "@/components/ParallaxImage";

import {
  type Explanation,
  explanations,
  PARTS,
  CARD_VH,
  STEP_VH,
  CYCLE_MS,
  PARTS_DIR,
  SIZES,
} from "./logo-section";

const TOTAL = explanations.length;
const SNAP_DELAY_MS = 80; // desktop only: idle time before snapping to a card
const SNAP_SETTLE_MS = 600; // desktop only: roughly how long the smooth snap takes
const SWIPE_PX = 24; // mobile: how far a finger must move to count as a swipe
const STEP_LOCK_MS = 450; // mobile: new swipes are ignored while a step animates
const LIT_SCALE = 1.05;
const GLOW =
  "drop-shadow(0 0 6px rgba(255,255,255,0.5)) drop-shadow(0 0 14px rgba(255,255,255,0.2))";

function Wordmark({
  className,
  style,
  priority = false,
}: {
  className: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  return (
    <Image
      src={`${PARTS_DIR}/logo-text-baru.png`}
      alt="Pendar Mentari"
      width={1090}
      height={480}
      sizes="(min-width: 1024px) 480px, 80vw"
      className={className}
      style={style}
      priority={priority}
    />
  );
}

function CardText({
  title,
  description,
}: Pick<Explanation, "title" | "description">) {
  return (
    <div className="max-w-lg">
      <h2
        className="mb-3 text-center text-2xl font-bold leading-tight text-white sm:mb-4 sm:text-left sm:text-4xl lg:text-5xl"
        style={{ letterSpacing: "-0.03em" }}
      >
        {title}
      </h2>

      <p className="text-center text-sm leading-relaxed text-white sm:text-left sm:text-base lg:leading-normal xl:text-justify">
        {description}
      </p>
    </div>
  );
}


// Mobile only: one dot per card, so people can see where they are.
function ProgressDots({ active }: { active: number }) {
  return (
    <div
      aria-hidden
      className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2 lg:hidden"
    >
      {explanations.map((_, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full bg-white transition-all duration-300 ${
            i === active ? "h-4" : "h-1.5 opacity-30"
          }`}
        />
      ))}
    </div>
  );
}

function LogoDisplay({ parts, cycle }: Pick<Explanation, "parts" | "cycle">) {
  // Index of the piece currently lit in cycle mode (null = not cycling).
  const [tick, setTick] = useState<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!cycle || reduceMotion) return;

    let i = 0;
    const id = setInterval(() => setTick(i++), CYCLE_MS);
    return () => {
      clearInterval(id);
      setTick(null);
    };
  }, [cycle]);

  // Pieces lit right now. undefined = no highlight (whole logo, no glow).
  const lit = parts && (tick === null ? parts : [parts[tick % parts.length]]);

  return (
    // Mobile: fills the logo zone (capped at 22rem). Desktop: fixed 480px.
    // --dim is how faint the unlit pieces get; higher on the smaller mobile logo.
    <div className="relative aspect-square h-full max-h-[22rem] [--dim:0.15] lg:h-[480px] lg:max-h-none lg:[--dim:0.08]">
      {PARTS.map((id) => {
        const on = !lit || lit.includes(id);
        return (
          <Image
            key={id}
            src={`${PARTS_DIR}/${id}.png`}
            alt=""
            fill
            sizes={SIZES}
            loading="eager"
            aria-hidden
            // Phones only animate opacity + transform; animating the glow
            // filter on six large layers makes scrolling stutter.
            className="object-contain transition-[opacity,transform] duration-300 ease-out lg:transition-all"
            style={{
              opacity: on ? 1 : "var(--dim)",
              transform: `scale(${on ? LIT_SCALE : 1})`,
              filter: lit && on ? GLOW : "none",
            }}
          />
        );
      })}
    </div>
  );
}

export default function LogoSection() {
  // Card whose highlight is on. Desktop: the card it snapped to (null while
  // scrolling). Mobile: the card nearest the scroll position.
  const [settled, setSettled] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null); // desktop: sliding text track

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!section || !sticky || !track) return;

    const desktop = window.matchMedia("(min-width: 1024px)");

    let locked = false; // true while a snap (desktop) or step (mobile) animates
    let index = 0; // mobile: the card currently shown
    let timer: ReturnType<typeof setTimeout>;

    const measure = () => {
      const { top } = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - sticky.offsetHeight;
      return {
        top,
        scrollable,
        progress: scrollable > 0 ? -top / scrollable : 0,
      };
    };

    const update = () => {
      const pos = Math.min(1, Math.max(0, measure().progress)) * (TOTAL - 1);

      // Desktop: slide the text track, fading cards by distance from the active one.
      track.style.transform = `translate3d(0, ${-pos * CARD_VH}vh, 0)`;
      Array.from(track.children).forEach((card, i) => {
        (card as HTMLElement).style.opacity = String(
          Math.max(0.1, 1 - Math.abs(pos - i) * 0.9),
        );
      });

      // Mobile: if the page was moved some other way (entering the section,
      // keyboard...), the active card is the one nearest the scroll position.
      // Skipped while a swipe is animating, which already chose the card.
      if (!desktop.matches && !locked) {
        index = Math.round(pos);
        setSettled(index);
      }
    };

    const scrollToCard = (i: number) => {
      const { top, scrollable } = measure();
      window.scrollTo({
        top: window.scrollY + top + (i / (TOTAL - 1)) * scrollable,
        behavior: "smooth",
      });
    };

    // Desktop: smooth-scroll to the nearest card, then switch its highlight on.
    const snap = () => {
      const { progress } = measure();
      if (progress < 0 || progress > 1) return;

      const nearest = Math.round(progress * (TOTAL - 1));
      locked = true;
      scrollToCard(nearest);

      timer = setTimeout(() => {
        locked = false;
        update();
        setSettled(nearest);
      }, SNAP_SETTLE_MS);
    };

    const onScroll = () => {
      update();
      if (locked || !desktop.matches) return;

      // Desktop: any scroll clears the highlight, then snaps once scrolling stops.
      setSettled(null);
      clearTimeout(timer);
      timer = setTimeout(snap, SNAP_DELAY_MS);
    };

    // Mobile: swipe to step, like flipping through a carousel. A short swipe
    // moves exactly one card, however fast it is. At the first/last card the
    // gesture is left alone, so the page scrolls out of the section normally.
    let startY = 0;
    let owned = false; // we've taken this gesture over from the browser
    let stepped = false; // this gesture has already moved a card

    const goTo = (i: number) => {
      index = i;
      setSettled(i);
      locked = true;
      scrollToCard(i); // keeps the page scroll in step with the card
      clearTimeout(timer);
      timer = setTimeout(() => {
        locked = false;
        update();
      }, STEP_LOCK_MS);
    };

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      owned = false;
      stepped = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (desktop.matches || e.touches.length > 1) return;

      const dy = startY - e.touches[0].clientY; // > 0: finger moving up = next card
      const target = index + (dy > 0 ? 1 : -1);
      const inRange = target >= 0 && target < TOTAL;

      if (!owned) {
        const { progress } = measure();
        const pinned = progress > -0.01 && progress < 1.01;
        if (!pinned || !inRange || !e.cancelable) return; // let the page scroll
        owned = true;
      }
      e.preventDefault(); // stop the browser from scrolling for this gesture

      if (stepped || locked || !inRange || Math.abs(dy) < SWIPE_PX) return;
      stepped = true;
      goTo(target);
    };

    update();
    sticky.addEventListener("touchstart", onTouchStart, { passive: true });
    sticky.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      sticky.removeEventListener("touchstart", onTouchStart);
      sticky.removeEventListener("touchmove", onTouchMove);
      clearTimeout(timer);
    };
  }, []);

  const current = settled === null ? undefined : explanations[settled];
  const active = settled ?? 0; // card shown on mobile

  return (
    <section
      ref={sectionRef}
      aria-label="Filosofi logo Pendar Mentari"
      className="relative w-full"
      style={{ height: `${100 + (TOTAL - 1) * STEP_VH}vh` }}
    >
      {/* svh = viewport with the mobile address bar showing, so nothing is cut off */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
      >
        {/* Big decorative glow in the top-right corner */}
        <ParallaxImage
          src="/assets/about/asset2.png"
          alt=""
          width={1209}
          height={1209}
          speed={0.2}
          loading="eager"
          className="pointer-events-none absolute -right-[10%] -top-[15%] z-0 hidden lg:block h-[120%] w-auto max-w-none object-contain opacity-60"
          style={{ width: "auto" }}
          aria-hidden="true"
        />

        {/* Matching glow on the left edge */}
        <ParallaxImage
          src="/assets/about/asset1.png"
          alt=""
          width={840}
          height={840}
          speed={-0.15}
          className="pointer-events-none absolute -left-[5%] top-[45%] z-0 hidden h-[45%] w-auto max-w-none object-contain opacity-60 xl:block"
          style={{ width: "auto" }}
          aria-hidden="true"
        />

        {/* Mobile: pt pushes the whole block down so it sits closer to centre */}
        <div className="relative z-10 flex h-full w-full flex-col pt-[8svh] lg:grid lg:grid-cols-2 lg:pt-0">
          {/* Text: below the logo on mobile, left column on desktop */}
          <div className="relative min-h-0 flex-1 overflow-hidden lg:h-full">
            {/* Mobile: cards stacked in place, one visible at a time */}
            <div className="absolute inset-0 lg:hidden">
              {explanations.map(({ title, description }, i) => (
                <div
                  key={i}
                  // Cards before the active one wait slightly up, cards after it
                  // slightly down, so the text travels with the scroll direction.
                  // The old card leaves fast and the new one arrives just after.
                  className={`absolute inset-0 flex flex-col items-center px-6 pt-4 transition-all motion-reduce:translate-y-0 ${
                    i === active
                      ? "translate-y-0 opacity-100 duration-300 delay-100"
                      : `opacity-0 duration-150 ${
                          i < active ? "-translate-y-6" : "translate-y-6"
                        }`
                  }`}
                >
                  {i === 0 ? (
                    <Wordmark
                      className="h-auto w-4/5 max-w-sm"
                      style={{ width: "100%", height: "auto" }}
                    />
                  ) : (
                    <CardText title={title} description={description} />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: cards on a track that slides with scroll progress */}
            <div
              ref={trackRef}
              className="absolute inset-x-0 hidden will-change-transform lg:block"
              style={{ top: `${(100 - CARD_VH) / 2}vh` }}
            >
              {explanations.map(({ title, description }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-end justify-center px-10"
                  style={{ height: `${CARD_VH}vh`, opacity: i === 0 ? 1 : 0.1 }}
                >
                  {i === 0 ? (
                    <div className="-mr-10 flex w-full justify-end">
                      <Wordmark
                        className="h-[480px] w-auto object-contain"
                        style={{ width: "auto", height: "480px" }}
                        priority
                      />
                    </div>
                  ) : (
                    <CardText title={title} description={description} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Logo: above the text on mobile, right column on desktop */}
          <div className="order-first flex h-[42svh] shrink-0 items-center justify-center p-4 lg:order-none lg:h-full lg:-translate-x-8 lg:p-0">
            <LogoDisplay parts={current?.parts} cycle={current?.cycle} />
          </div>
        </div>

        <ProgressDots active={active} />
      </div>
    </section>
  );
}
