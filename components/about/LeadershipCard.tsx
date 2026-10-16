import { SanityImage } from "@/components/SanityImage";
import type { MEMBERS_QUERY_RESULT } from "@/sanity.types";

type Member = MEMBERS_QUERY_RESULT[number];

/* ------------------------------------------------------------------ */
/* Shared look: both leadership groups use these, so they cannot drift */
/* apart. Card height is dvh-based (clamped in rem) so a group fits    */
/* inside one 100dvh section.                                          */
/* ------------------------------------------------------------------ */
const CARD_CLASS =
  "relative max-w-full flex-none overflow-hidden rounded-lg bg-black/10 h-[34dvh] min-h-[15rem] max-h-[26rem] sm:h-[42dvh] sm:max-h-[32rem] lg:h-[52dvh] lg:max-h-[40rem]";
const IMAGE_WIDTH = 720;
const IMAGE_HEIGHT = 960;
const IMAGE_SIZES =
  "(min-width: 1024px) 480px, (min-width: 640px) 384px, 312px";

export function LeadershipCard({ member }: { member: Member }) {
  return (
    <article
      className={CARD_CLASS}
      style={{ aspectRatio: getAspectRatio(member) }}
    >
      {member.photo?.asset ? (
        <SanityImage
          value={member.photo}
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          sizes={IMAGE_SIZES}
          fallbackAlt={`Foto ${member.name}, ${member.role}`}
          className="h-full w-full object-contain"
          preserveAspectRatio
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-brand-blue px-6 text-center text-5xl font-extrabold text-brand-yellow">
          {getInitials(member.name)}
        </div>
      )}
    </article>
  );
}

export function getAspectRatio(member: Member) {
  const dimensions = member.photo?.asset?.metadata?.dimensions;
  return dimensions ? `${dimensions.width} / ${dimensions.height}` : "3 / 4";
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
