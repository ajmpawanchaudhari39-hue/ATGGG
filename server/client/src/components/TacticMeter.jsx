import React from 'react';
import { Gauge, ShieldCheck, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TACTIC_DEFINITIONS = {
  MIRRORING: {
    label: "Mirroring",
    desc: "Repeated last 1–3 words to prompt deeper elaboration.",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/40"
  },
  LABELING: {
    label: "Labeling",
    desc: "Identified Vance's hidden emotional/budgetary constraints.",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/40"
  },
  CALIBRATED_QUESTION: {
    label: "Calibrated Question",
    desc: "Asked open-ended 'How'/'What' question to shift the burden.",
    color: "bg-cyber-neonCyan/20 text-cyber-neonCyan border-cyber-neonCyan/40"
  },
  ACCUSATION_AUDIT: {
    label: "Accusation Audit",
    desc: "Diffused worst-case assumptions before they could be weaponized.",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/40"
  },
  TACTICAL_EMPATHY: {
    label: "Tactical Empathy",
    desc: "Acknowledged counterpart's constraints before offering counter.",
    color: "bg-cyber-neonGreen/20 text-cyber-neonGreen border-cyber-neonGreen/40"
  }
};

export default function TacticMeter({ complianceScore = 10, complianceDelta = 0, detectedTactics = [], tacticalFeedback = "" }) {
  const getMeterColor = (score) => {
    if (score >= 65) return { stroke: "#00ff88", text: "text-cyber-neonGreen", glow: "text-glow-green", label: "Dominant Leverage" };
    if (score >= 35) return { stroke: "#ffcc00", text: "text-cyber-neonYellow", glow: "", label: "Contested Zone" };
    return { stroke: "#ff0055", text: "text-cyber-neonPink", glow: "text-glow-pink", label: "Lowball Vulnerability" };
  };

  const status = getMeterColor(complianceScore);

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-4 border border-cyber-border/80">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyber-card border border-cyber-border text-cyber-neonGreen">
            <Gauge className="w-4 h-4" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-gray-300">
            Compliance & Leverage Meter
          </span>
        </div>

        {complianceDelta !== 0 && (
          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full border ${
            complianceDelta > 0 
              ? 'bg-cyber-neonGreen/15 text-cyber-neonGreen border-cyber-neonGreen/30' 
              : 'bg-cyber-neonPink/15 text-cyber-neonPink border-cyber-neonPink/30'
          }`}>
            {complianceDelta > 0 ? `+${complianceDelta}%` : `${complianceDelta}%`}
          </span>
        )}
      </div>

      {/* Radial Meter / Score Gauge */}
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="9"
            />
            {/* Value ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={status.stroke}
              strokeWidth="9"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - complianceScore / 100)}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${status.stroke})` }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`font-display text-2xl font-bold ${status.text} ${status.glow}`}>
              {complianceScore}%
            </span>
          </div>
        </div>

        {/* State description */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-gray-400">Psychological Leverage</span>
          <span className={`font-display text-base font-bold ${status.text}`}>
            {status.label}
          </span>
          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            {complianceScore >= 60
              ? "HR Director is off-balance. Concessions are being forced."
              : complianceScore >= 35
              ? "Position is stable. Continue deploying calibrated inquiries."
              : "High risk of lowball capitulation. Deploy FBI tactics immediately."}
          </p>
        </div>
      </div>

      {/* Detected Tactics Section */}
      <div className="pt-2 border-t border-cyber-border/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyber-neonCyan" />
            Tactics Deployed This Turn:
          </span>
        </div>

        {detectedTactics && detectedTactics.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {detectedTactics.map((tacticKey) => {
              const tactic = TACTIC_DEFINITIONS[tacticKey] || {
                label: tacticKey,
                desc: "Strategic negotiation maneuver detected.",
                color: "bg-cyber-neonCyan/20 text-cyber-neonCyan border-cyber-neonCyan/40"
              };
              return (
                <div
                  key={tacticKey}
                  title={tactic.desc}
                  className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-md border ${tactic.color}`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{tactic.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-cyber-card/60 border border-dashed border-cyber-border text-center">
            <span className="text-xs font-mono text-gray-500">
              No Chris Voss FBI tactics recognized in last turn.
            </span>
          </div>
        )}
      </div>

      {/* Tactical feedback from AI */}
      {tacticalFeedback && (
        <div className="p-3 rounded-lg bg-cyber-card border border-cyber-border/70 text-xs font-mono text-gray-300">
          <span className="text-cyber-neonCyan font-bold mr-1.5">[INTEL EVAL]:</span>
          {tacticalFeedback}
        </div>
      )}
    </div>
  );
}
