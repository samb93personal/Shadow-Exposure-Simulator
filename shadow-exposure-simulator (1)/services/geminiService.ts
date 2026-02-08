import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { FirmProfile, GameStats } from "../types";

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found in environment variables");
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

// Generate a strategic summary at the end of the game
export const generateEndGameReport = async (
  stats: GameStats,
  profile: FirmProfile | null,
  history: { role: string, content: string }[]
) => {
  const ai = getGenAI();

  // Calculate Net P&L
  const netPnL = stats.financialGain - stats.financialLoss;
  const pnlString = netPnL >= 0 ? `PROFIT $${netPnL}` : `LOSS -$${Math.abs(netPnL)}`;

  const prompt = `
    TASK: Write a 3-sentence "Board of Directors Executive Summary" for the COO.
    
    FIRM PROFILE: ${profile?.label || "Unknown"}
    FINAL P&L: ${pnlString} (Gain: ${stats.financialGain}, Loss: ${stats.financialLoss})
    RISK EXPOSURE: ${stats.riskExposure}%
    OPERATIONAL ALPHA: ${stats.operationalAlpha}/100
    
    PERFORMANCE BREAKDOWN:
    ${JSON.stringify(stats.servicePerformance)}

    GAME HISTORY:
    ${history.map(h => `${h.role}: ${h.content}`).slice(-4).join('\n')}

    TONE: Professional, analytical, high-stakes finance.
    If P&L is positive, praise the strategic use of data services (alpha generation).
    If P&L is negative, criticize the operational gaps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        thinkingConfig: { thinkingBudget: 0 } 
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "The Board is reviewing your performance. (AI Report unavailable)";
  }
};
