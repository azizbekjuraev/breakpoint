import type { ProgressData, EditedEntry } from './progress';

export interface TrackStats {
  solved: number;
  total: number;
  avgHints: number | null;
  avgDurationMs: number | null;
  streak: number;
}

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function computeStreak(timestamps: number[]): number {
  if (timestamps.length === 0) return 0;
  const days = new Set(timestamps.map(dayKey));

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!days.has(dayKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayKey(cursor.getTime()))) return 0;
  }

  let streak = 0;
  while (days.has(dayKey(cursor.getTime()))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeTrackStats(
  data: ProgressData,
  trackBugIds: string[],
): TrackStats {
  const solvedEntries = trackBugIds
    .map((id) => data.completed[id])
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const solved = solvedEntries.length;
  const total = trackBugIds.length;

  const avgHints =
    solved > 0
      ? solvedEntries.reduce((sum, e) => sum + e.hintsUsed, 0) / solved
      : null;

  const withDuration = solvedEntries.filter(
    (e): e is typeof e & { durationMs: number } => typeof e.durationMs === 'number',
  );
  const avgDurationMs =
    withDuration.length > 0
      ? withDuration.reduce((sum, e) => sum + e.durationMs, 0) / withDuration.length
      : null;

  const streak = computeStreak(solvedEntries.map((e) => e.at));

  return { solved, total, avgHints, avgDurationMs, streak };
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

export interface ResumeCandidate extends EditedEntry {
  bugId: string;
}

export function findResumeCandidate(
  data: ProgressData,
  isValid?: (bugId: string) => boolean,
): ResumeCandidate | null {
  let best: ResumeCandidate | null = null;
  for (const [bugId, entry] of Object.entries(data.lastEditedAt)) {
    if (data.completed[bugId]) continue;
    if (isValid && !isValid(bugId)) continue;
    if (!best || entry.ts > best.ts) {
      best = { bugId, ...entry };
    }
  }
  return best;
}
