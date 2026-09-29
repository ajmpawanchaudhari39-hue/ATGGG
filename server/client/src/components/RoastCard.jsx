import React, { useState } from 'react';
import { Skull, AlertOctagon, CheckCircle2, TrendingUp, Copy, Check, Share2 } from 'lucide-react';

export default function RoastCard({ report }) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const {
    roastHeadline = "Unclassified Candidate Audit",
    overallScore = 30,
    brutalSummary = "",
    weaknesses = [],
    redFlags = [],
    actionableFixes = []
  } = report;

  const getScoreBadge = (score) => {
    if (score >= 70) return { bg: "bg-cyber-neonGreen/15 text-cyber-neonGreen border-cyber-neonGreen/40", text: "text-cyber-neonGreen", label: "MARKET COMPETITIVE" };
    if (score >= 45) return { bg: "bg-cyber-neonYellow/15 text-cyber-neonYellow border-cyber-neonYellow/40", text: "text-cyber-neonYellow", label: "MEDIOCRE CANDIDATE" };
    return { bg: "bg-cyber-neonPink/15 text-cyber-neonPink border-cyber-neonPink/40", text: "text-cyber-neonPink", label: "INSTANT REJECTION RISK" };
  };

  const badge = getScoreBadge(overallScore);

  const handleCopy = () => {
    const text = `INTERRO-GATE AI // RESUME ROAST REPORT
VERDICT: ${roastHeadline}
MARKET READINESS: ${overallScore}/100 (${badge.label})

SUMMARY:
${brutalSummary}

CRITICAL RED FLAGS:
${redFlags.map(r => `• ${r}`).join('\n')}

ACTIONABLE REMEDIATION PLAN:
${actionableFixes.map(f => `• ${f}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel-pink p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Background ambient red glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-neonPink/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border/80 pb-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyber-card border border-cyber-neonPink/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,0,85,0.3)]">
            <Skull className="w-6 h-6 text-cyber-neonPink" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyber-neonPink flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonPink animate-ping"></span>
              BRUTAL RECRUITER DIAGNOSTIC
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-0.5">
              "{roastHeadline}"
            </h2>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-display text-4xl sm:text-5xl font-extrabold ${badge.text}`}>
              {overallScore}
            </span>
            <span className="text-xs font-mono text-gray-500">/ 100</span>
          </div>
          <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${badge.bg}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Brutal Summary Statement */}
      <div className="p-4 rounded-xl bg-cyber-card/90 border border-cyber-neonPink/30 text-sm font-sans text-gray-200 leading-relaxed shadow-sm">
        <p className="italic">{brutalSummary}</p>
      </div>

      {/* Red Flags & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Rejection Red Flags */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-cyber-neonPink" />
            <h4 className="font-mono text-xs uppercase tracking-wider text-gray-200 font-bold">
              Instant Rejection Red Flags ({redFlags.length})
            </h4>
          </div>

          <div className="space-y-2">
            {redFlags.map((flag, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-cyber-card/70 border border-cyber-neonPink/20 text-xs text-gray-300 font-sans flex items-start gap-2">
                <span className="text-cyber-neonPink font-mono font-bold mt-0.5">0{idx + 1}.</span>
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Weaknesses */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-cyber-neonYellow" />
            <h4 className="font-mono text-xs uppercase tracking-wider text-gray-200 font-bold">
              Fluff & Structural Weaknesses ({weaknesses.length})
            </h4>
          </div>

          <div className="space-y-2">
            {weaknesses.map((weak, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-cyber-card/70 border border-cyber-border text-xs text-gray-300 font-sans flex items-start gap-2">
                <span className="text-cyber-neonYellow font-mono font-bold mt-0.5">⚠️</span>
                <span>{weak}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Actionable Remediation Plan */}
      <div className="pt-2 border-t border-cyber-border/80 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyber-neonGreen" />
          <h4 className="font-mono text-xs uppercase tracking-wider text-cyber-neonGreen font-bold">
            Tactical Remediation Blueprint (Immediate Fixes)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {actionableFixes.map((fix, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-cyber-card/80 border border-cyber-neonGreen/20 text-xs text-gray-300 font-sans flex items-start gap-2">
              <span className="p-1 rounded bg-cyber-neonGreen/10 text-cyber-neonGreen shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <span>{fix}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-neonCyan hover:text-cyber-neonCyan text-xs font-mono text-gray-300 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-cyber-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "REPORT COPIED TO CLIPBOARD" : "COPY BRUTAL ROAST REPORT"}</span>
        </button>
      </div>

    </div>
  );
}
