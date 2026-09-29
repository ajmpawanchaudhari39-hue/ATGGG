import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Target, Award } from 'lucide-react';

export default function OfferTracker({ currentOffer = 250000, initialOffer = 250000, maxOffer = 800000, turnNumber = 0, maxTurns = 5 }) {
  const [displayValue, setDisplayValue] = useState(currentOffer);

  useEffect(() => {
    let start = displayValue;
    const end = currentOffer;
    if (start === end) return;

    const duration = 800; // ms
    const startTime = performance.now();

    const animateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.round(start + (end - start) * ease);
      setDisplayValue(val);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      }
    };

    requestAnimationFrame(animateNumber);
  }, [currentOffer]);

  const percentage = Math.min(100, Math.max(0, ((currentOffer - initialOffer) / (maxOffer - initialOffer)) * 100));
  const delta = currentOffer - initialOffer;

  const formatLPA = (num) => {
    return (num / 100000).toFixed(2) + " LPA";
  };

  return (
    <div className="glass-panel-cyan p-4 rounded-xl relative overflow-hidden">
      {/* Background ambient pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-neonCyan/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyber-neonCyan/10 text-cyber-neonCyan border border-cyber-neonCyan/30">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-gray-300">
              Live Salary Counter
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-gray-400">TURN</span>
            <span className="px-2 py-0.5 rounded bg-cyber-neonPink/20 text-cyber-neonPink font-bold border border-cyber-neonPink/30">
              {turnNumber} / {maxTurns}
            </span>
          </div>
        </div>

        {/* Main numeric counter */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-cyber-neonCyan text-glow-cyan tracking-tight">
              ₹{displayValue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono text-gray-400">
              ({formatLPA(displayValue)})
            </span>
          </div>

          {delta > 0 && (
            <div className="flex items-center gap-1 font-mono text-xs text-cyber-neonGreen bg-cyber-neonGreen/10 px-2.5 py-1 rounded-full border border-cyber-neonGreen/30 self-start sm:self-auto">
              <span>+₹{delta.toLocaleString('en-IN')}</span>
              <span className="text-[10px]">extracted</span>
            </div>
          )}
        </div>

        {/* Dynamic Progress Bar */}
        <div>
          <div className="w-full bg-cyber-card rounded-full h-2.5 border border-cyber-border overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-cyber-neonPink via-purple-500 to-cyber-neonCyan h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(0,243,255,0.6)]"
              style={{ width: `${Math.max(5, percentage)}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-gray-400 mt-1.5">
            <span>Base: ₹2.5 LPA</span>
            <span className="text-cyber-neonCyan font-medium flex items-center gap-1">
              <Target className="w-3 h-3" /> Max Target: ₹8.0 LPA
            </span>
          </div>
        </div>

        {/* Turn Step Indicators */}
        <div className="flex items-center justify-between pt-1 border-t border-cyber-border/60">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            Negotiation Sequence
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((t) => (
              <div
                key={t}
                title={`Turn ${t}`}
                className={`w-5 h-2 rounded-sm transition-all ${
                  t <= turnNumber
                    ? 'bg-cyber-neonCyan shadow-[0_0_8px_rgba(0,243,255,0.7)]'
                    : 'bg-cyber-border/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
