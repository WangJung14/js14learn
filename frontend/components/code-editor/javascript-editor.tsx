'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-950 flex items-center justify-center text-xs font-mono text-slate-500 min-h-[300px]">
      Loading Monaco Editor...
    </div>
  ),
});

interface JavaScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
}

export const JavaScriptEditor: React.FC<JavaScriptEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  minHeight = '360px',
}) => {
  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner"
      style={{ minHeight }}
    >
      <MonacoEditor
        height={minHeight}
        defaultLanguage="javascript"
        language="javascript"
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || '')}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          folding: true,
          bracketPairColorization: { enabled: true },
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
};
