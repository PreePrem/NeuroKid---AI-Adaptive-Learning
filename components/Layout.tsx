import React from 'react';
import { useAppStore } from '../store';
import { User, ArrowLeft, Brain, Star } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentView, setCurrentView, activeChildId, children: childList } = useAppStore();

  const activeChild = childList.find(c => c.id === activeChildId);

  const handleBack = () => {
    if (currentView === 'LESSON_PLAYER') {
        if (confirm("Quit lesson? Progress won't be saved.")) {
            setCurrentView('DASHBOARD');
        }
        return;
    }
    setCurrentView('DASHBOARD');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentView !== 'DASHBOARD' && (
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-slate-100 rounded-full mr-2 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
            )}
            
            <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => setCurrentView('DASHBOARD')}
            >
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-indigo-900 hidden sm:block">
                NeuroKid
                </h1>
            </div>
          </div>

          {/* Active Child Indicator */}
          {activeChild ? (
            <div className="flex items-center gap-3 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
               <span className="text-2xl" role="img" aria-label="avatar">{activeChild.avatar}</span>
               <div className="flex flex-col">
                 <span className="text-sm font-bold text-indigo-900 leading-none">{activeChild.name}</span>
                 <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-indigo-700 font-medium">{activeChild.progress.starsEarned}</span>
                 </div>
               </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Parent View</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>
    </div>
  );
};
