import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Play, Pause, CheckCircle, Volume2, ArrowRight, RefreshCw, Star } from 'lucide-react';

export const LessonPlayer: React.FC = () => {
  const { activeLessonId, lessons, completeLesson, currentView, setCurrentView } = useAppStore();
  const lesson = lessons.find(l => l.id === activeLessonId);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [quizSelection, setQuizSelection] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    let interval: any;
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isComplete]);

  if (!lesson) return <div>Loading...</div>;

  const currentStep = lesson.steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setQuizSelection(null);
      setFeedback(null);
    } else {
      finishLesson();
    }
  };

  const finishLesson = () => {
    setIsComplete(true);
    setIsActive(false);
    completeLesson(lesson.id, 3); // Award 3 stars
  };

  const handleQuizSubmit = (option: string) => {
    setQuizSelection(option);
    if (option === currentStep.correctAnswer) {
      setFeedback('correct');
      // Auto advance after delay for kids
      setTimeout(handleNext, 2000);
    } else {
      setFeedback('incorrect');
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6 relative">
          <Star className="w-20 h-20 text-yellow-500 fill-yellow-500 animate-bounce" />
          <div className="absolute top-0 right-0 animate-ping w-4 h-4 bg-yellow-400 rounded-full"></div>
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Lesson Complete!</h2>
        <p className="text-xl text-slate-600 mb-8">You earned 3 Stars! Great job!</p>
        <button 
          onClick={() => setCurrentView('DASHBOARD')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setIsActive(!isActive)} className="p-2 bg-white rounded-full shadow-sm">
          {isActive ? <Pause className="w-5 h-5 text-slate-600" /> : <Play className="w-5 h-5 text-green-600" />}
        </button>
        <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex) / lesson.steps.length) * 100}%` }}
          />
        </div>
        <div className="font-mono font-bold text-slate-600 bg-white px-3 py-1 rounded-lg shadow-sm">
          {formatTime(timer)}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
        
        {/* Header */}
        <div className={`p-6 ${
          currentStep.type === 'activity' ? 'bg-purple-50' :
          currentStep.type === 'quiz' ? 'bg-orange-50' :
          currentStep.type === 'video' ? 'bg-blue-50' : 'bg-slate-50'
        } border-b border-slate-100`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1 block">
                {currentStep.type}
              </span>
              <h2 className="text-2xl font-bold text-slate-900">{currentStep.title}</h2>
            </div>
            {/* Parent Tip Toggle could go here */}
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          
          {currentStep.type === 'video' && (
            <div className="w-full aspect-video bg-slate-900 rounded-2xl flex items-center justify-center mb-6 relative group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
              <p className="absolute bottom-4 left-4 text-white/80 text-sm">
                Parent: Search YouTube for "{currentStep.content}"
              </p>
            </div>
          )}

          {currentStep.type === 'quiz' ? (
            <div className="w-full max-w-lg space-y-4">
              <h3 className="text-2xl font-medium text-slate-800 mb-6">{currentStep.content}</h3>
              <div className="grid grid-cols-1 gap-3">
                {currentStep.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleQuizSubmit(opt)}
                    className={`p-4 rounded-xl text-lg font-medium border-2 transition-all ${
                      quizSelection === opt
                        ? opt === currentStep.correctAnswer
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-red-100 border-red-500 text-red-800'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback === 'correct' && (
                <div className="text-green-600 font-bold text-lg animate-bounce mt-4">Correct! Good job! 🌟</div>
              )}
              {feedback === 'incorrect' && (
                <div className="text-orange-500 font-bold mt-4">Try again!</div>
              )}
            </div>
          ) : (
            <div className="prose prose-lg text-slate-700">
              <p className="text-xl leading-relaxed whitespace-pre-wrap">{currentStep.content}</p>
            </div>
          )}

        </div>

        {/* Parent Tips Footer */}
        {currentStep.parentTips && (
          <div className="bg-yellow-50 p-4 border-t border-yellow-100 flex gap-3 items-start">
             <div className="p-1 bg-yellow-100 rounded-full">
                <Volume2 className="w-4 h-4 text-yellow-700" />
             </div>
             <div className="text-sm text-yellow-900">
                <span className="font-bold block mb-1">Parent Tip:</span>
                {currentStep.parentTips}
             </div>
          </div>
        )}

        {/* Controls */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
          <button 
            onClick={handleNext}
            disabled={currentStep.type === 'quiz' && feedback !== 'correct'}
            className="bg-indigo-600 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            {currentStepIndex === lesson.steps.length - 1 ? 'Finish' : 'Next Step'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};