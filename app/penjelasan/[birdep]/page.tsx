import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SanityImage } from "@/components/SanityImage";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import { CONTENT_TERM, ORGANIZATION_UNIT_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { safeExternalUrl } from "@/sanity/lib/urls";

async function getUnit(slug: string) {
  const result = await sanityFetch({ query: ORGANIZATION_UNIT_BY_SLUG_QUERY, params: { term: CONTENT_TERM, slug }, perspective: "published", stega: false });
  return result.data;
}

export async function generateMetadata({ params }: { params: Promise<{ birdep: string }> }): Promise<Metadata> {
  const unit = await getUnit((await params).birdep);
  return unit ? { title: unit.officialName, description: unit.description } : { title: "Bidang tidak ditemukan" };
}

export default async function DepartmentPage({ params }: { params: Promise<{ birdep: string }> }) {
  const { birdep } = await params;
  const [unit, settingsResult] = await Promise.all([
    getUnit(birdep),
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, perspective: "published", stega: false }),
  ]);
  if (!unit) notFound();

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 pt-24">
      <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">
        <section>
          <SanityImage value={unit.coverImage} width={1400} height={700} sizes="100vw" fallbackAlt={`Gambar ${unit.officialName}`} className="aspect-[2/1] h-auto w-full object-cover" />
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-blue)]">{unit.unitKind}</p>
          <h1 className="mt-2 text-4xl font-extrabold text-[var(--color-brand-blue)]">{unit.officialName}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-700">{unit.description}</p>
        </section>
        <section aria-labelledby="programs">
          <h2 id="programs" className="text-2xl font-bold text-[var(--color-brand-blue)]">Program Kerja</h2>
          {unit.programs.length === 0 ? <p className="mt-4 bg-slate-100 p-4 text-slate-600">Belum ada program kerja yang dipublikasikan.</p> : <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{unit.programs.map((program) => <article key={program._id} className="border bg-white p-5 shadow-sm"><SanityImage value={program.coverImage} width={720} height={405} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" fallbackAlt={`Gambar ${program.name}`} className="aspect-video h-auto w-full object-cover" /><h3 className="mt-4 font-bold">{program.name}</h3>{program.shortDescription && <p className="mt-2 text-sm text-slate-600">{program.shortDescription}</p>}{safeExternalUrl(program.externalLink) && <a href={safeExternalUrl(program.externalLink)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex font-semibold text-[var(--color-brand-blue)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Info resmi</a>}</article>)}</div>}
        </section>
        <section aria-labelledby="members">
          <h2 id="members" className="text-2xl font-bold text-[var(--color-brand-blue)]">Meet the Team</h2>
          {unit.members.length === 0 ? <p className="mt-4 bg-slate-100 p-4 text-slate-600">Belum ada anggota yang dipublikasikan.</p> : <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{unit.members.map((member) => <article key={member._id} className="overflow-hidden border bg-white shadow-sm"><SanityImage value={member.photo} width={480} height={480} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" fallbackAlt={`Foto ${member.name}`} className="aspect-square h-auto w-full object-cover" /><div className="p-4"><h3 className="font-bold">{member.name}</h3><p className="mt-1 text-sm text-slate-600">{member.role}</p></div></article>)}</div>}
        </section>
      </main>
      <Footer settings={settingsResult.data} />
    </div>
  );
}
