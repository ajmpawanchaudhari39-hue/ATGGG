import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

import WebSocket from 'ws';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase-project')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      realtime: {
        transport: WebSocket
      }
    });
    console.log("✅ Supabase client initialized successfully with WebSocket support.");
  } catch (err) {
    console.warn("⚠️ Failed to initialize Supabase client:", err.message);
  }
} else {
  console.warn("⚠️ Supabase credentials not configured or using placeholders. In-memory demo persistence active.");
}

// In-memory fallback repository for development/demo mode
export const memoryStore = {
  profiles: new Map(),
  negotiationSessions: new Map(),
  negotiationLogs: [],
  stressTestResults: [],
  resumeRoasts: []
};

// Seed a default demo profile
memoryStore.profiles.set('00000000-0000-0000-0000-000000000001', {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'candidate@interrogate.ai',
  full_name: 'Alex Mercer',
  created_at: new Date().toISOString()
});

export { supabase };
