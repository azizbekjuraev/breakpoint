import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

const MetaSchema = z.object({
  id: z.string().regex(/^(js|react|css|a11y)-\d{2}-[a-z0-9-]+$/),
  track: z.enum(['js', 'react', 'css', 'a11y']),
  title: z.string().min(3),
  difficulty: z.number().int().min(1).max(3),
  concepts: z.array(z.string()),
  prereqs: z.array(z.string()).default([]),
  estimatedMinutes: z.number().int().positive(),
  runner: z.enum(['js-iframe', 'react-sandpack', 'css-iframe', 'a11y-iframe']),
});

const RUNNER_BY_TRACK = {
  js: 'js-iframe',
  react: 'react-sandpack',
  css: 'css-iframe',
  a11y: 'a11y-iframe',
} as const;

const BUGS_DIR = join('content', 'bugs');
const errors: string[] = [];

if (!existsSync(BUGS_DIR)) {
  console.error(`Missing ${BUGS_DIR}`);
  process.exit(1);
}

const bugDirs = readdirSync(BUGS_DIR).filter((name) =>
  statSync(join(BUGS_DIR, name)).isDirectory(),
);

for (const id of bugDirs) {
  const dir = join(BUGS_DIR, id);

  const required = ['meta.json', 'README.md', 'starter', 'solution', 'hints.md', 'concept.md'];
  for (const f of required) {
    if (!existsSync(join(dir, f))) errors.push(`${id}: missing ${f}`);
  }

  const hasJsTests = existsSync(join(dir, 'tests.js'));
  const hasTsxTests = existsSync(join(dir, 'tests.spec.tsx'));
  const hasTsTests = existsSync(join(dir, 'tests.spec.ts'));
  if (!hasJsTests && !hasTsxTests && !hasTsTests) {
    errors.push(`${id}: missing tests.js, tests.spec.ts, or tests.spec.tsx`);
  }

  const starterDir = join(dir, 'starter');
  if (existsSync(starterDir) && readdirSync(starterDir).length === 0) {
    errors.push(`${id}: starter/ is empty`);
  }
  const solutionDir = join(dir, 'solution');
  if (existsSync(solutionDir) && readdirSync(solutionDir).length === 0) {
    errors.push(`${id}: solution/ is empty`);
  }

  if (existsSync(join(dir, 'meta.json'))) {
    try {
      const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'));
      const parsed = MetaSchema.safeParse(meta);
      if (!parsed.success) {
        const detail = parsed.error.issues
          .map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`)
          .join('; ');
        errors.push(`${id}: invalid meta.json — ${detail}`);
      } else if (parsed.data.id !== id) {
        errors.push(`${id}: meta.id "${parsed.data.id}" does not match folder name`);
      } else {
        const expectedRunner = RUNNER_BY_TRACK[parsed.data.track];
        if (parsed.data.runner !== expectedRunner) {
          errors.push(
            `${id}: runner "${parsed.data.runner}" does not match track "${parsed.data.track}" (expected "${expectedRunner}")`,
          );
        }
      }
    } catch (e) {
      errors.push(`${id}: cannot parse meta.json — ${(e as Error).message}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Found ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`OK: all ${bugDirs.length} bug(s) valid.`);
