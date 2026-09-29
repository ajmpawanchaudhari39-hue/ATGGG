import { z } from 'zod';

export const startNegotiationSchema = z.object({
  jobTitle: z.string().min(2).max(100).default("Software Development Engineer - I"),
});

export const turnNegotiationSchema = z.object({
  sessionId: z.string().uuid(),
  turnNumber: z.number().int().min(1).max(5),
  userMessage: z.string().min(2, "Message too short").max(1000, "Message exceeds 1000 chars"),
  currentOffer: z.number().positive(),
  currentCompliance: z.number().min(0).max(100)
});

export const stressTestSubmitSchema = z.object({
  track: z.enum(["ENGINEERING", "UPSC_CIVIL"]),
  answers: z.array(z.object({
    questionId: z.string(),
    userAnswer: z.string().min(1),
    timeTakenSeconds: z.number().nonnegative()
  })).length(5)
});

export const resumeRoastSchema = z.object({
  resumeText: z.string().min(50, "Resume content too brief for accurate roasting.").max(15000)
});

// Reusable Express middleware validator
export const validateBody = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.validatedBody = parsed;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    return res.status(400).json({ error: "Invalid request payload" });
  }
};
