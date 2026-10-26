"use client";

import type { ComponentProps } from "react";
import { useNearViewport } from "@/lib/use-near-viewport";

export default function DeferredIframe({ src, ...props }: ComponentProps<"iframe">) {
  const { ref, ready } = useNearViewport<HTMLIFrameElement>();
  return <iframe {...props} ref={ref} src={ready ? src : undefined} loading="lazy" />;
}
