import React from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, ShieldAlert, Zap, Flame, Activity, ArrowRight, Award, Terminal, Cpu, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  const fbiTactics = [
    { name: "Mirroring", desc: "Repeat the last 1–3 critical words as a question to induce involuntary elaboration." },
    { name: "Labeling", desc: "Acknowledge the interviewer's hidden constraints: 'It seems like budget caps are strict...'" },
    { name: "Calibrated Questions", desc: "Pose 'How' or 'What' inquiries that force the employer to problem-solve on your behalf." },
    { name: "Accusation Audit", desc: "Preemptively enumerate all worst-case criticisms before they can be leveraged against you." },
    { name: "Tactical Empathy", desc: "Demonstrate complete comprehension of executive pressures to dismantle adversarial barriers." }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-neonCyan/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyber-neonPink/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10 flex flex-col items-center text-center">
        
        {/* Top Operational Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-card border border-cyber-neonCyan/30 mb-8 shadow-[0_0_20px_rgba(0,243,255,0.2)] animate-pulse">
          <Terminal className="w-4 h-4 text-cyber-neonCyan" />
          <span className="font-mono text-xs text-cyber-neonCyan uppercase tracking-widest">
            SIMULATION PROTOCOL 2.5 // HOSTILE HR ROUND
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase max-w-5xl leading-[1.08]">
          STOP SETTLING FOR <span className="text-cyber-neonPink text-glow-pink">₹2.5 LPA LOWBALLS</span>.
          <br className="hidden sm:inline" />
          MASTER THE <span className="text-cyber-neonCyan text-glow-cyan">INTERROGATION</span>.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-gray-300 max-w-3xl font-sans leading-relaxed">
          The first voice-enabled, gamified AI interview arena armed with <span className="text-white font-semibold">Chris Voss's FBI Hostage Negotiation Tactics</span>. Stand face-to-face with adversarial Corporate HR Director Marcus Vance, outmaneuver budget anchors, and claim your true market value.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/interrogate"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-neonCyan to-blue-500 hover:from-blue-500 hover:to-cyber-neonCyan text-black font-display font-extrabold text-base tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:scale-105"
          >
            <Crosshair className="w-5 h-5 text-black" />
            <span>ENTER THE INTERROGATION ROOM</span>
          </Link>

          <Link
            to="/stress-test"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-neonPink hover:text-cyber-neonPink text-white font-mono text-sm tracking-wider uppercase transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>30S STRESS TEST ARENA</span>
          </Link>
        </div>

        {/* Live Simulation Parameters Banner */}
        <div className="mt-16 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl glass-panel text-left">
          <div className="p-3 border-r border-cyber-border/60">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Base Offer</span>
            <div className="font-display font-bold text-xl text-cyber-neonPink mt-0.5">₹2.5 LPA</div>
            <span className="text-[10px] font-mono text-gray-500">Hostile Anchor</span>
          </div>

          <div className="p-3 border-r border-cyber-border/60">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Target Cap</span>
            <div className="font-display font-bold text-xl text-cyber-neonGreen mt-0.5">₹8.0 LPA</div>
            <span className="text-[10px] font-mono text-gray-500">Tier-1 Ceiling</span>
          </div>

          <div className="p-3 border-r border-cyber-border/60">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Negotiation Limit</span>
            <div className="font-display font-bold text-xl text-cyber-neonCyan mt-0.5">5 TURNS</div>
            <span className="text-[10px] font-mono text-gray-500">Strict Sequence</span>
          </div>

          <div className="p-3">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">AI Engine</span>
            <div className="font-display font-bold text-xl text-white mt-0.5">GEMINI 2.5</div>
            <span className="text-[10px] font-mono text-gray-500">Tactic Detection</span>
          </div>
        </div>

      </section>

      {/* Feature Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            CORE COMBAT SIMULATION MODULES
          </h2>
          <p className="mt-2 text-sm text-gray-400 font-mono">
            ENGINEERED TO ELIMINATE JUNIOR CANDIDATE HESITATION UNDER HOSTILE SCRUTINY
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1: The Interrogation Room */}
          <div className="glass-panel-cyan p-6 sm:p-8 rounded-2xl flex flex-col justify-between group hover:border-cyber-neonCyan transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyber-card border border-cyber-neonCyan/40 flex items-center justify-center mb-5 text-cyber-neonCyan shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                <Crosshair className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-2">
                1. The Interrogation Room
              </h3>
              <p className="text-sm text-gray-300 font-sans leading-relaxed mb-4">
                Voice-first, 5-turn showdown against Director Marcus Vance. Uses real-time speech recognition and NLP tactic extraction to measure psychological compliance and push offers from ₹2.5 LPA to ₹8.0 LPA.
              </p>
            </div>
            <Link
              to="/interrogate"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyber-neonCyan hover:underline uppercase tracking-wider pt-4 border-t border-cyber-border/60"
            >
              <span>Initiate Negotiation Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 2: The Stress Test Arena */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between group hover:border-cyber-neonPink transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyber-card border border-cyber-neonPink/40 flex items-center justify-center mb-5 text-cyber-neonPink shadow-[0_0_15px_rgba(255,0,85,0.2)]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-2">
                2. The Stress Test Arena
              </h3>
              <p className="text-sm text-gray-300 font-sans leading-relaxed mb-4">
                Rapid-fire 30-second countdowns across Engineering (System Design, DB Indexing, Concurrency) and UPSC Civil tracks. Evaluates logic clarity, composure, and speed under simulated executive distress.
              </p>
            </div>
            <Link
              to="/stress-test"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyber-neonPink hover:underline uppercase tracking-wider pt-4 border-t border-cyber-border/60"
            >
              <span>Test Crisis Composure</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 3: Resume Roaster */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between group hover:border-cyber-neonGreen transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyber-card border border-cyber-neonGreen/40 flex items-center justify-center mb-5 text-cyber-neonGreen shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-2">
                3. Resume Roaster Zone
              </h3>
              <p className="text-sm text-gray-300 font-sans leading-relaxed mb-4">
                Drag-and-drop your resume for an unfiltered, brutal critique. Strips out corporate buzzwords, exposes instant rejection red flags, and constructs a concrete Google X-Y-Z remediation plan.
              </p>
            </div>
            <Link
              to="/resume-roaster"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyber-neonGreen hover:underline uppercase tracking-wider pt-4 border-t border-cyber-border/60"
            >
              <span>Expose Resume Flaws</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* FBI Hostage Tactics Arsenal Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-cyber-border/80">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          
          <div className="lg:w-1/3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-neonCyan">TACTICAL DOCTRINE</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight mt-1 mb-4">
              CHRIS VOSS FBI TACTICS ARSENAL
            </h2>
            <p className="text-sm text-gray-300 font-sans leading-relaxed mb-6">
              When encountering an intimidating HR director with entrenched budget directives, emotional appeals fail. You must leverage proven psychological hostage negotiation mechanics.
            </p>
            <div className="p-4 rounded-xl bg-cyber-card/80 border border-cyber-border text-xs font-mono text-gray-400">
              <span className="text-cyber-neonPink font-bold">[RULE 01]:</span> Never split the difference. A compromise in the middle is a lowball disguised as civility.
            </div>
          </div>

          <div className="lg:w-2/3 space-y-3 w-full">
            {fbiTactics.map((tactic, idx) => (
              <div key={idx} className="p-4 rounded-xl glass-panel border border-cyber-border flex items-start gap-4">
                <span className="font-mono text-sm font-bold text-cyber-neonCyan">0{idx + 1}</span>
                <div>
                  <h4 className="font-display font-bold text-base text-white">{tactic.name}</h4>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">{tactic.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-cyber-border/80 py-8 px-4 text-center font-mono text-xs text-gray-500 bg-cyber-bg/90">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-neonCyan" />
            <span className="text-gray-300 font-bold">INTERRO-GATE AI</span>
            <span>— Advanced Voice & Hostage Negotiation Engine</span>
          </div>
          <div>
            Built with React, Vite, Express, Google Gen AI SDK & Supabase
          </div>
        </div>
      </footer>

    </div>
  );
}
