import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Mail, User, Terminal, ArrowRight, Zap, AlertCircle } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithEmail, registerWithEmail, loginAsDemo, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await registerWithEmail(email, password, fullName);
      } else {
        await loginWithEmail(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestEntry = () => {
    loginAsDemo();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      
      {/* Background cyber ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-neonCyan/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel-cyan p-8 rounded-2xl relative z-10">
        
        {/* Terminal Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-cyber-card border border-cyber-neonCyan/50 mx-auto flex items-center justify-center text-cyber-neonCyan mb-4 shadow-[0_0_20px_rgba(0,243,255,0.3)]">
            <Terminal className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white uppercase tracking-wider">
            {isSignUp ? "INITIALIZE OPERATIVE PROFILE" : "OPERATIVE AUTHENTICATION"}
          </h2>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Access secure interrogation rooms and intelligence vaults
          </p>
        </div>

        {/* Demo Fast Access Option */}
        <div className="mb-6 p-4 rounded-xl bg-cyber-card/90 border border-cyber-neonCyan/40 text-center">
          <div className="flex items-center justify-center gap-1.5 text-cyber-neonCyan font-mono text-xs font-bold mb-1">
            <Zap className="w-3.5 h-3.5 animate-bounce" />
            <span>IMMEDIATE TEST ACCESS</span>
          </div>
          <p className="text-[11px] text-gray-300 font-sans mb-3">
            Bypass cloud credentials and jump directly into the simulation with a pre-configured operative profile.
          </p>
          <button
            type="button"
            onClick={handleGuestEntry}
            className="w-full py-2.5 rounded-lg bg-cyber-neonCyan text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          >
            ENTER AS GUEST OPERATIVE
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-cyber-border"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono uppercase tracking-widest text-gray-500">
            OR {isSupabaseConfigured ? "SUPABASE CLOUD AUTH" : "EMAIL SIGN-IN"}
          </span>
          <div className="flex-grow border-t border-cyber-border"></div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-cyber-neonPink/10 border border-cyber-neonPink/40 text-xs font-mono text-cyber-neonPink flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                Full Name / Agent Alias
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full bg-cyber-card border border-cyber-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-cyber-neonCyan transition-all font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operative@domain.com"
                className="w-full bg-cyber-card border border-cyber-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-cyber-neonCyan transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
              Security Clearance Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-cyber-card border border-cyber-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-cyber-neonCyan transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyber-neonCyan text-black font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
          >
            {isSubmitting ? (
              <span>VERIFYING CREDENTIALS...</span>
            ) : (
              <>
                <span>{isSignUp ? "CONFIRM & REGISTER" : "AUTHENTICATE AGENT"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs font-mono text-gray-400 hover:text-cyber-neonCyan transition-colors"
          >
            {isSignUp ? "Already registered? Authenticate here." : "First encounter? Scrip an Operative ID."}
          </button>
        </div>

      </div>

    </div>
  );
}
