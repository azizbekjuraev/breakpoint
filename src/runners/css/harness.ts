export const CSS_HARNESS_SCRIPT = `
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

  function approxEqual(a, b, tol) {
    return Math.abs(a - b) <= tol;
  }

  const assert = {
    ok: (cond, msg) => {
      if (!cond) throw new Error(msg || 'Expected truthy, got ' + String(cond));
    },
    equal: (a, b, msg) => {
      if (a !== b) throw new Error(msg || 'Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a));
    },
    close: (a, b, tol, msg) => {
      const t = typeof tol === 'number' ? tol : 1;
      if (!approxEqual(a, b, t)) {
        throw new Error(msg || 'Expected ' + a + ' to be within ' + t + ' of ' + b);
      }
    },
    throws: (fn, msg) => {
      try { fn(); } catch { return; }
      throw new Error(msg || 'Expected function to throw');
    },
  };

  function $(selector) {
    const el = document.querySelector(selector);
    if (!el) throw new Error('No element matches selector: ' + selector);
    return el;
  }
  function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  }
  function rect(target) {
    const el = typeof target === 'string' ? $(target) : target;
    return el.getBoundingClientRect();
  }
  function style(target, prop) {
    const el = typeof target === 'string' ? $(target) : target;
    return getComputedStyle(el).getPropertyValue(prop);
  }
  function center(target) {
    const r = rect(target);
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function test(name, fn) {
    tests.push({ name, fn });
  }
  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  window.test = test;
  window.assert = assert;
  window.wait = wait;
  window.$ = $;
  window.$$ = $$;
  window.rect = rect;
  window.style = style;
  window.center = center;
  window.getLogs = () => logs.slice();
  window.clearLogs = () => { logs.length = 0; };

  window.__breakpointRun = async () => {
    // Allow one paint frame so layout is stable before measuring.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
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
