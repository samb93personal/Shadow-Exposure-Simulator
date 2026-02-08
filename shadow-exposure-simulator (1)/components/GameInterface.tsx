import React from 'react';
import { Choice, Scenario, ServiceStream, Outcome } from '../types';

interface Props {
  scenario: Scenario;
  onChoiceSelected: (choice: Choice) => void;
  isLoading: boolean;
  activeStreams: ServiceStream[];
}

export const GameInterface: React.FC<Props> = ({ scenario, onChoiceSelected, isLoading, activeStreams }) => {
  
  const isChoiceDisabled = (choice: Choice): boolean => {
    if (!choice.requiredSkillId) return false;
    // Check if the required skill ID is present in activeStreams
    return !activeStreams.some(s => s.id === choice.requiredSkillId);
  };

  const getDisabledReason = (choice: Choice): string | null => {
    if (!choice.requiredSkillId) return null;
    const missingSkill = !activeStreams.some(s => s.id === choice.requiredSkillId);
    if (missingSkill) {
      return `Requires Active Solution: ${choice.requiredSkillId}`;
    }
    return null;
  };

  const getFeedbackStyle = (outcome?: Outcome) => {
    if (!outcome) return 'border-rimes-accent bg-rimes-panel';
    // Priority 1: Financial Loss (Critical Failure) -> Red
    if ((outcome.financialLoss || 0) > 0) return 'border-red-500 bg-red-900/20';
    // Priority 2: Increased Risk (Warning) -> Amber
    if ((outcome.riskExposure || 0) > 0) return 'border-rimes-warning bg-yellow-900/20';
    // Priority 3: Positive Gain/Savings (Success) -> Green
    if ((outcome.financialGain || 0) > 0 || (outcome.moneySaved || 0) > 0) return 'border-emerald-500 bg-emerald-900/20';
    // Default: Info -> Blue
    return 'border-blue-500 bg-blue-900/20';
  };

  const getFeedbackTitle = (outcome?: Outcome) => {
    if (!outcome) return 'System Status';
    if ((outcome.financialLoss || 0) > 0) return 'Operational Failure Detected';
    if ((outcome.riskExposure || 0) > 0) return 'Risk Warning';
    if ((outcome.financialGain || 0) > 0 || (outcome.moneySaved || 0) > 0) return 'Value Generation Confirmed';
    return 'Status Update';
  };

  const getFeedbackTitleColor = (outcome?: Outcome) => {
    if (!outcome) return 'text-slate-300';
    if ((outcome.financialLoss || 0) > 0) return 'text-red-400';
    if ((outcome.riskExposure || 0) > 0) return 'text-rimes-warning';
    if ((outcome.financialGain || 0) > 0 || (outcome.moneySaved || 0) > 0) return 'text-emerald-400';
    return 'text-blue-400';
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden">
      
      {/* Header Phase Title */}
      <div className="bg-gradient-to-r from-rimes-accent to-purple-600 p-1">
        <div className="bg-rimes-dark px-4 py-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            {scenario.phaseTitle}
          </h2>
          <div className="text-xs font-mono text-rimes-accent border border-rimes-accent px-2 py-0.5 rounded">
            PRIORITY: HIGH
          </div>
        </div>
      </div>

      {/* Narrative Scroll Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
        {/* Previous Feedback (if any) */}
        {scenario.feedback && (
          <div className={`border-l-4 p-4 rounded-r-md animate-fade-in ${getFeedbackStyle(scenario.lastOutcome)}`}>
            <h4 className={`font-bold text-sm uppercase mb-1 ${getFeedbackTitleColor(scenario.lastOutcome)}`}>
               {getFeedbackTitle(scenario.lastOutcome)}
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed mb-3">{scenario.feedback}</p>
            
            {/* Impact Stats Grid */}
            {scenario.lastOutcome && (
                <div className="flex flex-wrap gap-3 mt-2 border-t border-white/10 pt-2">
                    {scenario.lastOutcome.financialGain && scenario.lastOutcome.financialGain > 0 ? (
                        <span className="text-emerald-400 text-xs font-mono font-bold">
                            +${scenario.lastOutcome.financialGain.toLocaleString()} Gain
                        </span>
                    ) : null}
                    {scenario.lastOutcome.moneySaved && scenario.lastOutcome.moneySaved > 0 ? (
                        <span className="text-emerald-400 text-xs font-mono font-bold">
                            +${scenario.lastOutcome.moneySaved.toLocaleString()} Saved
                        </span>
                    ) : null}
                    {scenario.lastOutcome.financialLoss && scenario.lastOutcome.financialLoss > 0 ? (
                        <span className="text-red-400 text-xs font-mono font-bold">
                            -${scenario.lastOutcome.financialLoss.toLocaleString()} Loss
                        </span>
                    ) : null}
                     {scenario.lastOutcome.riskReduced && scenario.lastOutcome.riskReduced > 0 ? (
                        <span className="text-blue-400 text-xs font-mono font-bold">
                            -{scenario.lastOutcome.riskReduced}% Risk
                        </span>
                    ) : null}
                    {scenario.lastOutcome.riskExposure && scenario.lastOutcome.riskExposure > 0 ? (
                        <span className="text-rimes-warning text-xs font-mono font-bold">
                            +{scenario.lastOutcome.riskExposure}% Risk
                        </span>
                    ) : null}
                     {scenario.lastOutcome.operationalAlpha && scenario.lastOutcome.operationalAlpha !== 0 ? (
                        <span className={`${scenario.lastOutcome.operationalAlpha > 0 ? 'text-emerald-400' : 'text-red-400'} text-xs font-mono font-bold`}>
                            {scenario.lastOutcome.operationalAlpha > 0 ? '+' : ''}{scenario.lastOutcome.operationalAlpha} Alpha
                        </span>
                    ) : null}
                </div>
            )}
          </div>
        )}

        {/* Current Scenario Text */}
        <div className="prose prose-invert max-w-none">
          <div className="text-slate-100 text-base md:text-lg leading-relaxed whitespace-pre-line font-light">
             {scenario.narrative}
          </div>
        </div>
      </div>

      {/* Choice Area - Sticky Bottom */}
      <div className="bg-rimes-panel border-t border-slate-700 p-6 z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="w-8 h-8 border-4 border-rimes-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-rimes-accent font-mono text-sm animate-pulse">Processing Simulation Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenario.choices.map((choice) => {
              const disabled = isChoiceDisabled(choice);
              const disabledReason = getDisabledReason(choice);

              return (
                <button
                  key={choice.id}
                  onClick={() => !disabled && onChoiceSelected(choice)}
                  disabled={disabled}
                  className={`
                    relative group text-left p-4 rounded-lg border transition-all duration-200
                    ${disabled 
                      ? 'border-slate-800 bg-slate-900/50 opacity-60 cursor-not-allowed grayscale' 
                      : choice.isRimesChoice 
                        ? 'border-rimes-accent/50 hover:border-rimes-accent bg-rimes-accent/5 hover:bg-rimes-accent/10' 
                        : 'border-slate-600 hover:border-slate-400 bg-slate-800 hover:bg-slate-750'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`font-bold text-sm uppercase ${choice.isRimesChoice && !disabled ? 'text-rimes-accent' : 'text-slate-400'}`}>
                      Option {choice.id}
                    </span>
                    {choice.isRimesChoice && !disabled && (
                       <span className="text-[10px] bg-rimes-accent text-white px-1.5 py-0.5 rounded font-mono">
                         RIMES SOLUTION
                       </span>
                    )}
                    {disabled && (
                       <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono flex items-center">
                         🔒 LOCKED
                       </span>
                    )}
                  </div>
                  
                  <h3 className={`font-semibold mb-1 ${disabled ? 'text-slate-500' : 'text-white'}`}>{choice.label}</h3>
                  <p className="text-slate-500 text-xs md:text-sm">{choice.description}</p>
                  
                  {disabled && disabledReason && (
                    <div className="mt-2 text-xs text-red-400 font-mono border-t border-slate-800 pt-1">
                       MISSING: {choice.requiredSkillId}
                    </div>
                  )}

                  {/* Hover effect indicator only if not disabled */}
                  {!disabled && (
                    <div className={`absolute inset-0 border-2 border-transparent group-hover:border-opacity-50 rounded-lg pointer-events-none transition-colors 
                      ${choice.isRimesChoice ? 'group-hover:border-rimes-accent' : 'group-hover:border-slate-400'}`} 
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};