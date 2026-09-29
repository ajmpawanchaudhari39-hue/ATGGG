import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function TimerGauge({ duration = 30, onTimeout, isActive = true, resetKey = 0 }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      if (onTimeout) onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeout) onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeout]);

  const percentage = (timeLeft / duration) * 100;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (timeLeft <= 7) return { stroke: "#ff0055", text: "text-cyber-neonPink animate-pulse", glow: "text-glow-pink", isUrgent: true };
    if (timeLeft <= 15) return { stroke: "#ffcc00", text: "text-cyber-neonYellow", glow: "", isUrgent: false };
    return { stroke: "#00f3ff", text: "text-cyber-neonCyan", glow: "text-glow-cyan", isUrgent: false };
  };

  const status = getColor();

  return (
    <div className="flex items-center gap-3 bg-cyber-card/90 px-4 py-2.5 rounded-2xl border border-cyber-border/90 shadow-lg">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={status.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-linear"
            style={{ filter: `drop-shadow(0 0 6px ${status.stroke})` }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-mono text-lg font-bold ${status.text} ${status.glow}`}>
            {timeLeft}
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center gap-1">
          {status.isUrgent ? (
            <AlertTriangle className="w-3 h-3 text-cyber-neonPink animate-bounce" />
          ) : (
            <Clock className="w-3 h-3 text-cyber-neonCyan" />
          )}
          <span>CRITICAL TIMER</span>
        </span>
        <span className={`font-display text-xs font-semibold ${status.text}`}>
          {timeLeft <= 7 ? "COGNITIVE OVERLOAD" : timeLeft <= 15 ? "DECISION BOUNDARY" : "ANSWER WINDOW"}
        </span>
      </div>
    </div>
  );
}
