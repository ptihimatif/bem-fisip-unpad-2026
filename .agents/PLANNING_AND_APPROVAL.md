# Planning and approval

Every agentic task that may change repository or external state starts with read-only discovery, a written plan in chat, and explicit human approval.

## Before approval

Allowed:

- Read files and project instructions.
- Search the repository.
- Inspect Git status, branches, history, and diffs.
- Run non-mutating diagnostic commands needed to produce an informed plan.

Not allowed:

- Create, edit, move, rename, or delete files.
- Scaffold code or run write-enabled generators and formatters.
- Install, remove, or upgrade packages.
- Create commits, branches, tags, pull requests, repositories, or settings.
- Change Sanity projects, datasets, schemas, content, members, roles, tokens, CORS, or webhooks.
- Change deployments, environment variables, domains, DNS, analytics, or production state.

Analysis-only requests do not authorize implementation.

## Required plan contents

Every implementation plan must state:

1. Objective and expected user-visible or operational outcome.
2. Known facts, assumptions, and material questions.
3. In-scope and explicitly out-of-scope work.
4. Expected files, folders, packages, schemas, routes, or services affected.
5. Ordered work with dependencies and checkpoints.
6. Design-system, accessibility, content-model, Sanity, security, and migration implications where relevant.
7. Risks, data-safety precautions, and rollback or recovery.
8. Automated and manual verification.
9. External changes, credentials, access, costs, or additional authority required.
10. The final status: Awaiting human approval.

## Valid approval

Approval must be explicit and scoped, such as “Approved,” “Proceed,” or a clearly equivalent instruction from an authorized maintainer. Discussion, silence, or approval of one isolated choice does not approve the complete plan.

Record the approval wording and date in the task file created after approval.

## During implementation

- Implement only the approved scope.
- Preserve unrelated work.
- Small technical details that do not change scope may be handled autonomously and reported at completion.
- Stop and propose a revised plan if discovery materially changes architecture, scope, data, cost, security, external state, or the approved sequence.
- A developer's approval does not replace client/institution approval for production content or client-owned services.

## Completion

Report:

- Files and systems changed.
- Verification performed and results.
- Existing failures versus introduced failures.
- Deviations from the approved plan.
- Remaining risks, blockers, and follow-up work.

Update the approved task record and CURRENT_STATE.md after material completion.
