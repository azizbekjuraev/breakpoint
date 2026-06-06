import type { Track } from './types';

const KEY = 'breakpoint:progress:v1';

export interface CompletedEntry {
  at: number;
  hintsUsed: number;
  durationMs?: number;
}

export interface EditedEntry {
  ts: number;
  title: string;
  track: Track;
}

export interface ProgressData {
  completed: Record<string, CompletedEntry>;
  hintsRevealed: Record<string, number>;
  started: Record<string, number>;
  lastEditedAt: Record<string, EditedEntry>;
}

function emptyData(): ProgressData {
  return { completed: {}, hintsRevealed: {}, started: {}, lastEditedAt: {} };
}

function normalizeLastEdited(raw: unknown): Record<string, EditedEntry> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, EditedEntry> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (
      v &&
      typeof v === 'object' &&
      typeof (v as EditedEntry).ts === 'number' &&
      typeof (v as EditedEntry).title === 'string' &&
      ((v as EditedEntry).track === 'js' || (v as EditedEntry).track === 'react')
    ) {
      out[k] = v as EditedEntry;
    }
  }
  return out;
}

function load(): ProgressData {
  if (typeof localStorage === 'undefined') return emptyData();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw);
    return {
      completed: parsed.completed ?? {},
      hintsRevealed: parsed.hintsRevealed ?? {},
      started: parsed.started ?? {},
      lastEditedAt: normalizeLastEdited(parsed.lastEditedAt),
    };
  } catch {
    return emptyData();
  }
}

function save(data: ProgressData) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getProgress(): ProgressData {
  return load();
}

export function markCompleted(bugId: string, hintsUsed: number): void {
  const data = load();
  const now = Date.now();
  const started = data.started[bugId];
  const newDuration = started ? now - started : undefined;
  const existing = data.completed[bugId];

  const mergedHints =
    existing !== undefined ? Math.min(existing.hintsUsed, hintsUsed) : hintsUsed;
  const mergedDuration =
    newDuration !== undefined && existing?.durationMs !== undefined
      ? Math.min(existing.durationMs, newDuration)
      : (newDuration ?? existing?.durationMs);

  data.completed[bugId] = {
    at: now,
    hintsUsed: mergedHints,
    ...(mergedDuration !== undefined ? { durationMs: mergedDuration } : {}),
  };
  save(data);
}

export function isCompleted(bugId: string): boolean {
  return Boolean(load().completed[bugId]);
}

export function getHintsRevealed(bugId: string): number {
  return load().hintsRevealed[bugId] ?? 0;
}

export function revealHint(bugId: string, level: number): void {
  const data = load();
  data.hintsRevealed[bugId] = Math.max(data.hintsRevealed[bugId] ?? 0, level);
  save(data);
}

export function getCompletedIds(): string[] {
  return Object.keys(load().completed);
}

export function markEdited(bugId: string, meta: { title: string; track: Track }): void {
  const data = load();
  const now = Date.now();
  if (!data.started[bugId]) data.started[bugId] = now;
  data.lastEditedAt[bugId] = { ts: now, title: meta.title, track: meta.track };
  save(data);
}

export function clearStart(bugId: string): void {
  const data = load();
  delete data.started[bugId];
  save(data);
}

const CODE_KEY = 'breakpoint:code:v1';

function loadCode(): Record<string, string> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CODE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCodeStorage(data: Record<string, string>) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(CODE_KEY, JSON.stringify(data));
}

export function saveCode(bugId: string, code: string): void {
  const data = loadCode();
  data[bugId] = code;
  saveCodeStorage(data);
}

export function getSavedCode(bugId: string): string | null {
  return loadCode()[bugId] ?? null;
}

export function clearSavedCode(bugId: string): void {
  const data = loadCode();
  delete data[bugId];
  saveCodeStorage(data);
}
