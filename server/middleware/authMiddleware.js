import { supabase, memoryStore } from '../config/db.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Authorization header with Bearer token is missing."
    });
  }

  const token = authHeader.split(' ')[1];

  // Demo / local test token support
  if (token === 'demo-token' || token === 'guest-token' || !supabase) {
    const demoUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'candidate@interrogate.ai',
      user_metadata: { full_name: 'Agent Alex Mercer' }
    };
    req.user = demoUser;
    return next();
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // Fallback for expired token or local test convenience
      if (process.env.NODE_ENV !== 'production') {
        req.user = {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'candidate@interrogate.ai',
          user_metadata: { full_name: 'Agent Alex Mercer' }
        };
        return next();
      }

      return res.status(401).json({
        error: "Invalid or expired token",
        message: error ? error.message : "User could not be verified."
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Internal authentication verification failure" });
  }
};
