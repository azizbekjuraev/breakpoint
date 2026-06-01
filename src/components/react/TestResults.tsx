import type { RunResult } from '@/lib/types';

interface Props {
  result: RunResult;
}

export default function TestResults({ result }: Props) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            result.passed ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        <p className="text-sm font-medium">
          {result.passedCount} / {result.total} passing
          <span className="font-normal text-neutral-500"> · {result.durationMs}ms</span>
        </p>
      </div>

      {result.failures.length > 0 && (
        <div className="mb-3 space-y-1">
          {result.failures.map((f, i) => (
            <details key={i} className="border-l-2 border-red-400 pl-3 text-sm">
              <summary className="cursor-pointer font-medium text-red-600 dark:text-red-400">
                {f.name}
              </summary>
              <pre className="mt-1 whitespace-pre-wrap text-xs text-neutral-700 dark:text-neutral-300">
                {f.message}
              </pre>
            </details>
          ))}
        </div>
      )}

      {result.errors.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
            Errors
          </p>
          <pre className="whitespace-pre-wrap text-xs text-red-700 dark:text-red-300">
            {result.errors.join('\n')}
          </pre>
        </div>
      )}

      {result.logs.length > 0 && (
        <details>
          <summary className="cursor-pointer text-xs uppercase tracking-wide text-neutral-500">
            Console ({result.logs.length})
          </summary>
          <pre className="mt-1 whitespace-pre-wrap text-xs text-neutral-600 dark:text-neutral-400">
            {result.logs.join('\n')}
          </pre>
        </details>
      )}
    </div>
  );
}
