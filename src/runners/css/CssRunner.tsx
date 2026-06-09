import { useEffect, useRef } from 'react';
import type { RunResult } from '@/lib/types';
import { CSS_HARNESS_SCRIPT } from './harness';

interface Props {
  html: string;
  css: string;
  js: string;
  tests: string;
  run: boolean;
  onResult: (r: RunResult) => void;
}

function buildDoc(html: string, css: string, js: string, tests: string, runTests: boolean) {
  return `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; color: #111111; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; }
  ${css}
</style>
</head><body>
${html}
<script>${CSS_HARNESS_SCRIPT}</script>
<script>
try {
${js}
} catch (e) {
  console.error('user script error: ' + (e && e.message ? e.message : String(e)));
}
</script>
<script>
${tests}
${runTests ? 'window.__breakpointRun();' : ''}
</script>
</body></html>`;
}

export default function CssRunner({ html, css, js, tests, run, onResult }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastRenderedRef = useRef<{ key: string; run: boolean } | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const key = `${html}\0${css}\0${js}\0${tests}`;
    const last = lastRenderedRef.current;
    const isFirst = last === null;
    const sameKey = last !== null && last.key === key;
    const runStarted = last !== null && !last.run && run;

    // The iframe already reflects this content. The run flag flipping back to
    // false after a test finishes doesn't warrant a reload — the rendered DOM
    // is the same; only the (already-fired) autostart line differs.
    if (sameKey && !runStarted) return;

    const delay = isFirst || runStarted ? 0 : 250;
    const t = setTimeout(() => {
      iframe.srcdoc = buildDoc(html, css, js, tests, run);
      lastRenderedRef.current = { key, run };
    }, delay);
    return () => clearTimeout(t);
  }, [html, css, js, tests, run]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const iframe = iframeRef.current;
      if (!iframe || e.source !== iframe.contentWindow) return;
      const data = e.data as { type?: string; result?: RunResult };
      if (data?.type === 'breakpoint:result' && data.result) {
        onResult(data.result);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onResult]);

  return (
    <iframe
      ref={iframeRef}
      title="css sandbox"
      sandbox="allow-scripts"
      className="block w-full rounded border border-neutral-200 bg-white dark:border-neutral-800"
      style={{ height: 320 }}
    />
  );
}
