import Modal from './Modal';
import { shortcutLabel } from '@/lib/use-keyboard-shortcuts';

export interface ShortcutListing {
  keys: string;
  description: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  shortcuts: ShortcutListing[];
}

export default function ShortcutOverlay({ open, onClose, shortcuts }: Props) {
  return (
    <Modal open={open} onClose={onClose} width="md" labelledBy="shortcuts-title">
      <div className="border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <h2 id="shortcuts-title" className="text-sm font-semibold">
          Keyboard shortcuts
        </h2>
      </div>
      <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {shortcuts.map((s) => (
          <li key={s.keys} className="flex items-center justify-between gap-4 px-5 py-2.5 text-sm">
            <span className="text-neutral-700 dark:text-neutral-300">{s.description}</span>
            <kbd className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {shortcutLabel(s.keys)}
            </kbd>
          </li>
        ))}
      </ul>
      <div className="border-t border-neutral-200 px-5 py-2 font-mono text-[10px] text-neutral-400 dark:border-neutral-800">
        Esc to close
      </div>
    </Modal>
  );
}
