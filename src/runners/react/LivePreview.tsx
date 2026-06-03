import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';

const ENTRY = `
import { createRoot } from 'react-dom/client';
import App from './App';
createRoot(document.getElementById('root')).render(<App />);
`;

interface Props {
  files: Record<string, string>;
}

export default function LivePreview({ files }: Props) {
  const sandpackFiles: Record<string, string> = { '/index.tsx': ENTRY };
  for (const [name, content] of Object.entries(files)) {
    sandpackFiles[name.startsWith('/') ? name : '/' + name] = content;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <SandpackProvider
        template="react-ts"
        files={sandpackFiles}
        options={{ autorun: true, recompileMode: 'delayed', recompileDelay: 500 }}
        customSetup={{
          entry: '/index.tsx',
          dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0' },
        }}
      >
        <SandpackPreview
          showOpenInCodeSandbox={false}
          showRefreshButton={false}
          showNavigator={false}
          showSandpackErrorOverlay={false}
          style={{ minHeight: 220 }}
        />
      </SandpackProvider>
    </div>
  );
}
