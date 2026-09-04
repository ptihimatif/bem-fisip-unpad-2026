# BEM FISIP Unpad 2026 Company Profile

## Agentic Development Brief

Status: planning baseline for a new 2026 repository/codebase  
Audience: developers, coding agents, reviewers, designers, content editors, and future maintainers  
Primary language of this document: English  
Primary website language: Indonesian unless the client later approves a bilingual experience

## 1. Purpose of this document

This is the self-contained product and engineering brief for building the new BEM FISIP Unpad 2026 company-profile website. A coding agent should read this document before proposing architecture, generating code, changing Sanity, or creating deployment resources.

The goal is to preserve the useful feature set of the 2025 website while creating a cleaner, safer, faster, and easier-to-handover 2026 implementation. The old codebase is a behavioral reference, not a template that must be copied line for line.

If this document conflicts with a newer explicit decision from the user or client, the newer decision wins and this document should be updated.

## 2. Confirmed project decisions

- Build a new 2026 repository/codebase rather than continuing development directly on the inherited 2025 repository.
- Preserve the client-approved features from the 2025 website unless a feature is explicitly removed or changed.
- Treat the 2025 website and dataset as an archive that must remain recoverable.
- Use the client's 2026 design system as the visual source of truth.
- Use **Inter** as the website's primary and default typeface.
- Use the client-approved duotone brand palette: **yellow `#FFBA3A`** and **blue `#003089`**.
- The client has already supplied the BEM logo and Himpunan/Huria logos.
- Website copywriting will be updated periodically. Final copy is not required to begin development.
- Copy and repeatable content should be editable through Sanity wherever practical, without requiring a code deployment.
- Use placeholder/fixture content during development; never hardcode unapproved final copy into UI components.
- The 2026 content must not accidentally mix with or overwrite the 2025 content.
- The project should be maintainable by future annual BEM teams with limited onboarding time.
- The new repository must include a root `.agents/` directory for project-specific agent documentation and workflow records.
- The new repository must include a root `.skills/` directory for reusable project-specific agent skills.
- All work is **plan-first**: an agent must present a task breakdown and wait for explicit human approval before making changes.

## 3. Product summary

The product is the official public company-profile and publication website for BEM FISIP Unpad 2026. It explains the cabinet's identity and organization, presents programs and achievements, publishes institutional content, and connects visitors to departments, Himpunan/Huria, social media, and FISIP Care Center.

Primary audiences:

- FISIP Unpad students;
- prospective students and the broader university community;
- BEM members and organizational partners;
- members of the public looking for official information; and
- BEM content editors who maintain the site through Sanity Studio.

Primary user outcomes:

- Understand who BEM FISIP Unpad 2026 is and what it does.
- Discover its structure, departments, people, values, and programs.
- Read articles, kajian, and press releases.
- Discover student achievements.
- Find official Himpunan/Huria and support-channel links.
- Trust that information is official, current, usable on mobile, and accessible.

## 4. Sources of truth

Use this priority order when requirements disagree:

1. Latest explicit written client/user approval.
2. Client-provided 2026 Figma files, design system, and approved asset package.
3. This development brief and its recorded decisions.
4. Approved feature-parity checklist.
5. Observable behavior of the 2025 production site.
6. The inherited 2025 source code.

The old code is last because it contains known defects and implementation shortcuts. Do not reproduce a behavior solely because it exists in old source if it conflicts with accessibility, security, the approved design, or a newer requirement.

When a material conflict cannot be resolved from these sources, record the conflict and ask for a decision before implementing the affected behavior. Continue working on unaffected areas.

## 5. Scope

### 5.1 Required feature-parity baseline

The 2026 application should preserve these capabilities:

- Fixed global header.
- Responsive desktop and mobile navigation.
- Home hero and guided movement to the next section.
- Cabinet overview and embedded profile video.
- Featured/flagship program cards with an interactive expanded state.
- Student-achievement (`Mapres`) carousel or equivalent browsable presentation.
- Press-release tiles linking to approved destinations.
- Latest article/kajian section.
- Article and kajian archive with pagination or progressive loading.
- Rich article/kajian detail pages.
- Cabinet visual identity and logo philosophy.
- Vision, mission, work culture, and organizational values.
- Leadership/team presentation.
- Organizational-field or department overview.
- Department/bureau detail pages.
- Department work programs, members, and documentation gallery.
- Himpunan/Huria directory with official links.
- Global footer with real institutional contact/social links.
- Responsive behavior across mobile, tablet, and desktop.
- Loading, empty, error, and not-found behavior.
- Motion that follows the approved design and supports reduced-motion users.

### 5.2 Existing public URLs

The inherited public paths are:

| Route | Capability |
| --- | --- |
| `/` | Home and main discovery experience |
| `/about` | Identity, vision/mission, values, team, departments |
| `/article` | Article and kajian archive |
| `/post/[slug]` | Article or kajian detail |
| `/hima` | Himpunan/Huria directory |
| `/penjelasan/[birdep]` | Department/bureau detail |

