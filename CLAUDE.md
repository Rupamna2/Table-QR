## Application Building Context — TableQR Pro

Read the following files in order before implementing
or making any architectural decision:

1. `context/project-overview.md` — product definition,
   goals, features, and scope
2. `context/architecture.md` — system structure,
   boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography,
   and component conventions
4. `context/code-standards.md` — implementation rules
   and conventions
5. `context/ai-workflow-rules.md` — development workflow,
   scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase,
   completed work, open questions, and next steps
7. `context/feature-specs/00-build-plan.md` — the ordered
   sequence of feature units and their dependencies

## Non-Negotiables

- This is a spec-driven build. Do not invent product
  behavior. If a feature is not in `project-overview.md`
  or a numbered feature-spec file, it is out of scope
  until specified.
- Work strictly one feature unit at a time, in the order
  defined by `00-build-plan.md`.
- Do not skip ahead to a later unit because it seems easy
  or related — dependency order exists to prevent rework.

Update `context/progress-tracker.md` after each
meaningful implementation change.

If implementation changes the architecture, scope, or
standards documented in the context files, update the
relevant file before continuing.
