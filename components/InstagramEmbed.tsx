"use client";

import { useEffect, useRef, useCallback } from "react";
import Script from "next/script";

const instagramUrl = "https://www.instagram.com/bemfisipunpad/";

declare global {
  interface Window {
    instgrm?: {
      process: () => void;
    };
  }
}

export default function InstagramEmbed() {
  const processedRef = useRef(false);

  const processEmbed = useCallback(() => {
    if (typeof window !== "undefined" && window.instgrm?.process) {
      window.instgrm.process();
      processedRef.current = true;
    }
  }, []);

  // Re-process after every mount (handles SPA navigation + race conditions)
  useEffect(() => {
    if (processedRef.current) {
      processEmbed();
      return;
    }

    // Fallback: poll for instgrm availability in case onLoad didn't fire
    const interval = setInterval(() => {
      if (window.instgrm?.process) {
        processEmbed();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [processEmbed]);

  return (
    <div className="mx-auto flex w-full max-w-xl justify-center overflow-hidden bg-linear-to-b from-[#FFBA3A] to-white p-3 sm:p-5">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={instagramUrl}
        data-instgrm-version="14"
        style={{
          background: "#fff",
          border: 0,
          borderRadius: 0,
          boxShadow: "none",
          margin: "0 auto",
          maxWidth: "540px",
          minWidth: "280px",
          padding: 0,
          width: "100%",
        }}
      >
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
          Lihat profil BEM FISIP UNPAD di Instagram
        </a>
      </blockquote>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={processEmbed}
      />
    </div>
  );
}
