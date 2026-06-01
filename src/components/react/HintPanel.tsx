import type { HintState } from '@/lib/hint-state';

interface Props {
  hints: string[];
  state: HintState;
}

export default function HintPanel({ hints, state }: Props) {
  if (hints.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Hints</h3>
        <span className="text-xs text-neutral-500">
          {state.revealed} / {hints.length} revealed
        </span>
      </div>
      <ol className="mb-3 space-y-2">
        {hints.slice(0, state.revealed).map((hint, i) => (
          <li
            key={i}
            className="border-l-2 border-amber-400 pl-4 text-sm text-neutral-700 dark:text-neutral-300"
          >
            {hint}
          </li>
        ))}
      </ol>
      {state.canRevealMore ? (
        <button
          type="button"
          onClick={state.next}
          className="text-xs text-neutral-500 underline hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          Reveal next hint
        </button>
      ) : (
        <p className="text-xs text-neutral-400">All hints revealed.</p>
      )}
    </div>
  );
}
