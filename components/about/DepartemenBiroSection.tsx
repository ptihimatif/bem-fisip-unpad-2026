import Image from "next/image";
import Link from "next/link";

import type { ORGANIZATION_UNITS_QUERY_RESULT } from "@/sanity.types";

type Unit = ORGANIZATION_UNITS_QUERY_RESULT[number];

/* ------------------------------------------------------------------ */
/* Copy: edit the heading here                                         */
/* ------------------------------------------------------------------ */
const HEADING = "Departemen dan Biro";

/* ------------------------------------------------------------------ */
/* Which units get a button                                            */
/* ------------------------------------------------------------------ */
// "depbir" = the 13 departemen + 4 biro. Bidang, Pengurus Inti, and
// Sekretariat Umum are already represented by the leadership sections
// above, so they do not get a button here.
const DEPBIR_KINDS = new Set<Unit["unitKind"]>(["departemen", "biro"]);

/* ------------------------------------------------------------------ */
/* Button backgrounds                                                  */
/* ------------------------------------------------------------------ */
// Every button gets its own mesh frame (no repeats). The fixed shuffle
// below looks random but is identical on every server render and build
// (no Math.random, so there is no hydration mismatch).
const DEPBIR_BACKGROUNDS = [
  "/assets/about/depbir/Frame 4.png",
  "/assets/about/depbir/Frame 5.png",
  "/assets/about/depbir/Frame 6.png",
  "/assets/about/depbir/Frame 7.png",
  "/assets/about/depbir/Frame 8.png",
  "/assets/about/depbir/Frame 9.png",
  "/assets/about/depbir/Frame 10.png",
  "/assets/about/depbir/Frame 11.png",
  "/assets/about/depbir/Frame 12.png",
  "/assets/about/depbir/Frame 13.png",
  "/assets/about/depbir/Frame 25.png",
  "/assets/about/depbir/Frame 26.png",
  "/assets/about/depbir/Frame 27.png",
  "/assets/about/depbir/Frame 28.png",
  "/assets/about/depbir/Frame 30.png",
  "/assets/about/depbir/Frame 31.png",
  "/assets/about/depbir/Frame 32.png",
  "/assets/about/depbir/Frame 33.png",
  "/assets/about/depbir/Frame 34.png",
];

// A permutation of every DEPBIR_BACKGROUNDS index. Entries must stay
// unique so the first 17 buttons never share a background.
const BACKGROUND_ORDER = [
  16, 3, 9, 1, 14, 6, 11, 0, 17, 5, 12, 8, 2, 15, 7, 18, 4, 10, 13,
];

interface DepartemenBiroSectionProps {
  units: ORGANIZATION_UNITS_QUERY_RESULT;
}

export default function DepartemenBiroSection({
  units,
}: DepartemenBiroSectionProps) {
  const depbir = units.filter((unit) => DEPBIR_KINDS.has(unit.unitKind));

  if (depbir.length === 0) return null;

  return (
    <section aria-labelledby="departemen-biro-heading" className="mt-20">
      <div className="mb-10 text-center">
        <h2
          id="departemen-biro-heading"
          className="text-depth text-balance text-3xl font-bold leading-snug text-brand-yellow sm:text-4xl lg:text-5xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          {HEADING}
        </h2>
      </div>

      {/* One container, one button per depbir. */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {depbir.map((unit, index) => (
          <Link
            key={unit._id}
            href={`/penjelasan/${unit.slug}`}
            className="group relative flex aspect-video items-center justify-center overflow-hidden rounded border border-white/20 transition-colors duration-300 hover:border-white/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow motion-reduce:transition-none"
          >
            <Image
              src={backgroundFor(index)}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none"
            />
            {/* Blue wash keeps the white label readable (>= 4.5:1) over
                even the lightest part of any frame. */}
            <span aria-hidden className="absolute inset-0 bg-brand-blue/30 transition-colors duration-300 group-hover:bg-white/10" />
            <span className="text-depth relative z-10 px-4 text-center text-xl font-bold text-balance text-white sm:text-2xl lg:text-3xl">
              {unit.officialName}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function backgroundFor(index: number) {
  return DEPBIR_BACKGROUNDS[BACKGROUND_ORDER[index % BACKGROUND_ORDER.length]];
}
