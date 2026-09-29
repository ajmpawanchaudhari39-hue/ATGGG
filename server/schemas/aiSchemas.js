export const negotiationResponseSchema = {
  type: "OBJECT",
  properties: {
    hrResponse: {
      type: "STRING",
      description: "Direct spoken dialogue from Marcus Vance to the candidate."
    },
    detectedTactics: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "List of valid FBI negotiation tactics detected in user input (e.g. MIRRORING, LABELING, CALIBRATED_QUESTION, ACCUSATION_AUDIT, TACTICAL_EMPATHY)."
    },
    complianceScoreDelta: {
      type: "INTEGER",
      description: "Integer change in compliance score (-15 to +25 based on quality of response)."
    },
    newOfferedSalary: {
      type: "NUMBER",
      description: "Updated salary offer in INR after evaluating candidate tactic."
    },
    tacticalFeedback: {
      type: "STRING",
      description: "Brief 1-sentence strategic critique explaining why the user response worked or failed."
    }
  },
  required: ["hrResponse", "detectedTactics", "complianceScoreDelta", "newOfferedSalary", "tacticalFeedback"]
};

export const resumeRoastResponseSchema = {
  type: "OBJECT",
  properties: {
    roastHeadline: { type: "STRING", description: "Brutal, catchy 1-line verdict." },
    overallScore: { type: "INTEGER", description: "Market readiness score 0-100." },
    brutalSummary: { type: "STRING", description: "Unfiltered 3-4 sentence roast." },
    weaknesses: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "List of specific weak points, fluff phrases, or missing essentials."
    },
    redFlags: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Top 3 red flags that lead to instant HR rejection."
    },
    actionableFixes: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Step-by-step concrete recommendations to dramatically improve resume impact."
    }
  },
  required: ["roastHeadline", "overallScore", "brutalSummary", "weaknesses", "redFlags", "actionableFixes"]
};

export const stressTestQuestionsSchema = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          question: { type: "STRING" },
          scenario: { type: "STRING" },
          expectedKeywords: { type: "ARRAY", items: { type: "STRING" } },
          difficulty: { type: "STRING" }
        },
        required: ["id", "question", "scenario", "expectedKeywords", "difficulty"]
      }
    }
  },
  required: ["questions"]
};

export const stressTestEvaluationSchema = {
  type: "OBJECT",
  properties: {
    totalScore: { type: "INTEGER", description: "Overall composite score 0-100." },
    logicScore: { type: "INTEGER", description: "Logic accuracy score 0-100 (40% weight)." },
    composureScore: { type: "INTEGER", description: "Composure and pressure resistance score 0-100 (40% weight)." },
    speedScore: { type: "INTEGER", description: "Speed and conciseness score 0-100 (20% weight)." },
    feedback: { type: "STRING", description: "Direct diagnostic summary of performance." },
    questionBreakdowns: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          questionId: { type: "STRING" },
          verdict: { type: "STRING" },
          logicAssessment: { type: "STRING" },
          score: { type: "INTEGER" }
        },
        required: ["questionId", "verdict", "logicAssessment", "score"]
      }
    }
  },
  required: ["totalScore", "logicScore", "composureScore", "speedScore", "feedback", "questionBreakdowns"]
};
