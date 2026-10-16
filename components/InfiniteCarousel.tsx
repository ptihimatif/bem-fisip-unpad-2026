"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactNode,
} from "react";

interface InfiniteCarouselProps {
  children: ReactNode;
  ariaLabel: string;
  pauseOnHover?: boolean;
  duration?: number;
  gap?: string;
}

export default function InfiniteCarousel({
  children,
  ariaLabel,
  pauseOnHover = true,
  duration,
  gap = "gap-2",
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
      <div
        className="infinite-carousel-track flex w-max pb-4"
        style={
          duration
            ? ({
                "--infinite-carousel-duration": `${duration}s`,
              } as CSSProperties)
            : undefined
        }
      >
        <div className={`flex shrink-0 ${gap} pr-2`}>{children}</div>
        <div className={`flex shrink-0 ${gap} pr-2`} aria-hidden="true">
          {clonedChildren}
        </div>
      </div>
    </div>
  );
}
