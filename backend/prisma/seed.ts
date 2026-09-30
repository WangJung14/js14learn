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

  // 3. Create the agreed 14-day JavaScript roadmap
  // Format: Learn -> Code -> Exercises -> Mini-project -> Checkpoint
  // Each day contains 5 exercises, matching the project's 3-5 exercises/day constraint.
  const studyDaysData = [
    {
      dayNumber: 1,
      order: 1,
      title: 'Values, Types & Operators',
      description: 'Build a strong JavaScript foundation with primitive values, types, coercion, and operators.',
      content: `# Day 1: Values, Types & Operators

## Learning goals
- Understand string, number, boolean, null, undefined, symbol, and bigint.
- Distinguish primitive values and understand typeof.
- Understand implicit vs explicit type conversion.
- Use arithmetic, comparison, logical, assignment, and ternary operators.

## Practice rule
Spend about 30% of the day on theory and 70% writing JavaScript.

## Checkpoint
You should be able to predict the result and explain why before running the code.`,
      exercises: [
        {
          title: 'Identify JavaScript Types',
          description: 'Write getType(value) and test it with string, number, boolean, null, undefined, bigint, object, and array values.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Type Coercion Lab',
          description: 'Predict and explain the results of expressions mixing strings and numbers, then verify them with JavaScript.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'Operator Challenge',
          description: 'Solve 10 expressions using arithmetic, comparison, logical, assignment, and ternary operators without first running them.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: Console Calculator',
          description: 'Build a small calculator using numeric input, arithmetic operators, conditionals, and formatted output.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 4,
        },
        {
          title: 'Day 1 Checkpoint',
          description: 'Complete a short 10-question checkpoint covering values, types, coercion, == vs ===, truthy/falsy values, and operator precedence.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 2,
      order: 2,
      title: 'Variables & Control Flow',
      description: 'Use let and const, conditions, switch, loops, and structured control flow to solve problems.',
      content: `# Day 2: Variables & Control Flow

## Learning goals
- Use let and const correctly.
- Understand block scope at a practical level.
- Write if/else, nested conditions, and switch statements.
- Use for, while, and do...while loops.
- Combine conditions and loops to solve algorithmic problems.

## Mini-project
Number Guessing Game.

## Checkpoint
Solve control-flow problems without copying a solution.`,
      exercises: [
        {
          title: 'Grade Classifier',
          description: 'Write a function that converts a numeric score into A/B/C/D/F using clear conditional logic.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'FizzBuzz',
          description: 'Print numbers 1-100 with Fizz, Buzz, and FizzBuzz using a loop and conditions.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'Loop Statistics',
          description: 'Given N, calculate the sum, count of even numbers, count of odd numbers, and largest value from 1..N.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: Number Guessing Game',
          description: 'Build a number guessing game with a secret number, repeated attempts, high/low hints, attempt counting, and a replay option.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 4,
        },
        {
          title: 'Day 2 Checkpoint',
          description: 'Complete control-flow problems involving nested conditions, switch, for/while loops, break, continue, and input validation.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 3,
      order: 3,
      title: 'Functions & Parameters',
      description: 'Learn function declarations, expressions, arrow functions, parameters, return values, and reusable logic.',
      content: `# Day 3: Functions & Parameters

## Learning goals
- Write declarations, expressions, and arrow functions.
- Use parameters, default values, rest parameters, and return values.
- Separate input, processing, and output.
- Build small reusable functions instead of one large script.

## Mini-project
Calculator application implemented with reusable functions.

## Checkpoint
Refactor duplicated code into reusable functions.`,
      exercises: [
        {
          title: 'Function Basics',
          description: 'Implement add, subtract, multiply, divide, min, max, and average as small reusable functions.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Default and Rest Parameters',
          description: 'Create functions using default parameters and rest parameters to process a variable number of arguments.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'Function Composition',
          description: 'Create small functions and compose them so the output of one function becomes the input of another.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: JavaScript Calculator',
          description: 'Build a calculator with reusable operation functions, input validation, division-by-zero handling, and a clean command interface.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 4,
        },
        {
          title: 'Day 3 Checkpoint',
          description: 'Rewrite several procedural snippets into reusable functions and explain the difference between parameters, arguments, and return values.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 4,
      order: 4,
      title: 'Scope, Closures & Recursion',
      description: 'Understand lexical scope, closures, function nesting, recursion, and common function-scope pitfalls.',
      content: `# Day 4: Scope, Closures & Recursion

## Learning goals
- Distinguish global, function, and block scope.
- Understand lexical scope and closures.
- Recognize common scope bugs.
- Write and trace recursive functions.

## Checkpoint
Be able to explain what variables a closure can access and trace a recursive call stack.`,
      exercises: [
        {
          title: 'Scope Prediction',
          description: 'Predict which variables are accessible in nested blocks and functions, then verify the result.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Closure Counter',
          description: 'Create createCounter(start) that returns increment, decrement, and value-reading behavior while keeping state private.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Recursive Factorial and Power',
          description: 'Implement factorial and power recursively and explain the base case and recursive case.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Recursive Array Sum',
          description: 'Write a recursive function that calculates the sum of an array without using reduce.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
        {
          title: 'Day 4 Checkpoint',
          description: 'Trace closure and recursion examples on paper, then solve a scope bug and a recursive counting problem.',
          difficulty: ExerciseDifficulty.HARD,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 5,
      order: 5,
      title: 'Arrays & Objects',
      description: 'Work confidently with arrays, objects, nested data, references, and common data manipulation patterns.',
      content: `# Day 5: Arrays & Objects

## Learning goals
- Create and update arrays and objects.
- Understand references and mutation.
- Read and update nested data.
- Combine arrays and objects to model real application data.

## Mini-project
Student Management System.

## Checkpoint
Manipulate collections of student objects without losing data integrity.`,
      exercises: [
        {
          title: 'Array Fundamentals',
          description: 'Practice push, pop, shift, unshift, slice, splice, and indexed access on a student score list.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Object Data Modeling',
          description: 'Create student objects with nested profile and score data, then read and update selected properties.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'Array of Students',
          description: 'Implement addStudent, removeStudent, findStudent, and updateStudent for an array of student objects.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: Student Management System',
          description: 'Build a console-based student manager with add, edit, delete, search, average-score calculation, and listing features.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
        {
          title: 'Day 5 Checkpoint',
          description: 'Solve array/object manipulation tasks and explain mutation, references, shallow copying, and nested object access.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 6,
      order: 6,
      title: 'Destructuring, Spread, Rest, JSON & Map',
      description: 'Use modern data-handling syntax and built-in structures for clean JavaScript code.',
      content: `# Day 6: Destructuring, Spread, Rest, JSON & Map

## Learning goals
- Destructure arrays and objects.
- Use spread and rest syntax.
- Serialize and parse JSON.
- Understand when Map is more appropriate than a plain object.
- Combine these tools when processing application data.`,
      exercises: [
        {
          title: 'Destructuring Practice',
          description: 'Extract nested properties from a realistic user and product data object using object and array destructuring.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Spread and Rest Utilities',
          description: 'Create immutable object/array updates with spread and utility functions that accept variable arguments with rest.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'JSON Serialization',
          description: 'Convert application data to JSON and back, and identify values that behave differently during JSON serialization.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Map-based Student Registry',
          description: 'Build a Map keyed by student ID with add, find, update, delete, and iteration operations.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 4,
        },
        {
          title: 'Day 6 Checkpoint',
          description: 'Refactor older code using destructuring/spread/rest, then solve a JSON and Map data-processing challenge.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 7,
      order: 7,
      title: 'Higher-Order Functions: map, filter, reduce',
      description: 'Master functional data transformation with map, filter, reduce, find, some, every, and composition.',
      content: `# Day 7: Higher-Order Functions

## Learning goals
- Understand functions as values.
- Use map for transformation.
- Use filter for selection.
- Use reduce for aggregation.
- Combine higher-order functions to process real application data.

## Mini-project
Product Management.

## Checkpoint
Choose the appropriate array method instead of writing unnecessary loops.`,
      exercises: [
        {
          title: 'map Transformation',
          description: 'Transform a list of products into display objects and a list of formatted names/prices using map.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'filter Selection',
          description: 'Filter products by category, price range, stock status, and rating using filter.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'reduce Aggregation',
          description: 'Calculate cart totals, category totals, average prices, and stock counts using reduce.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: Product Management',
          description: 'Build a product manager that supports search/filter, price calculations, stock summaries, and formatted product output using map/filter/reduce.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
        {
          title: 'Day 7 Checkpoint',
          description: 'Given several real-world data-processing requirements, select and implement the correct combination of map, filter, reduce, find, some, or every.',
          difficulty: ExerciseDifficulty.HARD,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 8,
      order: 8,
      title: 'OOP, this, Classes & Modules',
      description: 'Understand object-oriented JavaScript, this, classes, inheritance, and modular code organization.',
      content: `# Day 8: OOP, this, Classes & Modules

## Learning goals
- Understand objects, prototypes, and classes.
- Use constructors, instance methods, static methods, getters, and setters.
- Understand the behavior of this in common call contexts.
- Split code into ES modules with import/export.

## Mini-project
Modularize the Student Management System from Day 5.

## Checkpoint
Explain when to use a class and when a plain object/function is enough.`,
      exercises: [
        {
          title: 'Class Basics',
          description: 'Create a Student class with constructor, instance methods, getter, and setter for a score.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'this Context',
          description: 'Analyze several this examples and fix methods that lose their expected context when passed as callbacks.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Inheritance',
          description: 'Create User, Student, and Admin classes with shared behavior and overridden methods.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: Modular Student Manager',
          description: 'Refactor the Day 5 student manager into separate ES modules for models, services, validation, and application entry point.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
        {
          title: 'Day 8 Checkpoint',
          description: 'Implement a small class hierarchy and split it into modules using named/default exports and imports.',
          difficulty: ExerciseDifficulty.HARD,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 9,
      order: 9,
      title: 'Errors, Debugging & Regular Expressions',
      description: 'Write safer JavaScript with exceptions, custom errors, debugging techniques, and practical regular expressions.',
      content: `# Day 9: Errors, Debugging & Regular Expressions

## Learning goals
- Understand Error, try/catch/finally, and throw.
- Create custom error classes.
- Debug using breakpoints, stack traces, and structured console output.
- Use regular expressions for validation and extraction.

## Checkpoint
Diagnose a broken program and explain the root cause instead of only patching the symptom.`,
      exercises: [
        {
          title: 'Safe JSON Parser',
          description: 'Implement safeJsonParse(input, fallback) that catches malformed JSON and returns a fallback value.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Custom ValidationError',
          description: 'Create a custom ValidationError class carrying a field name and message for form validation.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Debug the Broken Program',
          description: 'Find and fix several intentional bugs involving scope, type coercion, array mutation, and asynchronous timing.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Regex Validation Toolkit',
          description: 'Create regular expressions and helper functions to validate email, phone, username, and simple ID formats.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 4,
        },
        {
          title: 'Day 9 Checkpoint',
          description: 'Debug a multi-error script, add meaningful error handling, and solve several regex matching/extraction tasks.',
          difficulty: ExerciseDifficulty.HARD,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 10,
      order: 10,
      title: 'Asynchronous JavaScript, Promises & Async/Await',
      description: 'Understand asynchronous execution, Promises, async/await, Fetch, concurrency, and error handling.',
      content: `# Day 10: Async JavaScript, Promises & Async/Await

## Learning goals
- Understand the event loop at a practical level.
- Work with callbacks and Promise states.
- Use then/catch/finally and async/await.
- Handle asynchronous errors.
- Use Fetch for HTTP requests.
- Compare sequential and parallel async execution.

## Mini-project
Fake API application.

## Checkpoint
Turn callback-style code into robust Promise/async-await code.`,
      exercises: [
        {
          title: 'Promise Basics',
          description: 'Create Promises that resolve/reject after delays and consume them with then, catch, and finally.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Async/Await Conversion',
          description: 'Convert callback and then/catch examples into readable async/await functions with try/catch.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Sequential vs Parallel Requests',
          description: 'Run asynchronous tasks sequentially and in parallel, then compare timing and failure behavior.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: Fake API',
          description: 'Build a fake API service that returns users/products with Promise delays, supports success/failure states, and is consumed using async/await.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
        {
          title: 'Day 10 Checkpoint',
          description: 'Implement an async data-loading flow using Promise, async/await, Fetch-style handling, loading state, success state, and error handling.',
          difficulty: ExerciseDifficulty.HARD,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 11,
      order: 11,
      title: 'DOM Manipulation',
      description: 'Use JavaScript to select, create, update, and remove HTML elements and build interactive interfaces.',
      content: `# Day 11: DOM Manipulation

## Learning goals
- Select elements with querySelector/querySelectorAll.
- Read and update text, attributes, and classes.
- Create, append, and remove nodes.
- Keep application state synchronized with the DOM.

## Mini-project
Todo List.`,
      exercises: [
        {
          title: 'DOM Selection and Updates',
          description: 'Select elements and update text, attributes, classes, and styles from JavaScript.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Dynamic List Renderer',
          description: 'Render an array of objects into a dynamic HTML list and support empty-state rendering.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'Create and Remove Nodes',
          description: 'Build UI elements with createElement, append, remove, and dataset attributes.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: Todo List',
          description: 'Build a DOM-based Todo List with add, delete, complete, filter, and clear-completed functionality.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
        {
          title: 'Day 11 Checkpoint',
          description: 'Build a small interactive DOM screen from a specification without copying the HTML manipulation code.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 12,
      order: 12,
      title: 'Events, Forms & Event Delegation',
      description: 'Handle user interactions, forms, validation, bubbling, and event delegation to build maintainable interfaces.',
      content: `# Day 12: Events, Forms & Event Delegation

## Learning goals
- Understand click, input, submit, change, and keyboard events.
- Prevent default form behavior when appropriate.
- Validate user input.
- Understand event bubbling and delegation.
- Keep event handlers organized.

## Mini-project
Todo List v2.`,
      exercises: [
        {
          title: 'Event Handler Practice',
          description: 'Implement click, input, change, and keyboard handlers for a small interactive page.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Form Validation',
          description: 'Validate a registration-style form and display field-level errors without reloading the page.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 2,
        },
        {
          title: 'Event Delegation',
          description: 'Use one parent event listener to handle actions for dynamically created list items.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: Todo List v2',
          description: 'Upgrade the Todo List with forms, validation, edit mode, event delegation, filters, and keyboard-friendly interactions.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
        {
          title: 'Day 12 Checkpoint',
          description: 'Implement a form plus dynamic list interaction using event delegation and explain bubbling vs capturing at a practical level.',
          difficulty: ExerciseDifficulty.HARD,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 13,
      order: 13,
      title: 'Fetch, HTTP, JSON & LocalStorage',
      description: 'Connect JavaScript applications to HTTP APIs and persist useful client-side state.',
      content: `# Day 13: Fetch, HTTP, JSON & LocalStorage

## Learning goals
- Understand request/response, HTTP methods, status codes, and JSON.
- Use fetch with async/await.
- Handle loading, success, empty, and error states.
- Persist application data with localStorage.
- Combine API data with DOM rendering and client-side state.

## Mini-project
Movie/Product Search.

## Checkpoint
Build a complete client-side data flow: request -> parse -> render -> persist.`,
      exercises: [
        {
          title: 'HTTP and JSON Fundamentals',
          description: 'Explain common HTTP methods/status codes and parse JSON request/response payloads in JavaScript.',
          difficulty: ExerciseDifficulty.EASY,
          order: 1,
        },
        {
          title: 'Fetch GET Request',
          description: 'Fetch data from a public API, parse JSON, and render a useful subset of the response.',
          difficulty: ExerciseDifficulty.EASY,
          order: 2,
        },
        {
          title: 'LocalStorage Persistence',
          description: 'Save, load, update, and remove JSON-encoded application state in localStorage.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 3,
        },
        {
          title: 'Mini-project: Movie/Product Search',
          description: 'Build a search UI that fetches remote data, handles loading/errors, renders results, and remembers recent searches in localStorage.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
        {
          title: 'Day 13 Checkpoint',
          description: 'Implement an end-to-end Fetch + JSON + DOM + localStorage flow and correctly handle HTTP/API failures.',
          difficulty: ExerciseDifficulty.HARD,
          order: 5,
        },
      ],
    },
    {
      dayNumber: 14,
      order: 14,
      title: 'Final JavaScript Project & React Readiness',
      description: 'Integrate the complete 14-day JavaScript foundation into a final project and verify readiness for React.',
      content: `# Day 14: Final JavaScript Project + React Readiness Test

## Final project
Build a JavaScript Learning Dashboard.

The final project should combine:
- A simulated login screen.
- Lessons and exercise sections.
- Search and filtering.
- Completion state and score/progress tracking.
- localStorage persistence.
- Fetch API integration.
- DOM manipulation and events.
- map/filter/reduce.
- async/await.
- ES modules.

## React readiness
Before moving to React, demonstrate that you can:
- Break a UI into reusable responsibilities.
- Manage application state separately from rendering.
- Work with arrays of objects.
- Handle asynchronous data.
- Organize code into modules.
- Debug and validate user input.

## Final checkpoint
Complete the project and pass the React Readiness Test before starting React.`,
      exercises: [
        {
          title: 'Final Architecture Plan',
          description: 'Design the JavaScript Learning Dashboard structure, state model, modules, screens, and data flow before coding.',
          difficulty: ExerciseDifficulty.MEDIUM,
          order: 1,
        },
        {
          title: 'Final Dashboard Core',
          description: 'Implement lessons, exercises, search/filter, completion tracking, score/progress calculation, and DOM rendering.',
          difficulty: ExerciseDifficulty.HARD,
          order: 2,
        },
        {
          title: 'Final API & Persistence Integration',
          description: 'Add Fetch API data loading, async/await error handling, localStorage persistence, and restoration of user progress.',
          difficulty: ExerciseDifficulty.HARD,
          order: 3,
        },
        {
          title: 'Mini-project: JavaScript Learning Dashboard',
          description: 'Complete the full final project by integrating login simulation, lessons, exercises, search/filter, progress, localStorage, Fetch, DOM/events, map/filter/reduce, async/await, and modules.',
          difficulty: ExerciseDifficulty.HARD,
          order: 4,
        },
        {
          title: 'React Readiness Test',
          description: 'Pass a final checkpoint covering values/types, control flow, functions/scope, arrays/objects, modern syntax, HOFs, OOP/modules, errors/regex, async/await, DOM/events, Fetch/HTTP/JSON, and localStorage.',
          difficulty: ExerciseDifficulty.HARD,
          order: 5,
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
