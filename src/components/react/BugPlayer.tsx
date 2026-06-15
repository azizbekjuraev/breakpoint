import { useState, useMemo, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import type { Bug, RunResult, Track } from '@/lib/types';
import Editor from './Editor';
import HintPanel from './HintPanel';
import ConceptCard from './ConceptCard';
import TestResults from './TestResults';
import CommandPalette, { type PaletteAction, type PaletteBug } from './CommandPalette';
import ShortcutOverlay from './ShortcutOverlay';
import {
  markCompleted,
  isCompleted,
  saveCode,
  getSavedCode,
  clearSavedCode,
  markEdited,
  clearStart,
  getCompletedIds,
} from '@/lib/progress';
import { useHintState } from '@/lib/hint-state';
import { renderMarkdown } from '@/lib/markdown';
import { useKeyboardShortcuts, type ShortcutSpec } from '@/lib/use-keyboard-shortcuts';

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
const CssRunner = lazy(() => import('@/runners/css/CssRunner'));
const A11yRunner = lazy(() => import('@/runners/a11y/A11yRunner'));
const TsRunner = lazy(() => import('@/runners/ts/TsRunner'));
const LivePreview = lazy(() => import('@/runners/react/LivePreview'));

export interface BugNav {
  position: { index: number; total: number };
  next: { id: string; title: string } | null;
  track: Track;
  level: { slug: string; label: string };
  levelBugs: Array<{ id: string; title: string }>;
  allBugs: PaletteBug[];
}

interface Props {
  bug: Bug;
  nav: BugNav;
}

export default function BugPlayer({ bug, nav }: Props) {
  const editorFile = useMemo(() => {
    const keys = Object.keys(bug.files.starter);
    if (bug.meta.runner === 'css-iframe') {
      return keys.find((k) => k.endsWith('.css')) ?? keys[0] ?? 'styles.css';
    }
    if (bug.meta.runner === 'a11y-iframe') {
      return keys.find((k) => k.endsWith('.html')) ?? keys[0] ?? 'index.html';
    }
    if (bug.meta.runner === 'ts-typecheck') {
      return keys.find((k) => k.endsWith('.ts')) ?? keys[0] ?? 'main.ts';
    }
    return keys[0] ?? 'index.js';
  }, [bug]);

  const cssFixedFiles = useMemo(() => {
    if (bug.meta.runner !== 'css-iframe') return null;
    let html = '';
    let js = '';
    for (const [name, content] of Object.entries(bug.files.starter)) {
      if (name.endsWith('.html')) html = content;
      else if (name.endsWith('.js')) js = content;
    }
    return { html, js };
  }, [bug]);

  const a11yFixedCss = useMemo(() => {
    if (bug.meta.runner !== 'a11y-iframe') return null;
    for (const [name, content] of Object.entries(bug.files.starter)) {
      if (name.endsWith('.css')) return content;
    }
    return '';
  }, [bug]);

  const starterCode = bug.files.starter[editorFile] ?? '';

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
  const isReact = bug.meta.runner === 'react-sandpack';
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(getCompletedIds()),
  );

  const language: 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'html' = editorFile.endsWith('.css')
    ? 'css'
    : editorFile.endsWith('.html')
      ? 'html'
      : editorFile.endsWith('.tsx')
        ? 'tsx'
        : editorFile.endsWith('.ts')
          ? 'ts'
          : editorFile.endsWith('.jsx')
            ? 'jsx'
            : 'js';

  const initialCodeRef = useRef(code);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveCode(bug.meta.id, code);
      if (code !== starterCode && code !== initialCodeRef.current) {
        markEdited(bug.meta.id, { title: bug.meta.title, track: bug.meta.track });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [code, bug.meta.id, bug.meta.title, bug.meta.track, starterCode]);

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
        setCompletedIds((prev) => {
          if (prev.has(bug.meta.id)) return prev;
          const next = new Set(prev);
          next.add(bug.meta.id);
          return next;
        });
      }
    },
    [bug.meta.id, hintState.revealed],
  );

  const handleReset = useCallback(() => {
    setCode(starterCode);
    clearSavedCode(bug.meta.id);
    clearStart(bug.meta.id);
    setResult(null);
    setCompletedBefore(false);
    setCompletedIds((prev) => {
      if (!prev.has(bug.meta.id)) return prev;
      const next = new Set(prev);
      next.delete(bug.meta.id);
      return next;
    });
    setEditorKey((k) => k + 1);
  }, [bug.meta.id, starterCode]);

  const handleRun = useCallback(() => {
    setRunning((r) => (r ? r : true));
  }, []);

  const nextUnsolvedId = useMemo(() => {
    if (nav.levelBugs.length === 0) return null;
    const currentIdx = nav.levelBugs.findIndex((b) => b.id === bug.meta.id);
    const start = currentIdx === -1 ? 0 : currentIdx + 1;
    const ordered = [
      ...nav.levelBugs.slice(start),
      ...nav.levelBugs.slice(0, start),
    ];
    for (const b of ordered) {
      if (b.id !== bug.meta.id && !completedIds.has(b.id)) return b.id;
    }
    return null;
  }, [nav.levelBugs, bug.meta.id, completedIds]);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const shortcuts = useMemo<ShortcutSpec[]>(() => {
    const list: ShortcutSpec[] = [
      {
        keys: 'Mod+Enter',
        allowInEditor: true,
        handler: () => {
          if (!running) handleRun();
        },
      },
      {
        keys: 'Mod+R',
        allowInEditor: true,
        passthrough: true,
        handler: (e) => {
          const active = document.activeElement;
          const inEditor = active && (active as Element).closest?.('.cm-editor');
          if (!inEditor) return; // let browser reload
          e.preventDefault();
          handleReset();
        },
      },
      {
        keys: 'Mod+K',
        allowInEditor: true,
        handler: () => setPaletteOpen(true),
      },
      {
        keys: '?',
        handler: () => setShortcutsOpen((s) => !s),
      },
      {
        keys: 'g h',
        handler: () => {
          if (hintState.canRevealMore) hintState.next();
          scrollToId('hints-panel');
        },
      },
      {
        keys: 'g c',
        handler: () => scrollToId('concept-panel'),
      },
    ];
    return list;
  }, [handleReset, handleRun, hintState, running, scrollToId]);

  useKeyboardShortcuts(shortcuts);

  const paletteActions = useMemo<PaletteAction[]>(() => {
    const list: PaletteAction[] = [
      {
        id: 'run',
        label: 'Run tests',
        hint: 'Mod+Enter',
        perform: handleRun,
      },
      {
        id: 'reset',
        label: 'Reset to starter code',
        hint: 'Mod+R (in editor)',
        perform: handleReset,
      },
      {
        id: 'hint',
        label: hintState.canRevealMore ? 'Reveal next hint' : 'All hints revealed',
        hint: 'g h',
        perform: () => {
          if (hintState.canRevealMore) hintState.next();
          scrollToId('hints-panel');
        },
      },
      {
        id: 'vim',
        label: vimMode ? 'Disable vim mode' : 'Enable vim mode',
        perform: () => setVimMode((v) => !v),
      },
    ];
    if (isReact) {
      list.push({
        id: 'preview',
        label: showPreview ? 'Hide live preview' : 'Show live preview',
        perform: () => setShowPreview((v) => !v),
      });
    }
    list.push({
      id: 'shortcuts',
      label: 'Show keyboard shortcuts',
      hint: '?',
      perform: () => setShortcutsOpen(true),
    });
    if (nextUnsolvedId) {
      list.push({
        id: 'skip',
        label: 'Skip to next unsolved bug',
        perform: () => {
          window.location.href = `/bugs/${nextUnsolvedId}`;
        },
      });
    }
    return list;
  }, [
    handleRun,
    handleReset,
    hintState,
    isReact,
    nextUnsolvedId,
    scrollToId,
    showPreview,
    vimMode,
  ]);

  const shortcutListings = useMemo(
    () => [
      { keys: 'Mod+Enter', description: 'Run tests' },
      { keys: 'Mod+R', description: 'Reset code (when editor focused)' },
      { keys: 'Mod+K', description: 'Command palette' },
      { keys: '?', description: 'Toggle this overlay' },
      { keys: 'g h', description: 'Reveal next hint' },
      { keys: 'g c', description: 'Jump to concept' },
    ],
    [],
  );

  const showSuccess = result ? result.passed : completedBefore;
  const isDirty = code !== starterCode;

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_440px]">
      <div className="flex min-w-0 flex-col border-r border-neutral-200 dark:border-neutral-800">
        <header className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-3">
              <a
                href={`/tracks/${nav.track}/${nav.level.slug}`}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                ← {nav.level.label}
              </a>
              <span className="font-mono text-xs text-neutral-400">
                {nav.position.index} / {nav.position.total}
              </span>
              {completedBefore && (
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ solved
                </span>
              )}
              {nextUnsolvedId && (
                <a
                  href={`/bugs/${nextUnsolvedId}`}
                  className="font-mono text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  title="Skip to the next unsolved bug in this level"
                >
                  skip →
                </a>
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
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        Vim mode
                      </span>
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
                            style={{
                              transform: showPreview ? 'translateX(18px)' : 'translateX(2px)',
                            }}
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
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              title="Command palette (Cmd+K)"
              className="rounded-md px-2.5 py-2 text-neutral-400 transition hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5L13.5 13.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleRun}
              disabled={running}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {running ? 'Running…' : 'Run tests'}
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1">
          <Editor
            key={editorKey}
            value={code}
            onChange={setCode}
            language={language}
            vimMode={vimMode}
          />
        </div>
      </div>

      <aside className="flex max-h-screen flex-col overflow-auto">
        <div
          className="markdown border-b border-neutral-200 px-6 py-4 dark:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(bug.files.readme) }}
        />

        <div
          id="hints-panel"
          className="scroll-mt-4 border-b border-neutral-200 px-6 py-4 dark:border-neutral-800"
        >
          <HintPanel hints={bug.files.hints} state={hintState} />
        </div>

        {isReact && showPreview && (
          <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <p className="mb-3 font-mono text-[11px] text-neutral-400">live preview</p>
            <Suspense
              fallback={
                <div className="h-[220px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              }
            >
              <LivePreview files={{ ...bug.files.starter, [editorFile]: code }} />
            </Suspense>
          </div>
        )}

        <div className="flex-1 px-6 py-4">
          <Suspense fallback={<p className="text-sm text-neutral-500">Loading runner…</p>}>
            {bug.meta.runner === 'js-iframe' ? (
              <JsRunner code={code} tests={bug.files.tests} run={running} onResult={handleResult} />
            ) : bug.meta.runner === 'react-sandpack' ? (
              <ReactRunner
                files={{ ...bug.files.starter, [editorFile]: code }}
                tests={bug.files.tests}
                run={running}
                onResult={handleResult}
              />
            ) : bug.meta.runner === 'css-iframe' ? (
              <CssRunner
                html={cssFixedFiles?.html ?? ''}
                css={code}
                js={cssFixedFiles?.js ?? ''}
                tests={bug.files.tests}
                run={running}
                onResult={handleResult}
              />
            ) : bug.meta.runner === 'a11y-iframe' ? (
              <A11yRunner
                html={code}
                css={a11yFixedCss ?? ''}
                tests={bug.files.tests}
                run={running}
                onResult={handleResult}
              />
            ) : (
              <TsRunner
                code={code}
                tests={bug.files.tests}
                run={running}
                onResult={handleResult}
              />
            )}
          </Suspense>

          {result && <TestResults result={result} />}
        </div>

        {showSuccess && (
          <div
            id="concept-panel"
            className="scroll-mt-4 space-y-4 border-t border-neutral-200 px-6 py-4 dark:border-neutral-800"
          >
            <ConceptCard markdown={bug.files.concept} />
            {nav.next ? (
              <a
                href={`/bugs/${nav.next.id}`}
                className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Next →
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

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        bugs={nav.allBugs}
        currentBugId={bug.meta.id}
        actions={paletteActions}
        completedIds={completedIds}
      />
      <ShortcutOverlay
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        shortcuts={shortcutListings}
      />
    </div>
  );
}
