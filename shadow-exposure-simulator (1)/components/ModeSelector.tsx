import React from 'react';
import { FirmProfile } from '../types';
import { FIRM_PROFILES } from '../constants';

interface Props {
  onSelect: (profile: FirmProfile) => void;
  isStarting: boolean;
}

export const ModeSelector: React.FC<Props> = ({ onSelect, isStarting }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-rimes-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="z-10 max-w-5xl w-full text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 tracking-tight uppercase">
          Shadow Exposure Simulator
        </h1>
        <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto">
          Select your **Firm Strategy**. 
          <br/>
          <span className="text-sm text-slate-500 mt-2 block">
            The system will analyze your ecosystem. Some data streams are managed by Rimes (Safe). Others are Manual (Risk).
          </span>
        </p>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {FIRM_PROFILES.map((profile) => (
          <button 
            key={profile.id}
            onClick={() => onSelect(profile)}
            disabled={isStarting}
            className="group relative flex flex-col h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl text-left hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-16 h-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <div className="flex-grow">
              <div className="text-blue-400 font-mono text-xs mb-3 uppercase tracking-widest">Strategy Profile</div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{profile.label}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {profile.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
               <span className="inline-flex items-center text-xs font-mono text-emerald-400">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                 System Ready
               </span>
            </div>
          </button>
        ))}
      </div>
      
      {isStarting && (
        <div className="absolute bottom-10 flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-blue-400 font-mono text-sm tracking-widest animate-pulse">
            ANALYZING ECOSYSTEM COVERAGE...
            </div>
        </div>
      )}
    </div>
  );
};