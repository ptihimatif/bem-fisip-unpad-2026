"use client";

import type { ReactNode } from "react";

interface InfiniteCarouselProps {
  children: ReactNode;
  ariaLabel: string;
  pauseOnHover?: boolean;
}

export default function InfiniteCarousel({
  children,
  ariaLabel,
  pauseOnHover = true,
}: InfiniteCarouselProps) {
  return (
    <div
      className={`infinite-carousel overflow-hidden${pauseOnHover ? "" : " infinite-carousel--always-moving"}`}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="infinite-carousel-track flex w-max pb-4">
        <div className="flex shrink-0 gap-5 px-6">{children}</div>
        <div className="flex shrink-0 gap-5 px-6" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
