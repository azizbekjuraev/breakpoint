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
