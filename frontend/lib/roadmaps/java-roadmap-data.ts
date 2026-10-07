// AUTO-GENERATED JAVA CORE ROADMAP DATA
// SOURCE OF TRUTH: d:/Study_Hub/javaRoadmap.md
// Total Days: 30 | Total Topics: 112 | Total Subtopics: 629

import { RoadmapDay, RoadmapPhase, RoadmapTrackMeta } from './types';

export const JAVA_ROADMAP_META: RoadmapTrackMeta = {
  id: 'java',
  name: 'Java Core',
  title: '30-Day Java Core Learning Roadmap',
  badge: 'Java Backend Ready',
  durationLabel: '30 Days Curriculum',
  totalDays: 30,
  totalTopics: 112,
  totalSubtopics: 629,
  description: 'Lộ trình chuẩn hóa 30 ngày Java Core định hướng Backend Engineer: từ kiến trúc JVM, OOP chuyên sâu, Generics, Collections Framework đến Concurrency & Multithreading.',
  iconName: 'Coffee',
};

export const JAVA_ROADMAP_PHASES: RoadmapPhase[] = [
  {
    "id": "phase-1",
    "title": "Phase 1: Java Fundamentals & Structured Programming",
    "description": "Nền tảng môi trường, cú pháp Java, kiểu dữ liệu nguyên thủy, chuỗi, luồng điều khiển và mảng.",
    "startDay": 1,
    "endDay": 7,
    "dayCount": 7
  },
  {
    "id": "phase-2",
    "title": "Phase 2: Object-Oriented Programming (OOP) Fundamentals",
    "description": "Tư duy hướng đối tượng, thiết kế Class, Encapsulation, static, Records và quản lý Package/JAR.",
    "startDay": 8,
    "endDay": 12,
    "dayCount": 5
  },
  {
    "id": "phase-3",
    "title": "Phase 3: Advanced OOP, Object Contracts & Polymorphism",
    "description": "Kế thừa, Đa hình chuyên sâu, Object contract (equals/hashCode), Abstract Classes, Sealed Classes và Reflection.",
    "startDay": 13,
    "endDay": 17,
    "dayCount": 5
  },
  {
    "id": "phase-4",
    "title": "Phase 4: Modern Java Interfaces & Functional Programming",
    "description": "Interfaces, Default/Static methods, Lambda Expressions, Functional Interfaces, Inner Classes và Dynamic Proxy.",
    "startDay": 18,
    "endDay": 20,
    "dayCount": 3
  },
  {
    "id": "phase-5",
    "title": "Phase 5: Exception Architecture, Logging & Generics",
    "description": "Kiến trúc ngoại lệ, try-with-resources, Logging, và hệ thống Generics toàn diện (PECS, Type Erasure).",
    "startDay": 21,
    "endDay": 24,
    "dayCount": 4
  },
  {
    "id": "phase-6",
    "title": "Phase 6: Java Collections Framework & Algorithms",
    "description": "Kiến trúc Collection, List, Set, HashMap internal collision mechanics, TreeMap, Queue/Deque và Immutable Collections.",
    "startDay": 25,
    "endDay": 28,
    "dayCount": 4
  },
  {
    "id": "phase-7",
    "title": "Phase 7: Java Concurrency & Modern Multithreading",
    "description": "Đa luồng cơ bản, JMM, Locks, Atomic, ThreadPoolExecutor, BlockingQueue, CompletableFuture và Process Management.",
    "startDay": 29,
    "endDay": 30,
    "dayCount": 2
  }
];

