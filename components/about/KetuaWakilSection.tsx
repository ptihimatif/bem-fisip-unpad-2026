import type { ReactNode } from "react";

import { LeadershipCard } from "@/components/about/LeadershipCard";
import type { MEMBERS_QUERY_RESULT } from "@/sanity.types";

/* ------------------------------------------------------------------ */
/* Copy: edit the heading here                                         */
/* ------------------------------------------------------------------ */
const HEADING = "Ketua dan Wakil Ketua BEM FISIP UNPAD";

/* ------------------------------------------------------------------ */
/* Which role goes in this group                                       */
/* ------------------------------------------------------------------ */
const ROLE_ORDER = ["Ketua", "Wakil Ketua"];
const ROLES = new Set(ROLE_ORDER);

interface KetuaWakilSectionProps {
  members: MEMBERS_QUERY_RESULT;
}

export default function KetuaWakilSection({ members }: KetuaWakilSectionProps) {
  const topMembers = members
    .filter((member) => ROLES.has(member.role.trim()))
    .sort(
      (first, second) =>
        ROLE_ORDER.indexOf(first.role.trim()) -
        ROLE_ORDER.indexOf(second.role.trim()),
    );

  if (topMembers.length === 0) return null;

  return (
    // min-h-[100dvh] (not h-): the group always fills one screen, but taller
    // content (e.g. wrapped cards on narrow phones) can still grow past it.
    <section
      aria-labelledby="ketua-wakil-heading"
      className="flex min-h-[100dvh] flex-col justify-center px-6 py-16"
    >
      <SectionHeading id="ketua-wakil-heading">{HEADING}</SectionHeading>

      {/* flex + justify-center keeps one or two cards centered under the heading */}
      <div className="relative flex flex-wrap justify-center gap-15">
        {/* Decorative background asset (from home) between the two cards */}
        <div className="relative z-10 flex flex-wrap justify-center gap-15">
          {topMembers.map((member) => (
            <LeadershipCard key={member._id} member={member} />
          ))}
        </div>
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
