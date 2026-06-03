import { useState, useMemo, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import type { Bug, RunResult, Track } from '@/lib/types';
import Editor from './Editor';
import HintPanel from './HintPanel';
import ConceptCard from './ConceptCard';
import TestResults from './TestResults';
import { markCompleted, isCompleted, saveCode, getSavedCode, clearSavedCode } from '@/lib/progress';
import { useHintState } from '@/lib/hint-state';
import { renderMarkdown } from '@/lib/markdown';

const EDITOR_STORAGE_KEY = 'breakpoint:editor';

function readEditorPrefs(): { vimMode: boolean; showPreview: boolean } {
  try {
    const raw = localStorage.getItem(EDITOR_STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        vimMode: typeof p.vimMode === 'boolean' ? p.vimMode : false,
        showPreview: typeof p.showPreview === 'boolean' ? p.showPreview : false,
      };
    }
  } catch {}
  return { vimMode: false, showPreview: false };
}

const JsRunner = lazy(() => import('@/runners/js/JsRunner'));
const ReactRunner = lazy(() => import('@/runners/react/ReactRunner'));
const LivePreview = lazy(() => import('@/runners/react/LivePreview'));

export interface BugNav {
  position: { index: number; total: number };
  next: { id: string; title: string } | null;
  track: Track;
}

interface Props {
  bug: Bug;
  nav: BugNav;
}

export default function BugPlayer({ bug, nav }: Props) {
  const firstFile = useMemo(() => {
    const keys = Object.keys(bug.files.starter);
    return keys[0] ?? 'index.js';
  }, [bug]);

  const starterCode = bug.files.starter[firstFile] ?? '';

  const [code, setCode] = useState<string>(() => {
    const saved = getSavedCode(bug.meta.id);
    return saved ?? starterCode;
  });
  const [editorKey, setEditorKey] = useState(0);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [completedBefore, setCompletedBefore] = useState<boolean>(() => isCompleted(bug.meta.id));
  const hintState = useHintState(bug.meta.id, bug.files.hints.length);
  const [vimMode, setVimMode] = useState(() => readEditorPrefs().vimMode);
  const [showPreview, setShowPreview] = useState(() => readEditorPrefs().showPreview);
  const isReact = bug.meta.runner !== 'js-iframe';
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const language = firstFile.endsWith('.tsx') || firstFile.endsWith('.jsx') ? 'jsx' : 'js';

  useEffect(() => {
    const timer = setTimeout(() => {
      saveCode(bug.meta.id, code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code, bug.meta.id]);

  useEffect(() => {
    try {
      localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify({ vimMode, showPreview }));
    } catch {}
  }, [vimMode, showPreview]);

  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsOpen]);

  const handleResult = useCallback(
    (r: RunResult) => {
      setResult(r);
      setRunning(false);
      if (r.passed) {
        markCompleted(bug.meta.id, hintState.revealed);
        setCompletedBefore(true);
      }
    },
    [bug.meta.id, hintState.revealed],
  );

  const handleReset = useCallback(() => {
    setCode(starterCode);
    clearSavedCode(bug.meta.id);
    setResult(null);
    setCompletedBefore(false);
    setEditorKey((k) => k + 1);
  }, [bug.meta.id, starterCode]);

  const showSuccess = result ? result.passed : completedBefore;
  const isDirty = code !== starterCode;

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_440px]">
      <div className="flex flex-col border-r border-neutral-200 dark:border-neutral-800">
        <header className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-3">
              <a
                href={`/tracks/${nav.track}`}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                ← Track
              </a>
              <span className="font-mono text-xs text-neutral-400">
                {nav.position.index} / {nav.position.total}
              </span>
              {completedBefore && (
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ solved
                </span>
              )}
            </div>
            <h1 className="truncate text-lg font-semibold">{bug.meta.title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div ref={settingsRef} className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen((o) => !o)}
                aria-label="Editor settings"
                className={`rounded-md px-2.5 py-2 transition ${
                  settingsOpen
                    ? 'text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 01-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 01.872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 012.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 012.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 01.872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 01-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 01-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 110-5.86 2.929 2.929 0 010 5.858z" />
                </svg>
              </button>
              {settingsOpen && (
                <div className="absolute right-0 top-full z-40 mt-1 w-52 rounded-xl border border-neutral-200 bg-white/95 shadow-xl backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/95">
                  <div className="p-4">
                    <p className="mb-3 font-mono text-[11px] text-neutral-400">editor settings</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">Vim mode</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={vimMode}
                        onClick={() => setVimMode((v) => !v)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          vimMode
                            ? 'bg-neutral-900 dark:bg-white'
                            : 'bg-neutral-200 dark:bg-neutral-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full shadow transition-transform ${vimMode ? 'bg-neutral-300 dark:bg-neutral-600' : 'bg-white dark:bg-neutral-200'}`}
                          style={{ transform: vimMode ? 'translateX(18px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </div>
                    {vimMode && (
                      <p className="mt-2 font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
                        <kbd className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-neutral-800">
                          i
                        </kbd>{' '}
                        to type ·{' '}
                        <kbd className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-neutral-800">
                          Esc
                        </kbd>{' '}
                        for normal mode
                      </p>
                    )}
                    {isReact && (
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          Live preview
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={showPreview}
                          onClick={() => setShowPreview((v) => !v)}
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                            showPreview
                              ? 'bg-neutral-900 dark:bg-white'
                              : 'bg-neutral-200 dark:bg-neutral-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full shadow transition-transform ${showPreview ? 'bg-neutral-300 dark:bg-neutral-600' : 'bg-white dark:bg-neutral-200'}`}
                            style={{ transform: showPreview ? 'translateX(18px)' : 'translateX(2px)' }}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty}
              className="rounded-md px-3 py-2 text-xs text-neutral-500 transition hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-neutral-100"
              title="Restore the starter code"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setRunning(true)}
              disabled={running}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {running ? 'Running…' : 'Run tests'}
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1">
          <Editor key={editorKey} value={code} onChange={setCode} language={language} vimMode={vimMode} />
        </div>
      </div>

      <aside className="flex max-h-screen flex-col overflow-auto">
        <div
          className="markdown border-b border-neutral-200 px-6 py-4 dark:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(bug.files.readme) }}
        />

        <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <HintPanel hints={bug.files.hints} state={hintState} />
        </div>

        {isReact && showPreview && (
          <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <p className="mb-3 font-mono text-[11px] text-neutral-400">live preview</p>
            <Suspense fallback={<div className="h-[220px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />}>
              <LivePreview files={{ ...bug.files.starter, [firstFile]: code }} />
            </Suspense>
          </div>
        )}

        <div className="flex-1 px-6 py-4">
          <Suspense fallback={<p className="text-sm text-neutral-500">Loading runner…</p>}>
            {bug.meta.runner === 'js-iframe' ? (
              <JsRunner code={code} tests={bug.files.tests} run={running} onResult={handleResult} />
            ) : (
              <ReactRunner
                files={{ ...bug.files.starter, [firstFile]: code }}
                tests={bug.files.tests}
                run={running}
                onResult={handleResult}
              />
            )}
          </Suspense>

          {result && <TestResults result={result} />}
        </div>

        {showSuccess && (
          <div className="space-y-4 border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <ConceptCard markdown={bug.files.concept} />
            {nav.next ? (
              <a
                href={`/bugs/${nav.next.id}`}
                className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Next: {nav.next.title} →
              </a>
            ) : (
              <a
                href={`/tracks/${nav.track}`}
                className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
              >
                You finished the track →
              </a>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
