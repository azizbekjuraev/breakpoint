import { useEffect } from 'react';
import type { RunResult } from '@/lib/types';
import { runTsTests } from './harness';

interface Props {
  code: string;
  tests: string;
  run: boolean;
  onResult: (r: RunResult) => void;
}

export default function TsRunner({ code, tests, run, onResult }: Props) {
  useEffect(() => {
    if (!run) return;
    let cancelled = false;
    runTsTests(code, tests).then((result) => {
      if (!cancelled) onResult(result);
    });
    return () => {
      cancelled = true;
    };
  }, [run, code, tests, onResult]);

  return null;
}
