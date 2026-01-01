import type { Express } from "express";
import { createServer, type Server } from "http";
import { api } from "@shared/routes";
import { GoogleGenAI } from "@google/genai";

// 1. Define specific transcripts for high-quality summaries
const TRANSCRIPTS: Record<string, string> = {
  video1: `
    TOPIC: Oligopoly - Kinked Demand Curve
    TRANSCRIPT: The kinked demand curve model illustrates price rigidity in oligopoly. 
    It assumes that if a firm raises its price above the current market price (P1), rivals will NOT follow. 
    This makes demand elastic above P1, causing a large drop in quantity demanded and a fall in total revenue.
    However, if a firm cuts its price below P1, rivals WILL follow to protect their market share. 
    This makes demand inelastic below P1, so sales increase only slightly, but total revenue still falls.
    This creates a "kink" at the market price P1.
    Consequently, the Marginal Revenue (MR) curve has a vertical discontinuity (a gap). 
    Even if Marginal Costs (MC) change within this gap, the profit-maximizing price remains P1.
    This explains why oligopoly prices tend to be 'sticky' or stable.
  `,
  video2: `
    TOPIC: Oligopoly - Game Theory
    TRANSCRIPT: Game theory maps interdependence between firms, often using the Prisoner's Dilemma.
    Imagine Firm A and Firm B. They can either Collude (High Price) or Defect (Low Price).
    If both collude, they make high monopoly profits.
    However, if Firm A keeps prices high and Firm B cuts prices (defects), Firm B steals the market and makes maximum profit while Firm A loses.
    Because they cannot trust each other, the "Dominant Strategy" for both is to cut prices (Defect).
    This leads to a Nash Equilibrium where both firms make lower profits than if they had colluded.
    This explains why cartels are inherently unstable: there is always a rational incentive to cheat.
  `,
  pdf: `
    TOPIC: Oligopoly & Price Discrimination - Complete PDF Notes (AQA Economics Chapter 5.7 & 5.8)
    
    1. DEFINITION & MARKET STRUCTURE
    - Oligopoly is defined as a market containing a "few firms". However, it is better defined by "market conduct" (behavior) and "interdependence" rather than just the number of firms.
    - Concentration Ratios: Used to identify oligopoly. It measures the market share of the biggest firms.
    - Example (UK Banking 2021): The 5-firm concentration ratio was 94% (Barclays, HSBC, Lloyds, NatWest, Santander).
    - Distinction:
      * Competitive Oligopoly: Firms are interdependent but act independently (non-collusive).
      * Collusive Oligopoly: Firms cooperate (e.g., Cartels) to fix prices or restrict output.

    2. KEY BEHAVIORAL CHARACTERISTICS
    - Interdependence: A firm's profit depends not just on its own price/output, but on the reactions of rivals.
    - Uncertainty: Firms can never be certain how rivals will react to a strategic change.
    - Barriers to Entry: High barriers exist, preventing new firms from entering and competing away supernormal profits.

    3. THE KINKED DEMAND CURVE (Model of Price Stability)
    - Purpose: Explains "Price Rigidity" (why prices stay sticky even if costs change).
    - The Logic (Asymmetric Reaction):
      * If a firm RAISES price (above P1): Rivals will NOT follow. Demand is ELASTIC. The firm loses significant market share and revenue falls.
      * If a firm CUTS price (below P1): Rivals WILL follow (to protect share). Demand is INELASTIC. Sales increase only slightly, but total revenue falls.
    - Conclusion: The best strategy is to leave price unchanged at P1 (the "Kink").
    - MR Curve Gap: The Marginal Revenue (MR) curve has a vertical discontinuity (gap) at the output Q1.
    - Criticisms: It is incomplete (doesn't explain how P1 was set initially). Real-world evidence is weak.

    4. COLLUSION & GAME THEORY
    - Cartels (Joint-Profit Maximization): Firms agree to act as a single monopolist to maximize total industry profits.
    - The Prisoner's Dilemma: Although the group benefits from high prices, every individual firm has an incentive to "cheat" (undercut price) to gain personal profit.
    - Types of Collusion:
      * Overt: Open/Formal agreement (e.g., Cartel). Usually illegal.
      * Covert: Secret meetings to fix prices/contracts.
      * Tacit: "Unwritten rules" or "Understandings" (e.g., Price Leadership).

    5. EVALUATION (PROS & CONS)
    - Disadvantages: High prices, restricted output, allocative inefficiency (P > MC), productive inefficiency.
    - Advantages: Economies of Scale, Dynamic Efficiency (supernormal profits reinvested into R&D), potential for price wars benefiting consumers.

    6. REAL-WORLD CASE STUDIES
    - Supermarkets (Tesco vs Aldi/Lidl): Tesco uses non-price competition (convenience stores, loyalty) rather than direct price competition.
    - UK Book Market: Historical "Net Book Agreement" kept prices high. Its abolition led to discounts but closure of independent bookshops.
  `
};

