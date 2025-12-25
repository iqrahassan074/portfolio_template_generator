/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Layout, Sun, Moon, Zap, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio?.hasSelectedApiKey();
      setHasKey(!!selected);
    };
    checkKey();
    
    const interval = setInterval(checkKey, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectKey = async () => {
    try {
      await (window as any).aistudio?.openSelectKey();
      // Assume success as per guidelines
      setHasKey(true);
    } catch (e) {
      console.error("Key selection failed", e);
    }
  };

  return (
    <header className="w-full py-6 px-10 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-studio-950/80 backdrop-blur-2xl sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 group cursor-default">
          <div className="relative">
            <div className="p-3.5 bg-slate-900 dark:bg-white rounded-2xl transition-all duration-500 shadow-xl dark:shadow-white/10 group-hover:rotate-6">
              <Layout className="w-6 h-6 text-white dark:text-slate-950" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-indigo-500 border-2 border-white dark:border-slate-950 rounded-lg"></div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">FolioArchitect</h1>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI Studio • Iqra Hassan</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Pro Toggle */}
          <button 
            onClick={handleSelectKey}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              hasKey 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20'
            }`}
          >
            {hasKey ? <ShieldCheck className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 animate-pulse" />}
            <span>{hasKey ? 'Pro Engine Active' : 'Unlock Pro Engine'}</span>
          </button>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>

          <button 
            onClick={onToggleTheme}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-all active:scale-90"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};