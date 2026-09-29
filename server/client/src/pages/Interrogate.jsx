import React, { useState, useEffect } from 'react';
import { negotiationApi } from '../services/api';
import OfferTracker from '../components/OfferTracker';
import TacticMeter from '../components/TacticMeter';
import VoiceRecorder from '../components/VoiceRecorder';
import ChatBox from '../components/ChatBox';
import confetti from 'canvas-confetti';
import { 
  Send, RefreshCw, Trophy, AlertTriangle, ShieldCheck, 
  HelpCircle, ChevronDown, ChevronUp, Sparkles, Volume2 
} from 'lucide-react';

const JOB_ROLES = [
  "Software Development Engineer - I",
  "Full-Stack Developer",
  "Frontend Engineer",
  "Backend Systems Developer",
  "DevOps & Infrastructure Engineer"
];

const QUICK_TACTIC_TEMPLATES = [
  {
    name: "Mirroring",
    text: "Strict budget caps?",
    hint: "Repeats the last 1–3 words with a curious, calm voice."
  },
  {
    name: "Labeling",
    text: "It seems like you have strict departmental limits and a lot of pressure from leadership to keep hiring costs constrained.",
    hint: "Calls out Vance's hidden constraints without being defensive."
  },
  {
    name: "Calibrated Question",
    text: "How am I supposed to accept that when the market benchmark for this role is significantly higher and my day-one impact will directly offset that?",
    hint: "Starts with 'How' or 'What' to make Vance solve the problem."
  },
  {
    name: "Accusation Audit",
    text: "You probably think I'm being demanding or ungrateful for a junior hire, but I want to ensure my compensation aligns with top-tier output.",
    hint: "Disarms all worst-case HR thoughts upfront."
  },
  {
    name: "Tactical Empathy",
    text: "I completely understand the fiscal targets you have to meet this quarter, and I respect how disciplined your team is with headcount allocation.",
    hint: "Validates his perspective first before introducing your counter."
  }
];

