"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { SanityImage } from "@/components/SanityImage";
import { safeExternalUrl } from "@/sanity/lib/urls";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { STUDENT_ASSOCIATIONS_QUERY_RESULT } from "@/sanity.types";

interface HimaGalleryProps {
  associations: STUDENT_ASSOCIATIONS_QUERY_RESULT;
}

export default function HimaGallery({ associations }: HimaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const detailCardRef = useRef<HTMLDivElement>(null);

  if (!associations || associations.length === 0) {
    return (
      <p className="mt-10 bg-white/5 border border-white/10 p-4 text-white/80">
        Belum ada organisasi mahasiswa yang dipublikasikan.
      </p>
    );
  }

  const selectedAssociation =
    selectedIndex !== null ? associations[selectedIndex] : null;

  const handleSelect = (index: number) => {
    setSelectedIndex(index);

    // Auto-scroll HANYA berjalan jika lebar layar di bawah 1024px (artinya khusus sm dan md)
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        detailCardRef.current?.scrollIntoView({
          behavior: reducedMotion ? "instant" : "smooth",
          block: "center",
        });
      }, 50);
    }
  };

  return (
    <div className="mt-8 flex flex-col-reverse lg:flex-col gap-8 sm:mt-10 sm:gap-10">
      <style>{`
        @keyframes smoothAppear {
          0% { opacity: 0; transform: translateY(-15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-smooth-appear {
          animation: smoothAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-smooth-appear { animation: none; }
        }
      `}</style>

      {/* Grid of logos */}
      <div className="flex w-full flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 w-full">
          {associations.map((item, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={item._id}
                onClick={() => handleSelect(index)}
                aria-pressed={isSelected}
                aria-controls={selectedAssociation ? "hima-detail" : undefined}
                className={`rounded-lg cursor-pointer relative flex w-full aspect-square items-center justify-center bg-white p-3 transition-all duration-250 hover:brightness-100 brightness-75 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-yellow sm:p-4 lg:p-5 ${
                  isSelected
                    ? "scale-102 md:scale-105 z-10 brightness-100"
                    : "shadow-sm hover:shadow-md"
                }`}
              >
                {item.logo ? (
                  <SanityImage
                    value={item.logo}
                    width={200}
                    height={200}
                    sizes="(min-width: 640px) 200px, 150px"
                    fallbackAlt={`Logo ${item.officialName}`}
                    className="mx-auto h-auto max-w-[80%] object-contain"
                  />
                ) : (
                  <span className="font-bold text-brand-blue text-center text-sm md:text-base">
                    {item.abbreviation || item.officialName}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Detail Panel */}
      {selectedAssociation && (
        <div
          ref={detailCardRef}
          id="hima-detail"
          role="region"
          aria-label={selectedAssociation.officialName}
          key={selectedIndex}
          className="rounded-lg animate-smooth-appear group relative flex w-full flex-col overflow-hidden bg-linear-to-r from-[#001949] to-[#003089] text-white shadow-md md:h-auto md:flex-row scroll-mt-28"
        >
          {/* Left Side: White Logo Box */}
          <div className="relative flex h-48 w-full flex-none items-center justify-center border-b border-gray-100/20 bg-white sm:h-56 md:h-auto md:w-[280px] lg:w-[320px] md:border-r md:border-b-0 p-4 sm:p-6">
            {selectedAssociation.logo ? (
              <SanityImage
                value={selectedAssociation.logo}
                width={300}
                height={300}
                sizes="(min-width: 768px) 300px, 200px"
                fallbackAlt={`Logo ${selectedAssociation.officialName}`}
                className="mx-auto h-auto max-h-40 w-auto max-w-[85%] object-contain transition-transform duration-250 md:max-h-52 lg:max-h-60"
                priority={true}
              />
            ) : (
              <span className="font-bold text-brand-blue text-3xl text-center">
                {selectedAssociation.abbreviation ||
                  selectedAssociation.officialName}
              </span>
            )}
          </div>

          {/* Right Side: Details */}
          <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6 md:px-8 md:py-6">
            <div>
              <h2
                style={{ letterSpacing: "-0.05em" }}
                className="-mt-4 mb-1 break-words text-[40px] sm:text-[50px] md:text-[60px] font-bold tracking-tight leading-tight"
              >
                {selectedAssociation.abbreviation ||
                  selectedAssociation.officialName}
              </h2>
              <h3
                style={{ letterSpacing: "-0.05em" }}
                className="-mt-3 text-sm font-bold leading-snug sm:text-base md:text-[18px] text-white"
              >
                {selectedAssociation.officialName}
                <br />
                <span className="font-normal text-white">
                  {selectedAssociation.cabinetName ||
                    selectedAssociation.studyProgram}
                </span>
              </h3>

              {selectedAssociation.description && (
                <p className="mt-3 mb-3 max-w-[800px] text-xs leading-relaxed text-white/90 sm:text-sm">
                  {selectedAssociation.description}
                </p>
              )}
            </div>

            {/* Instagram Link (Legacy) */}
            {selectedAssociation.officialLink && (
              <div className="mt-8 flex -mb-2.5 items-center pt-2">
                {(() => {
                  const href = safeExternalUrl(
                    selectedAssociation.officialLink,
                  );
                  if (!href) return null;
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white transition-colors hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-label="Instagram Resmi"
                    >
                      <Image
                        src="/assets/logo/ig.svg"
                        alt="Instagram"
                        width={24}
                        height={24}
                        className="size-6"
                      />
                      <span
                        style={{ letterSpacing: "-0.05em" }}
                        className="text-xs sm:text-sm font-semibold underline underline-offset-4"
                      >
                        Kunjungi Instagram Resmi
                      </span>
                    </a>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
