import { defineQuery } from "next-sanity";

export const CONTENT_TERM = "2026";

const IMAGE_FIELDS = `
  asset->{_id, url, metadata {lqip, dimensions {width, height}}},
  alt,
  attribution,
  crop,
  hotspot
`;

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings-2026" && term == $term][0]{
    _id, organizationName, term, seoTitle, seoDescription, ogImage {${IMAGE_FIELDS}},
    officialEmail, officialAddress, socialLinks[]{platform, url}, fisipCareCenterUrl
  }
`);

export const CABINET_PROFILE_QUERY = defineQuery(`
  *[_id == "cabinetProfile-2026" && term == $term][0]{
    _id, cabinetName, tagline, overview, profileVideoUrl, vision, missions, values,
    workCulture, logoPhilosophy[]{_key, title, description}
  }
`);

export const FEATURED_PROGRAMS_QUERY = defineQuery(`
  *[_type == "program" && term == $term && isFeatured == true && organizationUnit->term == $term]
  | order(displayOrder asc, name asc)[0...6]{
    _id, name, "slug": slug.current, shortDescription, description, coverImage {${IMAGE_FIELDS}},
    externalLink, "organizationUnit": organizationUnit->{_id, officialName, abbreviation, "slug": slug.current}
  }
`);

export const PROGRAM_BY_SLUG_QUERY = defineQuery(`
  *[_type == "program" && term == $term && slug.current == $slug && organizationUnit->term == $term][0]{
    _id, name, "slug": slug.current, shortDescription, description, coverImage {${IMAGE_FIELDS}},
    startDate, endDate, externalLink,
    "organizationUnit": organizationUnit->{_id, officialName, abbreviation, "slug": slug.current}
  }
`);

export const PUBLICATION_CARDS_QUERY = defineQuery(`
  *[_type == "post" && term == $term && defined(slug.current)]
  | order(publishedAt desc)[0...6]{
    _id, judul, "slug": slug.current, postCategory, publishedAt, excerpt,
    image {${IMAGE_FIELDS}}, instagramUrl
  }
`);

export const PUBLICATION_PAGE_QUERY = defineQuery(`
  *[_type == "post" && term == $term && defined(slug.current)]
  | order(publishedAt desc)[0...12]{
    _id, judul, "slug": slug.current, postCategory, publishedAt, excerpt,
    image {${IMAGE_FIELDS}}, instagramUrl
  }
`);

export function publicationPageQuery(start: number, end: number) {
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end <= start
  ) {
    throw new Error(
      "Publication pagination bounds must be safe, increasing integers.",
    );
  }

  return defineQuery(`
    *[_type == "post" && term == $term && defined(slug.current)]
    | order(publishedAt desc)[${start}...${end}]{
      _id, judul, "slug": slug.current, postCategory, publishedAt, excerpt,
      image {${IMAGE_FIELDS}}, instagramUrl
    }
  `);
}

export const PUBLICATION_COUNT_QUERY = defineQuery(`
  count(*[_type == "post" && term == $term && defined(slug.current)])
`);

export const ORGANIZATION_UNIT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "organizationUnit" && term == $term && slug.current == $slug][0]{
    _id, officialName, abbreviation, "slug": slug.current, unitKind, description,
    coverImage {${IMAGE_FIELDS}}, gallery[]{_key, alt, caption, asset->{_id, url, metadata {lqip, dimensions {width, height}}}},
    "programs": *[_type == "program" && term == $term && references(^._id)]
      | order(displayOrder asc, name asc){_id, name, "slug": slug.current, shortDescription, coverImage {${IMAGE_FIELDS}}, externalLink},
    "members": *[_type == "member" && term == $term && references(^._id)]
      | order(isLeader desc, displayOrder asc, name asc){_id, name, role, photo {${IMAGE_FIELDS}}, socialLink, isLeader}
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && term == $term && slug.current == $slug][0]{
    _id, judul, "slug": slug.current, postCategory, publishedAt, excerpt, image {${IMAGE_FIELDS}},
    body, instagramUrl, seoTitle, seoDescription, seoImage {${IMAGE_FIELDS}}
  }
`);

export const MAPRES_QUERY = defineQuery(`
  *[_type == "mapres" && term == $term]
  | order(displayOrder asc, achievementYear desc, nama_mapres asc)[0...12]{
    _id, nama_mapres, achievementTitle, achievementYear, image {${IMAGE_FIELDS}}, instagramUrl
  }
`);

export const ORGANIZATION_UNITS_QUERY = defineQuery(`
  *[_type == "organizationUnit" && term == $term && defined(slug.current)]
  | order(displayOrder asc, officialName asc){
    _id, officialName, abbreviation, "slug": slug.current, unitKind, description,
    coverImage {${IMAGE_FIELDS}}
  }
`);

export const MEMBERS_QUERY = defineQuery(`
  *[_type == "member" && term == $term && organizationUnit->term == $term]
  | order(isLeader desc, displayOrder asc, name asc){
    _id, name, role, photo {${IMAGE_FIELDS}}, socialLink, isLeader,
    "organizationUnit": organizationUnit->{_id, officialName, abbreviation, "slug": slug.current}
  }
`);

export const STUDENT_ASSOCIATIONS_QUERY = defineQuery(`
  *[_type == "studentAssociation" && term == $term]
  | order(displayOrder asc, officialName asc){
    _id, officialName, abbreviation, studyProgram, cabinetName, description, logo {${IMAGE_FIELDS}}, officialLink, socialLinks[]{platform, url}
  }
`);
