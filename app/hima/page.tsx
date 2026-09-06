import { SanityImage } from "@/components/SanityImage";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import { CONTENT_TERM, SITE_SETTINGS_QUERY, STUDENT_ASSOCIATIONS_QUERY } from "@/sanity/lib/queries";
import { safeExternalUrl } from "@/sanity/lib/urls";

export default async function HimaPage() {
  const params = { term: CONTENT_TERM };
  const [settingsResult, associationsResult] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: STUDENT_ASSOCIATIONS_QUERY, params, perspective: "published", stega: false }),
  ]);
  const associations = associationsResult.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 pt-24">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-extrabold text-[var(--color-brand-blue)]">Himpunan dan Huria</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">Temukan organisasi mahasiswa dan kanal resminya di FISIP Unpad.</p>
        {associations.length === 0 ? <p className="mt-10 bg-slate-100 p-4 text-slate-600">Belum ada organisasi mahasiswa yang dipublikasikan.</p> : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {associations.map((item) => {
              const href = safeExternalUrl(item.officialLink);
              return <article key={item._id} className="border bg-white p-5 shadow-sm">
                <SanityImage value={item.logo} width={320} height={320} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" fallbackAlt={`Logo ${item.officialName}`} className="mx-auto aspect-square h-auto max-w-40 object-contain" />
                <h2 className="mt-5 font-bold">{item.abbreviation ?? item.officialName}</h2>
                <p className="mt-1 text-sm text-slate-600">{item.studyProgram}</p>
                {href && <a href={href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex font-semibold text-[var(--color-brand-blue)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Kanal resmi</a>}
              </article>;
            })}
          </div>
        )}
      </main>
      <Footer settings={settingsResult.data} />
    </div>
  );
}
