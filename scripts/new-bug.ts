import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const id = process.argv[2];

if (!id) {
  console.error('Usage: pnpm new-bug <id>');
  console.error('Example: pnpm new-bug js-11-this-binding');
  process.exit(1);
}

if (!/^(js|react)-\d{2}-[a-z0-9-]+$/.test(id)) {
  console.error(`Invalid id "${id}". Format: (js|react)-NN-kebab-case`);
  process.exit(1);
}

const track = id.startsWith('js-') ? 'js' : 'react';
const runner = track === 'js' ? 'js-iframe' : 'react-sandpack';
const dir = join('content', 'bugs', id);

if (existsSync(dir)) {
  console.error(`Bug folder already exists: ${dir}`);
  process.exit(1);
}

mkdirSync(join(dir, 'starter'), { recursive: true });
mkdirSync(join(dir, 'solution'), { recursive: true });

const meta = {
  id,
  track,
  title: 'TODO: short symptom description',
  difficulty: 1,
  concepts: [],
  prereqs: [],
  estimatedMinutes: 5,
  runner,
};

writeFileSync(join(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

writeFileSync(
  join(dir, 'README.md'),
  '# TODO\n\nDescribe the visible symptom in 1–3 sentences.\n\nEnd with: **Before you run it: what do you think will happen, and why?**\n',
);

writeFileSync(
  join(dir, 'hints.md'),
  '## Hint 1\n\nWhere should the learner look first?\n\n## Hint 2\n\nWhat concept is in play, and why does it cause this symptom?\n',
);

writeFileSync(
  join(dir, 'concept.md'),
  '# Concept name\n\nExplain the mental model the bug exposes. 100–250 words. Plain English.\n\n**The lesson**: one-sentence takeaway.\n',
);

if (track === 'js') {
  writeFileSync(join(dir, 'starter', 'index.js'), '// TODO: broken code that the learner sees\n');
  writeFileSync(join(dir, 'solution', 'index.js'), '// TODO: correct fix\n');
  writeFileSync(
    join(dir, 'tests.js'),
    `test('TODO: describe expectation', async () => {
  // await wait(100);
  // assert.deepEqual(getLogs(), ['expected', 'output']);
});
`,
  );
} else {
  writeFileSync(
    join(dir, 'starter', 'App.tsx'),
    `export default function App() {
  return <div>TODO: broken component</div>;
}
`,
  );
  writeFileSync(
    join(dir, 'solution', 'App.tsx'),
    `export default function App() {
  return <div>TODO: fixed component</div>;
}
`,
  );
  writeFileSync(join(dir, 'tests.spec.tsx'), `// TODO: tests for the React bug\n`);
}

console.log(`Created ${dir}`);
console.log(`Next: edit meta.json, starter/, solution/, tests, hints, concept.`);
