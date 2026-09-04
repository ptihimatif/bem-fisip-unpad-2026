# Development workflow

## Task lifecycle

1. Discover — read instructions and inspect relevant repository state without mutations.
2. Plan — define scope, impacts, risks, checkpoints, and proof of completion.
3. Approve — wait for explicit human approval.
4. Record — create the approved task file from TASK_TEMPLATE.md.
5. Implement — make the smallest complete vertical change within scope.
6. Verify — run proportionate automated and manual checks.
7. Review — inspect the diff, regressions, edge states, and authority boundaries.
8. Close — update the task outcome and CURRENT_STATE.md.
9. Handoff — add a restartable handoff when work remains for another session.

## Git and integration

- Keep main releasable and use short-lived branches for focused work.
- Use one pull request per coherent task.
- For the two-person team, one person drives and the other reviews before merge.
- Prefer squash merges with descriptive conventional commit messages.
- Require applicable quality gates before merge.
- Use preview deployments for design/client review when configured.
- Do not create or change branches, commits, pull requests, protection rules, or deployments unless they are inside an approved task.
- Do not use a long-lived development branch unless the team deliberately records that decision.

## Task records

- Filename: YYYY-MM-DD-short-task-name.md.
- Store the approved plan, exact approval, implementation summary, verification results, deviations, and follow-ups.
- Keep status factual: proposed, approved, in-progress, blocked, or complete.
- Do not mark complete while required work or verification remains.

## Decisions

Create a decision record when a choice has durable architectural, data, operational, security, cost, or migration consequences. Do not rewrite previous decisions; add a superseding record.

Examples include package manager, workspace topology, Sanity dataset strategy, canonical routes, preview architecture, analytics, and production hosting.

## Status and handoffs

- Keep CURRENT_STATE.md short enough to read at the start of every task.
- Report blockers with the exact missing decision, authority, access, or evidence.
- A handoff must identify the approved scope, completed work, remaining steps, repository state, verification already run, and the safest next action.
- Never include secrets or copied credentials in any record.
