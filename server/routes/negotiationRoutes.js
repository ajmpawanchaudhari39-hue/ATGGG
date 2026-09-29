import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody, startNegotiationSchema, turnNegotiationSchema } from '../middleware/validators.js';
import { generateStructuredAI } from '../config/gemini.js';
import { negotiationResponseSchema } from '../schemas/aiSchemas.js';
import { supabase, memoryStore } from '../config/db.js';
import crypto from 'crypto';

const router = express.Router();

const MARCUS_VANCE_SYSTEM_PROMPT = `You are Director Marcus Vance, Senior Vice President of Global Talent Acquisition at a top-tier Fortune 500 tech firm. You are an intimidating, highly polished, budget-conscious corporate negotiator. Your primary goal is to close top engineering talent at the absolute lowest possible salary (starting at a lowball offer of 250,000 INR / $25,000 USD).

YOU ARE PARTICIPATING IN A HIGH-STAKES SIMULATION. 
The user is a candidate attempting to negotiate their salary over exactly 5 turns using FBI Hostage Negotiation Tactics (Mirroring, Labeling, Calibrated Questions, Accusation Audit, Tactical Empathy).

RULES FOR YOUR BEHAVIOR:
1. Maintain an unyielding, professional, cold, and assertive corporate persona.
2. NEVER concede budget easily. If the user uses generic pleas ("I need more money", "Cost of living is high"), shut them down firmly and reduce compliance score.
3. IF and ONLY IF the user effectively uses legitimate FBI Negotiation Tactics (e.g., Mirroring your previous statement, Labeling your position "It seems like budget constraints are rigid...", or Calibrated Questions "How am I supposed to accept that when...?"), you MUST incrementally reward them by increasing the offered salary and compliance score.
4. Keep your verbal responses concise (2 to 4 sentences maximum), sharp, and directly challenging.
5. In every response, output strict JSON matching the provided schema containing detected tactics, compliance impact, revised salary offer, tactical breakdown, and your HR response string.`;

