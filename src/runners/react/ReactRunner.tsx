import { useEffect, useState } from 'react';
import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';
import type { RunResult } from '@/lib/types';
import { HARNESS_SOURCE } from './harness';
import { ENTRY_SOURCE } from './entry';

interface Props {
  files: Record<string, string>;
  tests: string;
  run: boolean;
  onResult: (r: RunResult) => void;
}

interface RunInstance {
  files: Record<string, string>;
  tests: string;
  id: number;
}

const RUN_TIMEOUT_MS = 30000;

export default function ReactRunner({ files, tests, run, onResult }: Props) {
  const [instance, setInstance] = useState<RunInstance | null>(null);

  useEffect(() => {
    if (run) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInstance({ files, tests, id: Date.now() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  useEffect(() => {
    if (!instance) return;

    let resolved = false;

    function onMessage(e: MessageEvent) {
      const data = e.data as { type?: string; result?: RunResult } | null;
      if (data?.type === 'breakpoint:result' && data.result) {
        if (resolved) return;
        resolved = true;
        onResult(data.result);
      }
    }
    window.addEventListener('message', onMessage);

    const timeout = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      onResult({
        passed: false,
        total: 0,
        passedCount: 0,
        failures: [],
        logs: [],
        errors: [
          'Tests timed out after ' +
            Math.round(RUN_TIMEOUT_MS / 1000) +
            's. The sandbox may have failed to compile, or your code has an infinite loop.',
        ],
        durationMs: RUN_TIMEOUT_MS,
      });
    }, RUN_TIMEOUT_MS);

    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(timeout);
    };
  }, [instance, onResult]);

  if (!instance) {
    return (
      <p className="text-sm text-neutral-500">
        Click <span className="font-mono">Run tests</span> to boot the React sandbox.
      </p>
    );
  }

  const sandpackFiles: Record<string, string> = {
    '/index.tsx': ENTRY_SOURCE,
    '/harness.tsx': HARNESS_SOURCE,
    '/tests.tsx': instance.tests,
  };
  for (const [name, content] of Object.entries(instance.files)) {
    const path = name.startsWith('/') ? name : '/' + name;
    sandpackFiles[path] = content;
  }

  return (
    <div className="text-xs text-neutral-500">
      {run && <p className="mb-2">Sandbox running…</p>}
      <div
        className="overflow-hidden rounded border border-neutral-200 dark:border-neutral-800"
        style={{ height: 1 }}
      >
        <SandpackProvider
          key={instance.id}
          template="react-ts"
          files={sandpackFiles}
          options={{
            autorun: true,
            recompileMode: 'immediate',
          }}
          customSetup={{
            entry: '/index.tsx',
            dependencies: {
              react: '^18.0.0',
              'react-dom': '^18.0.0',
            },
          }}
        >
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
            showNavigator={false}
            showSandpackErrorOverlay={false}
            style={{ height: 1, opacity: 0 }}
          />
        </SandpackProvider>
      </div>
    </div>
  );
}
