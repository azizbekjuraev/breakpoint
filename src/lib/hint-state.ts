import { useState, useEffect } from 'react';
import { getHintsRevealed, revealHint } from './progress';

export interface HintState {
  revealed: number;
  canRevealMore: boolean;
  next: () => void;
}

export function useHintState(bugId: string, totalHints: number): HintState {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(getHintsRevealed(bugId));
  }, [bugId]);

  function next() {
    setRevealed((prev) => {
      if (prev >= totalHints) return prev;
      const newLevel = prev + 1;
      revealHint(bugId, newLevel);
      return newLevel;
    });
  }

  return { revealed, canRevealMore: revealed < totalHints, next };
}
