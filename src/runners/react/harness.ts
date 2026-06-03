export const HARNESS_SOURCE = `
import { createRoot } from 'react-dom/client';

const logs = [];
const errors = [];
const failures = [];
const tests = [];
const startTime = performance.now();

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

window.getLogs = () => logs.slice();
window.clearLogs = () => { logs.length = 0; };

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

let container = null;
let root = null;

window.assert = {
  ok: (cond, msg) => {
    if (!cond) throw new Error(msg || 'Expected truthy, got ' + String(cond));
  },
  equal: (a, b, msg) => {
    if (a !== b) throw new Error(msg || 'Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a));
  },
  deepEqual: (a, b, msg) => {
    if (!deepEqual(a, b)) {
      throw new Error(msg || 'Deep equal failed:\\n  expected: ' + JSON.stringify(b) + '\\n  actual:   ' + JSON.stringify(a));
    }
  },
  throws: (fn, msg) => {
    try { fn(); } catch { return; }
    throw new Error(msg || 'Expected function to throw');
  },
};

window.test = (name, fn) => { tests.push({ name, fn }); };

window.wait = (ms) => new Promise((r) => setTimeout(r, ms));

window.cleanup = () => {
  if (root) { root.unmount(); root = null; }
  if (container) { container.remove(); container = null; }
};

window.render = (element) => {
  window.cleanup();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  root.render(element);
};

function matches(content, text) {
  if (typeof text === 'string') return content.trim() === text.trim();
  return text.test(content);
}

const screenImpl = {
  queryByText: (text) => {
    if (!container) return null;
    for (const el of container.querySelectorAll('*')) {
      const directText = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent || '')
        .join('');
      if (directText.trim() && matches(directText.trim(), text)) return el;
    }
    return null;
  },
  getByText: (text) => {
    const el = screenImpl.queryByText(text);
    if (!el) throw new Error('Could not find text matching: ' + String(text));
    return el;
  },
  queryByRole: (role) => container ? container.querySelector('[role="' + role + '"]') : null,
  queryAllByRole: (role) => container ? Array.from(container.querySelectorAll('[role="' + role + '"]')) : [],
  queryByLabelText: (label) => {
    if (!container) return null;
    const labels = container.querySelectorAll('label');
    for (const lbl of labels) {
      if (matches(lbl.textContent || '', label)) {
        const forAttr = lbl.getAttribute('for');
        if (forAttr) return container.querySelector('#' + forAttr);
        return lbl.querySelector('input, textarea, select');
      }
    }
    return null;
  },
  container: () => container,
};

try {
  Object.defineProperty(window, 'screen', {
    value: screenImpl,
    writable: true,
    configurable: true,
  });
} catch (e) {
  window.__screen = screenImpl;
}

function setNativeValue(el, value) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
  if (descriptor && descriptor.set) descriptor.set.call(el, value);
  else el.value = value;
}

window.fireEvent = {
  click: (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })),
  change: (el, opts) => {
    if (opts && opts.target && 'value' in opts.target) setNativeValue(el, opts.target.value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  },
  submit: (el) => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
  keyDown: (el, opts) => el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ...(opts || {}) })),
};

window.__breakpointRun = async () => {
  for (const t of tests) {
    window.cleanup();
    try {
      const r = t.fn();
      if (r && typeof r.then === 'function') await r;
    } catch (e) {
      failures.push({
        name: t.name,
        message: (e && e.message) ? e.message : String(e),
      });
    }
  }
  window.cleanup();
  const passedCount = tests.length - failures.length;
  window.parent.postMessage({
    type: 'breakpoint:result',
    result: {
      passed: failures.length === 0 && tests.length > 0,
      total: tests.length,
      passedCount,
      failures,
      logs,
      errors,
      durationMs: Math.round(performance.now() - startTime),
    },
  }, '*');
};
`;
