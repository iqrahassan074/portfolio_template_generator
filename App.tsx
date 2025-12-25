/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { SvgPreview } from './components/SvgPreview';
import { generateSvgFromPrompt } from './services/geminiService';
import { GeneratedSvg, GenerationStatus, ApiError, ProfessionType } from './types';
import { AlertCircle, History, LayoutTemplate, Github, Linkedin, Mail } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentSvg, setCurrentSvg] = useState<GeneratedSvg | null>(null);
  const [history, setHistory] = useState<GeneratedSvg[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('folio_architect_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('folio_architect_history', JSON.stringify(history.slice(0, 12)));
  }, [history]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  const handleGenerate = async (prompt: string, profession: string) => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setCurrentSvg(null);

    try {
      const svgContent = await generateSvgFromPrompt(prompt, profession);
      const newSvg: GeneratedSvg = {
        id: crypto.randomUUID(),
        content: svgContent,
        prompt: prompt,
        profession: profession as ProfessionType,
        timestamp: Date.now()
      };
      
      setCurrentSvg(newSvg);
      setHistory(prev => [newSvg, ...prev.slice(0, 11)]);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError({
        message: "Architectural Engine Error",
        details: err.message || "The AI designer encountered a conflict."
      });
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'dark-pattern' : 'light-pattern'}`}>
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      
      <main className="flex-1 relative pb-24">
        {/* Modern ambient glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] pointer-events-none rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[150px] pointer-events-none rounded-full"></div>

        <InputSection onGenerate={handleGenerate} status={status} />
        
        {status === GenerationStatus.ERROR && error && (
          <div className="max-w-3xl mx-auto mt-12 px-6">
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-8 flex items-center gap-6 glass animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 bg-rose-500/20 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <h4 className="font-bold text-rose-500 text-xl mb-1">{error.message}</h4>
                <p className="text-sm text-slate-500 font-medium">{error.details}</p>
              </div>
            </div>
          </div>
        )}

        {status === GenerationStatus.SUCCESS && currentSvg && (
          <SvgPreview data={currentSvg} />
        )}
        
        {status === GenerationStatus.IDLE && history.length > 0 && !currentSvg && (
          <div className="max-w-7xl mx-auto mt-32 px-8 animate-in fade-in duration-1000">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Design Archive</h3>
              </div>
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800 ml-8"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {history.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setCurrentSvg(item)}
                  className="group relative bg-white dark:bg-studio-900 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 hover:border-indigo-500/40 transition-all text-left overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="h-40 rounded-xl bg-slate-50 dark:bg-studio-950 p-4 mb-5 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity overflow-hidden" dangerouslySetInnerHTML={{ __html: item.content }} />
                  <div className="space-y-3">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                      {item.profession?.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold line-clamp-2 leading-relaxed">"{item.prompt}"</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {status === GenerationStatus.IDLE && history.length === 0 && (
          <div className="max-w-2xl mx-auto mt-40 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="inline-flex p-10 rounded-[4rem] bg-white dark:bg-studio-900 shadow-2xl border border-slate-100 dark:border-white/5 mb-10">
                <LayoutTemplate className="w-16 h-16 text-slate-200 dark:text-slate-800" />
             </div>
             <p className="text-slate-400 dark:text-slate-500 text-2xl font-light tracking-tight">Your AI-generated studio is ready to build.</p>
          </div>
        )}
      </main>

      <footer className="py-16 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-studio-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white">IH</div>
               <div>
                  <h4 className="text-lg font-black tracking-tight text-slate-800 dark:text-white">Iqra Hassan</h4>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Portfolio Architect specialist</p>
               </div>
            </div>
            <p className="text-slate-400 text-xs font-medium max-w-xs leading-relaxed">
              Crafting futuristic AI design systems for world-class professional identities.
            </p>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-3">
               <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Connect</h5>
               <div className="flex items-center gap-4">
                  <a href="#" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 hover:text-indigo-500"><Github className="w-5 h-5" /></a>
                  <a href="#" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 hover:text-indigo-500"><Linkedin className="w-5 h-5" /></a>
                  <a href="#" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 hover:text-indigo-500"><Mail className="w-5 h-5" /></a>
               </div>
            </div>
            <div className="h-12 w-[1px] bg-slate-200 dark:bg-white/5"></div>
            <div className="flex flex-col gap-1 items-end">
               {/* <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">v2.0 Beta</span> */}
               <span className="text-[10px] text-slate-500 font-bold uppercase">FolioArchitect Studio</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;