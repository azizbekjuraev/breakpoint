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
