# Project context

## Product

BEM FISIP Unpad 2026 is the institution's public company-profile and publication website. It should explain the cabinet, organization, programs, achievements, and publications, and connect visitors to departments, Himpunan/Huria, social accounts, and FISIP Care Center.

The primary website language is Indonesian unless the client approves a bilingual experience.

## Confirmed direction

- Build a clean 2026 implementation; use the inherited 2025 site as a behavioral reference, not a code template.
- Preserve client-approved feature parity and existing public paths unless replacements and redirects are approved.
- Keep the 2025 site and content recoverable.
- Isolate 2026 Sanity content so it cannot mix with or overwrite 2025 content.
- Keep editable institutional copy and repeatable content in Sanity where practical.
- Use fixtures while final copy is incomplete.
- Prefer Server Components and server-side content fetching; isolate client code to genuine interaction.
- Keep the public web application and versioned Sanity Studio source under the same institution-owned repository unless another structure is approved.

## Fixed design foundations

- Primary typeface: Inter.
- Brand blue: #003089.
- Brand yellow: #FFBA3A.
- Client-supplied BEM and Himpunan/Huria logos are approved inputs.
- Target WCAG 2.2 AA and support reduced motion.

Do not introduce a competing brand font, unapproved brand color, or invented final design direction.

## Feature baseline

The parity baseline includes:

- Global header, responsive navigation, and footer.
- Home hero, cabinet overview, profile video, featured programs, achievements, press releases, and latest publications.
- About content covering identity, logo philosophy, vision, mission, culture, values, leadership, and organization units.
- Publication archive and article/kajian detail.
- Organization-unit detail with programs, members, and gallery.
- Himpunan/Huria directory.
- Responsive, loading, empty, error, not-found, keyboard, and reduced-motion behavior.

See docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md for the complete acceptance baseline.

## Architecture direction

- Next.js App Router, React, strict TypeScript, Tailwind CSS, Sanity, and Vercel.
- Centralized typed Sanity clients, parameterized GROQ queries, image helpers, and explicit cache/revalidation policy.
- Stable slugs and real not-found handling.
- Route metadata, canonical URLs, sharing metadata, sitemap, robots, and appropriate structured data.
- Unit/component tests plus Playwright route, interaction, accessibility, and responsive coverage.
- Short-lived branches, reviewed pull requests, preview deployments, and a releasable main branch.

Versions and package-manager strategy must be approved from the repository's actual state; do not copy the 2025 dependency file.

## Non-goals without separate approval

- Public accounts, member portals, payments, event ticketing, or e-commerce.
- A custom backend when Sanity meets the requirement.
- Contact forms, newsletters, analytics, or new third-party integrations.
- Development-team ownership of final copywriting.
- Pixel-for-pixel preservation of 2025 defects.

## Sources of truth

When requirements conflict, use:

1. Latest explicit written client/user approval.
2. Approved 2026 Figma files, design system, and assets.
3. docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md.
4. Approved feature-parity checklist.
5. Observable 2025 production behavior.
6. Inherited 2025 source.

Record unresolved material conflicts and request a decision before implementing the affected behavior.

## Ownership and approval matrix

| Area | Authority | Current state |
| --- | --- | --- |
| Product scope and final acceptance | Client/institution | Named approver not yet recorded |
| Brand, Figma, and assets | Client/institution | Core font/colors/logos confirmed; detailed responsive states pending |
| Published copy, names, photos, and consent | Client/institution | Owners and reviewers pending |
| GitHub organization/repository | Client/institution | Remote exists; final long-term owner not confirmed |
| Sanity project, datasets, members, and production content | Client/institution | Administrator access, schema source, and 2026 dataset approval pending |
| Vercel, domain, DNS, and production release | Client/institution | Owners and launch authority pending |
| Application and CMS implementation | Development team | Subject to approved plans and client-owned boundaries |
| Verification and technical handover | Development team | Required for each task and release |

Unknown owners are blockers for the affected external or production action, not for safe local fixture-based development.
