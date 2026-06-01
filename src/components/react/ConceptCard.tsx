import { renderMarkdown } from '@/lib/markdown';

interface Props {
  markdown: string;
}

export default function ConceptCard({ markdown }: Props) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
        Concept unlocked
      </div>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
    </div>
  );
}
