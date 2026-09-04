# Product

<!-- impeccable:product-schema 1 -->

This record was initialized from the user-approved 2026 development brief and the 2025 preparation/handover report. Open decisions remain explicitly marked rather than inferred.

## Platform

web

## Users

- FISIP Unpad students seeking official information, programs, publications, achievements, organization contacts, or support links.
- Prospective students, the wider university community, organizational partners, and members of the public evaluating BEM FISIP Unpad 2026.
- Authorized BEM content editors who maintain periodically changing institutional content through Sanity Studio.

## Product Purpose

The official public company-profile and publication website for BEM FISIP Unpad 2026. It should explain the cabinet's identity and organization, present its people, values, programs, and achievements, publish articles and kajian, and connect visitors to official organization units and channels.

Success means visitors can find trustworthy, current information on mobile and desktop while future BEM teams can maintain both the website and its content without inheriting the 2025 system's operational debt.

## Positioning

This is an annual institutional record and publishing surface, not a generic student-organization landing page. It joins the cabinet's official identity, organizational structure, programs, achievements, publications, and verified outbound channels with a CMS and handover model designed for the 2026 term.

## Operating Context

- Public visitors browse Indonesian-first pages without accounts, payments, or an internal member portal.
- Editors draft, review, and publish repeatable content in Sanity Studio; the Next.js application renders the public experience.
- The implementation is a controlled migration of the approved 2025 feature family into a clean 2026 foundation, not a line-for-line copy.
- The 2025 site and data must remain recoverable throughout the annual transition.

## Capabilities and Constraints

- Preserve the approved home, about, publication archive/detail, Himpunan/Huria directory, and department/bureau detail capabilities unless the client explicitly waives or changes them.
- Support responsive navigation, rich publications, organization and leadership content, programs, achievements, media, galleries, official links, and complete loading, empty, error, and not-found behavior.
- Keep editable institutional copy and repeatable content in Sanity wherever practical; use clearly identified fixtures until final content is approved.
- Isolate 2026 content from 2025 content. Dataset/project topology, canonical route changes, hosting, analytics, launch timing, and long-term ownership remain open decisions.
- Complete Figma responsive, interaction, and motion states remain required before final UI acceptance.

## Brand Commitments

- Product name: BEM FISIP Unpad 2026 company profile.
- Primary website language: Indonesian unless a bilingual experience is later approved.
- The client-provided 2026 Figma/design system and approved asset package are the visual authority.
- Inter is the required primary and default typeface.
- Brand blue `#003089` and brand yellow `#FFBA3A` are the approved brand-color foundations.
- The supplied BEM and Himpunan/Huria logos are approved inputs; source vectors and usage variants still need to be verified where absent.

## Evidence on Hand

- Product, engineering, content, accessibility, and operating requirements: `docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md`.
- 2025 feature inventory, audit evidence, migration risks, and CMS history: `docs/2026_PREPARATION_AND_HANDOVER.md`.
- Current application code is only the default Create Next App scaffold and is not visual or product authority.
- Final copy, complete responsive Figma states, recovered 2025 Sanity schemas, verified dataset backup, and production ownership/access are not yet present in this repository; future work must not fabricate them.

## Product Principles

- Official information and content truth outrank decoration or novelty.
- Preserve approved user-facing capability while replacing unsafe or unmaintainable implementation choices.
- Make annual content changes editor-manageable and the next team able to recover, understand, and operate the system.
- Build accessibility, responsive behavior, resilience, and performance into each feature rather than treating them as launch cleanup.
- Keep production authority, content approval, and annual data isolation explicit and reviewable.

## Accessibility & Inclusion

Target WCAG 2.2 AA. The experience must use the correct Indonesian document language, semantic structure, keyboard-operable controls, visible focus, sufficient contrast, meaningful image alternatives, reduced-motion support, non-hover-only information, and content that remains usable at 200% zoom and narrow mobile widths.
