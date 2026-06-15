import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import type { Track } from '@/lib/types';
import { TRACK_META } from '@/lib/types';

export interface PaletteBug {
  id: string;
  title: string;
  track: Track;
  concepts: string[];
}

export interface PaletteAction {
  id: string;
  label: string;
  hint?: string;
  perform: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  bugs: PaletteBug[];
  currentBugId?: string;
  actions?: PaletteAction[];
  completedIds?: Set<string>;
}

interface Item {
  kind: 'bug' | 'action';
  id: string;
  label: string;
  hint?: string;
  meta?: string;
  perform: () => void;
}

function score(haystack: string, query: string): number | null {
  if (!query) return 0;
  const h = haystack.toLowerCase();
  const q = query.toLowerCase();
  if (h.includes(q)) {
    return h.indexOf(q) === 0 ? -1000 : -500 + h.indexOf(q);
  }
  // Subsequence fallback — every query char appears in order.
  let i = 0;
  let firstMatch = -1;
  let gaps = 0;
  for (let j = 0; j < h.length && i < q.length; j++) {
    if (h[j] === q[i]) {
      if (firstMatch === -1) firstMatch = j;
      i++;
    } else if (i > 0) {
      gaps++;
    }
  }
  if (i < q.length) return null;
  return firstMatch + gaps * 2;
}

export default function CommandPalette(props: Props) {
  // Mount fresh whenever the palette opens, so query/active-index reset
  // naturally without juggling effects.
  if (!props.open) return null;
  return <PaletteBody {...props} />;
}

function PaletteBody({
  open,
  onClose,
  bugs,
  currentBugId,
  actions = [],
  completedIds,
}: Props) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo<Item[]>(() => {
    const actionItems: Item[] = actions.map((a) => ({
      kind: 'action',
      id: `action:${a.id}`,
      label: a.label,
      hint: a.hint,
      perform: a.perform,
    }));
    const bugItems: Item[] = bugs
      .filter((b) => b.id !== currentBugId)
      .map((b) => ({
        kind: 'bug',
        id: `bug:${b.id}`,
        label: b.title,
        hint: b.id,
        meta: TRACK_META[b.track].label,
        perform: () => {
          window.location.href = `/bugs/${b.id}`;
        },
      }));

    if (!query) return [...actionItems, ...bugItems];

    type Scored = { item: Item; score: number };
    const scored: Scored[] = [];
    for (const it of [...actionItems, ...bugItems]) {
      const fields = [it.label, it.hint ?? '', it.meta ?? ''];
      const best = fields
        .map((f) => score(f, query))
        .filter((s): s is number => s !== null);
      if (best.length === 0) continue;
      scored.push({ item: it, score: Math.min(...best) });
    }
    scored.sort((a, b) => a.score - b.score);
    return scored.map((s) => s.item);
  }, [actions, bugs, currentBugId, query]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    if (active) active.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  function handleQueryChange(next: string) {
    setQuery(next);
    setActiveIndex(0);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const it = items[activeIndex];
      if (it) {
        onClose();
        it.perform();
      }
    }
  }

  const firstActionIdx = items.findIndex((it) => it.kind === 'action');
  const firstBugIdx = items.findIndex((it) => it.kind === 'bug');

  return (
    <Modal open={open} onClose={onClose} width="lg" labelledBy="palette-title">
      <h2 id="palette-title" className="sr-only">
        Command palette
      </h2>
      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <input
          autoFocus
          type="text"
          value={query}
          placeholder="Search bugs, actions…"
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-base outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
        />
      </div>
      <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
        {items.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-neutral-500">No matches.</p>
        )}
        {items.map((it, i) => {
          const isActive = i === activeIndex;
          const showActionsHeader = i === firstActionIdx && firstActionIdx !== -1;
          const showBugsHeader = i === firstBugIdx && firstBugIdx !== -1;
          const completed =
            it.kind === 'bug' && completedIds && completedIds.has(it.id.replace(/^bug:/, ''));
          return (
            <div key={it.id}>
              {showActionsHeader && (
                <p className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  Actions
                </p>
              )}
              {showBugsHeader && (
                <p className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  Jump to bug
                </p>
              )}
              <button
                type="button"
                data-idx={i}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  onClose();
                  it.perform();
                }}
                className={`flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-sm transition ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {completed && (
                    <span
                      aria-hidden
                      className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400"
                    >
                      ✓
                    </span>
                  )}
                  <span className="truncate">{it.label}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3 font-mono text-[10px] text-neutral-400">
                  {it.meta && <span>{it.meta}</span>}
                  {it.hint && <span>{it.hint}</span>}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between border-t border-neutral-200 px-4 py-2 font-mono text-[10px] text-neutral-400 dark:border-neutral-800">
        <span>↑↓ navigate · ↵ select · Esc close</span>
        <span>{items.length} results</span>
      </div>
    </Modal>
  );
}
