import axeSource from 'axe-core/axe.min.js?raw';

const HELPERS = `
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

  const assert = {
    ok: (cond, msg) => {
      if (!cond) throw new Error(msg || 'Expected truthy, got ' + String(cond));
    },
    equal: (a, b, msg) => {
      if (a !== b) throw new Error(msg || 'Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a));
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

  function describeViolations(violations) {
    if (!violations || violations.length === 0) return 'no violations';
    return violations.map((v) => {
      const targets = v.nodes
        .slice(0, 3)
        .map((n) => '<' + (n.target && n.target[0] ? n.target[0] : '?') + '>')
        .join(', ');
      const more = v.nodes.length > 3 ? ' (+' + (v.nodes.length - 3) + ' more)' : '';
      return '[' + v.id + '] ' + v.help + ' on ' + targets + more;
    }).join(' | ');
  }

  async function axeRun(rules) {
    const options = { resultTypes: ['violations'] };
    if (Array.isArray(rules) && rules.length > 0) {
      options.runOnly = { type: 'rule', values: rules };
    }
    return await window.axe.run(document.body, options);
  }

  async function assertAxePasses(rules) {
    const result = await axeRun(rules);
    if (result.violations.length > 0) {
      throw new Error('axe found violations — ' + describeViolations(result.violations));
    }
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
  window.axeRun = axeRun;
  window.assertAxePasses = assertAxePasses;
  window.getLogs = () => logs.slice();
  window.clearLogs = () => { logs.length = 0; };

  window.__breakpointRun = async () => {
    // Allow one paint frame so layout is stable before axe walks the tree.
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

export const A11Y_HARNESS_SCRIPT = `${axeSource}\n${HELPERS}`;
