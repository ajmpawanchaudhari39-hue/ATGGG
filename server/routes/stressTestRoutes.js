import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody, stressTestSubmitSchema } from '../middleware/validators.js';
import { generateStructuredAI } from '../config/gemini.js';
import { stressTestQuestionsSchema, stressTestEvaluationSchema } from '../schemas/aiSchemas.js';
import { supabase, memoryStore } from '../config/db.js';
import crypto from 'crypto';

const router = express.Router();

const ENGINEERING_QUESTIONS_SEED = [
  {
    id: "eng-1",
    question: "A high-frequency payment webhook is dropping 15% of events during flash sales due to DB connection pool exhaustion. How do you resolve this with zero data loss in under 2 minutes?",
    scenario: "Critical Production Outage: Connection pool saturated, HTTP 504 gateway timeouts spiking.",
    expectedKeywords: ["message queue", "Kafka", "RabbitMQ", "circuit breaker", "Redis buffer", "backpressure"],
    difficulty: "HIGH"
  },
  {
    id: "eng-2",
    question: "Explain why Node.js libuv threadpool starvation occurs when executing bcrypt hashes concurrently, and how would you decouple this from the event loop?",
    scenario: "Latency Spike: API response times jump from 45ms to 3200ms when 100 users log in simultaneously.",
    expectedKeywords: ["worker threads", "crypto microservice", "UV_THREADPOOL_SIZE", "child_process", "event loop blocking"],
    difficulty: "EXTREME"
  },
  {
    id: "eng-3",
    question: "You have a Postgres table with 80M rows. A multi-column query on (tenant_id, created_at, status) takes 18 seconds. Design the optimal index strategy.",
    scenario: "Database Bottleneck: Sequential scan on massive billing telemetry ledger.",
    expectedKeywords: ["composite index", "B-Tree", "covering index", "partial index", "EXPLAIN ANALYZE"],
    difficulty: "HIGH"
  },
  {
    id: "eng-4",
    question: "Two services experience a distributed transaction deadlock during customer refund processing. What architectural pattern guarantees eventual consistency without 2PC blocking?",
    scenario: "Financial Anomaly: Inventory restored but credit card refund lock times out.",
    expectedKeywords: ["Saga pattern", "compensating transaction", "outbox pattern", "idempotency key"],
    difficulty: "EXTREME"
  },
  {
    id: "eng-5",
    question: "A WebSocket cluster serving 500,000 concurrent traders suffers from sticky session disconnection storms. How do you design broadcast pub/sub scale?",
    scenario: "Realtime Drift: High-frequency market tickers out of sync across regional edge servers.",
    expectedKeywords: ["Redis Streams", "NATS", "sticky sessions", "socket.io redis adapter", "horizontal pod autoscaler"],
    difficulty: "HIGH"
  }
];

const UPSC_QUESTIONS_SEED = [
  {
    id: "upsc-1",
    question: "A chemical factory leakage threatens 50,000 residents in an unauthorized colony. The industrial lobby pressures you to delay evacuation to avoid market panic. What is your immediate executive order in the first 10 minutes?",
    scenario: "Disaster Management Crisis: Toxic ammonia gas cloud detected moving eastward.",
    expectedKeywords: ["Disaster Management Act 2005", "Section 144", "windward evacuation", "triage", "NDRF deployment"],
    difficulty: "CRITICAL"
  },
  {
    id: "upsc-2",
    question: "A riot is triggered by deepfake footage of a religious icon circulating on encrypted messaging apps. How do you balance internet freedom with imminent law & order collapse?",
    scenario: "Communal Tension Escalation: Crowds gathering at district square within 15 minutes.",
    expectedKeywords: ["temporary telecom suspension rules", "peace committee", "verified rebuttal broadcast", "flag march"],
    difficulty: "HIGH"
  },
  {
    id: "upsc-3",
    question: "You discover your senior administrative mentor diverted public tribal welfare development funds to an election road project. Whistleblowing ends your career; silence breaches public trust. State your ethical calculus.",
    scenario: "Administrative Ethics Dilemma: Comptroller audit arriving in 48 hours.",
    expectedKeywords: ["Nolan Principles", "constitutional morality", "objective truth", "Vigilance Commission report", "integrity"],
    difficulty: "EXTREME"
  },
  {
    id: "upsc-4",
    question: "Crop residue burning in neighbouring states violates national air quality limits, but arresting protesting farmer unions will trigger state-wide transport blockade. Formulate a 24-hour enforcement compromise.",
    scenario: "Inter-State Policy Deadlock: AQI crosses 480 (Severe Plus emergency).",
    expectedKeywords: ["inter-state council", "in-situ management subsidies", "staggered enforcement", "Supreme Court directives"],
    difficulty: "HIGH"
  },
  {
    id: "upsc-5",
    question: "During critical public food distribution during a flood, biometric authentication fails for 30% of destitute families due to severed optical cables. Do you override protocol risking phantom leakages?",
    scenario: "Famine Threat & Protocol Collision: Starvation complaints reported in submerged relief camps.",
    expectedKeywords: ["doctrine of necessity", "manual ledger with video recording", "zero starvation mandate", "post-facto reconciliation"],
    difficulty: "CRITICAL"
  }
];

