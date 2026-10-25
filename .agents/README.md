# Agent workflow index

This directory stores durable project context and workflow records. Keep it concise and current; do not paste chat transcripts here.

## Read in this order

1. ../docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md — authoritative product and engineering brief.
2. PLANNING_AND_APPROVAL.md — mandatory approval gate and authority boundaries.
3. CURRENT_STATE.md — current repository facts, blockers, and next priorities.
4. The relevant approved file in tasks/ — task-specific scope and verification.
5. Only the relevant procedure listed in ../.skills/README.md.

For frontend/UI work, also read `../PRODUCT.md`, `../DESIGN.md`, and `skills/impeccable/SKILL.md`; then run the Impeccable context script once as directed by that skill.

The historical `../docs/2026_PREPARATION_AND_HANDOVER.md` is absent from this checkout. Current 2026 operations are documented in `../docs/panduan/`; obtain the original handover if an inherited-system task requires it.

## Files

- PROJECT_CONTEXT.md — compact product, architecture, scope, ownership, and source-of-truth context.
- PLANNING_AND_APPROVAL.md — rules for discovery, plans, approval, replanning, and external authority.
- WORKFLOW.md — task lifecycle, Git/PR conventions, review, status, and handoff.
- QUALITY_GATES.md — current and target verification requirements.
- TASK_TEMPLATE.md — required structure for approved task records.
- CURRENT_STATE.md — short living status document.
- decisions/ — material architecture and operational decisions.
- tasks/ — approved plans plus implementation and verification outcomes.
- handoffs/ — restartable records for unfinished work.
- skills/impeccable/ — project-local Codex UI design and quality skill installed from Impeccable.
- ../.codex/hooks.json — project hook manifest for post-edit and Stop design detection; each user must review and trust it in Codex.
- ../.impeccable/config.json — shared detector and hook settings; manage hook settings through Impeccable's administration script.
- ../PRODUCT.md and ../DESIGN.md — durable product truth and current confirmed visual constraints consumed by Impeccable.

## Maintenance

- Update CURRENT_STATE.md after a material milestone, blocker change, or approved priority change.
- Create a task record only after plan approval unless a human explicitly requests file-based planning.
- Add a decision record only for a durable choice with meaningful alternatives or consequences.
- Add a handoff only when work will continue in another session or with another person/agent.
- Keep product requirements in the development brief and link to them instead of duplicating them.
