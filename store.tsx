import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChildProfile, Lesson, ViewState, LearningProfile } from './types';

interface AppState {
  children: ChildProfile[];
  activeChildId: string | null;
  currentView: ViewState;
  lessons: Lesson[];
  activeLessonId: string | null;
}

interface AppContextType extends AppState {
  setChildren: (children: ChildProfile[]) => void;
  setActiveChildId: (id: string | null) => void;
  setCurrentView: (view: ViewState) => void;
  addChild: (child: ChildProfile) => void;
  updateChildProfile: (childId: string, profile: LearningProfile) => void;
  addLesson: (lesson: Lesson) => void;
  completeLesson: (lessonId: string, score: number) => void;
  setActiveLessonId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_CHILDREN: ChildProfile[] = [
  {
    id: '1',
    name: 'Leo',
    age: 4,
    avatar: '🦁',
    progress: { lessonsCompleted: 2, starsEarned: 15, streakDays: 3 },
    learningProfile: {
        primaryStyle: 'Visual' as any,
        scores: { visual: 0.8, auditory: 0.1, kinesthetic: 0.1 },
        summary: "Leo learns best with bright pictures and videos.",
        lastAssessmentDate: new Date().toISOString()
    }
  },
  {
    id: '2',
    name: 'Mia',
    age: 6,
    avatar: '🐰',
    progress: { lessonsCompleted: 5, starsEarned: 42, streakDays: 5 },
    // No learning profile yet
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage or default
  const [childProfiles, setChildProfilesState] = useState<ChildProfile[]>(() => {
    const saved = localStorage.getItem('neurokid_children');
    return saved ? JSON.parse(saved) : MOCK_CHILDREN;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('neurokid_lessons');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('neurokid_children', JSON.stringify(childProfiles));
  }, [childProfiles]);

  useEffect(() => {
    localStorage.setItem('neurokid_lessons', JSON.stringify(lessons));
  }, [lessons]);

  const addChild = (child: ChildProfile) => {
    setChildProfilesState([...childProfiles, child]);
  };

  const updateChildProfile = (childId: string, profile: LearningProfile) => {
    setChildProfilesState(prev => prev.map(c => 
      c.id === childId ? { ...c, learningProfile: profile } : c
    ));
  };

  const addLesson = (lesson: Lesson) => {
    setLessons(prev => [lesson, ...prev]);
  };

  const completeLesson = (lessonId: string, starsToAdd: number) => {
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, isCompleted: true } : l));
    
    if (activeChildId) {
      setChildProfilesState(prev => prev.map(c => {
        if (c.id === activeChildId) {
          return {
            ...c,
            progress: {
              ...c.progress,
              lessonsCompleted: c.progress.lessonsCompleted + 1,
              starsEarned: c.progress.starsEarned + starsToAdd
            }
          };
        }
        return c;
      }));
    }
  };

  return (
    <AppContext.Provider value={{
      children: childProfiles,
      activeChildId,
      currentView,
      lessons,
      activeLessonId,
      setChildren: setChildProfilesState,
      setActiveChildId,
      setCurrentView,
      addChild,
      updateChildProfile,
      addLesson,
      completeLesson,
      setActiveLessonId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};
