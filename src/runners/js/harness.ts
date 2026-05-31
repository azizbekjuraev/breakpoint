// Harness injected into the sandboxed iframe. Defines the test API,
// captures console output, runs registered tests, posts results to parent.
// Kept as a plain string so it embeds cleanly into the iframe srcdoc.

export const HARNESS_SCRIPT = `
(() => {
  const logs = [];
  const errors = [];
  const failures = [];
  const tests = [];
  const start = performance.now();

  const origLog = console.log;
  const origError = console.error;
  console.log = (...args) => {
    logs.push(args.map((a) => typeof a === 'string' ? a : (() => {
      try { return JSON.stringify(a); } catch { return String(a); }
    })()).join(' '));
    origLog.apply(console, args);
  };
  console.error = (...args) => {
    errors.push(args.map((a) => String(a)).join(' '));
    origError.apply(console, args);
  };

  window.addEventListener('error', (e) => errors.push(e.message));
  window.addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return false;
    if (typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const ak = Object.keys(a), bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    return ak.every((k) => deepEqual(a[k], b[k]));
  }

  const assert = {
    ok: (cond, msg) => {
      if (!cond) throw new Error(msg || 'Expected truthy, got ' + String(cond));
    },
    equal: (a, b, msg) => {
      if (a !== b) throw new Error(msg || 'Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a));
    },
    deepEqual: (a, b, msg) => {
      if (!deepEqual(a, b)) {
        throw new Error(msg || 'Expected deep equal:\\n  expected: ' + JSON.stringify(b) + '\\n  actual:   ' + JSON.stringify(a));
      }
    },
    throws: (fn, msg) => {
      try { fn(); } catch { return; }
      throw new Error(msg || 'Expected function to throw');
    },
  };

  function test(name, fn) {
    tests.push({ name, fn });
  }

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function getLogs() { return logs.slice(); }
  function clearLogs() { logs.length = 0; }

  window.test = test;
  window.assert = assert;
  window.wait = wait;
  window.getLogs = getLogs;
  window.clearLogs = clearLogs;

  window.__breakpointRun = async () => {
    for (const t of tests) {
      try {
        const r = t.fn();
        if (r && typeof r.then === 'function') await r;
      } catch (e) {
        failures.push({
          name: t.name,
          message: e && e.message ? e.message : String(e),
        });
      }
    }
    const passedCount = tests.length - failures.length;
    parent.postMessage({
      type: 'breakpoint:result',
      result: {
        passed: failures.length === 0 && tests.length > 0,
        total: tests.length,
        passedCount,
        failures,
        logs,
        errors,
        durationMs: Math.round(performance.now() - start),
      },
    }, '*');
  };
})();
`;