export const JAVA_ROADMAP_DAYS: RoadmapDay[] = [
  {
    "id": "java-day-01",
    "track": "java",
    "dayNumber": 1,
    "title": "Java & Programming Environment",
    "phaseId": "phase-1",
    "phaseTitle": "Phase 1: Java Fundamentals & Structured Programming",
    "description": "Java Platform, JDK, JRE, JVM, Bytecode execution, CLI tools (javac, java, jshell), and IDE Setup.",
    "topics": [
      {
        "id": "java-day-01-topic-01",
        "title": "Java Programming Platform",
        "subtopics": [
          {
            "id": "java-day-01-topic-01-sub-01",
            "title": "Lịch sử và triết lý thiết kế của Java (Write Once, Run Anywhere)",
            "rawTitle": "Lịch sử và triết lý thiết kế của Java (Write Once, Run Anywhere)",
            "tags": []
          },
          {
            "id": "java-day-01-topic-01-sub-02",
            "title": "Java SE (Standard Edition) vs Java EE/Jakarta EE vs Java ME",
            "rawTitle": "Java SE (Standard Edition) vs Java EE/Jakarta EE vs Java ME",
            "tags": []
          },
          {
            "id": "java-day-01-topic-01-sub-03",
            "title": "Java Community Process (JCP) và Java Specification Requests (JSR)",
            "rawTitle": "Java Community Process (JCP) và Java Specification Requests (JSR)",
            "tags": []
          },
          {
            "id": "java-day-01-topic-01-sub-04",
            "title": "Chu kỳ phát hành của Java (6 tháng/release, LTS releases)",
            "rawTitle": "Chu kỳ phát hành của Java (6 tháng/release, LTS releases)",
            "tags": []
          },
          {
            "id": "java-day-01-topic-01-sub-05",
            "title": "OpenJDK vs Oracle JDK và các bản phân phối OpenJDK phổ biến",
            "rawTitle": "OpenJDK vs Oracle JDK và các bản phân phối OpenJDK phổ biến",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-01-topic-02",
        "title": "Java Architecture, JDK, JRE & JVM",
        "subtopics": [
          {
            "id": "java-day-01-topic-02-sub-01",
            "title": "Mối quan hệ giữa JDK, JRE và JVM",
            "rawTitle": "Mối quan hệ giữa JDK, JRE và JVM",
            "tags": []
          },
          {
            "id": "java-day-01-topic-02-sub-02",
            "title": "Cấu trúc tổng quan của JVM (Classloader, Runtime Data Areas, Execution Engine)",
            "rawTitle": "Cấu trúc tổng quan của JVM (Classloader, Runtime Data Areas, Execution Engine)",
            "tags": []
          },
          {
            "id": "java-day-01-topic-02-sub-03",
            "title": "Java Bytecode là gì (.class file)",
            "rawTitle": "Java Bytecode là gì (.class file)",
            "tags": []
          },
          {
            "id": "java-day-01-topic-02-sub-04",
            "title": "Just-In-Time (JIT) Compiler và quá trình chuyển đổi Bytecode sang Native Machine Code",
            "rawTitle": "Just-In-Time (JIT) Compiler và quá trình chuyển đổi Bytecode sang Native Machine Code",
            "tags": []
          },
          {
            "id": "java-day-01-topic-02-sub-05",
            "title": "Tính độc lập nền tảng (Platform Independence) và Portability của Java",
            "rawTitle": "Tính độc lập nền tảng (Platform Independence) và Portability của Java",
            "tags": []
          },
          {
            "id": "java-day-01-topic-02-sub-06",
            "title": "Garbage Collection (GC) cơ bản: Khái niệm quản lý bộ nhớ tự động",
            "rawTitle": "Garbage Collection (GC) cơ bản: Khái niệm quản lý bộ nhớ tự động",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-01-topic-03",
        "title": "Command-line Tools",
        "subtopics": [
          {
            "id": "java-day-01-topic-03-sub-01",
            "title": "Cài đặt JDK và cấu hình biến môi trường (JAVA_HOME, PATH)",
            "rawTitle": "Cài đặt JDK và cấu hình biến môi trường (JAVA_HOME, PATH)",
            "tags": []
          },
          {
            "id": "java-day-01-topic-03-sub-02",
            "title": "javac — Trình biên dịch mã nguồn Java",
            "rawTitle": "javac — Trình biên dịch mã nguồn Java",
            "tags": []
          },
          {
            "id": "java-day-01-topic-03-sub-03",
            "title": "java — Trình thực thi Java Application",
            "rawTitle": "java — Trình thực thi Java Application",
            "tags": []
          },
          {
            "id": "java-day-01-topic-03-sub-04",
            "title": "jar — Đóng gói file lưu trữ Java",
            "rawTitle": "jar — Đóng gói file lưu trữ Java",
            "tags": []
          },
          {
            "id": "java-day-01-topic-03-sub-05",
            "title": "javadoc — Tạo tài liệu API từ comment",
            "rawTitle": "javadoc — Tạo tài liệu API từ comment",
            "tags": []
          },
          {
            "id": "java-day-01-topic-03-sub-06",
            "title": "jshell — Môi trường tương tác Read-Eval-Print Loop (REPL) trong Java",
            "rawTitle": "jshell — Môi trường tương tác Read-Eval-Print Loop (REPL) trong Java",
            "tags": []
          },
          {
            "id": "java-day-01-topic-03-sub-07",
            "title": "Single-file source-code execution (chạy file .java trực tiếp từ Java 11+)",
            "rawTitle": "Single-file source-code execution (chạy file .java trực tiếp từ Java 11+)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-01-topic-04",
        "title": "IDE & Development Setup",
        "subtopics": [
          {
            "id": "java-day-01-topic-04-sub-01",
            "title": "Cài đặt và cấu hình IntelliJ IDEA / Eclipse / VS Code",
            "rawTitle": "Cài đặt và cấu hình IntelliJ IDEA / Eclipse / VS Code",
            "tags": []
          },
          {
            "id": "java-day-01-topic-04-sub-02",
            "title": "Cấu hình Project SDK và Language Level",
            "rawTitle": "Cấu hình Project SDK và Language Level",
            "tags": []
          },
          {
            "id": "java-day-01-topic-04-sub-03",
            "title": "Quản lý source directory (`src`) và output directory (`out`/`bin`)",
            "rawTitle": "Quản lý source directory (`src`) và output directory (`out`/`bin`)",
            "tags": []
          },
          {
            "id": "java-day-01-topic-04-sub-04",
            "title": "Debugger cơ bản: Breakpoints, Step Over, Step Into, Variables Inspection",
            "rawTitle": "Debugger cơ bản: Breakpoints, Step Over, Step Into, Variables Inspection",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 22
  },
  {
    "id": "java-day-02",
    "track": "java",
    "dayNumber": 2,
    "title": "Java Program Structure",
    "phaseId": "phase-1",
    "phaseTitle": "Phase 1: Java Fundamentals & Structured Programming",
    "description": "Java source structure, main() method, comments, variables, final constants, scope, and enum basics.",
    "topics": [
      {
        "id": "java-day-02-topic-01",
        "title": "Java Source File & Class Structure",
        "subtopics": [
          {
            "id": "java-day-02-topic-01-sub-01",
            "title": "Quy ước đặt tên file `.java` và mối quan hệ với `public class`",
            "rawTitle": "Quy ước đặt tên file `.java` và mối quan hệ với `public class`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-01-sub-02",
            "title": "Cấu trúc cơ bản của một Java source file",
            "rawTitle": "Cấu trúc cơ bản của một Java source file",
            "tags": []
          },
          {
            "id": "java-day-02-topic-01-sub-03",
            "title": "Case sensitivity trong Java",
            "rawTitle": "Case sensitivity trong Java",
            "tags": []
          },
          {
            "id": "java-day-02-topic-01-sub-04",
            "title": "Statement, Expression và Block `{}`",
            "rawTitle": "Statement, Expression và Block `{}`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-01-sub-05",
            "title": "Whitespace và quy ước định dạng mã nguồn (Code conventions)",
            "rawTitle": "Whitespace và quy ước định dạng mã nguồn (Code conventions)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-02-topic-02",
        "title": "main() Method",
        "subtopics": [
          {
            "id": "java-day-02-topic-02-sub-01",
            "title": "Cú pháp chuẩn của phương thức `public static void main(String[] args)`",
            "rawTitle": "Cú pháp chuẩn của phương thức `public static void main(String[] args)`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-02-sub-02",
            "title": "Ý nghĩa của từ khóa `public` trong `main`",
            "rawTitle": "Ý nghĩa của từ khóa `public` trong `main`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-02-sub-03",
            "title": "Ý nghĩa của từ khóa `static` trong `main`",
            "rawTitle": "Ý nghĩa của từ khóa `static` trong `main`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-02-sub-04",
            "title": "Ý nghĩa của kiểu trả về `void`",
            "rawTitle": "Ý nghĩa của kiểu trả về `void`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-02-sub-05",
            "title": "Tham số `String[] args` và cách nhận argument từ command line",
            "rawTitle": "Tham số `String[] args` và cách nhận argument từ command line",
            "tags": []
          },
          {
            "id": "java-day-02-topic-02-sub-06",
            "title": "`System.out.println()` và luồng xuất chuẩn (Standard Output)",
            "rawTitle": "`System.out.println()` và luồng xuất chuẩn (Standard Output)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-02-topic-03",
        "title": "Comments",
        "subtopics": [
          {
            "id": "java-day-02-topic-03-sub-01",
            "title": "Single-line comment (`//`)",
            "rawTitle": "Single-line comment (`//`)",
            "tags": []
          },
          {
            "id": "java-day-02-topic-03-sub-02",
            "title": "Multi-line comment (`/* ... */`)",
            "rawTitle": "Multi-line comment (`/* ... */`)",
            "tags": []
          },
          {
            "id": "java-day-02-topic-03-sub-03",
            "title": "Documentation comment (`/** ... */`)",
            "rawTitle": "Documentation comment (`/** ... */`)",
            "tags": []
          },
          {
            "id": "java-day-02-topic-03-sub-04",
            "title": "Best practices khi viết comment trong mã nguồn thực tế",
            "rawTitle": "Best practices khi viết comment trong mã nguồn thực tế",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-02-topic-04",
        "title": "Variables & Constants",
        "subtopics": [
          {
            "id": "java-day-02-topic-04-sub-01",
            "title": "Khái niệm biến (Variable) và vùng nhớ",
            "rawTitle": "Khái niệm biến (Variable) và vùng nhớ",
            "tags": []
          },
          {
            "id": "java-day-02-topic-04-sub-02",
            "title": "Quy tắc đặt tên định danh (Identifiers) và quy ước `camelCase`",
            "rawTitle": "Quy tắc đặt tên định danh (Identifiers) và quy ước `camelCase`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-04-sub-03",
            "title": "Khai báo biến (Declaration) và Khởi tạo biến (Initialization)",
            "rawTitle": "Khai báo biến (Declaration) và Khởi tạo biến (Initialization)",
            "tags": []
          },
          {
            "id": "java-day-02-topic-04-sub-04",
            "title": "Hằng số với từ khóa `final`",
            "rawTitle": "Hằng số với từ khóa `final`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-04-sub-05",
            "title": "Hằng số lớp với `static final` và quy ước `UPPER_SNAKE_CASE`",
            "rawTitle": "Hằng số lớp với `static final` và quy ước `UPPER_SNAKE_CASE`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-04-sub-06",
            "title": "Local variable type inference với từ khóa `var` (Java 10+)",
            "rawTitle": "Local variable type inference với từ khóa `var` (Java 10+)",
            "tags": []
          },
          {
            "id": "java-day-02-topic-04-sub-07",
            "title": "Quy tắc và giới hạn khi sử dụng `var`",
            "rawTitle": "Quy tắc và giới hạn khi sử dụng `var`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-02-topic-05",
        "title": "Variable Scope & Lifetime",
        "subtopics": [
          {
            "id": "java-day-02-topic-05-sub-01",
            "title": "Block scope (phạm vi trong khối lệnh)",
            "rawTitle": "Block scope (phạm vi trong khối lệnh)",
            "tags": []
          },
          {
            "id": "java-day-02-topic-05-sub-02",
            "title": "Method scope (phạm vi cục bộ trong hàm)",
            "rawTitle": "Method scope (phạm vi cục bộ trong hàm)",
            "tags": []
          },
          {
            "id": "java-day-02-topic-05-sub-03",
            "title": "Shadowing và quy tắc không được trùng tên biến cục bộ lồng nhau",
            "rawTitle": "Shadowing và quy tắc không được trùng tên biến cục bộ lồng nhau",
            "tags": []
          },
          {
            "id": "java-day-02-topic-05-sub-04",
            "title": "Khởi tạo biến cục bộ bắt buộc trước khi sử dụng (Definite Assignment)",
            "rawTitle": "Khởi tạo biến cục bộ bắt buộc trước khi sử dụng (Definite Assignment)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-02-topic-06",
        "title": "Enumeration Basics",
        "subtopics": [
          {
            "id": "java-day-02-topic-06-sub-01",
            "title": "Khái niệm kiểu liệt kê với từ khóa `enum`",
            "rawTitle": "Khái niệm kiểu liệt kê với từ khóa `enum`",
            "tags": []
          },
          {
            "id": "java-day-02-topic-06-sub-02",
            "title": "Khai báo enum đơn giản",
            "rawTitle": "Khai báo enum đơn giản",
            "tags": []
          },
          {
            "id": "java-day-02-topic-06-sub-03",
            "title": "Sử dụng giá trị enum trong biến và so sánh giá trị",
            "rawTitle": "Sử dụng giá trị enum trong biến và so sánh giá trị",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 29
  },
  {
    "id": "java-day-03",
    "track": "java",
    "dayNumber": 3,
    "title": "Data Types & Operators",
    "phaseId": "phase-1",
    "phaseTitle": "Phase 1: Java Fundamentals & Structured Programming",
    "description": "Primitive data types, arithmetic/logical/bitwise operators, type conversion, explicit casting, and Math class.",
    "topics": [
      {
        "id": "java-day-03-topic-01",
        "title": "Primitive Data Types",
        "subtopics": [
          {
            "id": "java-day-03-topic-01-sub-01",
            "title": "Khái niệm kiểu dữ liệu nguyên thủy (Primitive Types) vs Reference Types",
            "rawTitle": "Khái niệm kiểu dữ liệu nguyên thủy (Primitive Types) vs Reference Types",
            "tags": []
          },
          {
            "id": "java-day-03-topic-01-sub-02",
            "title": "Nhóm số nguyên: `byte` (8-bit), `short` (16-bit), `int` (32-bit), `long` (64-bit)",
            "rawTitle": "Nhóm số nguyên: `byte` (8-bit), `short` (16-bit), `int` (32-bit), `long` (64-bit)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-01-sub-03",
            "title": "Literal số nguyên, hậu tố `L`/`l`, tiền tố `0b` (nhị phân), `0x` (thập lục phân), dấu gạch dưới `_`",
            "rawTitle": "Literal số nguyên, hậu tố `L`/`l`, tiền tố `0b` (nhị phân), `0x` (thập lục phân), dấu gạch dưới `_`",
            "tags": []
          },
          {
            "id": "java-day-03-topic-01-sub-04",
            "title": "Nhóm số thực: `float` (32-bit), `double` (64-bit), chuẩn IEEE 754",
            "rawTitle": "Nhóm số thực: `float` (32-bit), `double` (64-bit), chuẩn IEEE 754",
            "tags": []
          },
          {
            "id": "java-day-03-topic-01-sub-05",
            "title": "Literal số thực, hậu tố `F`/`f`, `D`/`d` và vấn đề làm tròn số thực",
            "rawTitle": "Literal số thực, hậu tố `F`/`f`, `D`/`d` và vấn đề làm tròn số thực",
            "tags": []
          },
          {
            "id": "java-day-03-topic-01-sub-06",
            "title": "Các giá trị đặc biệt của số thực: `Double.POSITIVE_INFINITY`, `Double.NEGATIVE_INFINITY`, `Double.NaN`",
            "rawTitle": "Các giá trị đặc biệt của số thực: `Double.POSITIVE_INFINITY`, `Double.NEGATIVE_INFINITY`, `Double.NaN`",
            "tags": []
          },
          {
            "id": "java-day-03-topic-01-sub-07",
            "title": "Kiểu ký tự `char` (16-bit Unicode / UTF-16 code unit) và ký tự escape (`\\n`, `\\t`, `\\\\`, `\\'`)",
            "rawTitle": "Kiểu ký tự `char` (16-bit Unicode / UTF-16 code unit) và ký tự escape (`\\n`, `\\t`, `\\\\`, `\\'`)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-01-sub-08",
            "title": "Kiểu logic `boolean` (`true`/`false`) và việc không thể ép kiểu sang số",
            "rawTitle": "Kiểu logic `boolean` (`true`/`false`) và việc không thể ép kiểu sang số",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-03-topic-02",
        "title": "Operators",
        "subtopics": [
          {
            "id": "java-day-03-topic-02-sub-01",
            "title": "Toán tử số học (`+`, `-`, `*`, `/`, `%`)",
            "rawTitle": "Toán tử số học (`+`, `-`, `*`, `/`, `%`)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-02-sub-02",
            "title": "Phép chia số nguyên (Integer division) và phép chia lấy dư (Modulus)",
            "rawTitle": "Phép chia số nguyên (Integer division) và phép chia lấy dư (Modulus)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-02-sub-03",
            "title": "Toán tử tăng/giảm (`++`, `--`): Prefix vs Postfix",
            "rawTitle": "Toán tử tăng/giảm (`++`, `--`): Prefix vs Postfix",
            "tags": []
          },
          {
            "id": "java-day-03-topic-02-sub-04",
            "title": "Toán tử gán (`=`) và toán tử gán kết hợp (`+=`, `-=`, `*=`, `/=`, `%=`)",
            "rawTitle": "Toán tử gán (`=`) và toán tử gán kết hợp (`+=`, `-=`, `*=`, `/=`, `%=`)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-02-sub-05",
            "title": "Toán tử quan hệ (`==`, `!=`, `<`, `<=`, `>`, `>=`)",
            "rawTitle": "Toán tử quan hệ (`==`, `!=`, `<`, `<=`, `>`, `>=`)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-02-sub-06",
            "title": "Toán tử logic Boolean (`&&`, `||`, `!`)",
            "rawTitle": "Toán tử logic Boolean (`&&`, `||`, `!`)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-02-sub-07",
            "title": "Cơ chế Short-circuit evaluation của `&&` và `||`",
            "rawTitle": "Cơ chế Short-circuit evaluation của `&&` và `||`",
            "tags": []
          },
          {
            "id": "java-day-03-topic-02-sub-08",
            "title": "Toán tử điều kiện ba ngôi (Ternary Operator `? :`)",
            "rawTitle": "Toán tử điều kiện ba ngôi (Ternary Operator `? :`)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-02-sub-09",
            "title": "Toán tử Bitwise (`&`, `|`, `^`, `~`) và Bit Shift (`<<`, `>>`, `>>>`)",
            "rawTitle": "Toán tử Bitwise (`&`, `|`, `^`, `~`) và Bit Shift (`<<`, `>>`, `>>>`)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-02-sub-10",
            "title": "Thứ tự ưu tiên của các toán tử (Operator Precedence) và sử dụng dấu ngoặc `()`",
            "rawTitle": "Thứ tự ưu tiên của các toán tử (Operator Precedence) và sử dụng dấu ngoặc `()`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-03-topic-03",
        "title": "Type Conversion & Casting",
        "subtopics": [
          {
            "id": "java-day-03-topic-03-sub-01",
            "title": "Chuyển đổi kiểu dữ liệu tự động không mất dữ liệu (Widening / Implicit Conversion)",
            "rawTitle": "Chuyển đổi kiểu dữ liệu tự động không mất dữ liệu (Widening / Implicit Conversion)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-03-sub-02",
            "title": "Chuyển đổi kiểu dữ liệu có thể mất độ chính xác (ví dụ `long` sang `float`)",
            "rawTitle": "Chuyển đổi kiểu dữ liệu có thể mất độ chính xác (ví dụ `long` sang `float`)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-03-sub-03",
            "title": "Ép kiểu tường minh (Narrowing / Explicit Casting `(targetType) value`)",
            "rawTitle": "Ép kiểu tường minh (Narrowing / Explicit Casting `(targetType) value`)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-03-sub-04",
            "title": "Hiện tượng tràn số (Integer Overflow / Underflow)",
            "rawTitle": "Hiện tượng tràn số (Integer Overflow / Underflow)",
            "tags": []
          },
          {
            "id": "java-day-03-topic-03-sub-05",
            "title": "Numeric Promotion trong biểu thức số học",
            "rawTitle": "Numeric Promotion trong biểu thức số học",
            "tags": []
          },
          {
            "id": "java-day-03-topic-03-sub-06",
            "title": "Math utility class (`Math.round()`, `Math.floor()`, `Math.ceil()`, `Math.max()`, `Math.min()`)",
            "rawTitle": "Math utility class (`Math.round()`, `Math.floor()`, `Math.ceil()`, `Math.max()`, `Math.min()`)",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 24
  },
  {
    "id": "java-day-04",
    "track": "java",
    "dayNumber": 4,
    "title": "Strings",
    "phaseId": "phase-1",
    "phaseTitle": "Phase 1: Java Fundamentals & Structured Programming",
    "description": "java.lang.String, immutability, String Constant Pool, comparison, StringBuilder, and Text Blocks.",
    "topics": [
      {
        "id": "java-day-04-topic-01",
        "title": "String Fundamentals & Immutability",
        "subtopics": [
          {
            "id": "java-day-04-topic-01-sub-01",
            "title": "Lớp `java.lang.String` trong Java",
            "rawTitle": "Lớp `java.lang.String` trong Java",
            "tags": []
          },
          {
            "id": "java-day-04-topic-01-sub-02",
            "title": "Tính bất biến của String (String Immutability) là gì",
            "rawTitle": "Tính bất biến của String (String Immutability) là gì",
            "tags": []
          },
          {
            "id": "java-day-04-topic-01-sub-03",
            "title": "Tại sao String lại được thiết kế bất biến (Security, Caching, Thread-safety)",
            "rawTitle": "Tại sao String lại được thiết kế bất biến (Security, Caching, Thread-safety)",
            "tags": []
          },
          {
            "id": "java-day-04-topic-01-sub-04",
            "title": "String Constant Pool (String Interning) trong Heap Memory",
            "rawTitle": "String Constant Pool (String Interning) trong Heap Memory",
            "tags": []
          },
          {
            "id": "java-day-04-topic-01-sub-05",
            "title": "Khởi tạo String literal vs `new String()`",
            "rawTitle": "Khởi tạo String literal vs `new String()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-01-sub-06",
            "title": "`String.intern()` method",
            "rawTitle": "`String.intern()` method",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-04-topic-02",
        "title": "String Equality & Comparison",
        "subtopics": [
          {
            "id": "java-day-04-topic-02-sub-01",
            "title": "So sánh tham chiếu (`==`) vs so sánh nội dung (`equals()`)",
            "rawTitle": "So sánh tham chiếu (`==`) vs so sánh nội dung (`equals()`)",
            "tags": []
          },
          {
            "id": "java-day-04-topic-02-sub-02",
            "title": "`equalsIgnoreCase()`",
            "rawTitle": "`equalsIgnoreCase()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-02-sub-03",
            "title": "`compareTo()` và `compareToIgnoreCase()` (Lexicographical ordering)",
            "rawTitle": "`compareTo()` và `compareToIgnoreCase()` (Lexicographical ordering)",
            "tags": []
          },
          {
            "id": "java-day-04-topic-02-sub-04",
            "title": "Kiểm tra chuỗi rỗng: `isEmpty()` vs `isBlank()` (Java 11+)",
            "rawTitle": "Kiểm tra chuỗi rỗng: `isEmpty()` vs `isBlank()` (Java 11+)",
            "tags": []
          },
          {
            "id": "java-day-04-topic-02-sub-05",
            "title": "Chuỗi rỗng (`\"\"`) vs `null` và xử lý `NullPointerException`",
            "rawTitle": "Chuỗi rỗng (`\"\"`) vs `null` và xử lý `NullPointerException`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-04-topic-03",
        "title": "String Manipulation API",
        "subtopics": [
          {
            "id": "java-day-04-topic-03-sub-01",
            "title": "`length()`",
            "rawTitle": "`length()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-03-sub-02",
            "title": "`charAt()`",
            "rawTitle": "`charAt()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-03-sub-03",
            "title": "`substring()`",
            "rawTitle": "`substring()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-03-sub-04",
            "title": "Nối chuỗi với toán tử `+` và cơ chế compiler tối ưu",
            "rawTitle": "Nối chuỗi với toán tử `+` và cơ chế compiler tối ưu",
            "tags": []
          },
          {
            "id": "java-day-04-topic-03-sub-05",
            "title": "`concat()`",
            "rawTitle": "`concat()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-03-sub-06",
            "title": "`String.join()` và `StringTemplate`",
            "rawTitle": "`String.join()` và `StringTemplate` [EXTERNAL]",
            "tags": [
              "EXTERNAL"
            ]
          },
          {
            "id": "java-day-04-topic-03-sub-07",
            "title": "`indexOf()`, `lastIndexOf()`, `contains()`, `startsWith()`, `endsWith()`",
            "rawTitle": "`indexOf()`, `lastIndexOf()`, `contains()`, `startsWith()`, `endsWith()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-03-sub-08",
            "title": "`replace()`, `replaceAll()`, `replaceFirst()`",
            "rawTitle": "`replace()`, `replaceAll()`, `replaceFirst()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-03-sub-09",
            "title": "`toLowerCase()`, `toUpperCase()`, `trim()`, `strip()`, `stripLeading()`, `stripTrailing()`",
            "rawTitle": "`toLowerCase()`, `toUpperCase()`, `trim()`, `strip()`, `stripLeading()`, `stripTrailing()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-03-sub-10",
            "title": "`repeat()`, `lines()`, `indent()` (Java 11+)",
            "rawTitle": "`repeat()`, `lines()`, `indent()` (Java 11+)",
            "tags": []
          },
          {
            "id": "java-day-04-topic-03-sub-11",
            "title": "Code Points và Code Units (xử lý ký tự Unicode mở rộng / Emojis)",
            "rawTitle": "Code Points và Code Units (xử lý ký tự Unicode mở rộng / Emojis)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-04-topic-04",
        "title": "StringBuilder & StringBuffer",
        "subtopics": [
          {
            "id": "java-day-04-topic-04-sub-01",
            "title": "Vấn đề hiệu năng khi nối chuỗi trong vòng lặp với `String`",
            "rawTitle": "Vấn đề hiệu năng khi nối chuỗi trong vòng lặp với `String`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-04-sub-02",
            "title": "`java.lang.StringBuilder` là gì và cơ chế mutable buffer",
            "rawTitle": "`java.lang.StringBuilder` là gì và cơ chế mutable buffer",
            "tags": []
          },
          {
            "id": "java-day-04-topic-04-sub-03",
            "title": "`append()`, `insert()`, `delete()`, `reverse()`, `toString()`",
            "rawTitle": "`append()`, `insert()`, `delete()`, `reverse()`, `toString()`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-04-sub-04",
            "title": "Capacity, Length và cơ chế tự động mở rộng mảng bên trong `StringBuilder`",
            "rawTitle": "Capacity, Length và cơ chế tự động mở rộng mảng bên trong `StringBuilder`",
            "tags": []
          },
          {
            "id": "java-day-04-topic-04-sub-05",
            "title": "`StringBuilder` vs `StringBuffer` (Thread-safety vs Performance)",
            "rawTitle": "`StringBuilder` vs `StringBuffer` (Thread-safety vs Performance)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-04-topic-05",
        "title": "Text Blocks (Java 15+)",
        "subtopics": [
          {
            "id": "java-day-04-topic-05-sub-01",
            "title": "Khái niệm Text Blocks (`\"\"\" ... \"\"\"`)",
            "rawTitle": "Khái niệm Text Blocks (`\"\"\" ... \"\"\"`)",
            "tags": []
          },
          {
            "id": "java-day-04-topic-05-sub-02",
            "title": "Xử lý ký tự xuống dòng và khoảng trắng thụt lề (Indentation stripping)",
            "rawTitle": "Xử lý ký tự xuống dòng và khoảng trắng thụt lề (Indentation stripping)",
            "tags": []
          },
          {
            "id": "java-day-04-topic-05-sub-03",
            "title": "Escape sequences trong Text Blocks (`\\`, `\\s`)",
            "rawTitle": "Escape sequences trong Text Blocks (`\\`, `\\s`)",
            "tags": []
          },
          {
            "id": "java-day-04-topic-05-sub-04",
            "title": "Ứng dụng Text Blocks cho JSON, SQL, HTML templates",
            "rawTitle": "Ứng dụng Text Blocks cho JSON, SQL, HTML templates",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 31
  },
  {
    "id": "java-day-05",
    "track": "java",
    "dayNumber": 5,
    "title": "Input, Output & Control Flow",
    "phaseId": "phase-1",
    "phaseTitle": "Phase 1: Java Fundamentals & Structured Programming",
    "description": "Standard I/O with Scanner/printf, conditional branching (if/else, switch expression), and iteration loops.",
    "topics": [
      {
        "id": "java-day-05-topic-01",
        "title": "Console Input & Output",
        "subtopics": [
          {
            "id": "java-day-05-topic-01-sub-01",
            "title": "`System.out.print()`, `System.out.println()`",
            "rawTitle": "`System.out.print()`, `System.out.println()`",
            "tags": []
          },
          {
            "id": "java-day-05-topic-01-sub-02",
            "title": "Formatted output với `System.out.printf()` và `String.format()`",
            "rawTitle": "Formatted output với `System.out.printf()` và `String.format()`",
            "tags": []
          },
          {
            "id": "java-day-05-topic-01-sub-03",
            "title": "Format specifiers: `%d`, `%f`, `%s`, `%c`, `%b`, `%n`",
            "rawTitle": "Format specifiers: `%d`, `%f`, `%s`, `%c`, `%b`, `%n`",
            "tags": []
          },
          {
            "id": "java-day-05-topic-01-sub-04",
            "title": "Format flags: căn lề, độ rộng trường (width), số chữ số thập phân (precision)",
            "rawTitle": "Format flags: căn lề, độ rộng trường (width), số chữ số thập phân (precision)",
            "tags": []
          },
          {
            "id": "java-day-05-topic-01-sub-05",
            "title": "Đọc dữ liệu từ console với `java.util.Scanner`",
            "rawTitle": "Đọc dữ liệu từ console với `java.util.Scanner`",
            "tags": []
          },
          {
            "id": "java-day-05-topic-01-sub-06",
            "title": "`nextInt()`, `nextDouble()`, `next()`, `nextLine()`",
            "rawTitle": "`nextInt()`, `nextDouble()`, `next()`, `nextLine()`",
            "tags": []
          },
          {
            "id": "java-day-05-topic-01-sub-07",
            "title": "Lỗi trôi lệnh phổ biến khi dùng `nextLine()` sau `nextInt()` và cách khắc phục",
            "rawTitle": "Lỗi trôi lệnh phổ biến khi dùng `nextLine()` sau `nextInt()` và cách khắc phục",
            "tags": []
          },
          {
            "id": "java-day-05-topic-01-sub-08",
            "title": "Đọc mật khẩu an toàn từ console với `System.console().readPassword()`",
            "rawTitle": "Đọc mật khẩu an toàn từ console với `System.console().readPassword()`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-05-topic-02",
        "title": "Conditional Statements",
        "subtopics": [
          {
            "id": "java-day-05-topic-02-sub-01",
            "title": "Cấu trúc `if`, `if-else`, `if-else if-else`",
            "rawTitle": "Cấu trúc `if`, `if-else`, `if-else if-else`",
            "tags": []
          },
          {
            "id": "java-day-05-topic-02-sub-02",
            "title": "Khối lệnh đơn dòng vs khối lệnh có `{}` và quy ước an toàn",
            "rawTitle": "Khối lệnh đơn dòng vs khối lệnh có `{}` và quy ước an toàn",
            "tags": []
          },
          {
            "id": "java-day-05-topic-02-sub-03",
            "title": "Lồng câu lệnh điều kiện (Nested if)",
            "rawTitle": "Lồng câu lệnh điều kiện (Nested if)",
            "tags": []
          },
          {
            "id": "java-day-05-topic-02-sub-04",
            "title": "Biểu thức điều kiện phức hợp và thứ tự đánh giá",
            "rawTitle": "Biểu thức điều kiện phức hợp và thứ tự đánh giá",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-05-topic-03",
        "title": "Switch Statements & Switch Expressions",
        "subtopics": [
          {
            "id": "java-day-05-topic-03-sub-01",
            "title": "`switch` statement truyền thống: `case`, `default`, `break`",
            "rawTitle": "`switch` statement truyền thống: `case`, `default`, `break`",
            "tags": []
          },
          {
            "id": "java-day-05-topic-03-sub-02",
            "title": "Hiện tượng Fall-through khi thiếu `break`",
            "rawTitle": "Hiện tượng Fall-through khi thiếu `break`",
            "tags": []
          },
          {
            "id": "java-day-05-topic-03-sub-03",
            "title": "Các kiểu dữ liệu được hỗ trợ trong `switch` (`byte`, `short`, `char`, `int`, `String`, `enum`)",
            "rawTitle": "Các kiểu dữ liệu được hỗ trợ trong `switch` (`byte`, `short`, `char`, `int`, `String`, `enum`)",
            "tags": []
          },
          {
            "id": "java-day-05-topic-03-sub-04",
            "title": "Switch Expression với cú pháp mũi tên `->` (Java 14+)",
            "rawTitle": "Switch Expression với cú pháp mũi tên `->` (Java 14+)",
            "tags": []
          },
          {
            "id": "java-day-05-topic-03-sub-05",
            "title": "Từ khóa `yield` trong Switch Expression",
            "rawTitle": "Từ khóa `yield` trong Switch Expression",
            "tags": []
          },
          {
            "id": "java-day-05-topic-03-sub-06",
            "title": "Multiple case labels (`case A, B, C ->`)",
            "rawTitle": "Multiple case labels (`case A, B, C ->`)",
            "tags": []
          },
          {
            "id": "java-day-05-topic-03-sub-07",
            "title": "Tính bao quát (Exhaustiveness) trong Switch Expression",
            "rawTitle": "Tính bao quát (Exhaustiveness) trong Switch Expression",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-05-topic-04",
        "title": "Looping Statements",
        "subtopics": [
          {
            "id": "java-day-05-topic-04-sub-01",
            "title": "Vòng lặp `while` (kiểm tra điều kiện trước)",
            "rawTitle": "Vòng lặp `while` (kiểm tra điều kiện trước)",
            "tags": []
          },
          {
            "id": "java-day-05-topic-04-sub-02",
            "title": "Vòng lặp `do-while` (kiểm tra điều kiện sau, thực thi ít nhất một lần)",
            "rawTitle": "Vòng lặp `do-while` (kiểm tra điều kiện sau, thực thi ít nhất một lần)",
            "tags": []
          },
          {
            "id": "java-day-05-topic-04-sub-03",
            "title": "Vòng lặp `for` truyền thống (Initialization; Condition; Update)",
            "rawTitle": "Vòng lặp `for` truyền thống (Initialization; Condition; Update)",
            "tags": []
          },
          {
            "id": "java-day-05-topic-04-sub-04",
            "title": "Vòng lặp vô tận (`for(;;) `, `while(true)`)",
            "rawTitle": "Vòng lặp vô tận (`for(;;) `, `while(true)`)",
            "tags": []
          },
          {
            "id": "java-day-05-topic-04-sub-05",
            "title": "Vòng lặp lồng nhau (Nested loops)",
            "rawTitle": "Vòng lặp lồng nhau (Nested loops)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-05-topic-05",
        "title": "Loop Control Statements",
        "subtopics": [
          {
            "id": "java-day-05-topic-05-sub-01",
            "title": "Lệnh `break` thoát khỏi vòng lặp",
            "rawTitle": "Lệnh `break` thoát khỏi vòng lặp",
            "tags": []
          },
          {
            "id": "java-day-05-topic-05-sub-02",
            "title": "Lệnh `continue` bỏ qua lần lặp hiện tại",
            "rawTitle": "Lệnh `continue` bỏ qua lần lặp hiện tại",
            "tags": []
          },
          {
            "id": "java-day-05-topic-05-sub-03",
            "title": "Labeled `break` và Labeled `continue` cho vòng lặp lồng nhau",
            "rawTitle": "Labeled `break` và Labeled `continue` cho vòng lặp lồng nhau",
            "tags": []
          },
          {
            "id": "java-day-05-topic-05-sub-04",
            "title": "Lỗi logic thường gặp: Vòng lặp vô tận, Off-by-one error",
            "rawTitle": "Lỗi logic thường gặp: Vòng lặp vô tận, Off-by-one error",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 28
  },
  {
    "id": "java-day-06",
    "track": "java",
    "dayNumber": 6,
    "title": "Numbers & Arrays",
    "phaseId": "phase-1",
    "phaseTitle": "Phase 1: Java Fundamentals & Structured Programming",
    "description": "BigInteger, BigDecimal for precise financial math, 1D/2D arrays, jagged arrays, and Arrays utility methods.",
    "topics": [
      {
        "id": "java-day-06-topic-01",
        "title": "Arbitrary-Precision Numbers",
        "subtopics": [
          {
            "id": "java-day-06-topic-01-sub-01",
            "title": "Vấn đề mất độ chính xác khi dùng `double`/`float` cho tính toán tài chính",
            "rawTitle": "Vấn đề mất độ chính xác khi dùng `double`/`float` cho tính toán tài chính",
            "tags": []
          },
          {
            "id": "java-day-06-topic-01-sub-02",
            "title": "Lớp `java.math.BigInteger` cho số nguyên lớn tùy ý",
            "rawTitle": "Lớp `java.math.BigInteger` cho số nguyên lớn tùy ý",
            "tags": []
          },
          {
            "id": "java-day-06-topic-01-sub-03",
            "title": "`BigInteger` API: `add()`, `subtract()`, `multiply()`, `divide()`, `mod()`, `valueOf()`",
            "rawTitle": "`BigInteger` API: `add()`, `subtract()`, `multiply()`, `divide()`, `mod()`, `valueOf()`",
            "tags": []
          },
          {
            "id": "java-day-06-topic-01-sub-04",
            "title": "Lớp `java.math.BigDecimal` cho số thập phân chính xác tuyệt đối",
            "rawTitle": "Lớp `java.math.BigDecimal` cho số thập phân chính xác tuyệt đối",
            "tags": []
          },
          {
            "id": "java-day-06-topic-01-sub-05",
            "title": "`BigDecimal` API: phép toán số học và xử lý phép chia vô hạn",
            "rawTitle": "`BigDecimal` API: phép toán số học và xử lý phép chia vô hạn",
            "tags": []
          },
          {
            "id": "java-day-06-topic-01-sub-06",
            "title": "Thiết lập `RoundingMode` (`HALF_UP`, `HALF_EVEN`, `DOWN`, `CEILING`)",
            "rawTitle": "Thiết lập `RoundingMode` (`HALF_UP`, `HALF_EVEN`, `DOWN`, `CEILING`)",
            "tags": []
          },
          {
            "id": "java-day-06-topic-01-sub-07",
            "title": "Khởi tạo `BigDecimal` đúng cách: `BigDecimal.valueOf(double)` vs `new BigDecimal(String)` vs `new BigDecimal(double)`",
            "rawTitle": "Khởi tạo `BigDecimal` đúng cách: `BigDecimal.valueOf(double)` vs `new BigDecimal(String)` vs `new BigDecimal(double)`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-06-topic-02",
        "title": "Array Fundamentals",
        "subtopics": [
          {
            "id": "java-day-06-topic-02-sub-01",
            "title": "Khái niệm mảng (Array) trong Java và tính cố định kích thước",
            "rawTitle": "Khái niệm mảng (Array) trong Java và tính cố định kích thước",
            "tags": []
          },
          {
            "id": "java-day-06-topic-02-sub-02",
            "title": "Cú pháp khai báo mảng: `type[] name` vs `type name[]`",
            "rawTitle": "Cú pháp khai báo mảng: `type[] name` vs `type name[]`",
            "tags": []
          },
          {
            "id": "java-day-06-topic-02-sub-03",
            "title": "Cấp phát bộ nhớ mảng với từ khóa `new`",
            "rawTitle": "Cấp phát bộ nhớ mảng với từ khóa `new`",
            "tags": []
          },
          {
            "id": "java-day-06-topic-02-sub-04",
            "title": "Giá trị khởi tạo mặc định của các phần tử mảng trong heap",
            "rawTitle": "Giá trị khởi tạo mặc định của các phần tử mảng trong heap",
            "tags": []
          },
          {
            "id": "java-day-06-topic-02-sub-05",
            "title": "Khởi tạo mảng trực tiếp (Array Initializer / Anonymous Array)",
            "rawTitle": "Khởi tạo mảng trực tiếp (Array Initializer / Anonymous Array)",
            "tags": []
          },
          {
            "id": "java-day-06-topic-02-sub-06",
            "title": "Truy cập phần tử qua Index (0-based indexing)",
            "rawTitle": "Truy cập phần tử qua Index (0-based indexing)",
            "tags": []
          },
          {
            "id": "java-day-06-topic-02-sub-07",
            "title": "Thuộc tính `length` của mảng",
            "rawTitle": "Thuộc tính `length` của mảng",
            "tags": []
          },
          {
            "id": "java-day-06-topic-02-sub-08",
            "title": "Ngoại lệ `ArrayIndexOutOfBoundsException`",
            "rawTitle": "Ngoại lệ `ArrayIndexOutOfBoundsException`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-06-topic-03",
        "title": "Array Iteration & Manipulation",
        "subtopics": [
          {
            "id": "java-day-06-topic-03-sub-01",
            "title": "Duyệt mảng bằng vòng lặp `for` truyền thống",
            "rawTitle": "Duyệt mảng bằng vòng lặp `for` truyền thống",
            "tags": []
          },
          {
            "id": "java-day-06-topic-03-sub-02",
            "title": "Duyệt mảng bằng Enhanced `for` loop (for-each)",
            "rawTitle": "Duyệt mảng bằng Enhanced `for` loop (for-each)",
            "tags": []
          },
          {
            "id": "java-day-06-topic-03-sub-03",
            "title": "Giới hạn của Enhanced `for` loop (không truy cập được index, không sửa được mảng primitive)",
            "rawTitle": "Giới hạn của Enhanced `for` loop (không truy cập được index, không sửa được mảng primitive)",
            "tags": []
          },
          {
            "id": "java-day-06-topic-03-sub-04",
            "title": "Sao chép mảng: Gán tham chiếu vs `System.arraycopy()` vs `Arrays.copyOf()` vs `clone()`",
            "rawTitle": "Sao chép mảng: Gán tham chiếu vs `System.arraycopy()` vs `Arrays.copyOf()` vs `clone()`",
            "tags": []
          },
          {
            "id": "java-day-06-topic-03-sub-05",
            "title": "Shallow copy vs Deep copy trên mảng đối tượng",
            "rawTitle": "Shallow copy vs Deep copy trên mảng đối tượng",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-06-topic-04",
        "title": "java.util.Arrays Utility Class",
        "subtopics": [
          {
            "id": "java-day-06-topic-04-sub-01",
            "title": "`Arrays.toString()` và `Arrays.deepToString()`",
            "rawTitle": "`Arrays.toString()` và `Arrays.deepToString()`",
            "tags": []
          },
          {
            "id": "java-day-06-topic-04-sub-02",
            "title": "`Arrays.sort()` (Dual-Pivot Quicksort cho primitive, TimSort cho Object)",
            "rawTitle": "`Arrays.sort()` (Dual-Pivot Quicksort cho primitive, TimSort cho Object)",
            "tags": []
          },
          {
            "id": "java-day-06-topic-04-sub-03",
            "title": "`Arrays.binarySearch()` và điều kiện mảng phải được sắp xếp trước",
            "rawTitle": "`Arrays.binarySearch()` và điều kiện mảng phải được sắp xếp trước",
            "tags": []
          },
          {
            "id": "java-day-06-topic-04-sub-04",
            "title": "`Arrays.equals()` và `Arrays.deepEquals()`",
            "rawTitle": "`Arrays.equals()` và `Arrays.deepEquals()`",
            "tags": []
          },
          {
            "id": "java-day-06-topic-04-sub-05",
            "title": "`Arrays.fill()`",
            "rawTitle": "`Arrays.fill()`",
            "tags": []
          },
          {
            "id": "java-day-06-topic-04-sub-06",
            "title": "`Arrays.mismatch()` (Java 9+)",
            "rawTitle": "`Arrays.mismatch()` (Java 9+)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-06-topic-05",
        "title": "Multidimensional & Ragged Arrays",
        "subtopics": [
          {
            "id": "java-day-06-topic-05-sub-01",
            "title": "Khái niệm mảng hai chiều (Array of Arrays)",
            "rawTitle": "Khái niệm mảng hai chiều (Array of Arrays)",
            "tags": []
          },
          {
            "id": "java-day-06-topic-05-sub-02",
            "title": "Khai báo, cấp phát và khởi tạo mảng hai chiều",
            "rawTitle": "Khai báo, cấp phát và khởi tạo mảng hai chiều",
            "tags": []
          },
          {
            "id": "java-day-06-topic-05-sub-03",
            "title": "Duyệt mảng hai chiều với nested loops",
            "rawTitle": "Duyệt mảng hai chiều với nested loops",
            "tags": []
          },
          {
            "id": "java-day-06-topic-05-sub-04",
            "title": "Mảng răng cưa (Ragged Arrays / Jagged Arrays)",
            "rawTitle": "Mảng răng cưa (Ragged Arrays / Jagged Arrays)",
            "tags": []
          },
          {
            "id": "java-day-06-topic-05-sub-05",
            "title": "Command-line arguments: Cách JVM truyền tham số vào `String[] args`",
            "rawTitle": "Command-line arguments: Cách JVM truyền tham số vào `String[] args`",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 31
  },
  {
    "id": "java-day-07",
    "track": "java",
    "dayNumber": 7,
    "title": "Foundation Project & Phase 1 Review",
    "phaseId": "phase-1",
    "phaseTitle": "Phase 1: Java Fundamentals & Structured Programming",
    "description": "Phase 1 Consolidation: Build a Console Student Management System and review Java fundamentals.",
    "topics": [
      {
        "id": "java-day-07-topic-01",
        "title": "Console Architecture & Application Design",
        "subtopics": [
          {
            "id": "java-day-07-topic-01-sub-01",
            "title": "Phân tách logic: Input parsing, Data storage, Business rules, Display output",
            "rawTitle": "Phân tách logic: Input parsing, Data storage, Business rules, Display output",
            "tags": []
          },
          {
            "id": "java-day-07-topic-01-sub-02",
            "title": "Xây dựng menu tương tác dạng console với `Scanner` và vòng lặp `while(true)`",
            "rawTitle": "Xây dựng menu tương tác dạng console với `Scanner` và vòng lặp `while(true)`",
            "tags": []
          },
          {
            "id": "java-day-07-topic-01-sub-03",
            "title": "Xử lý dữ liệu nhập sai định dạng (Input validation)",
            "rawTitle": "Xử lý dữ liệu nhập sai định dạng (Input validation)",
            "tags": []
          },
          {
            "id": "java-day-07-topic-01-sub-04",
            "title": "Quản lý danh sách đối tượng bằng mảng tĩnh kết hợp biến đếm `size`",
            "rawTitle": "Quản lý danh sách đối tượng bằng mảng tĩnh kết hợp biến đếm `size`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-07-topic-02",
        "title": "Project: Student Management System (Console-based)",
        "subtopics": [
          {
            "id": "java-day-07-topic-02-sub-01",
            "title": "Thiết kế cấu trúc dữ liệu lưu thông tin sinh viên (ID, Tên, Điểm, Xếp loại)",
            "rawTitle": "Thiết kế cấu trúc dữ liệu lưu thông tin sinh viên (ID, Tên, Điểm, Xếp loại)",
            "tags": []
          },
          {
            "id": "java-day-07-topic-02-sub-02",
            "title": "Chức năng thêm mới sinh viên (có kiểm tra trùng ID, mảng đầy)",
            "rawTitle": "Chức năng thêm mới sinh viên (có kiểm tra trùng ID, mảng đầy)",
            "tags": []
          },
          {
            "id": "java-day-07-topic-02-sub-03",
            "title": "Chức năng hiển thị danh sách sinh viên dưới dạng bảng định dạng bằng `printf`",
            "rawTitle": "Chức năng hiển thị danh sách sinh viên dưới dạng bảng định dạng bằng `printf`",
            "tags": []
          },
          {
            "id": "java-day-07-topic-02-sub-04",
            "title": "Chức năng tìm kiếm sinh viên theo tên hoặc ID",
            "rawTitle": "Chức năng tìm kiếm sinh viên theo tên hoặc ID",
            "tags": []
          },
          {
            "id": "java-day-07-topic-02-sub-05",
            "title": "Chức năng cập nhật thông tin và xóa sinh viên (dồn mảng)",
            "rawTitle": "Chức năng cập nhật thông tin và xóa sinh viên (dồn mảng)",
            "tags": []
          },
          {
            "id": "java-day-07-topic-02-sub-06",
            "title": "Chức năng sắp xếp sinh viên theo điểm số giảm dần / tăng dần",
            "rawTitle": "Chức năng sắp xếp sinh viên theo điểm số giảm dần / tăng dần",
            "tags": []
          },
          {
            "id": "java-day-07-topic-02-sub-07",
            "title": "Chức năng thống kê: Điểm trung bình, điểm cao nhất, điểm thấp nhất, số lượng từng loại",
            "rawTitle": "Chức năng thống kê: Điểm trung bình, điểm cao nhất, điểm thấp nhất, số lượng từng loại",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-07-topic-03",
        "title": "Phase 1 Review & Pitfall Consolidation",
        "subtopics": [
          {
            "id": "java-day-07-topic-03-sub-01",
            "title": "Ôn tập Memory Model cơ bản: Stack Memory vs Heap Memory cho primitive và reference",
            "rawTitle": "Ôn tập Memory Model cơ bản: Stack Memory vs Heap Memory cho primitive và reference",
            "tags": []
          },
          {
            "id": "java-day-07-topic-03-sub-02",
            "title": "So sánh `==` vs `.equals()` trên Primitive, String và Array",
            "rawTitle": "So sánh `==` vs `.equals()` trên Primitive, String và Array",
            "tags": []
          },
          {
            "id": "java-day-07-topic-03-sub-03",
            "title": "Phân biệt Pass-by-value đối với biến nguyên thủy vs biến tham chiếu mảng",
            "rawTitle": "Phân biệt Pass-by-value đối với biến nguyên thủy vs biến tham chiếu mảng",
            "tags": []
          },
          {
            "id": "java-day-07-topic-03-sub-04",
            "title": "Nhận diện và phòng tránh các lỗi runtime: `NullPointerException`, `ArrayIndexOutOfBoundsException`",
            "rawTitle": "Nhận diện và phòng tránh các lỗi runtime: `NullPointerException`, `ArrayIndexOutOfBoundsException`",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 15
  },
  {
    "id": "java-day-08",
    "track": "java",
    "dayNumber": 8,
    "title": "Classes & Objects",
    "phaseId": "phase-2",
    "phaseTitle": "Phase 2: Object-Oriented Programming (OOP) Fundamentals",
    "description": "OOP foundation: Class vs Object, instance variables, heap memory references, LocalDate, and accessors/mutators.",
    "topics": [
      {
        "id": "java-day-08-topic-01",
        "title": "Object-Oriented Programming Fundamentals",
        "subtopics": [
          {
            "id": "java-day-08-topic-01-sub-01",
            "title": "Lập trình thủ tục (Procedural Programming) vs Lập trình hướng đối tượng (OOP)",
            "rawTitle": "Lập trình thủ tục (Procedural Programming) vs Lập trình hướng đối tượng (OOP)",
            "tags": []
          },
          {
            "id": "java-day-08-topic-01-sub-02",
            "title": "Khái niệm Lớp (Class) — Bản thiết kế / Khuôn mẫu",
            "rawTitle": "Khái niệm Lớp (Class) — Bản thiết kế / Khuôn mẫu",
            "tags": []
          },
          {
            "id": "java-day-08-topic-01-sub-03",
            "title": "Khái niệm Đối tượng (Object) — Thể hiện cụ thể (Instance)",
            "rawTitle": "Khái niệm Đối tượng (Object) — Thể hiện cụ thể (Instance)",
            "tags": []
          },
          {
            "id": "java-day-08-topic-01-sub-04",
            "title": "Trạng thái (State / Fields), Hành vi (Behavior / Methods) và Danh tính (Identity) của đối tượng",
            "rawTitle": "Trạng thái (State / Fields), Hành vi (Behavior / Methods) và Danh tính (Identity) của đối tượng",
            "tags": []
          },
          {
            "id": "java-day-08-topic-01-sub-05",
            "title": "4 tính chất cốt lõi của OOP: Encapsulation, Inheritance, Polymorphism, Abstraction",
            "rawTitle": "4 tính chất cốt lõi của OOP: Encapsulation, Inheritance, Polymorphism, Abstraction",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-08-topic-02",
        "title": "Object Creation & Memory Lifecycle",
        "subtopics": [
          {
            "id": "java-day-08-topic-02-sub-01",
            "title": "Quá trình tạo đối tượng với toán tử `new`",
            "rawTitle": "Quá trình tạo đối tượng với toán tử `new`",
            "tags": []
          },
          {
            "id": "java-day-08-topic-02-sub-02",
            "title": "Bộ nhớ Stack (lưu biến tham chiếu) vs Bộ nhớ Heap (lưu instance thực tế)",
            "rawTitle": "Bộ nhớ Stack (lưu biến tham chiếu) vs Bộ nhớ Heap (lưu instance thực tế)",
            "tags": []
          },
          {
            "id": "java-day-08-topic-02-sub-03",
            "title": "Biến tham chiếu đối tượng (Object Reference) vs Đối tượng thực tế",
            "rawTitle": "Biến tham chiếu đối tượng (Object Reference) vs Đối tượng thực tế",
            "tags": []
          },
          {
            "id": "java-day-08-topic-02-sub-04",
            "title": "Gán tham chiếu: Hai biến trỏ cùng một vùng nhớ trong Heap",
            "rawTitle": "Gán tham chiếu: Hai biến trỏ cùng một vùng nhớ trong Heap",
            "tags": []
          },
          {
            "id": "java-day-08-topic-02-sub-05",
            "title": "Giá trị `null` của biến tham chiếu",
            "rawTitle": "Giá trị `null` của biến tham chiếu",
            "tags": []
          },
          {
            "id": "java-day-08-topic-02-sub-06",
            "title": "Đối tượng không còn tham chiếu (Unreachable Object) và vai trò của Garbage Collector",
            "rawTitle": "Đối tượng không còn tham chiếu (Unreachable Object) và vai trò của Garbage Collector",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-08-topic-03",
        "title": "Working with Predefined Classes",
        "subtopics": [
          {
            "id": "java-day-08-topic-03-sub-01",
            "title": "Sử dụng các lớp có sẵn trong Java API (`java.lang`, `java.util`, `java.time`)",
            "rawTitle": "Sử dụng các lớp có sẵn trong Java API (`java.lang`, `java.util`, `java.time`)",
            "tags": []
          },
          {
            "id": "java-day-08-topic-03-sub-02",
            "title": "Lớp `java.time.LocalDate`, `LocalTime`, `LocalDateTime` (Java 8+ Date-Time API)",
            "rawTitle": "Lớp `java.time.LocalDate`, `LocalTime`, `LocalDateTime` (Java 8+ Date-Time API)",
            "tags": []
          },
          {
            "id": "java-day-08-topic-03-sub-03",
            "title": "Factory methods tạo ngày tháng: `LocalDate.now()`, `LocalDate.of()`, `LocalDate.parse()`",
            "rawTitle": "Factory methods tạo ngày tháng: `LocalDate.now()`, `LocalDate.of()`, `LocalDate.parse()`",
            "tags": []
          },
          {
            "id": "java-day-08-topic-03-sub-04",
            "title": "Phương thức truy xuất (Accessor Methods) vs Phương thức biến đổi (Mutator Methods)",
            "rawTitle": "Phương thức truy xuất (Accessor Methods) vs Phương thức biến đổi (Mutator Methods)",
            "tags": []
          },
          {
            "id": "java-day-08-topic-03-sub-05",
            "title": "Tính bất biến của `LocalDate` (`plusDays()`, `minusMonths()` trả về instance mới)",
            "rawTitle": "Tính bất biến của `LocalDate` (`plusDays()`, `minusMonths()` trả về instance mới)",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 16
  },
  {
    "id": "java-day-09",
    "track": "java",
    "dayNumber": 9,
    "title": "Designing Your Own Classes",
    "phaseId": "phase-2",
    "phaseTitle": "Phase 2: Object-Oriented Programming (OOP) Fundamentals",
    "description": "Designing classes: Encapsulation, private fields, constructors, this keyword, and defensive copying.",
    "topics": [
      {
        "id": "java-day-09-topic-01",
        "title": "Class Anatomy & Member Fields",
        "subtopics": [
          {
            "id": "java-day-09-topic-01-sub-01",
            "title": "Cấu trúc một class hoàn chỉnh: package, imports, class header, fields, constructors, methods",
            "rawTitle": "Cấu trúc một class hoàn chỉnh: package, imports, class header, fields, constructors, methods",
            "tags": []
          },
          {
            "id": "java-day-09-topic-01-sub-02",
            "title": "Instance Fields (Biến thực thể): Khai báo và kiểu dữ liệu",
            "rawTitle": "Instance Fields (Biến thực thể): Khai báo và kiểu dữ liệu",
            "tags": []
          },
          {
            "id": "java-day-09-topic-01-sub-03",
            "title": "Giá trị mặc định của instance fields khi chưa khởi tạo (`0`, `0.0`, `false`, `null`)",
            "rawTitle": "Giá trị mặc định của instance fields khi chưa khởi tạo (`0`, `0.0`, `false`, `null`)",
            "tags": []
          },
          {
            "id": "java-day-09-topic-01-sub-04",
            "title": "Hằng số thực thể với `final instance fields` và bắt buộc khởi tạo",
            "rawTitle": "Hằng số thực thể với `final instance fields` và bắt buộc khởi tạo",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-09-topic-02",
        "title": "Methods & Access Control",
        "subtopics": [
          {
            "id": "java-day-09-topic-02-sub-01",
            "title": "Định nghĩa Method: Access modifier, Return type, Method name, Parameter list, Method body",
            "rawTitle": "Định nghĩa Method: Access modifier, Return type, Method name, Parameter list, Method body",
            "tags": []
          },
          {
            "id": "java-day-09-topic-02-sub-02",
            "title": "Phương thức trả về giá trị (`return value`) vs phương thức không trả về (`void`)",
            "rawTitle": "Phương thức trả về giá trị (`return value`) vs phương thức không trả về (`void`)",
            "tags": []
          },
          {
            "id": "java-day-09-topic-02-sub-03",
            "title": "Từ khóa `this`: Tham chiếu đến đối tượng hiện tại",
            "rawTitle": "Từ khóa `this`: Tham chiếu đến đối tượng hiện tại",
            "tags": []
          },
          {
            "id": "java-day-09-topic-02-sub-04",
            "title": "Phân biệt instance field và method parameter khi bị trùng tên bằng `this.field = field`",
            "rawTitle": "Phân biệt instance field và method parameter khi bị trùng tên bằng `this.field = field`",
            "tags": []
          },
          {
            "id": "java-day-09-topic-02-sub-05",
            "title": "Tính đóng gói (Encapsulation): Tại sao fields nên đặt là `private`",
            "rawTitle": "Tính đóng gói (Encapsulation): Tại sao fields nên đặt là `private`",
            "tags": []
          },
          {
            "id": "java-day-09-topic-02-sub-06",
            "title": "Getter methods (Accessors) và Setter methods (Mutators)",
            "rawTitle": "Getter methods (Accessors) và Setter methods (Mutators)",
            "tags": []
          },
          {
            "id": "java-day-09-topic-02-sub-07",
            "title": "Bảo vệ tính toàn vẹn của dữ liệu qua Validation trong Setter",
            "rawTitle": "Bảo vệ tính toàn vẹn của dữ liệu qua Validation trong Setter",
            "tags": []
          },
          {
            "id": "java-day-09-topic-02-sub-08",
            "title": "Nguy cơ rò rỉ trạng thái bất biến (Mutable state leakage) khi getter trả về mutable object reference và cách clone phòng vệ",
            "rawTitle": "Nguy cơ rò rỉ trạng thái bất biến (Mutable state leakage) khi getter trả về mutable object reference và cách clone phòng vệ",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-09-topic-03",
        "title": "Constructors",
        "subtopics": [
          {
            "id": "java-day-09-topic-03-sub-01",
            "title": "Khái niệm Constructor và vai trò khởi tạo trạng thái ban đầu của đối tượng",
            "rawTitle": "Khái niệm Constructor và vai trò khởi tạo trạng thái ban đầu của đối tượng",
            "tags": []
          },
          {
            "id": "java-day-09-topic-03-sub-02",
            "title": "Cú pháp Constructor: Tên trùng tên class, không có kiểu trả về",
            "rawTitle": "Cú pháp Constructor: Tên trùng tên class, không có kiểu trả về",
            "tags": []
          },
          {
            "id": "java-day-09-topic-03-sub-03",
            "title": "Default Constructor (Constructor mặc định không tham số do compiler tự sinh)",
            "rawTitle": "Default Constructor (Constructor mặc định không tham số do compiler tự sinh)",
            "tags": []
          },
          {
            "id": "java-day-09-topic-03-sub-04",
            "title": "Hiện tượng mất default constructor khi tự định nghĩa constructor có tham số",
            "rawTitle": "Hiện tượng mất default constructor khi tự định nghĩa constructor có tham số",
            "tags": []
          },
          {
            "id": "java-day-09-topic-03-sub-05",
            "title": "Constructor có tham số (Parameterized Constructors)",
            "rawTitle": "Constructor có tham số (Parameterized Constructors)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-09-topic-04",
        "title": "Multiple Source Files & Compilation",
        "subtopics": [
          {
            "id": "java-day-09-topic-04-sub-01",
            "title": "Tổ chức nhiều class trong cùng một file (quy tắc chỉ có tối đa một `public class`)",
            "rawTitle": "Tổ chức nhiều class trong cùng một file (quy tắc chỉ có tối đa một `public class`)",
            "tags": []
          },
          {
            "id": "java-day-09-topic-04-sub-02",
            "title": "Tổ chức mỗi class trong một file `.java` riêng biệt",
            "rawTitle": "Tổ chức mỗi class trong một file `.java` riêng biệt",
            "tags": []
          },
          {
            "id": "java-day-09-topic-04-sub-03",
            "title": "Quá trình `javac` tự động tìm và biên dịch các source file liên quan",
            "rawTitle": "Quá trình `javac` tự động tìm và biên dịch các source file liên quan",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 20
  },
  {
    "id": "java-day-10",
    "track": "java",
    "dayNumber": 10,
    "title": "Static, Parameters & Object Construction",
    "phaseId": "phase-2",
    "phaseTitle": "Phase 2: Object-Oriented Programming (OOP) Fundamentals",
    "description": "Static members, Java pass-by-value mechanics, constructor overloading, chaining, and initialization blocks.",
    "topics": [
      {
        "id": "java-day-10-topic-01",
        "title": "static Fields & Methods",
        "subtopics": [
          {
            "id": "java-day-10-topic-01-sub-01",
            "title": "Biến static (Class Variables): Thuộc về lớp, chia sẻ chung giữa mọi instance",
            "rawTitle": "Biến static (Class Variables): Thuộc về lớp, chia sẻ chung giữa mọi instance",
            "tags": []
          },
          {
            "id": "java-day-10-topic-01-sub-02",
            "title": "Vùng nhớ của biến static (Metaspace / Class Area)",
            "rawTitle": "Vùng nhớ của biến static (Metaspace / Class Area)",
            "tags": []
          },
          {
            "id": "java-day-10-topic-01-sub-03",
            "title": "Hằng số static: `public static final`",
            "rawTitle": "Hằng số static: `public static final`",
            "tags": []
          },
          {
            "id": "java-day-10-topic-01-sub-04",
            "title": "Phương thức static (Class Methods): Gọi trực tiếp qua tên lớp không cần tạo instance",
            "rawTitle": "Phương thức static (Class Methods): Gọi trực tiếp qua tên lớp không cần tạo instance",
            "tags": []
          },
          {
            "id": "java-day-10-topic-01-sub-05",
            "title": "Giới hạn của static method: Không thể truy cập trực tiếp `this` hoặc instance fields/methods",
            "rawTitle": "Giới hạn của static method: Không thể truy cập trực tiếp `this` hoặc instance fields/methods",
            "tags": []
          },
          {
            "id": "java-day-10-topic-01-sub-06",
            "title": "Factory Methods dạng static (Static Factory Methods): Ưu điểm so với constructor",
            "rawTitle": "Factory Methods dạng static (Static Factory Methods): Ưu điểm so với constructor",
            "tags": []
          },
          {
            "id": "java-day-10-topic-01-sub-07",
            "title": "Khi nào nên thiết kế phương thức static (Utility classes, pure functions)",
            "rawTitle": "Khi nào nên thiết kế phương thức static (Utility classes, pure functions)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-10-topic-02",
        "title": "Parameter Passing Mechanism",
        "subtopics": [
          {
            "id": "java-day-10-topic-02-sub-01",
            "title": "Cơ chế truyền tham số trong Java: **Luôn luôn là Pass-by-Value**",
            "rawTitle": "Cơ chế truyền tham số trong Java: **Luôn luôn là Pass-by-Value**",
            "tags": []
          },
          {
            "id": "java-day-10-topic-02-sub-02",
            "title": "Pass-by-value với kiểu dữ liệu nguyên thủy (Primitive Types): Bản sao giá trị",
            "rawTitle": "Pass-by-value với kiểu dữ liệu nguyên thủy (Primitive Types): Bản sao giá trị",
            "tags": []
          },
          {
            "id": "java-day-10-topic-02-sub-03",
            "title": "Pass-by-value với kiểu dữ liệu tham chiếu (Reference Types): Bản sao của địa chỉ tham chiếu",
            "rawTitle": "Pass-by-value với kiểu dữ liệu tham chiếu (Reference Types): Bản sao của địa chỉ tham chiếu",
            "tags": []
          },
          {
            "id": "java-day-10-topic-02-sub-04",
            "title": "Tại sao Java không thể hoán đổi (swap) hai đối tượng qua method parameter",
            "rawTitle": "Tại sao Java không thể hoán đổi (swap) hai đối tượng qua method parameter",
            "tags": []
          },
          {
            "id": "java-day-10-topic-02-sub-05",
            "title": "Thay đổi trạng thái nội bộ của đối tượng được truyền vào method",
            "rawTitle": "Thay đổi trạng thái nội bộ của đối tượng được truyền vào method",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-10-topic-03",
        "title": "Advanced Object Construction",
        "subtopics": [
          {
            "id": "java-day-10-topic-03-sub-01",
            "title": "Constructor Overloading (Nạp chồng constructor với danh sách tham số khác nhau)",
            "rawTitle": "Constructor Overloading (Nạp chồng constructor với danh sách tham số khác nhau)",
            "tags": []
          },
          {
            "id": "java-day-10-topic-03-sub-02",
            "title": "Constructor Chaining: Gọi constructor khác trong cùng class bằng `this(...)`",
            "rawTitle": "Constructor Chaining: Gọi constructor khác trong cùng class bằng `this(...)`",
            "tags": []
          },
          {
            "id": "java-day-10-topic-03-sub-03",
            "title": "Quy tắc `this(...)` phải là câu lệnh đầu tiên trong constructor body",
            "rawTitle": "Quy tắc `this(...)` phải là câu lệnh đầu tiên trong constructor body",
            "tags": []
          },
          {
            "id": "java-day-10-topic-03-sub-04",
            "title": "Khởi tạo giá trị trực tiếp tại nơi khai báo field",
            "rawTitle": "Khởi tạo giá trị trực tiếp tại nơi khai báo field",
            "tags": []
          },
          {
            "id": "java-day-10-topic-03-sub-05",
            "title": "Instance Initialization Blocks: Cú pháp `{ ... }` và thời điểm thực thi",
            "rawTitle": "Instance Initialization Blocks: Cú pháp `{ ... }` và thời điểm thực thi",
            "tags": []
          },
          {
            "id": "java-day-10-topic-03-sub-06",
            "title": "Static Initialization Blocks: Cú pháp `static { ... }` và thời điểm thực thi khi class load",
            "rawTitle": "Static Initialization Blocks: Cú pháp `static { ... }` và thời điểm thực thi khi class load",
            "tags": []
          },
          {
            "id": "java-day-10-topic-03-sub-07",
            "title": "Thứ tự khởi tạo đầy đủ của một đối tượng trong Java (Static blocks -> Instance blocks -> Constructor)",
            "rawTitle": "Thứ tự khởi tạo đầy đủ của một đối tượng trong Java (Static blocks -> Instance blocks -> Constructor)",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 19
  },
  {
    "id": "java-day-11",
    "track": "java",
    "dayNumber": 11,
    "title": "Records, Packages & JAR",
    "phaseId": "phase-2",
    "phaseTitle": "Phase 2: Object-Oriented Programming (OOP) Fundamentals",
    "description": "Modern Java Records, compact constructors, package namespaces, imports, Classpath, and executable JARs.",
    "topics": [
      {
        "id": "java-day-11-topic-01",
        "title": "Records (Java 14+ / Java 16 LTS)",
        "subtopics": [
          {
            "id": "java-day-11-topic-01-sub-01",
            "title": "Động lực ra đời của Records (Data Carrier Classes, giảm boilerplate code)",
            "rawTitle": "Động lực ra đời của Records (Data Carrier Classes, giảm boilerplate code)",
            "tags": []
          },
          {
            "id": "java-day-11-topic-01-sub-02",
            "title": "Cú pháp khai báo `record RecordName(fields...)`",
            "rawTitle": "Cú pháp khai báo `record RecordName(fields...)`",
            "tags": []
          },
          {
            "id": "java-day-11-topic-01-sub-03",
            "title": "Các thành phần compiler tự động sinh: `private final fields`, constructor, getters (`field()`), `equals()`, `hashCode()`, `toString()`",
            "rawTitle": "Các thành phần compiler tự động sinh: `private final fields`, constructor, getters (`field()`), `equals()`, `hashCode()`, `toString()`",
            "tags": []
          },
          {
            "id": "java-day-11-topic-01-sub-04",
            "title": "Tính chất bất biến ngầm định (Immutability) của Record",
            "rawTitle": "Tính chất bất biến ngầm định (Immutability) của Record",
            "tags": []
          },
          {
            "id": "java-day-11-topic-01-sub-05",
            "title": "Canonical Constructor vs Custom Constructor",
            "rawTitle": "Canonical Constructor vs Custom Constructor",
            "tags": []
          },
          {
            "id": "java-day-11-topic-01-sub-06",
            "title": "Compact Constructor trong Record: Cú pháp và ứng dụng cho data validation",
            "rawTitle": "Compact Constructor trong Record: Cú pháp và ứng dụng cho data validation",
            "tags": []
          },
          {
            "id": "java-day-11-topic-01-sub-07",
            "title": "Quy tắc: Record không thể kế thừa class khác nhưng có thể implement interface",
            "rawTitle": "Quy tắc: Record không thể kế thừa class khác nhưng có thể implement interface",
            "tags": []
          },
          {
            "id": "java-day-11-topic-01-sub-08",
            "title": "Sử dụng Record cho Data Transfer Objects (DTOs) trong Java Backend",
            "rawTitle": "Sử dụng Record cho Data Transfer Objects (DTOs) trong Java Backend",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-11-topic-02",
        "title": "Packages & Namespaces",
        "subtopics": [
          {
            "id": "java-day-11-topic-02-sub-01",
            "title": "Khái niệm Package và giải quyết xung đột tên class",
            "rawTitle": "Khái niệm Package và giải quyết xung đột tên class",
            "tags": []
          },
          {
            "id": "java-day-11-topic-02-sub-02",
            "title": "Cú pháp khai báo package: `package com.example.project;`",
            "rawTitle": "Cú pháp khai báo package: `package com.example.project;`",
            "tags": []
          },
          {
            "id": "java-day-11-topic-02-sub-03",
            "title": "Mối quan hệ giữa tên package và cấu trúc thư mục trên đĩa",
            "rawTitle": "Mối quan hệ giữa tên package và cấu trúc thư mục trên đĩa",
            "tags": []
          },
          {
            "id": "java-day-11-topic-02-sub-04",
            "title": "Từ khóa `import` và import toàn bộ package (`import com.example.*`)",
            "rawTitle": "Từ khóa `import` và import toàn bộ package (`import com.example.*`)",
            "tags": []
          },
          {
            "id": "java-day-11-topic-02-sub-05",
            "title": "Xử lý trùng tên class từ hai package khác nhau bằng Fully Qualified Name",
            "rawTitle": "Xử lý trùng tên class từ hai package khác nhau bằng Fully Qualified Name",
            "tags": []
          },
          {
            "id": "java-day-11-topic-02-sub-06",
            "title": "Static Imports: `import static` và rủi ro làm giảm tính rõ ràng của code",
            "rawTitle": "Static Imports: `import static` và rủi ro làm giảm tính rõ ràng của code",
            "tags": []
          },
          {
            "id": "java-day-11-topic-02-sub-07",
            "title": "Package-private (Default access modifier): Phạm vi truy cập trong cùng package",
            "rawTitle": "Package-private (Default access modifier): Phạm vi truy cập trong cùng package",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-11-topic-03",
        "title": "Classpath & JAR Packaging",
        "subtopics": [
          {
            "id": "java-day-11-topic-03-sub-01",
            "title": "Khái niệm Classpath (`-classpath` / `-cp`) và cách JVM tìm kiếm `.class` files",
            "rawTitle": "Khái niệm Classpath (`-classpath` / `-cp`) và cách JVM tìm kiếm `.class` files",
            "tags": []
          },
          {
            "id": "java-day-11-topic-03-sub-02",
            "title": "Cấu trúc file lưu trữ `.jar` (Java Archive — định dạng ZIP)",
            "rawTitle": "Cấu trúc file lưu trữ `.jar` (Java Archive — định dạng ZIP)",
            "tags": []
          },
          {
            "id": "java-day-11-topic-03-sub-03",
            "title": "Tạo file JAR bằng lệnh `jar cvf`",
            "rawTitle": "Tạo file JAR bằng lệnh `jar cvf`",
            "tags": []
          },
          {
            "id": "java-day-11-topic-03-sub-04",
            "title": "File Manifest (`META-INF/MANIFEST.MF`) và thuộc tính `Main-Class`",
            "rawTitle": "File Manifest (`META-INF/MANIFEST.MF`) và thuộc tính `Main-Class`",
            "tags": []
          },
          {
            "id": "java-day-11-topic-03-sub-05",
            "title": "Tạo và chạy Executable JAR (`java -jar app.jar`)",
            "rawTitle": "Tạo và chạy Executable JAR (`java -jar app.jar`)",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 20
  },
  {
    "id": "java-day-12",
    "track": "java",
    "dayNumber": 12,
    "title": "Object-Oriented Design",
    "phaseId": "phase-2",
    "phaseTitle": "Phase 2: Object-Oriented Programming (OOP) Fundamentals",
    "description": "Object-Oriented Design principles: UML relations, Composition over Inheritance, Javadoc, and Banking Mini Project.",
    "topics": [
      {
        "id": "java-day-12-topic-01",
        "title": "Class Relationships",
        "subtopics": [
          {
            "id": "java-day-12-topic-01-sub-01",
            "title": "Dependency (Quan hệ phụ thuộc — \"uses-a\"): Class này dùng class kia trong method",
            "rawTitle": "Dependency (Quan hệ phụ thuộc — \"uses-a\"): Class này dùng class kia trong method",
            "tags": []
          },
          {
            "id": "java-day-12-topic-01-sub-02",
            "title": "Aggregation (Quan hệ thu nạp — \"has-a\"): Đối tượng chứa đối tượng khác, vòng đời độc lập",
            "rawTitle": "Aggregation (Quan hệ thu nạp — \"has-a\"): Đối tượng chứa đối tượng khác, vòng đời độc lập",
            "tags": []
          },
          {
            "id": "java-day-12-topic-01-sub-03",
            "title": "Composition (Quan hệ hợp thành — \"has-a\" chặt chẽ): Đối tượng con phụ thuộc vòng đời của đối tượng cha",
            "rawTitle": "Composition (Quan hệ hợp thành — \"has-a\" chặt chẽ): Đối tượng con phụ thuộc vòng đời của đối tượng cha",
            "tags": []
          },
          {
            "id": "java-day-12-topic-01-sub-04",
            "title": "Inheritance (Quan hệ kế thừa — \"is-a\"): Mối quan hệ phân cấp lớp",
            "rawTitle": "Inheritance (Quan hệ kế thừa — \"is-a\"): Mối quan hệ phân cấp lớp",
            "tags": []
          },
          {
            "id": "java-day-12-topic-01-sub-05",
            "title": "Biểu diễn cơ bản các mối quan hệ qua UML Class Diagram",
            "rawTitle": "Biểu diễn cơ bản các mối quan hệ qua UML Class Diagram",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-12-topic-02",
        "title": "Object-Oriented Design Principles",
        "subtopics": [
          {
            "id": "java-day-12-topic-02-sub-01",
            "title": "Nguyên tắc đóng gói và ẩn giấu thông tin (Information Hiding)",
            "rawTitle": "Nguyên tắc đóng gói và ẩn giấu thông tin (Information Hiding)",
            "tags": []
          },
          {
            "id": "java-day-12-topic-02-sub-02",
            "title": "Nguyên tắc ưu tiên Composition hơn Inheritance (Favor Composition over Inheritance)",
            "rawTitle": "Nguyên tắc ưu tiên Composition hơn Inheritance (Favor Composition over Inheritance)",
            "tags": []
          },
          {
            "id": "java-day-12-topic-02-sub-03",
            "title": "Giữ cho class có trách nhiệm đơn lẻ (Single Responsibility cơ bản)",
            "rawTitle": "Giữ cho class có trách nhiệm đơn lẻ (Single Responsibility cơ bản)",
            "tags": []
          },
          {
            "id": "java-day-12-topic-02-sub-04",
            "title": "Đặt tên class, method và biến có ý nghĩa theo domain",
            "rawTitle": "Đặt tên class, method và biến có ý nghĩa theo domain",
            "tags": []
          },
          {
            "id": "java-day-12-topic-02-sub-05",
            "title": "Tránh thiết kế class có quá nhiều fields (God Class)",
            "rawTitle": "Tránh thiết kế class có quá nhiều fields (God Class)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-12-topic-03",
        "title": "Documentation with Javadoc",
        "subtopics": [
          {
            "id": "java-day-12-topic-03-sub-01",
            "title": "Cấu trúc comment Javadoc chuẩn",
            "rawTitle": "Cấu trúc comment Javadoc chuẩn",
            "tags": []
          },
          {
            "id": "java-day-12-topic-03-sub-02",
            "title": "Các tag Javadoc phổ biến: `@param`, `@return`, `@throws`, `@see`, `@since`, `@deprecated`, `@version`, `@author`",
            "rawTitle": "Các tag Javadoc phổ biến: `@param`, `@return`, `@throws`, `@see`, `@since`, `@deprecated`, `@version`, `@author`",
            "tags": []
          },
          {
            "id": "java-day-12-topic-03-sub-03",
            "title": "Tạo tài liệu HTML bằng command-line tool `javadoc`",
            "rawTitle": "Tạo tài liệu HTML bằng command-line tool `javadoc`",
            "tags": []
          },
          {
            "id": "java-day-12-topic-03-sub-04",
            "title": "Tích hợp Javadoc generation trong IDE",
            "rawTitle": "Tích hợp Javadoc generation trong IDE",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-12-topic-04",
        "title": "Mini Project: Banking System OOP Design",
        "subtopics": [
          {
            "id": "java-day-12-topic-04-sub-01",
            "title": "Thiết kế class `Account` (accountNumber, balance, owner, deposit, withdraw)",
            "rawTitle": "Thiết kế class `Account` (accountNumber, balance, owner, deposit, withdraw)",
            "tags": []
          },
          {
            "id": "java-day-12-topic-04-sub-02",
            "title": "Thiết kế class `Customer` (customerId, fullName, email, list of accounts)",
            "rawTitle": "Thiết kế class `Customer` (customerId, fullName, email, list of accounts)",
            "tags": []
          },
          {
            "id": "java-day-12-topic-04-sub-03",
            "title": "Thiết kế class `Transaction` (transactionId, timestamp, type, amount, status)",
            "rawTitle": "Thiết kế class `Transaction` (transactionId, timestamp, type, amount, status)",
            "tags": []
          },
          {
            "id": "java-day-12-topic-04-sub-04",
            "title": "Thiết kế class `Bank` quản lý danh sách Customer và thực hiện chuyển khoản",
            "rawTitle": "Thiết kế class `Bank` quản lý danh sách Customer và thực hiện chuyển khoản",
            "tags": []
          },
          {
            "id": "java-day-12-topic-04-sub-05",
            "title": "Áp dụng Encapsulation, Validation, Static Counters và Immutability phù hợp",
            "rawTitle": "Áp dụng Encapsulation, Validation, Static Counters và Immutability phù hợp",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 19
  },
  {
    "id": "java-day-13",
    "track": "java",
    "dayNumber": 13,
    "title": "Inheritance",
    "phaseId": "phase-3",
    "phaseTitle": "Phase 3: Advanced OOP, Object Contracts & Polymorphism",
    "description": "Inheritance architecture: extends, super keyword, method overriding, protected access, and final classes/methods.",
    "topics": [
      {
        "id": "java-day-13-topic-01",
        "title": "Superclass & Subclass Fundamentals",
        "subtopics": [
          {
            "id": "java-day-13-topic-01-sub-01",
            "title": "Khái niệm kế thừa (Inheritance) và tái sử dụng mã nguồn",
            "rawTitle": "Khái niệm kế thừa (Inheritance) và tái sử dụng mã nguồn",
            "tags": []
          },
          {
            "id": "java-day-13-topic-01-sub-02",
            "title": "Lớp cha (Superclass / Parent class / Base class)",
            "rawTitle": "Lớp cha (Superclass / Parent class / Base class)",
            "tags": []
          },
          {
            "id": "java-day-13-topic-01-sub-03",
            "title": "Lớp con (Subclass / Child class / Derived class)",
            "rawTitle": "Lớp con (Subclass / Child class / Derived class)",
            "tags": []
          },
          {
            "id": "java-day-13-topic-01-sub-04",
            "title": "Từ khóa `extends`",
            "rawTitle": "Từ khóa `extends`",
            "tags": []
          },
          {
            "id": "java-day-13-topic-01-sub-05",
            "title": "Quy tắc đơn kế thừa (Single Inheritance) trong Java đối với class",
            "rawTitle": "Quy tắc đơn kế thừa (Single Inheritance) trong Java đối với class",
            "tags": []
          },
          {
            "id": "java-day-13-topic-01-sub-06",
            "title": "Những gì lớp con được kế thừa và không được kế thừa từ lớp cha",
            "rawTitle": "Những gì lớp con được kế thừa và không được kế thừa từ lớp cha",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-13-topic-02",
        "title": "Method Overriding & super Keyword",
        "subtopics": [
          {
            "id": "java-day-13-topic-02-sub-01",
            "title": "Khái niệm ghi đè phương thức (Method Overriding)",
            "rawTitle": "Khái niệm ghi đè phương thức (Method Overriding)",
            "tags": []
          },
          {
            "id": "java-day-13-topic-02-sub-02",
            "title": "Annotation `@Override` và lợi ích kiểm tra lỗi biên dịch",
            "rawTitle": "Annotation `@Override` và lợi ích kiểm tra lỗi biên dịch",
            "tags": []
          },
          {
            "id": "java-day-13-topic-02-sub-03",
            "title": "Quy tắc overriding: Tên, tham số, kiểu trả về (Covariant return types)",
            "rawTitle": "Quy tắc overriding: Tên, tham số, kiểu trả về (Covariant return types)",
            "tags": []
          },
          {
            "id": "java-day-13-topic-02-sub-04",
            "title": "Quy tắc phạm vi truy cập khi override (không được thu hẹp quyền truy cập)",
            "rawTitle": "Quy tắc phạm vi truy cập khi override (không được thu hẹp quyền truy cập)",
            "tags": []
          },
          {
            "id": "java-day-13-topic-02-sub-05",
            "title": "Từ khóa `super` để gọi phương thức của lớp cha (`super.methodName()`)",
            "rawTitle": "Từ khóa `super` để gọi phương thức của lớp cha (`super.methodName()`)",
            "tags": []
          },
          {
            "id": "java-day-13-topic-02-sub-06",
            "title": "Gọi constructor của lớp cha bằng `super(...)`",
            "rawTitle": "Gọi constructor của lớp cha bằng `super(...)`",
            "tags": []
          },
          {
            "id": "java-day-13-topic-02-sub-07",
            "title": "Quy tắc `super(...)` phải là câu lệnh đầu tiên trong subclass constructor",
            "rawTitle": "Quy tắc `super(...)` phải là câu lệnh đầu tiên trong subclass constructor",
            "tags": []
          },
          {
            "id": "java-day-13-topic-02-sub-08",
            "title": "Thứ tự thực thi constructor khi khởi tạo đối tượng lớp con (từ cha đến con)",
            "rawTitle": "Thứ tự thực thi constructor khi khởi tạo đối tượng lớp con (từ cha đến con)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-13-topic-03",
        "title": "Access Modifiers & Inheritance Control",
        "subtopics": [
          {
            "id": "java-day-13-topic-03-sub-01",
            "title": "Bảng tổng hợp 4 mức độ truy cập: `private`, default (package-private), `protected`, `public`",
            "rawTitle": "Bảng tổng hợp 4 mức độ truy cập: `private`, default (package-private), `protected`, `public`",
            "tags": []
          },
          {
            "id": "java-day-13-topic-03-sub-02",
            "title": "Quyền truy cập `protected`: Cho phép truy cập trong cùng package và các subclass ở package khác",
            "rawTitle": "Quyền truy cập `protected`: Cho phép truy cập trong cùng package và các subclass ở package khác",
            "tags": []
          },
          {
            "id": "java-day-13-topic-03-sub-03",
            "title": "Khi nào nên và không nên dùng `protected`",
            "rawTitle": "Khi nào nên và không nên dùng `protected`",
            "tags": []
          },
          {
            "id": "java-day-13-topic-03-sub-04",
            "title": "Ngăn chặn kế thừa class với từ khóa `final class` (ví dụ `java.lang.String`)",
            "rawTitle": "Ngăn chặn kế thừa class với từ khóa `final class` (ví dụ `java.lang.String`)",
            "tags": []
          },
          {
            "id": "java-day-13-topic-03-sub-05",
            "title": "Ngăn chặn ghi đè phương thức với từ khóa `final method`",
            "rawTitle": "Ngăn chặn ghi đè phương thức với từ khóa `final method`",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 19
  },
  {
    "id": "java-day-14",
    "track": "java",
    "dayNumber": 14,
    "title": "Polymorphism",
    "phaseId": "phase-3",
    "phaseTitle": "Phase 3: Advanced OOP, Object Contracts & Polymorphism",
    "description": "Polymorphism, Virtual Method Table (VMT), upcasting/downcasting, instanceof, and Pattern Matching.",
    "topics": [
      {
        "id": "java-day-14-topic-01",
        "title": "Polymorphism Concepts & Dynamic Dispatch",
        "subtopics": [
          {
            "id": "java-day-14-topic-01-sub-01",
            "title": "Khái niệm tính đa hình (Polymorphism / Subtype Polymorphism)",
            "rawTitle": "Khái niệm tính đa hình (Polymorphism / Subtype Polymorphism)",
            "tags": []
          },
          {
            "id": "java-day-14-topic-01-sub-02",
            "title": "Nguyên lý thay thế Liskov cơ bản: \"Lớp con có thể thay thế lớp cha bất kỳ đâu\"",
            "rawTitle": "Nguyên lý thay thế Liskov cơ bản: \"Lớp con có thể thay thế lớp cha bất kỳ đâu\"",
            "tags": []
          },
          {
            "id": "java-day-14-topic-01-sub-03",
            "title": "Biến kiểu lớp cha tham chiếu đến đối tượng lớp con: `SuperClass obj = new SubClass();`",
            "rawTitle": "Biến kiểu lớp cha tham chiếu đến đối tượng lớp con: `SuperClass obj = new SubClass();`",
            "tags": []
          },
          {
            "id": "java-day-14-topic-01-sub-04",
            "title": "Static Binding / Early Binding (Compile-time) cho static methods, private methods, final methods",
            "rawTitle": "Static Binding / Early Binding (Compile-time) cho static methods, private methods, final methods",
            "tags": []
          },
          {
            "id": "java-day-14-topic-01-sub-05",
            "title": "Dynamic Binding / Late Binding / Dynamic Method Dispatch (Runtime) cho instance methods",
            "rawTitle": "Dynamic Binding / Late Binding / Dynamic Method Dispatch (Runtime) cho instance methods",
            "tags": []
          },
          {
            "id": "java-day-14-topic-01-sub-06",
            "title": "Cơ chế hoạt động của Method Table (VMT / Virtual Method Table) trong JVM",
            "rawTitle": "Cơ chế hoạt động của Method Table (VMT / Virtual Method Table) trong JVM",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-14-topic-02",
        "title": "Casting & Type Checking",
        "subtopics": [
          {
            "id": "java-day-14-topic-02-sub-01",
            "title": "Ép kiểu lên (Upcasting): Tự động và an toàn",
            "rawTitle": "Ép kiểu lên (Upcasting): Tự động và an toàn",
            "tags": []
          },
          {
            "id": "java-day-14-topic-02-sub-02",
            "title": "Ép kiểu xuống (Downcasting): Cần ép kiểu tường minh `(SubClass) obj`",
            "rawTitle": "Ép kiểu xuống (Downcasting): Cần ép kiểu tường minh `(SubClass) obj`",
            "tags": []
          },
          {
            "id": "java-day-14-topic-02-sub-03",
            "title": "Rủi ro downcasting sai và ngoại lệ `ClassCastException`",
            "rawTitle": "Rủi ro downcasting sai và ngoại lệ `ClassCastException`",
            "tags": []
          },
          {
            "id": "java-day-14-topic-02-sub-04",
            "title": "Toán tử kiểm tra kiểu `instanceof` truyền thống",
            "rawTitle": "Toán tử kiểm tra kiểu `instanceof` truyền thống",
            "tags": []
          },
          {
            "id": "java-day-14-topic-02-sub-05",
            "title": "Pattern Matching for `instanceof` (Java 16+): Cú pháp `if (obj instanceof String s)`",
            "rawTitle": "Pattern Matching for `instanceof` (Java 16+): Cú pháp `if (obj instanceof String s)`",
            "tags": []
          },
          {
            "id": "java-day-14-topic-02-sub-06",
            "title": "Loại bỏ hoàn toàn boilerplate code ép kiểu sau khi kiểm tra `instanceof`",
            "rawTitle": "Loại bỏ hoàn toàn boilerplate code ép kiểu sau khi kiểm tra `instanceof`",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 12
  },
  {
    "id": "java-day-15",
    "track": "java",
    "dayNumber": 15,
    "title": "Object Class & Equality",
    "phaseId": "phase-3",
    "phaseTitle": "Phase 3: Advanced OOP, Object Contracts & Polymorphism",
    "description": "java.lang.Object contract: equals(), hashCode(), toString(), clone(), and preventing hash collision bugs.",
    "topics": [
      {
        "id": "java-day-15-topic-01",
        "title": "java.lang.Object Class",
        "subtopics": [
          {
            "id": "java-day-15-topic-01-sub-01",
            "title": "Lớp `java.lang.Object` là gốc của mọi class hierarchy trong Java",
            "rawTitle": "Lớp `java.lang.Object` là gốc của mọi class hierarchy trong Java",
            "tags": []
          },
          {
            "id": "java-day-15-topic-01-sub-02",
            "title": "Danh sách các methods cơ bản của `Object`: `equals()`, `hashCode()`, `toString()`, `getClass()`, `clone()`, `finalize()` (deprecated), `wait()`, `notify()`, `notifyAll()`",
            "rawTitle": "Danh sách các methods cơ bản của `Object`: `equals()`, `hashCode()`, `toString()`, `getClass()`, `clone()`, `finalize()` (deprecated), `wait()`, `notify()`, `notifyAll()`",
            "tags": []
          },
          {
            "id": "java-day-15-topic-01-sub-03",
            "title": "Phương thức `toString()`: Cài đặt mặc định vs Ghi đè để hiển thị thông tin đối tượng",
            "rawTitle": "Phương thức `toString()`: Cài đặt mặc định vs Ghi đè để hiển thị thông tin đối tượng",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-15-topic-02",
        "title": "The equals() Method Contract",
        "subtopics": [
          {
            "id": "java-day-15-topic-02-sub-01",
            "title": "Cài đặt mặc định của `equals()` trong lớp `Object` (so sánh địa chỉ `==`)",
            "rawTitle": "Cài đặt mặc định của `equals()` trong lớp `Object` (so sánh địa chỉ `==`)",
            "tags": []
          },
          {
            "id": "java-day-15-topic-02-sub-02",
            "title": "Hợp đồng của `equals()` (The equals contract):",
            "rawTitle": "Hợp đồng của `equals()` (The equals contract):",
            "tags": []
          },
          {
            "id": "java-day-15-topic-02-sub-03",
            "title": "Cấu trúc chuẩn từng bước để ghi đè `equals()` hoàn hảo",
            "rawTitle": "Cấu trúc chuẩn từng bước để ghi đè `equals()` hoàn hảo",
            "tags": []
          },
          {
            "id": "java-day-15-topic-02-sub-04",
            "title": "`getClass()` vs `instanceof` trong `equals()` và bài toán kế thừa",
            "rawTitle": "`getClass()` vs `instanceof` trong `equals()` và bài toán kế thừa",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-15-topic-03",
        "title": "The hashCode() Method Contract",
        "subtopics": [
          {
            "id": "java-day-15-topic-03-sub-01",
            "title": "Khái niệm băm (Hashing) và giá trị Hash Code",
            "rawTitle": "Khái niệm băm (Hashing) và giá trị Hash Code",
            "tags": []
          },
          {
            "id": "java-day-15-topic-03-sub-02",
            "title": "Cài đặt mặc định của `hashCode()` trong `Object` (Identity Hash Code dựa trên vùng nhớ)",
            "rawTitle": "Cài đặt mặc định của `hashCode()` trong `Object` (Identity Hash Code dựa trên vùng nhớ)",
            "tags": []
          },
          {
            "id": "java-day-15-topic-03-sub-03",
            "title": "Hợp đồng giữa `equals()` và `hashCode()`:",
            "rawTitle": "Hợp đồng giữa `equals()` và `hashCode()`:",
            "tags": []
          },
          {
            "id": "java-day-15-topic-03-sub-04",
            "title": "Hậu quả nghiêm trọng khi chỉ override `equals()` mà không override `hashCode()` khi dùng `HashSet`, `HashMap`",
            "rawTitle": "Hậu quả nghiêm trọng khi chỉ override `equals()` mà không override `hashCode()` khi dùng `HashSet`, `HashMap`",
            "tags": []
          },
          {
            "id": "java-day-15-topic-03-sub-05",
            "title": "Viết `hashCode()` với `Objects.hash(...)` và thuật toán băm với số nguyên tố 31",
            "rawTitle": "Viết `hashCode()` với `Objects.hash(...)` và thuật toán băm với số nguyên tố 31",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-15-topic-04",
        "title": "Object Identity & Cloning",
        "subtopics": [
          {
            "id": "java-day-15-topic-04-sub-01",
            "title": "`System.identityHashCode(obj)`",
            "rawTitle": "`System.identityHashCode(obj)`",
            "tags": []
          },
          {
            "id": "java-day-15-topic-04-sub-02",
            "title": "Phương thức `Objects.equals(a, b)` an toàn chống `NullPointerException`",
            "rawTitle": "Phương thức `Objects.equals(a, b)` an toàn chống `NullPointerException`",
            "tags": []
          },
          {
            "id": "java-day-15-topic-04-sub-03",
            "title": "Phương thức `Object.clone()` và interface đánh dấu `Cloneable`",
            "rawTitle": "Phương thức `Object.clone()` và interface đánh dấu `Cloneable`",
            "tags": []
          },
          {
            "id": "java-day-15-topic-04-sub-04",
            "title": "Vấn đề của `clone()` và lý do nên ưu tiên Copy Constructor / Factory Method",
            "rawTitle": "Vấn đề của `clone()` và lý do nên ưu tiên Copy Constructor / Factory Method",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 16
  },
  {
    "id": "java-day-16",
    "track": "java",
    "dayNumber": 16,
    "title": "Abstract Classes, Enum & Sealed Classes",
    "phaseId": "phase-3",
    "phaseTitle": "Phase 3: Advanced OOP, Object Contracts & Polymorphism",
    "description": "Abstract classes, Enum classes with fields/methods, Sealed classes/interfaces, Wrappers, and Autoboxing cache.",
    "topics": [
      {
        "id": "java-day-16-topic-01",
        "title": "Abstract Classes & Abstract Methods",
        "subtopics": [
          {
            "id": "java-day-16-topic-01-sub-01",
            "title": "Khái niệm trừu tượng hóa (Abstraction)",
            "rawTitle": "Khái niệm trừu tượng hóa (Abstraction)",
            "tags": []
          },
          {
            "id": "java-day-16-topic-01-sub-02",
            "title": "Lớp trừu tượng (Abstract Class) với từ khóa `abstract`",
            "rawTitle": "Lớp trừu tượng (Abstract Class) với từ khóa `abstract`",
            "tags": []
          },
          {
            "id": "java-day-16-topic-01-sub-03",
            "title": "Quy tắc: Không thể khởi tạo trực tiếp instance của abstract class bằng `new`",
            "rawTitle": "Quy tắc: Không thể khởi tạo trực tiếp instance của abstract class bằng `new`",
            "tags": []
          },
          {
            "id": "java-day-16-topic-01-sub-04",
            "title": "Phương thức trừu tượng (Abstract Method): Khai báo không có body",
            "rawTitle": "Phương thức trừu tượng (Abstract Method): Khai báo không có body",
            "tags": []
          },
          {
            "id": "java-day-16-topic-01-sub-05",
            "title": "Quy tắc: Class chứa ít nhất một abstract method bắt buộc phải là abstract class",
            "rawTitle": "Quy tắc: Class chứa ít nhất một abstract method bắt buộc phải là abstract class",
            "tags": []
          },
          {
            "id": "java-day-16-topic-01-sub-06",
            "title": "Subclass kế thừa abstract class bắt buộc phải override toàn bộ abstract methods hoặc tiếp tục là abstract class",
            "rawTitle": "Subclass kế thừa abstract class bắt buộc phải override toàn bộ abstract methods hoặc tiếp tục là abstract class",
            "tags": []
          },
          {
            "id": "java-day-16-topic-01-sub-07",
            "title": "Abstract class có thể có constructors, instance fields, concrete methods",
            "rawTitle": "Abstract class có thể có constructors, instance fields, concrete methods",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-16-topic-02",
        "title": "Advanced Enum Classes",
        "subtopics": [
          {
            "id": "java-day-16-topic-02-sub-01",
            "title": "Enum trong Java thực chất là một class đặc biệt kế thừa `java.lang.Enum`",
            "rawTitle": "Enum trong Java thực chất là một class đặc biệt kế thừa `java.lang.Enum`",
            "tags": []
          },
          {
            "id": "java-day-16-topic-02-sub-02",
            "title": "Định nghĩa fields, constructor (`private`) và methods trong Enum",
            "rawTitle": "Định nghĩa fields, constructor (`private`) và methods trong Enum",
            "tags": []
          },
          {
            "id": "java-day-16-topic-02-sub-03",
            "title": "Enum instances là các singleton hằng số",
            "rawTitle": "Enum instances là các singleton hằng số",
            "tags": []
          },
          {
            "id": "java-day-16-topic-02-sub-04",
            "title": "Enum methods có sẵn: `values()`, `valueOf()`, `name()`, `ordinal()`",
            "rawTitle": "Enum methods có sẵn: `values()`, `valueOf()`, `name()`, `ordinal()`",
            "tags": []
          },
          {
            "id": "java-day-16-topic-02-sub-05",
            "title": "Ghi đè phương thức riêng biệt cho từng giá trị Enum (Constant-specific class bodies)",
            "rawTitle": "Ghi đè phương thức riêng biệt cho từng giá trị Enum (Constant-specific class bodies)",
            "tags": []
          },
          {
            "id": "java-day-16-topic-02-sub-06",
            "title": "Sử dụng Enum trong `switch` statements",
            "rawTitle": "Sử dụng Enum trong `switch` statements",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-16-topic-03",
        "title": "Sealed Classes & Interfaces (Java 17 LTS)",
        "subtopics": [
          {
            "id": "java-day-16-topic-03-sub-01",
            "title": "Động lực ra đời của Sealed Classes (Kiểm soát chặt chẽ phân cấp kế thừa)",
            "rawTitle": "Động lực ra đời của Sealed Classes (Kiểm soát chặt chẽ phân cấp kế thừa)",
            "tags": []
          },
          {
            "id": "java-day-16-topic-03-sub-02",
            "title": "Cú pháp `sealed class ClassName permits SubClassA, SubClassB`",
            "rawTitle": "Cú pháp `sealed class ClassName permits SubClassA, SubClassB`",
            "tags": []
          },
          {
            "id": "java-day-16-topic-03-sub-03",
            "title": "Các modifier bắt buộc cho subclass của sealed class: `final`, `sealed`, hoặc `non-sealed`",
            "rawTitle": "Các modifier bắt buộc cho subclass của sealed class: `final`, `sealed`, hoặc `non-sealed`",
            "tags": []
          },
          {
            "id": "java-day-16-topic-03-sub-04",
            "title": "Sealed Interfaces và ứng dụng mô hình hóa Algebraic Data Types (ADT)",
            "rawTitle": "Sealed Interfaces và ứng dụng mô hình hóa Algebraic Data Types (ADT)",
            "tags": []
          },
          {
            "id": "java-day-16-topic-03-sub-05",
            "title": "Kết hợp Sealed Classes với Pattern Matching cho `switch` (Java 21 LTS)",
            "rawTitle": "Kết hợp Sealed Classes với Pattern Matching cho `switch` (Java 21 LTS) [BACKEND EXTENSION]",
            "tags": [
              "BACKEND EXTENSION"
            ]
          }
        ]
      },
      {
        "id": "java-day-16-topic-04",
        "title": "Wrapper Classes & Autoboxing",
        "subtopics": [
          {
            "id": "java-day-16-topic-04-sub-01",
            "title": "Khái niệm Object Wrappers (`Integer`, `Long`, `Double`, `Boolean`, `Character`, v.v.)",
            "rawTitle": "Khái niệm Object Wrappers (`Integer`, `Long`, `Double`, `Boolean`, `Character`, v.v.)",
            "tags": []
          },
          {
            "id": "java-day-16-topic-04-sub-02",
            "title": "Tính bất biến (Immutability) của các Wrapper classes",
            "rawTitle": "Tính bất biến (Immutability) của các Wrapper classes",
            "tags": []
          },
          {
            "id": "java-day-16-topic-04-sub-03",
            "title": "Autoboxing: Tự động chuyển primitive sang wrapper object",
            "rawTitle": "Autoboxing: Tự động chuyển primitive sang wrapper object",
            "tags": []
          },
          {
            "id": "java-day-16-topic-04-sub-04",
            "title": "Auto-unboxing: Tự động chuyển wrapper object sang primitive",
            "rawTitle": "Auto-unboxing: Tự động chuyển wrapper object sang primitive",
            "tags": []
          },
          {
            "id": "java-day-16-topic-04-sub-05",
            "title": "Integer Cache Pool (từ -128 đến 127) và bẫy so sánh `==` trên `Integer`",
            "rawTitle": "Integer Cache Pool (từ -128 đến 127) và bẫy so sánh `==` trên `Integer`",
            "tags": []
          },
          {
            "id": "java-day-16-topic-04-sub-06",
            "title": "Nguy cơ `NullPointerException` khi unboxing một wrapper có giá trị `null`",
            "rawTitle": "Nguy cơ `NullPointerException` khi unboxing một wrapper có giá trị `null`",
            "tags": []
          },
          {
            "id": "java-day-16-topic-04-sub-07",
            "title": "Variable Arguments (`Varargs` cú pháp `Type... name`): Bản chất mảng và quy tắc đặt ở cuối danh sách tham số",
            "rawTitle": "Variable Arguments (`Varargs` cú pháp `Type... name`): Bản chất mảng và quy tắc đặt ở cuối danh sách tham số",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 25
  },
  {
    "id": "java-day-17",
    "track": "java",
    "dayNumber": 17,
    "title": "Reflection + OOP Consolidation",
    "phaseId": "phase-3",
    "phaseTitle": "Phase 3: Advanced OOP, Object Contracts & Polymorphism",
    "description": "Reflection API (java.lang.Class, Method, Field), runtime introspection, and OOP Milestone consolidation.",
    "topics": [
      {
        "id": "java-day-17-topic-01",
        "title": "Runtime Type Information & java.lang.Class",
        "subtopics": [
          {
            "id": "java-day-17-topic-01-sub-01",
            "title": "Khái niệm Runtime Type Information (RTTI)",
            "rawTitle": "Khái niệm Runtime Type Information (RTTI)",
            "tags": []
          },
          {
            "id": "java-day-17-topic-01-sub-02",
            "title": "Đối tượng `java.lang.Class` đại diện cho kiểu dữ liệu đang chạy",
            "rawTitle": "Đối tượng `java.lang.Class` đại diện cho kiểu dữ liệu đang chạy",
            "tags": []
          },
          {
            "id": "java-day-17-topic-01-sub-03",
            "title": "3 cách lấy đối tượng `Class`: `obj.getClass()`, `ClassName.class`, `Class.forName(\"com.example.Class\")`",
            "rawTitle": "3 cách lấy đối tượng `Class`: `obj.getClass()`, `ClassName.class`, `Class.forName(\"com.example.Class\")`",
            "tags": []
          },
          {
            "id": "java-day-17-topic-01-sub-04",
            "title": "Lấy thông tin metadata của class: Package, tên class, modifiers, superclass, interfaces",
            "rawTitle": "Lấy thông tin metadata của class: Package, tên class, modifiers, superclass, interfaces",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-17-topic-02",
        "title": "Java Reflection API Fundamentals",
        "subtopics": [
          {
            "id": "java-day-17-topic-02-sub-01",
            "title": "Khái niệm Reflection (Cơ chế xem xét và thay đổi hành vi chương trình khi runtime)",
            "rawTitle": "Khái niệm Reflection (Cơ chế xem xét và thay đổi hành vi chương trình khi runtime)",
            "tags": []
          },
          {
            "id": "java-day-17-topic-02-sub-02",
            "title": "Duyệt và kiểm tra các Fields với `Class.getDeclaredFields()` và `Field` API",
            "rawTitle": "Duyệt và kiểm tra các Fields với `Class.getDeclaredFields()` và `Field` API",
            "tags": []
          },
          {
            "id": "java-day-17-topic-02-sub-03",
            "title": "Duyệt và gọi Constructors với `Class.getDeclaredConstructors()` và `Constructor.newInstance()`",
            "rawTitle": "Duyệt và gọi Constructors với `Class.getDeclaredConstructors()` và `Constructor.newInstance()`",
            "tags": []
          },
          {
            "id": "java-day-17-topic-02-sub-04",
            "title": "Duyệt và gọi Methods động với `Class.getDeclaredMethods()` và `Method.invoke()`",
            "rawTitle": "Duyệt và gọi Methods động với `Class.getDeclaredMethods()` và `Method.invoke()`",
            "tags": []
          },
          {
            "id": "java-day-17-topic-02-sub-05",
            "title": "Phá vỡ Encapsulation với `AccessibleObject.setAccessible(true)`",
            "rawTitle": "Phá vỡ Encapsulation với `AccessibleObject.setAccessible(true)`",
            "tags": []
          },
          {
            "id": "java-day-17-topic-02-sub-06",
            "title": "Ứng dụng thực tế của Reflection trong Java Backend: Frameworks (Spring IoC, Hibernate ORM, Jackson JSON)",
            "rawTitle": "Ứng dụng thực tế của Reflection trong Java Backend: Frameworks (Spring IoC, Hibernate ORM, Jackson JSON)",
            "tags": []
          },
          {
            "id": "java-day-17-topic-02-sub-07",
            "title": "Nhược điểm của Reflection: Hiệu năng thấp (Performance overhead), mất tính an toàn compile-time, bảo mật",
            "rawTitle": "Nhược điểm của Reflection: Hiệu năng thấp (Performance overhead), mất tính an toàn compile-time, bảo mật",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-17-topic-03",
        "title": "OOP Full Architecture Consolidation",
        "subtopics": [
          {
            "id": "java-day-17-topic-03-sub-01",
            "title": "Tổng kết chuỗi liên kết kiến thức:",
            "rawTitle": "Tổng kết chuỗi liên kết kiến thức:",
            "tags": []
          },
          {
            "id": "java-day-17-topic-03-sub-02",
            "title": "So sánh chi tiết: Concrete Class vs Abstract Class",
            "rawTitle": "So sánh chi tiết: Concrete Class vs Abstract Class",
            "tags": []
          },
          {
            "id": "java-day-17-topic-03-sub-03",
            "title": "Bảng phân tích quyết định thiết kế: Khi nào dùng Kế thừa (Inheritance) vs khi nào dùng Hợp thành (Composition)",
            "rawTitle": "Bảng phân tích quyết định thiết kế: Khi nào dùng Kế thừa (Inheritance) vs khi nào dùng Hợp thành (Composition)",
            "tags": []
          },
          {
            "id": "java-day-17-topic-03-sub-04",
            "title": "Các lỗi thiết kế OOP phổ biến cần tránh trong dự án thực tế",
            "rawTitle": "Các lỗi thiết kế OOP phổ biến cần tránh trong dự án thực tế",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 15
  },
  {
    "id": "java-day-18",
    "track": "java",
    "dayNumber": 18,
    "title": "Interfaces",
    "phaseId": "phase-4",
    "phaseTitle": "Phase 4: Modern Java Interfaces & Functional Programming",
    "description": "Interfaces: contracts, default/static/private methods, multiple inheritance resolution, and Comparable/Comparator.",
    "topics": [
      {
        "id": "java-day-18-topic-01",
        "title": "Interface Fundamentals",
        "subtopics": [
          {
            "id": "java-day-18-topic-01-sub-01",
            "title": "Khái niệm Interface (Bản hợp đồng về hành vi / Contract)",
            "rawTitle": "Khái niệm Interface (Bản hợp đồng về hành vi / Contract)",
            "tags": []
          },
          {
            "id": "java-day-18-topic-01-sub-02",
            "title": "Cú pháp khai báo `interface InterfaceName` và cài đặt `implements`",
            "rawTitle": "Cú pháp khai báo `interface InterfaceName` và cài đặt `implements`",
            "tags": []
          },
          {
            "id": "java-day-18-topic-01-sub-03",
            "title": "Đa kế thừa giao diện (Multiple Interface Implementation) trong Java",
            "rawTitle": "Đa kế thừa giao diện (Multiple Interface Implementation) trong Java",
            "tags": []
          },
          {
            "id": "java-day-18-topic-01-sub-04",
            "title": "Quy ước ngầm định trong interface: Mọi method không body đều là `public abstract`",
            "rawTitle": "Quy ước ngầm định trong interface: Mọi method không body đều là `public abstract`",
            "tags": []
          },
          {
            "id": "java-day-18-topic-01-sub-05",
            "title": "Hằng số trong interface: Mọi field đều ngầm định là `public static final`",
            "rawTitle": "Hằng số trong interface: Mọi field đều ngầm định là `public static final`",
            "tags": []
          },
          {
            "id": "java-day-18-topic-01-sub-06",
            "title": "Interface extends một hoặc nhiều interface khác",
            "rawTitle": "Interface extends một hoặc nhiều interface khác",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-18-topic-02",
        "title": "Interface vs Abstract Class",
        "subtopics": [
          {
            "id": "java-day-18-topic-02-sub-01",
            "title": "So sánh mục đích thiết kế: \"is-a\" (Abstract class) vs \"can-do / behaves-like\" (Interface)",
            "rawTitle": "So sánh mục đích thiết kế: \"is-a\" (Abstract class) vs \"can-do / behaves-like\" (Interface)",
            "tags": []
          },
          {
            "id": "java-day-18-topic-02-sub-02",
            "title": "So sánh trạng thái (State): Abstract class có instance fields, Interface không có",
            "rawTitle": "So sánh trạng thái (State): Abstract class có instance fields, Interface không có",
            "tags": []
          },
          {
            "id": "java-day-18-topic-02-sub-03",
            "title": "So sánh phân cấp: Đơn kế thừa vs Đa thực thi",
            "rawTitle": "So sánh phân cấp: Đơn kế thừa vs Đa thực thi",
            "tags": []
          },
          {
            "id": "java-day-18-topic-02-sub-04",
            "title": "Tiêu chí quyết định chọn Interface hay Abstract Class trong kiến trúc Backend",
            "rawTitle": "Tiêu chí quyết định chọn Interface hay Abstract Class trong kiến trúc Backend",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-18-topic-03",
        "title": "Modern Interface Evolution (Java 8, 9)",
        "subtopics": [
          {
            "id": "java-day-18-topic-03-sub-01",
            "title": "Default Methods (`default` keyword) trong Interface: Động lực ra đời (tương thích ngược cho Collections)",
            "rawTitle": "Default Methods (`default` keyword) trong Interface: Động lực ra đời (tương thích ngược cho Collections)",
            "tags": []
          },
          {
            "id": "java-day-18-topic-03-sub-02",
            "title": "Xung đột Default Method (The Diamond Problem trong interface) và quy tắc giải quyết:",
            "rawTitle": "Xung đột Default Method (The Diamond Problem trong interface) và quy tắc giải quyết:",
            "tags": []
          },
          {
            "id": "java-day-18-topic-03-sub-03",
            "title": "Static Methods trong Interface: Hỗ trợ utility methods gắn liền với interface",
            "rawTitle": "Static Methods trong Interface: Hỗ trợ utility methods gắn liền với interface",
            "tags": []
          },
          {
            "id": "java-day-18-topic-03-sub-04",
            "title": "Private Methods trong Interface (Java 9+): Tái sử dụng mã nguồn giữa các default methods",
            "rawTitle": "Private Methods trong Interface (Java 9+): Tái sử dụng mã nguồn giữa các default methods",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-18-topic-04",
        "title": "Core Standard Interfaces",
        "subtopics": [
          {
            "id": "java-day-18-topic-04-sub-01",
            "title": "Callback Pattern sử dụng Interface",
            "rawTitle": "Callback Pattern sử dụng Interface",
            "tags": []
          },
          {
            "id": "java-day-18-topic-04-sub-02",
            "title": "`java.lang.Comparable<T>` interface và phương thức `compareTo(T o)` (Natural ordering)",
            "rawTitle": "`java.lang.Comparable<T>` interface và phương thức `compareTo(T o)` (Natural ordering)",
            "tags": []
          },
          {
            "id": "java-day-18-topic-04-sub-03",
            "title": "`java.util.Comparator<T>` interface và phương thức `compare(T o1, T o2)` (Custom ordering)",
            "rawTitle": "`java.util.Comparator<T>` interface và phương thức `compare(T o1, T o2)` (Custom ordering)",
            "tags": []
          },
          {
            "id": "java-day-18-topic-04-sub-04",
            "title": "So sánh chi tiết: `Comparable` vs `Comparator`",
            "rawTitle": "So sánh chi tiết: `Comparable` vs `Comparator`",
            "tags": []
          },
          {
            "id": "java-day-18-topic-04-sub-05",
            "title": "Marker Interfaces (Interface đánh dấu không chứa method): `Cloneable`, `Serializable`, `RandomAccess`",
            "rawTitle": "Marker Interfaces (Interface đánh dấu không chứa method): `Cloneable`, `Serializable`, `RandomAccess`",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 19
  },
  {
    "id": "java-day-19",
    "track": "java",
    "dayNumber": 19,
    "title": "Lambda Expressions",
    "phaseId": "phase-4",
    "phaseTitle": "Phase 4: Modern Java Interfaces & Functional Programming",
    "description": "Lambda Expressions, Single Abstract Method (SAM), Built-in Functional Interfaces, and Method References.",
    "topics": [
      {
        "id": "java-day-19-topic-01",
        "title": "Functional Programming Concepts & Lambda Motivation",
        "subtopics": [
          {
            "id": "java-day-19-topic-01-sub-01",
            "title": "Sự chuyển dịch từ lập trình mệnh lệnh (Imperative) sang lập trình khai báo (Declarative/Functional)",
            "rawTitle": "Sự chuyển dịch từ lập trình mệnh lệnh (Imperative) sang lập trình khai báo (Declarative/Functional)",
            "tags": []
          },
          {
            "id": "java-day-19-topic-01-sub-02",
            "title": "Hạn chế của Anonymous Inner Class trước Java 8 (Cú pháp rườm rà)",
            "rawTitle": "Hạn chế của Anonymous Inner Class trước Java 8 (Cú pháp rườm rà)",
            "tags": []
          },
          {
            "id": "java-day-19-topic-01-sub-03",
            "title": "Lambda Expression là gì và bài toán mà Lambda giải quyết",
            "rawTitle": "Lambda Expression là gì và bài toán mà Lambda giải quyết",
            "tags": []
          },
          {
            "id": "java-day-19-topic-01-sub-04",
            "title": "Khái niệm Functional Interface (Giao diện đơn chức năng — Single Abstract Method / SAM)",
            "rawTitle": "Khái niệm Functional Interface (Giao diện đơn chức năng — Single Abstract Method / SAM)",
            "tags": []
          },
          {
            "id": "java-day-19-topic-01-sub-05",
            "title": "Annotation `@FunctionalInterface` và kiểm tra tính hợp lệ khi biên dịch",
            "rawTitle": "Annotation `@FunctionalInterface` và kiểm tra tính hợp lệ khi biên dịch",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-19-topic-02",
        "title": "Lambda Expression Syntax & Mechanics",
        "subtopics": [
          {
            "id": "java-day-19-topic-02-sub-01",
            "title": "Cú pháp chuẩn của Lambda: `(parameters) -> { body }`",
            "rawTitle": "Cú pháp chuẩn của Lambda: `(parameters) -> { body }`",
            "tags": []
          },
          {
            "id": "java-day-19-topic-02-sub-02",
            "title": "Rút gọn cú pháp: Bỏ kiểu tham số (Type inference), bỏ ngoặc đơn khi có 1 tham số, bỏ ngoặc nhọn `{}` và `return` khi có 1 biểu thức",
            "rawTitle": "Rút gọn cú pháp: Bỏ kiểu tham số (Type inference), bỏ ngoặc đơn khi có 1 tham số, bỏ ngoặc nhọn `{}` và `return` khi có 1 biểu thức",
            "tags": []
          },
          {
            "id": "java-day-19-topic-02-sub-03",
            "title": "Các Functional Interfaces có sẵn quan trọng trong `java.util.function`:",
            "rawTitle": "Các Functional Interfaces có sẵn quan trọng trong `java.util.function`:",
            "tags": []
          },
          {
            "id": "java-day-19-topic-02-sub-04",
            "title": "Primitive specialized functional interfaces (`IntPredicate`, `LongFunction`, `DoubleConsumer`, v.v.)",
            "rawTitle": "Primitive specialized functional interfaces (`IntPredicate`, `LongFunction`, `DoubleConsumer`, v.v.)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-19-topic-03",
        "title": "Method References & Constructor References",
        "subtopics": [
          {
            "id": "java-day-19-topic-03-sub-01",
            "title": "Khái niệm Method Reference (Toán tử `::`) và mối tương đương với Lambda",
            "rawTitle": "Khái niệm Method Reference (Toán tử `::`) và mối tương đương với Lambda",
            "tags": []
          },
          {
            "id": "java-day-19-topic-03-sub-02",
            "title": "Loại 1: Reference to a static method (`ClassName::staticMethod`)",
            "rawTitle": "Loại 1: Reference to a static method (`ClassName::staticMethod`)",
            "tags": []
          },
          {
            "id": "java-day-19-topic-03-sub-03",
            "title": "Loại 2: Reference to an instance method of a particular object (`instanceRef::instanceMethod`)",
            "rawTitle": "Loại 2: Reference to an instance method of a particular object (`instanceRef::instanceMethod`)",
            "tags": []
          },
          {
            "id": "java-day-19-topic-03-sub-04",
            "title": "Loại 3: Reference to an instance method of an arbitrary object of a particular type (`ClassName::instanceMethod`)",
            "rawTitle": "Loại 3: Reference to an instance method of an arbitrary object of a particular type (`ClassName::instanceMethod`)",
            "tags": []
          },
          {
            "id": "java-day-19-topic-03-sub-05",
            "title": "Constructor Reference: `ClassName::new` và tạo đối tượng / tạo mảng (`String[]::new`)",
            "rawTitle": "Constructor Reference: `ClassName::new` và tạo đối tượng / tạo mảng (`String[]::new`)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-19-topic-04",
        "title": "Variable Scope in Lambda Expressions",
        "subtopics": [
          {
            "id": "java-day-19-topic-04-sub-01",
            "title": "Khái niệm Variable Capture (Bắt giữ biến) trong Lambda",
            "rawTitle": "Khái niệm Variable Capture (Bắt giữ biến) trong Lambda",
            "tags": []
          },
          {
            "id": "java-day-19-topic-04-sub-02",
            "title": "Quy tắc biến cục bộ phải là `final` hoặc `effectively final`",
            "rawTitle": "Quy tắc biến cục bộ phải là `final` hoặc `effectively final`",
            "tags": []
          },
          {
            "id": "java-day-19-topic-04-sub-03",
            "title": "Tại sao biến cục bộ không được phép thay đổi giá trị sau khi bị Lambda bắt giữ (Concurrency & Stack lifetime)",
            "rawTitle": "Tại sao biến cục bộ không được phép thay đổi giá trị sau khi bị Lambda bắt giữ (Concurrency & Stack lifetime)",
            "tags": []
          },
          {
            "id": "java-day-19-topic-04-sub-04",
            "title": "Phạm vi `this` trong Lambda: Trỏ về đối tượng bao quanh (Enclosing instance) chứ không phải bản thân Lambda",
            "rawTitle": "Phạm vi `this` trong Lambda: Trỏ về đối tượng bao quanh (Enclosing instance) chứ không phải bản thân Lambda",
            "tags": []
          },
          {
            "id": "java-day-19-topic-04-sub-05",
            "title": "Kết hợp Comparator với Lambda: `Comparator.comparing()`, `thenComparing()`, `reversed()`",
            "rawTitle": "Kết hợp Comparator với Lambda: `Comparator.comparing()`, `thenComparing()`, `reversed()`",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 19
  },
  {
    "id": "java-day-20",
    "track": "java",
    "dayNumber": 20,
    "title": "Inner Classes & Advanced Java Features",
    "phaseId": "phase-4",
    "phaseTitle": "Phase 4: Modern Java Interfaces & Functional Programming",
    "description": "Inner classes (nested, local, anonymous), Variable Capture, Java SPI (ServiceLoader), and Dynamic Proxies.",
    "topics": [
      {
        "id": "java-day-20-topic-01",
        "title": "Inner Classes",
        "subtopics": [
          {
            "id": "java-day-20-topic-01-sub-01",
            "title": "Khái niệm Nested Classes và phân loại (Member Inner, Local Inner, Anonymous Inner, Static Nested)",
            "rawTitle": "Khái niệm Nested Classes và phân loại (Member Inner, Local Inner, Anonymous Inner, Static Nested)",
            "tags": []
          },
          {
            "id": "java-day-20-topic-01-sub-02",
            "title": "Member Inner Class (Non-static Inner Class): Cú pháp và quan hệ gắn liền với enclosing instance",
            "rawTitle": "Member Inner Class (Non-static Inner Class): Cú pháp và quan hệ gắn liền với enclosing instance",
            "tags": []
          },
          {
            "id": "java-day-20-topic-01-sub-03",
            "title": "Truy cập fields của outer class từ inner class: Cú pháp `OuterClass.this.field`",
            "rawTitle": "Truy cập fields của outer class từ inner class: Cú pháp `OuterClass.this.field`",
            "tags": []
          },
          {
            "id": "java-day-20-topic-01-sub-04",
            "title": "Static Nested Class: Cú pháp, không giữ tham chiếu đến outer instance, hoạt động như top-level class",
            "rawTitle": "Static Nested Class: Cú pháp, không giữ tham chiếu đến outer instance, hoạt động như top-level class",
            "tags": []
          },
          {
            "id": "java-day-20-topic-01-sub-05",
            "title": "Local Inner Class: Định nghĩa bên trong thân hàm, phạm vi cục bộ",
            "rawTitle": "Local Inner Class: Định nghĩa bên trong thân hàm, phạm vi cục bộ",
            "tags": []
          },
          {
            "id": "java-day-20-topic-01-sub-06",
            "title": "Anonymous Inner Class (Lớp nội danh): Cú pháp `new SuperType() { ... }`, ứng dụng và so sánh với Lambda",
            "rawTitle": "Anonymous Inner Class (Lớp nội danh): Cú pháp `new SuperType() { ... }`, ứng dụng và so sánh với Lambda",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-20-topic-02",
        "title": "ServiceLoader Mechanism (Java SPI)",
        "subtopics": [
          {
            "id": "java-day-20-topic-02-sub-01",
            "title": "Khái niệm Service Provider Interface (SPI) và tính cởi mở của kiến trúc",
            "rawTitle": "Khái niệm Service Provider Interface (SPI) và tính cởi mở của kiến trúc",
            "tags": []
          },
          {
            "id": "java-day-20-topic-02-sub-02",
            "title": "Thành phần: Service Interface, Service Provider Implementation, Service Configuration",
            "rawTitle": "Thành phần: Service Interface, Service Provider Implementation, Service Configuration",
            "tags": []
          },
          {
            "id": "java-day-20-topic-02-sub-03",
            "title": "File cấu hình trong `META-INF/services/`",
            "rawTitle": "File cấu hình trong `META-INF/services/`",
            "tags": []
          },
          {
            "id": "java-day-20-topic-02-sub-04",
            "title": "Lớp `java.util.ServiceLoader` và phương thức `ServiceLoader.load()`",
            "rawTitle": "Lớp `java.util.ServiceLoader` và phương thức `ServiceLoader.load()`",
            "tags": []
          },
          {
            "id": "java-day-20-topic-02-sub-05",
            "title": "Ứng dụng của SPI trong Java: JDBC Drivers (`java.sql.Driver`), Logging, Plugins",
            "rawTitle": "Ứng dụng của SPI trong Java: JDBC Drivers (`java.sql.Driver`), Logging, Plugins",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-20-topic-03",
        "title": "Dynamic Proxies",
        "subtopics": [
          {
            "id": "java-day-20-topic-03-sub-01",
            "title": "Khái niệm Proxy Design Pattern cơ bản",
            "rawTitle": "Khái niệm Proxy Design Pattern cơ bản",
            "tags": []
          },
          {
            "id": "java-day-20-topic-03-sub-02",
            "title": "`java.lang.reflect.Proxy` và `java.lang.reflect.InvocationHandler`",
            "rawTitle": "`java.lang.reflect.Proxy` và `java.lang.reflect.InvocationHandler`",
            "tags": []
          },
          {
            "id": "java-day-20-topic-03-sub-03",
            "title": "Tạo dynamic proxy khi runtime: `Proxy.newProxyInstance()`",
            "rawTitle": "Tạo dynamic proxy khi runtime: `Proxy.newProxyInstance()`",
            "tags": []
          },
          {
            "id": "java-day-20-topic-03-sub-04",
            "title": "Xử lý phương thức trong `invoke(Object proxy, Method method, Object[] args)`",
            "rawTitle": "Xử lý phương thức trong `invoke(Object proxy, Method method, Object[] args)`",
            "tags": []
          },
          {
            "id": "java-day-20-topic-03-sub-05",
            "title": "Giới hạn: JDK Dynamic Proxy chỉ hỗ trợ ủy quyền dựa trên Interface",
            "rawTitle": "Giới hạn: JDK Dynamic Proxy chỉ hỗ trợ ủy quyền dựa trên Interface",
            "tags": []
          },
          {
            "id": "java-day-20-topic-03-sub-06",
            "title": "Ứng dụng của Dynamic Proxy trong Spring AOP, Transaction Management (`@Transactional`), Security",
            "rawTitle": "Ứng dụng của Dynamic Proxy trong Spring AOP, Transaction Management (`@Transactional`), Security",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 17
  },
  {
    "id": "java-day-21",
    "track": "java",
    "dayNumber": 21,
    "title": "Exception Handling",
    "phaseId": "phase-5",
    "phaseTitle": "Phase 5: Exception Architecture, Logging & Generics",
    "description": "Exception hierarchy (Throwable, Exception, RuntimeException), try-catch-finally, try-with-resources, and custom exceptions.",
    "topics": [
      {
        "id": "java-day-21-topic-01",
        "title": "Exception Hierarchy & Classification",
        "subtopics": [
          {
            "id": "java-day-21-topic-01-sub-01",
            "title": "Kiến trúc cây phân cấp Exception trong Java: `Throwable` → `Error` và `Exception`",
            "rawTitle": "Kiến trúc cây phân cấp Exception trong Java: `Throwable` → `Error` và `Exception`",
            "tags": []
          },
          {
            "id": "java-day-21-topic-01-sub-02",
            "title": "Nhóm `java.lang.Error`: Lỗi nghiêm trọng của hệ thống/JVM (`OutOfMemoryError`, `StackOverflowError`), không nên catch",
            "rawTitle": "Nhóm `java.lang.Error`: Lỗi nghiêm trọng của hệ thống/JVM (`OutOfMemoryError`, `StackOverflowError`), không nên catch",
            "tags": []
          },
          {
            "id": "java-day-21-topic-01-sub-03",
            "title": "Nhóm `java.lang.Exception`: Lỗi ứng dụng có thể dự đoán và xử lý",
            "rawTitle": "Nhóm `java.lang.Exception`: Lỗi ứng dụng có thể dự đoán và xử lý",
            "tags": []
          },
          {
            "id": "java-day-21-topic-01-sub-04",
            "title": "Checked Exceptions (Kế thừa trực tiếp từ `Exception` ngoại trừ `RuntimeException`): Compiler bắt buộc xử lý (`IOException`, `SQLException`)",
            "rawTitle": "Checked Exceptions (Kế thừa trực tiếp từ `Exception` ngoại trừ `RuntimeException`): Compiler bắt buộc xử lý (`IOException`, `SQLException`)",
            "tags": []
          },
          {
            "id": "java-day-21-topic-01-sub-05",
            "title": "Unchecked Exceptions (Kế thừa từ `RuntimeException`): Lỗi logic lập trình, compiler không bắt buộc (`NullPointerException`, `IllegalArgumentException`, `IndexOutOfBoundsException`)",
            "rawTitle": "Unchecked Exceptions (Kế thừa từ `RuntimeException`): Lỗi logic lập trình, compiler không bắt buộc (`NullPointerException`, `IllegalArgumentException`, `IndexOutOfBoundsException`)",
            "tags": []
          },
          {
            "id": "java-day-21-topic-01-sub-06",
            "title": "Tranh luận thiết kế kiến trúc Backend: Checked Exception vs Unchecked Exception",
            "rawTitle": "Tranh luận thiết kế kiến trúc Backend: Checked Exception vs Unchecked Exception",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-21-topic-02",
        "title": "Exception Handling Mechanisms",
        "subtopics": [
          {
            "id": "java-day-21-topic-02-sub-01",
            "title": "Khối lệnh `try-catch`: Bắt và xử lý ngoại lệ",
            "rawTitle": "Khối lệnh `try-catch`: Bắt và xử lý ngoại lệ",
            "tags": []
          },
          {
            "id": "java-day-21-topic-02-sub-02",
            "title": "Bắt nhiều ngoại lệ với nhiều khối `catch` (Quy tắc xếp từ subclass đến superclass)",
            "rawTitle": "Bắt nhiều ngoại lệ với nhiều khối `catch` (Quy tắc xếp từ subclass đến superclass)",
            "tags": []
          },
          {
            "id": "java-day-21-topic-02-sub-03",
            "title": "Multi-catch block (Java 7+): Cú pháp `catch (IOException | SQLException e)`",
            "rawTitle": "Multi-catch block (Java 7+): Cú pháp `catch (IOException | SQLException e)`",
            "tags": []
          },
          {
            "id": "java-day-21-topic-02-sub-04",
            "title": "Khối lệnh `finally`: Luôn luôn thực thi dù có exception hay không (dọn dẹp tài nguyên)",
            "rawTitle": "Khối lệnh `finally`: Luôn luôn thực thi dù có exception hay không (dọn dẹp tài nguyên)",
            "tags": []
          },
          {
            "id": "java-day-21-topic-02-sub-05",
            "title": "Tương tác giữa `return` trong `try`/`catch` và khối `finally`",
            "rawTitle": "Tương tác giữa `return` trong `try`/`catch` và khối `finally`",
            "tags": []
          },
          {
            "id": "java-day-21-topic-02-sub-06",
            "title": "Từ khóa `throw`: Chủ động ném một ngoại lệ",
            "rawTitle": "Từ khóa `throw`: Chủ động ném một ngoại lệ",
            "tags": []
          },
          {
            "id": "java-day-21-topic-02-sub-07",
            "title": "Từ khóa `throws`: Khai báo ngoại lệ tại chữ ký phương thức (Method signature)",
            "rawTitle": "Từ khóa `throws`: Khai báo ngoại lệ tại chữ ký phương thức (Method signature)",
            "tags": []
          },
          {
            "id": "java-day-21-topic-02-sub-08",
            "title": "Quy tắc overriding method với `throws`: Subclass không được khai báo thêm checked exception mới hoặc rộng hơn superclass",
            "rawTitle": "Quy tắc overriding method với `throws`: Subclass không được khai báo thêm checked exception mới hoặc rộng hơn superclass",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-21-topic-03",
        "title": "Exception Chaining & Custom Exceptions",
        "subtopics": [
          {
            "id": "java-day-21-topic-03-sub-01",
            "title": "Kỹ thuật bọc ngoại lệ (Exception Wrapping / Exception Chaining)",
            "rawTitle": "Kỹ thuật bọc ngoại lệ (Exception Wrapping / Exception Chaining)",
            "tags": []
          },
          {
            "id": "java-day-21-topic-03-sub-02",
            "title": "Constructor nhận `Throwable cause` và phương thức `getCause()`",
            "rawTitle": "Constructor nhận `Throwable cause` và phương thức `getCause()`",
            "tags": []
          },
          {
            "id": "java-day-21-topic-03-sub-03",
            "title": "Phân tích Stack Trace: `e.printStackTrace()` vs ghi log",
            "rawTitle": "Phân tích Stack Trace: `e.printStackTrace()` vs ghi log",
            "tags": []
          },
          {
            "id": "java-day-21-topic-03-sub-04",
            "title": "Xây dựng Custom Exception Class (Kế thừa `RuntimeException` hoặc `Exception`)",
            "rawTitle": "Xây dựng Custom Exception Class (Kế thừa `RuntimeException` hoặc `Exception`)",
            "tags": []
          },
          {
            "id": "java-day-21-topic-03-sub-05",
            "title": "Thiết kế mã lỗi (Error Code) và thông điệp lỗi có cấu trúc trong Custom Exception",
            "rawTitle": "Thiết kế mã lỗi (Error Code) và thông điệp lỗi có cấu trúc trong Custom Exception",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-21-topic-04",
        "title": "Try-With-Resources & AutoCloseable",
        "subtopics": [
          {
            "id": "java-day-21-topic-04-sub-01",
            "title": "Vấn đề rò rỉ tài nguyên (Resource Leak) khi đóng tài nguyên thủ công trong `finally`",
            "rawTitle": "Vấn đề rò rỉ tài nguyên (Resource Leak) khi đóng tài nguyên thủ công trong `finally`",
            "tags": []
          },
          {
            "id": "java-day-21-topic-04-sub-02",
            "title": "Cú pháp `try-with-resources` (Java 7+)",
            "rawTitle": "Cú pháp `try-with-resources` (Java 7+)",
            "tags": []
          },
          {
            "id": "java-day-21-topic-04-sub-03",
            "title": "Interface `java.lang.AutoCloseable` và phương thức `close()`",
            "rawTitle": "Interface `java.lang.AutoCloseable` và phương thức `close()`",
            "tags": []
          },
          {
            "id": "java-day-21-topic-04-sub-04",
            "title": "Quản lý tự động đóng nhiều tài nguyên cùng lúc trong `try (...)`",
            "rawTitle": "Quản lý tự động đóng nhiều tài nguyên cùng lúc trong `try (...)`",
            "tags": []
          },
          {
            "id": "java-day-21-topic-04-sub-05",
            "title": "Khái niệm ngoại lệ bị triệt tiêu (Suppressed Exceptions) và `e.getSuppressed()`",
            "rawTitle": "Khái niệm ngoại lệ bị triệt tiêu (Suppressed Exceptions) và `e.getSuppressed()`",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 24
  },
  {
    "id": "java-day-22",
    "track": "java",
    "dayNumber": 22,
    "title": "Assertions, Logging & Debugging",
    "phaseId": "phase-5",
    "phaseTitle": "Phase 5: Exception Architecture, Logging & Generics",
    "description": "Assertions, java.util.logging architecture, Handlers, Formatters, debugging workflows, and Resilient Banking Project.",
    "topics": [
      {
        "id": "java-day-22-topic-01",
        "title": "Assertions",
        "subtopics": [
          {
            "id": "java-day-22-topic-01-sub-01",
            "title": "Khái niệm Assertion và mục đích kiểm tra giả định nội bộ trong quá trình development/testing",
            "rawTitle": "Khái niệm Assertion và mục đích kiểm tra giả định nội bộ trong quá trình development/testing",
            "tags": []
          },
          {
            "id": "java-day-22-topic-01-sub-02",
            "title": "Cú pháp từ khóa `assert condition;` và `assert condition : \"Error message\";`",
            "rawTitle": "Cú pháp từ khóa `assert condition;` và `assert condition : \"Error message\";`",
            "tags": []
          },
          {
            "id": "java-day-22-topic-01-sub-03",
            "title": "Ngoại lệ `AssertionError`",
            "rawTitle": "Ngoại lệ `AssertionError`",
            "tags": []
          },
          {
            "id": "java-day-22-topic-01-sub-04",
            "title": "Bật/tắt assertion từ JVM flags: `-ea` (`-enableassertions`) và `-da` (`-disableassertions`)",
            "rawTitle": "Bật/tắt assertion từ JVM flags: `-ea` (`-enableassertions`) và `-da` (`-disableassertions`)",
            "tags": []
          },
          {
            "id": "java-day-22-topic-01-sub-05",
            "title": "Khi nào nên dùng assertion và khi nào bắt buộc dùng Exception handling",
            "rawTitle": "Khi nào nên dùng assertion và khi nào bắt buộc dùng Exception handling",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-22-topic-02",
        "title": "Java Logging Framework",
        "subtopics": [
          {
            "id": "java-day-22-topic-02-sub-01",
            "title": "Tại sao không nên dùng `System.out.println()` để ghi log trong hệ thống Backend",
            "rawTitle": "Tại sao không nên dùng `System.out.println()` để ghi log trong hệ thống Backend",
            "tags": []
          },
          {
            "id": "java-day-22-topic-02-sub-02",
            "title": "Cấu trúc hệ thống Logging: `Logger`, `Handler`, `Filter`, `Formatter`, `Level`",
            "rawTitle": "Cấu trúc hệ thống Logging: `Logger`, `Handler`, `Filter`, `Formatter`, `Level`",
            "tags": []
          },
          {
            "id": "java-day-22-topic-02-sub-03",
            "title": "Khởi tạo Logger: `Logger.getLogger(ClassName.class.getName())`",
            "rawTitle": "Khởi tạo Logger: `Logger.getLogger(ClassName.class.getName())`",
            "tags": []
          },
          {
            "id": "java-day-22-topic-02-sub-04",
            "title": "Các cấp độ log (Log Levels): `SEVERE`, `WARNING`, `INFO`, `CONFIG`, `FINE`, `FINER`, `FINEST`, `ALL`, `OFF`",
            "rawTitle": "Các cấp độ log (Log Levels): `SEVERE`, `WARNING`, `INFO`, `CONFIG`, `FINE`, `FINER`, `FINEST`, `ALL`, `OFF`",
            "tags": []
          },
          {
            "id": "java-day-22-topic-02-sub-05",
            "title": "Cấu hình `Handler`: `ConsoleHandler`, `FileHandler`, `SocketHandler`",
            "rawTitle": "Cấu hình `Handler`: `ConsoleHandler`, `FileHandler`, `SocketHandler`",
            "tags": []
          },
          {
            "id": "java-day-22-topic-02-sub-06",
            "title": "Cấu hình `Formatter`: `SimpleFormatter`, `XMLFormatter`",
            "rawTitle": "Cấu hình `Formatter`: `SimpleFormatter`, `XMLFormatter`",
            "tags": []
          },
          {
            "id": "java-day-22-topic-02-sub-07",
            "title": "File cấu hình `logging.properties` và `LogManager`",
            "rawTitle": "File cấu hình `logging.properties` và `LogManager`",
            "tags": []
          },
          {
            "id": "java-day-22-topic-02-sub-08",
            "title": "Tổng quan về hệ sinh thái Logging thực tế: SLF4J, Logback, Log4j2",
            "rawTitle": "Tổng quan về hệ sinh thái Logging thực tế: SLF4J, Logback, Log4j2 [BACKEND EXTENSION]",
            "tags": [
              "BACKEND EXTENSION"
            ]
          }
        ]
      },
      {
        "id": "java-day-22-topic-03",
        "title": "Debugging Techniques",
        "subtopics": [
          {
            "id": "java-day-22-topic-03-sub-01",
            "title": "Đọc và phân tích Stack Trace từ dưới lên trên",
            "rawTitle": "Đọc và phân tích Stack Trace từ dưới lên trên",
            "tags": []
          },
          {
            "id": "java-day-22-topic-03-sub-02",
            "title": "Debugging nâng cao trong IDE: Conditional Breakpoints, Exception Breakpoints, Watch Expressions",
            "rawTitle": "Debugging nâng cao trong IDE: Conditional Breakpoints, Exception Breakpoints, Watch Expressions",
            "tags": []
          },
          {
            "id": "java-day-22-topic-03-sub-03",
            "title": "Thread dump và phân tích trạng thái luồng cơ bản",
            "rawTitle": "Thread dump và phân tích trạng thái luồng cơ bản",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-22-topic-04",
        "title": "Mini Project: Resilient Banking System",
        "subtopics": [
          {
            "id": "java-day-22-topic-04-sub-01",
            "title": "Thêm Custom Business Exceptions: `InsufficientFundsException`, `AccountNotFoundException`, `InvalidAmountException`",
            "rawTitle": "Thêm Custom Business Exceptions: `InsufficientFundsException`, `AccountNotFoundException`, `InvalidAmountException`",
            "tags": []
          },
          {
            "id": "java-day-22-topic-04-sub-02",
            "title": "Xử lý ngoại lệ có hệ thống và ghi log chi tiết cho từng giao dịch nạp/rút/chuyển khoản",
            "rawTitle": "Xử lý ngoại lệ có hệ thống và ghi log chi tiết cho từng giao dịch nạp/rút/chuyển khoản",
            "tags": []
          },
          {
            "id": "java-day-22-topic-04-sub-03",
            "title": "Áp dụng `try-with-resources` khi đọc/ghi file log giao dịch",
            "rawTitle": "Áp dụng `try-with-resources` khi đọc/ghi file log giao dịch",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 19
  },
  {
    "id": "java-day-23",
    "track": "java",
    "dayNumber": 23,
    "title": "Generics",
    "phaseId": "phase-5",
    "phaseTitle": "Phase 5: Exception Architecture, Logging & Generics",
    "description": "Generics: Type parameters, Generic classes/methods, Bounded type parameters, Type Erasure, and Bridge methods.",
    "topics": [
      {
        "id": "java-day-23-topic-01",
        "title": "Generic Motivation & Type Safety",
        "subtopics": [
          {
            "id": "java-day-23-topic-01-sub-01",
            "title": "Lập trình Generic (Generic Programming) là gì",
            "rawTitle": "Lập trình Generic (Generic Programming) là gì",
            "tags": []
          },
          {
            "id": "java-day-23-topic-01-sub-02",
            "title": "Vấn đề của code không có Generic trước Java 5: Sử dụng `Object` bừa bãi và lỗi `ClassCastException` khi runtime",
            "rawTitle": "Vấn đề của code không có Generic trước Java 5: Sử dụng `Object` bừa bãi và lỗi `ClassCastException` khi runtime",
            "tags": []
          },
          {
            "id": "java-day-23-topic-01-sub-03",
            "title": "Lợi ích của Generics: Kiểm tra kiểu tại compile-time (Compile-time Type Safety) và loại bỏ việc ép kiểu thủ công",
            "rawTitle": "Lợi ích của Generics: Kiểm tra kiểu tại compile-time (Compile-time Type Safety) và loại bỏ việc ép kiểu thủ công",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-23-topic-02",
        "title": "Generic Classes & Interfaces",
        "subtopics": [
          {
            "id": "java-day-23-topic-02-sub-01",
            "title": "Cú pháp khai báo Generic Class: `public class Box<T> { ... }`",
            "rawTitle": "Cú pháp khai báo Generic Class: `public class Box<T> { ... }`",
            "tags": []
          },
          {
            "id": "java-day-23-topic-02-sub-02",
            "title": "Quy ước đặt tên Type Parameter: `T` (Type), `E` (Element), `K` (Key), `V` (Value), `N` (Number), `S, U, V` (2nd, 3rd types)",
            "rawTitle": "Quy ước đặt tên Type Parameter: `T` (Type), `E` (Element), `K` (Key), `V` (Value), `N` (Number), `S, U, V` (2nd, 3rd types)",
            "tags": []
          },
          {
            "id": "java-day-23-topic-02-sub-03",
            "title": "Khởi tạo Generic Class với toán tử Diamond `<>` (Java 7+)",
            "rawTitle": "Khởi tạo Generic Class với toán tử Diamond `<>` (Java 7+)",
            "tags": []
          },
          {
            "id": "java-day-23-topic-02-sub-04",
            "title": "Generic Interface: Cú pháp và các cách class implement generic interface",
            "rawTitle": "Generic Interface: Cú pháp và các cách class implement generic interface",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-23-topic-03",
        "title": "Generic Methods & Bounded Types",
        "subtopics": [
          {
            "id": "java-day-23-topic-03-sub-01",
            "title": "Định nghĩa Generic Method độc lập với Generic Class: `public <T> T getFirst(T[] array)`",
            "rawTitle": "Định nghĩa Generic Method độc lập với Generic Class: `public <T> T getFirst(T[] array)`",
            "tags": []
          },
          {
            "id": "java-day-23-topic-03-sub-02",
            "title": "Type Inference trong Generic Methods",
            "rawTitle": "Type Inference trong Generic Methods",
            "tags": []
          },
          {
            "id": "java-day-23-topic-03-sub-03",
            "title": "Ràng buộc tham số kiểu (Bounded Type Parameters): Từ khóa `extends` (`<T extends Number>`)",
            "rawTitle": "Ràng buộc tham số kiểu (Bounded Type Parameters): Từ khóa `extends` (`<T extends Number>`)",
            "tags": []
          },
          {
            "id": "java-day-23-topic-03-sub-04",
            "title": "Nhiều ràng buộc kiểu (Multiple Bounds): `<T extends Comparable<T> & Serializable>` (Quy tắc class đứng trước interface)",
            "rawTitle": "Nhiều ràng buộc kiểu (Multiple Bounds): `<T extends Comparable<T> & Serializable>` (Quy tắc class đứng trước interface)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-23-topic-04",
        "title": "Generics Inheritance & Subtyping",
        "subtopics": [
          {
            "id": "java-day-23-topic-04-sub-01",
            "title": "Quan hệ kế thừa trong Generics: `Pair<Manager>` **KHÔNG PHẢI** là subclass của `Pair<Employee>` (Tính bất biến kiểu — Invariance)",
            "rawTitle": "Quan hệ kế thừa trong Generics: `Pair<Manager>` **KHÔNG PHẢI** là subclass của `Pair<Employee>` (Tính bất biến kiểu — Invariance)",
            "tags": []
          },
          {
            "id": "java-day-23-topic-04-sub-02",
            "title": "So sánh mảng (Covariant: `Employee[] = Manager[]` — không an toàn) vs Generics (Invariant — an toàn)",
            "rawTitle": "So sánh mảng (Covariant: `Employee[] = Manager[]` — không an toàn) vs Generics (Invariant — an toàn)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-23-topic-05",
        "title": "Type Erasure Mechanism",
        "subtopics": [
          {
            "id": "java-day-23-topic-05-sub-01",
            "title": "Khái niệm Xóa kiểu (Type Erasure) của trình biên dịch Java",
            "rawTitle": "Khái niệm Xóa kiểu (Type Erasure) của trình biên dịch Java",
            "tags": []
          },
          {
            "id": "java-day-23-topic-05-sub-02",
            "title": "Raw Types là gì (`List` raw type vs `List<String>`)",
            "rawTitle": "Raw Types là gì (`List` raw type vs `List<String>`)",
            "tags": []
          },
          {
            "id": "java-day-23-topic-05-sub-03",
            "title": "Cách compiler thay thế Type Parameter bằng Raw Bound (`Object` hoặc bound đầu tiên)",
            "rawTitle": "Cách compiler thay thế Type Parameter bằng Raw Bound (`Object` hoặc bound đầu tiên)",
            "tags": []
          },
          {
            "id": "java-day-23-topic-05-sub-04",
            "title": "Tự động sinh mã ép kiểu (Bridge Methods)",
            "rawTitle": "Tự động sinh mã ép kiểu (Bridge Methods)",
            "tags": []
          },
          {
            "id": "java-day-23-topic-05-sub-05",
            "title": "Hậu quả của Type Erasure: Mất thông tin kiểu generic khi chạy ở runtime",
            "rawTitle": "Hậu quả của Type Erasure: Mất thông tin kiểu generic khi chạy ở runtime",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 18
  },
  {
    "id": "java-day-24",
    "track": "java",
    "dayNumber": 24,
    "title": "Wildcards & Generic Restrictions",
    "phaseId": "phase-5",
    "phaseTitle": "Phase 5: Exception Architecture, Logging & Generics",
    "description": "Wildcards (? extends / ? super), PECS principle, Generic restrictions, and reflection with Generics.",
    "topics": [
      {
        "id": "java-day-24-topic-01",
        "title": "Wildcards (?) Fundamentals",
        "subtopics": [
          {
            "id": "java-day-24-topic-01-sub-01",
            "title": "Ký tự đại diện Wildcard (`?`) là gì và tại sao cần Wildcard",
            "rawTitle": "Ký tự đại diện Wildcard (`?`) là gì và tại sao cần Wildcard",
            "tags": []
          },
          {
            "id": "java-day-24-topic-01-sub-02",
            "title": "Unbounded Wildcard: `<?>` (Ví dụ `List<?>`)",
            "rawTitle": "Unbounded Wildcard: `<?>` (Ví dụ `List<?>`)",
            "tags": []
          },
          {
            "id": "java-day-24-topic-01-sub-03",
            "title": "Giới hạn của Unbounded Wildcard: Chỉ đọc được dưới dạng `Object`, không thêm mới được phần tử (trừ `null`)",
            "rawTitle": "Giới hạn của Unbounded Wildcard: Chỉ đọc được dưới dạng `Object`, không thêm mới được phần tử (trừ `null`)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-24-topic-02",
        "title": "Bounded Wildcards & PECS Principle",
        "subtopics": [
          {
            "id": "java-day-24-topic-02-sub-01",
            "title": "Upper Bounded Wildcard: `<? extends T>` (Hiệp biến — Covariance)",
            "rawTitle": "Upper Bounded Wildcard: `<? extends T>` (Hiệp biến — Covariance)",
            "tags": []
          },
          {
            "id": "java-day-24-topic-02-sub-02",
            "title": "Lower Bounded Wildcard: `<? super T>` (Nghịch biến — Contravariance)",
            "rawTitle": "Lower Bounded Wildcard: `<? super T>` (Nghịch biến — Contravariance)",
            "tags": []
          },
          {
            "id": "java-day-24-topic-02-sub-03",
            "title": "Nguyên lý vàng **PECS** (Producer Extends, Consumer Super):",
            "rawTitle": "Nguyên lý vàng **PECS** (Producer Extends, Consumer Super):",
            "tags": []
          },
          {
            "id": "java-day-24-topic-02-sub-04",
            "title": "Phân tích phương thức chuẩn: `Collections.copy(List<? super T> dest, List<? extends T> src)`",
            "rawTitle": "Phân tích phương thức chuẩn: `Collections.copy(List<? super T> dest, List<? extends T> src)`",
            "tags": []
          },
          {
            "id": "java-day-24-topic-02-sub-05",
            "title": "Wildcard Capture và kỹ thuật viết Helper Method giải quyết lỗi capture",
            "rawTitle": "Wildcard Capture và kỹ thuật viết Helper Method giải quyết lỗi capture",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-24-topic-03",
        "title": "Restrictions and Limitations of Generics",
        "subtopics": [
          {
            "id": "java-day-24-topic-03-sub-01",
            "title": "Giới hạn 1: Không thể dùng kiểu nguyên thủy làm type argument (`List<int>` là sai, phải dùng `List<Integer>`)",
            "rawTitle": "Giới hạn 1: Không thể dùng kiểu nguyên thủy làm type argument (`List<int>` là sai, phải dùng `List<Integer>`)",
            "tags": []
          },
          {
            "id": "java-day-24-topic-03-sub-02",
            "title": "Giới hạn 2: Không thể kiểm tra kiểu runtime với `instanceof` trên generic type (`if (a instanceof List<String>)` là sai)",
            "rawTitle": "Giới hạn 2: Không thể kiểm tra kiểu runtime với `instanceof` trên generic type (`if (a instanceof List<String>)` là sai)",
            "tags": []
          },
          {
            "id": "java-day-24-topic-03-sub-03",
            "title": "Giới hạn 3: Không thể tạo mảng kiểu generic (`new T[]` hoặc `new List<String>[10]` là sai)",
            "rawTitle": "Giới hạn 3: Không thể tạo mảng kiểu generic (`new T[]` hoặc `new List<String>[10]` là sai)",
            "tags": []
          },
          {
            "id": "java-day-24-topic-03-sub-04",
            "title": "Giới hạn 4: Không thể khởi tạo trực tiếp instance của type parameter (`new T()` là sai)",
            "rawTitle": "Giới hạn 4: Không thể khởi tạo trực tiếp instance của type parameter (`new T()` là sai)",
            "tags": []
          },
          {
            "id": "java-day-24-topic-03-sub-05",
            "title": "Giới hạn 5: Không thể dùng type parameter trong static context (static field/method của generic class)",
            "rawTitle": "Giới hạn 5: Không thể dùng type parameter trong static context (static field/method của generic class)",
            "tags": []
          },
          {
            "id": "java-day-24-topic-03-sub-06",
            "title": "Giới hạn 6: Không thể catch hoặc throw instance của generic class kế thừa `Throwable`",
            "rawTitle": "Giới hạn 6: Không thể catch hoặc throw instance của generic class kế thừa `Throwable`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-24-topic-04",
        "title": "Generics & Reflection",
        "subtopics": [
          {
            "id": "java-day-24-topic-04-sub-01",
            "title": "Đọc thông tin Generic Type qua Reflection (`ParameterizedType`, `getGenericSuperclass()`)",
            "rawTitle": "Đọc thông tin Generic Type qua Reflection (`ParameterizedType`, `getGenericSuperclass()`)",
            "tags": []
          },
          {
            "id": "java-day-24-topic-04-sub-02",
            "title": "Khái niệm Type Tokens và Super Type Tokens trong các thư viện (Jackson, Gson, Spring)",
            "rawTitle": "Khái niệm Type Tokens và Super Type Tokens trong các thư viện (Jackson, Gson, Spring)",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 16
  },
  {
    "id": "java-day-25",
    "track": "java",
    "dayNumber": 25,
    "title": "Collections Framework",
    "phaseId": "phase-6",
    "phaseTitle": "Phase 6: Java Collections Framework & Algorithms",
    "description": "Java Collections Framework architecture: Collection, List, Set, Queue, Map, Iterator, and Fail-Fast mechanism.",
    "topics": [
      {
        "id": "java-day-25-topic-01",
        "title": "Collections Framework Architecture",
        "subtopics": [
          {
            "id": "java-day-25-topic-01-sub-01",
            "title": "Tổng quan kiến trúc Java Collections Framework (JCF)",
            "rawTitle": "Tổng quan kiến trúc Java Collections Framework (JCF)",
            "tags": []
          },
          {
            "id": "java-day-25-topic-01-sub-02",
            "title": "Phân tách rõ ràng giữa Interface, Implementation và Algorithm",
            "rawTitle": "Phân tách rõ ràng giữa Interface, Implementation và Algorithm",
            "tags": []
          },
          {
            "id": "java-day-25-topic-01-sub-03",
            "title": "Cây phả hệ phân cấp chính:",
            "rawTitle": "Cây phả hệ phân cấp chính:",
            "tags": []
          },
          {
            "id": "java-day-25-topic-01-sub-04",
            "title": "Interface `java.lang.Iterable<T>` và phương thức `iterator()`",
            "rawTitle": "Interface `java.lang.Iterable<T>` và phương thức `iterator()`",
            "tags": []
          },
          {
            "id": "java-day-25-topic-01-sub-05",
            "title": "Interface `java.util.Collection<E>` và các phương thức cốt lõi: `add()`, `addAll()`, `remove()`, `removeAll()`, `retainAll()`, `clear()`, `contains()`, `containsAll()`, `size()`, `isEmpty()`, `toArray()`",
            "rawTitle": "Interface `java.util.Collection<E>` và các phương thức cốt lõi: `add()`, `addAll()`, `remove()`, `removeAll()`, `retainAll()`, `clear()`, `contains()`, `containsAll()`, `size()`, `isEmpty()`, `toArray()`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-25-topic-02",
        "title": "Iterator & Iteration Mechanics",
        "subtopics": [
          {
            "id": "java-day-25-topic-02-sub-01",
            "title": "Interface `java.util.Iterator<E>`: `hasNext()`, `next()`, `remove()`",
            "rawTitle": "Interface `java.util.Iterator<E>`: `hasNext()`, `next()`, `remove()`",
            "tags": []
          },
          {
            "id": "java-day-25-topic-02-sub-02",
            "title": "Cơ chế hoạt động của con trỏ Iterator",
            "rawTitle": "Cơ chế hoạt động của con trỏ Iterator",
            "tags": []
          },
          {
            "id": "java-day-25-topic-02-sub-03",
            "title": "Xóa phần tử an toàn trong khi duyệt với `iterator.remove()`",
            "rawTitle": "Xóa phần tử an toàn trong khi duyệt với `iterator.remove()`",
            "tags": []
          },
          {
            "id": "java-day-25-topic-02-sub-04",
            "title": "Lỗi phổ biến `ConcurrentModificationException` và cơ chế **Fail-Fast**",
            "rawTitle": "Lỗi phổ biến `ConcurrentModificationException` và cơ chế **Fail-Fast**",
            "tags": []
          },
          {
            "id": "java-day-25-topic-02-sub-05",
            "title": "Biến đếm `modCount` bên trong collection",
            "rawTitle": "Biến đếm `modCount` bên trong collection",
            "tags": []
          },
          {
            "id": "java-day-25-topic-02-sub-06",
            "title": "Interface `java.util.ListIterator<E>`: Duyệt 2 chiều (`hasPrevious()`, `previous()`), `add()`, `set()`, `nextIndex()`",
            "rawTitle": "Interface `java.util.ListIterator<E>`: Duyệt 2 chiều (`hasPrevious()`, `previous()`), `add()`, `set()`, `nextIndex()`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-25-topic-03",
        "title": "Interface-Driven Programming",
        "subtopics": [
          {
            "id": "java-day-25-topic-03-sub-01",
            "title": "Lập trình theo Interface (Program to Interface, not Implementation): `List<String> list = new ArrayList<>();`",
            "rawTitle": "Lập trình theo Interface (Program to Interface, not Implementation): `List<String> list = new ArrayList<>();`",
            "tags": []
          },
          {
            "id": "java-day-25-topic-03-sub-02",
            "title": "Lợi ích của việc che giấu cấu trúc dữ liệu cụ thể phía sau Interface chuẩn",
            "rawTitle": "Lợi ích của việc che giấu cấu trúc dữ liệu cụ thể phía sau Interface chuẩn",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 13
  },
  {
    "id": "java-day-26",
    "track": "java",
    "dayNumber": 26,
    "title": "List & Set",
    "phaseId": "phase-6",
    "phaseTitle": "Phase 6: Java Collections Framework & Algorithms",
    "description": "List implementations (ArrayList vs LinkedList) and Set implementations (HashSet, LinkedHashSet, TreeSet).",
    "topics": [
      {
        "id": "java-day-26-topic-01",
        "title": "List Interface & Implementations",
        "subtopics": [
          {
            "id": "java-day-26-topic-01-sub-01",
            "title": "Đặc tính của `java.util.List`: Có thứ tự (Ordered / Sequence), cho phép trùng lặp (Duplicates), truy cập theo index",
            "rawTitle": "Đặc tính của `java.util.List`: Có thứ tự (Ordered / Sequence), cho phép trùng lặp (Duplicates), truy cập theo index",
            "tags": []
          },
          {
            "id": "java-day-26-topic-01-sub-02",
            "title": "List API: `get(index)`, `set(index, element)`, `add(index, element)`, `remove(index)`, `indexOf()`",
            "rawTitle": "List API: `get(index)`, `set(index, element)`, `add(index, element)`, `remove(index)`, `indexOf()`",
            "tags": []
          },
          {
            "id": "java-day-26-topic-01-sub-03",
            "title": "Lớp `java.util.ArrayList`: Cấu trúc mảng động (`Object[] elementData`), default capacity (10), cơ chế mở rộng (Growth policy 1.5x)",
            "rawTitle": "Lớp `java.util.ArrayList`: Cấu trúc mảng động (`Object[] elementData`), default capacity (10), cơ chế mở rộng (Growth policy 1.5x)",
            "tags": []
          },
          {
            "id": "java-day-26-topic-01-sub-04",
            "title": "Lớp `java.util.LinkedList`: Cấu trúc danh sách liên kết đôi (Doubly-linked list `Node<E>`: prev, item, next)",
            "rawTitle": "Lớp `java.util.LinkedList`: Cấu trúc danh sách liên kết đôi (Doubly-linked list `Node<E>`: prev, item, next)",
            "tags": []
          },
          {
            "id": "java-day-26-topic-01-sub-05",
            "title": "So sánh toàn diện `ArrayList` vs `LinkedList`:",
            "rawTitle": "So sánh toàn diện `ArrayList` vs `LinkedList`:",
            "tags": []
          },
          {
            "id": "java-day-26-topic-01-sub-06",
            "title": "Tại sao trong thực tế Backend `ArrayList` hầu như luôn là lựa chọn vượt trội hơn `LinkedList`",
            "rawTitle": "Tại sao trong thực tế Backend `ArrayList` hầu như luôn là lựa chọn vượt trội hơn `LinkedList`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-26-topic-02",
        "title": "Set Interface & Implementations",
        "subtopics": [
          {
            "id": "java-day-26-topic-02-sub-01",
            "title": "Đặc tính của `java.util.Set`: Tập hợp không chứa phần tử trùng lặp (No duplicate elements)",
            "rawTitle": "Đặc tính của `java.util.Set`: Tập hợp không chứa phần tử trùng lặp (No duplicate elements)",
            "tags": []
          },
          {
            "id": "java-day-26-topic-02-sub-02",
            "title": "Lớp `java.util.HashSet`: Cấu trúc bên trong thực chất bọc một `HashMap`, không đảm bảo thứ tự",
            "rawTitle": "Lớp `java.util.HashSet`: Cấu trúc bên trong thực chất bọc một `HashMap`, không đảm bảo thứ tự",
            "tags": []
          },
          {
            "id": "java-day-26-topic-02-sub-03",
            "title": "Điều kiện bắt buộc để `HashSet` hoạt động chính xác: Đối tượng phần tử phải override `equals()` và `hashCode()`",
            "rawTitle": "Điều kiện bắt buộc để `HashSet` hoạt động chính xác: Đối tượng phần tử phải override `equals()` và `hashCode()`",
            "tags": []
          },
          {
            "id": "java-day-26-topic-02-sub-04",
            "title": "Lớp `java.util.LinkedHashSet`: Kết hợp Hash table và Doubly-linked list để duy trì thứ tự chèn (Insertion-order)",
            "rawTitle": "Lớp `java.util.LinkedHashSet`: Kết hợp Hash table và Doubly-linked list để duy trì thứ tự chèn (Insertion-order)",
            "tags": []
          },
          {
            "id": "java-day-26-topic-02-sub-05",
            "title": "Interface `java.util.SortedSet` và `java.util.NavigableSet`",
            "rawTitle": "Interface `java.util.SortedSet` và `java.util.NavigableSet`",
            "tags": []
          },
          {
            "id": "java-day-26-topic-02-sub-06",
            "title": "Lớp `java.util.TreeSet`: Cấu trúc cây đỏ-đen (Red-Black Tree), tự động sắp xếp phần tử",
            "rawTitle": "Lớp `java.util.TreeSet`: Cấu trúc cây đỏ-đen (Red-Black Tree), tự động sắp xếp phần tử",
            "tags": []
          },
          {
            "id": "java-day-26-topic-02-sub-07",
            "title": "Yêu cầu của phần tử trong `TreeSet`: Bắt buộc implement `Comparable` hoặc cung cấp `Comparator`",
            "rawTitle": "Yêu cầu của phần tử trong `TreeSet`: Bắt buộc implement `Comparable` hoặc cung cấp `Comparator`",
            "tags": []
          },
          {
            "id": "java-day-26-topic-02-sub-08",
            "title": "NavigableSet API trong `TreeSet`: `first()`, `last()`, `headSet()`, `tailSet()`, `subSet()`, `higher()`, `lower()`, `ceiling()`, `floor()`",
            "rawTitle": "NavigableSet API trong `TreeSet`: `first()`, `last()`, `headSet()`, `tailSet()`, `subSet()`, `higher()`, `lower()`, `ceiling()`, `floor()`",
            "tags": []
          },
          {
            "id": "java-day-26-topic-02-sub-09",
            "title": "Lớp `java.util.EnumSet`: Cài đặt chuyên biệt cho Enum bằng Bit Vector (cực nhanh và tối ưu bộ nhớ)",
            "rawTitle": "Lớp `java.util.EnumSet`: Cài đặt chuyên biệt cho Enum bằng Bit Vector (cực nhanh và tối ưu bộ nhớ)",
            "tags": []
          },
          {
            "id": "java-day-26-topic-02-sub-10",
            "title": "Bảng so sánh hiệu năng và kịch bản sử dụng: `HashSet` ($O(1)$) vs `LinkedHashSet` ($O(1)$) vs `TreeSet` ($O(\\log n)$)",
            "rawTitle": "Bảng so sánh hiệu năng và kịch bản sử dụng: `HashSet` ($O(1)$) vs `LinkedHashSet` ($O(1)$) vs `TreeSet` ($O(\\log n)$)",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 16
  },
  {
    "id": "java-day-27",
    "track": "java",
    "dayNumber": 27,
    "title": "Map, Queue & Deque",
    "phaseId": "phase-6",
    "phaseTitle": "Phase 6: Java Collections Framework & Algorithms",
    "description": "Map implementations (HashMap internal mechanics, Hashing, Collision, Treeify, TreeMap, LinkedHashMap) and Queue/Deque.",
    "topics": [
      {
        "id": "java-day-27-topic-01",
        "title": "HashMap In-Depth",
        "subtopics": [
          {
            "id": "java-day-27-topic-01-sub-01",
            "title": "Khái niệm cấu trúc dữ liệu Map (Key-Value Pair)",
            "rawTitle": "Khái niệm cấu trúc dữ liệu Map (Key-Value Pair)",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-02",
            "title": "Cấu trúc bên trong của `java.util.HashMap`: Mảng các Node buckets (`Node<K,V>[] table`)",
            "rawTitle": "Cấu trúc bên trong của `java.util.HashMap`: Mảng các Node buckets (`Node<K,V>[] table`)",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-03",
            "title": "Khái niệm Hashing và hàm băm: `hash(key) = (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16)`",
            "rawTitle": "Khái niệm Hashing và hàm băm: `hash(key) = (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16)`",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-04",
            "title": "Tính toán chỉ số bucket: `index = (n - 1) & hash`",
            "rawTitle": "Tính toán chỉ số bucket: `index = (n - 1) & hash`",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-05",
            "title": "Hiện tượng đụng độ mã băm (Hash Collision) và phương pháp Separate Chaining",
            "rawTitle": "Hiện tượng đụng độ mã băm (Hash Collision) và phương pháp Separate Chaining",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-06",
            "title": "Cấu trúc Node khi đụng độ: Singly Linked List chuyển đổi thành Red-Black Tree (`TreeNode`) khi vượt ngưỡng `TREEIFY_THRESHOLD = 8`",
            "rawTitle": "Cấu trúc Node khi đụng độ: Singly Linked List chuyển đổi thành Red-Black Tree (`TreeNode`) khi vượt ngưỡng `TREEIFY_THRESHOLD = 8`",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-07",
            "title": "Các tham số quan trọng: Initial Capacity (mặc định 16), Load Factor (mặc định 0.75), Threshold",
            "rawTitle": "Các tham số quan trọng: Initial Capacity (mặc định 16), Load Factor (mặc định 0.75), Threshold",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-08",
            "title": "Quá trình Resize / Rehash khi số lượng phần tử vượt quá `capacity * loadFactor`",
            "rawTitle": "Quá trình Resize / Rehash khi số lượng phần tử vượt quá `capacity * loadFactor`",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-09",
            "title": "HashMap Core API: `put()`, `get()`, `getOrDefault()`, `remove()`, `containsKey()`, `containsValue()`, `putIfAbsent()`",
            "rawTitle": "HashMap Core API: `put()`, `get()`, `getOrDefault()`, `remove()`, `containsKey()`, `containsValue()`, `putIfAbsent()`",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-10",
            "title": "Duyệt HashMap đúng cách: `keySet()`, `values()`, `entrySet()` (`Map.Entry<K, V>`)",
            "rawTitle": "Duyệt HashMap đúng cách: `keySet()`, `values()`, `entrySet()` (`Map.Entry<K, V>`)",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-11",
            "title": "Java 8 Map Enhancement: `forEach()`, `compute()`, `computeIfAbsent()`, `computeIfPresent()`, `merge()`, `replaceAll()`",
            "rawTitle": "Java 8 Map Enhancement: `forEach()`, `compute()`, `computeIfAbsent()`, `computeIfPresent()`, `merge()`, `replaceAll()`",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-12",
            "title": "Tại sao Key của HashMap nên là đối tượng bất biến (Immutable object như `String`, `Integer`, `Record`)",
            "rawTitle": "Tại sao Key của HashMap nên là đối tượng bất biến (Immutable object như `String`, `Integer`, `Record`)",
            "tags": []
          },
          {
            "id": "java-day-27-topic-01-sub-13",
            "title": "Hiệu năng của HashMap: $O(1)$ lý tưởng, $O(\\log n)$ trường hợp xấu nhất",
            "rawTitle": "Hiệu năng của HashMap: $O(1)$ lý tưởng, $O(\\log n)$ trường hợp xấu nhất",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-27-topic-02",
        "title": "Specialized Map Implementations",
        "subtopics": [
          {
            "id": "java-day-27-topic-02-sub-01",
            "title": "Lớp `java.util.LinkedHashMap`: Duy trì thứ tự chèn (Insertion-order) hoặc thứ tự truy cập (Access-order)",
            "rawTitle": "Lớp `java.util.LinkedHashMap`: Duy trì thứ tự chèn (Insertion-order) hoặc thứ tự truy cập (Access-order)",
            "tags": []
          },
          {
            "id": "java-day-27-topic-02-sub-02",
            "title": "Ứng dụng `LinkedHashMap` xây dựng bộ nhớ đệm LRU Cache (`removeEldestEntry()`)",
            "rawTitle": "Ứng dụng `LinkedHashMap` xây dựng bộ nhớ đệm LRU Cache (`removeEldestEntry()`)",
            "tags": []
          },
          {
            "id": "java-day-27-topic-02-sub-03",
            "title": "Lớp `java.util.TreeMap`: Cài đặt `NavigableMap` bằng Red-Black Tree, sắp xếp theo Key",
            "rawTitle": "Lớp `java.util.TreeMap`: Cài đặt `NavigableMap` bằng Red-Black Tree, sắp xếp theo Key",
            "tags": []
          },
          {
            "id": "java-day-27-topic-02-sub-04",
            "title": "TreeMap API: `firstKey()`, `lastKey()`, `headMap()`, `tailMap()`, `subMap()`, `ceilingKey()`, `floorKey()`",
            "rawTitle": "TreeMap API: `firstKey()`, `lastKey()`, `headMap()`, `tailMap()`, `subMap()`, `ceilingKey()`, `floorKey()`",
            "tags": []
          },
          {
            "id": "java-day-27-topic-02-sub-05",
            "title": "Lớp `java.util.WeakHashMap`: Sử dụng WeakReference cho Key, tự động dọn dẹp khi GC thu gom",
            "rawTitle": "Lớp `java.util.WeakHashMap`: Sử dụng WeakReference cho Key, tự động dọn dẹp khi GC thu gom",
            "tags": []
          },
          {
            "id": "java-day-27-topic-02-sub-06",
            "title": "Lớp `java.util.EnumMap`: Dùng mảng nội bộ cho Enum key (cực nhanh, không va chạm hash)",
            "rawTitle": "Lớp `java.util.EnumMap`: Dùng mảng nội bộ cho Enum key (cực nhanh, không va chạm hash)",
            "tags": []
          },
          {
            "id": "java-day-27-topic-02-sub-07",
            "title": "Lớp `java.util.IdentityHashMap`: So sánh Key bằng tham chiếu `==` thay vì `equals()`",
            "rawTitle": "Lớp `java.util.IdentityHashMap`: So sánh Key bằng tham chiếu `==` thay vì `equals()`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-27-topic-03",
        "title": "Queue & Deque",
        "subtopics": [
          {
            "id": "java-day-27-topic-03-sub-01",
            "title": "Khái niệm hàng đợi Queue (FIFO — First In, First Out)",
            "rawTitle": "Khái niệm hàng đợi Queue (FIFO — First In, First Out)",
            "tags": []
          },
          {
            "id": "java-day-27-topic-03-sub-02",
            "title": "Interface `java.util.Queue`:",
            "rawTitle": "Interface `java.util.Queue`:",
            "tags": []
          },
          {
            "id": "java-day-27-topic-03-sub-03",
            "title": "Interface `java.util.Deque` (Double-Ended Queue — Hàng đợi hai đầu)",
            "rawTitle": "Interface `java.util.Deque` (Double-Ended Queue — Hàng đợi hai đầu)",
            "tags": []
          },
          {
            "id": "java-day-27-topic-03-sub-04",
            "title": "Lớp `java.util.ArrayDeque`: Cấu trúc mảng vòng tròn (Resizable array), hiệu năng vượt trội `Stack` và `LinkedList`",
            "rawTitle": "Lớp `java.util.ArrayDeque`: Cấu trúc mảng vòng tròn (Resizable array), hiệu năng vượt trội `Stack` và `LinkedList`",
            "tags": []
          },
          {
            "id": "java-day-27-topic-03-sub-05",
            "title": "Sử dụng `ArrayDeque` làm Stack (LIFO: `push()`, `pop()`) thay thế class cổ `java.util.Stack`",
            "rawTitle": "Sử dụng `ArrayDeque` làm Stack (LIFO: `push()`, `pop()`) thay thế class cổ `java.util.Stack`",
            "tags": []
          },
          {
            "id": "java-day-27-topic-03-sub-06",
            "title": "Lớp `java.util.PriorityQueue`: Cấu trúc Binary Heap (Min-heap/Max-heap), phần tử lấy ra theo độ ưu tiên",
            "rawTitle": "Lớp `java.util.PriorityQueue`: Cấu trúc Binary Heap (Min-heap/Max-heap), phần tử lấy ra theo độ ưu tiên",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 26
  },
  {
    "id": "java-day-28",
    "track": "java",
    "dayNumber": 28,
    "title": "Collections Algorithms & Immutable Collections",
    "phaseId": "phase-6",
    "phaseTitle": "Phase 6: Java Collections Framework & Algorithms",
    "description": "Collections utility algorithms, unmodifiable vs immutable collections (List.of), and Collection Views.",
    "topics": [
      {
        "id": "java-day-28-topic-01",
        "title": "Modern Collection Factory Methods",
        "subtopics": [
          {
            "id": "java-day-28-topic-01-sub-01",
            "title": "Factory methods tạo collection bất biến ngắn gọn (Java 9+): `List.of()`, `Set.of()`, `Map.of()`, `Map.ofEntries()`",
            "rawTitle": "Factory methods tạo collection bất biến ngắn gọn (Java 9+): `List.of()`, `Set.of()`, `Map.of()`, `Map.ofEntries()`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-01-sub-02",
            "title": "Đặc tính của collections tạo bởi `of()`: Thực sự bất biến (Immutable), không cho phép phần tử `null`, tiết kiệm bộ nhớ",
            "rawTitle": "Đặc tính của collections tạo bởi `of()`: Thực sự bất biến (Immutable), không cho phép phần tử `null`, tiết kiệm bộ nhớ",
            "tags": []
          },
          {
            "id": "java-day-28-topic-01-sub-03",
            "title": "`List.copyOf()`, `Set.copyOf()`, `Map.copyOf()` (Java 10+)",
            "rawTitle": "`List.copyOf()`, `Set.copyOf()`, `Map.copyOf()` (Java 10+)",
            "tags": []
          },
          {
            "id": "java-day-28-topic-01-sub-04",
            "title": "Phân biệt: Unmodifiable Collection (View bọc ngoài) vs Immutable Collection (Bất biến thực sự)",
            "rawTitle": "Phân biệt: Unmodifiable Collection (View bọc ngoài) vs Immutable Collection (Bất biến thực sự)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-28-topic-02",
        "title": "Collection Views & Subranges",
        "subtopics": [
          {
            "id": "java-day-28-topic-02-sub-01",
            "title": "Khái niệm View trong Collections (Không copy dữ liệu, chỉ trỏ vào backing collection)",
            "rawTitle": "Khái niệm View trong Collections (Không copy dữ liệu, chỉ trỏ vào backing collection)",
            "tags": []
          },
          {
            "id": "java-day-28-topic-02-sub-02",
            "title": "Sublist View: `list.subList(fromIndex, toIndex)` và các lưu ý khi thay đổi collection gốc",
            "rawTitle": "Sublist View: `list.subList(fromIndex, toIndex)` và các lưu ý khi thay đổi collection gốc",
            "tags": []
          },
          {
            "id": "java-day-28-topic-02-sub-03",
            "title": "Subrange Views trong NavigableSet/NavigableMap: `subSet()`, `subMap()`",
            "rawTitle": "Subrange Views trong NavigableSet/NavigableMap: `subSet()`, `subMap()`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-02-sub-04",
            "title": "`Collections.unmodifiableList()`, `Collections.unmodifiableSet()`, `Collections.unmodifiableMap()`",
            "rawTitle": "`Collections.unmodifiableList()`, `Collections.unmodifiableSet()`, `Collections.unmodifiableMap()`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-02-sub-05",
            "title": "`Collections.synchronizedList()`, `Collections.synchronizedMap()` (Wrapper đồng bộ cơ bản)",
            "rawTitle": "`Collections.synchronizedList()`, `Collections.synchronizedMap()` (Wrapper đồng bộ cơ bản)",
            "tags": []
          },
          {
            "id": "java-day-28-topic-02-sub-06",
            "title": "`Collections.emptyList()`, `Collections.singletonList()`",
            "rawTitle": "`Collections.emptyList()`, `Collections.singletonList()`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-28-topic-03",
        "title": "java.util.Collections Utility Algorithms",
        "subtopics": [
          {
            "id": "java-day-28-topic-03-sub-01",
            "title": "Sắp xếp: `Collections.sort(list)` và `Collections.sort(list, comparator)`",
            "rawTitle": "Sắp xếp: `Collections.sort(list)` và `Collections.sort(list, comparator)`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-03-sub-02",
            "title": "Tìm kiếm nhị phân: `Collections.binarySearch(list, key)`",
            "rawTitle": "Tìm kiếm nhị phân: `Collections.binarySearch(list, key)`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-03-sub-03",
            "title": "Xáo trộn ngẫu nhiên: `Collections.shuffle(list)`",
            "rawTitle": "Xáo trộn ngẫu nhiên: `Collections.shuffle(list)`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-03-sub-04",
            "title": "Đảo ngược và xoay: `Collections.reverse(list)`, `Collections.rotate(list, distance)`",
            "rawTitle": "Đảo ngược và xoay: `Collections.reverse(list)`, `Collections.rotate(list, distance)`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-03-sub-05",
            "title": "Tìm Min/Max: `Collections.min()`, `Collections.max()`",
            "rawTitle": "Tìm Min/Max: `Collections.min()`, `Collections.max()`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-03-sub-06",
            "title": "Tần suất và không giao nhau: `Collections.frequency()`, `Collections.disjoint()`",
            "rawTitle": "Tần suất và không giao nhau: `Collections.frequency()`, `Collections.disjoint()`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-03-sub-07",
            "title": "Chuyển đổi giữa Collection và Array: `collection.toArray()`, `collection.toArray(T[] a)`, `Arrays.asList(array)`",
            "rawTitle": "Chuyển đổi giữa Collection và Array: `collection.toArray()`, `collection.toArray(T[] a)`, `Arrays.asList(array)`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-03-sub-08",
            "title": "Cạm bẫy của `Arrays.asList()` (Fixed-size list, backed by array)",
            "rawTitle": "Cạm bẫy của `Arrays.asList()` (Fixed-size list, backed by array)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-28-topic-04",
        "title": "Mini Project: Employee Management System",
        "subtopics": [
          {
            "id": "java-day-28-topic-04-sub-01",
            "title": "Thiết kế mô hình dữ liệu: `Employee` (id, name, department, salary, hireDate)",
            "rawTitle": "Thiết kế mô hình dữ liệu: `Employee` (id, name, department, salary, hireDate)",
            "tags": []
          },
          {
            "id": "java-day-28-topic-04-sub-02",
            "title": "Quản lý danh sách bằng `List<Employee>` và lọc trùng lặp bằng `Set<Employee>`",
            "rawTitle": "Quản lý danh sách bằng `List<Employee>` và lọc trùng lặp bằng `Set<Employee>`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-04-sub-03",
            "title": "Nhóm nhân viên theo phòng ban bằng `Map<Department, List<Employee>>`",
            "rawTitle": "Nhóm nhân viên theo phòng ban bằng `Map<Department, List<Employee>>`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-04-sub-04",
            "title": "Sắp xếp đa tiêu chí với `Comparator.comparing(...).thenComparing(...)`",
            "rawTitle": "Sắp xếp đa tiêu chí với `Comparator.comparing(...).thenComparing(...)`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-04-sub-05",
            "title": "Tìm kiếm nhân viên nhanh theo ID với `HashMap` và theo thang lương với `TreeMap`",
            "rawTitle": "Tìm kiếm nhân viên nhanh theo ID với `HashMap` và theo thang lương với `TreeMap`",
            "tags": []
          },
          {
            "id": "java-day-28-topic-04-sub-06",
            "title": "Xử lý ngoại lệ và xuất báo cáo thống kê hoàn chỉnh",
            "rawTitle": "Xử lý ngoại lệ và xuất báo cáo thống kê hoàn chỉnh",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 24
  },
  {
    "id": "java-day-29",
    "track": "java",
    "dayNumber": 29,
    "title": "Concurrency Fundamentals",
    "phaseId": "phase-7",
    "phaseTitle": "Phase 7: Java Concurrency & Modern Multithreading",
    "description": "Concurrency fundamentals: Thread lifecycle, JMM, volatile, synchronized, ReentrantLock, and Atomic CAS.",
    "topics": [
      {
        "id": "java-day-29-topic-01",
        "title": "Process, Thread & Thread Lifecycle",
        "subtopics": [
          {
            "id": "java-day-29-topic-01-sub-01",
            "title": "Khái niệm Tiến trình (Process) vs Luồng (Thread) trong hệ điều hành",
            "rawTitle": "Khái niệm Tiến trình (Process) vs Luồng (Thread) trong hệ điều hành",
            "tags": []
          },
          {
            "id": "java-day-29-topic-01-sub-02",
            "title": "Khái niệm Đa luồng (Multithreading) và Bộ nhớ chia sẻ (Shared Memory)",
            "rawTitle": "Khái niệm Đa luồng (Multithreading) và Bộ nhớ chia sẻ (Shared Memory)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-01-sub-03",
            "title": "Cách 1: Kế thừa lớp `java.lang.Thread`",
            "rawTitle": "Cách 1: Kế thừa lớp `java.lang.Thread`",
            "tags": []
          },
          {
            "id": "java-day-29-topic-01-sub-04",
            "title": "Cách 2: Thực thi interface `java.lang.Runnable` (Tách rời task và thread execution)",
            "rawTitle": "Cách 2: Thực thi interface `java.lang.Runnable` (Tách rời task và thread execution)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-01-sub-05",
            "title": "Phân biệt `thread.start()` (tạo luồng OS mới) vs `thread.run()` (chạy tuần tự trên luồng hiện tại)",
            "rawTitle": "Phân biệt `thread.start()` (tạo luồng OS mới) vs `thread.run()` (chạy tuần tự trên luồng hiện tại)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-01-sub-06",
            "title": "6 trạng thái của Thread trong Java (`Thread.State` enum):",
            "rawTitle": "6 trạng thái của Thread trong Java (`Thread.State` enum):",
            "tags": []
          },
          {
            "id": "java-day-29-topic-01-sub-07",
            "title": "Điều khiển luồng: `Thread.sleep()`, `Thread.yield()`, `thread.join()`",
            "rawTitle": "Điều khiển luồng: `Thread.sleep()`, `Thread.yield()`, `thread.join()`",
            "tags": []
          },
          {
            "id": "java-day-29-topic-01-sub-08",
            "title": "Cơ chế ngắt luồng (Thread Interruption): `thread.interrupt()`, `Thread.interrupted()`, `thread.isInterrupted()`",
            "rawTitle": "Cơ chế ngắt luồng (Thread Interruption): `thread.interrupt()`, `Thread.interrupted()`, `thread.isInterrupted()`",
            "tags": []
          },
          {
            "id": "java-day-29-topic-01-sub-09",
            "title": "Xử lý `InterruptedException` đúng cách",
            "rawTitle": "Xử lý `InterruptedException` đúng cách",
            "tags": []
          },
          {
            "id": "java-day-29-topic-01-sub-10",
            "title": "Luồng Daemon (Daemon Thread): `setDaemon(true)` và vòng đời theo User Thread",
            "rawTitle": "Luồng Daemon (Daemon Thread): `setDaemon(true)` và vòng đời theo User Thread",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-29-topic-02",
        "title": "Concurrency Issues & Memory Visibility",
        "subtopics": [
          {
            "id": "java-day-29-topic-02-sub-01",
            "title": "Khái niệm Tranh chấp bộ nhớ (Race Condition) và Critical Section",
            "rawTitle": "Khái niệm Tranh chấp bộ nhớ (Race Condition) và Critical Section",
            "tags": []
          },
          {
            "id": "java-day-29-topic-02-sub-02",
            "title": "Bài toán kinh điển: Read-Modify-Write (ví dụ `count++` không phải nguyên tử)",
            "rawTitle": "Bài toán kinh điển: Read-Modify-Write (ví dụ `count++` không phải nguyên tử)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-02-sub-03",
            "title": "Java Memory Model (JMM) cơ bản: Main Memory vs Thread Local Working Memory (CPU Caches)",
            "rawTitle": "Java Memory Model (JMM) cơ bản: Main Memory vs Thread Local Working Memory (CPU Caches)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-02-sub-04",
            "title": "Vấn đề hiển thị bộ nhớ (Memory Visibility Problem) và Instruction Reordering",
            "rawTitle": "Vấn đề hiển thị bộ nhớ (Memory Visibility Problem) và Instruction Reordering",
            "tags": []
          },
          {
            "id": "java-day-29-topic-02-sub-05",
            "title": "Từ khóa `volatile`: Đảm bảo tính nhìn thấy (Visibility) và ngăn chặn Reordering (Happens-Before relationship)",
            "rawTitle": "Từ khóa `volatile`: Đảm bảo tính nhìn thấy (Visibility) và ngăn chặn Reordering (Happens-Before relationship)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-02-sub-06",
            "title": "Giới hạn của `volatile`: Không đảm bảo tính nguyên tử (Atomicity) cho các thao tác phức hợp",
            "rawTitle": "Giới hạn của `volatile`: Không đảm bảo tính nguyên tử (Atomicity) cho các thao tác phức hợp",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-29-topic-03",
        "title": "Synchronization & Intrinsic Locks",
        "subtopics": [
          {
            "id": "java-day-29-topic-03-sub-01",
            "title": "Cơ chế Khóa nội tại (Intrinsic Lock / Monitor Lock) trong mọi Java Object",
            "rawTitle": "Cơ chế Khóa nội tại (Intrinsic Lock / Monitor Lock) trong mọi Java Object",
            "tags": []
          },
          {
            "id": "java-day-29-topic-03-sub-02",
            "title": "Đồng bộ phương thức thực thể: `synchronized void method()` (khóa trên `this`)",
            "rawTitle": "Đồng bộ phương thức thực thể: `synchronized void method()` (khóa trên `this`)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-03-sub-03",
            "title": "Đồng bộ phương thức tĩnh: `static synchronized void method()` (khóa trên `Class` object)",
            "rawTitle": "Đồng bộ phương thức tĩnh: `static synchronized void method()` (khóa trên `Class` object)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-03-sub-04",
            "title": "Khối lệnh đồng bộ: `synchronized (lockObject) { ... }` (Khóa trên đối tượng cụ thể)",
            "rawTitle": "Khối lệnh đồng bộ: `synchronized (lockObject) { ... }` (Khóa trên đối tượng cụ thể)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-03-sub-05",
            "title": "Tính chất Tái nhập (Reentrant) của Intrinsic Lock",
            "rawTitle": "Tính chất Tái nhập (Reentrant) của Intrinsic Lock",
            "tags": []
          },
          {
            "id": "java-day-29-topic-03-sub-06",
            "title": "Giao tiếp giữa các luồng: `wait()`, `notify()`, `notifyAll()` và bắt buộc phải nằm trong `synchronized`",
            "rawTitle": "Giao tiếp giữa các luồng: `wait()`, `notify()`, `notifyAll()` và bắt buộc phải nằm trong `synchronized`",
            "tags": []
          },
          {
            "id": "java-day-29-topic-03-sub-07",
            "title": "Hiện tượng Deadlock (Khóa chết): 4 điều kiện sinh ra Deadlock và kỹ thuật phòng tránh (Lock Ordering)",
            "rawTitle": "Hiện tượng Deadlock (Khóa chết): 4 điều kiện sinh ra Deadlock và kỹ thuật phòng tránh (Lock Ordering)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-29-topic-04",
        "title": "Explicit Locks & Atomic Classes",
        "subtopics": [
          {
            "id": "java-day-29-topic-04-sub-01",
            "title": "Gói `java.util.concurrent.locks`",
            "rawTitle": "Gói `java.util.concurrent.locks`",
            "tags": []
          },
          {
            "id": "java-day-29-topic-04-sub-02",
            "title": "Interface `Lock` và lớp `ReentrantLock`",
            "rawTitle": "Interface `Lock` và lớp `ReentrantLock`",
            "tags": []
          },
          {
            "id": "java-day-29-topic-04-sub-03",
            "title": "Ưu điểm của `ReentrantLock` so với `synchronized`: `tryLock()`, `lockInterruptibly()`, Fair Lock",
            "rawTitle": "Ưu điểm của `ReentrantLock` so với `synchronized`: `tryLock()`, `lockInterruptibly()`, Fair Lock",
            "tags": []
          },
          {
            "id": "java-day-29-topic-04-sub-04",
            "title": "Cấu trúc bắt buộc: `lock.lock(); try { ... } finally { lock.unlock(); }`",
            "rawTitle": "Cấu trúc bắt buộc: `lock.lock(); try { ... } finally { lock.unlock(); }`",
            "tags": []
          },
          {
            "id": "java-day-29-topic-04-sub-05",
            "title": "Interface `Condition`: `await()`, `signal()`, `signalAll()` (Thay thế `wait`/`notify` linh hoạt hơn)",
            "rawTitle": "Interface `Condition`: `await()`, `signal()`, `signalAll()` (Thay thế `wait`/`notify` linh hoạt hơn)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-04-sub-06",
            "title": "`ReentrantReadWriteLock`: Khóa chia sẻ đọc (Read Lock) và Khóa độc quyền ghi (Write Lock)",
            "rawTitle": "`ReentrantReadWriteLock`: Khóa chia sẻ đọc (Read Lock) và Khóa độc quyền ghi (Write Lock)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-04-sub-07",
            "title": "Gói `java.util.concurrent.atomic`: Cơ chế Compare-And-Swap (CAS) không cần khóa (Lock-free)",
            "rawTitle": "Gói `java.util.concurrent.atomic`: Cơ chế Compare-And-Swap (CAS) không cần khóa (Lock-free)",
            "tags": []
          },
          {
            "id": "java-day-29-topic-04-sub-08",
            "title": "Các lớp Atomic phổ biến: `AtomicInteger`, `AtomicLong`, `AtomicBoolean`, `AtomicReference`",
            "rawTitle": "Các lớp Atomic phổ biến: `AtomicInteger`, `AtomicLong`, `AtomicBoolean`, `AtomicReference`",
            "tags": []
          },
          {
            "id": "java-day-29-topic-04-sub-09",
            "title": "Lớp `java.lang.ThreadLocal`: Lưu trữ biến riêng biệt cho từng luồng và nguy cơ Memory Leak nếu không `remove()`",
            "rawTitle": "Lớp `java.lang.ThreadLocal`: Lưu trữ biến riêng biệt cho từng luồng và nguy cơ Memory Leak nếu không `remove()`",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 32
  },
  {
    "id": "java-day-30",
    "track": "java",
    "dayNumber": 30,
    "title": "Modern Concurrency & Backend-Oriented Java",
    "phaseId": "phase-7",
    "phaseTitle": "Phase 7: Java Concurrency & Modern Multithreading",
    "description": "Modern Concurrency: ConcurrentHashMap, BlockingQueue, ThreadPoolExecutor, CompletableFuture, and ProcessBuilder.",
    "topics": [
      {
        "id": "java-day-30-topic-01",
        "title": "Thread-Safe Collections",
        "subtopics": [
          {
            "id": "java-day-30-topic-01-sub-01",
            "title": "Vấn đề khi sử dụng Collections thông thường trong môi trường đa luồng",
            "rawTitle": "Vấn đề khi sử dụng Collections thông thường trong môi trường đa luồng",
            "tags": []
          },
          {
            "id": "java-day-30-topic-01-sub-02",
            "title": "Lớp `java.util.concurrent.ConcurrentHashMap`:",
            "rawTitle": "Lớp `java.util.concurrent.ConcurrentHashMap`:",
            "tags": []
          },
          {
            "id": "java-day-30-topic-01-sub-03",
            "title": "Lớp `java.util.concurrent.CopyOnWriteArrayList`: Cơ chế copy toàn bộ mảng khi ghi (thích hợp cho đọc nhiều, ghi ít)",
            "rawTitle": "Lớp `java.util.concurrent.CopyOnWriteArrayList`: Cơ chế copy toàn bộ mảng khi ghi (thích hợp cho đọc nhiều, ghi ít)",
            "tags": []
          },
          {
            "id": "java-day-30-topic-01-sub-04",
            "title": "Interface `java.util.concurrent.BlockingQueue`:",
            "rawTitle": "Interface `java.util.concurrent.BlockingQueue`:",
            "tags": []
          },
          {
            "id": "java-day-30-topic-01-sub-05",
            "title": "Các lớp BlockingQueue phổ biến: `ArrayBlockingQueue`, `LinkedBlockingQueue`, `PriorityBlockingQueue`",
            "rawTitle": "Các lớp BlockingQueue phổ biến: `ArrayBlockingQueue`, `LinkedBlockingQueue`, `PriorityBlockingQueue`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-30-topic-02",
        "title": "Executor Framework & Thread Pools",
        "subtopics": [
          {
            "id": "java-day-30-topic-02-sub-01",
            "title": "Tác hại của việc tự tạo `new Thread()` thủ công trong ứng dụng Backend (Resource exhaustion)",
            "rawTitle": "Tác hại của việc tự tạo `new Thread()` thủ công trong ứng dụng Backend (Resource exhaustion)",
            "tags": []
          },
          {
            "id": "java-day-30-topic-02-sub-02",
            "title": "Interface `java.util.concurrent.Executor` và `java.util.concurrent.ExecutorService`",
            "rawTitle": "Interface `java.util.concurrent.Executor` và `java.util.concurrent.ExecutorService`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-02-sub-03",
            "title": "Phân biệt `Callable<V>` (có trả về giá trị, ném exception) vs `Runnable` (không trả về)",
            "rawTitle": "Phân biệt `Callable<V>` (có trả về giá trị, ném exception) vs `Runnable` (không trả về)",
            "tags": []
          },
          {
            "id": "java-day-30-topic-02-sub-04",
            "title": "Interface `java.util.concurrent.Future<V>`: `get()`, `get(timeout)`, `isDone()`, `cancel()`",
            "rawTitle": "Interface `java.util.concurrent.Future<V>`: `get()`, `get(timeout)`, `isDone()`, `cancel()`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-02-sub-05",
            "title": "Lớp `java.util.concurrent.Executors` factory methods:",
            "rawTitle": "Lớp `java.util.concurrent.Executors` factory methods:",
            "tags": []
          },
          {
            "id": "java-day-30-topic-02-sub-06",
            "title": "Lớp cốt lõi `java.util.concurrent.ThreadPoolExecutor`:",
            "rawTitle": "Lớp cốt lõi `java.util.concurrent.ThreadPoolExecutor`:",
            "tags": []
          },
          {
            "id": "java-day-30-topic-02-sub-07",
            "title": "Đóng Thread Pool an toàn: `shutdown()` vs `shutdownNow()` vs `awaitTermination()`",
            "rawTitle": "Đóng Thread Pool an toàn: `shutdown()` vs `shutdownNow()` vs `awaitTermination()`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-02-sub-08",
            "title": "Framework `ForkJoinPool` và mô hình tính toán song song Divide-and-Conquer (`RecursiveTask`, `RecursiveAction`)",
            "rawTitle": "Framework `ForkJoinPool` và mô hình tính toán song song Divide-and-Conquer (`RecursiveTask`, `RecursiveAction`)",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-30-topic-03",
        "title": "Asynchronous Programming with CompletableFuture",
        "subtopics": [
          {
            "id": "java-day-30-topic-03-sub-01",
            "title": "Hạn chế của `Future.get()` (Chặn luồng - Blocking call)",
            "rawTitle": "Hạn chế của `Future.get()` (Chặn luồng - Blocking call)",
            "tags": []
          },
          {
            "id": "java-day-30-topic-03-sub-02",
            "title": "Lớp `java.util.concurrent.CompletableFuture<T>`: Lập trình bất đồng bộ không chặn (Non-blocking Reactive style)",
            "rawTitle": "Lớp `java.util.concurrent.CompletableFuture<T>`: Lập trình bất đồng bộ không chặn (Non-blocking Reactive style)",
            "tags": []
          },
          {
            "id": "java-day-30-topic-03-sub-03",
            "title": "Khởi tạo async task: `CompletableFuture.runAsync()`, `CompletableFuture.supplyAsync()`",
            "rawTitle": "Khởi tạo async task: `CompletableFuture.runAsync()`, `CompletableFuture.supplyAsync()`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-03-sub-04",
            "title": "Biến đổi kết quả (Transformation): `thenApply()`, `thenApplyAsync()`",
            "rawTitle": "Biến đổi kết quả (Transformation): `thenApply()`, `thenApplyAsync()`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-03-sub-05",
            "title": "Tiêu thụ kết quả (Consumption): `thenAccept()`, `thenRun()`",
            "rawTitle": "Tiêu thụ kết quả (Consumption): `thenAccept()`, `thenRun()`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-03-sub-06",
            "title": "Kết hợp các Futures (Composition): `thenCompose()`, `thenCombine()`",
            "rawTitle": "Kết hợp các Futures (Composition): `thenCompose()`, `thenCombine()`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-03-sub-07",
            "title": "Tổng hợp nhiều Futures: `CompletableFuture.allOf()`, `CompletableFuture.anyOf()`",
            "rawTitle": "Tổng hợp nhiều Futures: `CompletableFuture.allOf()`, `CompletableFuture.anyOf()`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-03-sub-08",
            "title": "Xử lý ngoại lệ bất đồng bộ: `exceptionally()`, `handle()`, `whenComplete()`",
            "rawTitle": "Xử lý ngoại lệ bất đồng bộ: `exceptionally()`, `handle()`, `whenComplete()`",
            "tags": []
          }
        ]
      },
      {
        "id": "java-day-30-topic-04",
        "title": "OS Process Management",
        "subtopics": [
          {
            "id": "java-day-30-topic-04-sub-01",
            "title": "Lớp `java.lang.ProcessBuilder`: Cấu hình lệnh, tham số, biến môi trường, thư mục làm việc",
            "rawTitle": "Lớp `java.lang.ProcessBuilder`: Cấu hình lệnh, tham số, biến môi trường, thư mục làm việc",
            "tags": []
          },
          {
            "id": "java-day-30-topic-04-sub-02",
            "title": "Quản lý I/O của Process: `redirectInput()`, `redirectOutput()`, `redirectError()`",
            "rawTitle": "Quản lý I/O của Process: `redirectInput()`, `redirectOutput()`, `redirectError()`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-04-sub-03",
            "title": "Lớp `java.lang.Process`: `waitFor()`, `exitValue()`, `destroy()`, `destroyForcibly()`",
            "rawTitle": "Lớp `java.lang.Process`: `waitFor()`, `exitValue()`, `destroy()`, `destroyForcibly()`",
            "tags": []
          },
          {
            "id": "java-day-30-topic-04-sub-04",
            "title": "API `java.lang.ProcessHandle` (Java 9+): Lấy PID (`pid()`), thông tin tiến trình (`info()`), quản lý tiến trình con (`children()`, `descendants()`)",
            "rawTitle": "API `java.lang.ProcessHandle` (Java 9+): Lấy PID (`pid()`), thông tin tiến trình (`info()`), quản lý tiến trình con (`children()`, `descendants()`)",
            "tags": []
          }
        ]
      }
    ],
    "totalSubtopics": 25
  }
];

export function getJavaDayById(dayId: string): RoadmapDay | undefined {
  return JAVA_ROADMAP_DAYS.find((d) => d.id === dayId);
}

export function getJavaDayByNumber(dayNumber: number): RoadmapDay | undefined {
  return JAVA_ROADMAP_DAYS.find((d) => d.dayNumber === dayNumber);
}
