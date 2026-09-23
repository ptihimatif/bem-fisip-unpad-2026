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
      className={`infinite-carousel flex items-center overflow-hidden bg-linear-to-l from-brand-yellow to-brand-blue/50 ${
        pauseOnHover ? "" : "infinite-carousel--always-moving"
      }`}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="infinite-carousel-track flex w-max items-center gap-2 px-6 pb-2 pt-2">
        <div className="flex shrink-0 gap-2">{children}</div>

        <div className="flex shrink-0 gap-2" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
