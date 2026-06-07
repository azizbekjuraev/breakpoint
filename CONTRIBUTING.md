# Contributing

There are two ways to contribute:

1. **Fix a bug in the app itself** (broken button, typo, styling issue, etc.) — see [Fixing a bug in the app](#fixing-a-bug-in-the-app) below.
2. **Author a new debugging challenge** for learners — see [Authoring a new bug challenge](#authoring-a-new-bug-challenge) below.

## Fixing a bug in the app

For UI bugs, typos, styling, or anything in `src/` — follow these steps:

### 1. Open an issue first (optional but recommended)

For anything beyond a tiny fix, open an issue describing what's broken so we can confirm the approach before you spend time on a PR. Use the **Bug report** template in [.github/ISSUE_TEMPLATE](./.github/ISSUE_TEMPLATE).

### 2. Fork the repository

Go to <https://github.com/azizbekjuraev/breakpoint> and click the **Fork** button in the top-right. This creates your own copy of the repo at `https://github.com/<your-username>/breakpoint`.

You need to fork because you don't have write access to the main repo — your changes go to your fork first, then to the main repo via pull request.

### 3. Clone your fork

```bash
git clone https://github.com/<your-username>/breakpoint.git
cd breakpoint
pnpm install
```

> Replace `<your-username>` with your GitHub username. **Do not** clone `azizbekjuraev/breakpoint` directly — you won't be able to push changes back.

(Optional but recommended) Add the original repo as an `upstream` remote so you can pull in new changes later:

```bash
git remote add upstream https://github.com/azizbekjuraev/breakpoint.git
```

### 4. Create a branch

```bash
git checkout -b fix/<short-description>
# Examples: fix/submit-button-disabled, fix/header-typo, fix/dark-mode-contrast
```

Use `fix/` for bug fixes, `feat/` for new features, `docs/` for docs-only changes.

### 5. Reproduce the bug locally

```bash
pnpm dev
```

Open http://localhost:4321 and confirm you can see the issue before changing code. If you can't reproduce it, ask in the issue — the bug may depend on browser, viewport, or specific state.

### 6. Make the fix

- App code lives in `src/` (components, pages, layouts).
- Challenge content lives in `content/bugs/` — **don't** edit those unless you're authoring a challenge (see the section below).
- Keep changes scoped to the bug. Don't refactor unrelated code in the same PR.

### 7. Verify your change

Before pushing, run:

```bash
pnpm check          # type-check Astro + TS
pnpm build          # ensure production build still works
pnpm validate-bugs  # only relevant if you touched content/bugs/
```

Then manually verify in the browser: the bug is gone, and nothing else broke.

### 8. Commit and push

```bash
git add <files>
git commit -m "fix: <what you fixed>"
git push origin fix/<short-description>
```

Keep commit messages short and in the imperative mood (`fix: disable submit when form is empty`, not `fixed the submit button`).

### 9. Open a pull request

Open a PR from your branch against `main` on the upstream repo. The [PR template](./.github/pull_request_template.md) will guide you — fill in:

- **Description** + linked issue (`Fixes #123`)
- **Type of change** — check "Bug fix"
- **How Has This Been Tested?** — list the steps you took to verify
- **Checklist** — tick what applies

A maintainer will review. Address feedback by pushing more commits to the same branch — the PR updates automatically.

---

## Authoring a new bug challenge

Each challenge is a folder under `content/bugs/<id>/`. Schema enforced by `scripts/validate-bugs.ts`.

### Required files

```
content/bugs/<id>/
├── meta.json          # schema in scripts/validate-bugs.ts
├── README.md          # symptom description + predict-before-run prompt
├── starter/           # broken code the learner sees
├── solution/          # correct fix
├── tests.js | tests.spec.tsx
├── hints.md           # ## Hint 1, ## Hint 2 (escalating)
└── concept.md         # post-fix explainer
```

### Naming

- Track prefix: `js-` for vanilla JS, `react-` for React
- Numeric order: `js-01-closure-loop`, `js-02-array-mutation`
- Kebab-case slug describes the symptom or concept

### Quality bar

- One _clear_ visible symptom
- Tests must reject "symptom-patching" — they verify the root cause
- Hints escalate: L1 "where to look", L2 "what concept is in play"
- Concept card is 100–250 words, plain English

### Scaffold a new bug

```bash
pnpm new-bug js-11-this-binding
```

### Test API (JS track)

Inside `tests.js`, the harness exposes:

```js
test('description', async () => { /* ... */ });
assert.ok(cond, msg?);
assert.equal(a, b, msg?);
assert.deepEqual(a, b, msg?);
assert.throws(fn, msg?);
await wait(ms);
const logs = getLogs(); // string[]
clearLogs();
```
