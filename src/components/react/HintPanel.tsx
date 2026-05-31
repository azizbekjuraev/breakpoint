import type { HintState } from '@/lib/hint-state';

interface Props {
  hints: string[];
  state: HintState;
}

export default function HintPanel({ hints, state }: Props) {
  if (hints.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Hints</h3>
        <span className="text-xs text-neutral-500">
          {state.revealed} / {hints.length} revealed
        </span>
      </div>
      <ol className="space-y-2 mb-3">
        {hints.slice(0, state.revealed).map((hint, i) => (
          <li
            key={i}
            className="text-sm text-neutral-700 dark:text-neutral-300 pl-4 border-l-2 border-amber-400"
          >
            {hint}
          </li>
        ))}
      </ol>
      {state.canRevealMore ? (
        <button
          type="button"
          onClick={state.next}
          className="text-xs underline text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          Reveal next hint
        </button>
      ) : (
        <p className="text-xs text-neutral-400">All hints revealed.</p>
      )}
    </div>
  );
}
