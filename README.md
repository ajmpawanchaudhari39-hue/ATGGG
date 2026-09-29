# Interro-Gate AI ⚡
> **High-Stakes HR Salary Negotiation & Stress Test Simulator**  
> *Powered by Chris Voss FBI Hostage Negotiation Tactics, Gemini 2.5 Flash, React, and Supabase.*

---

## 🎯 Executive Overview

Fresh engineering graduates and junior developers often possess solid coding fundamentals but suffer severe vulnerability during corporate salary negotiations. When confronted by hostile HR round tactics, candidates panic and accept lowball compensation (e.g., ₹2.5 LPA – ₹3.0 LPA).

**Interro-Gate AI** provides an adversarial, voice-first, gamified combat arena designed around **Chris Voss's FBI Hostage Negotiation Tactics** (*Mirroring, Labeling, Calibrated Questions, Accusation Audit, Tactical Empathy*). The platform features an AI engine using the official `@google/genai` SDK that evaluates candidate responses in real time, extracts psychological maneuvers, dynamically shifts compliance and salary offers, and stress-tests logic under rapid-fire time bounds.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18+, Vite, Tailwind CSS (Cyberpunk Glassmorphism) | High-performance interactive UI & dark glass theme |
| **Animation & Voice** | Web Speech API, Framer Motion, Canvas Confetti | Voice STT/TTS synthesis, real-time waveform & counter animations |
| **Icons** | Lucide React | High-density cyberpunk HUD icons |
| **Backend Server** | Node.js 20+, Express.js (ES Modules) | High-throughput API gateway with Zod payload validation |
| **Security** | Helmet, CORS, Express-Rate-Limit | Header hardening & IP-based rate limiting (100 req / 15 min) |
| **Database & Auth** | Supabase PostgreSQL, `@supabase/supabase-js` | Multi-tenant RLS data isolation & JWT authentication |
| **AI Engine** | Google Gen AI SDK (`@google/genai`), Gemini 2.5 Flash | Real-time FBI tactic extraction with strict JSON schemas |

---

## 🚀 Key Feature Modules

### 1. The Interrogation Room (`/interrogate`)
- **Adversarial Director**: Marcus Vance, Senior Vice President of Global Talent Acquisition.
- **Strict 5-Turn Sequence**: Vance opens with a ₹2.5 LPA hostile anchor; your objective is to push the offer toward the ₹8.0 LPA ceiling.
- **Live Tactic Extraction**: Automatically detects **Mirroring**, **Labeling**, **Calibrated Questions**, **Accusation Audit**, and **Tactical Empathy**.
- **Real-Time Telemetry**: Animated `OfferTracker` and radial `TacticMeter` showing turn-by-turn psychological leverage.
- **Voice-First**: Web Speech API speech-to-text recording plus spoken AI response playback.

### 2. The Stress Test Arena (`/stress-test`)
- **30-Second Rapid-Fire Timers**: Strict countdown per question testing composure under time pressure.
- **Domain Tracks**:
  - `ENGINEERING`: System Design, Node.js libuv internals, Postgres indexing, Saga pattern, WebSocket broadcast.
  - `UPSC_CIVIL`: Industrial disaster triage, communal riots, administrative ethics, farm residue dispute.
- **Composite Score Triad**: Weighted scoring based on **Logic (40%)**, **Composure (40%)**, and **Speed (20%)**.

### 3. Resume Roaster Zone (`/resume-roaster`)
- **Drag-and-Drop Dropzone**: Paste or upload resume content with scanning laser animation.
- **Unfiltered Recruiter Roast**: Identifies filler buzzwords, absent production metrics, and instant rejection red flags.
- **Remediation Plan**: Actionable rewrite suggestions formatted around Google's X-Y-Z formula.

### 4. The Intel Hub Dashboard (`/dashboard`)
- **Aggregated Performance Metrics**: Peak salary offer extracted, average compliance score, and total drills.
- **Daily High-Stakes Questions**: Curated tactical scenarios with FBI counter-strategies.
- **Strategic Reading Grid**: Curated reading list (Chris Voss, Martin Kleppmann, Kerry Patterson, Peter Drucker).
- **Session Replay History**: Historical archive of completed negotiations and stress test scorecards.

---

## 📁 Repository Structure

