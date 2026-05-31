import { useEffect, useRef } from 'react';
import type { RunResult } from '@/lib/types';
import { HARNESS_SCRIPT } from './harness';

interface Props {
  code: string;
  tests: string;
  run: boolean;
  onResult: (r: RunResult) => void;
}

export default function JsRunner({ code, tests, run, onResult }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!run) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const html = `<!doctype html>
<html><head><meta charset="utf-8"></head><body>
<script>${HARNESS_SCRIPT}</script>
<script>
try {
${code}
} catch (e) {
  parent.postMessage({ type: "breakpoint:result", result: { passed: false, total: 0, passedCount: 0, failures: [], logs: [], errors: [e && e.message ? e.message : String(e)], durationMs: 0 } }, "*");
}
</script>
<script>
${tests}
window.__breakpointRun();
</script>
</body></html>`;

    function onMessage(e: MessageEvent) {
      if (!iframe || e.source !== iframe.contentWindow) return;
      const data = e.data as { type?: string; result?: RunResult };
      if (data?.type === 'breakpoint:result' && data.result) {
        onResult(data.result);
      }
    }
    window.addEventListener('message', onMessage);

    iframe.srcdoc = html;

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [run, code, tests, onResult]);

  return (
    <iframe
      ref={iframeRef}
      title="bug sandbox"
      sandbox="allow-scripts"
      className="hidden"
      aria-hidden="true"
    />
  );
}
