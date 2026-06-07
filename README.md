<p align="center">
  <img src="./public/android-chrome-512x512.png" alt="Breakpoint Logo" width="120" height="120">
</p>

<h1 align="center">Breakpoint</h1>

<p align="center">
  Practice real frontend debugging.
</p>

<p align="center">
  <a href="https://github.com/azizbekjuraev/breakpoint/blob/main/LICENSE"><img src="https://img.shields.io/github/license/azizbekjuraev/breakpoint" alt="License"></a>
  <a href="https://github.com/azizbekjuraev/breakpoint/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  <a href="https://github.com/azizbekjuraev/breakpoint/blob/main/CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/contributor%20covenant-1.4-purple.svg" alt="Contributor Covenant"></a>
  <a href="https://github.com/azizbekjuraev/breakpoint/commits/main"><img src="https://img.shields.io/github/last-commit/azizbekjuraev/breakpoint" alt="Last commit"></a>
  <a href="https://github.com/azizbekjuraev/breakpoint/graphs/contributors"><img src="https://img.shields.io/github/contributors/azizbekjuraev/breakpoint" alt="Contributors"></a>
  <a href="https://github.com/azizbekjuraev/breakpoint/issues"><img src="https://img.shields.io/github/issues/azizbekjuraev/breakpoint" alt="Open issues"></a>
  <a href="https://github.com/azizbekjuraev/breakpoint/pulls"><img src="https://img.shields.io/github/issues-pr/azizbekjuraev/breakpoint" alt="Open PRs"></a>
  <a href="https://github.com/azizbekjuraev/breakpoint/stargazers"><img src="https://img.shields.io/github/stars/azizbekjuraev/breakpoint?style=social" alt="GitHub stars"></a>
</p>

<p align="center">
  <a href="#why-breakpoint"><strong>Why Breakpoint</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="./ARCHITECTURE.md"><strong>Architecture</strong></a>
</p>

---

## Why Breakpoint?

Most coding-practice sites quiz you on algorithms or hand you a blank editor. **Breakpoint is different — you start with code that's already broken**, the same way you do in your day job.

- **Real bugs, not puzzles** — closure traps, stale state, race conditions, hydration mismatches. The stuff that actually wastes your time at work.
- **Predict before you run** — every challenge asks you to guess the output first, building intuition instead of "try-until-it-works" habits.
- **Concept cards after every fix** — once you solve it, learn _why_ it broke in 100–250 plain-English words.
- **Escalating hints** — stuck? Get a nudge first, a concept hint next. Never a spoiler unless you ask.

Built for frontend devs who want to stop being scared of their own bug tracker.

## Quick Start

```bash
git clone https://github.com/azizbekjuraev/breakpoint.git
cd breakpoint
pnpm install
pnpm dev
```

Open <http://localhost:4321> and start debugging.

## Stack

Astro · React islands · CodeMirror 6 · Sandpack · Tailwind · Cloudflare Pages

## Contributing

We welcome contributors. Whether you want to fix a typo, polish the UI, or author a brand-new debugging challenge — there's a path for you.

- **Found a bug in the app?** See [Fixing a bug in the app](./CONTRIBUTING.md#fixing-a-bug-in-the-app) — step-by-step fork → branch → PR guide.
- **Want to author a debugging challenge?** See [Authoring a new bug challenge](./CONTRIBUTING.md#authoring-a-new-bug-challenge) — folder spec, naming, quality bar.
- **Curious how the engine works?** Start with [ARCHITECTURE.md](./ARCHITECTURE.md).
- **First-time contributor?** Look for issues tagged [`good first issue`](https://github.com/azizbekjuraev/breakpoint/labels/good%20first%20issue).

All contributors are expected to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Where We Need Help

Active areas where new contributors can make a real impact:

- **New bug challenges** — especially React, async/await, and accessibility traps
- **UI polish** — keyboard navigation, dark mode contrast, mobile layout
- **Editor UX** — CodeMirror configuration, Vim mode improvements
- **Docs** — concept cards in languages other than English

Open an issue if you'd like to tackle something not listed here.

## Scripts

| Command               | What it does                            |
| --------------------- | --------------------------------------- |
| `pnpm dev`            | Start the Astro dev server              |
| `pnpm build`          | Build for production                    |
| `pnpm check`          | Type-check Astro + TypeScript           |
| `pnpm validate-bugs`  | Verify every bug folder is well-formed  |
| `pnpm new-bug <id>`   | Scaffold a new bug challenge            |
| `pnpm size`           | Enforce bundle-size budgets             |

## Security

Found a security issue? Please **do not** open a public issue. See [SECURITY.md](./SECURITY.md) for responsible disclosure.

## License

[MIT](./LICENSE) © Breakpoint contributors
