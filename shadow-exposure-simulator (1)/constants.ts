import { FirmProfile, ServiceStream, Scenario, GameStats } from './types';

export const SERVICE_STREAMS: ServiceStream[] = [
  { 
    id: 'EBS', 
    name: 'Enterprise Benchmark Solution', 
    description: 'Golden Copy live. Zero reconciliation time.',
    icon: '🛡️'
  },
  { 
    id: 'MATRIX', 
    name: 'Total Portfolio View', 
    description: 'Look-through active. Hidden exposures solved.',
    icon: '👁️'
  },
  { 
    id: 'EDM_SOFT', 
    name: 'EDM Software', 
    description: 'Data Mastering platform. Provides easy resolution options.',
    icon: '⚡'
  },
  { 
    id: 'LINEAGE', 
    name: 'EDM Lineage', 
    description: '100% Audit trail. Fiduciary Evidence Layer.',
    icon: '⚖️'
  },
  { 
    id: 'OUTSOURCED', 
    name: 'Outsourced EDM', 
    description: 'Exceptions solved overnight by Rimes experts.',
    icon: '⏱️'
  },
  { 
    id: 'ENTITY', 
    name: 'Entity Resolver', 
    description: 'Standardized taxonomy. Entities pre-merged.',
    icon: '🧩'
  }
];

export const FIRM_PROFILES: FirmProfile[] = [
  { 
    id: 'WEALTH', 
    label: 'The Multi-Asset Wealth Manager', 
    description: 'High volume, diverse assets. Speed is everything.' 
  },
  { 
    id: 'PENSION', 
    label: 'The Institutional Pension Fund', 
    description: 'Strict regulatory scrutiny. Fiduciary duty is paramount.' 
  },
  {
    id: 'HEDGE',
    label: 'The Global Macro Hedge Fund',
    description: 'Complex strategies. Data errors mean instant P&L loss.'
  }
];

export const INITIAL_STATS: GameStats = {
  financialLoss: 0,
  financialGain: 0,
  riskExposure: 10,
  operationalAlpha: 50,
  time: "08:00 AM",
  moneySaved: 0,
  riskReduced: 0,
  potentialMoneySaved: 0,
  potentialRiskReduced: 0,
  servicePerformance: {}
};

export const SYSTEM_PROMPT = `
You are the Game Master for the 'Shadow Exposure Simulator'. 
Your goal is to simulate operational challenges in the financial industry (Asset Management, Pension Funds, Hedge Funds).
You act as the environment, presenting scenarios where data quality, timeliness, and accuracy are critical.
The player is the COO/CTO. They must choose between 'Rimes Managed Services' (High quality, Low Risk) or 'Manual/Legacy' processes (High Risk, Potential Loss).
Always maintain a professional, high-stakes financial tone.
`;

// --- THE GAME CONTENT LIBRARY ---