Preserve these paths initially for compatibility. If the client approves clearer canonical paths such as `/publikasi/[slug]` or `/departemen/[slug]`, create permanent redirects from every replaced 2025 path and test them before launch.

### 5.3 Non-goals unless separately approved

- User registration or login for public visitors.
- Member portals or internal dashboards outside Sanity Studio.
- Payments, donations, or e-commerce.
- Event ticketing.
- Custom social-network functionality.
- A custom backend/database when Sanity already satisfies the need.
- Contact forms, newsletters, WhatsApp automation, or new third-party integrations not included in approved scope.
- Copywriting production by the development team.
- A pixel-for-pixel recreation of technical defects in the 2025 site.

## 6. Content strategy

Final wording may arrive gradually and change after launch. The implementation must therefore separate content from presentation.

Rules:

- Store editable institutional copy in Sanity, not JSX.
- Use stable fixture documents for development and automated tests.
- Components must tolerate short, long, missing, draft, and partially completed content.
- A missing optional section should be hidden cleanly; it must not leave an empty full-screen panel.
- A missing required record should produce a clear fallback, error, or 404 as appropriate.
- Do not treat placeholder text as approved production content.
- Record which fields are required for publishing and which are optional.
- Sanity validation should prevent broken slugs, invalid URLs, missing required alternative text, and incomplete publication metadata.
- Content updates should become visible through a documented cache-revalidation process rather than requiring source changes.

## 7. Recommended technical stack

Use supported stable versions at the time the new repository is scaffolded. Lock exact working versions through `package-lock.json` and upgrade deliberately.

Recommended baseline:

| Area | Choice |
| --- | --- |
| Web framework | Next.js App Router |
| UI | React |
| Language | TypeScript with strict mode |
| Styling | Tailwind CSS using client-provided design tokens |
| CMS | Sanity Content Lake and Sanity Studio |
| Queries | GROQ with generated or explicit TypeScript result types |
| Hosting | Vercel for the public web application |
| Package manager | npm with `npm ci` in CI |
| Testing | Unit/component tests plus Playwright end-to-end tests |
| Code quality | ESLint, formatting, TypeScript checks, and CI |
| Images | Next.js Image plus sized/formatted Sanity image URLs |
| Fonts | Client-approved Inter, loaded through `next/font` and exposed as a shared design token |

Motion guidance:

- Prefer CSS transitions and one primary motion library.
- Use GSAP/ScrollTrigger only when the approved design requires scroll choreography that simpler tools cannot provide.
- Do not install both `motion` and `framer-motion` as separate overlapping dependencies.
- Use Swiper only if it remains the best accessible carousel implementation after reviewing the current supported version.
- Never recreate the old 1.5 MB base64 logo component.

Do not copy the inherited `package.json`. It includes outdated/vulnerable versions and unused or mistaken dependencies such as the unrelated `tailwind` package.

## 8. Recommended repository topology

Keep the public site and Sanity Studio source under the same institution-owned GitHub repository so future teams cannot inherit a frontend without its CMS schemas again. Deploy them as separate applications.

```text
bem-fisip-unpad-2026/
  AGENTS.md                    root dispatcher for agent instructions
  .agents/
    README.md
    PROJECT_CONTEXT.md
    PLANNING_AND_APPROVAL.md
    WORKFLOW.md
    QUALITY_GATES.md
    TASK_TEMPLATE.md
    CURRENT_STATE.md
    decisions/
    tasks/
    handoffs/
  .skills/
    README.md
    project-planning/
      SKILL.md
    design-system/
      SKILL.md
    sanity-cms/
      SKILL.md
    nextjs-feature/
      SKILL.md
    quality-review/
      SKILL.md
    release-handover/
      SKILL.md
  apps/
    web/
      src/app/
      src/components/
      src/lib/sanity/
      public/
      package.json
    studio/
      schemaTypes/
      migrations/
      sanity.config.ts
      sanity.cli.ts
      package.json
  packages/
    shared-types/          optional; only if both apps genuinely share it
  tests/
    e2e/
  docs/
    decisions/
    content-model.md
    deployment.md
    handover.md
  .github/workflows/ci.yml
  .env.example
  package.json             npm workspaces and shared scripts
  package-lock.json
  README.md
  AGENTIC_DEVELOPMENT_BRIEF_2026.md
```

Expected root scripts:

```json
{
  "scripts": {
    "dev:web": "npm run dev --workspace apps/web",
    "dev:studio": "npm run dev --workspace apps/studio",
    "build": "npm run build --workspaces --if-present",
    "lint": "npm run lint -- --workspaces --if-present",
    "typecheck": "npm run typecheck -- --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "test:e2e": "playwright test"
  }
}
```

This layout is a recommendation, not permission to create external repositories, projects, datasets, or deployments. Those external mutations require explicit user/client authorization.

### 8.1 Required `.agents/` documentation system

The `.agents/` directory is the durable operating context for human developers and agentic coding sessions. It must contain concise, current Markdown rather than copied chat transcripts.

