import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { supabase, memoryStore } from '../config/db.js';

const router = express.Router();

const DAILY_TRENDING_QUESTIONS = [
  {
    id: "q-1",
    tag: "SALARY_ANCHOR",
    category: "HR Negotiation",
    question: "We noticed your expected salary is 40% above our standard bracket. How do you justify this gap when your peers accepted our base?",
    tacticHint: "Use an Accusation Audit + Calibrated Question: 'It probably sounds like I'm asking for the moon without cause. How is the team measuring top decile output for this quarter?'"
  },
  {
    id: "q-2",
    tag: "CONCURRENCY_SPIKE",
    category: "System Design",
    question: "During an flash sale checkout, multiple users attempt to reserve the final remaining inventory item. How do you prevent overselling without crippling p99 latency?",
    tacticHint: "Propose Redis Lua scripting with single-threaded atomic decrements before falling back to Postgres SELECT FOR UPDATE."
  },
  {
    id: "q-3",
    tag: "DEADLOCK_RESOLVE",
    category: "Distributed Systems",
    question: "Your distributed payment gateway commits in Stripe but crashes before updating your ledger. How do you ensure exactly-once semantics?",
    tacticHint: "Deploy the Transactional Outbox pattern paired with Debezium CDC and idempotent webhook consumer keys."
  },
  {
    id: "q-4",
    tag: "PRESSURE_ETHICS",
    category: "High-Stakes HR",
    question: "If we give you your requested offer right now on the spot, will you cancel all remaining interviews and sign before leaving this room?",
    tacticHint: "Use Tactical Empathy + 'No'-oriented question: 'I know you need to secure this role immediately. Would it be unreasonable if I reviewed the complete written benefits contract overnight?'"
  }
];

const RECOMMENDED_READINGS = [
  {
    id: "book-1",
    title: "Never Split the Difference",
    author: "Chris Voss",
    focus: "FBI Hostage Negotiation Tactics, Tactical Empathy, Labeling, & Calibrated Questions.",
    badge: "ESSENTIAL"
  },
  {
    id: "book-2",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    focus: "Distributed transactions, consensus algorithms, partition tolerance, and storage engines.",
    badge: "SYSTEMS"
  },
  {
    id: "book-3",
    title: "Crucial Conversations: Tools for Talking When Stakes Are High",
    author: "Kerry Patterson et al.",
    focus: "Emotional composure, psychological safety, and mastering high-tension executive dialogues.",
    badge: "COMMUNICATION"
  },
  {
    id: "book-4",
    title: "The Effective Executive",
    author: "Peter Drucker",
    focus: "Strategic prioritization, executive decision-making under uncertainty, and high leverage.",
    badge: "EXECUTIVE"
  }
];

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    let sessions = [];
    let stressResults = [];
    let roasts = [];

    if (supabase) {
      const [sessRes, stressRes, roastRes] = await Promise.all([
        supabase.from('negotiation_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('stress_test_results').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('resume_roasts').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ]);

      sessions = sessRes.data || [];
      stressResults = stressRes.data || [];
      roasts = roastRes.data || [];
    }

    if (sessions.length === 0) {
      sessions = Array.from(memoryStore.negotiationSessions.values()).filter(s => s.user_id === userId);
    }
    if (stressResults.length === 0) {
      stressResults = memoryStore.stressTestResults.filter(r => r.user_id === userId);
    }
    if (roasts.length === 0) {
      roasts = memoryStore.resumeRoasts.filter(r => r.user_id === userId);
    }

    // Compute aggregated metrics
    const totalNegotiations = sessions.length;
    const topOffer = sessions.reduce((max, s) => Math.max(max, Number(s.final_offer || s.initial_offer || 250000)), 250000);
    const avgCompliance = totalNegotiations > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + (s.compliance_score || 0), 0) / totalNegotiations) 
      : 10;
    
    const topStressScore = stressResults.reduce((max, r) => Math.max(max, r.total_score || 0), 0);

    res.json({
      metrics: {
        totalNegotiations,
        topOffer,
        avgCompliance,
        totalStressTests: stressResults.length,
        topStressScore,
        totalRoasts: roasts.length
      },
      recentNegotiations: sessions.slice(0, 5),
      recentStressTests: stressResults.slice(0, 5),
      recentRoasts: roasts.slice(0, 5),
      dailyTrendingQuestions: DAILY_TRENDING_QUESTIONS,
      recommendedReadings: RECOMMENDED_READINGS
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to load dashboard metrics." });
  }
});

export default router;
