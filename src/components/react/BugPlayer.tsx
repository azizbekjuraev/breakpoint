import { useState, useMemo, useEffect, lazy, Suspense, useCallback } from 'react';
import type { Bug, RunResult, Track } from '@/lib/types';
import Editor from './Editor';
import HintPanel from './HintPanel';
import ConceptCard from './ConceptCard';
import TestResults from './TestResults';
import { markCompleted, isCompleted, saveCode, getSavedCode, clearSavedCode } from '@/lib/progress';
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
  const [completedBefore, setCompletedBefore] = useState<boolean>(() => isCompleted(bug.meta.id));
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
          <Editor key={editorKey} value={code} onChange={setCode} language={language} />
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