| Path | Required purpose |
| --- | --- |
| `.agents/README.md` | Index explaining what each agent document contains and the order in which agents should read them. |
| `.agents/PROJECT_CONTEXT.md` | Short product summary, confirmed scope, source-of-truth hierarchy, key architecture, and non-goals. |
| `.agents/PLANNING_AND_APPROVAL.md` | The non-negotiable plan-first workflow, approval language, replanning rules, and authority boundaries. |
| `.agents/WORKFLOW.md` | Task lifecycle, branch/PR conventions, Driver/Reviewer model, status reporting, and integration process. |
| `.agents/QUALITY_GATES.md` | Required lint, typecheck, test, build, accessibility, security, and preview checks. |
| `.agents/TASK_TEMPLATE.md` | Standard template for an agent's proposed plan and approved implementation record. |
| `.agents/CURRENT_STATE.md` | Current milestone, completed work, active blockers, known failures, and next approved priorities. Keep it short and update it after material milestones. |
| `.agents/decisions/` | One short architecture decision record per material decision. Never silently overwrite decision history. |
| `.agents/tasks/` | Approved task plans and their final outcome/verification notes. Do not create a task file before the human approves the plan unless the human explicitly requests file-based planning. |
| `.agents/handoffs/` | Cross-session handoffs when unfinished work must continue in another session or with another agent. |

The root `AGENTS.md` should remain small. It should tell every agent to read, in order:

1. `AGENTIC_DEVELOPMENT_BRIEF_2026.md`;
2. `.agents/PLANNING_AND_APPROVAL.md`;
3. `.agents/CURRENT_STATE.md`;
4. the relevant approved task file; and
5. only the project skills relevant to the current task.

Do not duplicate the entire development brief into every `.agents` file. Summarize and link back to the authoritative section so documents do not drift.

### 8.2 Required `.skills/` project library

The `.skills/` directory contains reusable, project-specific procedures. It is not a substitute for the product brief, task plan, or human approval.

Each skill must live in its own directory and contain a complete `SKILL.md`. If the active coding environment supports skill metadata/frontmatter, use its documented format and give every skill a narrow trigger description. Do not assume every agent automatically discovers `.skills`; the root `AGENTS.md` must explicitly tell agents when and how to load applicable project skills.

Create these initial skills after the folder scaffold is approved:

| Skill | Responsibility |
| --- | --- |
| `.skills/project-planning/SKILL.md` | Turn a request into the required task breakdown, risk assessment, file-impact list, verification plan, and approval gate. |
| `.skills/design-system/SKILL.md` | Enforce Inter, the `#FFBA3A`/`#003089` palette, design tokens, responsive states, accessibility, and approved asset usage. |
| `.skills/sanity-cms/SKILL.md` | Apply dataset isolation, schema conventions, typed GROQ, image handling, validation, preview/revalidation, and production-safety rules. |
| `.skills/nextjs-feature/SKILL.md` | Implement a vertical route/feature slice using Server Components by default, typed data, error states, metadata, and tests. |
| `.skills/quality-review/SKILL.md` | Review a change against lint, types, tests, build, accessibility, responsive behavior, performance, security, and regression criteria. |
| `.skills/release-handover/SKILL.md` | Execute approved preview/release checks, backup verification, deployment, smoke testing, rollback readiness, and documentation handoff. |

Skill rules:

- A skill must describe a repeatable procedure, not contain temporary task status.
- Keep temporary plans under `.agents/tasks/`, not `.skills/`.
- Keep architectural decisions under `.agents/decisions/`, not inside a skill.
- Skills must reference this brief rather than redefining product requirements.
- Skills may tighten quality requirements but may not grant themselves permission to mutate production or bypass human approval.
- Use the smallest applicable set of skills for a task.
- Review skills when the architecture or workflow changes and record material changes through pull requests.

### 8.3 Bootstrap order for a future agent

The first agent working in the new repository must not immediately scaffold code. It must:

1. read this entire brief;
2. inspect the new workspace using read-only commands;
3. propose the root repository, `.agents/`, and `.skills/` file/folder breakdown;
4. show which files it intends to create and the purpose of each;
5. provide risks, assumptions, commands, and verification steps;
6. mark the proposal as `Awaiting human approval`; and
7. wait for a human to explicitly approve implementation.

After approval, create the instruction/workflow scaffold first, verify it, and then submit a second plan for application and Sanity scaffolding if that work was not already included in the approved scope.

## 9. Application architecture

### 9.1 Rendering

