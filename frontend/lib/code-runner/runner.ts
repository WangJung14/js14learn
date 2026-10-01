import {
  CodingTestCase,
  ExecutionResult,
  TestResult,
  WorkerRequest,
  WorkerResponse,
} from './types';
import { deepEqual } from './deep-equal';

export const CODE_EXECUTION_TIMEOUT_MS = 3000;
export const MAX_CODE_SIZE_BYTES = 20480; // 20 KB

const WORKER_SCRIPT = `
const deepEqual = ${deepEqual.toString()};

function formatValue(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return val;
  if (typeof val === 'function') return '[Function: ' + (val.name || 'anonymous') + ']';
  try {
    return JSON.stringify(val);
  } catch (e) {
    return String(val);
  }
}

self.onmessage = async function (e) {
  const req = e.data;
  const startTime = performance.now();
  const stdout = [];
  const stderr = [];

  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  console.log = function (...args) {
    stdout.push(args.map(formatValue).join(' '));
  };
  console.error = function (...args) {
    stderr.push(args.map(formatValue).join(' '));
  };
  console.warn = function (...args) {
    stdout.push('[WARN] ' + args.map(formatValue).join(' '));
  };
  console.info = function (...args) {
    stdout.push('[INFO] ' + args.map(formatValue).join(' '));
  };

  try {
    if (req.type === 'RUN_CODE') {
      const fn = new Function(req.code);
      const res = fn();
      if (res && typeof res.then === 'function') {
        await res;
      }
      const durationMs = Math.round(performance.now() - startTime);
      self.postMessage({
        success: true,
        stdout,
        stderr,
        durationMs,
      });
    } else if (req.type === 'RUN_TESTS') {
      const tests = req.tests || [];
      const functionName = req.functionName;
      let fn = null;

      if (functionName) {
        const createFn = new Function(req.code + '\\nreturn typeof ' + functionName + ' !== "undefined" ? ' + functionName + ' : null;');
        fn = createFn();
        if (typeof fn !== 'function') {
          throw new Error('Function "' + functionName + '" is not defined or not a function.');
        }
      } else {
        const createFn = new Function(req.code);
        createFn();
      }

      const testResults = [];
      let allPassed = true;

      for (const t of tests) {
        const testStartTime = performance.now();
        let passed = false;
        let actual = undefined;
        let testError = undefined;

        try {
          if (fn) {
            const args = t.args || [];
            actual = fn(...args);
            if (actual && typeof actual.then === 'function') {
              actual = await actual;
            }
          } else {
            actual = undefined;
          }

          if (t.expected !== undefined) {
            passed = deepEqual(actual, t.expected);
          } else {
            passed = true;
          }
        } catch (err) {
          passed = false;
          testError = err.message || String(err);
        }

        if (!passed) {
          allPassed = false;
        }

        testResults.push({
          id: t.id,
          name: t.name,
          passed,
          actual,
          expected: t.expected,
          error: testError,
          durationMs: Math.round(performance.now() - testStartTime),
        });
      }

      const durationMs = Math.round(performance.now() - startTime);
      self.postMessage({
        success: allPassed,
        stdout,
        stderr,
        tests: testResults,
        durationMs,
      });
    }
  } catch (err) {
    const durationMs = Math.round(performance.now() - startTime);
    self.postMessage({
      success: false,
      stdout,
      stderr,
      error: {
        name: err.name || 'Error',
        message: err.message || String(err),
        stack: err.stack,
      },
      durationMs,
    });
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    console.info = originalInfo;
  }
};
`;

export async function executeInWorker(
  request: WorkerRequest,
  timeoutMs: number = CODE_EXECUTION_TIMEOUT_MS,
): Promise<ExecutionResult> {
  if (request.code.length > MAX_CODE_SIZE_BYTES) {
    return {
      success: false,
      stdout: [],
      stderr: [
        `Code size (${(request.code.length / 1024).toFixed(1)} KB) exceeds maximum limit of 20 KB.`,
      ],
      error: {
        name: 'CodeSizeError',
        message: 'Code size exceeds maximum limit of 20 KB.',
      },
      durationMs: 0,
    };
  }

  return new Promise((resolve) => {
    let worker: Worker | null = null;
    let timer: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (worker) {
        worker.terminate();
        worker = null;
      }
    };

    try {
      const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      worker = new Worker(workerUrl);

      timer = setTimeout(() => {
        cleanup();
        resolve({
          success: false,
          stdout: [],
          stderr: [`Execution timed out after ${timeoutMs} ms.`],
          error: {
            name: 'TimeoutError',
            message: `Execution timed out after ${timeoutMs} ms limit. Check for infinite loops.`,
          },
          durationMs: timeoutMs,
          timedOut: true,
        });
      }, timeoutMs);

      worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const data = e.data;
        cleanup();
        URL.revokeObjectURL(workerUrl);
        resolve({
          success: data.success,
          stdout: data.stdout || [],
          stderr: data.stderr || [],
          error: data.error,
          durationMs: data.durationMs || 0,
          tests: data.tests,
        });
      };

      worker.onerror = (err) => {
        cleanup();
        URL.revokeObjectURL(workerUrl);
        resolve({
          success: false,
          stdout: [],
          stderr: [err.message || 'Worker runtime error'],
          error: {
            name: 'WorkerError',
            message: err.message || 'Worker execution error',
          },
          durationMs: 0,
        });
      };

      worker.postMessage(request);
    } catch (err: unknown) {
      cleanup();
      resolve({
        success: false,
        stdout: [],
        stderr: [(err as Error).message || 'Failed to initialize Web Worker.'],
        error: {
          name: 'InitializationError',
          message: (err as Error).message || 'Failed to initialize Web Worker.',
        },
        durationMs: 0,
      });
    }
  });
}

export async function runCode(code: string): Promise<ExecutionResult> {
  return executeInWorker({ type: 'RUN_CODE', code });
}

export async function runTests(
  code: string,
  tests: CodingTestCase[],
  functionName?: string,
  mode?: 'console' | 'function',
): Promise<ExecutionResult> {
  return executeInWorker({
    type: 'RUN_TESTS',
    code,
    tests,
    functionName,
    mode,
  });
}
