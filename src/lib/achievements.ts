import type { ProgressData, CompletedEntry } from './progress';
import { TRACK_META, type Track } from './types';

export interface AchievementDef {
  id: string;
  label: string;
  description: string;
}

export interface Achievement extends AchievementDef {
  earned: boolean;
}

interface Aggregates {
  solvedCount: number;
  trackTotal: number;
  hintFreeCount: number;
  fastestMs: number | null;
}

interface Spec {
  key: string;
  label: string;
  describe: (trackLabel: string) => string;
  earned: (agg: Aggregates) => boolean;
}

const SPEEDRUN_SECONDS = 90;
const HINT_FREE_THRESHOLD = 5;

const SPECS: Spec[] = [
  {
    key: 'first',
    label: 'First blood',
    describe: (l) => `Solve your first ${l} bug.`,
    earned: (a) => a.solvedCount >= 1,
  },
  {
    key: '5',
    label: 'Five down',
    describe: (l) => `Solve 5 ${l} bugs.`,
    earned: (a) => a.solvedCount >= 5,
  },
  {
    key: '10',
    label: 'Ten down',
    describe: (l) => `Solve 10 ${l} bugs.`,
    earned: (a) => a.solvedCount >= 10,
  },
  {
    key: 'complete',
    label: 'Track complete',
    describe: (l) => `Solve every ${l} bug.`,
    earned: (a) => a.trackTotal > 0 && a.solvedCount === a.trackTotal,
  },
  {
    key: 'hint-free',
    label: 'Pure mind',
    describe: (l) => `Solve ${HINT_FREE_THRESHOLD} ${l} bugs with zero hints.`,
    earned: (a) => a.hintFreeCount >= HINT_FREE_THRESHOLD,
  },
  {
    key: 'speedrun',
    label: 'Speedrun',
    describe: (l) => `Solve a ${l} bug in under ${SPEEDRUN_SECONDS}s.`,
    earned: (a) => a.fastestMs !== null && a.fastestMs <= SPEEDRUN_SECONDS * 1000,
  },
];

function trackLabel(track: Track): string {
  return TRACK_META[track].label;
}

export function getAchievementDefs(track: Track): AchievementDef[] {
  const label = trackLabel(track);
  return SPECS.map((s) => ({
    id: `${track}-${s.key}`,
    label: s.label,
    description: s.describe(label),
  }));
}

function solvedEntries(
  data: ProgressData,
  trackBugIds: string[],
): CompletedEntry[] {
  return trackBugIds
    .map((id) => data.completed[id])
    .filter((e): e is CompletedEntry => Boolean(e));
}

interface ComputeInput {
  track: Track;
  trackBugIds: string[];
  data: ProgressData;
}

export function computeTrackAchievements({
  track,
  trackBugIds,
  data,
}: ComputeInput): Achievement[] {
  const solved = solvedEntries(data, trackBugIds);
  const durations = solved
    .map((e) => e.durationMs)
    .filter((d): d is number => typeof d === 'number');

  const agg: Aggregates = {
    solvedCount: solved.length,
    trackTotal: trackBugIds.length,
    hintFreeCount: solved.filter((e) => e.hintsUsed === 0).length,
    fastestMs: durations.length > 0 ? Math.min(...durations) : null,
  };

  const label = trackLabel(track);
  return SPECS.map((s) => ({
    id: `${track}-${s.key}`,
    label: s.label,
    description: s.describe(label),
    earned: s.earned(agg),
  }));
}
