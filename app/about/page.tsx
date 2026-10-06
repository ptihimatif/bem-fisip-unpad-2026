import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SanityImage } from "@/components/SanityImage";
import { SanityPortableText } from "@/components/SanityPortableText";
import Footer from "@/components/Footer";
import LogoSection from "@/components/about/LogoSection";
import type { PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CABINET_PROFILE_QUERY,
  CONTENT_TERM,
  MEMBERS_QUERY,
  ORGANIZATION_UNITS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Tentang — BEM FISIP Unpad 2026",
  description:
    "Pelajari lebih lanjut tentang Badan Eksekutif Mahasiswa FISIP Unpad 2026, kabinet Pendar Mentari, visi, misi, dan struktur organisasi.",
};

const PAGE_GRADIENT =
  "linear-gradient(180deg, #000c23 0%, #003089 52%, #000c23 100%)";

function SectionHeading({
  id,
  primary = false,
  children,
}: {
  id: string;
  primary?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <h2
        id={id}
        className={
          primary
            ? "text-depth text-4xl sm:text-6xl font-extrabold mt-2"
            : "text-depth text-3xl sm:text-4xl font-bold mt-2"
        }
        style={{ letterSpacing: "-0.05em" }}
      >
        {children}
      </h2>
      <div
        aria-hidden
        className="relative left-1/2 -ml-[50vw] w-screen border-t border-white mt-2.5 mb-8"
      />
    </>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p
      className="mt-4 p-4 text-sm"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </p>
  );
}

export default async function AboutPage() {
  const params = { term: CONTENT_TERM };
  const [settingsResult, cabinetResult, unitsResult, membersResult] =
    await Promise.all([
      sanityFetch({
        query: SITE_SETTINGS_QUERY,
        params,
        perspective: "published",
        stega: false,
      }),
      sanityFetch({
        query: CABINET_PROFILE_QUERY,
        params,
        perspective: "published",
        stega: false,
      }),
      sanityFetch({
        query: ORGANIZATION_UNITS_QUERY,
        params,
        perspective: "published",
        stega: false,
      }),
      sanityFetch({
        query: MEMBERS_QUERY,
        params,
        perspective: "published",
        stega: false,
      }),
    ]);
  const settings = settingsResult.data;
  const cabinet = cabinetResult.data;
  const units = unitsResult.data ?? [];
  const members = membersResult.data ?? [];

  return (
    // overflow-x-clip (not hidden): the 100vw dividers are wider than the page
    // when a vertical scrollbar is present, and `hidden` would break the
    // position: sticky inside LogoSection.
    <div
      className="relative overflow-x-clip text-white"
      style={{ background: "#000c23" }}
    >
      {/* SECTION 1 - Logo Philosophy (has its own gradient) */}
      <LogoSection />

      {/* The page gradient starts here so it meets LogoSection's bottom edge
          (#000c23) with no visible seam. */}
      <div style={{ background: PAGE_GRADIENT }}>
        <main className="relative z-10 mx-auto max-w-6xl px-6 py-24">
          {cabinet?.overview && (
            <section aria-labelledby="about-title" className="mt-4">
              <SectionHeading id="about-title" primary>
                Tentang BEM FISIP Unpad
              </SectionHeading>
              <div className="mt-8 max-w-3xl prose prose-invert">
                <SanityPortableText
                  blocks={cabinet.overview as unknown as PortableTextBlock[]}
                />
              </div>
            </section>
          )}

          {cabinet?.vision && (
            <section aria-labelledby="vision" className="mt-20">
              <SectionHeading id="vision">Visi</SectionHeading>
              <p className="mt-6 max-w-3xl leading-7 text-base sm:text-lg">
                {cabinet.vision}
              </p>
            </section>
          )}

          {cabinet?.missions && cabinet.missions.length > 0 && (
            <section aria-labelledby="mission" className="mt-20">
              <SectionHeading id="mission">Misi</SectionHeading>
              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {cabinet.missions.map((mission, index) => (
                  <li
                    key={`${mission}-${index}`}
                    className="p-5 border border-white/20 bg-white/5 backdrop-blur-sm rounded"
                  >
                    {mission}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="units" className="mt-20">
            <SectionHeading id="units">Bidang dan Departemen</SectionHeading>
            {units.length === 0 ? (
              <EmptyState>
                Belum ada struktur organisasi yang dipublikasikan.
              </EmptyState>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {units.map((unit) => (
                  <article
                    key={unit._id}
                    className="overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm rounded"
                  >
                    <SanityImage
                      value={unit.coverImage}
                      width={720}
                      height={405}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      fallbackAlt={`Gambar ${unit.officialName}`}
                      className="aspect-video h-auto w-full object-cover"
                    />
                    <div className="p-5">
                      <h3 className="font-bold text-white">
                        {unit.officialName}
                      </h3>
                      <p className="mt-2 text-sm text-white/70">
                        {unit.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="team" className="mt-20">
            <SectionHeading id="team">Fungsionaris</SectionHeading>
            {members.length === 0 ? (
              <EmptyState>
                Belum ada fungsionaris yang dipublikasikan.
              </EmptyState>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <article
                    key={member._id}
                    className="overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm rounded"
                  >
                    <SanityImage
                      value={member.photo}
                      width={480}
                      height={480}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      fallbackAlt={`Foto ${member.name}`}
                      className="aspect-square h-auto w-full object-cover"
                    />
                    <div className="p-5">
                      <h3 className="font-bold text-white">{member.name}</h3>
                      <p className="mt-1 text-sm text-brand-yellow">
                        {member.role}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>

        <Footer settings={settings} />
      </div>
    </div>
  );
}
