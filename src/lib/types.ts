export type Track = 'js' | 'react';
export type Difficulty = 1 | 2 | 3;
export type RunnerType = 'js-iframe' | 'react-sandpack';

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