export const SCENARIO_LIBRARY: Scenario[] = [
  // ==========================================
  // STREAM: EBS (Benchmarks / Pricing)
  // ==========================================
  {
    id: 'EBS_FLASH_CRASH',
    relatedStreamId: 'EBS',
    phaseTitle: '09:30 AM - MARKET OPEN',
    narrative: "It is Triple Witching hour—the simultaneous expiration of stock options, stock index futures, and stock index options. Volatility is surging across global markets. Suddenly, your primary legacy data feed begins to choke under the immense volume, introducing a crippling 5-second latency. The arbitrage desk is effectively flying blind, unable to quote accurate spreads.",
    choices: [
      {
        id: 'A',
        label: 'Switch to EBS Golden Copy',
        description: 'Failover instantly to the Rimes validated, multi-source feed.',
        requiredSkillId: 'EBS',
        isRimesChoice: true,
        outcome: {
          financialGain: 2000000, 
          moneySaved: 500000,
          riskReduced: 20,
          operationalAlpha: 10,
          feedback: "The transition was seamless. While your competitors' systems buffered, the Rimes EBS feed delivered clean, validated prices in real-time. Your desk capitalized on the volatility, capturing the spread for a massive $2M alpha gain."
        }
      },
      {
        id: 'B',
        label: 'Restart Feed Handlers',
        description: 'Order IT to restart the servers and pray for a quick handshake.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 850000,
          riskExposure: 15,
          operationalAlpha: -5,
          feedback: "IT restarted the servers, but the handshake protocol took two agonizing minutes. In that time, the market moved 400 points against you. You missed the prime trading window and suffered significant slippage."
        }
      },
      {
        id: 'C',
        label: 'Trade on Stale Data',
        description: 'Ignore the latency warnings and force the algos to keep trading.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 1500000,
          riskExposure: 40,
          operationalAlpha: -10,
          feedback: "An absolute disaster. The algorithms executed trades based on prices that were five seconds old. You are now underwater on 5,000 contracts, and the risk manager is sprinting toward your desk."
        }
      },
      {
        id: 'D',
        label: 'Halt Trading',
        description: 'Pull the plug on the desk until data stability returns.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 250000, 
          riskExposure: -5, 
          operationalAlpha: -5,
          feedback: "A conservative choice. You halted the desk, protecting the firm from catastrophic loss, but you watched from the sidelines as the market offered the most profitable volatility of the quarter."
        }
      }
    ]
  },
  {
    id: 'EBS_REBALANCE',
    relatedStreamId: 'EBS',
    phaseTitle: '04:00 PM - MONTH END',
    narrative: "Today marks a massive Global Index Rebalance, with over 300 securities being added or removed from the benchmark. Your internal security master is struggling to map the influx of new ISINs, and the system is throwing error flags. The Net Asset Value (NAV) strike deadline is fast approaching at 5:00 PM, and accuracy is non-negotiable.",
    choices: [
      {
        id: 'A',
        label: 'EBS Auto-Rebalance',
        description: 'Ingest the pre-validated benchmark changes directly from Rimes.',
        requiredSkillId: 'EBS',
        isRimesChoice: true,
        outcome: {
          financialGain: 150000, 
          moneySaved: 500000,
          riskReduced: 10,
          operationalAlpha: 5,
          feedback: "Rimes had the rebalance data validated and ready yesterday. Your systems aligned perfectly with the new benchmark weights. The zero tracking error will look excellent in the quarterly report."
        }
      },
      {
        id: 'B',
        label: 'Manual "War Room"',
        description: 'Deploy every available analyst to manually map the new securities.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 50000,
          riskExposure: 10,
          operationalAlpha: -5,
          feedback: "The team worked frantically until 4:59 PM. Sweaty and stressed, they managed to strike the NAV, but a few small corporate action errors slipped through the cracks."
        }
      },
      {
        id: 'C',
        label: 'Request Extension',
        description: 'Call the administrator and plead for a deadline extension.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 20000,
          riskExposure: 5,
          operationalAlpha: -15,
          feedback: "The administrator granted the extension, but the delay has annoyed key clients. Questions about your operational resilience are beginning to circulate."
        }
      },
      {
        id: 'D',
        label: 'Approximate Weights',
        description: 'Guess the new weights based on public ETF data.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 200000,
          riskExposure: 30,
          operationalAlpha: -20,
          feedback: "A dangerous gamble. The public ETF data was delayed and inaccurate. Your portfolio weights are now significantly off-benchmark, causing a tracking error explosion."
        }
      }
    ]
  },

  // ==========================================
  // STREAM: MATRIX (Look-through / Exposure)
  // ==========================================
  {
    id: 'MATRIX_SANCTIONS',
    relatedStreamId: 'MATRIX',
    phaseTitle: '11:15 AM - COMPLIANCE ALERT',
    narrative: "Breaking News: The Treasury Department has just issued sanctions against a complex network of shell companies linked to a foreign adversary. Your CIO bursts into the room—she needs to know if the firm has *any* exposure to these entities buried within your Fund-of-Funds or ETFs. The press is already on the line asking for a comment.",
    choices: [
      {
        id: 'A',
        label: 'Matrix Deep-Dive',
        description: 'Run a full look-through analysis on all nested funds instantly.',
        requiredSkillId: 'MATRIX',
        isRimesChoice: true,
        outcome: {
          moneySaved: 5000000, 
          riskReduced: 40,
          operationalAlpha: 15,
          feedback: "Matrix unpacked three layers of nested ETFs and identified a 0.5% exposure to a sanctioned entity. You divested within the hour. The crisis was averted, and your prompt response boosted investor confidence."
        }
      },
      {
        id: 'B',
        label: 'Call External Managers',
        description: 'Phone every external fund manager and ask them for a report.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 0,
          riskExposure: 25,
          operationalAlpha: -10,
          feedback: "You spent hours leaving voicemails. Only half the managers called back. You told the CIO 'we think we are clean', but you are sweating bullets. This is a compliance time bomb."
        }
      },
      {
        id: 'C',
        label: 'Issue "No Comment"',
        description: 'Stonewall the press and hope the news cycle moves on.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 100000, 
          riskExposure: 30,
          operationalAlpha: -10,
          feedback: "Silence is often interpreted as guilt. Rumors are swirling that your fund is exposed to the sanctioned entities, and skittish investors have started submitting redemption requests."
        }
      },
      {
        id: 'D',
        label: 'Emergency External Audit',
        description: 'Hire a "Big 4" accounting firm to conduct a rush audit.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 250000,
          riskExposure: 5,
          operationalAlpha: -5,
          feedback: "It was expensive, but the auditors confirmed you were clean 48 hours later. Unfortunately, that was 47 hours too late for the morning news cycle."
        }
      }
    ]
  },

  // ==========================================
  // STREAM: EDM_SOFT (Data Mastering)
  // ==========================================
  {
    id: 'EDM_CRYPTO',
    relatedStreamId: 'EDM_SOFT',
    phaseTitle: '08:45 AM - NEW STRATEGY',
    narrative: "The firm is aggressively launching a new 'Digital Assets' strategy today to capture the crypto market. However, the custody data for these tokens is arriving in a complex, nested JSON format. Your legacy mainframe system, built decades ago, is treating the feed as a malformed anomaly and rejecting it outright.",
    choices: [
      {
        id: 'A',
        label: 'EDM Flexible Ingestion',
        description: 'Configure a new data model in the EDM UI to handle JSON.',
        requiredSkillId: 'EDM_SOFT',
        isRimesChoice: true,
        outcome: {
          financialGain: 1000000, 
          moneySaved: 400000,
          riskReduced: 10,
          operationalAlpha: 10,
          feedback: "You mapped the complex JSON fields to the internal security master in under 15 minutes. The strategy launched on schedule, and the first day's inflows are massive."
        }
      },
      {
        id: 'B',
        label: 'Hardcode a Script',
        description: 'Ask a developer to write a quick Python script to parse the file.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 60000,
          riskExposure: 15,
          operationalAlpha: -5,
          feedback: "The script worked for Bitcoin but crashed on Ethereum smart contracts. Several trades failed to settle, and the developer is now frantically refactoring code while traders scream."
        }
      },
      {
        id: 'C',
        label: 'Manual Entry',
        description: 'Have junior staff type the trades into the blotter manually.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 10000,
          riskExposure: 20,
          operationalAlpha: -20,
          feedback: "A predictable fatigue error occurred. A junior analyst bought 1,000 times too much Dogecoin because of a decimal place mistake."
        }
      },
      {
        id: 'D',
        label: 'Delay the Launch',
        description: 'Push the strategy launch back by one month for IT upgrades.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 500000, 
          riskExposure: 0,
          operationalAlpha: -10,
          feedback: "A safe choice, but costly. You missed the beginning of a historic bull run. Investors are disappointed and are pulling their capital to competitors."
        }
      }
    ]
  },

  // ==========================================
  // STREAM: LINEAGE (Audit / Governance)
  // ==========================================
  {
    id: 'LINEAGE_AUDIT',
    relatedStreamId: 'LINEAGE',
    phaseTitle: '10:00 AM - REGULATOR VISIT',
    narrative: "A regulator from the SEC is sitting in conference room B. They have flagged a specific valuation for an illiquid corporate bond from 18 months ago, suspecting it was marked up artificially. They are demanding 'proof of provenance' immediately—they want to know exactly who priced it, when, and based on what underlying data source.",
    choices: [
      {
        id: 'A',
        label: 'Lineage Time-Travel',
        description: 'Pull the immutable audit trail for that specific record instantly.',
        requiredSkillId: 'LINEAGE',
        isRimesChoice: true,
        outcome: {
          moneySaved: 3000000,
          riskReduced: 50,
          operationalAlpha: 20,
          feedback: "You pulled up the log on the big screen: It showed an automated average of three broker quotes, untouched by human hands. The regulator was satisfied and closed the case immediately."
        }
      },
      {
        id: 'B',
        label: 'Search Archived Emails',
        description: 'Dig through 18-month-old Outlook archives and tape backups.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 0,
          riskExposure: 30,
          operationalAlpha: -10,
          feedback: "You spent the entire day searching, but the email trail is cold. It might have been deleted. The regulator is taking notes and expanding the scope of the audit."
        }
      },
      {
        id: 'C',
        label: 'Blame the Data Vendor',
        description: 'Claim the price came directly from Bloomberg or Reuters.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 50000, 
          riskExposure: 40,
          operationalAlpha: -15,
          feedback: "The regulator demands to see the vendor logs to prove it. You don't have them stored. This deflection has only agitated them further."
        }
      },
      {
        id: 'D',
        label: 'Offer a Settlement',
        description: 'Offer to restate the value and pay a small fine to resolve it.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 500000,
          riskExposure: 10,
          operationalAlpha: -25,
          feedback: "You paid a fine to make the problem go away. While the investigation stopped, the firm's reputation for compliance has been permanently damaged."
        }
      }
    ]
  },

  // ==========================================
  // STREAM: OUTSOURCED (Managed Services)
  // ==========================================
  {
    id: 'OUT_FLU_SEASON',
    relatedStreamId: 'OUTSOURCED',
    phaseTitle: '07:30 AM - OPS CRISIS',
    narrative: "It is peak flu season, and disaster has struck your operations team. Your Lead Data Analyst and two junior associates have called in sick. You are staring at a queue of 4,500 pricing exceptions from the Asian market close that need manual review. If these aren't cleared by 9:00 AM, the daily NAV cannot be struck.",
    choices: [
      {
        id: 'A',
        label: 'Rimes Managed Service',
        description: 'Rely on the SLA. Let Rimes experts handle the exceptions.',
        requiredSkillId: 'OUTSOURCED',
        isRimesChoice: true,
        outcome: {
          financialGain: 50000, 
          moneySaved: 100000,
          riskReduced: 15,
          operationalAlpha: 5,
          feedback: "While your team was recovering, Rimes analysts in Manila and London cleared the entire queue. You walked into a clean dashboard and spent your morning on strategy instead of crisis management."
        }
      },
      {
        id: 'B',
        label: 'Auto-Accept Tolerances',
        description: 'Widen the tolerance thresholds and auto-accept the data.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 300000,
          riskExposure: 25,
          operationalAlpha: -5,
          feedback: "You cleared the queue in time, but you let bad data through. A fat-finger error on a Japanese Equity went unnoticed, overstating the fund's value by 20 basis points."
        }
      },
      {
        id: 'C',
        label: 'Senior Management Override',
        description: 'Log in yourself and manually fix the data.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 0,
          riskExposure: 10,
          operationalAlpha: -20,
          feedback: "You fixed the data yourself, but you missed a critical board meeting to act as a data entry clerk. This is not the best use of a COO's time."
        }
      },
      {
        id: 'D',
        label: 'Publish Estimated NAV',
        description: 'Send estimated Net Asset Values to clients.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 50000,
          riskExposure: 15,
          operationalAlpha: -10,
          feedback: "Clients hate estimates. They are calling your relationship managers, asking serious questions about the firm's operational resilience."
        }
      }
    ]
  },

  // ==========================================
  // STREAM: ENTITY (Symbology)
  // ==========================================
  {
    id: 'ENT_MERGER',
    relatedStreamId: 'ENTITY',
    phaseTitle: '03:30 PM - MERGER MONDAY',
    narrative: "Two telecommunications giants have just completed a mega-merger. The ticker symbols have changed, CUSIPs are updated, and the legal entity hierarchy is completely restructured. Your credit risk system, however, identifies the merged 'NewCo' as a brand new entity with zero credit history, and is blocking a critical, high-value trade.",
    choices: [
      {
        id: 'A',
        label: 'Entity Resolver',
        description: 'Use the Entity Resolver to auto-link history to the new UUID.',
        requiredSkillId: 'ENTITY',
        isRimesChoice: true,
        outcome: {
          financialGain: 300000, 
          moneySaved: 300000, 
          riskReduced: 10,
          operationalAlpha: 10,
          feedback: "The system instantly recognized the corporate action and inherited the credit history. The trade was executed seamlessly under the existing risk limits."
        }
      },
      {
        id: 'B',
        label: 'Manual Risk Override',
        description: 'Call the Risk team and order them to force the trade.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 0,
          riskExposure: 20,
          operationalAlpha: -5,
          feedback: "The trade went through, but your risk reporting is now fragmented across two different company names. Extensive data cleanup will be required later."
        }
      },
      {
        id: 'C',
        label: 'Excel Mapping Table',
        description: 'Update a manual mapping table in a shared spreadsheet.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 15000,
          riskExposure: 15,
          operationalAlpha: -10,
          feedback: "Too slow. By the time the mapping was updated and uploaded, the price had moved against you. You executed the trade, but at a worse price."
        }
      },
      {
        id: 'D',
        label: 'Cancel the Trade',
        description: 'Decide it is too risky to trade without proper credit limits.',
        isRimesChoice: false,
        outcome: {
          financialLoss: 100000, 
          riskExposure: -5,
          operationalAlpha: -5,
          feedback: "You missed a key rebalancing trade. The portfolio drift has increased, and the portfolio manager is furious about the missed opportunity."
        }
      }
    ]
  }
];