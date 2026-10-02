# IB Quest Game

IB Quest Game is a tablet-first learning experience for PYP students ages 7–11, with particular attention to multilingual learners and students who are new to an IB school. The MVP is planned as a privacy-conscious, static React application optimized for iPad Safari in landscape orientation.

The current repository milestone establishes the engineering foundation. Product assumptions and the complete delivery roadmap live in [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md); implementation gates and verification expectations for this milestone live in [docs/PHASE_1_FOUNDATION.md](./docs/PHASE_1_FOUNDATION.md).

## Prototype journey

The current prototype includes an original illustrated learning world and one complete six-step mission. From Home, choose **Learner Profile Peaks** or **Continue**, then complete the story, power word, comparison, choice, reflection, and reward steps.

The artwork is a draft prototype asset. Its provenance and release gate are recorded in [docs/ASSET_REGISTER.md](./docs/ASSET_REGISTER.md).

## Toolchain

- Node.js `24.21.0`
- pnpm `11.25.0`
- React, TypeScript, and Vite
- Vitest and Testing Library for unit/component tests
- Playwright WebKit for automated iPad-shaped browser smoke tests

Use the pinned versions. The repository records the Node version in `.node-version` and `.nvmrc`, and the pnpm version in `package.json`.

## Local setup

Install Node.js `24.21.0` with your preferred version manager, then install the pinned pnpm release if it is not already available:

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

The development server prints its local URL. Before opening a pull request, run:

```sh
pnpm check
pnpm exec playwright install webkit
pnpm test:e2e --project=ipad-webkit
```

`pnpm check` verifies formatting, linting, TypeScript, content schemas, unit-test coverage, and a production build using the GitHub Pages base path `/IB-Quest-Game/`.

## Commands

| Command                 | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `pnpm dev`              | Start the Vite development server               |
| `pnpm check`            | Run the complete required quality suite         |
| `pnpm test`             | Run Vitest once                                 |
| `pnpm test:watch`       | Run Vitest in watch mode                        |
| `pnpm test:coverage`    | Run unit/component tests with coverage          |
| `pnpm test:e2e`         | Run Playwright tests                            |
| `pnpm build`            | Typecheck and build for a root deployment       |
| `pnpm build:pages`      | Typecheck and build for `/IB-Quest-Game/`       |
| `pnpm preview:pages`    | Preview the GitHub Pages-shaped build locally   |
| `pnpm validate:content` | Validate curriculum content against its schemas |

## Continuous integration

Pull requests and pushes to `main` run two CI jobs:

1. `quality` installs from the lockfile and runs `pnpm check`.
2. `playwright-webkit` runs the iPad-landscape WebKit project and uploads its report and traces when it fails.

Dependency review runs separately on pull requests. Dependabot checks pnpm and GitHub Actions dependencies weekly. Repository administrators should also enable the dependency graph, Dependabot alerts and security updates, secret scanning, push protection, and branch protection for `main`.

## Device support warning

Playwright WebKit is useful automated regression coverage, but it is not Apple Safari running on iPadOS. A successful CI run does not approve a pilot build. Every pilot candidate must be checked on the school’s oldest supported physical iPad for touch behavior, Safari layout, audio, VoiceOver, local progress recovery, orientation, and—if later approved—installation and offline behavior.

## Current boundaries

- No student account, backend, analytics, advertising, tracking, camera, microphone, or uploads.
- Learner progress is intended to remain on the device for the MVP.
- PWA installation and offline caching remain unapproved and are not part of the foundation.
- The working title, curriculum terminology, language choice, device-sharing model, asset rights, and pilot safeguards must be approved before a child pilot.

Do not add real learner information, recordings, school identifiers, or unapproved curriculum content to fixtures, screenshots, traces, or the repository.
