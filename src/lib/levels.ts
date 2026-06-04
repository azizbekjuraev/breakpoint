import type { Difficulty } from './types';

export interface Level {
  difficulty: Difficulty;
  slug: string;
  label: string;
  blurb: string;
}

export const LEVELS: Level[] = [
  {
    difficulty: 1,
    slug: 'junior',
    label: 'Junior',
    blurb: 'Fundamentals and common gotchas.',
  },
  {
    difficulty: 2,
    slug: 'middle',
    label: 'Middle',
    blurb: 'Subtle bugs that need real understanding.',
  },
  {
    difficulty: 3,
    slug: 'senior',
    label: 'Senior',
    blurb: 'Edge cases, deep mechanics, hard-to-spot issues.',
  },
];

export function getLevelBySlug(slug: string): Level | undefined {
  return LEVELS.find((l) => l.slug === slug);
}
