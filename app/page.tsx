import { SanityImage } from "@/components/SanityImage";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CABINET_PROFILE_QUERY,
  CONTENT_TERM,
  FEATURED_PROGRAMS_QUERY,
  MAPRES_QUERY,
  MEMBERS_QUERY,
  ORGANIZATION_UNITS_QUERY,
  PUBLICATION_CARDS_QUERY,
  SITE_SETTINGS_QUERY,
  STUDENT_ASSOCIATIONS_QUERY
} from "@/sanity/lib/queries";
import { safeExternalUrl } from "@/sanity/lib/urls";
export default async function Home() {
  const params = { term: CONTENT_TERM };
  const [
    settingsResult,
    cabinetResult,
    programsResult,
    postsResult,
    mapresResult,
    unitsResult,
    membersResult,
    associationsResult
  ] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: CABINET_PROFILE_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: FEATURED_PROGRAMS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: PUBLICATION_CARDS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: MAPRES_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: ORGANIZATION_UNITS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: MEMBERS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: STUDENT_ASSOCIATIONS_QUERY, params, perspective: "published", stega: false })
  ]);

  const settings = settingsResult.data;
  const cabinet = cabinetResult.data;
  const programs = programsResult.data ?? [];
  const posts = postsResult.data ?? [];
  const mapres = mapresResult.data ?? [];
  const units = unitsResult.data ?? [];
  const members = membersResult.data ?? [];
  const associations = associationsResult.data ?? [];
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <SiteHeader organizationName={settings?.organizationName} cabinetName={cabinet?.cabinetName} />

      <main className="mx-auto max-w-6xl space-y-14 px-6 py-12">
        {!settings && !cabinet && (
          <p
            role="status"
            className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950"
          >
            Konten 2026 belum tersedia. Pastikan dokumen singleton dan field
            term telah dipublikasikan.
          </p>
        )}
        {cabinet?.vision && (
          <section aria-labelledby="vision">
            <h2
              id="vision"
              className="text-2xl font-bold text-[var(--color-brand-blue)]"
            >
              Visi
            </h2>
            <p className="mt-3 max-w-3xl leading-7">{cabinet.vision}</p>
          </section>
        )}
        <ContentSection
          title="Program Unggulan"
          empty="Belum ada program unggulan yang dipublikasikan."
          hasContent={programs.length > 0}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <article
                key={program._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <SanityImage
                  value={program.coverImage}
                  width={720}
                  height={405}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  fallbackAlt={`Gambar program ${program.name}`}
                  className="aspect-video h-auto w-full object-cover"
                />
                <div className="space-y-2 p-5">
                  <h3 className="font-bold">{program.name}</h3>
                  {program.shortDescription && (
                    <p className="text-sm text-slate-600">
                      {program.shortDescription}
                    </p>
                  )}
                  <ExternalLink
                    href={program.externalLink}
                    label="Kunjungi informasi resmi"
                  />
                </div>
              </article>
            ))}
          </div>
        </ContentSection>
        <ContentSection
          title="Mahasiswa Berprestasi"
          empty="Belum ada data prestasi yang dipublikasikan."
          hasContent={mapres.length > 0}
        >
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {mapres.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-xl border bg-white"
              >
                <SanityImage
                  value={item.image}
                  width={480}
                  height={640}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  fallbackAlt={`Foto ${item.nama_mapres}`}
                  className="aspect-[3/4] w-full object-cover"
                />
                <div className="space-y-1 p-4">
                  <h3 className="font-bold">{item.nama_mapres}</h3>
                  <p className="text-sm text-slate-600">
                    {item.achievementTitle}
                  </p>
                  <ExternalLink
                    href={item.instagramUrl}
                    label="Lihat profil resmi"
                  />
                </div>
              </article>
            ))}
          </div>
        </ContentSection>
        <ContentSection
          title="Publikasi Terbaru"
          empty="Belum ada artikel atau kajian yang dipublikasikan."
          hasContent={posts.length > 0}
        >
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post._id}
                className="rounded-xl border bg-white p-5"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-brand-blue)]">
                  {post.postCategory}
                </p>
                <h3 className="mt-2 text-xl font-bold">{post.judul}</h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                )}
                <ExternalLink
                  href={post.instagramUrl}
                  label="Baca di Instagram resmi"
                />
              </article>
            ))}
          </div>
        </ContentSection>
        <ContentSection
          title="Struktur Organisasi"
          empty="Belum ada unit organisasi yang dipublikasikan."
          hasContent={units.length > 0}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((unit) => (
              <article
                key={unit._id}
                className="rounded-xl border bg-white p-5"
              >
                <h3 className="font-bold">{unit.officialName}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {unit.description}
                </p>
              </article>
            ))}
          </div>
        </ContentSection>
        <ContentSection
          title="Fungsionaris"
          empty="Belum ada fungsionaris yang dipublikasikan."
          hasContent={members.length > 0}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <article
                key={member._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <SanityImage
                  value={member.photo}
                  width={480}
                  height={480}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  fallbackAlt={`Foto ${member.name}`}
                  className="aspect-square h-auto w-full object-cover"
                />
                <div className="space-y-2 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{member.name}</h3>
                    {member.isLeader && (
                      <span className="rounded-full bg-[var(--color-brand-yellow)] px-2 py-0.5 text-xs font-bold text-slate-900">
                        Pimpinan
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[var(--color-brand-blue)]">
                    {member.role}
                  </p>
                  {member.organizationUnit && (
                    <p className="text-sm text-slate-600">
                      {member.organizationUnit.abbreviation ??
                        member.organizationUnit.officialName}
                    </p>
                  )}
                  <ExternalLink
                    href={member.socialLink}
                    label="Kunjungi kanal resmi"
                  />
                </div>
              </article>
            ))}
          </div>
        </ContentSection>
        <ContentSection
          title="Himpunan dan Huria"
          empty="Belum ada organisasi mahasiswa yang dipublikasikan."
          hasContent={associations.length > 0}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {associations.map((item) => (
              <article
                key={item._id}
                className="rounded-xl border bg-white p-4"
              >
                <h3 className="font-bold">
                  {item.abbreviation ?? item.officialName}
                </h3>
                <p className="text-sm text-slate-600">{item.studyProgram}</p>
                <ExternalLink
                  href={item.officialLink}
                  label="Kunjungi kanal resmi"
                />
              </article>
            ))}
          </div>
        </ContentSection>
      </main>
      <SiteFooter officialEmail={settings?.officialEmail} careCenterUrl={settings?.fisipCareCenterUrl} />
    </div>
  );
}

function ContentSection({
  title,
  empty,
  hasContent = true,
  children
}: {
  title: string;
  empty: string;
  hasContent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={title}>
      <h2
        id={title}
        className="mb-5 text-2xl font-bold text-[var(--color-brand-blue)]"
      >
        {title}
      </h2>
      {hasContent ? (
        children
      ) : (
        <p className="rounded-lg bg-slate-100 p-4 text-slate-600">{empty}</p>
      )}
    </section>
  );
}

function ExternalLink({ href, label }: { href?: string | null; label: string }) {
  const safeHref = safeExternalUrl(href ?? undefined);
  return safeHref ? (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex rounded-md text-sm font-semibold text-[var(--color-brand-blue)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {label}
    </a>
  ) : null;
}
