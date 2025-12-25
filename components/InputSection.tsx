/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Wand2, Loader2, Code2, Palette, Database, BarChart3, Rocket, Sparkles } from 'lucide-react';
import { GenerationStatus } from '../types';

interface InputSectionProps {
  onGenerate: (prompt: string, profession: string) => void;
  status: GenerationStatus;
}

const PROFESSIONS = [
  { id: 'SOFTWARE_ENGINEER', label: 'Engineer', icon: Code2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'PRODUCT_DESIGNER', label: 'Designer', icon: Palette, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { id: 'DATA_SCIENTIST', label: 'Analyst', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'MARKETING_LEAD', label: 'Marketing', icon: BarChart3, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'CREATIVE_DIRECTOR', label: 'Director', icon: Rocket, color: 'text-violet-500', bg: 'bg-violet-500/10' },
];

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, status }) => {
  const [input, setInput] = useState('');
  const [selectedProf, setSelectedProf] = useState(PROFESSIONS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== GenerationStatus.LOADING) {
      onGenerate(input.trim(), selectedProf);
    }
  };

  const isLoading = status === GenerationStatus.LOADING;
  const currentProf = PROFESSIONS.find(p => p.id === selectedProf);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-24 pb-12">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
           <Sparkles className="w-3 h-3" /> Advanced Layout Engine
        </div>
        <h2 className="text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[1.1]">
          The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500">Professional Studio.</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium">
          Generate specialized, high-end portfolio components for elite professions using the world's most advanced architectural AI.
        </p>
      </div>

      <div className="relative group max-w-4xl mx-auto">
        <div className={`absolute -inset-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-40 transition duration-1000 ${isLoading ? 'animate-pulse' : ''}`}></div>
        
        <div className="relative bg-white dark:bg-studio-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl p-3 flex flex-col gap-3">
          
          {/* Profession Selection */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-50 dark:bg-studio-950 rounded-[2rem] border border-slate-100 dark:border-white/5">
            {PROFESSIONS.map((prof) => (
              <button
                key={prof.id}
                onClick={() => setSelectedProf(prof.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-[1.5rem] text-xs font-black transition-all duration-300
                  ${selectedProf === prof.id 
                    ? `bg-white dark:bg-studio-800 ${prof.color} shadow-lg dark:shadow-white/5` 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                <prof.icon className="w-4 h-4" />
                {prof.label}
              </button>
            ))}
          </div>

          {/* Main Input Field */}
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2 px-2 py-1">
            <div className="flex-1 flex items-center gap-4 px-4">
               <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentProf?.bg} ${currentProf?.color} text-[10px] font-black uppercase tracking-widest border border-current opacity-60`}>
                  {currentProf?.label}
               </div>
               <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What type of layout should we architect today?"
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 py-6 text-xl font-medium"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[1.8rem] font-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <span>Architect</span>
                  <Wand2 className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};