import { Scenario, ServiceStream, FirmProfile, Choice, GameStats, Outcome } from "../types";
import { INITIAL_STATS, SCENARIO_LIBRARY } from "../constants";

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const initializeGameEngine = (
  profile: FirmProfile,
  activeStreams: ServiceStream[],
  inactiveStreams: ServiceStream[]
): { initialScenario: Scenario, scenarioQueue: Scenario[], initialStats: GameStats } => {
  
  const activeIds = new Set(activeStreams.map(s => s.id));
  const libraryShuffled = shuffle(SCENARIO_LIBRARY);
  
  // Strategy: Ensure we have a mix of scenarios
  const winScenarios = libraryShuffled.filter(s => s.relatedStreamId && activeIds.has(s.relatedStreamId));
  const challengeScenarios = libraryShuffled.filter(s => s.relatedStreamId && !activeIds.has(s.relatedStreamId));
  
  let selectedScenarios: Scenario[] = [];

  // Grab 2 wins and 2 challenges
  const numWins = Math.min(2, winScenarios.length);
  const numChallenges = Math.min(2, challengeScenarios.length);

  selectedScenarios = [
    ...winScenarios.slice(0, numWins),
    ...challengeScenarios.slice(0, numChallenges)
  ];

  // Fill remainder
  if (selectedScenarios.length < 4) {
    const usedIds = new Set(selectedScenarios.map(s => s.id));
    const remaining = libraryShuffled.filter(s => !usedIds.has(s.id));
    selectedScenarios = [...selectedScenarios, ...remaining.slice(0, 4 - selectedScenarios.length)];
  }

  selectedScenarios = shuffle(selectedScenarios);

  const timePhases = [
    "09:30 AM - MARKET OPEN",
    "11:00 AM - TRADING SESSION",
    "02:00 PM - RISK COMMITTEE",
    "04:00 PM - MARKET CLOSE"
  ];

  selectedScenarios = selectedScenarios.map((s, i) => ({
    ...s,
    phaseTitle: timePhases[i] || "OVERTIME"
  }));

  const initialScenario = selectedScenarios[0];
  const scenarioQueue = selectedScenarios.slice(1);

  return {
    initialScenario,
    scenarioQueue,
    initialStats: { ...INITIAL_STATS, servicePerformance: {} }
  };
};

export const processTurnLocal = (
  choice: Choice,
  currentStats: GameStats,
  queue: Scenario[],
  currentScenario: Scenario
): { nextScenario: Scenario | null, statsUpdate: Partial<GameStats>, narrativeFeedback: string, lastOutcome: Outcome, gameOver: boolean } => {
  
  const outcome = choice.outcome || { feedback: "Processing complete." };
  
  // 1. Base Stats Update
  const statsUpdate: Partial<GameStats> = {
    financialLoss: outcome.financialLoss || 0,
    financialGain: outcome.financialGain || 0,
    riskExposure: outcome.riskExposure || 0,
    operationalAlpha: outcome.operationalAlpha || 0,
    moneySaved: outcome.moneySaved || 0,
    riskReduced: outcome.riskReduced || 0,
    potentialMoneySaved: 0,
    potentialRiskReduced: 0,
    time: ""
  };

  let feedback = outcome.feedback;

  // 2. Track Service Performance
  // If this scenario is related to a stream, and we used a Rimes choice, log it.
  const streamId = currentScenario.relatedStreamId;
  let serviceStatsUpdate = { ...currentStats.servicePerformance };
  
  if (streamId && choice.isRimesChoice) {
      if (!serviceStatsUpdate[streamId]) {
          serviceStatsUpdate[streamId] = { moneyMade: 0, moneySaved: 0, riskReduced: 0, scenariosEncountered: 0 };
      }
      const perf = serviceStatsUpdate[streamId];
      perf.moneyMade += (outcome.financialGain || 0);
      perf.moneySaved += (outcome.moneySaved || 0);
      perf.riskReduced += (outcome.riskReduced || 0);
      perf.scenariosEncountered += 1;
      
      // Assign back to update
      statsUpdate.servicePerformance = serviceStatsUpdate;
  }

  // 3. Potential Savings Logic (Opportunity Cost)
  if (!choice.isRimesChoice) {
      const rimesChoice = currentScenario.choices.find(c => c.isRimesChoice);
      if (rimesChoice && rimesChoice.outcome) {
          statsUpdate.potentialMoneySaved = rimesChoice.outcome.moneySaved || 0;
          statsUpdate.potentialRiskReduced = rimesChoice.outcome.riskReduced || 0;
      }
  }

  // 4. Random Regulatory Fine Logic
  const currentRisk = currentStats.riskExposure + (statsUpdate.riskExposure || 0);
  const fineChance = Math.max(0, currentRisk) / 500; 
  const roll = Math.random();

  if (roll < fineChance) {
      const fineAmount = Math.floor(250000 + Math.random() * 750000); 
      statsUpdate.financialLoss = (statsUpdate.financialLoss || 0) + fineAmount;
      feedback += `\n\n🚨 COMPLIANCE ALERT: Due to elevated risk levels (${currentRisk}%), regulators conducted a spot check and issued a fine of $${(fineAmount/1000).toFixed(0)}k.`;
  }

  // 5. Determine Next State
  const nextScenario = queue.length > 0 ? queue[0] : null;
  const gameOver = nextScenario === null;

  if (nextScenario) {
      statsUpdate.time = nextScenario.phaseTitle.split('-')[0].trim();
  } else {
      statsUpdate.time = "17:00 PM";
  }

  // Construct Final Outcome Object
  const lastOutcome: Outcome = {
    ...outcome,
    financialLoss: statsUpdate.financialLoss,
    financialGain: statsUpdate.financialGain,
    riskExposure: statsUpdate.riskExposure,
    operationalAlpha: statsUpdate.operationalAlpha,
    moneySaved: statsUpdate.moneySaved,
    riskReduced: statsUpdate.riskReduced,
    feedback: feedback
  };

  return {
    nextScenario,
    statsUpdate,
    narrativeFeedback: feedback,
    lastOutcome,
    gameOver
  };
};