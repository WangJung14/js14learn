import {
  PrismaClient,
  AssessmentType,
  QuestionStatus,
  ExerciseDifficulty,
} from '@prisma/client';
import { QuestionsService } from '../src/questions/questions.service';
import { AssessmentsService } from '../src/assessments/assessments.service';
import { ExercisesService } from '../src/exercises/exercises.service';
import { ChecklistsService } from '../src/checklists/checklists.service';

const prisma = new PrismaClient();

async function runE2EValidation() {
  console.log(
    '=== STARTING QUESTION BANK & MULTI-QUESTION ASSESSMENT E2E VALIDATION ===\n',
  );

  const questionsService = new QuestionsService(prisma as any);
  const checklistsService = new ChecklistsService(prisma as any);
  const assessmentsService = new AssessmentsService(
    prisma as any,
    checklistsService,
  );
  const exercisesService = new ExercisesService(prisma as any);

  // 1. Fetch or create admin and student users
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    throw new Error('Admin user not found in database');
  }
  const student = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
  if (!student) {
    throw new Error('Student user not found in database');
  }

  console.log(`✓ Using Admin: ${admin.email}, Student: ${student.email}`);

  // 2. Create Questions in Question Bank
  console.log('\n--- 1. Testing Question Bank CRUD ---');
  const q1 = await questionsService.create(
    {
      title: 'What does typeof null return in JavaScript?',
      type: AssessmentType.MULTIPLE_CHOICE,
      difficulty: 'EASY',
      status: QuestionStatus.PUBLISHED,
      defaultPoints: 10,
      explanation: 'In JavaScript, typeof null is historically "object".',
      config: {
        options: [
          { id: 'opt_1', text: 'null' },
          { id: 'opt_2', text: 'undefined' },
          { id: 'opt_3', text: 'object' },
          { id: 'opt_4', text: 'boolean' },
        ],
        correctOptionId: 'opt_3',
      },
    },
    admin.id,
  );
  console.log(`✓ Created MCQ Question: ${q1.id} - "${q1.title}"`);

  const q2 = await questionsService.create(
    {
      title: 'Predict output of string concatenation with number',
      type: AssessmentType.CODE_OUTPUT,
      difficulty: 'EASY',
      status: QuestionStatus.PUBLISHED,
      defaultPoints: 10,
      explanation: '"5" + 2 results in string "52".',
      config: {
        codeSnippet: 'const x = "5";\nconsole.log(x + 2);',
        expectedOutput: '52',
        normalizationMode: 'NORMALIZED',
      },
    },
    admin.id,
  );
  console.log(`✓ Created Code Output Question: ${q2.id} - "${q2.title}"`);

  const q3 = await questionsService.create(
    {
      title: 'Explain Event Loop in JavaScript',
      type: AssessmentType.ESSAY,
      difficulty: 'MEDIUM',
      status: QuestionStatus.PUBLISHED,
      defaultPoints: 20,
      explanation:
        'Call stack, task queue, microtask queue, event loop dispatch.',
      config: {
        gradingMode: 'KEYWORD_BASED',
        keywords: ['call stack', 'event loop', 'microtask'],
        rubric: 'Must explain microtasks and macrotasks.',
      },
    },
    admin.id,
  );
  console.log(`✓ Created Essay (Keyword) Question: ${q3.id} - "${q3.title}"`);

  // 3. Test Question Duplication
  console.log('\n--- 2. Testing Question Duplication ---');
  const duplicatedQ = await questionsService.duplicate(q1.id, admin.id);
  console.log(
    `✓ Duplicated question: ${duplicatedQ.id} - "${duplicatedQ.title}" (Status: ${duplicatedQ.status})`,
  );
  if (!duplicatedQ.title.includes('(Copy)') || duplicatedQ.id === q1.id) {
    throw new Error('Duplication failed to create a distinct copy');
  }

  // 4. Test Question Sanitization (Student safety)
  console.log('\n--- 3. Testing Question Sanitization (Student Security) ---');
  const sanitized1 = assessmentsService.sanitizeQuestion(q1, 10, false);
  if (sanitized1.config?.correctOptionId !== undefined) {
    throw new Error(
      'SECURITY VIOLATION: correctOptionId leaked in sanitized question!',
    );
  }
  const sanitized2 = assessmentsService.sanitizeQuestion(q2, 10, false);
  if (sanitized2.config?.expectedOutput !== undefined) {
    throw new Error(
      'SECURITY VIOLATION: expectedOutput leaked in sanitized question!',
    );
  }
  console.log(
    '✓ Security verified: Answer keys stripped from student payloads',
  );

  // 5. Create an Assessment Exercise composed of multiple Question Bank questions
  console.log(
    '\n--- 4. Testing Multi-Question Exercise Composition & Reuse ---',
  );
  let studyDay = await prisma.studyDay.findFirst({
    orderBy: { dayNumber: 'asc' },
  });
  if (!studyDay) {
    studyDay = await prisma.studyDay.create({
      data: {
        dayNumber: 99,
        title: 'Assessment Test Day',
        description: 'Testing multi-question assessments',
        content: 'Test day content',
        order: 99,
      },
    });
  }

  const exercise = await exercisesService.create({
    studyDayId: studyDay.id,
    title: 'JavaScript Comprehensive Checkpoint',
    description: 'A multi-question test covering fundamentals',
    difficulty: ExerciseDifficulty.EASY,
    order: 100,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { questionId: q1.id, order: 1, points: 10, isRequired: true },
      { questionId: q2.id, order: 2, points: 15, isRequired: true }, // Override points to 15
      { questionId: q3.id, order: 3, points: 25, isRequired: true }, // Override points to 25
    ],
  });
  console.log(
    `✓ Created Assessment Exercise: ${exercise.id} with 3 questions.`,
  );

  // Test question reuse in a second exercise
  const exercise2 = await exercisesService.create({
    studyDayId: studyDay.id,
    title: 'Mid-term Quiz',
    description: 'Reusing Q1 in another exercise',
    difficulty: ExerciseDifficulty.MEDIUM,
    order: 101,
    questions: [
      { questionId: q1.id, order: 1, points: 20 }, // Q1 reused with 20 points!
    ],
  });
  console.log(
    `✓ Reused Q1 in Exercise 2: ${exercise2.id} with overridden points = 20`,
  );

  // 6. Test Student Assessment Submission (Transactional grading)
  console.log(
    '\n--- 5. Testing Multi-Question Attempt Submission & Scoring ---',
  );
  const submissionResult = await assessmentsService.submitAttempt(
    student.id,
    exercise.id,
    {
      answers: [
        { questionId: q1.id, answer: 'opt_3' }, // Correct MCQ (10/10)
        { questionId: q2.id, answer: '52' }, // Correct Code Output (15/15)
        {
          questionId: q3.id,
          answer:
            'The event loop moves items from the microtask queue to the call stack.',
        }, // Contains keywords (25/25)
      ],
    },
  );

  console.log(`✓ Submitted Attempt Result:`);
  console.log(`  - Attempt ID: ${submissionResult.id}`);
  console.log(`  - Total Score: ${submissionResult.score}`);
  console.log(`  - Percentage: ${submissionResult.percentage}%`);
  console.log(`  - Status: ${submissionResult.status}`);
  console.log(`  - Is Passed: ${submissionResult.isPassed}`);
  console.log(`  - Answers graded count: ${submissionResult.answers?.length}`);

  if (submissionResult.score !== 50 || !submissionResult.isPassed) {
    throw new Error(
      `Expected 50/50 and passed, got score: ${submissionResult.score}, isPassed: ${submissionResult.isPassed}`,
    );
  }

  // 7. Test Partial Scoring / Failing Attempt
  console.log('\n--- 6. Testing Partial Scoring & Failing Attempt ---');
  const failResult = await assessmentsService.submitAttempt(
    student.id,
    exercise.id,
    {
      answers: [
        { questionId: q1.id, answer: 'opt_1' }, // Incorrect (0/10)
        { questionId: q2.id, answer: '7' }, // Incorrect (0/15)
        {
          questionId: q3.id,
          answer:
            'The event loop moves items from the microtask queue to the call stack.',
        }, // Correct (25/25)
      ],
    },
  );
  console.log(
    `✓ Failed Attempt Score: ${failResult.score} (${failResult.percentage}%), isPassed: ${failResult.isPassed}`,
  );
  if (failResult.isPassed !== false || failResult.score !== 25) {
    throw new Error(
      `Expected failing attempt with 25/50 points, got score: ${failResult.score}, isPassed: ${failResult.isPassed}`,
    );
  }

  // 8. Test Manual Essay Review Flow
  console.log('\n--- 7. Testing Manual Essay Question & Admin Review ---');
  const qManual = await questionsService.create(
    {
      title: 'Explain Closure with real-world examples',
      type: AssessmentType.ESSAY,
      difficulty: 'HARD',
      status: QuestionStatus.PUBLISHED,
      defaultPoints: 30,
      config: {
        gradingMode: 'MANUAL',
        rubric: 'Must explain lexical scoping and practical use cases.',
      },
    },
    admin.id,
  );

  const manualExercise = await exercisesService.create({
    studyDayId: studyDay.id,
    title: 'Advanced Concepts Exam (Manual Review)',
    description: 'Testing manual essay evaluation',
    difficulty: ExerciseDifficulty.HARD,
    order: 102,
    passingScore: 70,
    questions: [
      { questionId: q1.id, order: 1, points: 20 },
      { questionId: qManual.id, order: 2, points: 30 },
    ],
  });

  const manualAttempt = await assessmentsService.submitAttempt(
    student.id,
    manualExercise.id,
    {
      answers: [
        { questionId: q1.id, answer: 'opt_3' }, // 20/20
        {
          questionId: qManual.id,
          answer:
            'A closure is a function bundled with its lexical environment.',
        }, // Manual
      ],
    },
  );

  console.log(
    `✓ Submitted Manual Review Attempt: Status = ${manualAttempt.status}, isPassed = ${manualAttempt.isPassed}`,
  );
  if (manualAttempt.status !== 'PENDING_REVIEW') {
    throw new Error(
      `Expected status PENDING_REVIEW, got: ${manualAttempt.status}`,
    );
  }

  // Admin reviews the manual attempt (gives 25/30 for the essay question)
  const reviewedAttempt = await assessmentsService.reviewAttempt(
    manualAttempt.id,
    {
      score: 25,
      isPassed: true,
      feedback: 'Good explanation, could include more examples.',
    },
  );

  console.log(
    `✓ Admin Reviewed Attempt. Final Attempt Status: ${reviewedAttempt.status}, Score: ${reviewedAttempt.score} (${reviewedAttempt.percentage}%), isPassed: ${reviewedAttempt.isPassed}`,
  );
  if (reviewedAttempt.score !== 45 || !reviewedAttempt.isPassed) {
    throw new Error(
      `Expected reviewed attempt to pass with 45 points, got: ${reviewedAttempt.score}`,
    );
  }

  // 9. Test Archiving Question
  console.log('\n--- 8. Testing Question Archival Safety ---');
  const archivedQ = await questionsService.archive(q1.id);
  console.log(
    `✓ Archived question ${archivedQ.id}, status is now: ${archivedQ.status}`,
  );

  // Historical attempt remains fully accessible
  const history = await assessmentsService.getAttempts(exercise.id, student.id);
  console.log(
    `✓ Student Attempt History still contains ${history.length} attempts after archiving Q1`,
  );
  if (history.length === 0 || history[0].answers.length === 0) {
    throw new Error(
      'Historical attempt data was corrupted or lost upon archiving question!',
    );
  }

  // Clean up test exercises and test questions
  console.log('\n--- 9. Cleaning up transient test artifacts ---');
  await prisma.assessmentAnswer.deleteMany({
    where: {
      attemptId: { in: [submissionResult.id, failResult.id, manualAttempt.id] },
    },
  });
  await prisma.assessmentAttempt.deleteMany({
    where: {
      id: { in: [submissionResult.id, failResult.id, manualAttempt.id] },
    },
  });
  await prisma.exerciseQuestion.deleteMany({
    where: {
      exerciseId: { in: [exercise.id, exercise2.id, manualExercise.id] },
    },
  });
  await prisma.exercise.deleteMany({
    where: { id: { in: [exercise.id, exercise2.id, manualExercise.id] } },
  });
  await prisma.question.deleteMany({
    where: { id: { in: [q1.id, q2.id, q3.id, duplicatedQ.id, qManual.id] } },
  });
  if (studyDay.dayNumber === 99) {
    await prisma.studyDay
      .delete({ where: { id: studyDay.id } })
      .catch(() => {});
  }

  console.log(
    '\n=============================================================',
  );
  console.log(
    '🎉 ALL QUESTION BANK & MULTI-QUESTION ASSESSMENT E2E TESTS PASSED!',
  );
  console.log(
    '=============================================================\n',
  );
}

runE2EValidation()
  .catch((err) => {
    console.error('❌ E2E Validation Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
