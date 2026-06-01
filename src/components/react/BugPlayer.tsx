import { useState, useMemo, useEffect, lazy, Suspense, useCallback } from 'react';
import type { Bug, RunResult, Track } from '@/lib/types';
import Editor from './Editor';
import HintPanel from './HintPanel';
import ConceptCard from './ConceptCard';
import TestResults from './TestResults';
import {
  markCompleted,
  isCompleted,
  saveCode,
  getSavedCode,
  clearSavedCode,
} from '@/lib/progress';
import { useHintState } from '@/lib/hint-state';
import { renderMarkdown } from '@/lib/markdown';

const JsRunner = lazy(() => import('@/runners/js/JsRunner'));
const ReactRunner = lazy(() => import('@/runners/react/ReactRunner'));

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
  const [completedBefore, setCompletedBefore] = useState<boolean>(() =>
    isCompleted(bug.meta.id),
  );
  const hintState = useHintState(bug.meta.id, bug.files.hints.length);

  const language = firstFile.endsWith('.tsx') || firstFile.endsWith('.jsx') ? 'jsx' : 'js';

  // Debounced save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCode(bug.meta.id, code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code, bug.meta.id]);

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
    <div className="grid lg:grid-cols-[1fr_440px] min-h-screen">
      <div className="flex flex-col border-r border-neutral-200 dark:border-neutral-800">
        <header className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <a
                href={`/tracks/${nav.track}`}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                ← Track
              </a>
              <span className="text-xs font-mono text-neutral-400">
                {nav.position.index} / {nav.position.total}
              </span>
              {completedBefore && (
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  ✓ solved
                </span>
              )}
            </div>
            <h1 className="text-lg font-semibold truncate">{bug.meta.title}</h1>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty}
              className="text-xs px-3 py-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Restore the starter code"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setRunning(true)}
              disabled={running}
              className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 disabled:opacity-50 transition"
            >
              {running ? 'Running…' : 'Run tests'}
            </button>
          </div>
        </header>

        <div className="flex-1 min-h-0">
          <Editor key={editorKey} value={code} onChange={setCode} language={language} />
        </div>
      </div>

      <aside className="flex flex-col max-h-screen overflow-auto">
        <div
          className="px-6 py-4 markdown border-b border-neutral-200 dark:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(bug.files.readme) }}
        />

        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <HintPanel hints={bug.files.hints} state={hintState} />
        </div>

        <div className="px-6 py-4 flex-1">
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
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <ConceptCard markdown={bug.files.concept} />
            {nav.next ? (
              <a
                href={`/bugs/${nav.next.id}`}
                className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
              >
                Next: {nav.next.title} →
              </a>
            ) : (
              <a
                href={`/tracks/${nav.track}`}
                className="inline-flex items-center px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
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
