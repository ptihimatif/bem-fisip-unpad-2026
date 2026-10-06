"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingSpinner() {
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!spinnerRef.current) return;

    const context = gsap.context(() => {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
    }, spinnerRef);

    return () => context.revert();
  }, []);

  return (
    <p ref={spinnerRef} className="text-lg text-white">
      Memuat...
    </p>
  );
}