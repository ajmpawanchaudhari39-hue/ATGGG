import React, { useState } from 'react';
import { resumeApi } from '../services/api';
import ResumeDropzone from '../components/ResumeDropzone';
import RoastCard from '../components/RoastCard';
import { Flame, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export default function ResumeRoaster() {
  const [resumeText, setResumeText] = useState('');
  const [isRoasting, setIsRoasting] = useState(false);
  const [roastReport, setRoastReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoast = async () => {
    if (!resumeText || resumeText.length < 50) {
      setErrorMessage("Please input at least 50 characters of resume content for an accurate roast.");
      return;
    }

    setErrorMessage('');
    setIsRoasting(true);

    try {
      const res = await resumeApi.roast(resumeText);
      setRoastReport(res);
      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: 600, behavior: 'smooth' });
      }, 200);
    } catch (err) {
      console.error("Resume roast error:", err);
      setErrorMessage(err.message || "Failed to process resume roast. Check server connection.");
    } finally {
      setIsRoasting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyber-card border border-cyber-neonPink/50 flex items-center justify-center text-cyber-neonPink shadow-[0_0_15px_rgba(255,0,85,0.3)]">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white uppercase tracking-tight flex items-center gap-2">
              <span>RESUME ROASTER ZONE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-neonPink/20 text-cyber-neonPink border border-cyber-neonPink/30">
                BRUTAL AUDIT
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-sans">
              Unfiltered, aggressive recruiter critique. We expose buzzword fluff, missing production metrics, and instant rejection red flags.
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-cyber-neonPink/10 border border-cyber-neonPink/40 text-xs font-mono text-cyber-neonPink flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload & Text Editor */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <ResumeDropzone
          resumeText={resumeText}
          setResumeText={setResumeText}
          isRoasting={isRoasting}
          onRoast={handleRoast}
        />
      </div>

      {/* Roast Report Results */}
      {roastReport && (
        <div id="roast-results-section" className="space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-neonPink" />
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              Diagnostic Audit Result:
            </h3>
          </div>

          <RoastCard report={roastReport} />
        </div>
      )}

    </div>
  );
}