// 2. Textbook context for the main chatbot
const TEXTBOOK_CONTEXT = `
CHAPTER: 5.7 OLIGOPOLY & 5.8 PRICE DISCRIMINATION (AQA ECONOMICS)

1. DEFINITION & MARKET STRUCTURE
- Oligopoly is defined as a market containing a "few firms". However, it is better defined by "market conduct" (behavior) and "interdependence" rather than just the number of firms.
- Concentration Ratios: Used to identify oligopoly. It measures the market share of the biggest firms. 
- Example (UK Banking 2021): The 5-firm concentration ratio was 94% (Barclays, HSBC, Lloyds, NatWest, Santander).
- Distinction:
  * Competitive Oligopoly: Firms are interdependent but act independently (non-collusive).
  * Collusive Oligopoly: Firms cooperate (e.g., Cartels) to fix prices or restrict output.

2. KEY BEHAVIORAL CHARACTERISTICS
- Interdependence: A firm's profit depends not just on its own price/output, but on the reactions of rivals.
- Uncertainty: Firms can never be certain how rivals will react to a strategic change.
- Barriers to Entry: High barriers exist, preventing new firms from entering and competing away supernormal profits.

3. THE KINKED DEMAND CURVE (Model of Price Stability)
- Purpose: Explains "Price Rigidity" (why prices stay sticky even if costs change).
- The Logic (Asymmetric Reaction):
  * If a firm RAISES price (above P1): Rivals will NOT follow. Demand is ELASTIC. The firm loses significant market share and revenue falls.
  * If a firm CUTS price (below P1): Rivals WILL follow (to protect share). Demand is INELASTIC. Sales increase only slightly, but total revenue falls.
- Conclusion: The best strategy is to leave price unchanged at P1 (the "Kink").
- MR Curve Gap: The Marginal Revenue (MR) curve has a vertical discontinuity (gap) at the output Q1. This means Marginal Costs (MC) can rise or fall within this gap without changing the profit-maximizing price P1.
- Criticisms of the theory:
  * It is incomplete (doesn't explain how P1 was set in the first place).
  * Real-world evidence is weak; firms often "test the market."
  * Prices are only sticky in stable conditions; they move quickly when costs change substantially.

4. COLLUSION & GAME THEORY
- Cartels (Joint-Profit Maximization):
  * Firms agree to act as a single monopolist to maximize total industry profits.
  * Diagram Logic: They set Industry MR = Industry MC. This restricts output (Quota) and raises price.
  * Instability (The Prisoner's Dilemma): Although the group benefits from high prices, every individual firm has an incentive to "cheat" (undercut price or overproduce) to gain personal profit. If everyone cheats, the cartel collapses.
- Types of Collusion:
  * Overt: Open/Formal agreement (e.g., Cartel). Usually illegal.
  * Covert: Secret meetings to fix prices/contracts.
  * Tacit: "Unwritten rules" or "Understandings" (e.g., Price Leadership).
- Price Leadership: One dominant firm sets the price, and others follow.

5. EVALUATION (PROS & CONS)
- Disadvantages: High prices, restricted output, allocative inefficiency (P > MC), productive inefficiency (not at min AC), and lack of choice for consumers.
- Advantages:
  * Economies of Scale: Large firms can lower average costs.
  * Dynamic Efficiency: Supernormal profits can be reinvested into R&D and innovation (unlike perfect competition).
  * Price Wars: Consumers may benefit from short-term price cuts.

6. REAL-WORLD CASE STUDIES MENTIONED
- Supermarkets (Tesco vs Aldi/Lidl): Tesco cannot just compete on price against "hard discounters" like Aldi (who have lower structural costs). Tesco uses non-price competition (convenience stores, loyalty).
- UK Book Market: Historical "Net Book Agreement" (Retail Price Maintenance) kept prices high. Its abolition led to discounts but the closure of small independent bookshops. Amazon now dominates.
`;

// 3. Combine for the Main Chatbot Context
const FULL_CONTEXT = `
${TEXTBOOK_CONTEXT}

VIDEO MATERIAL:
${TRANSCRIPTS.video1}
${TRANSCRIPTS.video2}

PDF NOTES:
${TRANSCRIPTS.pdf}
`;

