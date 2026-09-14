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
      <div className="infinite-carousel-track flex w-max gap-2 px-6 pb-4">
        {children}
        <div className="flex shrink-0 gap-2" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