- Use Server Components by default.
- Fetch public Sanity content on the server.
- Use small client components only for interactive behavior such as the mobile menu, carousel, expandable program cards, and scoped animation.
- Avoid page-wide `"use client"` unless technically necessary.
- Render meaningful initial HTML for content, SEO, and resilience.
- Use route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` where appropriate.
- Use `notFound()` for missing publication or department slugs.

### 9.2 Data access

- Centralize Sanity clients, GROQ queries, query parameters, and result types.
- Never scatter query strings across presentation components.
- Use parameterized GROQ for dynamic values.
- Give every query an explicit cache/revalidation policy.
- Prefer one page-level payload over several duplicate browser requests.
- Do not request full Portable Text bodies for cards/list pages.
- Use server pagination or paginated queries for growing archives.
- Configure a Sanity webhook/on-demand revalidation flow if editors need fast publication updates.
- Validate CMS-provided external URLs before rendering them.

### 9.3 Navigation and slugs

- Use stable slugs rather than display names as URL identifiers.
- Slugs must be unique within their content type and term.
- Encode route parameters correctly.
- Maintain redirects when a published slug changes.
- Do not generate relative links whose behavior depends on trailing slashes or base paths.

### 9.4 Styling

- Translate the supplied design system into named CSS/Tailwind tokens.
- Treat Inter, `#003089`, and `#FFBA3A` as approved fixed brand foundations, not open design decisions.
- Avoid repeating arbitrary colors, spacing, radii, and shadows across components.
- Do not introduce another brand typeface or competing brand color without explicit human/client approval.
- Do not construct Tailwind class names dynamically in ways the compiler cannot detect.
- Build responsive behavior intentionally rather than scaling a desktop layout down.
- Test long Indonesian words, names, titles, and Portable Text content.
- Use normal document scrolling unless the approved experience truly requires an inner scroll container.
- Treat scroll snapping as progressive enhancement, especially on mobile.

### 9.5 Images and media

- Use approved source assets, not screenshots.
- Preserve original vectors for logos.
- Generate optimized AVIF/WebP/raster variants where appropriate.
- Never embed multi-megabyte base64 images inside JSX or SVG source.
- Provide correct `width`, `height`, `sizes`, crop, and quality behavior.
- Use Sanity image transformations instead of serving original uploads at every size.
- Require meaningful alt text for content images; use empty alt text only for truly decorative images.
- Lazy-load below-the-fold images and embedded videos.
- Provide a poster/thumbnail for video embeds.

## 10. Proposed Sanity model

The recovered 2025 schemas must be reviewed before finalizing this model. Prefer a normalized 2026 model rather than preserving inconsistent old names solely for compatibility.

### 10.1 Shared conventions

Every applicable document should have:

- a stable `_id` managed by Sanity;
- `term` or `year` set to `2026`, even if a separate dataset is used;
- an explicit display `order` where manual ordering matters;
- a stable unique `slug` for routed documents;
- publishing validation;
- image alt text and optional attribution;
- timestamps supplied by Sanity; and
- optional SEO overrides only where they add value.

Use deterministic singleton document IDs rather than queries ending in an arbitrary `[0]`.

### 10.2 Recommended document types

#### `siteSettings` singleton

- organization/site name;
- term/year;
- default SEO title and description;
- default Open Graph image;
- canonical site URL;
- navigation configuration if editors need it;
- official email/address;
- social links;
- FISIP Care Center URL; and
- footer/copyright configuration.

Suggested deterministic ID: `siteSettings-2026`.

#### `cabinetProfile` singleton

- cabinet name and tagline;
- overview/profile copy;
- profile-video URL and thumbnail;
- vision and explanatory points;
- missions;
- values;
- work-culture points;
- logo-philosophy items; and
- references to approved identity assets where editor control is needed.

Suggested deterministic ID: `cabinetProfile-2026`.

#### `program`

- name;
- slug;
- short description;
- cover image and alt text;
- owning organization unit;
- featured flag;
- display order;
- optional start/end dates; and
- optional approved external link.

#### `achievement`

- title;
- student/person name if approved;
- achievement/event details;
- date/year;
- image and alt text;
- approved social/external link;
- featured flag; and
- display order.

#### `pressRelease`

- title;
- slug if it has an internal detail page;
- image and alt text;
- publication date;
- external/Instagram link if applicable; and
- display order or featured state.

#### `publication`

- title;
- slug;
- category enum: `artikel` or `kajian`;
- author/byline;
- published date;
- excerpt;
- cover image and alt text;
- Portable Text body;
- approved Instagram/external link;
- optional SEO title/description/image; and
- optional featured flag.

Use one source of truth for category. Do not combine separate document `_type` values with a second contradictory `category` field.

#### `organizationUnit`

- official name;
- abbreviation;
- slug;
- unit kind/field;
- description;
- cover image and alt text;
- display order;
- gallery images with captions/alt text; and
- optional official contact/social links.

Programs and members should reference this document rather than duplicating its name.

#### `member`

- approved public name;
- role/position;
- organization-unit reference;
- photograph and alt text;
- display order;
- optional approved social link; and
- optional leadership/featured flag.

#### `studentAssociation`

- official Himpunan/Huria name;
- abbreviation;
- study program;
- supplied logo and alt text;
- official Instagram/website link; and
- display order.

### 10.3 Sanity environments

Recommended isolation:

```text
Sanity project owned by the client/institution
├── production          protected 2025 archive
├── production-2026     approved 2026 content
└── development-2026    optional development/test content
```

If plan limits make three datasets impractical, preserve a verified 2025 export and use at least a distinct 2026 dataset. Never insert 2026 singleton documents into the old unfiltered dataset while the 2025 site remains dependent on `[0]` queries.

### 10.4 Environment variables

