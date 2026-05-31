import type { RunResult } from '@/lib/types';

interface Props {
  result: RunResult;
}

export default function TestResults({ result }: Props) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            result.passed ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        <p className="text-sm font-medium">
          {result.passedCount} / {result.total} passing
          <span className="text-neutral-500 font-normal"> · {result.durationMs}ms</span>
        </p>
      </div>

      {result.failures.length > 0 && (
        <div className="mb-3 space-y-1">
          {result.failures.map((f, i) => (
            <details key={i} className="text-sm border-l-2 border-red-400 pl-3">
              <summary className="cursor-pointer font-medium text-red-600 dark:text-red-400">
                {f.name}
              </summary>
              <pre className="mt-1 text-xs whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                {f.message}
              </pre>
            </details>
          ))}
        </div>
      )}

      {result.errors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs uppercase tracking-wide text-red-600 dark:text-red-400 font-semibold mb-1">
            Errors
          </p>
          <pre className="text-xs whitespace-pre-wrap text-red-700 dark:text-red-300">
            {result.errors.join('\n')}
          </pre>
        </div>
      )}

      {result.logs.length > 0 && (
        <details>
          <summary className="text-xs uppercase tracking-wide text-neutral-500 cursor-pointer">
            Console ({result.logs.length})
          </summary>
          <pre className="mt-1 text-xs whitespace-pre-wrap text-neutral-600 dark:text-neutral-400">
            {result.logs.join('\n')}
          </pre>
        </details>
      )}
    </div>
  );
}