```
interro-gate-ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top HUD navigation & status
│   │   │   ├── OfferTracker.jsx    # Animated neon INR/LPA counter
│   │   │   ├── TacticMeter.jsx     # Radial compliance & leverage meter
│   │   │   ├── VoiceRecorder.jsx   # Web Speech API recorder & TTS toggle
│   │   │   ├── ChatBox.jsx         # Terminal-styled interrogation stream
│   │   │   ├── TimerGauge.jsx      # 30-second circular countdown gauge
│   │   │   ├── ResumeDropzone.jsx  # Drag-and-drop resume scanner
│   │   │   └── RoastCard.jsx       # Brutal critique & fixes card
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Supabase Auth + Guest Mode
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Cyberpunk hero & rules portal
│   │   │   ├── Auth.jsx            # Authentication terminal
│   │   │   ├── Dashboard.jsx       # Intel Hub & performance telemetry
│   │   │   ├── Interrogate.jsx     # 5-turn hostile HR arena
│   │   │   ├── StressTest.jsx      # 30s timed crisis arena
│   │   │   └── ResumeRoaster.jsx   # Unfiltered resume critique
│   │   ├── services/
│   │   │   ├── api.js              # Express API client with JWT headers
│   │   │   └── supabaseClient.js   # Supabase client initializer
│   │   ├── App.jsx                 # Route definitions & guards
│   │   ├── index.css               # Cyberpunk design system & glassmorphism
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── config/
│   │   ├── db.js                   # Supabase client + resilient in-memory store
│   │   └── gemini.js               # @google/genai SDK setup & fallback generator
│   ├── middleware/
│   │   ├── authMiddleware.js       # Bearer token verification & guest mode
│   │   └── validators.js           # Zod schema validation rules
│   ├── routes/
│   │   ├── negotiationRoutes.js    # Marcus Vance AI & FBI tactic engine
│   │   ├── stressTestRoutes.js     # Rapid-fire 30s question generator & grader
│   │   ├── resumeRoutes.js         # Brutal resume roaster engine
│   │   └── dashboardRoutes.js      # Aggregated metrics & daily intelligence
│   ├── schemas/
│   │   └── aiSchemas.js            # Strict JSON response schemas for Gemini
│   ├── index.js                    # Express application entry point
│   └── package.json
├── schema.sql                      # Production PostgreSQL migration & RLS policies
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+
- **npm**: v10+

### 2. Backend Setup
```bash
cd server
npm install
```

Configure `server/.env`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
CORS_ORIGIN=http://localhost:5173
```

Start the backend:
```bash
npm start
```
*Note: If no Supabase or Gemini keys are supplied, the backend runs in a resilient local simulation mode with tactical heuristics enabled.*

### 3. Frontend Setup
```bash
cd client
npm install
```

Configure `client/.env`:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🗄️ Database Setup (Supabase)

Copy and execute the entire content of [`schema.sql`](./schema.sql) in the **Supabase SQL Editor**:
- Creates `profiles`, `negotiation_sessions`, `negotiation_logs`, `stress_test_results`, and `resume_roasts` tables.
- Enables **Row Level Security (RLS)** on all tables with `auth.uid() = user_id` boundary checks.
- Adds realtime publications for `negotiation_sessions` and `negotiation_logs`.

---

## 🔐 API Reference

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/negotiation/start` | Initialize 5-turn session with ₹2.5 LPA opening | Yes |
| `POST` | `/api/negotiation/turn` | Evaluate candidate tactic, return revised offer & HR counter | Yes |
| `GET` | `/api/negotiation/history/:sessionId` | Retrieve turn-by-turn transcript and metrics | Yes |
| `POST` | `/api/stress-test/start` | Generate 5 rapid-fire questions for selected track | Yes |
| `POST` | `/api/stress-test/submit` | Evaluate answers (Composure, Logic, Speed) & record score | Yes |
| `POST` | `/api/resume/roast` | Execute unfiltered recruiter critique and action plan | Yes |
| `GET` | `/api/dashboard/stats` | Fetch aggregate metrics, daily questions & reading list | Yes |
| `GET` | `/api/health` | Health check endpoint | No |

---

## 🛡️ License
MIT License. Built for candidates fighting corporate lowball offers.
#   S P I D E Y  
 #   A T G G G  
 #   A T G G G  
 