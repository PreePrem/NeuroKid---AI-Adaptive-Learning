import React from 'react';
import { AppProvider, useAppStore } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Assessment } from './pages/Assessment';
import { LessonGenerator } from './pages/LessonGenerator';
import { LessonPlayer } from './pages/LessonPlayer';
import { Progress } from './pages/Progress';

const AppContent: React.FC = () => {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'ASSESSMENT':
        return <Assessment />;
      case 'LESSON_GENERATOR':
        return <LessonGenerator />;
      case 'LESSON_PLAYER':
        return <LessonPlayer />;
      case 'PROGRESS':
        return <Progress />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
