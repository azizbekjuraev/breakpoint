import type { Bug, BugMeta, BugFiles, Track } from './types';

const metaModules = import.meta.glob<BugMeta>(
  '/content/bugs/*/meta.json',
  { eager: true, import: 'default' },
);

const fileModules = import.meta.glob<string>(
  '/content/bugs/*/**/*.{js,jsx,ts,tsx,md}',
  { eager: true, query: '?raw', import: 'default' },
);

interface RawBugFiles {
  starter: Record<string, string>;
  solution: Record<string, string>;
  tests?: string;
  hints?: string;
  concept?: string;
  readme?: string;
}

function collectFiles(bugId: string): RawBugFiles {
  const prefix = `/content/bugs/${bugId}/`;
  const out: RawBugFiles = { starter: {}, solution: {} };

  for (const [path, content] of Object.entries(fileModules)) {
    if (!path.startsWith(prefix)) continue;
    const rel = path.slice(prefix.length);

    if (rel.startsWith('starter/')) {
      out.starter[rel.slice('starter/'.length)] = content;
    } else if (rel.startsWith('solution/')) {
      out.solution[rel.slice('solution/'.length)] = content;
    } else if (rel === 'tests.js' || rel === 'tests.spec.tsx' || rel === 'tests.spec.ts') {
      out.tests = content;
    } else if (rel === 'hints.md') {
      out.hints = content;
    } else if (rel === 'concept.md') {
      out.concept = content;
    } else if (rel === 'README.md') {
      out.readme = content;
    }
  }
  return out;
}

function parseHints(hints: string): string[] {
  return hints
    .split(/^##\s+/m)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^Hint\s*\d+\s*\n?/i, '').trim())
    .filter(Boolean);
}

function bugIdFromPath(path: string): string {
  const m = path.match(/\/content\/bugs\/([^/]+)\/meta\.json$/);
  if (!m) throw new Error(`Cannot extract bug id from ${path}`);
  return m[1];
}

export function getAllBugs(): Bug[] {
  return Object.entries(metaModules)
    .map(([path, meta]) => {
      const id = bugIdFromPath(path);
      const raw = collectFiles(id);
      const files: BugFiles = {
        starter: raw.starter,
        solution: raw.solution,
        tests: raw.tests ?? '',
        hints: raw.hints ? parseHints(raw.hints) : [],
        concept: raw.concept ?? '',
        readme: raw.readme ?? '',
      };
      return { meta, files };
    })
    .sort((a, b) => a.meta.id.localeCompare(b.meta.id));
}

export function getBugBySlug(slug: string): Bug | undefined {
  return getAllBugs().find((b) => b.meta.id === slug);
}

export function getBugsByTrack(track: Track): Bug[] {
  return getAllBugs().filter((b) => b.meta.track === track);
}