export default function Interrogate() {
  const [selectedRole, setSelectedRole] = useState(JOB_ROLES[0]);
  const [sessionId, setSessionId] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [maxTurns, setMaxTurns] = useState(5);
  const [currentOffer, setCurrentOffer] = useState(250000);
  const [complianceScore, setComplianceScore] = useState(10);
  const [complianceDelta, setComplianceDelta] = useState(0);
  const [detectedTactics, setDetectedTactics] = useState([]);
  const [tacticalFeedback, setTacticalFeedback] = useState("");
  const [logs, setLogs] = useState([]);
  const [userDraft, setUserDraft] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Text to Speech playback for Marcus Vance
  const speakText = (text) => {
    if (!autoSpeak || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.9; // Deeper authoritative corporate tone
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Male') || v.name.includes('Natural')));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("TTS playback warning:", err);
    }
  };

  const startSession = async (roleToUse = selectedRole) => {
    try {
      setIsInitializing(true);
      setSessionCompleted(false);
      setUserDraft("");
      setComplianceDelta(0);
      setDetectedTactics([]);
      setTacticalFeedback("");
      
      const res = await negotiationApi.start(roleToUse);
      setSessionId(res.sessionId);
      setCurrentOffer(res.initialOffer);
      setComplianceScore(res.complianceScore);
      setCurrentTurn(0);
      setMaxTurns(res.maxTurns || 5);

      const initialLog = {
        turnNumber: 0,
        hrMessage: res.hrMessage,
        userMessage: null,
        detectedTactics: [],
        tacticalFeedback: "Vance opened with a heavy psychological anchor at ₹2.5 LPA. Do not accept this base."
      };
      setLogs([initialLog]);
      speakText(res.hrMessage);
    } catch (err) {
      console.error("Start session error:", err);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    startSession(selectedRole);
  }, []);

  const handleSendResponse = async (e) => {
    if (e) e.preventDefault();
    const message = userDraft.trim();
    if (!message || isEvaluating || sessionCompleted) return;

    const nextTurn = currentTurn + 1;
    setIsEvaluating(true);
    setUserDraft("");

    // Temporarily add candidate's response to UI
    const pendingLogIndex = logs.length;
    setLogs(prev => [...prev, {
      turnNumber: nextTurn,
      userMessage: message,
      hrMessage: null,
      detectedTactics: [],
      tacticalFeedback: ""
    }]);

    try {
      const res = await negotiationApi.submitTurn({
        sessionId,
        turnNumber: nextTurn,
        userMessage: message,
        currentOffer,
        currentCompliance: complianceScore
      });

      setCurrentTurn(nextTurn);
      setCurrentOffer(res.newOfferedSalary);
      setComplianceScore(res.newComplianceScore);
      setComplianceDelta(res.complianceScoreDelta);
      setDetectedTactics(res.detectedTactics);
      setTacticalFeedback(res.tacticalFeedback);

      // Update log with HR response
      setLogs(prev => {
        const copy = [...prev];
        copy[pendingLogIndex] = {
          turnNumber: nextTurn,
          userMessage: message,
          hrMessage: res.hrResponse,
          detectedTactics: res.detectedTactics,
          tacticalFeedback: res.tacticalFeedback
        };
        return copy;
      });

      speakText(res.hrResponse);

      if (res.isFinalTurn) {
        setSessionCompleted(true);
        if (res.newOfferedSalary > 350000) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      console.error("Turn submission error:", err);
      // Fallback update in case of error
      setLogs(prev => {
        const copy = [...prev];
        copy[pendingLogIndex] = {
          turnNumber: nextTurn,
          userMessage: message,
          hrMessage: "Director Vance glanced down at his spreadsheet. 'Your line broke up or you hesitated. Let us continue without distractions.'",
          detectedTactics: [],
          tacticalFeedback: "Request dropped. Vance capitalized on the silence."
        };
        return copy;
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApplyTemplate = (templateText) => {
    setUserDraft(templateText);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-card border border-cyber-neonCyan/40 flex items-center justify-center text-cyber-neonCyan">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl text-white uppercase tracking-tight flex items-center gap-2">
              <span>THE INTERROGATION ROOM</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-neonPink/20 text-cyber-neonPink border border-cyber-neonPink/30">
                LIVE ARENA
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-sans">
              Face Director Marcus Vance. Deploy FBI Hostage Tactics over 5 turns to break his ₹2.5 LPA anchor.
            </p>
          </div>
        </div>

        {/* Role Selector & Reset */}
        <div className="flex items-center gap-3">
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              startSession(e.target.value);
            }}
            disabled={isEvaluating}
            className="bg-cyber-card border border-cyber-border text-xs font-mono text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyber-neonCyan transition-all"
          >
            {JOB_ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <button
            onClick={() => startSession(selectedRole)}
            disabled={isEvaluating}
            title="Reset Negotiation"
            className="p-2.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-neonPink hover:text-cyber-neonPink text-gray-400 transition-all flex items-center gap-1.5 text-xs font-mono"
          >
            <RefreshCw className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Chat Terminal), Right Column (Live Trackers & Cheatsheet) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chat Terminal Arena (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col h-[680px]">
          <ChatBox 
            logs={logs} 
            isEvaluating={isEvaluating} 
            jobTitle={selectedRole} 
          />

          {/* User Input & Controls Dock */}
          <div className="mt-4 p-4 rounded-2xl glass-panel-cyan flex flex-col gap-3">
            <form onSubmit={handleSendResponse} className="flex items-center gap-2">
              
              {/* Web Speech Voice STT Recorder */}
              <VoiceRecorder 
                onTranscript={(transcript) => setUserDraft(transcript)}
                disabled={isEvaluating || sessionCompleted}
                autoSpeak={autoSpeak}
                onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
              />

              {/* Text Input */}
              <input
                type="text"
                disabled={isEvaluating || sessionCompleted}
                value={userDraft}
                onChange={(e) => setUserDraft(e.target.value)}
                placeholder={
                  sessionCompleted 
                    ? "Simulation concluded. Review scorecard or reset session."
                    : "Speak via mic or type FBI tactic response (e.g. 'How am I supposed to accept that when...')"
                }
                className="flex-1 bg-cyber-card border border-cyber-border rounded-xl px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-cyber-neonCyan font-sans transition-all"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!userDraft.trim() || isEvaluating || sessionCompleted}
                className={`p-3.5 rounded-xl font-display font-bold uppercase transition-all flex items-center justify-center shrink-0 ${
                  userDraft.trim() && !isEvaluating && !sessionCompleted
                    ? 'bg-cyber-neonCyan text-black hover:bg-white shadow-[0_0_15px_rgba(0,243,255,0.4)] cursor-pointer'
                    : 'bg-cyber-card border border-cyber-border text-gray-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>

            </form>

            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonCyan"></span>
                Turn {currentTurn} of {maxTurns} • Speak or type Chris Voss tactics
              </span>
              <button
                type="button"
                onClick={() => setShowCheatsheet(!showCheatsheet)}
                className="text-cyber-neonCyan hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{showCheatsheet ? "Hide Tactics Cheatsheet" : "FBI Tactics Drawer"}</span>
                {showCheatsheet ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Trackers & Sidebar (1 Col) */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* Live Salary Counter */}
          <OfferTracker 
            currentOffer={currentOffer}
            initialOffer={250000}
            maxOffer={800000}
            turnNumber={currentTurn}
            maxTurns={maxTurns}
          />

          {/* Tactic Meter */}
          <TacticMeter
            complianceScore={complianceScore}
            complianceDelta={complianceDelta}
            detectedTactics={detectedTactics}
            tacticalFeedback={tacticalFeedback}
          />

          {/* Tactics Cheatsheet Drawer */}
          {showCheatsheet && (
            <div className="glass-panel p-4 rounded-xl border border-cyber-neonCyan/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-cyber-neonCyan font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Tactical Response Templates
                </span>
                <span className="text-[10px] font-mono text-gray-400">CLICK TO INSERT</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {QUICK_TACTIC_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl.text)}
                    className="w-full text-left p-2.5 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-cyber-neonCyan transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono font-bold text-cyber-neonCyan group-hover:underline">
                        {tmpl.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 font-sans italic line-clamp-2">
                      "{tmpl.text}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Session Completed Outcome Modal */}
      {sessionCompleted && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-panel-cyan p-8 rounded-3xl max-w-lg w-full text-center relative overflow-hidden border border-cyber-neonCyan/60 shadow-[0_0_50px_rgba(0,243,255,0.3)]">
            
            <div className="w-16 h-16 rounded-2xl bg-cyber-card border border-cyber-neonCyan mx-auto flex items-center justify-center text-cyber-neonCyan mb-4 shadow-[0_0_20px_rgba(0,243,255,0.4)]">
              {currentOffer > 350000 ? <Trophy className="w-8 h-8 text-cyber-neonGreen" /> : <AlertTriangle className="w-8 h-8 text-cyber-neonPink" />}
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-cyber-neonCyan">
              NEGOTIATION SEQUENCE CONCLUDED
            </span>

            <h2 className="font-display font-black text-3xl text-white tracking-tight mt-1 mb-2">
              {currentOffer > 450000 ? "EXECUTIVE CONCESSION FORCED!" : currentOffer > 300000 ? "OFFER INCREMENTALLY RAISED" : "LOWBALL ANCHOR UNBROKEN"}
            </h2>

            <div className="p-4 rounded-xl bg-cyber-card/90 border border-cyber-border my-5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-400">Final Agreed Compensation:</span>
                <span className="text-cyber-neonGreen font-bold text-lg">₹{currentOffer.toLocaleString('en-IN')} ({(currentOffer / 100000).toFixed(2)} LPA)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-400">Total Value Extracted:</span>
                <span className="text-cyber-neonCyan font-bold">+₹{(currentOffer - 250000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-400">Final Compliance Leverage:</span>
                <span className="text-white font-bold">{complianceScore}%</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-sans mb-6 leading-relaxed">
              {currentOffer > 450000 
                ? "Marcus Vance was forced to concede substantial budget ceiling due to disciplined Chris Voss tactics. You avoided a standard entry-level lowball."
                : "You allowed Vance to maintain commercial leverage. Practice deeper Accusation Audits and Calibrated Questions to break through."}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => startSession(selectedRole)}
                className="flex-1 py-3.5 rounded-xl bg-cyber-neonCyan text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              >
                RUN REMATCH NEGOTIATION
              </button>
              <button
                onClick={() => setSessionCompleted(false)}
                className="px-4 py-3.5 rounded-xl bg-cyber-card border border-cyber-border text-gray-400 font-mono text-xs hover:text-white"
              >
                Inspect Transcript
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
