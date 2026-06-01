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

We support two distinct execution environments based on the track:

### JS Track (`js-iframe`)

- **Mechanism**: Uses a hidden `<iframe>` to execute vanilla JavaScript.
- **Harness**: `src/runners/js/harness.ts` injects a custom test suite into the iframe. It captures `console.log` and provides `assert` utilities.
- **Isolation**: Provides a clean global scope for each test run.

### React Track (`react-sandpack`)

- **Mechanism**: Powered by CodeSandbox's **Sandpack**.
- **Harness**: `src/runners/react/harness.ts`. It leverages Sandpack's internal listener to detect successful renders and run unit tests against the React components.
- **Flexibility**: Allows for complex React environments (dependencies, multiple files) without managing a custom bundling logic.

## Validation

To maintain content quality, we use `scripts/validate-bugs.ts`. This script runs in CI and ensures:

- Every bug folder has the required files.
- `meta.json` follows the correct schema (using Zod).
- The `runner` matches the `track` (e.g., JS bugs must use the `js-iframe` runner).

## Tech Stack

- **Frontend**: Astro (Static site generation + Islands).
- **UI Components**: React + Tailwind CSS.
- **Editor**: CodeMirror 6.
- **Testing**: Custom harnesses for challenges; ESLint/Prettier for codebase quality.
