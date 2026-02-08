import React, { useState, useEffect } from 'react';
import { GameState, Choice, GameStats, FirmProfile, Scenario } from './types';
import { INITIAL_STATS, SERVICE_STREAMS } from './constants';
import { initializeGameEngine, processTurnLocal } from './services/gameEngine';
import { generateEndGameReport } from './services/geminiService';
import { ModeSelector } from './components/ModeSelector';
import { GameInterface } from './components/GameInterface';
import { StatsPanel } from './components/StatsPanel';
import { IntroPage } from './components/IntroPage';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    firmProfile: null,
    activeStreams: [],
    inactiveStreams: [],
    stats: { ...INITIAL_STATS },
    currentScenario: null,
    history: [],
    isLoading: false,
    gameStarted: false,
    showIntro: false,
    phaseIndex: 0,
    scenarioQueue: [],
    finalReport: undefined
  });

  const [error, setError] = useState<string | null>(null);

  // Helper to shuffle array
  const shuffle = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleProfileSelect = (profile: FirmProfile) => {
    setGameState(prev => ({ ...prev, isLoading: true, firmProfile: profile }));
    setError(null);
    
    // Shuffle streams to randomly assign benefits/gaps
    const shuffledStreams = shuffle(SERVICE_STREAMS);
    const activeStreams = shuffledStreams.slice(0, 3);
    const inactiveStreams = shuffledStreams.slice(3, 6);

    try {
      const { initialScenario, scenarioQueue, initialStats } = initializeGameEngine(profile, activeStreams, inactiveStreams);
      
      setGameState(prev => ({
        ...prev,
        firmProfile: profile,
        activeStreams,
        inactiveStreams,
        gameStarted: false, // Don't start game yet
        showIntro: true,    // Show intro page
        isLoading: false,
        stats: initialStats,
        phaseIndex: 1, 
        scenarioQueue: scenarioQueue,
        currentScenario: initialScenario
      }));
    } catch (err: any) {
      console.error(err);
      setError("Failed to initialize game engine.");
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleStartSimulation = () => {
    setGameState(prev => ({ ...prev, showIntro: false, gameStarted: true }));
  };

  const handleChoice = (choice: Choice) => {
    if (!gameState.currentScenario) return;

    try {
      const { nextScenario, statsUpdate, narrativeFeedback, lastOutcome, gameOver } = processTurnLocal(
        choice,
        gameState.stats,
        gameState.scenarioQueue,
        gameState.currentScenario
      );

      setGameState(prev => {
        const newStats = calculateNewStats(prev.stats, statsUpdate);
        
        const updatedNextScenario: Scenario | null = nextScenario ? {
            ...nextScenario,
            feedback: narrativeFeedback,
            lastOutcome: lastOutcome
        } : null;

        const gameOverScenario = gameOver ? { 
            ...prev.currentScenario!, 
            gameOver: true, 
            feedback: narrativeFeedback,
            lastOutcome: lastOutcome 
        } : updatedNextScenario;

        const newState = {
          ...prev,
          stats: newStats,
          phaseIndex: prev.phaseIndex + 1,
          scenarioQueue: prev.scenarioQueue.slice(1),
          currentScenario: gameOverScenario,
          history: [
              ...prev.history,
              { role: 'user', content: `Choice: ${choice.label}` },
              { role: 'assistant', content: narrativeFeedback }
          ]
        };
        return newState;
      });

    } catch (err: any) {
      console.error(err);
      setError("Turn processing failed.");
    }
  };

  // Trigger AI Report on Game Over
  useEffect(() => {
    if (gameState.currentScenario?.gameOver && !gameState.finalReport) {
        generateEndGameReport(gameState.stats, gameState.firmProfile, gameState.history)
            .then(report => setGameState(prev => ({ ...prev, finalReport: report })));
    }
  }, [gameState.currentScenario?.gameOver]);

  const calculateNewStats = (current: GameStats, update: any): GameStats => {
    if (!update) return current;
    
    const mergedServicePerf = { ...current.servicePerformance };
    if (update.servicePerformance) {
        Object.entries(update.servicePerformance).forEach(([key, val]: [string, any]) => {
            mergedServicePerf[key] = val; 
        });
    }

    return {
      financialLoss: current.financialLoss + (update.financialLoss || 0),
      financialGain: current.financialGain + (update.financialGain || 0),
      riskExposure: Math.max(0, Math.min(100, current.riskExposure + (update.riskExposure || 0))),
      operationalAlpha: Math.max(0, Math.min(100, current.operationalAlpha + (update.operationalAlpha || 0))),
      time: update.time || current.time,
      moneySaved: current.moneySaved + (update.moneySaved || 0),
      riskReduced: current.riskReduced + (update.riskReduced || 0),
      potentialMoneySaved: current.potentialMoneySaved + (update.potentialMoneySaved || 0),
      potentialRiskReduced: current.potentialRiskReduced + (update.potentialRiskReduced || 0),
      servicePerformance: update.servicePerformance || current.servicePerformance
    };
  };

  const handleRestart = () => {
     setGameState({
        firmProfile: null,
        activeStreams: [],
        inactiveStreams: [],
        stats: { ...INITIAL_STATS, servicePerformance: {} },
        currentScenario: null,
        history: [],
        isLoading: false,
        gameStarted: false,
        showIntro: false,
        phaseIndex: 0,
        scenarioQueue: [],
        finalReport: undefined
     });
     setError(null);
  };

  const netPnL = gameState.stats.financialGain - gameState.stats.financialLoss;
  const isProfitable = netPnL >= 0;

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-rimes-dark overflow-hidden font-sans">
      
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-600/90 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4">
           <span>{error}</span>
           <button onClick={() => setError(null)} className="font-bold">✕</button>
        </div>
      )}

      {!gameState.gameStarted && !gameState.showIntro && (
        <ModeSelector onSelect={handleProfileSelect} isStarting={gameState.isLoading} />
      )}

      {!gameState.gameStarted && gameState.showIntro && (
        <IntroPage 
            activeStreams={gameState.activeStreams} 
            inactiveStreams={gameState.inactiveStreams}
            onStart={handleStartSimulation}
        />
      )}

      {gameState.gameStarted && (
        <div className="flex flex-col md:flex-row h-full">
          
          <div className="md:h-full md:w-72 flex-shrink-0 z-20 shadow-xl">
             <StatsPanel stats={gameState.stats} />
          </div>

          <div className="hidden md:flex flex-col border-r border-slate-700 bg-rimes-panel w-64 flex-shrink-0 border-t md:border-t-0">
             <div className="p-4 flex-grow overflow-y-auto">
              <h3 className="text-rimes-muted text-xs uppercase tracking-widest mb-3">Your Ecosystem</h3>
              <div className="space-y-4">
                <div>
                   <h4 className="text-emerald-400 text-xs font-bold mb-2 flex items-center">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                     RIMES MANAGED (ACTIVE)
                   </h4>
                   <ul className="space-y-2">
                     {gameState.activeStreams.map(s => (
                       <li key={s.id} className="text-slate-300 text-xs bg-emerald-900/20 px-2 py-1.5 rounded border border-emerald-900/50 flex items-center gap-2">
                         <span>{s.icon}</span>
                         <span>{s.name}</span>
                       </li>
                     ))}
                   </ul>
                </div>
                <div>
                   <h4 className="text-red-400 text-xs font-bold mb-2 flex items-center">
                     <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                     MANUAL (RISK ZONES)
                   </h4>
                   <ul className="space-y-2">
                     {gameState.inactiveStreams.map(s => (
                       <li key={s.id} className="text-slate-300 text-xs bg-red-900/20 px-2 py-1.5 rounded border border-red-900/50 flex items-center gap-2 opacity-75">
                          <span className="grayscale">{s.icon}</span>
                          <span>{s.name}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-700">
                <button onClick={handleRestart} className="w-full border border-slate-600 text-slate-400 hover:text-white hover:border-white py-2 px-4 rounded transition-colors text-xs uppercase tracking-widest">
                  Abort Simulation
                </button>
            </div>
          </div>

          <div className="flex-grow h-full overflow-hidden relative flex flex-col">
            {gameState.currentScenario && (
              <GameInterface 
                scenario={gameState.currentScenario} 
                onChoiceSelected={handleChoice} 
                isLoading={gameState.isLoading}
                activeStreams={gameState.activeStreams}
              />
            )}
            
            {gameState.currentScenario?.gameOver && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-rimes-panel border border-slate-600 p-8 rounded-xl w-full max-w-4xl text-center shadow-2xl overflow-y-auto max-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* LEFT COLUMN: FINANCIALS */}
                        <div className="space-y-6 text-left">
                            <h2 className="text-3xl font-bold text-white mb-2">SESSION REPORT</h2>
                            
                            {/* Net P&L Card */}
                            <div className={`p-6 rounded-lg border ${isProfitable ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                                <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Net P&L (Alpha vs Loss)</div>
                                <div className={`text-4xl font-mono font-bold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {isProfitable ? '+' : '-'}${Math.abs(netPnL).toLocaleString()}
                                </div>
                                <div className="flex gap-4 mt-3 text-sm">
                                    <span className="text-emerald-300">Gains: +${gameState.stats.financialGain.toLocaleString()}</span>
                                    <span className="text-red-300">Losses: -${gameState.stats.financialLoss.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Service Breakdown */}
                            <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                                <h4 className="text-xs text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Attribution by Service</h4>
                                <div className="space-y-3">
                                    {Object.entries(gameState.stats.servicePerformance).map(([id, perf]: [string, any]) => {
                                        const stream = SERVICE_STREAMS.find(s => s.id === id);
                                        return (
                                            <div key={id} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span>{stream?.icon}</span>
                                                    <span className="text-slate-300 font-medium">{stream?.name || id}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-emerald-400 font-mono text-xs">+${perf.moneyMade.toLocaleString()} Alpha</span>
                                                    <span className="text-blue-400 font-mono text-[10px]">{perf.riskReduced}% Risk Reduced</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {Object.keys(gameState.stats.servicePerformance).length === 0 && (
                                        <div className="text-slate-500 text-xs italic">No Rimes services were utilized this session.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: AI SUMMARY */}
                        <div className="flex flex-col text-left space-y-6">
                            <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 flex-grow">
                                <h4 className="text-xs text-rimes-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-rimes-accent rounded-full animate-pulse"></span>
                                    Board Executive Summary
                                </h4>
                                {gameState.finalReport ? (
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light">
                                        {gameState.finalReport}
                                    </p>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-32 space-y-3 opacity-50">
                                        <div className="w-6 h-6 border-2 border-rimes-accent border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs font-mono">Generating Performance Review...</span>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleRestart}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:scale-[1.02]"
                            >
                                INITIALIZE NEW SESSION
                            </button>
                        </div>

                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;