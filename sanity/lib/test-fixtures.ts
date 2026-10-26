/** Isolated browser-test content. Imported only when SANITY_TEST_MODE is explicitly enabled. */
import * as queries from "./queries";

const posts = Array.from({ length: 9 }, (_, index) => ({
  _id: `test-post-${index + 1}`, judul: `Publikasi Uji ${index + 1}`, slug: `publikasi-uji-${index + 1}`,
  postCategory: index % 2 ? "kajian" : "artikel", publishedAt: `2026-10-${String(26 - index).padStart(2, "0")}T08:00:00Z`, _updatedAt: "2026-10-27T08:00:00Z",
  excerpt: "Konten pengujian terisolasi.", image: null, instagramUrl: "https://www.instagram.com/bemfisipunpad/",
}));
const unit = { _id: "test-unit", officialName: "Biro Kesekretariatan", abbreviation: "KSK", slug: "biro-kesekretariatan", unitKind: "biro", description: "Unit pengujian terisolasi.", coverImage: null };
const programs = [
  { _id: "test-program", name: "Program Uji", slug: "program-uji", shortDescription: "Penjelasan program dari fixture.", description: null, coverImage: { _type: "image", alt: "Sampul program pengujian", asset: { _id: "image-0123456789abcdef0123456789abcdef01234567-1200x1200-png", url: "https://cdn.sanity.io/images/ci-placeholder/ci-placeholder/0123456789abcdef0123456789abcdef01234567-1200x1200.png", metadata: { lqip: null, dimensions: { width: 1200, height: 1200 } } } }, externalLink: null, organizationUnit: unit },
  { _id: "test-program-rich", name: "Program Rich Text Uji", slug: "program-rich-uji", shortDescription: null, description: [{ _key: "paragraph", _type: "block", style: "normal", markDefs: [], children: [{ _key: "text", _type: "span", text: "Deskripsi lengkap dari fixture.", marks: [] }] }], coverImage: null, externalLink: null, organizationUnit: unit },
  ...Array.from({ length: 3 }, (_, index) => ({ _id: `test-program-extra-${index}`, name: `Program Tambahan Uji ${index + 1}`, slug: `program-tambahan-${index + 1}`, shortDescription: "Program pengujian tambahan.", description: null, coverImage: null, externalLink: null, organizationUnit: unit })),
];

export function fixtureData(query: string, params?: Record<string, unknown>) {
  switch (query) {
    case queries.SITE_SETTINGS_QUERY: return { _id: "siteSettings-2026", term: "2026", organizationName: "BEM FISIP Unpad 2026", seoTitle: "BEM FISIP Unpad 2026", seoDescription: "Website pengujian terisolasi.", ogImage: null, officialEmail: null, officialAddress: null, fisipCareCenterUrl: "https://www.instagram.com/fisipcarecenter/", socialLinks: [], replaceDefaultSocialLinks: false };
    case queries.CABINET_PROFILE_QUERY: return { _id: "cabinetProfile-2026", cabinetName: "Kabinet Pendar Mentari", overview: [{ _key: "test-overview", _type: "block", style: "normal", markDefs: [], children: [{ _key: "text", _type: "span", text: "Profil kabinet dari fixture.", marks: [] }] }], profileVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", vision: null, values: [{ _key: "empati", title: "Empati dari Studio", description: "Penjelasan nilai dari data CMS." }], visionHighlights: null, missionItems: [{ title: "Misi dari Studio", description: "Misi terstruktur dari CMS." }], workCultureItems: [{ title: "Budaya dari Studio", description: "Budaya kerja dari CMS." }], logoExplanationItems: null };
    case queries.FEATURED_PROGRAMS_QUERY: return programs;
    case queries.PROGRAM_BY_SLUG_QUERY: return params?.slug === "program-uji" ? programs[0] : null;
    case queries.PUBLICATION_CARDS_QUERY: return posts.slice(0, 6);
    case queries.PUBLICATION_PAGE_QUERY:
    case queries.PUBLICATION_PAGE_ASC_QUERY: {
      const filtered = posts.filter((post) => params?.category === "semua" || post.postCategory === params?.category);
      if (query === queries.PUBLICATION_PAGE_ASC_QUERY) filtered.reverse();
      return { total: filtered.length, posts: filtered.slice(Number(params?.start ?? 0), Number(params?.end ?? 5)) };
    }
    case queries.POST_BY_SLUG_QUERY: {
      if (params?.slug === "cms-unavailable") throw new Error("Isolated CMS outage fixture");
      const post = posts.find((item) => item.slug === params?.slug);
      return post ? { ...post, seoTitle: null, seoDescription: null, seoImage: null, body: [{ _key: "paragraph", _type: "block", style: "normal", markDefs: [], children: [{ _key: "text", _type: "span", text: "Isi publikasi pengujian.", marks: [] }] }] } : null;
    }
    case queries.ORGANIZATION_UNITS_QUERY: return [unit];
    case queries.ORGANIZATION_UNIT_BY_SLUG_QUERY: return params?.slug === unit.slug ? { ...unit, gallery: [], programs, members: [] } : null;
    case queries.MEMBERS_QUERY: return [];
    case queries.LEADERSHIP_MEMBERS_QUERY: return Array.from({ length: 5 }, (_, index) => ({ _id: `test-leader-${index}`, name: `Pemimpin Uji ${index + 1}`, role: `Kepala Departemen Uji ${index + 1}`, photo: null }));
    case queries.STUDENT_ASSOCIATIONS_QUERY: return [{ _id: "test-hima", officialName: "Himpunan Uji", abbreviation: "HIMA", studyProgram: "Program Studi Uji", cabinetName: null, description: "Himpunan pengujian.", logo: null, officialLink: null, socialLinks: [] }];
    case queries.MAPRES_QUERY: return Array.from({ length: 5 }, (_, index) => ({ _id: `test-mapres-${index}`, nama_mapres: index === 0 ? "Mahasiswa Uji" : `Mahasiswa Uji ${index + 1}`, studyProgram: "Ilmu Politik", cohortYear: 2023, rank: null, achievementTitle: "Prestasi Uji", achievementYear: 2026, image: null, instagramUrl: null }));
    case queries.SITEMAP_POSTS_QUERY: return posts.map((post) => ({ slug: post.slug, publishedAt: post.publishedAt, _updatedAt: post.publishedAt }));
    case queries.SITEMAP_UNITS_QUERY: return [{ slug: unit.slug, _updatedAt: "2026-10-26T08:00:00Z" }];
    default: throw new Error("Browser fixture missing for a Sanity query; refusing a live-data fallback");
  }
}