// Start Stress Test Session
router.post('/start', requireAuth, async (req, res) => {
  try {
    const { track = 'ENGINEERING' } = req.body;
    const selectedTrack = track === 'UPSC_CIVIL' ? 'UPSC_CIVIL' : 'ENGINEERING';

    const prompt = `Generate exactly 5 brutal, high-intensity rapid-fire stress test interview questions for domain: ${selectedTrack}.
Each question must test logic under strict 30-second time limits. Return strict JSON.`;

    const questionsData = await generateStructuredAI({
      systemInstruction: "You are an elite, merciless technical examiner and crisis evaluation board member. You craft intense, realistic dilemmas.",
      prompt,
      responseSchema: stressTestQuestionsSchema,
      fallbackGenerator: () => ({
        questions: selectedTrack === 'UPSC_CIVIL' ? UPSC_QUESTIONS_SEED : ENGINEERING_QUESTIONS_SEED
      })
    });

    res.json({
      track: selectedTrack,
      timePerQuestionSeconds: 30,
      totalQuestions: 5,
      questions: questionsData.questions
    });
  } catch (err) {
    console.error("Stress test start error:", err);
    res.status(500).json({ error: "Failed to generate stress test questions." });
  }
});

// Evaluate and Submit Stress Test
router.post('/submit', requireAuth, validateBody(stressTestSubmitSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { track, answers } = req.validatedBody;

    // Calculate score heuristics
    let totalTimeTaken = 0;
    let answeredCount = 0;
    let keywordHits = 0;

    answers.forEach(ans => {
      totalTimeTaken += ans.timeTakenSeconds;
      if (ans.userAnswer.trim().length > 10) answeredCount++;
      const textLower = ans.userAnswer.toLowerCase();
      // Heuristic keyword match
      const commonKeyTerms = ["queue", "index", "saga", "event", "thread", "worker", "redis", "lock", "evacuation", "ethics", "morality", "act", "triage", "protocol", "scale"];
      commonKeyTerms.forEach(term => {
        if (textLower.includes(term)) keywordHits++;
      });
    });

    const avgTimePerQuestion = totalTimeTaken / 5;
    // Speed score: 30s max, faster answer with substantial content yields higher score
    const speedScore = Math.min(100, Math.max(30, Math.round(100 - (avgTimePerQuestion / 30) * 40)));
    // Composure score: penalty for unanswered questions or panic gibberish
    const composureScore = Math.min(100, Math.max(20, Math.round((answeredCount / 5) * 80 + (avgTimePerQuestion < 28 ? 20 : 0))));
    // Logic score: keyword hits + depth
    const logicScore = Math.min(100, Math.max(25, Math.round(Math.min(60, keywordHits * 12) + (answeredCount * 8))));

    // Composite total: 40% Logic + 40% Composure + 20% Speed
    const totalScore = Math.round((logicScore * 0.4) + (composureScore * 0.4) + (speedScore * 0.2));

    const prompt = `Evaluate the candidate's answers in a 30-second rapid-fire stress test in ${track}:
${JSON.stringify(answers, null, 2)}
Return strict JSON with composite scores, feedback, and question breakdowns.`;

    const evaluation = await generateStructuredAI({
      systemInstruction: "You are the Chief Stress Evaluation Board. Analyze candidate clarity under time pressure without softening the blow.",
      prompt,
      responseSchema: stressTestEvaluationSchema,
      fallbackGenerator: () => ({
        totalScore,
        logicScore,
        composureScore,
        speedScore,
        feedback: totalScore >= 75 
          ? "Exceptional composure under cognitive assault. Maintained structural precision and zero panic divergence."
          : totalScore >= 50
          ? "Acceptable survival rate. Experienced minor cognitive throttling on architectural edge cases, but stood ground."
          : "Severe cognitive panic detected. Answered with vague generalities when specific technical protocol was required.",
        questionBreakdowns: answers.map((a, i) => ({
          questionId: a.questionId,
          verdict: a.userAnswer.length > 25 ? "SURVIVED" : "FAILED_UNDER_PRESSURE",
          logicAssessment: a.userAnswer.length > 25 ? "Contained viable first-principles logic." : "Superficial response, lacked core system mechanics.",
          score: Math.min(100, Math.max(30, a.userAnswer.length * 2))
        }))
      })
    });

    const resultRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      track,
      total_score: evaluation.totalScore || totalScore,
      logic_score: evaluation.logicScore || logicScore,
      composure_score: evaluation.composureScore || composureScore,
      speed_score: evaluation.speedScore || speedScore,
      questions_answered: answers.length,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      await supabase.from('stress_test_results').insert(resultRecord).catch(e => console.warn(e));
    }
    memoryStore.stressTestResults.push(resultRecord);

    res.json({
      resultId: resultRecord.id,
      track,
      scores: {
        total: evaluation.totalScore || totalScore,
        logic: evaluation.logicScore || logicScore,
        composure: evaluation.composureScore || composureScore,
        speed: evaluation.speedScore || speedScore
      },
      feedback: evaluation.feedback,
      breakdown: evaluation.questionBreakdowns
    });
  } catch (err) {
    console.error("Stress test submit error:", err);
    res.status(500).json({ error: "Failed to evaluate stress test performance." });
  }
});

export default router;
