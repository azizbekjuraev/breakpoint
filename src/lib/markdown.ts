// Minimal markdown renderer for bug READMEs, hints, and concept cards.
// Handles: headings, paragraphs, fenced code blocks, inline code, bold, italic.
// Intentionally tiny — zero KB cost. Swap for `marked` if richer output is needed.

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s: string): string {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, (_, c) => `<code>${esc(c)}</code>`);
}

export function renderMarkdown(md: string): string {
  return md
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith('```')) {
        const code = block.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
        return `<pre><code>${esc(code)}</code></pre>`;
      }
      if (block.startsWith('### ')) return `<h3>${inline(block.slice(4))}</h3>`;
      if (block.startsWith('## ')) return `<h2>${inline(block.slice(3))}</h2>`;
      if (block.startsWith('# ')) return `<h1>${inline(block.slice(2))}</h1>`;
      return `<p>${inline(block)}</p>`;
    })
    .join('\n');
}
