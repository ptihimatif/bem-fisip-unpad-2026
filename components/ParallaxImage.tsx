"use client";

import { useEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";

// Simple scroll parallax: shifts the image on the Y axis as the page scrolls.
// `speed` is the fraction of the scroll distance the image lags behind —
// negative floats drift up, positive drift down. 0.15–0.3 reads clearly
// without making the asset feel detached from its section.
export default function ParallaxImage({
  speed = 0.2,
  alt = "",
  className,
  style,
  ...props
}: ImageProps & { speed?: number }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;

    const tick = () => {
      const rect = el.getBoundingClientRect();
      // Distance from the viewport centre, normalised to the viewport height.
      // Goes -1 (below) -> 0 (centred) -> 1 (above) as the page scrolls.
      const offset = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = `translate3d(0, ${(-offset * speed * 100).toFixed(2)}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  return (
    <Image
      ref={ref}
      alt={alt}
      className={className}
      style={{ ...style, willChange: "transform" }}
      {...props}
    />
  );
}
