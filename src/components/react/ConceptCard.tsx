import { renderMarkdown } from '@/lib/markdown';

interface Props {
  markdown: string;
}

export default function ConceptCard({ markdown }: Props) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
        Concept unlocked
      </div>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
    </div>
  );
}
