// Entry source (as a string) injected as the Sandpack project's entry point.
// Order: harness loads first (sets globals) → tests load (registers test()
// calls) → then we kick off the runner.
//
// Wrapped in an async IIFE so we don't depend on top-level-await support in
// Sandpack's output bundle format.

export const ENTRY_SOURCE = `
(async () => {
  try {
    await import('./harness');
    await import('./tests');
    await window.__breakpointRun();
  } catch (e) {
    window.parent.postMessage({
      type: 'breakpoint:result',
      result: {
        passed: false,
        total: 0,
        passedCount: 0,
        failures: [],
        logs: [],
        errors: [(e && e.message) ? e.message : String(e)],
        durationMs: 0,
      },
    }, '*');
  }
})();
`;