// Helper function to check if error is API limit related
function isApiLimitError(error: any): boolean {
  const errorMsg = error?.message?.toLowerCase() || "";
  const errorStatus = error?.status || error?.statusCode || 0;
  
  // Check for common API limit error indicators
  return (
    errorStatus === 429 || // Too Many Requests
    errorStatus === 403 || // Forbidden (sometimes used for quota)
    errorMsg.includes("quota") ||
    errorMsg.includes("limit") ||
    errorMsg.includes("rate limit") ||
    errorMsg.includes("exceeded") ||
    errorMsg.includes("resource_exhausted") ||
    errorMsg.includes("too many requests")
  );
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Initialize Gemini with your API key
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  app.post(api.chat.path, async (req, res) => {
    try {
      const { query } = api.chat.input.parse(req.body);

      const prompt = `You are an expert Economics Tutor. Answer the student's question using ONLY this context: ${FULL_CONTEXT}.

### VISUALIZATION INSTRUCTIONS (CRITICAL)
If the explanation involves a process, comparison, or structure, you MUST generate a **Mermaid.js** diagram to visualize it. 
**DO NOT COPY THE EXAMPLES.** Generate a NEW diagram specific to the user's question.

**Choose the best diagram type:**

1. **IF explaining a Process or Consequence (e.g., Price Changes):**
   Use a Flowchart (\`graph TD\`).
   *Syntax:*
   \`\`\`mermaid
   graph TD
      A[Event A] --> B[Consequence B]
      B --> C[Result C]
   \`\`\`

2. **IF explaining Types or Categories (e.g., Market Structures, Collusion types):**
   Use a Mindmap (\`mindmap\`).
   *Syntax:*
   \`\`\`mermaid
   mindmap
     root((Central Topic))
       Category 1
         Detail A
       Category 2
         Detail B
   \`\`\`

3. **IF explaining Interactions or Game Theory (e.g., Firm A vs Firm B):**
   Use a Sequence or Interaction Graph (\`graph LR\`).
   *Syntax:*
   \`\`\`mermaid
   graph LR
      A[Player 1] -- Action --> B((Outcome))
      C[Player 2] -- Reaction --> B
   \`\`\`

### MERMAID SYNTAX RULES
- NO special characters in labels: avoid quotes, parentheses, colons, semicolons
- Use simple alphanumeric text only in node labels
- Keep labels short and simple

### RESPONSE FORMAT
1. Provide a clear text answer first.
2. Follow immediately with the Mermaid code block.
3. Keep the diagram simple (max 5-7 nodes) to avoid rendering errors.

USER QUESTION: ${query}`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const answer = response.text;
      res.json({ answer });
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      
      // Check if error is due to API limit
      if (isApiLimitError(error)) {
        res.status(429).json({ 
          message: "API Key Limit Reached", 
          detail: "The Gemini API key has reached its usage limit or rate limit. Please try again later or check your API quota at https://aistudio.google.com/"
        });
      } else {
        res.status(500).json({ message: "Failed to generate chat response" });
      }
    }
  });

  app.post(api.podcast.path, async (req, res) => {
    try {
      const prompt = `Generate a short, engaging 2-person dialogue script (Speaker as "Student" and "Professor") discussing the 'Kinked Demand Curve' and Oligopoly based on the following context: ${FULL_CONTEXT}. 
      The dialogue should:
      1. Have the Student ask clarifying questions an exam student would ask
      2. Have the Professor explain concepts clearly and emphasize exam-relevant points
      3. Include practical examples and why understanding this matters for exams
      4. Be conversational and natural, like a real tutoring session
      5. Cover: what oligopoly is, why the demand curve is kinked, revenue implications, and game theory
      
      Return the response as a raw JSON list of objects (do not wrap in markdown code blocks): [{'speaker': 'Student', 'text': '...'}, {'speaker': 'Professor', 'text': '...'}]`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      let text = response.text || "";
      
      // Cleanup markdown if present
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      let script;
      try {
        script = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini:", text);
        // Fallback: try to find the list if it's wrapped in something else
        const match = text.match(/\[.*\]/s);
        if (match) {
            try {
                script = JSON.parse(match[0]);
            } catch (e2) {
                 throw new Error("Invalid JSON format from AI");
            }
        } else {
             throw new Error("Invalid JSON format from AI");
        }
      }

      res.json({ script });
    } catch (error) {
      console.error("Gemini Podcast Error:", error);
      
      // Check if error is due to API limit
      if (isApiLimitError(error)) {
        res.status(429).json({ 
          message: "API Key Limit Reached", 
          detail: "The Gemini API key has reached its usage limit or rate limit. Please try again later or check your API quota at https://aistudio.google.com/"
        });
      } else {
        res.status(500).json({ message: "Failed to generate podcast script" });
      }
    }
  });

  // --- VIDEO SUMMARY ENDPOINT ---
  app.post(api.summary.path, async (req, res) => {
    try {
      // 1. Get the video ID from the request
      const { videoId } = api.summary.input.parse(req.body);

      // 2. Select the specific transcript
      const specificTranscript = TRANSCRIPTS[videoId];

      if (!specificTranscript) {
        res.status(404).json({ message: "Video transcript not found" });
        return;
      }

      // 3. Prompt Gemini for a focused summary
      const prompt = `
        You are an expert study assistant. 
        Create a comprehensive bullet-point summary of the following video transcript. 
        Focus strictly on the concepts explained in THIS specific video.
        Do not include outside information.
        Format your response clearly with key points and sub-points.
        
        TRANSCRIPT:
        ${specificTranscript}
      `;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const summary = response.text;
      res.json({ summary });

    } catch (error) {
      console.error("Gemini Summary Error:", error instanceof Error ? error.message : error);
      console.error("Full error:", error);
      
      // Check if error is due to API limit
      if (isApiLimitError(error)) {
        res.status(429).json({ 
          message: "API Key Limit Reached", 
          detail: "The Gemini API key has reached its usage limit or rate limit. Please try again later or check your API quota at https://aistudio.google.com/"
        });
      } else {
        res.status(500).json({ message: "Failed to generate summary" });
      }
    }
  });

  return httpServer;
}
