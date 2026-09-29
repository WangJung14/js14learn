import { PrismaClient, Role, ExerciseDifficulty, ProgressStatus, ActivityType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data in reverse order of dependencies
  await prisma.activity.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.studyDay.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records');

  // 1. Create Users
  const passwordHashAdmin = await bcrypt.hash('admin123', 10);
  const passwordHashStudent = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@jsstudyhub.local',
      passwordHash: passwordHashAdmin,
      role: Role.ADMIN,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
    },
  });

  const tommy = await prisma.user.create({
    data: {
      name: 'Tommy Dev',
      email: 'tommy@jsstudyhub.local',
      passwordHash: passwordHashStudent,
      role: Role.STUDENT,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tommy',
    },
  });

  const alex = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex@jsstudyhub.local',
      passwordHash: passwordHashStudent,
      role: Role.STUDENT,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
  });

  const john = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@jsstudyhub.local',
      passwordHash: passwordHashStudent,
      role: Role.STUDENT,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
  });

  console.log('✅ Created 1 Admin and 3 Student users');

  // 2. Create Group & Group Members
  const group = await prisma.group.create({
    data: {
      name: 'JavaScript Warriors',
      inviteCode: 'JSWARRIORS2026',
    },
  });

  await prisma.groupMember.createMany({
    data: [
      { userId: tommy.id, groupId: group.id },
      { userId: alex.id, groupId: group.id },
      { userId: john.id, groupId: group.id },
    ],
  });

  console.log(`✅ Created Group "${group.name}" with 3 members`);

  // 3. Create 14 Study Days & Exercises
  const studyDaysData = [
    {
      dayNumber: 1,
      order: 1,
      title: 'Values, Types & Operators',
      description: 'Master primitive data types, type coercion, and arithmetic/logical operators in JS.',
      content: `# Day 1: Values, Types & Operators\n\nLearn primitive types: string, number, boolean, null, undefined, symbol, and bigint.\nUnderstand how type conversion works in JavaScript operators.`,
      exercises: [
        {
          title: 'Check Data Type',
          description: 'Write a function getType(val) that returns the exact type of primitive values.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Strict vs Loose Equality',
          description: 'Explain the difference between == and === with 3 code examples.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'Operator Precedence Challenge',
          description: 'Evaluate complex logical expressions involving &&, ||, and ! without using browser devtools.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 2,
      order: 2,
      title: 'Variables, Conditions & Loops',
      description: 'Learn let/const variable declarations, switch statements, and loop structures.',
      content: `# Day 2: Control Flow & Loops\n\nUnderstand block scope vs function scope, if-else branches, switch cases, and for/while loops.`,
      exercises: [
        {
          title: 'FizzBuzz Implementation',
          description: 'Write a loop printing numbers from 1 to 100 with Fizz, Buzz, and FizzBuzz replacements.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Leap Year Checker',
          description: 'Write a function isLeapYear(year) using nested conditional logic.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Triangle Pattern Generator',
          description: 'Print a 7-step hash pattern (#) using a single while loop.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 3,
      order: 3,
      title: 'Functions, Parameters & Scope',
      description: 'Understand function declarations, expressions, arrow functions, and closure scope.',
      content: `# Day 3: Functions & Scope\n\nExplore function hoisting, default parameters, rest parameters, and lexical scoping rules.`,
      exercises: [
        {
          title: 'Minimum of Two Numbers',
          description: 'Write a function min(a, b) returning the smaller of two numbers.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Recursive Power Function',
          description: 'Write a recursive function power(base, exponent).',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Counter Closure Generator',
          description: 'Create a function createCounter(initialValue) returning increment and decrement methods.',
          difficulty: ExerciseDifficulty.HARD,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 4,
      order: 4,
      title: 'Arrays & Common Array Methods',
      description: 'Manipulate lists using push, pop, shift, unshift, slice, splice, and iteration methods.',
      content: `# Day 4: Arrays in JavaScript\n\nMaster indexed array collections, mutator methods vs non-mutator methods.`,
      exercises: [
        {
          title: 'Reverse Array In-Place',
          description: 'Write reverseInPlace(arr) without creating an auxiliary array.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 1,
        },
        {
          title: 'Remove Duplicates',
          description: 'Write removeDuplicates(arr) returning an array with unique items.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'Chunk Array into Subarrays',
          description: 'Write chunkArray(arr, size) splitting an array into chunks of given size.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Array Flattening',
          description: 'Implement a custom flatten(arr) function for nested arrays.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
      ],
    },
    {
      dayNumber: 5,
      order: 5,
      title: 'Objects, Properties & References',
      description: 'Work with object literals, key-value pairs, prototype chains, and reference equality.',
      content: `# Day 5: Objects & References\n\nLearn object creation, property accessors, Object.keys(), Object.values(), and pass-by-reference.`,
      exercises: [
        {
          title: 'Deep Clone Object',
          description: 'Write deepClone(obj) to clone objects containing nested structures.',
          difficulty: ExerciseDifficulty.HARD,
          order: 1,
        },
        {
          title: 'Object Property Sum',
          description: 'Write sumSalaries(salariesObj) returning total salary values.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'Merge User Profiles',
          description: 'Merge default settings with user customized settings object.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 6,
      order: 6,
      title: 'DOM Manipulation & Event Handling',
      description: 'Interact with HTML elements, event listeners, bubbling, and dynamic DOM updates.',
      content: `# Day 6: Document Object Model (DOM)\n\nLearn document.querySelector, element attributes, dynamic node creation, and addEventListener.`,
      exercises: [
        {
          title: 'Interactive Counter Widget',
          description: 'Build an HTML/JS page with + and - buttons modifying a text element.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Dynamic Todo List Item Creator',
          description: 'Create a form that appends new <li> elements with a delete button.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Event Delegation Handler',
          description: 'Implement event delegation on a parent <ul> element to handle item clicks.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 7,
      order: 7,
      title: 'Higher-Order Functions (map, filter, reduce)',
      description: 'Functional programming concepts using array transform methods.',
      content: `# Day 7: Higher-Order Functions\n\nMaster map(), filter(), reduce(), find(), and composition patterns.`,
      exercises: [
        {
          title: 'Filter Active Users',
          description: 'Given a list of user objects, filter users with status active and age >= 18.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Transform User Names',
          description: 'Use map to return an array of formatted full names.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'Cart Total Calculator with Reduce',
          description: 'Calculate total purchase order value using array reduce.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Group Objects by Property',
          description: 'Implement groupBy(arr, key) using reduce to group array elements.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
      ],
    },
    {
      dayNumber: 8,
      order: 8,
      title: 'ES6+ Modern Syntax & Modules',
      description: 'Destructuring, template literals, spread/rest operators, ES modules (import/export).',
      content: `# Day 8: Modern ES6+ Features\n\nLearn modern JavaScript syntax enhancements and modular code organization.`,
      exercises: [
        {
          title: 'Destructuring Assignment',
          description: 'Extract nested properties from a complex API payload object using destructuring.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Spread Operator Utility',
          description: 'Write a function mergeArraysAndOverride(arr1, arr2, overrides).',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'ES Modules Exporter',
          description: 'Create mathUtils.js exporting named helper functions and a default class.',
          difficulty: ExerciseDifficulty.EASY,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 9,
      order: 9,
      title: 'Asynchronous JavaScript & Callbacks',
      description: 'Understand event loops, call stack, microtask queue, and callback patterns.',
      content: `# Day 9: Asynchronous Execution & Callbacks\n\nExplore single-threaded event loop, setTimeout, setInterval, and callback pyramid of doom.`,
      exercises: [
        {
          title: 'Custom Digital Clock',
          description: 'Implement a clock updating current time string every second.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Debounce Function',
          description: 'Write a custom debounce(fn, delay) function for search input handling.',
          difficulty: ExerciseDifficulty.HARD,
          order: 2,
        },
        {
          title: 'Throttle Function',
          description: 'Write a throttle(fn, limit) helper function for scroll events.',
          difficulty: ExerciseDifficulty.HARD,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 10,
      order: 10,
      title: 'Promises, Async/Await & Fetch API',
      description: 'Handle asynchronous operations cleanly using Promises, async/await, and HTTP requests.',
      content: `# Day 10: Promises & Async/Await\n\nMaster Promise states (pending, fulfilled, rejected), Promise.all, and async/await syntax.`,
      exercises: [
        {
          title: 'Fetch User Profile',
          description: 'Fetch JSON data from JSONPlaceholder API and log user details.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Promise Timeout Wrapper',
          description: 'Write a function timeoutPromise(promise, ms) that rejects if promise exceeds ms.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Sequential Async Execution',
          description: 'Run an array of asynchronous tasks sequentially using async/await loop.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Parallel Request Batcher',
          description: 'Use Promise.allSettled to request multiple URLs concurrently.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
      ],
    },
    {
      dayNumber: 11,
      order: 11,
      title: 'Error Handling & Debugging Techniques',
      description: 'Try/catch/finally blocks, custom Error classes, console methods, and stack traces.',
      content: `# Day 11: Error Handling\n\nLearn robust error handling strategies in JavaScript applications.`,
      exercises: [
        {
          title: 'Custom ValidationError Class',
          description: 'Create a custom ValidationError extending Error with field metadata.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Safe JSON Parser',
          description: 'Write safeJsonParse(jsonString, fallbackValue) returning fallback on invalid syntax.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'API Error Retry Mechanism',
          description: 'Write fetchWithRetry(url, retries) retrying failed requests up to N times.',
          difficulty: ExerciseDifficulty.HARD,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 12,
      order: 12,
      title: 'Object-Oriented JS & Prototypes',
      description: 'ES6 Classes, constructors, static methods, getters/setters, and inheritance.',
      content: `# Day 12: Object-Oriented Programming\n\nLearn classes, prototype inheritance, private fields (#field), and method overriding.`,
      exercises: [
        {
          title: 'BankAccount Class',
          description: 'Create BankAccount class with deposit, withdraw, and getBalance methods.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Shape Inheritance Hierarchy',
          description: 'Create Base Shape class and Circle/Rectangle subclasses overriding area().',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'EventEmitter Class',
          description: 'Build a custom EventEmitter class supporting on, off, and emit methods.',
          difficulty: ExerciseDifficulty.HARD,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 13,
      order: 13,
      title: 'Web Storage & Browser APIs',
      description: 'LocalStorage, SessionStorage, IndexedDB, and Geolocation/Clipboard APIs.',
      content: `# Day 13: Browser APIs & Storage\n\nPersist data across user browser sessions using localStorage and sessionStorage.`,
      exercises: [
        {
          title: 'Theme Preference Persister',
          description: 'Save and retrieve light/dark theme preference in localStorage.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Session Draft Form Auto-saver',
          description: 'Auto-save form inputs into sessionStorage every 2 seconds.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Clipboard Copy Utility',
          description: 'Write copyToClipboard(text) using navigator.clipboard API with fallback.',
          difficulty: ExerciseDifficulty.EASY,
          order: 3,
        },
      ],
    },
    {
      dayNumber: 14,
      order: 14,
      title: 'Final Capstone Project',
      description: 'Build a full JavaScript interactive web application combining all 14 days of knowledge.',
      content: `# Day 14: Final Capstone Project\n\nCombine DOM manipulation, modern ES6+ classes, async API calls, and local storage into a final project.`,
      exercises: [
        {
          title: 'Interactive Weather Dashboard',
          description: 'Build a weather application fetching live forecasts and saving favorite cities.',
          difficulty: ExerciseDifficulty.HARD,
          order: 1,
        },
        {
          title: 'Task Management Kanban App',
          description: 'Build a drag-and-drop task management board using local storage.',
          difficulty: ExerciseDifficulty.HARD,
          order: 2,
        },
        {
          title: 'JS Study Hub Companion Extension',
          description: 'Create a mini code runner playground widget for testing JavaScript snippets.',
          difficulty: ExerciseDifficulty.HARD,
          order: 3,
        },
      ],
    },
  ];

  let totalExercisesCount = 0;

  for (const dayData of studyDaysData) {
    const { exercises, ...studyDayFields } = dayData;

    const createdDay = await prisma.studyDay.create({
      data: {
        ...studyDayFields,
      },
    });

    for (const ex of exercises) {
      await prisma.exercise.create({
        data: {
          ...ex,
          studyDayId: createdDay.id,
        },
      });
      totalExercisesCount++;
    }
  }

  console.log(`✅ Created 14 Study Days with ${totalExercisesCount} educational exercises`);

  // 4. Create Initial Progress Records for Students
  const studyDays = await prisma.studyDay.findMany({ orderBy: { dayNumber: 'asc' } });
  const day1 = studyDays[0];
  const day2 = studyDays[1];

  for (const student of [tommy, alex, john]) {
    await prisma.progress.create({
      data: {
        userId: student.id,
        studyDayId: day1.id,
        status: ProgressStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    await prisma.progress.create({
      data: {
        userId: student.id,
        studyDayId: day2.id,
        status: ProgressStatus.IN_PROGRESS,
      },
    });

    await prisma.activity.create({
      data: {
        userId: student.id,
        type: ActivityType.JOINED_GROUP,
        message: `${student.name} joined JavaScript Warriors`,
      },
    });

    await prisma.activity.create({
      data: {
        userId: student.id,
        type: ActivityType.COMPLETED_DAY,
        message: `${student.name} completed Day 01: Values, Types & Operators`,
      },
    });
  }

  console.log('✅ Created initial student Progress and Activity records');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
