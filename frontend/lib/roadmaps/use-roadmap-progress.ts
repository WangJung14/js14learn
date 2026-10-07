'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { RoadmapDay } from './types';
import { JAVA_ROADMAP_DAYS, JAVA_ROADMAP_META } from './java-roadmap-data';

const JAVA_STORAGE_KEY = 'study_hub_java_roadmap_completed_subtopics_v1';

export function useJavaRoadmapProgress() {
  const [completedSubtopicIds, setCompletedSubtopicIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load completed subtopics from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(JAVA_STORAGE_KEY);
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        setCompletedSubtopicIds(new Set(parsed));
      }
    } catch (e) {
      console.warn('Failed to load Java roadmap progress from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when changed
  const saveProgress = useCallback((newSet: Set<string>) => {
    try {
      localStorage.setItem(JAVA_STORAGE_KEY, JSON.stringify(Array.from(newSet)));
    } catch (e) {
      console.warn('Failed to save Java roadmap progress to localStorage', e);
    }
  }, []);

  // Toggle single subtopic
  const toggleSubtopic = useCallback(
    (subtopicId: string) => {
      setCompletedSubtopicIds((prev) => {
        const next = new Set(prev);
        if (next.has(subtopicId)) {
          next.delete(subtopicId);
        } else {
          next.add(subtopicId);
        }
        saveProgress(next);
        return next;
      });
    },
    [saveProgress]
  );

  // Set completion status for a subtopic
  const setSubtopicCompleted = useCallback(
    (subtopicId: string, completed: boolean) => {
      setCompletedSubtopicIds((prev) => {
        const next = new Set(prev);
        if (completed) {
          next.add(subtopicId);
        } else {
          next.delete(subtopicId);
        }
        saveProgress(next);
        return next;
      });
    },
    [saveProgress]
  );

  // Complete all subtopics in a day
  const completeDay = useCallback(
    (day: RoadmapDay) => {
      setCompletedSubtopicIds((prev) => {
        const next = new Set(prev);
        day.topics.forEach((t) => {
          t.subtopics.forEach((s) => {
            next.add(s.id);
          });
        });
        saveProgress(next);
        return next;
      });
    },
    [saveProgress]
  );

  // Reset all subtopics in a day
  const resetDay = useCallback(
    (day: RoadmapDay) => {
      setCompletedSubtopicIds((prev) => {
        const next = new Set(prev);
        day.topics.forEach((t) => {
          t.subtopics.forEach((s) => {
            next.delete(s.id);
          });
        });
        saveProgress(next);
        return next;
      });
    },
    [saveProgress]
  );

  // Complete all subtopics in a specific topic
  const completeTopic = useCallback(
    (topicId: string, day: RoadmapDay) => {
      const targetTopic = day.topics.find((t) => t.id === topicId);
      if (!targetTopic) return;

      setCompletedSubtopicIds((prev) => {
        const next = new Set(prev);
        targetTopic.subtopics.forEach((s) => next.add(s.id));
        saveProgress(next);
        return next;
      });
    },
    [saveProgress]
  );

  // Calculate day progress
  const getDayProgress = useCallback(
    (day: RoadmapDay) => {
      let completedCount = 0;
      day.topics.forEach((topic) => {
        topic.subtopics.forEach((sub) => {
          if (completedSubtopicIds.has(sub.id)) {
            completedCount++;
          }
        });
      });

      const total = day.totalSubtopics;
      const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
      const isCompleted = total > 0 && completedCount === total;
      const isInProgress = completedCount > 0 && completedCount < total;

      return {
        completedCount,
        totalCount: total,
        percentage,
        isCompleted,
        isInProgress,
        status: isCompleted ? 'COMPLETED' : isInProgress ? 'IN_PROGRESS' : 'LOCKED',
      };
    },
    [completedSubtopicIds]
  );

  // Total summary across all 30 days
  const summary = useMemo(() => {
    const totalSubtopics = JAVA_ROADMAP_META.totalSubtopics;
    let completedSubtopics = 0;
    let completedDays = 0;

    JAVA_ROADMAP_DAYS.forEach((day) => {
      let dayCompleted = 0;
      day.topics.forEach((topic) => {
        topic.subtopics.forEach((sub) => {
          if (completedSubtopicIds.has(sub.id)) {
            completedSubtopics++;
            dayCompleted++;
          }
        });
      });
      if (day.totalSubtopics > 0 && dayCompleted === day.totalSubtopics) {
        completedDays++;
      }
    });

    const percentage = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

    return {
      totalDays: JAVA_ROADMAP_DAYS.length,
      completedDays,
      totalTopics: JAVA_ROADMAP_META.totalTopics,
      totalSubtopics,
      completedSubtopics,
      percentage,
    };
  }, [completedSubtopicIds]);

  return {
    isLoaded,
    completedSubtopicIds,
    toggleSubtopic,
    setSubtopicCompleted,
    completeDay,
    resetDay,
    completeTopic,
    getDayProgress,
    summary,
  };
}
