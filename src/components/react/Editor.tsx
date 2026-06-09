import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { vim } from '@replit/codemirror-vim';
import { EditorState, type Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

interface Props {
  value: string;
  onChange: (next: string) => void;
  language?: 'js' | 'jsx' | 'css';
  vimMode?: boolean;
}

function langExtension(language: 'js' | 'jsx' | 'css'): Extension {
  if (language === 'css') return css();
  return javascript({ jsx: language === 'jsx', typescript: language === 'jsx' });
}

export default function Editor({ value, onChange, language = 'js', vimMode = false }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        ...(vimMode ? [vim()] : []),
        basicSetup,
        langExtension(language),
        oneDark,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) onChange(v.state.doc.toString());
        }),
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
        }),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, vimMode]);

  return <div ref={hostRef} className="h-full" />;
}