Suggested public-web contract:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production-2026
SANITY_API_VERSION=
NEXT_PUBLIC_SITE_URL=
SANITY_REVALIDATE_SECRET=
```

Optional server-only variables for private datasets or preview mode:

```dotenv
SANITY_API_READ_TOKEN=
```

Suggested Studio contract:

```dotenv
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=development-2026
```

Rules:

- Commit `.env.example` with names and descriptions but no secret values.
- Never expose a read/write token with a `NEXT_PUBLIC_` prefix.
- Treat Studio-prefixed variables as visible to the Studio browser bundle; do not store secrets there.
- Configure production values in Vercel/Sanity deployment settings, not in Git.

## 11. Design implementation contract

Already available from the client:

- 2026 design system;
- Inter as the approved primary typeface;
- brand yellow `#FFBA3A`;
- brand blue `#003089`;
- BEM logo; and
- Himpunan/Huria logos.

### 11.1 Approved brand foundations

These values are confirmed requirements:

| Token | Value | Intended role |
| --- | --- | --- |
| `font-sans` / `--font-inter` | Inter | Body text, navigation, labels, buttons, headings, and display text unless an approved Figma component explicitly says otherwise |
| `brand-blue` / `--color-brand-blue` | `#003089` | Primary brand color, major backgrounds, navigation, primary controls, borders, and text on yellow/light surfaces |
| `brand-yellow` / `--color-brand-yellow` | `#FFBA3A` | Accent color, highlights, secondary controls, focus/active emphasis, and text on blue surfaces where appropriate |

Functional white, black, transparent overlays, and neutral grays are permitted for readability, surfaces, borders, disabled states, and media overlays. They are support colors, not additional brand colors. Semantic status colors may be added only when the interface genuinely needs success, warning, or error communication; they must be tokenized and accessible.

Recommended semantic mapping unless an approved Figma screen specifies otherwise:

```text
Primary page/background:       #003089
Primary text on blue:          #FFFFFF
Accent/highlight:              #FFBA3A
Text or icon on yellow:        #003089
Primary action on light:       #003089 with white text
Secondary/accent action:       #FFBA3A with #003089 text
Focus indicator on blue:       #FFBA3A
Focus indicator on light:      #003089
```

Measured WCAG contrast for the approved colors:

| Combination | Contrast | Usage decision |
| --- | ---: | --- |
| `#003089` and white | 11.77:1 | Strong contrast; acceptable for normal text |
| `#003089` and `#FFBA3A` | 6.92:1 | Passes WCAG AA for normal text and AAA for large text |
| `#FFBA3A` and white | 1.70:1 | Fails for text; do not use white text on yellow or yellow text on white |
| `#FFBA3A` and black | 12.34:1 | Strong contrast, but prefer brand blue on yellow when it matches the design |

Do not rely on color alone to communicate state. Active navigation, form errors, selected filters, and focus must also use shape, text, iconography, underline, or another non-color signal.

### 11.2 Inter implementation requirements

- Inter is the default and only brand font unless the client later approves an exception.
- Load it through `next/font` so it is optimized and self-hosted by the built application.
- Prefer the variable font or only the weights actually used by the design.
- Expected working weights are 400, 500, 600, 700, and optionally 800; do not download unused families/weights.
- Expose the font using a CSS variable and map Tailwind's sans family to it.
- Apply the variable to the root layout so all routes and portals inherit it.
- Use a system sans-serif fallback.
- Do not repeat `font-family` declarations in individual components.

Reference implementation shape:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

If the project later receives an approved local Inter file, `next/font/local` may replace the Google-font import for more deterministic offline builds. The resulting CSS variable and visual behavior must remain the same.

### 11.3 Token implementation requirements

- Define the two brand colors once in the design-token/theme layer.
- Components must consume semantic tokens such as `bg-brand-primary`, `text-on-brand`, or equivalent project conventions rather than repeatedly typing hex values.
- Derived opacity, hover, and surface treatments must be systematic and documented.
- Do not generate unrelated gradients or decorative hues unless present in the client-approved design.
- Verify hover, active, disabled, focus, selected, loading, empty, and error states in both light and brand-blue contexts.
- Add a small design-system reference route or Storybook only if the team approves its maintenance cost. At minimum, fixture pages/tests must exercise the shared primitives.
- The `.skills/design-system/SKILL.md` procedure must cite these fixed values and include a check that no unapproved fonts or brand colors were introduced.

Still required or to be verified before final UI acceptance:

- direct Figma developer/inspect access;
- desktop, tablet, and mobile compositions;
- navigation-open state;
- hover, focus, active, and disabled states;
- loading, empty, error, and 404 states;
- long-content and missing-image behavior;
- motion duration/easing and reduced-motion behavior;
- vector, dark, light, monochrome, favicon, and sharing-image variants where needed; and
- named client reviewer for resolving design ambiguities.

If complete page designs are not ready, build reusable primitives and CMS integration first. Do not invent a final visual direction that conflicts with the supplied system.

## 12. Accessibility requirements

Target WCAG 2.2 AA for the implemented experience.

