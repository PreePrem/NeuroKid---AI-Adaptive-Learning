import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Plus, Play, BarChart3, BrainCircuit } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

export const Dashboard: React.FC = () => {
  const { children, setActiveChildId, setCurrentView, addChild } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(5);

  const handleCreateChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    
    const newChild = {
      id: crypto.randomUUID(),
      name: newChildName,
      age: newChildAge,
      avatar: ['🦁', '🐰', '🦊', '🐼', '🐨', '🐯'][Math.floor(Math.random() * 6)],
      progress: { lessonsCompleted: 0, starsEarned: 0, streakDays: 0 }
    };
    
    addChild(newChild);
    setIsAdding(false);
    setNewChildName('');
  };

  const handleSelectChild = (id: string) => {
    setActiveChildId(id);
    // Check if assessment needed
    const child = children.find(c => c.id === id);
    if (!child?.learningProfile) {
      setCurrentView('ASSESSMENT');
    } else {
      setCurrentView('LESSON_GENERATOR');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome, Parent</h2>
          <p className="text-slate-500 mt-1">Manage profiles and track learning progress.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Child
        </button>
      </div>

      {/* Add Child Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">New Profile</h3>
          <form onSubmit={handleCreateChild} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input 
                type="text" 
                value={newChildName}
                onChange={e => setNewChildName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Child's name"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input 
                type="number" 
                value={newChildAge}
                onChange={e => setNewChildAge(Number(e.target.value))}
                min={3} max={12}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
              Create
            </button>
          </form>
        </div>
      )}

      {/* Child Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map(child => (
          <div key={child.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                  {child.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{child.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <span>{child.age} years old</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-yellow-600">
                        <span className="font-bold">{child.progress.starsEarned}</span> stars
                    </span>
                  </div>
                  {child.learningProfile ? (
                     <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 border border-green-100 text-xs font-semibold text-green-700">
                        <BrainCircuit className="w-3.5 h-3.5" />
                        {child.learningProfile.primaryStyle} Learner
                     </div>
                  ) : (
                    <div className="mt-3 inline-flex px-2.5 py-1 rounded-md bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-700">
                        Assessment Needed
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats/Graphs (Visual Flair) */}
            {child.learningProfile && (
                <div className="mt-6 h-24 w-full">
                    <p className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Learning Style Mix</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'Vis', val: child.learningProfile.scores.visual * 100 },
                            { name: 'Aud', val: child.learningProfile.scores.auditory * 100 },
                            { name: 'Kin', val: child.learningProfile.scores.kinesthetic * 100 },
                        ]}>
                             <XAxis dataKey="name" hide />
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                             <Bar dataKey="val" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="mt-6 flex gap-3">
                <button 
                    onClick={() => handleSelectChild(child.id)}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Play className="w-4 h-4 fill-current" />
                    Start Learning
                </button>
                <button 
                    onClick={() => { setActiveChildId(child.id); setCurrentView('PROGRESS'); }}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                    title="View Progress"
                >
                    <BarChart3 className="w-5 h-5" />
                </button>
            </div>
          </div>
        ))}
      </div>
      
      {children.length === 0 && !isAdding && (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="text-slate-500 font-medium">No profiles yet. Add your child to get started!</p>
        </div>
      )}
    </div>
  );
};
