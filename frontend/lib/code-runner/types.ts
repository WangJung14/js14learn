export interface CodingTestCase {
  id: string;
  name: string;
  args?: unknown[];
  expected?: unknown;
  expectedOutput?: string;
  hidden?: boolean;
}

export interface CodingExerciseConfig {
  language: 'javascript';
  mode?: 'console' | 'function';
  functionName?: string;
  starterCode?: string;
  tests: CodingTestCase[];
}

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  actual?: unknown;
  expected?: unknown;
  error?: string;
  durationMs: number;
  hidden?: boolean;
}

export interface ExecutionResult {
  success: boolean;
  stdout: string[];
  stderr: string[];
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  durationMs: number;
  tests?: TestResult[];
  timedOut?: boolean;
}

export type WorkerRequest =
  | {
      type: 'RUN_CODE';
      code: string;
    }
  | {
      type: 'RUN_TESTS';
      code: string;
      tests: CodingTestCase[];
      functionName?: string;
      mode?: 'console' | 'function';
    };

export type WorkerResponse = {
  success: boolean;
  stdout: string[];
  stderr: string[];
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  durationMs: number;
  tests?: TestResult[];
};
