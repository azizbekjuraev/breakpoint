import { useSyncExternalStore } from 'react';
import { getProgress, type ProgressData } from './progress';

const STORAGE_KEY = 'breakpoint:progress:v1';
const EMPTY: ProgressData = {
  completed: {},
  hintsRevealed: {},
  started: {},
  lastEditedAt: {},
};

let cached: ProgressData | null = null;
let cachedRaw: string | null = null;
const listeners = new Set<() => void>();

function readRaw(): string {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

function getSnapshot(): ProgressData {
  const raw = readRaw();
  if (raw !== cachedRaw || cached === null) {
    cached = getProgress();
    cachedRaw = raw;
  }
  return cached;
}

function notify(): void {
  cached = null;
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  function onStorage(e: StorageEvent) {
    if (e.key === STORAGE_KEY) notify();
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }
  return () => {
    listeners.delete(cb);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

function getServerSnapshot(): ProgressData {
  return EMPTY;
}

export function useProgress(): ProgressData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Tell subscribers to re-read after a same-tab write. */
export function invalidateProgress(): void {
  notify();
}
