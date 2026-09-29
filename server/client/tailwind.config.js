/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#070a10",
          card: "#0d131f",
          cardHover: "#131c2e",
          border: "#1e293b",
          neonCyan: "#00f3ff",
          neonPink: "#ff0055",
          neonGreen: "#00ff88",
          neonYellow: "#ffcc00",
          neonPurple: "#8a2be2",
          muted: "#94a3b8",
          text: "#f8fafc"
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        display: ['"Rajdhani"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'glow-pulse': 'glowPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 6s linear infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 12px rgba(0, 243, 255, 0.6))' },
          '50%': { opacity: 0.7, filter: 'drop-shadow(0 0 4px rgba(0, 243, 255, 0.2))' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
