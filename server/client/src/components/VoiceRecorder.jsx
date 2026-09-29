import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';

export default function VoiceRecorder({ onTranscript, disabled = false, autoSpeak = true, onToggleAutoSpeak }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      if (currentTranscript && onTranscript) {
        onTranscript(currentTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript]);

  const toggleRecording = () => {
    if (disabled || !isSupported) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Could not start speech recognition:", err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Mic Record Toggle */}
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled || !isSupported}
        title={!isSupported ? "Speech recognition not supported in browser" : isRecording ? "Stop recording" : "Speak response (Web Speech API)"}
        className={`relative p-3 rounded-xl border transition-all flex items-center justify-center ${
          isRecording
            ? 'bg-cyber-neonPink text-black border-cyber-neonPink shadow-[0_0_20px_rgba(255,0,85,0.7)] animate-pulse'
            : isSupported
            ? 'bg-cyber-card border-cyber-border hover:border-cyber-neonCyan hover:text-cyber-neonCyan text-gray-300 shadow-sm'
            : 'bg-cyber-card/50 border-cyber-border/40 text-gray-600 cursor-not-allowed'
        }`}
      >
        {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        {isRecording && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-neonPink opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-neonPink"></span>
          </span>
        )}
      </button>

      {/* Audio Waveform Animation (When recording) */}
      {isRecording && (
        <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-cyber-card border border-cyber-neonPink/40">
          <Radio className="w-3.5 h-3.5 text-cyber-neonPink animate-spin" />
          <div className="flex items-center gap-0.5 h-4">
            <div className="w-1 bg-cyber-neonPink animate-[pulse_0.4s_infinite] h-4 rounded-full"></div>
            <div className="w-1 bg-cyber-neonPink animate-[pulse_0.6s_infinite] h-2 rounded-full"></div>
            <div className="w-1 bg-cyber-neonPink animate-[pulse_0.3s_infinite] h-5 rounded-full"></div>
            <div className="w-1 bg-cyber-neonPink animate-[pulse_0.5s_infinite] h-3 rounded-full"></div>
            <div className="w-1 bg-cyber-neonPink animate-[pulse_0.7s_infinite] h-4 rounded-full"></div>
          </div>
          <span className="text-[10px] font-mono text-cyber-neonPink uppercase tracking-wider ml-1">
            REC...
          </span>
        </div>
      )}

      {/* Text-To-Speech Toggle for Marcus Vance Voice Playback */}
      {onToggleAutoSpeak && (
        <button
          type="button"
          onClick={onToggleAutoSpeak}
          title={autoSpeak ? "Vance Voice Playback: Active" : "Vance Voice Playback: Muted"}
          className={`p-3 rounded-xl border transition-all ${
            autoSpeak
              ? 'bg-cyber-neonCyan/15 text-cyber-neonCyan border-cyber-neonCyan/40 shadow-[0_0_12px_rgba(0,243,255,0.25)]'
              : 'bg-cyber-card border-cyber-border text-gray-500 hover:text-gray-300'
          }`}
        >
          {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
