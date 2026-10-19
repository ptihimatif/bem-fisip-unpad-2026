import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import MeshBackgroundBright from "@/components/about/MeshBackgroundBright";
import InfiniteCarousel from "@/components/InfiniteCarousel";
import ProgramList from "@/components/ProgramList";
import { LeadershipCard } from "@/components/about/LeadershipCard";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CONTENT_TERM,
  ORGANIZATION_UNIT_BY_SLUG_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { safeExternalUrl } from "@/sanity/lib/urls";

const PLACEHOLDER_PROGRAMS = [
  {
    _id: "placeholder-1",
    name: "Program Kerja Contoh Satu",
    shortDescription:
      "Deskripsi singkat program kerja pertama untuk melihat bentuk layout masonry.",
    externalLink: null,
  },
  {
    _id: "placeholder-2",
    name: "Program Kerja Contoh Dua",
    shortDescription: "Deskripsi singkat program kerja kedua.",
    externalLink: null,
  },
  {
    _id: "placeholder-3",
    name: "Program Kerja Contoh Tiga",
    shortDescription:
      "Deskripsi singkat program kerja ketiga yang sedikit lebih panjang agar bentuk masonry terlihat.",
    externalLink: null,
  },
  {
    _id: "placeholder-4",
    name: "Program Kerja Contoh Empat",
    shortDescription: "Deskripsi singkat.",
    externalLink: null,
  },
  {
    _id: "placeholder-5",
    name: "Program Kerja Contoh Lima",
    shortDescription: "Deskripsi singkat program kerja kelima.",
    externalLink: null,
  },
];

async function getUnit(slug: string) {
  const result = await sanityFetch({
    query: ORGANIZATION_UNIT_BY_SLUG_QUERY,
    params: { term: CONTENT_TERM, slug },
    perspective: "published",
    stega: false,
  });
  return result.data;
}



export async function generateMetadata({
  params,
}: {
  params: Promise<{ birdep: string }>;
}): Promise<Metadata> {
  const unit = await getUnit((await params).birdep);
  return unit
    ? { title: unit.officialName, description: unit.description }
    : { title: "Bidang tidak ditemukan" };
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ birdep: string }>;
}) {
  const { birdep } = await params;
  const [unit, settingsResult] = await Promise.all([
    getUnit(birdep),
    sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params: { term: CONTENT_TERM },
      perspective: "published",
      stega: false,
    }),
  ]);
  if (!unit) notFound();

  const programs =
    unit.programs.length > 0 ? unit.programs : PLACEHOLDER_PROGRAMS;

  return (
    <div className="relative isolate min-h-screen overflow-x-clip pt-24 text-white">
      <MeshBackgroundBright />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {/* HEADER: nama unit -> garis -> jenis unit */}
        <header className="mb-10 pb-2 text-center">
          <h1
            className="text-depth text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6"
            style={{ letterSpacing: "-0.05em" }}
          >
            {unit.officialName}
          </h1>

          <div className="relative left-1/2 -translate-x-1/2 w-screen border-t -mt-5 border-white my-5" />
        </header>

        {unit.description && (
          <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-[0_8px_32px_-8px_rgba(255,255,255,0.12)] ring-1 ring-inset ring-white/10 sm:p-8">
            <p
              className="text-center text-white sm:text-lg md:text-xl lg:text-2xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              {unit.description}
            </p>
          </div>
        )}

        {/* PROGRAM KERJA */}
        <section aria-labelledby="programs" className="mt-16">
          <h2
            id="programs"
            className="text-depth text-center text-balance text-3xl font-bold leading-snug text-white sm:text-4xl lg:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Program Kerja
          </h2>
          {programs.length === 0 ? (
            <p className="mt-5 border border-white/10 bg-white/5 p-6 text-sm text-white/80">
              Belum ada program kerja yang dipublikasikan.
            </p>
          ) : (
            <ProgramList
              items={programs.map((program) => ({
                id: program._id,
                name: program.name,
                href: safeExternalUrl(program.externalLink),
              }))}
            />
          )}
        </section>
      </main>

        {unit.members.length === 0 ? (
          <section aria-labelledby="members" className="mt-16">
            <p className="mt-5 border border-white/10 bg-white/5 p-6 text-sm text-white/80">
              Belum ada anggota yang dipublikasikan.
            </p>
          </section>
        ) : (
          (() => {
            const isLeader = (role: string) =>
              /^(?:Wakil )?(?:Kepala|Ketua)\b/i.test(role.trim());
            const leaders = unit.members
              .filter((member) => isLeader(member.role))
              .sort((first, second) => {
                const firstWakil = /^Wakil\b/i.test(first.role.trim()) ? 1 : 0;
                const secondWakil = /^Wakil\b/i.test(second.role.trim())
                  ? 1
                  : 0;
                if (firstWakil !== secondWakil) return firstWakil - secondWakil;
                return first.role.localeCompare(second.role);
              });
            const others = unit.members.filter(
              (member) => !isLeader(member.role),
            );

            const headingClass =
              "text-depth text-balance text-3xl font-bold leading-snug text-white sm:text-4xl lg:text-5xl";

            return (
              <div className="relative">
                {/* Vertical connector line, same style as the About page */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-10 bottom-10 -z-5 w-3 -translate-x-1/2 bg-gradient-to-b from-white/0 via-white/40 via-10% via-white/15 via-90% to-white/0"
                  style={{
                    filter: "drop-shadow(0 0 14px rgba(255,255,255,0.4))",
                  }}
                />
                {leaders.length > 0 && (
                  <section
                    aria-labelledby="unit-leaders-heading"
                    className="px-6 py-8"
                  >
                    <div className="mb-10 text-center mt-10">
                      <h2
                        id="unit-leaders-heading"
                        className={headingClass}
                        style={{ letterSpacing: "-0.03em" }}
                      >
                        Kepala dan Wakil Kepala
                      </h2>
                    </div>
                    <div className="mx-auto flex w-fit flex-wrap justify-center gap-6">
                      {leaders.map((member) => (
                        <LeadershipCard key={member._id} member={member} />
                      ))}
                    </div>
                  </section>
                )}
                {others.length > 0 && (
                  <section
                    aria-labelledby="unit-members-heading"
                    className="px-6 py-8"
                  >
                    <div className="mb-10 text-center mt-10">
                      <h2
                        id="unit-members-heading"
                        className={headingClass}
                        style={{ letterSpacing: "-0.03em" }}
                      >
                        Staff
                      </h2>
                    </div>
                    <div className="relative left-1/2 w-screen -translate-x-1/2">
                      <InfiniteCarousel
                        ariaLabel={`Anggota ${unit.officialName}`}
                        gap="gap-6"
                      >
                        {others.map((member) => (
                          <LeadershipCard key={member._id} member={member} />
                        ))}
                      </InfiniteCarousel>
                    </div>
                  </section>
                )}
              </div>
            );
          })()
        )}
      <div className="pt-16">
        <Footer settings={settingsResult.data} />
      </div>
    </div>
  );
}
