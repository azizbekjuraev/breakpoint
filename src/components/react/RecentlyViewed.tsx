import { useMemo } from 'react';
import { useProgress } from '@/lib/use-progress';
import type { Track } from '@/lib/types';

interface Props {
  /** When provided, the list is filtered to just this track. */
  track?: Track;
  limit?: number;
}

interface Item {
  id: string;
  title: string;
  track: Track;
  ts: number;
  solved: boolean;
}

function relativeTime(ts: number): string {
  const diffMs = Date.now() - ts;
  const min = 60_000;
  const hour = 60 * min;
  const day = 24 * hour;
  if (diffMs < min) return 'just now';
  if (diffMs < hour) return `${Math.floor(diffMs / min)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  return `${Math.floor(diffMs / day)}d ago`;
}

export default function RecentlyViewed({ track, limit = 5 }: Props) {
  const progress = useProgress();

  const items = useMemo<Item[]>(() => {
    const solved = new Set(Object.keys(progress.completed));
    return Object.entries(progress.lastEditedAt)
      .map(([id, entry]) => ({
        id,
        title: entry.title,
        track: entry.track,
        ts: entry.ts,
        solved: solved.has(id),
      }))
      .filter((i) => (track ? i.track === track : true))
      .sort((a, b) => b.ts - a.ts)
      .slice(0, limit);
  }, [progress, track, limit]);

  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wide text-neutral-400">
        Recently viewed
      </h2>
      <ol className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`/bugs/${item.id}`}
              className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 px-3 py-2 text-sm transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            >
              <span className="flex min-w-0 items-center gap-2">
                {item.solved ? (
                  <span
                    aria-hidden
                    className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400"
                  >
                    ✓
                  </span>
                ) : (
                  <span aria-hidden className="font-mono text-[10px] text-neutral-400">
                    ·
                  </span>
                )}
                <span className="truncate">{item.title}</span>
              </span>
              <span className="shrink-0 font-mono text-[10px] text-neutral-400">
                {relativeTime(item.ts)}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
