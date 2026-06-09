import { useEffect, useRef } from 'react';
import type { RunResult } from '@/lib/types';
import { A11Y_HARNESS_SCRIPT } from './harness';

interface Props {
  html: string;
  css: string;
  tests: string;
  run: boolean;
  onResult: (r: RunResult) => void;
}

function buildDoc(html: string, css: string, tests: string, runTests: boolean) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><title>preview</title>
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; color: #111111; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; }
  ${css}
</style>
</head><body>
${html}
<script>${A11Y_HARNESS_SCRIPT}</script>
<script>
${tests}
${runTests ? 'window.__breakpointRun();' : ''}
</script>
</body></html>`;
}

export default function A11yRunner({ html, css, tests, run, onResult }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastRenderedRef = useRef<{ key: string; run: boolean } | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const key = `${html}\0${css}\0${tests}`;
    const last = lastRenderedRef.current;
    const isFirst = last === null;
    const sameKey = last !== null && last.key === key;
    const runStarted = last !== null && !last.run && run;

    if (sameKey && !runStarted) return;

    const delay = isFirst || runStarted ? 0 : 250;
    const t = setTimeout(() => {
      iframe.srcdoc = buildDoc(html, css, tests, run);
      lastRenderedRef.current = { key, run };
    }, delay);
    return () => clearTimeout(t);
  }, [html, css, tests, run]);

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
      title="a11y sandbox"
      sandbox="allow-scripts"
      className="block w-full rounded border border-neutral-200 bg-white dark:border-neutral-800"
      style={{ height: 320 }}
    />
  );
}
