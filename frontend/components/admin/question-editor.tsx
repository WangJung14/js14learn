'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2,
  ListCheck,
  FileText,
  Save,
  ArrowLeft,
  AlertTriangle,
  Plus,
  Trash2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { questionsApi } from '@/lib/api';
import { Question, AssessmentType, ExerciseDifficulty, QuestionStatus } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface QuestionEditorProps {
  initialData?: Question;
  isEditing?: boolean;
}

export function QuestionEditor({ initialData, isEditing = false }: QuestionEditorProps) {
  const router = useRouter();

  // Basic Details
  const [type, setType] = useState<AssessmentType>(
    initialData?.type || 'CODE_OUTPUT',
  );
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty>(
    initialData?.difficulty || 'EASY',
  );
  const [status, setStatus] = useState<QuestionStatus>(
    initialData?.status || 'PUBLISHED',
  );
  const [defaultPoints, setDefaultPoints] = useState<number>(
    initialData?.defaultPoints ?? 10,
  );
  const [explanation, setExplanation] = useState(
    initialData?.explanation || '',
  );

  // Type-specific Config
  // 1. CODE_OUTPUT
  const [codeSnippet, setCodeSnippet] = useState(
    initialData?.config?.codeSnippet || 'const x = "5";\nconsole.log(x + 2);',
  );
  const [expectedOutput, setExpectedOutput] = useState(
    initialData?.config?.expectedOutput || '52',
  );
  const [normalizationMode, setNormalizationMode] = useState<'NORMALIZED' | 'STRICT'>(
    initialData?.config?.normalizationMode || 'NORMALIZED',
  );

  // 2. MULTIPLE_CHOICE
  const [choices, setChoices] = useState<Array<{ id: string; text: string }>>(
    initialData?.config?.choices ||
      initialData?.config?.options || [
        { id: 'opt_a', text: 'null' },
        { id: 'opt_b', text: 'undefined' },
        { id: 'opt_c', text: 'object' },
        { id: 'opt_d', text: 'boolean' },
      ],
  );
  const [correctOptionId, setCorrectOptionId] = useState<string>(
    initialData?.config?.correctOptionId || 'opt_c',
  );

  // 3. ESSAY
  const [essayGradingMode, setEssayGradingMode] = useState<'EXACT' | 'KEYWORDS' | 'MANUAL'>(
    initialData?.config?.gradingMode || 'EXACT',
  );
  const [expectedAnswer, setExpectedAnswer] = useState(
    initialData?.config?.expectedAnswer || '',
  );
  const [keywords, setKeywords] = useState(
    (
      initialData?.config?.requiredKeywords ||
      initialData?.config?.keywords ||
      []
    ).join(', '),
  );
  const [minLength, setMinLength] = useState<number>(
    initialData?.config?.minLength ?? 0,
  );
  const [maxLength, setMaxLength] = useState<number>(
    initialData?.config?.maxLength ?? 2000,
  );
  const [rubric, setRubric] = useState(initialData?.config?.rubric || '');

  // Status
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usageCount = initialData?._count?.exerciseQuestions ?? 0;

  const handleAddChoice = () => {
    const nextId = `opt_${String.fromCharCode(97 + choices.length)}`;
    setChoices([...choices, { id: nextId, text: '' }]);
  };

  const handleRemoveChoice = (idx: number) => {
    if (choices.length <= 2) {
      alert('A multiple choice question must have at least 2 options.');
      return;
    }
    const target = choices[idx];
    const nextChoices = choices.filter((_, i) => i !== idx);
    setChoices(nextChoices);
    if (correctOptionId === target.id) {
      setCorrectOptionId(nextChoices[0]?.id || '');
    }
  };

  const handleChoiceTextChange = (idx: number, val: string) => {
    const next = [...choices];
    next[idx].text = val;
    setChoices(next);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a question title.');
      return;
    }

    // Build config
    let config: any = {};

    if (type === 'CODE_OUTPUT') {
      if (!codeSnippet.trim()) {
        setError('Code snippet is required for Code Output questions.');
        return;
      }
      if (!expectedOutput.trim()) {
        setError('Expected output is required.');
        return;
      }
      config = {
        codeSnippet: codeSnippet.trim(),
        expectedOutput: expectedOutput.trim(),
        normalizationMode,
      };
    } else if (type === 'MULTIPLE_CHOICE') {
      const validChoices = choices.filter((c) => c.text.trim());
      if (validChoices.length < 2) {
        setError('Please provide at least 2 non-empty choices.');
        return;
      }
      if (!correctOptionId || !validChoices.some((c) => c.id === correctOptionId)) {
        setError('Please select which option is correct.');
        return;
      }
      config = {
        choices: validChoices,
        correctOptionId,
      };
    } else if (type === 'ESSAY') {
      config = {
        gradingMode: essayGradingMode,
        minLength: minLength > 0 ? minLength : undefined,
        maxLength: maxLength > 0 ? maxLength : undefined,
        rubric: rubric.trim() || undefined,
      };
      if (essayGradingMode === 'EXACT') {
        if (!expectedAnswer.trim()) {
          setError('Expected answer is required for EXACT essay grading.');
          return;
        }
        config.expectedAnswer = expectedAnswer.trim();
      } else if (essayGradingMode === 'KEYWORDS') {
        const keywordList = (keywords || '')
          .split(',')
          .map((k: string) => k.trim())
          .filter((k: string) => k.length > 0);
        if (keywordList.length === 0) {
          setError('Please provide at least one required keyword for keyword-based grading.');
          return;
        }
        config.requiredKeywords = keywordList;
      }
    }

    const payload = {
      type,
      title: title.trim(),
      description: description.trim() || null,
      difficulty,
      status,
      defaultPoints: Number(defaultPoints) || 10,
      explanation: explanation.trim() || null,
      config,
    };

    try {
      setSaving(true);
      if (isEditing && initialData) {
        await questionsApi.update(initialData.id, payload);
      } else {
        await questionsApi.create(payload);
      }
      router.push('/admin/question-bank');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/question-bank')}
          className="border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Question Bank
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-lg shadow-indigo-600/20"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : isEditing ? 'Update Question' : 'Save Question'}
          </Button>
        </div>
      </div>

      {/* Warning if question is used in published exercises */}
      {isEditing && usageCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              Warning: This question is currently used in {usageCount} exercise{usageCount > 1 ? 's' : ''}.
            </p>
            <p className="text-xs text-amber-300/80 mt-1">
              Modifying the expected answer or grading rules will affect future submissions. Historical student attempts will remain unchanged.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* 1. Question Type Selection */}
      <Card className="p-6 bg-slate-900/60 backdrop-blur-md border-slate-800/80 space-y-4 rounded-3xl shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          Question Type
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setType('CODE_OUTPUT')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
              type === 'CODE_OUTPUT'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <Badge className="text-[10px]">
                Auto-graded
              </Badge>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Code Output</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Students predict the exact console output of JavaScript code.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setType('MULTIPLE_CHOICE')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
              type === 'MULTIPLE_CHOICE'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <ListCheck className="w-5 h-5 text-sky-400" />
              <Badge className="text-[10px]">
                Auto-graded
              </Badge>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Multiple Choice (MCQ)</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Select one correct answer from a list of options.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setType('ESSAY')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
              type === 'ESSAY'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <FileText className="w-5 h-5 text-purple-400" />
              <Badge className="text-[10px]">
                Auto / Manual
              </Badge>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Essay / Explanation</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Free-text explanation with exact, keyword, or manual review.
              </p>
            </div>
          </button>
        </div>
      </Card>

      {/* 2. Canonical Question Metadata */}
      <Card className="p-6 bg-slate-900/60 backdrop-blur-md border-slate-800/80 space-y-4 rounded-3xl shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Question Details
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Question Title / Prompt <span className="text-rose-400">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. What does typeof null return in JavaScript?"
              className="bg-slate-950/60 border-slate-800 text-sm rounded-xl h-11"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Description / Instructions (Optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional background context, hints, or instructions for the student..."
              rows={2}
              className="bg-slate-950/60 border-slate-800 text-sm rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Difficulty Level
              </label>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as ExerciseDifficulty)}
                className="bg-slate-950/60 border-slate-800 text-sm rounded-xl h-11"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Default Points
              </label>
              <Input
                type="number"
                min={1}
                value={defaultPoints}
                onChange={(e) => setDefaultPoints(Number(e.target.value))}
                className="bg-slate-950/60 border-slate-800 text-sm rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Question Status
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as QuestionStatus)}
                className="bg-slate-950/60 border-slate-800 text-sm rounded-xl h-11"
              >
                <option value="PUBLISHED">Published (Ready for exercises)</option>
                <option value="DRAFT">Draft (Admin only)</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Type-Specific Configuration */}
      <Card className="p-6 bg-slate-900/60 backdrop-blur-md border-slate-800/80 space-y-5 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            Grading Configuration & Answer Key
          </h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
            🔒 Server-Side Only
          </span>
        </div>

        {/* CODE_OUTPUT EDITOR */}
        {type === 'CODE_OUTPUT' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                JavaScript Code Snippet to Predict <span className="text-rose-400">*</span>
              </label>
              <Textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="const a = 10;\nconsole.log(a * 2);"
                rows={5}
                className="font-mono text-sm bg-slate-950/80 border-slate-800 text-indigo-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Expected Console Output <span className="text-rose-400">*</span>
                </label>
                <Textarea
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  placeholder="52"
                  rows={3}
                  className="font-mono text-sm bg-slate-950/80 border-slate-800 text-emerald-300 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Normalization Mode
                </label>
                <Select
                  value={normalizationMode}
                  onChange={(e) =>
                    setNormalizationMode(
                      e.target.value as 'NORMALIZED' | 'STRICT',
                    )
                  }
                  className="bg-slate-950/60 border-slate-800 text-sm rounded-xl h-11"
                >
                  <option value="NORMALIZED">NORMALIZED (Trims line ends & \r\n)</option>
                  <option value="STRICT">STRICT (Exact character-for-character match)</option>
                </Select>
                <p className="text-xs text-slate-400 mt-1">
                  NORMALIZED ignores accidental trailing whitespace or newline variations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MULTIPLE_CHOICE EDITOR */}
        {type === 'MULTIPLE_CHOICE' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Choices (Select the radio button for the correct option)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddChoice}
                className="text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Option
              </Button>
            </div>

            <div className="space-y-2.5">
              {choices.map((choice, idx) => {
                const isSelectedCorrect = correctOptionId === choice.id;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <div
                    key={choice.id || idx}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                      isSelectedCorrect
                        ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md shadow-emerald-900/10'
                        : 'bg-slate-950/50 border-slate-800/80'
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="correctChoice"
                        checked={isSelectedCorrect}
                        onChange={() => setCorrectOptionId(choice.id)}
                        className="w-4 h-4 text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
                      />
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                          isSelectedCorrect
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {letter}
                      </span>
                    </label>

                    <Input
                      value={choice.text}
                      onChange={(e) => handleChoiceTextChange(idx, e.target.value)}
                      placeholder={`Option ${letter} text...`}
                      className="bg-slate-900/60 border-slate-800 text-sm flex-1 rounded-xl h-10"
                    />

                    {choices.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveChoice(idx)}
                        className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ESSAY EDITOR */}
        {type === 'ESSAY' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Essay Grading Mode
              </label>
              <Select
                value={essayGradingMode}
                onChange={(e) =>
                  setEssayGradingMode(
                    e.target.value as 'EXACT' | 'KEYWORDS' | 'MANUAL',
                  )
                }
                className="bg-slate-950/60 border-slate-800 text-sm rounded-xl h-11"
              >
                <option value="EXACT">EXACT MATCH (Normalized text comparison)</option>
                <option value="KEYWORDS">KEYWORD_BASED (Must contain all required keywords)</option>
                <option value="MANUAL">MANUAL (Instructor manual review & score)</option>
              </Select>
            </div>

            {essayGradingMode === 'EXACT' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Expected Explanation Answer <span className="text-rose-400">*</span>
                </label>
                <Textarea
                  value={expectedAnswer}
                  onChange={(e) => setExpectedAnswer(e.target.value)}
                  placeholder="Expected exact explanation text..."
                  rows={4}
                  className="bg-slate-950/80 border-slate-800 text-sm rounded-xl text-emerald-300"
                />
              </div>
            )}

            {essayGradingMode === 'KEYWORDS' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Required Keywords (comma-separated) <span className="text-rose-400">*</span>
                </label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="type coercion, strict equality, reference"
                  className="bg-slate-950/80 border-slate-800 text-sm rounded-xl h-11 font-mono text-emerald-300"
                />
                <p className="text-xs text-slate-400">
                  The student answer must contain every specified keyword/phrase to pass.
                </p>
              </div>
            )}

            {essayGradingMode === 'MANUAL' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Grading Rubric / Instructor Guidelines
                </label>
                <Textarea
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  placeholder="Guidelines for the instructor when grading submissions..."
                  rows={3}
                  className="bg-slate-950/80 border-slate-800 text-sm rounded-xl"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Minimum Characters
                </label>
                <Input
                  type="number"
                  min={0}
                  value={minLength}
                  onChange={(e) => setMinLength(Number(e.target.value))}
                  className="bg-slate-950/60 border-slate-800 text-sm rounded-xl h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Maximum Characters
                </label>
                <Input
                  type="number"
                  min={10}
                  value={maxLength}
                  onChange={(e) => setMaxLength(Number(e.target.value))}
                  className="bg-slate-950/60 border-slate-800 text-sm rounded-xl h-11"
                />
              </div>
            </div>
          </div>
        )}

        {/* Shared Explanation */}
        <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
          <label className="text-xs font-bold text-slate-300">
            Explanation / Learning Note (Shown to student after submitting attempt)
          </label>
          <Textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Detailed explanation of why this answer is correct..."
            rows={3}
            className="bg-slate-950/60 border-slate-800 text-sm rounded-xl"
          />
        </div>
      </Card>
    </form>
  );
}
