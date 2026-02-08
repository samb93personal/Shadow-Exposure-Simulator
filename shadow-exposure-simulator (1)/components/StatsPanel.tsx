import React, { useState } from 'react';
import { GameStats, ServiceStream } from '../types';

interface Props {
  stats: GameStats;
}

const formatCurrency = (val: number) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
};

export const StatsPanel: React.FC<Props> = ({ stats }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Risk Color Logic
  const riskColor = stats.riskExposure > 60 ? 'text-red-500' : stats.riskExposure > 30 ? 'text-rimes-warning' : 'text-rimes-success';
  const riskBg = stats.riskExposure > 60 ? 'bg-red-500' : stats.riskExposure > 30 ? 'bg-rimes-warning' : 'bg-rimes-success';

  // Alpha Color
  const alphaColor = stats.operationalAlpha > 70 ? 'text-emerald-400' : 'text-slate-400';
  const alphaBg = stats.operationalAlpha > 70 ? 'bg-emerald-400' : 'bg-slate-400';

  return (
    <div className="bg-rimes-panel border-b md:border-b-0 md:border-r border-slate-700 shadow-xl w-full md:w-72 flex-shrink-0 flex flex-col transition-all duration-300">
      
      {/* Mobile Header / Desktop Top */}
      <div className="p-4 flex flex-row md:flex-col justify-between items-center md:items-stretch gap-4">
        <div className="text-center md:border-b border-slate-600 md:pb-4 w-1/3 md:w-auto">
          <h3 className="text-rimes-muted text-[10px] uppercase tracking-widest mb-1">Time</h3>
          <div className="text-xl md:text-3xl font-mono text-white font-bold animate-pulse whitespace-nowrap">
            {stats.time}
          </div>
        </div>

        {/* Compact Metrics Row for Mobile */}
        <div className="flex md:hidden flex-grow justify-around gap-2">
           <div className="text-center">
              <div className="text-[10px] text-red-400 uppercase">Loss</div>
              <div className="font-mono font-bold text-white text-sm">{formatCurrency(stats.financialLoss)}</div>
           </div>
           <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase">Risk</div>
              <div className={`font-mono font-bold text-sm ${riskColor}`}>{stats.riskExposure}%</div>
           </div>
        </div>

        {/* Toggle Button Mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {/* Collapsible Content for Mobile, Always Visible Desktop */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block flex-grow overflow-y-auto p-4 pt-0 md:pt-4 space-y-6`}>
        
        {/* Full Financial Metrics (Desktop view mostly) */}
        <div className="space-y-6">
          <div className="hidden md:block bg-slate-900/50 p-3 rounded border border-red-900/30">
            <div className="text-xs text-red-400 uppercase tracking-wider mb-1">Financial Loss</div>
            <div className="text-2xl font-mono font-bold text-white">
              {formatCurrency(stats.financialLoss)}
            </div>
            {stats.financialLoss > 0 && (
               <div className="text-[10px] text-red-400 mt-1">Total Impact</div>
            )}
          </div>

          <div>
             <div className="flex justify-between text-xs uppercase tracking-wider text-slate-400 mb-1">
               <span>Risk Exposure</span>
               <span className={`font-mono font-bold ${riskColor}`}>{stats.riskExposure}%</span>
             </div>
             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ${riskBg}`} 
                 style={{ width: `${Math.min(stats.riskExposure, 100)}%` }}
               ></div>
             </div>
          </div>

          <div>
             <div className="flex justify-between text-xs uppercase tracking-wider text-slate-400 mb-1">
               <span>Operational Alpha</span>
               <span className={`font-mono font-bold ${alphaColor}`}>{stats.operationalAlpha}</span>
             </div>
             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ${alphaBg}`} 
                 style={{ width: `${Math.min(stats.operationalAlpha, 100)}%` }}
               ></div>
             </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-600 text-xs text-slate-500 font-mono text-center hidden md:block">
          MARKET STATUS: <span className="text-emerald-500 animate-pulse">LIVE</span>
        </div>
      </div>
    </div>
  );
};
