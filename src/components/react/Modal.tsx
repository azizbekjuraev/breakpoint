import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  initialFocus?: 'first-input' | 'container';
  width?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const WIDTH_CLASS: Record<NonNullable<Props['width']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export default function Modal({
  open,
  onClose,
  labelledBy,
  initialFocus = 'first-input',
  width = 'md',
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => {
      const root = containerRef.current;
      if (!root) return;
      if (initialFocus === 'first-input') {
        const input = root.querySelector<HTMLElement>('input, textarea, [tabindex="0"]');
        (input ?? root).focus();
      } else {
        root.focus();
      }
    }, 0);
    return () => {
      clearTimeout(t);
      restoreFocusRef.current?.focus?.();
    };
  }, [open, initialFocus]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-neutral-900/50 px-4 pt-[12vh] backdrop-blur-sm dark:bg-black/60"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`w-full ${WIDTH_CLASS[width]} overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl outline-none dark:border-neutral-800 dark:bg-neutral-900`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
