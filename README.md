# Breakpoint

Real debugging practice for frontend developers. Each challenge is a small project with a bug — find it, fix it, learn the underlying concept.

## Stack

Astro · React islands · CodeMirror 6 · Sandpack · Tailwind · Cloudflare Pages

## Develop

```bash
pnpm install
pnpm dev
```

Open http://localhost:4321.

## Authoring a bug

```bash
pnpm new-bug js-11-this-binding
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the bug-folder spec.

## Scripts

- `pnpm dev` — Astro dev server
- `pnpm build` — production build
- `pnpm check` — type-check Astro + TS
- `pnpm validate-bugs` — verify every bug folder is well-formed
- `pnpm new-bug <id>` — scaffold a new bug
- `pnpm size` — enforce bundle budgets

## License

MIT
