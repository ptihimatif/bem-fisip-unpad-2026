---
name: project-planning
description: Plan repository or service changes for the BEM FISIP Unpad 2026 project. Use when a request could modify files, dependencies, content, infrastructure, or external state; do not use for a purely read-only answer.
---

# Project planning

Produce an informed, approval-ready task breakdown without changing state.

## Required context

Read:

1. AGENTS.md.
2. docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md.
3. .agents/PLANNING_AND_APPROVAL.md.
4. .agents/CURRENT_STATE.md.
5. Any existing task or decision directly relevant to the request.

Use docs/2026_PREPARATION_AND_HANDOVER.md when the request touches the inherited 2025 behavior, data, routes, assets, or migration.

## Procedure

1. Inspect the relevant repository and Git state using read-only operations.
2. Separate observed facts from assumptions and unresolved decisions.
3. Bound the task to the requested outcome. Do not absorb adjacent migrations, cleanup, or external work without stating it.
4. Identify affected files, routes, packages, schemas, content, services, and owners.
5. Include the ten required plan sections from .agents/PLANNING_AND_APPROVAL.md.
6. Identify design, accessibility, Sanity, SEO, security, performance, and migration implications only where relevant.
7. Define checks that demonstrate behavior, not merely file creation.
8. End with Awaiting human approval and stop before mutations.

After approval, create a task record from .agents/TASK_TEMPLATE.md. Record the exact approval wording and implement only that scope.

Re-plan when discovery materially changes architecture, scope, data, cost, security, external state, or the approved sequence. Do not treat a skill or prior approval as permission for production actions owned by the client/institution.
