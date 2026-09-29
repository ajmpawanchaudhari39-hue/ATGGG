import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody, resumeRoastSchema } from '../middleware/validators.js';
import { generateStructuredAI } from '../config/gemini.js';
import { resumeRoastResponseSchema } from '../schemas/aiSchemas.js';
import { supabase, memoryStore } from '../config/db.js';
import crypto from 'crypto';

const router = express.Router();

const RESUME_ROASTER_SYSTEM_PROMPT = `You are a merciless, Tier-1 Tech Recruiter and Engineering Director who has screened over 40,000 engineering resumes and discarded 98% of them. 

Your job is to deliver an unfiltered, direct, brutally honest "roast" of the candidate's resume with ZERO sugar-coating or corporate diplomacy. 
Point out meaningless buzzwords (e.g. "passionate", "detail-oriented", "hard worker", "team player"), lack of quantified business metrics, generic university clone projects (to-do lists, weather apps, Netflix clones), missing distributed systems depth, and formatting bloat.

In every response, output strict JSON matching the provided schema.`;

const fallbackRoast = (resumeText) => {
  const textLower = resumeText.toLowerCase();
  const buzzwordsFound = [];
  const commonFluff = ["passionate", "motivated", "detail-oriented", "hardworking", "team player", "enthusiastic", "self-starter", "quick learner"];
  
  commonFluff.forEach(word => {
    if (textLower.includes(word)) buzzwordsFound.push(`"${word}"`);
  });

  const hasMetrics = /%|\$|₹|\bms\b|\bseconds\b|\bqueries\b|\busers\b|\blatency\b/i.test(resumeText);
  const score = Math.max(28, Math.min(85, (hasMetrics ? 50 : 25) + Math.floor(Math.random() * 20) - (buzzwordsFound.length * 5)));

  return {
    roastHeadline: score < 45 ? "A Masterclass in Corporate Fluff and Empty Buzzwords" : "Average Junior Ledger: Cluttered, Timid, and Unquantified",
    overallScore: score,
    brutalSummary: `This resume reads like a textbook template copied from a generic 2019 medium post. You rely heavily on adjectives instead of production metrics. If you deployed code as vaguely as you described your responsibilities, the production servers would have melted down on day one.`,
    weaknesses: [
      buzzwordsFound.length > 0 ? `Unapologetic use of empty filler words like ${buzzwordsFound.join(', ')}.` : "Absence of technical depth in architectural choices.",
      !hasMetrics ? "Virtually zero quantified business impact (no latency deltas, throughput figures, or cost optimizations)." : "Impact numbers feel arbitrary and disconnected from real team outputs.",
      "Generic project portfolio that fails to distinguish you from 50,000 boot camp graduates.",
      "Dense wall-of-text formatting with low scanability for 6-second recruiter reviews."
    ],
    redFlags: [
      "No evidence of dealing with production failures, concurrency bugs, or incident post-mortems.",
      "Listing 25 technologies without deep mastery of fundamental system internals.",
      "Describing tasks ('worked on API') rather than outcomes ('slashed p99 query latency by 42%')."
    ],
    actionableFixes: [
      "Rewrite every bullet point using Google's X-Y-Z formula: Accomplished [X], as measured by [Y], by doing [Z].",
      "Purge all soft-skill adjectives; your technical architecture decisions should demonstrate your competence.",
      "Replace generic CRUD projects with high-throughput or distributed systems prototypes featuring benchmarks.",
      "Consolidate tech stack section to only technologies you can defend under a 45-minute whiteboarding interrogation."
    ]
  };
};

router.post('/roast', requireAuth, validateBody(resumeRoastSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { resumeText } = req.validatedBody;

    const prompt = `Candidate Resume Content for Brutal Roast & Skill Gap Analysis:
"""
${resumeText}
"""
Provide an unfiltered, high-impact critique. Return strict JSON.`;

    const roastResult = await generateStructuredAI({
      systemInstruction: RESUME_ROASTER_SYSTEM_PROMPT,
      prompt,
      responseSchema: resumeRoastResponseSchema,
      fallbackGenerator: () => fallbackRoast(resumeText)
    });

    const record = {
      id: crypto.randomUUID(),
      user_id: userId,
      resume_text: resumeText.substring(0, 1000) + (resumeText.length > 1000 ? '... [truncated]' : ''),
      roast_output: roastResult,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      await supabase.from('resume_roasts').insert(record).catch(e => console.warn(e));
    }
    memoryStore.resumeRoasts.push(record);

    res.json({
      id: record.id,
      ...roastResult
    });
  } catch (err) {
    console.error("Resume roast error:", err);
    res.status(500).json({ error: "Failed to generate resume roast report." });
  }
});

export default router;