At minimum:

- correct Indonesian document language;
- semantic landmarks and heading order;
- keyboard-operable menus, cards, carousels, dialogs, and controls;
- visible focus states;
- accessible names and state attributes for controls;
- sufficient color contrast;
- no information available only on hover;
- meaningful image alternatives;
- reduced-motion support;
- pausable carousel autoplay or no autoplay when inappropriate;
- skip-to-content behavior;
- focus management for menus and route transitions; and
- content that remains readable at 200% zoom and narrow widths.

Accessibility should be implemented with each component, not postponed until the end.

## 13. SEO and discoverability

- Use route-specific Next.js metadata.
- Generate title, description, canonical URL, Open Graph, and social-preview data.
- Generate metadata from Sanity for publications and organization units.
- Provide `sitemap.xml` and `robots.txt` using Next.js route conventions.
- Return real 404 status/pages for missing content.
- Preserve or redirect old public URLs.
- Add appropriate structured data for the organization and publications when content supports it.
- Do not index preview deployments or private draft previews.
- Connect the final domain to Search Console if the client uses it.

## 14. Security and privacy requirements

- Do not commit secrets, tokens, exported private data, or personal credentials.
- Obtain access through invitations rather than shared passwords.
- Use least-privileged Sanity roles for content editors.
- Require explicit approval before creating or changing datasets, tokens, CORS origins, webhooks, deployments, DNS, or production content.
- Parameterize GROQ queries.
- Validate CMS-provided external URLs and embed origins.
- Use `rel="noopener noreferrer"` for applicable external links.
- Add an intentional Content Security Policy and other security headers compatible with Sanity images and approved video embeds.
- Review production dependencies and resolve unreviewed critical/high advisories before launch.
- Keep the lockfile committed and use `npm ci` in CI.
- Obtain and record approval/consent for published names and photographs.
- Implement analytics/cookies only after the client defines the privacy requirement.

## 15. Performance expectations

The inherited `/about` route loaded approximately 1.36 MB of first-load JavaScript because of client-heavy rendering and an embedded base64 logo. The new version must materially improve this.

Targets and practices:

- No multi-megabyte source asset embedded in JavaScript/JSX.
- Keep client components and route-specific client JavaScript minimal.
- Target Core Web Vitals in the “good” range on representative production traffic: LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 at the 75th percentile.
- Establish and report route-level bundle sizes in CI or release checks.
- Avoid original multi-megabyte images when a smaller rendition is displayed.
- Lazy-load below-the-fold images, video, and noncritical interactive code.
- Use caching and revalidation rather than repeated client fetch loops.
- Do not allow decorative animation to block content or input.
- Test on a mid-range Android device and throttled mobile network, not only a development laptop.

If a target cannot be met because of an approved experience, document the measurement, cause, tradeoff, and client acceptance.

## 16. Error and edge-state requirements

Every CMS-backed area must define behavior for:

- initial loading;
- empty list;
- missing optional fields;
- missing required document;
- invalid or changed slug;
- missing/broken image;
- Sanity timeout/network failure;
- malformed external URL;
- very long title/body;
- zero, one, or many carousel items; and
- unpublished/draft content.

Never leave a visitor on an infinite spinner. Preserve usable navigation and a retry or recovery path when appropriate.

## 17. Testing and validation

### 17.1 Required automated checks

Every pull request should run:

