'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Copy, AlertCircle } from 'lucide-react';
import { CodingTestCase } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TestCaseBuilderProps {
  tests: CodingTestCase[];
  onChange: (tests: CodingTestCase[]) => void;
  mode?: 'function' | 'console';
}

export const TestCaseBuilder: React.FC<TestCaseBuilderProps> = ({
  tests,
  onChange,
  mode = 'function',
}) => {
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleAddTest = () => {
    const newId = `test-${Date.now()}`;
    const newTest: CodingTestCase = {
      id: newId,
      name: `Test #${tests.length + 1}`,
      args: mode === 'function' ? [2, 3] : [],
      expected: mode === 'function' ? 5 : 'Expected Output',
    };
    onChange([...tests, newTest]);
  };

  const handleUpdateTest = (index: number, updatedFields: Partial<CodingTestCase>) => {
    const updated = [...tests];
    updated[index] = { ...updated[index], ...updatedFields };
    onChange(updated);
  };

  const handleDeleteTest = (index: number) => {
    const updated = tests.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === tests.length - 1)
    ) {
      return;
    }
    const updated = [...tests];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
  };

  const handleDuplicate = (index: number) => {
    const original = tests[index];
    const copy: CodingTestCase = {
      ...original,
      id: `test-${Date.now()}`,
      name: `${original.name} (Copy)`,
    };
    const updated = [...tests];
    updated.splice(index + 1, 0, copy);
    onChange(updated);
  };

  const parseJsonValue = (raw: string): { valid: boolean; value: unknown } => {
    const trimmed = raw.trim();
    if (trimmed === '') return { valid: true, value: undefined };
    try {
      return { valid: true, value: JSON.parse(trimmed) };
    } catch {
      return { valid: false, value: raw };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Test Cases ({tests.length})
          </h4>
          <p className="text-[11px] text-slate-400">
            Configure test assertions evaluated locally in student browser Web Worker
          </p>
        </div>
        <Button type="button" onClick={handleAddTest} size="sm" variant="outline">
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Test Case
        </Button>
      </div>

      {jsonError && (
        <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400 flex items-center space-x-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{jsonError}</span>
        </div>
      )}

      {tests.length === 0 ? (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
          No test cases configured yet. Click &quot;Add Test Case&quot; to add one.
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((t, idx) => (
            <div
              key={t.id || idx}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  #{idx + 1}
                </span>

                <div className="flex-1">
                  <Input
                    id={`test-name-${idx}`}
                    value={t.name}
                    onChange={(e) => handleUpdateTest(idx, { name: e.target.value })}
                    placeholder="Test Case Description"
                    className="text-xs py-1"
                  />
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    title="Move Up"
                    className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === tests.length - 1}
                    title="Move Down"
                    className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(idx)}
                    title="Duplicate"
                    className="p-1 text-slate-400 hover:text-indigo-400"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTest(idx)}
                    title="Delete"
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mode === 'function' && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Arguments JSON Array (e.g. <code className="text-indigo-300">[2, 3]</code> or <code className="text-indigo-300">[[1, 2, 3]]</code>)
                    </label>
                    <Input
                      id={`test-args-${idx}`}
                      value={JSON.stringify(t.args || [])}
                      onChange={(e) => {
                        const parsed = parseJsonValue(e.target.value);
                        if (parsed.valid && Array.isArray(parsed.value)) {
                          setJsonError(null);
                          handleUpdateTest(idx, { args: parsed.value });
                        } else {
                          setJsonError(`Test #${idx + 1} arguments must be a valid JSON array`);
                        }
                      }}
                      className="font-mono text-xs py-1"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Expected Return/Output JSON (e.g. <code className="text-emerald-300">5</code> or <code className="text-emerald-300">[1, 2]</code> or <code className="text-emerald-300">&quot;Hello&quot;</code>)
                  </label>
                  <Input
                    id={`test-expected-${idx}`}
                    value={
                      t.expected !== undefined
                        ? typeof t.expected === 'string'
                          ? `"${t.expected}"`
                          : JSON.stringify(t.expected)
                        : ''
                    }
                    onChange={(e) => {
                      const parsed = parseJsonValue(e.target.value);
                      if (parsed.valid) {
                        setJsonError(null);
                        handleUpdateTest(idx, { expected: parsed.value });
                      } else {
                        setJsonError(`Test #${idx + 1} expected value invalid JSON syntax`);
                      }
                    }}
                    className="font-mono text-xs py-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
