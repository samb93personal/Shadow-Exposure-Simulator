import React from 'react';
import { ServiceStream } from '../types';

interface Props {
  activeStreams: ServiceStream[];
  inactiveStreams: ServiceStream[];
  onStart: () => void;
}

export const IntroPage: React.FC<Props> = ({ activeStreams, inactiveStreams, onStart }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-rimes-dark relative overflow-y-auto custom-scrollbar">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

      <div className="z-10 w-full max-w-5xl space-y-8 py-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
            Operational Briefing
          </h1>
          <p className="text-slate-400 text-lg">
            Review your assigned resources and mission parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission & Scoring */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-600 rounded-xl p-6 shadow-xl">
             <h2 className="text-xl font-bold text-rimes-accent uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Mission Objective
             </h2>
             <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>
                  You are the <strong>COO</strong>. Your goal is to navigate a single trading day without blowing up the firm's P&L or reputation.
                </p>
                <p>
                  You will face critical operational scenarios. For each, you must choose a course of action.
                </p>
                
                <h3 className="font-bold text-white mt-4 mb-2">Scoring Mechanics:</h3>
                <ul className="space-y-2">
                   <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono font-bold">ALPHA (+$)</span>
                      <span>Earned by making efficient, automated choices that generate value or save massive costs.</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <span className="text-red-400 font-mono font-bold">LOSS (-$)</span>
                      <span>Incurred by manual errors, delays, overtime, and regulatory fines.</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <span className="text-rimes-warning font-mono font-bold">RISK (%)</span>
                      <span>Accumulates with every manual workaround. High risk triggers random compliance audits.</span>
                   </li>
                </ul>
             </div>
          </div>

          {/* Resources Assignment */}
          <div className="space-y-6">
             
             {/* Active Resources */}
             <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                   <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                </div>
                
                <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                   Assigned Benefits (Active)
                </h2>
                <p className="text-emerald-200/70 text-xs mb-4">
                   These services have been <strong>randomly assigned</strong> to your firm. You can use these to solve problems instantly and safely.
                </p>
                <div className="space-y-3">
                   {activeStreams.map(s => (
                      <div key={s.id} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded border border-emerald-500/20">
                         <span className="text-xl">{s.icon}</span>
                         <div>
                            <div className="text-emerald-300 font-bold text-sm">{s.name}</div>
                            <div className="text-slate-400 text-xs">{s.description}</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Gaps */}
             <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6 opacity-90">
                <h2 className="text-lg font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                   Operational Gaps (Manual)
                </h2>
                 <p className="text-red-200/70 text-xs mb-4">
                   You <strong>do not</strong> have these services. Scenarios involving these areas will force you into risky, manual workarounds.
                </p>
                <div className="grid grid-cols-2 gap-2">
                   {inactiveStreams.map(s => (
                      <div key={s.id} className="flex items-center gap-2 text-slate-500 text-xs bg-slate-900/50 px-3 py-2 rounded border border-slate-700">
                         <span className="grayscale opacity-50">{s.icon}</span>
                         <span>{s.name}</span>
                      </div>
                   ))}
                </div>
             </div>

          </div>

        </div>

        {/* Action */}
        <div className="flex justify-center pt-8">
           <button 
             onClick={onStart}
             className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xl py-4 px-12 rounded-full shadow-2xl transform transition hover:scale-105 hover:shadow-blue-500/50 flex items-center gap-3"
           >
             <span>ACKNOWLEDGE & BEGIN</span>
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
             </svg>
           </button>
        </div>

      </div>
    </div>
  );
};