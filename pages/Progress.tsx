import React from 'react';
import { useAppStore } from '../store';
import { Award, Calendar, Zap } from 'lucide-react';

export const Progress: React.FC = () => {
    const { activeChildId, children, lessons } = useAppStore();
    const activeChild = children.find(c => c.id === activeChildId);
    
    if (!activeChild) return null;

    const childLessons = lessons.filter(l => l.childId === activeChild.id && l.isCompleted);

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row gap-6">
                 {/* Stats Cards */}
                 <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase">Total Stars</p>
                        <h3 className="text-3xl font-bold text-slate-900">{activeChild.progress.starsEarned}</h3>
                    </div>
                 </div>
                 <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase">Lessons Done</p>
                        <h3 className="text-3xl font-bold text-slate-900">{activeChild.progress.lessonsCompleted}</h3>
                    </div>
                 </div>
                 <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase">Day Streak</p>
                        <h3 className="text-3xl font-bold text-slate-900">{activeChild.progress.streakDays}</h3>
                    </div>
                 </div>
             </div>

             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Completed Lessons History</h3>
                {childLessons.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        No lessons completed yet. Start a learning adventure!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {childLessons.map(l => (
                            <div key={l.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <h4 className="font-bold text-slate-800">{l.topic}</h4>
                                    <span className="text-xs text-slate-500">{new Date(l.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg">
                                    Completed
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
    )
}
