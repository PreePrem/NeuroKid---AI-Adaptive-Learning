import React, { useState } from 'react';
import { useAppStore } from '../store';
import { analyzeLearningStyle } from '../services/geminiService';
import { CheckCircle2, Loader2, Brain } from 'lucide-react';

const QUESTIONS = [
  { id: 1, text: "When your child sees a new toy, what do they do first?", options: [
      { label: "Look at it closely and examine details", value: "Visual" },
      { label: "Ask what it does or listen to sounds it makes", value: "Auditory" },
      { label: "Grab it immediately and start moving it", value: "Kinesthetic" }
  ]},
  { id: 2, text: "What kind of games does your child prefer?", options: [
      { label: "Puzzles, matching games, or looking at books", value: "Visual" },
      { label: "Singing, rhyming, or listening to stories", value: "Auditory" },
      { label: "Tag, ball games, or building blocks", value: "Kinesthetic" }
  ]},
  { id: 3, text: "If you give your child directions, how do they remember best?", options: [
      { label: "If you show them what to do", value: "Visual" },
      { label: "If you tell them step-by-step", value: "Auditory" },
      { label: "If you let them try it as you explain", value: "Kinesthetic" }
  ]},
  { id: 4, text: "When they are bored, they usually...", options: [
      { label: "Doodle, draw, or watch something", value: "Visual" },
      { label: "Talk to themselves, sing, or make noises", value: "Auditory" },
      { label: "Fidget, run around, or touch things", value: "Kinesthetic" }
  ]}
];

export const Assessment: React.FC = () => {
  const { activeChildId, updateChildProfile, setCurrentView, children } = useAppStore();
  const activeChild = children.find(c => c.id === activeChildId);
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSelect = (qId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async () => {
    if (!activeChild) return;
    setIsSubmitting(true);
    
    try {
      const profile = await analyzeLearningStyle(activeChild.age, answers);
      updateChildProfile(activeChild.id, profile);
      
      // Short delay to show success before redirecting
      setTimeout(() => {
        setCurrentView('LESSON_GENERATOR');
      }, 1500);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      alert("Failed to analyze style. Please try again.");
    }
  };

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  if (!activeChild) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
           <Brain className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Discover {activeChild.name}'s Learning Style</h2>
        <p className="text-slate-600 mt-2">Answer a few questions to help our AI customize lessons for {activeChild.name}.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-2 bg-slate-100 w-full">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-8 space-y-8">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h3 className="text-lg font-medium text-slate-900 mb-4">{q.id}. {q.text}</h3>
              <div className="space-y-3">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(q.id, opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                      answers[q.id] === opt.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-medium">{opt.label}</span>
                    {answers[q.id] === opt.value && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
                disabled={Object.keys(answers).length !== QUESTIONS.length || isSubmitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-indigo-600 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:scale-100 disabled:shadow-none"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    "Create Profile"
                )}
            </button>
        </div>
      </div>
    </div>
  );
};
