# Architecture

Breakpoint is a content-driven application built with Astro. It provides a platform for developers to practice debugging real-world frontend issues.

## Data Flow

1.  **Content Layer (`content/bugs/`)**: Every challenge is stored as a directory containing Markdown files for instructions/hints, JSON for metadata, and source code for the "broken" (starter) and "fixed" (solution) states.
2.  **Logic Layer (`src/lib/`)**:
    - `bugs.ts`: Responsible for discovery and loading of bug content into memory.
    - `markdown.ts`: Parses challenge descriptions and hints.
    - `progress.ts`: Manages user progress (solved/unsolved) using browser local storage.
3.  **UI Layer (`src/pages/`)**: Astro pages render the challenge layout. The editor and runner are React "islands" for interactivity.
4.  **Execution Layer (`src/runners/`)**: This is where the code actually runs.

## Runners

Each track has its own execution environment, chosen to fit what the bug class actually tests. All runners report back to the parent via `postMessage({ type: 'breakpoint:result', result })`.

### JS Track (`js-iframe`)

- **Mechanism**: Hidden `<iframe>` executes vanilla JavaScript.
- **Harness**: `src/runners/js/harness.ts` — captures `console.log`, exposes `assert.ok/equal/deepEqual/throws`, `wait`, `getLogs`.
- **Isolation**: Clean global scope per test run.

### React Track (`react-sandpack`)

- **Mechanism**: Powered by CodeSandbox's **Sandpack**.
- **Harness**: `src/runners/react/harness.ts` — hooks Sandpack's listener to detect successful renders and run unit tests against the rendered components.
- **Flexibility**: Multi-file React projects with real dependencies; no custom bundler logic.

### CSS Track (`css-iframe`)

- **Mechanism**: Visible sandboxed `<iframe>` whose body is the learner's HTML + CSS. Tests measure the rendered geometry.
- **Harness**: `src/runners/css/harness.ts` — DOM helpers (`$`, `$$`, `rect`, `style`, `center`) plus `assert.close` for tolerance-based comparisons.
- **Timing**: Double-`requestAnimationFrame` before tests run, so layout has settled.

### Accessibility Track (`a11y-iframe`)

- **Mechanism**: Visible sandboxed `<iframe>` with axe-core inlined into the document via `?raw` import (lazy-loaded — ships only in the A11yRunner chunk).
- **Harness**: `src/runners/a11y/harness.ts` — exposes `axeRun(rules?)` and `assertAxePasses(rules?)`. Tests scope axe to specific rule ids (e.g. `['label']`, `['button-name']`) so unrelated violations don't bite.
- **Edit target**: The learner edits HTML; CSS in the starter is fixed visual styling.

## Validation

To maintain content quality, we use `scripts/validate-bugs.ts`. This script runs in CI and ensures:

- Every bug folder has the required files.
- `meta.json` follows the correct schema (using Zod).
- The `runner` matches the `track` (e.g., JS bugs must use the `js-iframe` runner; a11y bugs must use `a11y-iframe`).

## Tech Stack

- **Frontend**: Astro (Static site generation + Islands).
- **UI Components**: React + Tailwind CSS.
- **Editor**: CodeMirror 6.
- **Testing**: Custom harnesses for challenges; ESLint/Prettier for codebase quality.
