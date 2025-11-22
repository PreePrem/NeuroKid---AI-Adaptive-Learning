export enum LearningStyleType {
  VISUAL = 'Visual',
  AUDITORY = 'Auditory',
  KINESTHETIC = 'Kinesthetic',
  READING_WRITING = 'Reading/Writing',
  MIXED = 'Mixed'
}

export interface LearningProfile {
  primaryStyle: LearningStyleType;
  scores: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
  summary: string;
  lastAssessmentDate: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  learningProfile?: LearningProfile;
  progress: {
    lessonsCompleted: number;
    starsEarned: number;
    streakDays: number;
  };
}

export interface LessonStep {
  id: string;
  title: string;
  type: 'instruction' | 'video' | 'activity' | 'quiz' | 'break';
  content: string;
  durationMinutes: number;
  parentTips?: string;
  options?: string[]; // For quiz
  correctAnswer?: string; // For quiz
}

export interface Lesson {
  id: string;
  childId: string;
  topic: string;
  title: string;
  description: string;
  steps: LessonStep[];
  totalDuration: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  options: { label: string; value: 'visual' | 'auditory' | 'kinesthetic' }[];
}

export type ViewState = 
  | 'DASHBOARD'
  | 'ADD_CHILD'
  | 'ASSESSMENT'
  | 'LESSON_GENERATOR'
  | 'LESSON_PLAYER'
  | 'PROGRESS';
