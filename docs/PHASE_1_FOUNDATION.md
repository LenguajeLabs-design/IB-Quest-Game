# Phase 1 Foundation

Status: implementation foundation; not pilot approved  
Runtime: Node.js `24.21.0`  
Package manager: pnpm `11.25.0`

## Purpose

This milestone creates a reproducible, reviewable base for the IB Quest MVP. It establishes the toolchain, automated quality gates, content-validation seam, and deployment-path check needed before the interactive Home vertical slice is treated as ready for formative testing.

This milestone does not resolve curriculum, safeguarding, branding, device, language, hosting, or offline-product decisions. It also does not replace testing on a physical iPad.

## Foundation contract

A clean checkout must be able to:

1. Install exactly from `pnpm-lock.yaml` using the pinned Node and pnpm versions.
2. Start the local Vite development server.
3. Run formatting, lint, type, content, unit/coverage, and production-build checks through `pnpm check`.
4. Build successfully with the GitHub Pages base path `/IB-Quest-Game/`.
5. Run the `ipad-webkit` Playwright project against a production build.

PWA and service-worker dependencies must not be added until installability and offline scope are approved.

## Automated pull-request gates

### Quality job

The required `quality` job runs `pnpm check`, which covers:

- Prettier verification
- Oxlint with warnings treated according to repository configuration
- Strict TypeScript compilation
- Zod-backed content validation
- Vitest coverage
- Production build validation from the repository subpath

### Playwright WebKit job

The required `playwright-webkit` job:

- Installs the Playwright WebKit binary and Linux system dependencies.
- Runs only the `ipad-webkit` project.
- Uses the production Vite server configured in `playwright.config.ts`.
- Uploads the HTML report and test results only when the job fails.

Initial browser tests should prove that the app loads without an uncaught error, exposes meaningful landmarks and accessible names, supports keyboard focus, and has no serious or critical automated axe findings. Phase-specific journeys should be added with each feature rather than deferred to the end.

Playwright traces, reports, screenshots, and fixtures must never contain real learner data.

### Dependency review

Every pull request receives a dependency review that fails when a newly introduced dependency has a known vulnerability of moderate severity or higher. This check depends on the GitHub dependency graph being enabled.

GitHub Actions are referenced by immutable commit SHA. Workflows use read-only repository permissions, bounded timeouts, frozen lockfile installs, no privileged pull-request trigger, and no repository secrets.

## Repository settings required outside code

An administrator must configure these controls in GitHub:

- Enable the dependency graph.
- Enable Dependabot alerts and Dependabot security updates.
- Enable secret scanning and push protection where the repository plan supports them.
- Enable CodeQL default setup for JavaScript/TypeScript when available.
- Protect `main` and require `quality`, `playwright-webkit`, and `dependency-review` before merge.
- Require pull-request review and dismiss stale approvals after security- or workflow-sensitive changes.
- Restrict workflow permissions to read-only by default and approve only the actions used by this repository.

Do not use automated `audit fix --force`; review dependency updates and their lockfile changes explicitly.

## Unresolved product and release gates

These decisions remain open and must be recorded by their accountable owners. Temporary defaults in `DEVELOPMENT_PLAN.md` are planning assumptions, not approvals.

| Gate                                                  | Required owner                                    | Why it blocks later work                                          |
| ----------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| Exact year levels and PYP-only scope                  | Product and curriculum lead                       | Determines reading level and pilot cohort                         |
| School inquiry-cycle labels and wording               | School curriculum lead                            | Required before map labels and content are locked                 |
| First home language and human reviewer                | School language lead                              | Required before translated content can be approved                |
| Oldest iPad model and Safari/iPadOS floor             | School technology lead                            | Determines browser target and device test matrix                  |
| Dedicated, shared, or class device model              | Technology and safeguarding leads                 | Shared devices cannot use an unprotected single local profile     |
| Anonymous identity or approved local nickname         | Product and safeguarding leads                    | Determines what may be stored and shown when projected            |
| Working title and use of IB terminology               | School leadership or brand/legal owner            | Prevents an implication of affiliation or endorsement             |
| Hosting target                                        | Technical lead and school technology lead         | Determines routing, headers, logging, and deployment controls     |
| Installable/offline PWA scope                         | Product and technical leads                       | Determines service-worker, caching, update, and offline test work |
| Second mission and learning objective                 | Curriculum lead                                   | Required to prove renderer reuse without speculative abstractions |
| Narration source, artwork ownership, and usage rights | Product/content and design leads                  | Unapproved assets cannot enter a pilot build                      |
| Pilot cohort, consent/assent, and evidence protocol   | School, research, privacy, and safeguarding leads | No child testing may begin without authorization                  |

## Physical iPad release gate

Linux Playwright WebKit is not branded Safari and cannot reproduce every iPadOS media, accessibility, storage, or lifecycle behavior. Before each pilot build, test on the school’s oldest supported physical iPad in landscape orientation.

Required checks:

- Launch, routing, reload, and return from background state
- Touch targets, scrolling, safe areas, orientation, and on-screen keyboard behavior
- User-initiated audio playback, pause/replay, captions, transcripts, and failed-media fallback
- VoiceOver reading order, control names, current state, and feedback announcements
- Visible keyboard focus when an external keyboard is used
- Text zoom/size, long strings, bilingual layouts, contrast, and reduced motion
- Local progress save, refresh, relaunch, corrupt-state recovery, and confirmed reset
- Projection/teacher mode at realistic classroom distance when implemented
- Installation, explicit offline-ready state, cached audio, updates, and offline completion only if PWA scope is approved

Record the tested device model, iPadOS/Safari version, build commit, tester, date, failures, and outcome. CI may be green while this gate remains failed or untested.

## Exit checklist

- [ ] A clean checkout installs with Node `24.21.0`, pnpm `11.25.0`, and `pnpm install --frozen-lockfile`.
- [ ] `pnpm check` passes locally and in GitHub Actions.
- [ ] The `ipad-webkit` Playwright project passes in GitHub Actions.
- [ ] GitHub Pages subpath assets resolve from the production build.
- [ ] Required repository security settings and branch protections are enabled.
- [ ] Each unresolved gate has an owner and recorded decision date.
- [ ] The target physical iPad and supported iPadOS/Safari floor are recorded.
- [ ] A physical-iPad test record exists before the build is described as pilot ready.
- [ ] The child-pilot privacy and safeguarding authorization is complete before any student session.
