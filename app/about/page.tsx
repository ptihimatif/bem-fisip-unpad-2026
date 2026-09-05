import { SanityImage } from "@/components/SanityImage";
import { SanityPortableText } from "@/components/SanityPortableText";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import type { PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CABINET_PROFILE_QUERY,
  CONTENT_TERM,
  MEMBERS_QUERY,
  ORGANIZATION_UNITS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

export default async function AboutPage() {
  const params = { term: CONTENT_TERM };
  const [settingsResult, cabinetResult, unitsResult, membersResult] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: CABINET_PROFILE_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: ORGANIZATION_UNITS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: MEMBERS_QUERY, params, perspective: "published", stega: false }),
  ]);
  const settings = settingsResult.data;
  const cabinet = cabinetResult.data;
  const units = unitsResult.data ?? [];
  const members = membersResult.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <SiteHeader organizationName={settings?.organizationName} cabinetName={cabinet?.cabinetName} />
      <main className="mx-auto max-w-6xl space-y-14 px-6 py-12">
        <section aria-labelledby="about-title">
          <h1 id="about-title" className="text-4xl font-extrabold text-[var(--color-brand-blue)]">Tentang BEM FISIP Unpad</h1>
          {cabinet?.overview && <div className="mt-4 max-w-3xl"><SanityPortableText blocks={cabinet.overview as unknown as PortableTextBlock[]} /></div>}
        </section>
        {cabinet?.vision && (
          <section aria-labelledby="vision">
            <h2 id="vision" className="text-2xl font-bold text-[var(--color-brand-blue)]">Visi</h2>
            <p className="mt-3 max-w-3xl leading-7">{cabinet.vision}</p>
          </section>
        )}
        {cabinet?.missions && cabinet.missions.length > 0 && (
          <section aria-labelledby="mission">
            <h2 id="mission" className="text-2xl font-bold text-[var(--color-brand-blue)]">Misi</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {cabinet.missions.map((mission, index) => <li key={`${mission}-${index}`} className="rounded-xl border bg-white p-5">{mission}</li>)}
            </ul>
          </section>
        )}
        <section aria-labelledby="units">
          <h2 id="units" className="text-2xl font-bold text-[var(--color-brand-blue)]">Bidang dan Departemen</h2>
          {units.length === 0 ? <p className="mt-4 rounded-lg bg-slate-100 p-4 text-slate-600">Belum ada struktur organisasi yang dipublikasikan.</p> : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((unit) => (
                <article key={unit._id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                  <SanityImage value={unit.coverImage} width={720} height={405} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" fallbackAlt={`Gambar ${unit.officialName}`} className="aspect-video h-auto w-full object-cover" />
                  <div className="p-5"><h3 className="font-bold">{unit.officialName}</h3><p className="mt-2 text-sm text-slate-600">{unit.description}</p></div>
                </article>
              ))}
            </div>
          )}
        </section>
        <section aria-labelledby="team">
          <h2 id="team" className="text-2xl font-bold text-[var(--color-brand-blue)]">Fungsionaris</h2>
          {members.length === 0 ? <p className="mt-4 rounded-lg bg-slate-100 p-4 text-slate-600">Belum ada fungsionaris yang dipublikasikan.</p> : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <article key={member._id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                  <SanityImage value={member.photo} width={480} height={480} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" fallbackAlt={`Foto ${member.name}`} className="aspect-square h-auto w-full object-cover" />
                  <div className="p-5"><h3 className="font-bold">{member.name}</h3><p className="mt-1 text-sm text-[var(--color-brand-blue)]">{member.role}</p></div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter officialEmail={settings?.officialEmail} careCenterUrl={settings?.fisipCareCenterUrl} />
    </div>
  );
}
