"use client";

import { Children, cloneElement, isValidElement, type ReactNode } from "react";

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
  const clonedChildren = Children.map(children, (child, i) =>
    isValidElement(child) ? cloneElement(child, { key: `clone-${i}` }) : child,
  );

  return (
    <div
      className={`infinite-carousel overflow-hidden px-6${pauseOnHover ? "" : " infinite-carousel--always-moving"}`}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="infinite-carousel-track flex w-max pb-4">
        <div className="flex shrink-0 gap-2 pr-2">{children}</div>
        <div className="flex shrink-0 gap-2 pr-2" aria-hidden="true">
          {clonedChildren}
        </div>
      </div>
    </div>
  );
}
