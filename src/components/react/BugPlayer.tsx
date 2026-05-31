import { useState, useMemo, lazy, Suspense, useCallback } from 'react';
import type { Bug, RunResult } from '@/lib/types';
import Editor from './Editor';
import HintPanel from './HintPanel';
import ConceptCard from './ConceptCard';
import TestResults from './TestResults';
import { markCompleted } from '@/lib/progress';
import { useHintState } from '@/lib/hint-state';
import { renderMarkdown } from '@/lib/markdown';

const JsRunner = lazy(() => import('@/runners/js/JsRunner'));
const ReactRunner = lazy(() => import('@/runners/react/ReactRunner'));

interface Props {
  bug: Bug;
}

export default function BugPlayer({ bug }: Props) {
  const firstFile = useMemo(() => {
    const keys = Object.keys(bug.files.starter);
    return keys[0] ?? 'index.js';
  }, [bug]);

  const [code, setCode] = useState(bug.files.starter[firstFile] ?? '');
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const hintState = useHintState(bug.meta.id, bug.files.hints.length);

  const passed = result?.passed === true;
  const language = firstFile.endsWith('.tsx') || firstFile.endsWith('.jsx') ? 'jsx' : 'js';

  const handleResult = useCallback(
    (r: RunResult) => {
      setResult(r);
      setRunning(false);
      if (r.passed) markCompleted(bug.meta.id, hintState.revealed);
    },
    [bug.meta.id, hintState.revealed],
  );

  return (
    <div className="grid lg:grid-cols-[1fr_440px] min-h-screen">
      <div className="flex flex-col border-r border-neutral-200 dark:border-neutral-800">
        <header className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <a href="/tracks" className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
              ← Tracks
            </a>
            <p className="font-mono text-xs text-neutral-500 mt-1">{bug.meta.id}</p>
            <h1 className="text-lg font-semibold truncate">{bug.meta.title}</h1>
          </div>
          <button
            type="button"
            onClick={() => setRunning(true)}
            disabled={running}
            className="shrink-0 px-4 py-2 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 disabled:opacity-50 transition"
          >
            {running ? 'Running…' : 'Run tests'}
          </button>
        </header>

        <div className="flex-1 min-h-0">
          <Editor value={code} onChange={setCode} language={language} />
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

        {passed && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
            <ConceptCard markdown={bug.files.concept} />
          </div>
        )}
      </aside>
    </div>
  );
}
