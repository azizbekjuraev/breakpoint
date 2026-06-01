# Contributing

Each bug is a folder under `content/bugs/<id>/`. Schema enforced by `scripts/validate-bugs.ts`.

## Required files

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

## Naming

- Track prefix: `js-` for vanilla JS, `react-` for React
- Numeric order: `js-01-closure-loop`, `js-02-array-mutation`
- Kebab-case slug describes the symptom or concept

## Quality bar

- One _clear_ visible symptom
- Tests must reject "symptom-patching" — they verify the root cause
- Hints escalate: L1 "where to look", L2 "what concept is in play"
- Concept card is 100–250 words, plain English

## Scaffold a new bug

```bash
pnpm new-bug js-11-this-binding
```

## Test API (JS track)

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