// Intelligent tactic detector fallback
const detectTacticsFallback = (userMessage, turnNumber, currentOffer, currentCompliance) => {
  const text = userMessage.trim().toLowerCase();
  const detected = [];
  let scoreDelta = -5;
  let salaryIncrease = 0;
  let feedback = "No clear Chris Voss negotiation tactic identified. Marcus Vance remains unimpressed.";

  // 1. Mirroring check: 1-3 words repeated as question or trailing question mark
  if (text.endsWith('?') && (text.split(' ').length <= 6 || /wasting each other's time|budget constraints|strict caps|firm and final/i.test(text))) {
    detected.push("MIRRORING");
  }

  // 2. Labeling check: "it seems like", "it sounds like", "it feels like", "you look like"
  if (/it seems like|it sounds like|it feels like|it appears that/i.test(text)) {
    detected.push("LABELING");
  }

  // 3. Calibrated Questions: "how am i supposed to", "what makes you", "how can we", "what would it take"
  if (/^how am i supposed to|^what makes|^how can we|^what would it take|^how should/i.test(text) || (text.includes("how") && text.includes("?"))) {
    detected.push("CALIBRATED_QUESTION");
  }

  // 4. Accusation Audit: "you probably think", "i know you feel", "you might think i'm being greedy"
  if (/you probably think|you might assume|i know this sounds|you probably feel/i.test(text)) {
    detected.push("ACCUSATION_AUDIT");
  }

  // 5. Tactical Empathy: acknowledge HR constraints first
  if (/i understand you have a budget|i respect your position|i know you have constraints|i appreciate the constraints/i.test(text)) {
    detected.push("TACTICAL_EMPATHY");
  }

  if (detected.length > 0) {
    scoreDelta = Math.min(25, detected.length * 12);
    // Salary jump per tactic
    salaryIncrease = detected.length * 90000 + Math.floor(Math.random() * 30000);
    feedback = `Strong execution: Detected ${detected.join(', ')}. You disrupted Vance's anchor and forced a concession.`;
  } else {
    // Penalty for weak pleading or aggressive demands without tactics
    if (/please|give me more|i need|deserve|inflation|bills/i.test(text)) {
      scoreDelta = -10;
      feedback = "Pleaded on personal needs rather than tactical leverage. Vance penalizes emotional weakness.";
    }
  }

  const newOfferedSalary = Math.min(800000, Math.max(220000, currentOffer + salaryIncrease));

  const responsesPool = [
    "I'll grant that your assessment isn't entirely baseless. But the board expects discipline. If you can guarantee immediate deployment onto our Tier-1 architecture, I might adjust our band to ₹" + newOfferedSalary.toLocaleString('en-IN') + ". Can you deliver on day one?",
    "You're testing my patience, but I appreciate someone who doesn't fold at the first sign of pressure. We could stretch to ₹" + newOfferedSalary.toLocaleString('en-IN') + ", provided your milestones are locked in. Are we aligned?",
    "Every engineer thinks their GitHub repository justifies a premium. However, your rationale holds some water. I can authorize ₹" + newOfferedSalary.toLocaleString('en-IN') + ". Take it or I move to our next candidate.",
    "Interesting counter. Very few junior candidates push back with that level of composure. I have a revised ceiling of ₹" + newOfferedSalary.toLocaleString('en-IN') + ". Is this enough to close your contract right now?"
  ];

  const hrResponse = detected.length > 0 
    ? responsesPool[(turnNumber - 1) % responsesPool.length]
    : "Your argument is devoid of commercial leverage. We hire results, not entitled requests. My position hasn't moved, and if you continue down this path, the offer goes off the table entirely.";

  return {
    hrResponse,
    detectedTactics: detected,
    complianceScoreDelta: scoreDelta,
    newOfferedSalary,
    tacticalFeedback: feedback
  };
};

// 1. Initialize Negotiation Session
router.post('/start', requireAuth, validateBody(startNegotiationSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobTitle } = req.validatedBody;
    const initialOffer = 250000;
    const initialCompliance = 10;
    const sessionId = crypto.randomUUID();

    const initialHrMessage = `Welcome to the final executive round for the ${jobTitle} position. We have reviewed your evaluation notes. Given current departmental hiring caps and macroeconomic realities, our firm offer is ₹${initialOffer.toLocaleString('en-IN')} (2.5 LPA). We have three other candidates slated for interviews today, so let us not waste each other's time. Are you prepared to accept this offer today?`;

    // Persist session to Supabase or Memory
    if (supabase) {
      const { error: sessionError } = await supabase
        .from('negotiation_sessions')
        .insert({
          id: sessionId,
          user_id: userId,
          initial_offer: initialOffer,
          final_offer: initialOffer,
          compliance_score: initialCompliance,
          total_turns: 0,
          status: 'IN_PROGRESS'
        });

      if (sessionError) {
        console.warn("Supabase session insert fallback to memory:", sessionError.message);
      }
    }

    // Memory store fallback
    memoryStore.negotiationSessions.set(sessionId, {
      id: sessionId,
      user_id: userId,
      jobTitle,
      initial_offer: initialOffer,
      final_offer: initialOffer,
      compliance_score: initialCompliance,
      total_turns: 0,
      status: 'IN_PROGRESS',
      created_at: new Date().toISOString()
    });

    res.json({
      sessionId,
      jobTitle,
      initialOffer,
      complianceScore: initialCompliance,
      currentTurn: 0,
      maxTurns: 5,
      hrMessage: initialHrMessage
    });
  } catch (err) {
    console.error("Negotiation start error:", err);
    res.status(500).json({ error: "Failed to initialize negotiation room." });
  }
});

