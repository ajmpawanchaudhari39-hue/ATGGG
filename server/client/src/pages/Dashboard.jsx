import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';
import { 
  TrendingUp, Award, ShieldAlert, BookOpen, HelpCircle, 
  Crosshair, Activity, Flame, ChevronRight, RefreshCw, Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardApi.getStats();
      setData(res);
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setError("Unable to load performance telemetry. Server might still be establishing baseline connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const metrics = data?.metrics || {
    totalNegotiations: 0,
    topOffer: 250000,
    avgCompliance: 10,
    totalStressTests: 0,
    topStressScore: 0,
    totalRoasts: 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel-cyan p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyber-neonGreen animate-ping"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-neonCyan">
              OPERATIVE TELEMETRY ACTIVE
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            WELCOME BACK, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "OPERATIVE"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-2xl mt-1">
            Review your negotiation leverage curves, test cognitive clarity against stress drills, and absorb curated executive intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/interrogate"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyber-neonCyan text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)]"
          >
            <Crosshair className="w-4 h-4" />
            <span>START NEGOTIATION</span>
          </Link>
          <button
            onClick={loadStats}
            title="Refresh Metrics"
            className="p-3 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-neonCyan hover:text-cyber-neonCyan text-gray-400 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-gray-400">Peak Salary Offer</span>
            <span className="p-1.5 rounded-lg bg-cyber-neonGreen/10 text-cyber-neonGreen border border-cyber-neonGreen/30">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-cyber-neonGreen">
              ₹{(metrics.topOffer / 100000).toFixed(2)} LPA
            </div>
            <span className="text-[10px] font-mono text-gray-500">₹{metrics.topOffer.toLocaleString('en-IN')} INR</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-gray-400">Avg Compliance</span>
            <span className="p-1.5 rounded-lg bg-cyber-neonCyan/10 text-cyber-neonCyan border border-cyber-neonCyan/30">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-cyber-neonCyan">
              {metrics.avgCompliance}%
            </div>
            <span className="text-[10px] font-mono text-gray-500">Psychological Leverage</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-gray-400">Stress Test Top</span>
            <span className="p-1.5 rounded-lg bg-cyber-neonPink/10 text-cyber-neonPink border border-cyber-neonPink/30">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-cyber-neonPink">
              {metrics.topStressScore} / 100
            </div>
            <span className="text-[10px] font-mono text-gray-500">{metrics.totalStressTests} Sessions Run</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-gray-400">Resumes Roasted</span>
            <span className="p-1.5 rounded-lg bg-cyber-neonYellow/10 text-cyber-neonYellow border border-cyber-neonYellow/30">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-cyber-neonYellow">
              {metrics.totalRoasts}
            </div>
            <span className="text-[10px] font-mono text-gray-500">Unfiltered Audits</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Daily Trending Questions & Recommended Reading */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Daily Trending Questions (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyber-neonCyan" />
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                Daily High-Stakes Interview Intelligence
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyber-neonCyan px-2 py-0.5 rounded bg-cyber-neonCyan/10 border border-cyber-neonCyan/30">
              UPDATED DAILY
            </span>
          </div>

          <div className="space-y-3">
            {data?.dailyTrendingQuestions?.map((item) => (
              <div key={item.id} className="p-5 rounded-xl glass-panel border border-cyber-border hover:border-cyber-neonCyan/40 transition-all flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-card border border-cyber-border text-gray-300">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-cyber-neonPink">
                    TAG: {item.tag}
                  </span>
                </div>
                
                <h4 className="font-display font-semibold text-sm sm:text-base text-gray-100">
                  "{item.question}"
                </h4>

                <div className="p-3 rounded-lg bg-cyber-card/80 border border-cyber-neonCyan/20 text-xs font-mono text-gray-300 mt-1">
                  <span className="text-cyber-neonCyan font-bold mr-1.5">[FBI TACTICAL COUNTER]:</span>
                  {item.tacticHint}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Reading List (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyber-neonGreen" />
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              Strategic Reading Grid
            </h3>
          </div>

          <div className="space-y-3">
            {data?.recommendedReadings?.map((book) => (
              <div key={book.id} className="p-4 rounded-xl glass-panel border border-cyber-border flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-white">{book.title}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyber-neonGreen/10 text-cyber-neonGreen border border-cyber-neonGreen/30">
                    {book.badge}
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-400">by {book.author}</span>
                <p className="text-xs font-sans text-gray-300 mt-1 leading-relaxed">
                  {book.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Simulation History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              Recent Negotiation Records
            </h3>
          </div>
        </div>

        {data?.recentNegotiations && data.recentNegotiations.length > 0 ? (
          <div className="glass-panel rounded-xl overflow-hidden border border-cyber-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-cyber-card/90 text-gray-400 uppercase text-[10px] tracking-wider border-b border-cyber-border">
                  <tr>
                    <th className="p-4">Target Role</th>
                    <th className="p-4">Initial Anchor</th>
                    <th className="p-4">Final Offer</th>
                    <th className="p-4">Compliance</th>
                    <th className="p-4">Turns</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/60 text-gray-300">
                  {data.recentNegotiations.map((sess) => (
                    <tr key={sess.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{sess.jobTitle || "SDE-1"}</td>
                      <td className="p-4 text-cyber-neonPink">₹{(Number(sess.initial_offer) / 100000).toFixed(2)} LPA</td>
                      <td className="p-4 text-cyber-neonGreen font-bold">₹{(Number(sess.final_offer) / 100000).toFixed(2)} LPA</td>
                      <td className="p-4">{sess.compliance_score}%</td>
                      <td className="p-4">{sess.total_turns} / 5</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          sess.status === 'COMPLETED' ? 'bg-cyber-neonGreen/20 text-cyber-neonGreen' : 'bg-cyber-neonYellow/20 text-cyber-neonYellow'
                        }`}>
                          {sess.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(sess.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-xl glass-panel border border-dashed border-cyber-border text-center">
            <p className="text-xs font-mono text-gray-500 mb-3">No negotiation sessions logged yet.</p>
            <Link
              to="/interrogate"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyber-neonCyan/10 border border-cyber-neonCyan text-cyber-neonCyan text-xs font-mono hover:bg-cyber-neonCyan hover:text-black transition-all"
            >
              <span>Launch First Negotiation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
