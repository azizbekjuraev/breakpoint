import type { RunResult } from '@/lib/types';

export type RunMessage =
  | { type: 'breakpoint:result'; result: RunResult }
  | { type: 'breakpoint:ready' };
