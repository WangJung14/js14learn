import { JAVA_ROADMAP_DAYS } from './java-roadmap-data';
import { RoadmapDay } from './types';

const CONTENT_PREFIX = 'study_hub_java_lesson_content_v1_';

export function getDefaultDayContent(day: RoadmapDay): string {
  const topicSections = day.topics
    .map((topic, tIdx) => {
      const subtopicsList = topic.subtopics
        .map((s) => `- **${s.title}**${s.tags.length > 0 ? ` *(${s.tags.join(', ')})*` : ''}`)
        .join('\n');

      return `## ${tIdx + 1}. ${topic.title}

### Tổng quan & Khái niệm cốt lõi
Chủ đề **${topic.title}** bao gồm các kiến thức trọng tâm sau:

${subtopicsList}

### Mã nguồn minh họa & Thực hành

\`\`\`java
// Minh họa cú pháp Java cho chủ đề: ${topic.title}
public class ${topic.title.replace(/[^a-zA-Z0-9]/g, '') || 'Demo'} {
    public static void main(String[] args) {
        System.out.println("=== Học Java Core: ${topic.title} ===");
        // Thực thi logic bài học
    }
}
\`\`\`

> [!TIP] Lưu ý quan trọng
> Nắm vững cấu trúc và nguyên lý hoạt động trước khi áp dụng vào các bài toán thực tế.
`;
    })
    .join('\n\n---\n\n');

  return `# ${day.title}

> **Phase**: ${day.phaseTitle} | **Day**: ${String(day.dayNumber).padStart(2, '0')}
> **Mục tiêu bài học**: ${day.description}

---

${topicSections}

---

## Tổng kết & Ghi nhớ
- Hoàn thành việc đọc và nắm vững toàn bộ các mục Level 2 và Level 3 trong ngày học.
- Tự viết lại các đoạn mã nguồn ví dụ để củng cố kỹ năng lập trình Java.
`;
}

export function getJavaDayContent(dayId: string): string {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${CONTENT_PREFIX}${dayId}`);
      if (stored) return stored;
    } catch {
      // Ignore storage error
    }
  }

  const day = JAVA_ROADMAP_DAYS.find((d) => d.id === dayId);
  if (!day) return '';
  return getDefaultDayContent(day);
}

export function saveJavaDayContent(dayId: string, content: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${CONTENT_PREFIX}${dayId}`, content);
    } catch {
      // Ignore storage error
    }
  }
}

export function resetJavaDayContent(dayId: string): string {
  const day = JAVA_ROADMAP_DAYS.find((d) => d.id === dayId);
  const defaultContent = day ? getDefaultDayContent(day) : '';
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(`${CONTENT_PREFIX}${dayId}`);
    } catch {
      // Ignore storage error
    }
  }
  return defaultContent;
}
