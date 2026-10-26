"use client";

import { useCallback } from "react";
import Script from "next/script";
import { useNearViewport } from "@/lib/use-near-viewport";

const instagramUrl = "https://www.instagram.com/bemfisipunpad/";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

export default function InstagramEmbed() {
  const { ref, ready } = useNearViewport<HTMLDivElement>();

  const processEmbed = useCallback(() => {
    if (typeof window !== "undefined" && window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <div ref={ref} className="mx-auto flex w-full max-w-xl justify-center overflow-hidden bg-linear-to-b from-[#FFBA3A] to-white p-3 sm:p-5">
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
      {ready && <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onReady={processEmbed}
      />}
    </div>
  );
}
