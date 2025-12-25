/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Download, Copy, Check, MousePointer2, Box, Info, ShieldCheck, Share2 } from 'lucide-react';
import { GeneratedSvg } from '../types';

interface SvgPreviewProps {
  data: GeneratedSvg | null;
}

export const SvgPreview: React.FC<SvgPreviewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleDownload = () => {
    const blob = new Blob([data.content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `folio-asset-${data.profession}-${data.id.slice(0, 4)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-6 pb-24 animate-in fade-in slide-in-from-bottom-12 duration-700">
      <div className="bg-white dark:bg-studio-900 rounded-[3rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-3xl">
        
        {/* Design Workspace Header */}
        <div className="px-10 py-6 border-b border-slate-100 dark:border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-50/50 dark:bg-studio-950/50 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="p-3.5 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] px-2 py-0.5 bg-indigo-500/10 rounded">Production Asset</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">v2.44 REV 0</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-black text-lg truncate max-w-md italic tracking-tight">"{data.prompt}"</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold transition-all text-sm group"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
              <span>{copied ? 'Code Stored' : 'Copy XML'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black transition-all text-sm shadow-xl shadow-slate-900/10 dark:shadow-white/5 hover:scale-[1.03] active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export SVG</span>
            </button>
            <button className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-500 transition-colors">
               <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Mastering Board */}
        <div className="relative p-12 lg:p-20 bg-slate-50 dark:bg-studio-950 flex flex-col items-center justify-center min-h-[650px] group transition-colors duration-500">
          
          {/* Professional Overlay Elements */}
          <div className="absolute top-10 left-10 flex flex-col gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest"><MousePointer2 className="w-3 h-3" /> Selector: Tool_Pen</div>
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest"><ShieldCheck className="w-3 h-3" /> Quality: Ultra_HD</div>
          </div>

          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          <div 
            className="w-full max-w-[850px] h-auto relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-transform duration-700 hover:scale-[1.02]"
            dangerouslySetInnerHTML={{ __html: data.content }} 
          />
          
          <div className="mt-12 flex items-center gap-8 text-[9px] font-black text-slate-300 dark:text-slate-800 uppercase tracking-[0.5em] opacity-50 group-hover:opacity-100 transition-opacity">
             <span>Architectural Blueprint</span>
             <span className="w-1 h-1 bg-current rounded-full"></span>
             <span>Component Build 0922</span>
             <span className="w-1 h-1 bg-current rounded-full"></span>
             <span>Studio of Iqra Hassan</span>
          </div>
        </div>

        {/* Metadata Status Footer */}
        <div className="px-12 py-6 bg-white dark:bg-studio-900 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black tracking-[0.3em] text-slate-400 dark:text-slate-600">
           <div className="flex flex-wrap items-center justify-center gap-8 uppercase">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Engine_Online</span>
              <span>Layer_Count: {Math.floor(Math.random() * 20) + 5}</span>
              <span>Profession: {data.profession?.replace('_', ' ')}</span>
              <span className="flex items-center gap-2"><Info className="w-3 h-3" /> Source Code Protected</span>
           </div>
           <div className="mt-6 md:mt-0 flex items-center gap-3">
              <span className="text-slate-300 dark:text-slate-700">Digital Identity Signature:</span>
              <span className="text-slate-900 dark:text-white uppercase">Hassan_Architect_AI</span>
           </div>
        </div>
      </div>
    </div>
  );
};