```text
npm ci
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Required test coverage should focus on behavior rather than implementation details:

- header navigation and mobile menu;
- all public routes return the expected status;
- old-route redirects;
- publication and department 404 handling;
- Sanity query mapping with representative fixtures;
- publication pagination;
- external-link safety;
- empty and error states;
- interactive cards and carousels by keyboard;
- responsive smoke tests;
- reduced-motion behavior; and
- automated accessibility smoke tests for primary routes;
- design-token checks or focused review confirming Inter and the approved brand palette remain the only brand foundations; and
- agent-workflow integrity checks confirming every indexed project skill has a `SKILL.md` and every required path referenced by `AGENTS.md`/`.agents/README.md` exists.

### 17.2 Manual release matrix

Before production:

- current Chrome, Firefox, and Safari;
- iOS Safari and Android Chrome;
- small phone, tablet, laptop, and wide desktop;
- keyboard-only navigation;
- screen-reader smoke test;
- 200% zoom;
- reduced-motion preference;
- slow network and disabled-cache testing;
- social-sharing preview;
- Sanity publish-to-site revalidation;
- every official social/contact link; and
- production domain, HTTPS, sitemap, robots, 404, and redirects.

## 18. Git and delivery workflow

For the two-person development team:

- `main` must always be releasable and should deploy to production.
- Use short-lived branches such as `feat/home-programs`, `feat/sanity-publication`, and `fix/mobile-menu`.
- Open a focused pull request for each change.
- The other developer reviews before merge.
- Require CI checks before merge.
- Use Vercel preview deployments for design/client review.
- Prefer squash merge with a descriptive conventional commit.
- Tag the accepted release, for example `2026-launch`.
- Keep architecture decisions in short records under `docs/decisions/`.
- Do not use a long-lived `development` branch unless the team has a specific workflow requiring it.

Do not deploy production, change DNS, migrate/delete CMS content, or rotate shared credentials without explicit authorization and a rollback plan.

## 19. Migration plan from 2025

### Phase 0: preserve and gain access

- Confirm the approved parity checklist.
- Obtain Sanity Administrator access and the old Studio/schema source.
- Export and verify a 2025 dataset backup.
- Obtain Vercel, GitHub, and domain ownership contacts/access.
- Record the existing production URL and configuration.
- Approve the 2026 repository and dataset strategy.

### Phase 1: create the clean foundation

- Create the institution-owned repository after explicit authorization.
- Before scaffolding application code, inspect the new repository read-only, present the proposed root `AGENTS.md`, `.agents/`, and `.skills/` structure as a task breakdown, and wait for explicit human approval.
- After approval, create the agent-workflow foundation described in Section 8 and record the initial project context, quality gates, and current state.
- Scaffold supported stable web and Studio applications.
- Pin runtime/tool versions.
- Add environment validation, CI, testing, documentation, and preview deployment.
- Translate the supplied design system into code tokens.

### Phase 2: establish the content platform

- Review/recover old schemas.
- Implement and validate the 2026 content model.
- Create the approved 2026 dataset only after authorization.
- Add fixtures, typed queries, previews if required, and revalidation.
- Confirm editor roles and publishing workflow.

### Phase 3: migrate vertical route slices

Recommended order:

1. Shared layout, header, footer, theme, metadata, errors.
2. Home profile/video and featured programs.
3. Mapres, press releases, and latest publications.
4. About identity, values, leadership, and organization units.
5. Organization-unit detail, programs, members, and gallery.
6. Publication archive and detail.
7. Himpunan/Huria directory.
8. Motion and scroll enhancements after static behavior is correct.

### Phase 4: content and client review

- Editors enter evolving 2026 content through Studio.
- Review responsive behavior with real long and short content.
- Verify asset rights, names, links, order, alt text, and consent.
- Resolve design differences through the named client reviewer.

### Phase 5: release

- Pass automated and manual checks.
- Re-run dependency/security review.
- Verify the CMS backup and rollback path.
- Perform approved domain cutover.
- Monitor errors, links, performance, and publication workflow.
- Tag the release and complete operational handover.

## 20. Minimum external inputs required

Development can begin with fixtures, but the project cannot safely complete without:

1. Sanity Administrator access.
2. Sanity Studio and schema source.
3. A verified 2025 dataset backup.
4. Approval for an isolated 2026 dataset.
5. Approval and ownership for the new GitHub repository.
6. Vercel access and a domain/DNS owner or operator.
7. An approved feature and route matrix.
8. Figma developer access with responsive and component-state guidance.
9. Confirmed usage rights and source files for all remaining assets; Inter and the client-supplied logos are already approved project inputs.
10. Named reviewers and a target launch date.

Do not ask the client to finish all copy before engineering. Use fixtures and make the CMS/editor workflow production-ready.

## 21. Responsibility split

### Client/institution owns

- official requirements and scope approval;
- design system and brand approval;
- account ownership and invitations;
- content accuracy and publication approval;
- rights/consent for names, photos, fonts, and other assets;
- domain, hosting, and service budget decisions;
- final acceptance and launch authorization; and
- nomination of the long-term owner.

### Development team owns

- application and CMS architecture;
- supported dependency selection;
- schema implementation and typed query layer;
- responsive and accessible UI implementation;
- image/media optimization;
- error handling and revalidation;
- repository, review, CI/CD, and testing setup;
- security remediation;
- performance measurement;
- technical documentation;
- deployment and rollback implementation after approval; and
- final technical handover.

## 22. Agent operating rules

### 22.1 Mandatory plan-first approval gate

Every agentic task must begin with repository discovery and a written task breakdown. The agent must present the plan to a human in chat and receive explicit approval **before making any change**.

Before approval, an agent may only perform read-only discovery needed to create an informed plan, including reading files, searching the repository, inspecting Git status/history, and running commands that do not modify files, dependencies, services, or external state.

Before approval, an agent must not:

- create, edit, move, rename, or delete files or folders;
- scaffold applications, generate code, or run formatters that write changes;
- install, remove, or upgrade packages, or change a lockfile;
- create commits, branches, tags, pull requests, repositories, or GitHub settings;
- create or mutate Sanity projects, datasets, schemas, documents, users, roles, tokens, or webhooks;
- create or change deployments, environment variables, domains, DNS, analytics, or other external services; or
- perform any production mutation, even if it appears reversible.

Every proposed implementation plan must contain:

1. The task objective and expected user-visible or operational outcome.
2. Known facts, assumptions, and any questions that materially affect the work.
3. In-scope and explicitly out-of-scope work.
4. The files, folders, packages, schemas, routes, or services expected to change.
5. An ordered task breakdown, including dependencies and sensible checkpoints.
6. Design-system, accessibility, content-model, Sanity, security, and migration implications where relevant.
7. Risks, data-safety considerations, and the rollback or recovery approach.
8. The automated and manual verification that will prove the task is complete.
9. Any external-state change, credential, access, cost, or additional authority required.
10. The final status line: **Awaiting human approval**.

Approval must be explicit, such as “Approved,” “Proceed,” or a clearly scoped equivalent from an authorized human project maintainer. Silence, an unanswered plan, general discussion, or approval of only one choice does not approve the complete plan. Client-owned production changes still require the relevant client/institution authority, even when a developer has approved the implementation plan.

After approval, the agent may implement only the approved scope. If discovery reveals a material change to architecture, scope, data, cost, external state, security, or the agreed task breakdown, the agent must stop, explain the change, provide a revised plan, and request approval again. Small implementation details that do not change approved scope may be handled autonomously and reported in the completion summary.

If a human asks only for analysis, diagnosis, review, or a plan, the agent must not infer permission to implement. At completion, the agent must report the files and systems changed, verification performed and its results, deviations from the approved plan, and any remaining risks or follow-up work.

Plans should normally be proposed in chat first. After approval, durable task records may be created under `.agents/tasks/` using `.agents/TASK_TEMPLATE.md`. Do not create a plan file before approval unless the human explicitly requests a file-based plan.

### 22.2 General implementation rules

Any coding agent working from this brief should:

1. Read this entire document and the repository instruction chain before proposing or changing code.
2. Inspect the current repository state and preserve unrelated user work.
3. Treat the inherited 2025 code as read-only reference unless explicitly tasked to patch it.
4. Prefer small vertical, testable changes over a large unverified rewrite.
5. Use fixtures when content or external access is unavailable.
6. Keep business content out of components.
7. Use Server Components by default and justify client boundaries.
8. Reuse the supplied design system and assets; do not invent replacements without approval.
9. Document material assumptions and architecture decisions.
10. Verify lint, typecheck, tests, and build before declaring implementation complete.
11. Report existing failures separately from failures caused by the current change.
12. Never expose credentials or print secret environment values.
13. Never mutate production Sanity, deployments, DNS, GitHub settings, or external accounts without explicit authority.
14. Never delete or overwrite 2025 content as part of migration.
15. Stop and request a decision only when an unresolved choice would materially change scope, data, ownership, or production state.

## 23. Definition of ready

A feature is ready for implementation when:

- its user outcome is understood;
- its task breakdown has been presented and explicitly approved by an authorized human;
- the relevant project skills and instruction files have been identified;
- its design or approved design-system composition exists;
- its CMS fields and required/optional behavior are defined;
- fixture content covers normal and edge cases;
- responsive, interactive, loading, empty, and error behavior are known; and
- no unresolved choice could cause a materially different architecture.

## 24. Definition of done

The 2026 website is complete only when:

- every implemented task is within an approved plan, and every material deviation was re-approved;
- every client-approved parity feature works;
- the approved Inter typography and `#FFBA3A`/`#003089` design tokens are implemented consistently and pass the documented contrast rules;
- the new repository and production services have institutional ownership;
- the 2025 site/data remains recoverable;
- 2026 content is isolated and cannot mix accidentally with 2025;
- editors can update periodic copy and repeatable content through Sanity;
- the Studio schemas are versioned in the same owned repository;
- `main` passes clean install, lint, typecheck, tests, and production build in CI;
- no unreviewed critical/high production vulnerabilities remain;
- routes provide useful server-rendered HTML, metadata, errors, and 404s;
- there are no placeholder links, infinite loaders, blank mandatory sections, or case-sensitive missing assets;
- responsive, keyboard, accessibility, reduced-motion, and browser checks pass;
- performance targets are measured and met or explicitly accepted;
- domain, HTTPS, redirects, sitemap, robots, sharing previews, and revalidation work;
- production CMS and application backups exist;
- rollback has been rehearsed or clearly documented;
- applicable `.agents/tasks/`, `.agents/CURRENT_STATE.md`, decision records, and handoff notes reflect the final implementation state; and
- README, deployment, editorial, maintenance, and annual handover instructions are complete.

## 25. Open decisions to track

Do not silently guess these. Record answers as they are approved:

- Final repository owner and URL.
- Whether web and Studio use one repository/workspaces as recommended.
- Sanity project/dataset names and plan limits.
- Whether a separate development dataset will be maintained.
- Final public domain and 2025 archive location.
- Whether existing public routes remain canonical or redirect to new Indonesian route names.
- Exact page designs and responsive/motion states.
- Analytics/Search Console requirements.
- Publication preview and scheduled-publishing requirements.
- Target launch date, review cadence, and final approver.
- Long-term post-launch and end-of-term owner.

## 26. Legacy reference warning

The inherited 2025 application successfully demonstrates the intended feature family, but it also contains known issues: stale Git branch structure, missing Studio schemas, unisolated annual content, repeated Sanity fetch loops, client-heavy rendering, lint failures, vulnerable dependencies, placeholder footer links, incomplete error states, and a megabyte-scale embedded logo component.

Preserve the experience the client values. Do not preserve these defects.
