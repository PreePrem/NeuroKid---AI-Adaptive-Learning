import React, { useState } from 'react';
import { useAppStore } from '../store';
import { generateLesson } from '../services/geminiService';
import { Sparkles, Clock, List, ArrowRight, Loader2, Brain } from 'lucide-react';

const SUGGESTED_TOPICS = [
  "Dinosaurs & Fossils", "Solar System", "Counting 1-10", "Colors & Shapes", 
  "Ocean Animals", "Feelings & Emotions", "Plants & Gardening"
];

export const LessonGenerator: React.FC = () => {
  const { activeChildId, children, addLesson, setActiveLessonId, setCurrentView } = useAppStore();
  const activeChild = children.find(c => c.id === activeChildId);

  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!activeChild || !topic || !activeChild.learningProfile) return;

    setIsLoading(true);
    try {
      const lessonData = await generateLesson(topic, activeChild.age, activeChild.learningProfile);
      
      const newLesson = {
        ...lessonData,
        id: crypto.randomUUID(),
        childId: activeChild.id,
        topic,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };

      addLesson(newLesson);
      setActiveLessonId(newLesson.id);
      setCurrentView('LESSON_PLAYER');
    } catch (err) {
      console.error(err);
      alert("Oops! The AI had trouble creating that lesson. Try a simpler topic.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeChild || !activeChild.learningProfile) return null;

  return (
    <div className="max-w-3xl mx-auto py-8">
        <div className="bg-indigo-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-indigo-700/50 px-3 py-1 rounded-full text-sm font-medium border border-indigo-500/30">
                        AI Lesson Creator
                    </span>
                    <span className="text-indigo-200 text-sm">
                        Optimized for {activeChild.learningProfile.primaryStyle} learners
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                    What should {activeChild.name} learn today?
                </h1>

                <div className="bg-white p-2 rounded-2xl flex shadow-lg">
                    <input 
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Why is the sky blue?"
                        className="flex-1 px-4 py-3 text-lg text-slate-900 outline-none placeholder:text-slate-400 bg-transparent"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading || !topic.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 md:px-8 rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        <span className="hidden md:inline">Create</span>
                    </button>
                </div>

                <div className="mt-8">
                    <p className="text-indigo-200 text-sm mb-3 font-medium uppercase tracking-wide">Popular Topics</p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_TOPICS.map(t => (
                            <button 
                                key={t}
                                onClick={() => setTopic(t)}
                                className="bg-indigo-800/50 hover:bg-indigo-700 border border-indigo-700/50 text-white px-4 py-2 rounded-full text-sm transition-colors"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Explanation Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Adaptive Pacing</h3>
                <p className="text-sm text-slate-600">Lessons are timed perfectly for {activeChild.age}-year-olds to maintain focus.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <List className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Scaffolded Steps</h3>
                <p className="text-sm text-slate-600">Content breaks down into simple steps: Learn, Practice, and Review.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6" /> {/* Reusing standard icon if Sparkles used elsewhere */}
                    <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Style Matched</h3>
                <p className="text-sm text-slate-600">
                    Since {activeChild.name} is {activeChild.learningProfile.primaryStyle}, we'll prioritize 
                    {activeChild.learningProfile.primaryStyle === 'Visual' ? ' images and diagrams' : 
                     activeChild.learningProfile.primaryStyle === 'Auditory' ? ' sounds and rhymes' : ' movement and touch'}.
                </p>
            </div>
        </div>
    </div>
  );
};