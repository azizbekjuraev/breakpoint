export type Track = 'js' | 'react' | 'css' | 'a11y' | 'ts';
export type Difficulty = 1 | 2 | 3;
export type RunnerType =
  | 'js-iframe'
  | 'react-sandpack'
  | 'css-iframe'
  | 'a11y-iframe'
  | 'ts-typecheck';

export const TRACK_META: Record<Track, { label: string; description: string }> = {
  js: {
    label: 'JavaScript',
    description: 'Scope, closures, async, types. Pure language fundamentals.',
  },
  react: {
    label: 'React',
    description: 'Hooks, state, effects, reconciliation. Assumes JS comfort.',
  },
  css: {
    label: 'CSS',
    description: 'Flexbox, grid, positioning, overflow. Layout bugs verified by DOM measurement.',
  },
  a11y: {
    label: 'Accessibility',
    description: 'Labels, names, semantics, structure. Markup bugs verified by axe-core.',
  },
  ts: {
    label: 'TypeScript',
    description:
      'Narrowing, inference, generics, satisfies, conditional types. Bugs verified by the TS compiler.',
  },
};

export const ALL_TRACKS: Track[] = ['js', 'react', 'css', 'a11y', 'ts'];

export function runnerForTrack(track: Track): RunnerType {
  if (track === 'js') return 'js-iframe';
  if (track === 'react') return 'react-sandpack';
  if (track === 'css') return 'css-iframe';
  if (track === 'a11y') return 'a11y-iframe';
  return 'ts-typecheck';
}

export interface BugMeta {
  id: string;
  track: Track;
  title: string;
  difficulty: Difficulty;
  concepts: string[];
  prereqs: string[];
  estimatedMinutes: number;
  runner: RunnerType;
}

export interface BugFiles {
  starter: Record<string, string>;
  solution: Record<string, string>;
  tests: string;
  hints: string[];
  concept: string;
  readme: string;
}

export interface Bug {
  meta: BugMeta;
  files: BugFiles;
}

export interface TestFailure {
  name: string;
  message: string;
}

export interface RunResult {
  passed: boolean;
  total: number;
  passedCount: number;
  failures: TestFailure[];
  logs: string[];
  errors: string[];
  durationMs: number;
}
