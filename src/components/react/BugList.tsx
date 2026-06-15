import { useMemo, useState, useSyncExternalStore } from 'react';
import { useProgress } from '@/lib/use-progress';

export interface BugListItem {
  id: string;
  title: string;
  estimatedMinutes: number;
  concepts: string[];
}

interface Props {
  bugs: BugListItem[];
}

type StatusFilter = 'all' | 'unsolved' | 'in-progress' | 'solved';
type HintsFilter = 'all' | 'none' | 'some';

interface Snapshot {
  completed: Set<string>;
  hintsUsed: Record<string, number>;
  lastEdited: Record<string, number>;
}

const FILTER_KEY = 'breakpoint:filters:v1';
const DEFAULT_FILTERS = { status: 'all' as StatusFilter, hints: 'all' as HintsFilter };

let cachedFiltersRaw: string | null = null;
let cachedFilters: { status: StatusFilter; hints: HintsFilter } = DEFAULT_FILTERS;

function getFiltersSnapshot(): { status: StatusFilter; hints: HintsFilter } {
  if (typeof localStorage === 'undefined') return DEFAULT_FILTERS;
  const raw = localStorage.getItem(FILTER_KEY);
  if (raw === cachedFiltersRaw) return cachedFilters;
  cachedFiltersRaw = raw;
  if (!raw) {
    cachedFilters = DEFAULT_FILTERS;
    return cachedFilters;
  }
  try {
    const p = JSON.parse(raw);
    cachedFilters = {
      status: ['all', 'unsolved', 'in-progress', 'solved'].includes(p.status) ? p.status : 'all',
      hints: ['all', 'none', 'some'].includes(p.hints) ? p.hints : 'all',
    };
  } catch {
    cachedFilters = DEFAULT_FILTERS;
  }
  return cachedFilters;
}

function subscribeFilters(cb: () => void): () => void {
  function onStorage(e: StorageEvent) {
    if (e.key === FILTER_KEY) {
      cachedFiltersRaw = null;
      cb();
    }
  }
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
  return () => {
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}

function getFiltersServerSnapshot(): { status: StatusFilter; hints: HintsFilter } {
  return DEFAULT_FILTERS;
}

export default function BugList({ bugs }: Props) {
  const progress = useProgress();
  const savedFilters = useSyncExternalStore(
    subscribeFilters,
    getFiltersSnapshot,
    getFiltersServerSnapshot,
  );

  const [query, setQuery] = useState('');
  const [statusOverride, setStatusOverride] = useState<StatusFilter | null>(null);
  const [hintsOverride, setHintsOverride] = useState<HintsFilter | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const status = statusOverride ?? savedFilters.status;
  const hints = hintsOverride ?? savedFilters.hints;

  function setStatus(next: StatusFilter) {
    setStatusOverride(next);
    persistFilters({ status: next, hints });
  }

  function setHints(next: HintsFilter) {
    setHintsOverride(next);
    persistFilters({ status, hints: next });
  }

  function persistFilters(value: { status: StatusFilter; hints: HintsFilter }) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(FILTER_KEY, JSON.stringify(value));
      cachedFiltersRaw = null;
    } catch {}
  }

  const snapshot = useMemo<Snapshot>(() => {
    const hintsUsed: Record<string, number> = {};
    for (const [id, entry] of Object.entries(progress.completed)) {
      hintsUsed[id] = entry.hintsUsed;
    }
    const lastEdited: Record<string, number> = {};
    for (const [id, entry] of Object.entries(progress.lastEditedAt)) {
      lastEdited[id] = entry.ts;
    }
    return {
      completed: new Set(Object.keys(progress.completed)),
      hintsUsed,
      lastEdited,
    };
  }, [progress]);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of bugs) {
      for (const c of b.concepts) {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) =>
      b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [bugs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bugs.filter((b) => {
      if (q) {
        const haystack = `${b.title} ${b.id} ${b.concepts.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (tag && !b.concepts.includes(tag)) return false;

      const isSolved = snapshot.completed.has(b.id);
      const lastEditedAt = snapshot.lastEdited[b.id];
      const isInProgress = !isSolved && lastEditedAt !== undefined;

      if (status === 'solved' && !isSolved) return false;
      if (status === 'unsolved' && isSolved) return false;
      if (status === 'in-progress' && !isInProgress) return false;

      const used = snapshot.hintsUsed[b.id] ?? 0;
      if (hints === 'none' && used > 0) return false;
      if (hints === 'some' && used === 0) return false;

      return true;
    });
  }, [bugs, query, tag, snapshot, status, hints]);

  const counts = useMemo(() => {
    let solved = 0;
    for (const b of bugs) {
      if (snapshot.completed.has(b.id)) solved++;
    }
    return { total: bugs.length, solved };
  }, [bugs, snapshot]);

  function resetFilters() {
    setQuery('');
    setStatus('all');
    setHints('all');
    setTag(null);
  }

  const filtersActive = query !== '' || status !== 'all' || hints !== 'all' || tag !== null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, id, or tag…"
          className="min-w-[180px] flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-600"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <option value="all">All status</option>
          <option value="unsolved">Unsolved</option>
          <option value="in-progress">In progress</option>
          <option value="solved">Solved</option>
        </select>
        <select
          value={hints}
          onChange={(e) => setHints(e.target.value as HintsFilter)}
          className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <option value="all">Any hints</option>
          <option value="none">Solved with 0 hints</option>
          <option value="some">Solved with hints</option>
        </select>
        {filtersActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-md px-3 py-2 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Clear
          </button>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {allTags.slice(0, 16).map(([t, n]) => {
            const active = tag === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTag(active ? null : t)}
                className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] transition ${
                  active
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                    : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600'
                }`}
              >
                {t}
                <span className="ml-1 opacity-60">{n}</span>
              </button>
            );
          })}
        </div>
      )}

      <p className="mb-4 font-mono text-xs text-neutral-500">
        {filtered.length === bugs.length
          ? `${counts.solved} / ${counts.total} solved`
          : `${filtered.length} of ${bugs.length} bugs · ${counts.solved} / ${counts.total} solved`}
      </p>

      {filtered.length === 0 ? (
        <p className="italic text-neutral-500">No bugs match these filters.</p>
      ) : (
        <ol className="space-y-2">
          {filtered.map((bug) => {
            const isSolved = snapshot.completed.has(bug.id);
            const hintsCount = snapshot.hintsUsed[bug.id];
            return (
              <li key={bug.id}>
                <a
                  href={`/bugs/${bug.id}`}
                  className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                  data-completed={isSolved ? '' : undefined}
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-neutral-500">{bug.id}</p>
                    <p className="truncate font-medium">{bug.title}</p>
                    {bug.concepts.length > 0 && (
                      <p className="mt-1 truncate font-mono text-[10px] text-neutral-400">
                        {bug.concepts.join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs">
                    <span className="text-neutral-500">~{bug.estimatedMinutes}m</span>
                    {isSolved && (
                      <span
                        className="font-semibold text-emerald-600 dark:text-emerald-400"
                        aria-label="Completed"
                      >
                        ✓{hintsCount !== undefined && hintsCount > 0 ? ` ${hintsCount}h` : ''}
                      </span>
                    )}
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
