import React, { useEffect, useRef } from 'react';
import { User, ShieldAlert, Cpu, Sparkles, CheckCircle2, CornerDownRight } from 'lucide-react';

export default function ChatBox({ logs = [], isEvaluating = false, jobTitle = "Software Development Engineer" }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isEvaluating]);

  return (
    <div className="flex-1 flex flex-col bg-cyber-bg/90 rounded-2xl border border-cyber-border overflow-hidden relative shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-cyber-card border-b border-cyber-border/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-cyber-neonPink/80 border border-cyber-neonPink"></div>
            <div className="w-3 h-3 rounded-full bg-cyber-neonYellow/80 border border-cyber-neonYellow"></div>
            <div className="w-3 h-3 rounded-full bg-cyber-neonGreen/80 border border-cyber-neonGreen"></div>
          </div>
          <span className="font-mono text-xs text-gray-400 ml-2">
            ROOM://VANCE-EXECUTIVE-SUITE-402
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyber-neonPink/15 text-cyber-neonPink border border-cyber-neonPink/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonPink animate-ping"></span>
            HIGH-PRESSURE ENCOUNTER
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {logs.map((log, index) => (
          <div key={log.id || index} className="space-y-4">
            
            {/* Candidate Turn Message (if not turn 0 initial) */}
            {log.userMessage && (
              <div className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
                    <span>YOU (CANDIDATE)</span>
                    <span className="text-cyber-neonCyan">TURN {log.turnNumber}</span>
                  </div>

                  <div className="p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-950/60 to-cyber-card border border-cyber-neonCyan/40 text-gray-100 text-sm font-sans shadow-[0_0_15px_rgba(0,243,255,0.08)] leading-relaxed">
                    {log.userMessage}
                  </div>

                  {/* Tactics badge if detected */}
                  {log.detectedTactics && log.detectedTactics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 justify-end">
                      {log.detectedTactics.map((tactic, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-neonGreen/15 text-cyber-neonGreen border border-cyber-neonGreen/30 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {tactic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HR Director Marcus Vance Dialogue */}
            {log.hrMessage && (
              <div className="flex justify-start">
                <div className="max-w-[90%] sm:max-w-[80%] flex items-start gap-3">
                  
                  {/* Vance Avatar with Hostile Aura */}
                  <div className="relative shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-950 to-cyber-card border border-cyber-neonPink/60 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,85,0.3)]">
                      <ShieldAlert className="w-5 h-5 text-cyber-neonPink" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center border border-cyber-neonPink/50">
                      <span className="w-2 h-2 rounded-full bg-cyber-neonPink animate-pulse"></span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs tracking-wider text-cyber-neonPink">
                        DIRECTOR MARCUS VANCE
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 uppercase">
                        SVP Global Talent Acquisition
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl rounded-tl-sm bg-cyber-card/90 border border-cyber-border hover:border-cyber-neonPink/40 transition-colors text-gray-200 text-sm leading-relaxed font-sans shadow-lg">
                      {log.hrMessage}
                    </div>

                    {/* Tactical Feedback note from Vance evaluation */}
                    {log.tacticalFeedback && (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400 pl-1">
                        <CornerDownRight className="w-3 h-3 text-cyber-neonCyan" />
                        <span className="text-cyber-neonCyan">Analysis:</span>
                        <span>{log.tacticalFeedback}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        ))}

        {/* AI Thinking / Calculating State */}
        {isEvaluating && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-card border border-cyber-neonCyan/40 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <Cpu className="w-5 h-5 text-cyber-neonCyan" />
            </div>

            <div className="p-4 rounded-2xl bg-cyber-card/70 border border-cyber-border/80 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyber-neonCyan animate-ping"></span>
                <span className="w-2 h-2 rounded-full bg-cyber-neonCyan animate-ping [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-cyber-neonCyan animate-ping [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs font-mono text-gray-400 tracking-wider">
                VANCE ANALYZING PSYCHOLOGICAL PRESSURE & BUDGET CAP...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
