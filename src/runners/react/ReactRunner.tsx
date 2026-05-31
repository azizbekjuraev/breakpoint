import type { RunResult } from '@/lib/types';

interface Props {
  files: Record<string, string>;
  tests: string;
  run: boolean;
  onResult: (r: RunResult) => void;
}

// Stub: React-track runner is not implemented in the MVP scaffold.
// Wire up @codesandbox/sandpack-react here when authoring the first React bug.
// Sandpack is lazy-loaded only on react-track bug pages, keeping the JS-track
// bundle well under budget.
export default function ReactRunner(_props: Props) {
  return (
    <div className="text-sm text-neutral-500 italic">
      React runner stub — implement with Sandpack when the first React bug lands.
    </div>
  );
}