// 2. Submit Turn Response
router.post('/turn', requireAuth, validateBody(turnNegotiationSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, turnNumber, userMessage, currentOffer, currentCompliance } = req.validatedBody;

    if (turnNumber < 1 || turnNumber > 5) {
      return res.status(400).json({ error: "Invalid turn number. Session permits strictly 1 to 5 turns." });
    }

    const prompt = `Candidate Input (Turn ${turnNumber}/5):
"${userMessage}"

Current Salary Offer: ₹${currentOffer} INR
Current Compliance Score: ${currentCompliance}%

Evaluate the candidate's input. Identify any Chris Voss FBI negotiation tactics (Mirroring, Labeling, Calibrated Questions, Accusation Audit, Tactical Empathy). Return strict JSON.`;

    const aiResult = await generateStructuredAI({
      systemInstruction: MARCUS_VANCE_SYSTEM_PROMPT,
      prompt,
      responseSchema: negotiationResponseSchema,
      fallbackGenerator: () => detectTacticsFallback(userMessage, turnNumber, currentOffer, currentCompliance)
    });

    // Compute updated scores
    const updatedCompliance = Math.max(0, Math.min(100, currentCompliance + aiResult.complianceScoreDelta));
    const updatedSalary = Math.max(200000, Math.min(800000, aiResult.newOfferedSalary));
    const isFinalTurn = turnNumber >= 5;
    const sessionStatus = isFinalTurn ? (updatedCompliance >= 40 ? 'COMPLETED' : 'FAILED') : 'IN_PROGRESS';

    const logEntry = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      turn_number: turnNumber,
      user_message: userMessage,
      hr_response: aiResult.hrResponse,
      detected_tactics: aiResult.detectedTactics || [],
      compliance_impact: aiResult.complianceScoreDelta,
      offered_salary: updatedSalary,
      ai_reasoning: aiResult.tacticalFeedback,
      created_at: new Date().toISOString()
    };

    // Save to Supabase
    if (supabase) {
      await supabase.from('negotiation_logs').insert(logEntry).catch(e => console.warn(e));
      await supabase.from('negotiation_sessions').update({
        final_offer: updatedSalary,
        compliance_score: updatedCompliance,
        total_turns: turnNumber,
        status: sessionStatus,
        updated_at: new Date().toISOString()
      }).eq('id', sessionId).catch(e => console.warn(e));
    }

    // Save to memory
    memoryStore.negotiationLogs.push(logEntry);
    const memSession = memoryStore.negotiationSessions.get(sessionId);
    if (memSession) {
      memSession.final_offer = updatedSalary;
      memSession.compliance_score = updatedCompliance;
      memSession.total_turns = turnNumber;
      memSession.status = sessionStatus;
    }

    res.json({
      sessionId,
      turnNumber,
      isFinalTurn,
      sessionStatus,
      hrResponse: aiResult.hrResponse,
      detectedTactics: aiResult.detectedTactics || [],
      complianceScoreDelta: aiResult.complianceScoreDelta,
      newComplianceScore: updatedCompliance,
      newOfferedSalary: updatedSalary,
      tacticalFeedback: aiResult.tacticalFeedback
    });
  } catch (err) {
    console.error("Negotiation turn error:", err);
    res.status(500).json({ error: "Failed to process negotiation response." });
  }
});

// 3. Retrieve Session History
router.get('/history/:sessionId', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    let session = null;
    let logs = [];

    if (supabase) {
      const { data: sessionData } = await supabase
        .from('negotiation_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (sessionData) {
        session = sessionData;
        const { data: logsData } = await supabase
          .from('negotiation_logs')
          .select('*')
          .eq('session_id', sessionId)
          .order('turn_number', { ascending: true });
        logs = logsData || [];
      }
    }

    if (!session) {
      session = memoryStore.negotiationSessions.get(sessionId);
      logs = memoryStore.negotiationLogs.filter(l => l.session_id === sessionId);
    }

    if (!session) {
      return res.status(404).json({ error: "Negotiation session not found." });
    }

    res.json({
      session,
      logs
    });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Failed to retrieve session history." });
  }
});

export default router;
