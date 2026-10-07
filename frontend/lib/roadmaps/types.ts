export type RoadmapTrackId = 'javascript' | 'java';

export type SubtopicTag = 'EXTERNAL' | 'BACKEND EXTENSION' | 'CORE' | string;

export interface RoadmapSubtopic {
  id: string;
  title: string;
  rawTitle: string;
  tags: SubtopicTag[];
  isCompleted?: boolean;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  subtopics: RoadmapSubtopic[];
}

export interface RoadmapDay {
  id: string;
  track: RoadmapTrackId;
  dayNumber: number;
  title: string;
  phaseId: string;
  phaseTitle: string;
  description: string;
  topics: RoadmapTopic[];
  totalSubtopics: number;
  completedSubtopics?: number;
  progressPercentage?: number;
  isCompleted?: boolean;
  isInProgress?: boolean;
  isLocked?: boolean;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  startDay: number;
  endDay: number;
  dayCount: number;
}

export interface RoadmapTrackMeta {
  id: RoadmapTrackId;
  name: string;
  title: string;
  badge: string;
  durationLabel: string;
  totalDays: number;
  totalTopics: number;
  totalSubtopics: number;
  description: string;
  iconName: string;
}

export interface UserTrackProgress {
  trackId: RoadmapTrackId;
  completedSubtopicIds: string[];
  lastUpdated: string;
}
