export interface ServiceStream {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface FirmProfile {
  id: string;
  label: string;
  description: string;
}

export interface ServicePerformanceMetrics {
  moneyMade: number;
  moneySaved: number;
  riskReduced: number;
  scenariosEncountered: number;
}

export interface GameStats {
  financialLoss: number; // USD value (Cost/Fines)
  financialGain: number; // USD value (Alpha/Revenue)
  riskExposure: number; // 0-100%
  operationalAlpha: number; // 0-100
  time: string; // e.g. "08:30 AM"
  moneySaved: number; // USD value saved by Rimes (Actual)
  riskReduced: number; // % risk reduced by Rimes (Actual)
  potentialMoneySaved: number; // USD value that COULD have been saved (Opportunity Cost)
  potentialRiskReduced: number; // % risk that COULD have been reduced
  servicePerformance: Record<string, ServicePerformanceMetrics>; // Track stats per service ID
}

export interface Outcome {
  financialLoss?: number;
  financialGain?: number;
  riskExposure?: number;
  operationalAlpha?: number;
  moneySaved?: number;
  riskReduced?: number;
  feedback: string;
}

export interface Choice {
  id: string;
  label: string;
  description: string;
  requiredSkillId?: string; // If present, this choice is only enabled if the user has the skill
  isRimesChoice?: boolean;
  outcome?: Outcome; // Pre-defined outcome for local engine
}

export interface Scenario {
  id: string; // Unique ID for the scenario
  relatedStreamId?: string; // Links to a specific Rimes solution
  phaseTitle: string;
  narrative: string;
  choices: Choice[];
  feedback?: string; // Result of previous action displayed at the top of this screen
  lastOutcome?: Outcome; // Resulting stats of the previous action
  gameOver?: boolean;
}

export interface GameState {
  firmProfile: FirmProfile | null;
  activeStreams: ServiceStream[];
  inactiveStreams: ServiceStream[];
  stats: GameStats;
  currentScenario: Scenario | null;
  history: { role: string, content: string }[];
  isLoading: boolean;
  gameStarted: boolean;
  showIntro: boolean; // Controls the "How to Play" screen
  phaseIndex: number;
  scenarioQueue: Scenario[];
  finalReport?: string; // AI Generated report
}