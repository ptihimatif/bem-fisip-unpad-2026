"use client";

import type { ReactNode } from "react";

interface ScrollToSectionButtonProps {
  targetId: string;
  children: ReactNode;
  className?: string;
}

export default function ScrollToSectionButton({
  targetId,
  children,
  className,
}: ScrollToSectionButtonProps) {
  function handleClick() {
    const target = document.getElementById(targetId);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
