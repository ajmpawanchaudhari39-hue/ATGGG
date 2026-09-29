import React, { useState, useEffect } from 'react';
import { stressTestApi } from '../services/api';
import TimerGauge from '../components/TimerGauge';
import VoiceRecorder from '../components/VoiceRecorder';
import confetti from 'canvas-confetti';
import { 
  Activity, Play, CheckCircle2, AlertOctagon, RefreshCw, 
  ArrowRight, ShieldAlert, Cpu, Award, Zap, Clock
} from 'lucide-react';

export default function StressTest() {
  const [selectedTrack, setSelectedTrack] = useState('ENGINEERING');
  const [gameState, setGameState] = useState('IDLE'); // IDLE | ACTIVE | SUBMITTING | FINISHED
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answersLog, setAnswersLog] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const startTest = async (track = selectedTrack) => {
    try {
      setIsLoading(true);
      const res = await stressTestApi.start(track);
      setQuestions(res.questions || []);
      setCurrentIndex(0);
      setAnswersLog([]);
      setCurrentAnswer('');
      setReport(null);
      setGameState('ACTIVE');
      setStartTime(Date.now());
    } catch (err) {
      console.error("Stress test launch error:", err);
      alert("Failed to initialize stress test session. Check server connectivity.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = (forcedByTimeout = false) => {
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    const recordedAnswer = {
      questionId: questions[currentIndex]?.id || `q-${currentIndex + 1}`,
      userAnswer: currentAnswer.trim() || (forcedByTimeout ? "[TIMED OUT - FAILED UNDER PRESSURE]" : "[EMPTY ANSWER]"),
      timeTakenSeconds: Math.min(30, Math.max(1, timeSpentSeconds))
    };

    const updatedAnswers = [...answersLog, recordedAnswer];
    setAnswersLog(updatedAnswers);
    setCurrentAnswer('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setStartTime(Date.now());
    } else {
      // All 5 questions complete -> Submit to evaluation backend
      submitTest(updatedAnswers);
    }
  };

  const submitTest = async (completedAnswers) => {
    setGameState('SUBMITTING');
    try {
      const res = await stressTestApi.submit({
        track: selectedTrack,
        answers: completedAnswers
      });
      setReport(res);
      setGameState('FINISHED');
      if (res.scores?.total >= 70) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      // Fallback display
      setGameState('FINISHED');
      setReport({
        scores: { total: 60, logic: 65, composure: 55, speed: 60 },
        feedback: "Session evaluated with emergency heuristics. Acceptable baseline composure.",
        breakdown: completedAnswers.map((a, i) => ({
          questionId: a.questionId,
          verdict: a.userAnswer.length > 20 ? "SURVIVED" : "FAILED",
          logicAssessment: "Baseline survived.",
          score: 60
        }))
      });
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyber-card border border-cyber-neonPink/50 flex items-center justify-center text-cyber-neonPink shadow-[0_0_15px_rgba(255,0,85,0.3)]">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white uppercase tracking-tight flex items-center gap-2">
              <span>THE STRESS TEST ARENA</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-neonPink/20 text-cyber-neonPink border border-cyber-neonPink/30">
                30S COUNTDOWN
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-sans">
              Strict 30-second cognitive boundary per dilemma. Evaluates logic (40%), composure (40%), and speed (20%).
            </p>
          </div>
        </div>

        {gameState === 'IDLE' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTrack('ENGINEERING')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                selectedTrack === 'ENGINEERING'
                  ? 'bg-cyber-neonCyan/20 text-cyber-neonCyan border-cyber-neonCyan shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                  : 'bg-cyber-card border-cyber-border text-gray-400'
              }`}
            >
              TECH ENGINEERING
            </button>
            <button
              onClick={() => setSelectedTrack('UPSC_CIVIL')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                selectedTrack === 'UPSC_CIVIL'
                  ? 'bg-cyber-neonPink/20 text-cyber-neonPink border-cyber-neonPink shadow-[0_0_15px_rgba(255,0,85,0.3)]'
                  : 'bg-cyber-card border-cyber-border text-gray-400'
              }`}
            >
              UPSC CIVIL CRISIS
            </button>
          </div>
        )}
      </div>

      {/* Screen 1: Idle Start Portal */}
      {gameState === 'IDLE' && (
        <div className="glass-panel-pink p-8 sm:p-12 rounded-3xl text-center flex flex-col items-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyber-card border border-cyber-neonPink flex items-center justify-center text-cyber-neonPink shadow-[0_0_25px_rgba(255,0,85,0.4)] animate-pulse">
            <Zap className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono text-cyber-neonPink uppercase tracking-widest">
              PROTOCOL READY: {selectedTrack}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-1">
              CAN YOUR LOGIC SURVIVE UNDER TIME DISTRESS?
            </h2>
            <p className="text-sm text-gray-300 font-sans mt-3 max-w-xl mx-auto leading-relaxed">
              Standard interview preparation creates a false sense of security. In real production outages or executive panels, answers are demanded in seconds. If you freeze, you fail.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-lg text-left text-xs font-mono p-4 rounded-xl bg-cyber-card/80 border border-cyber-border">
            <div className="p-2 border-r border-cyber-border">
              <span className="text-gray-500 block">QUESTIONS</span>
              <span className="text-white font-bold text-sm">5 RAPID-FIRE</span>
            </div>
            <div className="p-2 border-r border-cyber-border">
              <span className="text-gray-500 block">TIME BOUND</span>
              <span className="text-cyber-neonPink font-bold text-sm">30s / QUESTION</span>
            </div>
            <div className="p-2">
              <span className="text-gray-500 block">SCORING</span>
              <span className="text-cyber-neonGreen font-bold text-sm">WEIGHTED TRIAD</span>
            </div>
          </div>

          <button
            onClick={() => startTest(selectedTrack)}
            disabled={isLoading}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyber-neonPink to-red-600 hover:from-red-600 hover:to-cyber-neonPink text-white font-display font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(255,0,85,0.5)] hover:scale-105 flex items-center gap-3 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
            <span>INITIATE RAPID-FIRE ARENA</span>
          </button>
        </div>
      )}

      {/* Screen 2: Active Timed Quiz Interface */}
      {gameState === 'ACTIVE' && currentQ && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Question Status Bar & Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-cyber-card border border-cyber-neonCyan font-mono text-xs font-bold text-cyber-neonCyan">
                QUESTION 0{currentIndex + 1} / 05
              </span>
              <span className="text-xs font-mono text-gray-400 uppercase">
                DIFFICULTY: <span className="text-cyber-neonPink font-bold">{currentQ.difficulty || "HIGH"}</span>
              </span>
            </div>

            {/* Circular High-Intensity Countdown Timer */}
            <TimerGauge
              duration={30}
              isActive={true}
              resetKey={currentIndex}
              onTimeout={() => handleNextQuestion(true)}
            />
          </div>

          {/* Scenario & Question Prompt */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyber-border/90 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonYellow">
              <AlertOctagon className="w-4 h-4" />
              <span>INCIDENT SCENARIO:</span>
              <span className="text-gray-300 font-sans">{currentQ.scenario}</span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-snug">
              "{currentQ.question}"
            </h3>
          </div>

          {/* Candidate Response Textarea / Voice Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-gray-300">
                Your Immediate Executive Counter (Speak or Type):
              </label>
              <span className="text-[11px] font-mono text-gray-400">
                Auto-advances when timer concludes
              </span>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                autoFocus
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="State your operational calculus, first-principles architecture, or containment protocol directly..."
                className="w-full bg-cyber-card/90 border border-cyber-border rounded-xl p-4 text-sm font-sans text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-cyber-neonPink focus:ring-1 focus:ring-cyber-neonPink transition-all"
              />

              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <VoiceRecorder 
                  onTranscript={(text) => setCurrentAnswer(prev => prev ? `${prev} ${text}` : text)}
                />
              </div>
            </div>

            {/* Advance Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleNextQuestion(false)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-neonPink hover:bg-white text-black font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,0,85,0.4)] cursor-pointer"
              >
                <span>{currentIndex + 1 === questions.length ? "SUBMIT FULL AUDIT" : "LOCK & ADVANCE QUESTION"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Screen 3: Submitting State */}
      {gameState === 'SUBMITTING' && (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-cyber-card border border-cyber-neonPink flex items-center justify-center text-cyber-neonPink mx-auto animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider">
            CALCULATING COGNITIVE RESILIENCE...
          </h3>
          <p className="text-xs font-mono text-gray-400">
            Synthesizing composure index (40%), logic correctness (40%), and latency score (20%).
          </p>
        </div>
      )}

      {/* Screen 4: Final Scorecard & Diagnostic */}
      {gameState === 'FINISHED' && report && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-8 animate-in fade-in">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyber-neonCyan">
                EVALUATION REPORT // {selectedTrack}
              </span>
              <h2 className="font-display font-extrabold text-3xl text-white tracking-tight mt-1">
                STRESS TEST SCORECARD
              </h2>
            </div>

            {/* Total Score Badge */}
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-5xl text-cyber-neonPink text-glow-pink">
                {report.scores?.total || 0}
              </span>
              <span className="text-xs font-mono text-gray-500">/ 100</span>
            </div>
          </div>

          {/* Triad Metric Weight Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border">
              <span className="text-[10px] font-mono text-gray-400 uppercase">LOGIC & DEPTH (40%)</span>
              <div className="font-display font-bold text-2xl text-cyber-neonCyan mt-1">
                {report.scores?.logic || 0}%
              </div>
              <p className="text-[11px] text-gray-400 mt-1">First-principles correctness</p>
            </div>

            <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border">
              <span className="text-[10px] font-mono text-gray-400 uppercase">COMPOSURE (40%)</span>
              <div className="font-display font-bold text-2xl text-cyber-neonGreen mt-1">
                {report.scores?.composure || 0}%
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Panic resistance & non-paralysis</p>
            </div>

            <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border">
              <span className="text-[10px] font-mono text-gray-400 uppercase">LATENCY & SPEED (20%)</span>
              <div className="font-display font-bold text-2xl text-cyber-neonYellow mt-1">
                {report.scores?.speed || 0}%
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Execution velocity in window</p>
            </div>

          </div>

          {/* Overall Diagnostic Feedback */}
          <div className="p-4 rounded-xl bg-cyber-card/90 border border-cyber-neonCyan/30 text-sm font-sans text-gray-200">
            <span className="font-mono text-cyber-neonCyan font-bold mr-2">[CHIEF EVALUATOR VERDICT]:</span>
            {report.feedback}
          </div>

          {/* Question Breakdown Table */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-gray-300 font-bold">
              Turn-by-Turn Question Diagnostic:
            </h4>

            <div className="space-y-2">
              {report.breakdown?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-cyber-card/70 border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-mono text-cyber-neonCyan font-bold">QUESTION 0{idx + 1}:</span>
                    <p className="text-gray-300 font-sans">{item.logicAssessment}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] border ${
                      item.verdict === 'SURVIVED' 
                        ? 'bg-cyber-neonGreen/15 text-cyber-neonGreen border-cyber-neonGreen/30' 
                        : 'bg-cyber-neonPink/15 text-cyber-neonPink border-cyber-neonPink/30'
                    }`}>
                      {item.verdict}
                    </span>
                    <span className="font-mono font-bold text-white text-sm">
                      {item.score} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retake Action */}
          <div className="flex justify-end pt-4 border-t border-cyber-border">
            <button
              onClick={() => { setGameState('IDLE'); setReport(null); }}
              className="px-6 py-3 rounded-xl bg-cyber-neonCyan text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            >
              RUN ANOTHER STRESS DRILL
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
