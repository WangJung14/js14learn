const http = require('http');

const API_BASE = 'http://127.0.0.1:3001/api';

function request(urlPath, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + urlPath);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`  ✓ ${message}`);
  }
}

async function runAssessmentE2E() {
  console.log('====================================================');
  console.log('🚀 RUNNING ASSESSMENT & EXERCISE ANSWERING SYSTEM E2E');
  console.log('====================================================\n');

  const timestamp = Date.now();
  const adminEmail = `admin_qa_${timestamp}@test.com`;
  const studentEmail = `student_qa_${timestamp}@test.com`;
  const password = 'Password123!';

  // 1. Register Admin & Student
  console.log('1. Setting up Test Users...');
  const regAdmin = await request('/auth/register', 'POST', {
    name: 'Admin QA',
    email: adminEmail,
    password,
  });
  assert(regAdmin.status === 201, 'Admin registered successfully');
  const adminToken = regAdmin.data.tokens.accessToken;
  const adminId = regAdmin.data.user.id;

  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  // Make user ADMIN via Prisma
  await prisma.user.update({
    where: { id: adminId },
    data: { role: 'ADMIN' },
  });

  // Re-login to get updated token with ADMIN role
  const adminLogin = await request('/auth/login', 'POST', {
    email: adminEmail,
    password,
  });
  const freshAdminToken = adminLogin.data.tokens.accessToken;

  const regStudent = await request('/auth/register', 'POST', {
    name: 'Student QA',
    email: studentEmail,
    password,
  });
  assert(regStudent.status === 201, 'Student registered successfully');
  const studentToken = regStudent.data.tokens.accessToken;
  const studentId = regStudent.data.user.id;

  // 2. Create a test Study Day
  const uniqueDayNumber = Math.floor(Math.random() * 50000) + 1000;
  console.log(`\n2. Creating Study Day (Day ${uniqueDayNumber}) for Assessments...`);
  const dayRes = await request(
    '/study-days',
    'POST',
    {
      dayNumber: uniqueDayNumber,
      title: 'Assessment Mastery Day',
      description: 'Comprehensive Assessment Testing',
      content: 'Day content here',
      order: uniqueDayNumber,
    },
    freshAdminToken,
  );
  if (dayRes.status !== 201) {
    console.error('Create Study Day response:', dayRes);
  }
  assert(dayRes.status === 201, 'Study day created');
  const studyDayId = dayRes.data.id;

  // 3. Scenario 1: CODE_OUTPUT Assessment
  console.log('\n3. Scenario 1: Code Output Prediction Assessment');
  const codeOutputExRes = await request(
    '/exercises',
    'POST',
    {
      studyDayId,
      title: 'Output Prediction: Type Coercion',
      description: 'What will this code output?',
      difficulty: 'MEDIUM',
      order: 1,
      assessmentType: 'CODE_OUTPUT',
      assessmentConfig: {
        codeSnippet: 'const a = "40";\nconst b = 2;\nconsole.log(a + b);',
        expectedOutput: '402',
        normalizationMode: 'NORMALIZED',
        points: 10,
        passingScore: 70,
        maxAttempts: 3,
        explanation: 'The + operator with string and number causes string concatenation.',
      },
    },
    freshAdminToken,
  );
  assert(codeOutputExRes.status === 201, 'Code Output exercise created by Admin');
  const codeExId = codeOutputExRes.data.id;

  // Link a checklist item to this exercise
  const checklistRes = await request(
    '/admin/checklists',
    'POST',
    {
      studyDayId,
      title: 'Complete Type Coercion Assessment',
      type: 'EXERCISE',
      exerciseId: codeExId,
      isRequired: true,
      order: 1,
    },
    freshAdminToken,
  );
  assert(checklistRes.status === 201, 'Checklist item linked to exercise');

  // Verify Security: Student must NOT see expectedOutput
  console.log('   Testing Server-Side Security (Sanitization)...');
  const studentViewEx = await request(`/exercises/${codeExId}`, 'GET', null, studentToken);
  if (studentViewEx.status !== 200) {
    console.error('studentViewEx response:', studentViewEx);
  }
  assert(studentViewEx.status === 200, 'Student fetched exercise');
  assert(studentViewEx.data.assessmentConfig.expectedOutput === undefined, 'Expected output is NOT exposed to student');
  assert(studentViewEx.data.assessmentConfig.codeSnippet !== undefined, 'Code snippet is visible');

  // Student submits incorrect answer
  console.log('   Student submits incorrect prediction (e.g. "42")...');
  const wrongAttempt = await request(
    `/assessments/${codeExId}/attempts`,
    'POST',
    { answer: '42' },
    studentToken,
  );
  assert(wrongAttempt.status === 201, 'Attempt recorded');
  assert(wrongAttempt.data.isPassed === false, 'Incorrect answer is marked NOT passed');
  assert(wrongAttempt.data.score === 0, 'Score is 0');
  assert(wrongAttempt.data.status === 'FAILED', 'Status is FAILED');

  // Check checklist remains incomplete
  const clCheck1 = await request(`/checklists/study-day/${studyDayId}`, 'GET', null, studentToken);
  const item1 = clCheck1.data.items.find((i) => i.exerciseId === codeExId);
  assert(item1 && item1.isCompleted === false, 'Checklist remains incomplete after failed attempt');

  // Student retries with correct answer + extra whitespace (test normalization)
  console.log('   Student retries with correct answer and whitespace ("  402 \\n")...');
  const correctAttempt = await request(
    `/assessments/${codeExId}/attempts`,
    'POST',
    { answer: '  402 \n' },
    studentToken,
  );
  assert(correctAttempt.status === 201, 'Second attempt submitted');
  assert(correctAttempt.data.isPassed === true, 'Correct normalized answer marked PASSED');
  assert(correctAttempt.data.score === 10, 'Score is 10 / 10');
  assert(correctAttempt.data.percentage === 100, 'Percentage is 100%');
  assert(correctAttempt.data.explanation !== undefined, 'Explanation is included post-submission');

  // Check checklist is now completed
  const clCheck2 = await request(`/checklists/study-day/${studyDayId}`, 'GET', null, studentToken);
  const item2 = clCheck2.data.items.find((i) => i.exerciseId === codeExId);
  assert(item2 && item2.isCompleted === true, 'Checklist auto-completed after passing attempt');

  // Check summary
  const summaryRes = await request(`/assessments/${codeExId}/summary`, 'GET', null, studentToken);
  assert(summaryRes.data.bestScore === 10, 'Summary reflects bestScore 10');
  assert(summaryRes.data.hasPassed === true, 'Summary reflects hasPassed true');
  assert(summaryRes.data.totalAttempts === 2, 'Summary reflects 2 total attempts');

  // 4. Scenario 2: MULTIPLE_CHOICE Assessment
  console.log('\n4. Scenario 2: Multiple Choice Question (MCQ)');
  const mcqExRes = await request(
    '/exercises',
    'POST',
    {
      studyDayId,
      title: 'JavaScript Primitives MCQ',
      description: 'Which of the following is NOT a JavaScript primitive type?',
      difficulty: 'EASY',
      order: 2,
      assessmentType: 'MULTIPLE_CHOICE',
      assessmentConfig: {
        choices: [
          { id: 'opt_a', text: 'string' },
          { id: 'opt_b', text: 'number' },
          { id: 'opt_c', text: 'boolean' },
          { id: 'opt_d', text: 'Object' },
        ],
        correctOptionId: 'opt_d',
        points: 10,
        passingScore: 70,
        explanation: 'Object is a reference type, not a primitive type.',
      },
    },
    freshAdminToken,
  );
  assert(mcqExRes.status === 201, 'MCQ exercise created');
  const mcqExId = mcqExRes.data.id;

  // Security: Check student view does NOT expose correctOptionId or isCorrect
  const mcqStudentView = await request(`/exercises/${mcqExId}`, 'GET', null, studentToken);
  assert(mcqStudentView.data.assessmentConfig.correctOptionId === undefined, 'correctOptionId is NOT exposed');
  assert(
    mcqStudentView.data.assessmentConfig.choices.every((c) => c.isCorrect === undefined),
    'isCorrect flags are removed from choices',
  );

  // Student selects wrong option
  console.log('   Student selects wrong option "opt_a"...');
  const mcqWrong = await request(
    `/assessments/${mcqExId}/attempts`,
    'POST',
    { answer: 'opt_a' },
    studentToken,
  );
  assert(mcqWrong.data.isPassed === false, 'Wrong option graded as FAILED');

  // Student selects correct option
  console.log('   Student retries with correct option "opt_d"...');
  const mcqCorrect = await request(
    `/assessments/${mcqExId}/attempts`,
    'POST',
    { answer: 'opt_d' },
    studentToken,
  );
  assert(mcqCorrect.data.isPassed === true, 'Correct option graded as PASSED (10/10)');

  // 5. Scenario 3: ESSAY with KEYWORDS Grading
  console.log('\n5. Scenario 3: Essay Assessment with KEYWORDS Grading');
  const essayKwRes = await request(
    '/exercises',
    'POST',
    {
      studyDayId,
      title: 'Equality Operators Comparison',
      description: 'Explain the difference between == and === in JavaScript.',
      difficulty: 'MEDIUM',
      order: 3,
      assessmentType: 'ESSAY',
      assessmentConfig: {
        gradingMode: 'KEYWORDS',
        requiredKeywords: ['type coercion', 'strict equality'],
        points: 15,
        passingScore: 70,
        minLength: 10,
        maxLength: 500,
        explanation: '== converts types automatically via coercion, while === requires both value and type equality.',
      },
    },
    freshAdminToken,
  );
  assert(essayKwRes.status === 201, 'Essay exercise created');
  const essayKwId = essayKwRes.data.id;

  // Missing keyword
  console.log('   Student submits answer missing required keywords...');
  const essayMiss = await request(
    `/assessments/${essayKwId}/attempts`,
    'POST',
    { answer: 'One is strict and one is not strict.' },
    studentToken,
  );
  assert(essayMiss.data.isPassed === false, 'Essay missing keywords is FAILED');

  // Contains all keywords
  console.log('   Student submits answer with all required keywords...');
  const essayPass = await request(
    `/assessments/${essayKwId}/attempts`,
    'POST',
    {
      answer:
        'Double equals performs type coercion before comparison, whereas triple equals performs strict equality without coercion.',
    },
    studentToken,
  );
  assert(essayPass.data.isPassed === true, 'Essay with all keywords graded as PASSED');
  assert(essayPass.data.score === 15, 'Received full 15 points');

  // 6. Scenario 4: ESSAY with MANUAL Grading
  console.log('\n6. Scenario 4: Essay Assessment with MANUAL Review');
  const manualEssayRes = await request(
    '/exercises',
    'POST',
    {
      studyDayId,
      title: 'Event Loop Architecture',
      description: 'Detail how microtasks vs macrotasks work in the Node.js event loop.',
      difficulty: 'HARD',
      order: 4,
      assessmentType: 'ESSAY',
      assessmentConfig: {
        gradingMode: 'MANUAL',
        points: 20,
        passingScore: 70,
        rubric: 'Check for call stack, process.nextTick, Promise queue, and timer phase explanations.',
      },
    },
    freshAdminToken,
  );
  assert(manualEssayRes.status === 201, 'Manual review essay created');
  const manualEssayId = manualEssayRes.data.id;

  // Student submits manual essay
  console.log('   Student submits essay for manual review...');
  const manualSubmit = await request(
    `/assessments/${manualEssayId}/attempts`,
    'POST',
    {
      answer:
        'Microtasks (such as resolved Promises and process.nextTick) are executed immediately after the current operation finishes, before moving to the next macrotask (such as setTimeout).',
    },
    studentToken,
  );
  assert(manualSubmit.data.status === 'PENDING_REVIEW', 'Attempt is PENDING_REVIEW');
  assert(manualSubmit.data.isPassed === false, 'isPassed is false while pending review');
  const attemptId = manualSubmit.data.id;

  // Admin fetches pending reviews
  console.log('   Admin fetches pending reviews...');
  const pendingReviews = await request('/admin/assessments/pending-reviews', 'GET', null, freshAdminToken);
  assert(pendingReviews.status === 200, 'Admin fetched pending reviews list');
  assert(pendingReviews.data.some((a) => a.id === attemptId), 'Submitted attempt is in pending reviews');

  // Admin reviews and grades the attempt
  console.log('   Admin reviews and assigns 18/20 (90%) points...');
  const reviewRes = await request(
    `/admin/assessments/attempts/${attemptId}/review`,
    'PATCH',
    {
      score: 18,
      feedback: 'Very thorough explanation of microtask queue priority!',
      isPassed: true,
    },
    freshAdminToken,
  );
  assert(reviewRes.status === 200, 'Attempt reviewed by Admin');
  assert(reviewRes.data.status === 'PASSED', 'Status updated to PASSED');
  assert(reviewRes.data.score === 18, 'Score updated to 18');
  assert(reviewRes.data.percentage === 90, 'Percentage is 90%');
  assert(reviewRes.data.feedback === 'Very thorough explanation of microtask queue priority!', 'Admin feedback saved');

  // 7. Cleanup
  console.log('\n7. Cleaning up test Study Day...');
  await request(`/study-days/${studyDayId}`, 'DELETE', null, freshAdminToken);
  console.log('  ✓ Test data cleaned up.');

  console.log('\n====================================================');
  console.log('🎉 ALL ASSESSMENT E2E TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================\n');
}

runAssessmentE2E().catch((err) => {
  console.error('E2E TEST EXCEPTION:', err);
  process.exit(1);
});
