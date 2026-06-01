const KEY = 'breakpoint:progress:v1';

interface ProgressData {
  completed: Record<string, { at: number; hintsUsed: number }>;
  hintsRevealed: Record<string, number>;
}

function load(): ProgressData {
  if (typeof localStorage === 'undefined') {
    return { completed: {}, hintsRevealed: {} };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { completed: {}, hintsRevealed: {} };
    return JSON.parse(raw);
  } catch {
    return { completed: {}, hintsRevealed: {} };
  }
}

function save(data: ProgressData) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function markCompleted(bugId: string, hintsUsed: number): void {
  const data = load();
  data.completed[bugId] = { at: Date.now(), hintsUsed };
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
