import type { ReactNode } from "react";

import InfiniteCarousel from "@/components/InfiniteCarousel";
import { LeadershipCard } from "@/components/about/LeadershipCard";
import type { MEMBERS_QUERY_RESULT } from "@/sanity.types";

type Member = MEMBERS_QUERY_RESULT[number];

/* ------------------------------------------------------------------ */
/* Copy: edit the headings here                                        */
/* ------------------------------------------------------------------ */
const SEKRETARIAT_BIDANG_HEADING = "Sekretariat Umum dan Kepala Bidang";
const PINIMPINAN_HEADING = "Kepala dan Wakil Kepala Departemen & Biro";

/* ------------------------------------------------------------------ */
/* Which role goes in which carousel                                   */
/* ------------------------------------------------------------------ */
// The published 2026 structure has only a "Kepala Bidang ..." per bidang
// (no deputy), so this carousel holds Sekretaris Umum plus the five bidang heads.
const SEKRETARIAT_ROLE = "Sekretaris Umum";
const BIDANG_HEAD_ROLE = /^Kepala Bidang\b/i;
// Matches "Kepala Departemen ...", "Wakil Kepala Departemen ...",
// "Kepala Biro ..." and "Wakil Kepala Biro ..."
const UNIT_LEAD_ROLE = /^(?:Wakil )?Kepala (?:Departemen|Biro)\b/i;

// Both carousels share one card width, so matching their visual speed (px/s)
// means scaling the loop duration with the number of cards. Calibrated so the
// larger "Kepala & Wakil Kepala Departemen & Biro" carousel keeps its ~80s loop.
const CAROUSEL_SECONDS_PER_CARD = 80 / 39;

/* ------------------------------------------------------------------ */
/* Sekretariat Umum + Kepala Bidang                                    */
/* ------------------------------------------------------------------ */
export function SekretariatBidangSection({
  members,
}: {
  members: MEMBERS_QUERY_RESULT;
}) {
  const sectionMembers = members.filter((member) => {
    const role = member.role.trim();
    return role === SEKRETARIAT_ROLE || BIDANG_HEAD_ROLE.test(role);
  });

  if (sectionMembers.length === 0) return null;

  return (
    <CarouselSection
      id="sekretariat-bidang-heading"
      heading={SEKRETARIAT_BIDANG_HEADING}
      ariaLabel={SEKRETARIAT_BIDANG_HEADING}
      members={sectionMembers}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Kepala & Wakil Kepala Departemen + Biro                             */
/* ------------------------------------------------------------------ */
export function PimpinanDepartemenBiroSection({
  members,
}: {
  members: MEMBERS_QUERY_RESULT;
}) {
  const sectionMembers = members.filter((member) =>
    UNIT_LEAD_ROLE.test(member.role.trim()),
  );

  if (sectionMembers.length === 0) return null;

  return (
    <CarouselSection
      id="pimpinan-departemen-biro-heading"
      heading={PINIMPINAN_HEADING}
      ariaLabel={PINIMPINAN_HEADING}
      members={sectionMembers}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Shared chrome: both carousels render through this, so their style   */
/* can never drift apart                                               */
/* ------------------------------------------------------------------ */
function CarouselSection({
  id,
  heading,
  ariaLabel,
  members,
}: {
  id: string;
  heading: string;
  ariaLabel: string;
  members: Member[];
}) {
  return (
    // min-h-[100dvh] (not h-): the group always fills one screen, but taller
    // content (e.g. wrapped cards on narrow phones) can still grow past it.
    <section
      aria-labelledby={id}
      className="flex min-h-[100dvh] flex-col justify-center px-6 py-16"
    >
      <SectionHeading id={id}>{heading}</SectionHeading>

      {/* Full-bleed: break out of the section padding so the carousel spans
          the whole viewport width, matching the hero/mapres carousels. */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <InfiniteCarousel
          ariaLabel={ariaLabel}
          duration={Math.max(8, Math.round(members.length * CAROUSEL_SECONDS_PER_CARD))}
          gap="gap-6"
        >
          {members.map((member) => (
            <LeadershipCard key={member._id} member={member} />
          ))}
        </InfiniteCarousel>
      </div>
    </section>
  );
}

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="mb-10 text-center">
      <h2
        id={id}
        className="text-depth text-balance text-3xl font-bold leading-snug text-brand-yellow sm:text-4xl lg:text-5xl"
        style={{ letterSpacing: "-0.03em" }}
      >
        {children}
      </h2>
    </div>
  );
}
