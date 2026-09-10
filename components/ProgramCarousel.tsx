"use client";

import { useState } from "react";
import { SanityImage } from "@/components/SanityImage";
import { SanityPortableText } from "@/components/SanityPortableText";
import type { FEATURED_PROGRAMS_QUERY_RESULT } from "@/sanity.types";

type Program = FEATURED_PROGRAMS_QUERY_RESULT[number];

interface ProgramCarouselProps {
  programs: FEATURED_PROGRAMS_QUERY_RESULT;
}

export default function ProgramCarousel({ programs }: ProgramCarouselProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProgram = programs.find(
    (program) => program._id === selectedId,
  );

  function renderProgram(program: Program, duplicate = false) {
    const isSelected = !duplicate && selectedId === program._id;

    const card = (
      <button
        key={`${duplicate ? "duplicate-" : ""}${program._id}`}
        type="button"
        onClick={() =>
          !duplicate && setSelectedId(isSelected ? null : program._id)
        }
        aria-pressed={isSelected}
        tabIndex={duplicate ? -1 : 0}
        aria-hidden={duplicate ? true : undefined}
        className="group relative block w-72 flex-none cursor-pointer overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
      >
        <div className="relative aspect-video overflow-hidden">
          <SanityImage
            value={program.coverImage}
            width={576}
            height={324}
            sizes="288px"
            fallbackAlt={`Gambar ${program.name}`}
            className="h-full w-full object-cover opacity-55 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/45 to-transparent px-4 pb-4 pt-16">
            <h3 className="text-depth font-bold text-white text-sm leading-snug">
              {program.name}
            </h3>
            {program.shortDescription && (
              <p className="text-white text-xs leading-relaxed line-clamp-2">
                {program.shortDescription}
              </p>
            )}
          </div>
        </div>
      </button>
    );

    if (!isSelected) return card;

    return (
      <div key={program._id} className="flex shrink-0 items-stretch gap-0">
        {card}
        <div className="program-description-panel w-[min(36rem,calc(100vw-3rem))] flex-none bg-white p-6 text-[#000c23] sm:p-8">
          {program.description?.length ? (
            <SanityPortableText
              blocks={
                program.description as NonNullable<
                  Parameters<typeof SanityPortableText>[0]["blocks"]
                >
              }
            />
          ) : (
            <p className="text-sm leading-7">
              {program.shortDescription ?? "Deskripsi program belum tersedia."}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="infinite-carousel overflow-hidden"
      role="region"
      aria-label="Program unggulan"
    >
      <div
        className={`program-carousel-track flex w-max pb-4${selectedProgram ? " program-carousel-track--selected" : ""}`}
      >
        <div className="flex shrink-0 gap-5 px-6">
          {programs.map((program) => renderProgram(program))}
        </div>
        <div className="flex shrink-0 gap-5 px-6" aria-hidden="true">
          {programs.map((program) => renderProgram(program, true))}
        </div>
      </div>
    </div>
  );
}
