import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Crosshair, Flame, LayoutDashboard, Terminal, LogOut, User, Activity } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: "Intel Hub", path: "/dashboard", icon: LayoutDashboard },
    { name: "The Interrogation", path: "/interrogate", icon: Crosshair, highlight: true },
    { name: "Stress Test", path: "/stress-test", icon: Activity },
    { name: "Resume Roaster", path: "/resume-roaster", icon: Flame },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-cyber-bg/85 border-b border-cyber-border/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-lg bg-cyber-card border border-cyber-neonCyan/40 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,243,255,0.25)] group-hover:border-cyber-neonCyan transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-neonCyan/20 to-transparent"></div>
            <Terminal className="w-5 h-5 text-cyber-neonCyan group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-wider text-white group-hover:text-cyber-neonCyan transition-colors">
                INTERRO-GATE
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyber-neonPink/20 text-cyber-neonPink border border-cyber-neonPink/40">
                AI
              </span>
            </div>
            <p className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">
              Hostile HR Simulator
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-cyber-neonCyan/15 text-cyber-neonCyan border border-cyber-neonCyan/40 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-neonCyan' : 'text-gray-400'}`} />
                <span>{item.name}</span>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonPink animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Status / Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyber-neonGreen animate-ping"></span>
                  <span className="text-xs font-mono font-medium text-gray-200">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || "Agent"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyber-neonCyan/80">
                  {isDemo ? "[TACTICAL DEMO]" : "[VERIFIED AGENT]"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                title="Disconnect Session"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyber-card border border-cyber-border hover:border-cyber-neonPink hover:text-cyber-neonPink text-gray-400 text-xs font-mono transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Abort</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-neonCyan/10 border border-cyber-neonCyan text-cyber-neonCyan text-xs font-mono font-semibold tracking-wider hover:bg-cyber-neonCyan hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            >
              <User className="w-3.5 h-3.5" />
              <span>TERMINAL LOGIN</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
