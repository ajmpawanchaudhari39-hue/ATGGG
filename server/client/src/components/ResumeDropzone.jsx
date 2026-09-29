import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, Sparkles, Check, RefreshCw } from 'lucide-react';

const SAMPLE_RESUME = `ALEX MERCER
Email: alex.mercer.dev@example.com | Phone: +91 98765 43210 | Bangalore, India
GitHub: github.com/alex-mercer | LinkedIn: linkedin.com/in/alex-mercer

PROFESSIONAL SUMMARY:
Passionate, motivated, and hardworking Full-Stack Developer with 2 years of experience building modern web applications. Dedicated team player and quick learner seeking a challenging role at an innovative tech company to grow my skills and create value.

TECHNICAL SKILLS:
Languages: JavaScript, TypeScript, Python, Java, C++, HTML5, CSS3, SQL
Frameworks & Libraries: React, Node.js, Express, Next.js, Redux, TailwindCSS, Bootstrap, Django
Databases & Cloud: MongoDB, PostgreSQL, MySQL, Redis, AWS (S3, EC2), Docker, Kubernetes, Git, Jenkins

WORK EXPERIENCE:
Junior Software Engineer | TechNova Solutions | July 2023 - Present
• Worked on the development of client-facing web applications using React.js and Node.js.
• Responsible for writing clean and maintainable code for various internal tools.
• Attended daily standups and collaborated with cross-functional teams including designers and product managers.
• Assisted in fixing bugs and improving the overall stability of the codebase.
• Participated in code reviews and learned best industry practices.

Software Engineering Intern | ByteCrafters Pvt Ltd | Jan 2023 - June 2023
• Developed REST APIs using Express.js and connected them to MongoDB database.
• Implemented user authentication using JWT and bcrypt.
• Designed responsive frontend pages using HTML, CSS, and Bootstrap.

PROJECTS:
1. Weather Forecasting App (React, OpenWeatherMap API)
• Built a responsive weather application that shows current temperature and 5-day forecast.
• Used CSS modules for styling and Axios for fetching weather data.

2. Full-Stack E-Commerce Store (MERN Stack)
• Created an online store with product listings, shopping cart, and mock checkout flow.
• Handled state management with React Context API and stored data in MongoDB.

3. Netflix Clone (React, Firebase)
• Recreated the Netflix UI with movie trailers and authentication using TMDB API.

EDUCATION:
Bachelor of Technology in Computer Science & Engineering | VTU | 2019 - 2023 | CGPA: 7.8/10`;

export default function ResumeDropzone({ resumeText, setResumeText, isRoasting, onRoast }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      readFile(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file) => {
    if (file.type === "text/plain" || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target.result);
      };
      reader.readAsText(file);
    } else {
      // For PDF or other files in browser, note that text format is optimal or prompt user
      const reader = new FileReader();
      reader.onload = (e) => {
        // Simple extraction fallback
        const content = typeof e.target.result === 'string' ? e.target.result : "";
        if (content.length > 50) {
          setResumeText(content);
        } else {
          alert("For optimal brutal roasting, please paste the plain text of your resume or upload a .txt/.md file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const loadSample = () => {
    setResumeText(SAMPLE_RESUME);
  };

  const charCount = resumeText.length;
  const isValidLength = charCount >= 50 && charCount <= 15000;

  return (
    <div className="flex flex-col gap-4">
      {/* Drop Zone Box with Cyber scanning line */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all p-6 sm:p-8 flex flex-col items-center justify-center text-center overflow-hidden ${
          isDragOver
            ? 'border-cyber-neonCyan bg-cyber-neonCyan/10 shadow-[0_0_25px_rgba(0,243,255,0.3)]'
            : 'border-cyber-border bg-cyber-card/60 hover:border-cyber-neonCyan/50'
        }`}
      >
        {/* Animated Scan Beam during roast analysis */}
        {isRoasting && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-neonPink to-transparent shadow-[0_0_15px_#ff0055] animate-scanline z-10"></div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".txt,.md,.doc,.docx,.pdf"
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-cyber-card border border-cyber-border/80 flex items-center justify-center mb-3 shadow-inner">
          <Upload className={`w-6 h-6 ${isDragOver ? 'text-cyber-neonCyan' : 'text-gray-400'}`} />
        </div>

        <h3 className="font-display font-bold text-lg text-white mb-1">
          DROP YOUR RESUME FILE OR PASTE CONTENT
        </h3>
        <p className="text-xs text-gray-400 max-w-md font-sans mb-4">
          Accepts text, markdown, or direct raw resume copy. The AI will strip away corporate fluff and expose critical hiring rejection red flags.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-neonCyan hover:text-cyber-neonCyan text-xs font-mono transition-all"
          >
            BROWSE FILE (.TXT / .MD)
          </button>

          <button
            type="button"
            onClick={loadSample}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyber-neonCyan/10 border border-cyber-neonCyan/40 text-cyber-neonCyan hover:bg-cyber-neonCyan hover:text-black text-xs font-mono transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>LOAD SAMPLE JUNIOR RESUME</span>
          </button>
        </div>
      </div>

      {/* Direct Textarea Editor */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyber-neonCyan" />
            Resume Raw Text Editor:
          </label>
          <span className={`text-[11px] font-mono ${charCount > 15000 ? 'text-cyber-neonPink' : charCount < 50 ? 'text-gray-500' : 'text-cyber-neonGreen'}`}>
            {charCount.toLocaleString()} / 15,000 characters
          </span>
        </div>

        <textarea
          rows={10}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste full resume text here: summary, skills, experience bullet points, education, and portfolio links..."
          className="w-full bg-cyber-card/90 border border-cyber-border rounded-xl p-4 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-cyber-neonCyan focus:ring-1 focus:ring-cyber-neonCyan transition-all"
        />
      </div>

      {/* Submit Roast Action */}
      <button
        type="button"
        disabled={!isValidLength || isRoasting}
        onClick={onRoast}
        className={`w-full py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
          isValidLength && !isRoasting
            ? 'bg-gradient-to-r from-cyber-neonPink to-red-600 hover:from-red-600 hover:to-cyber-neonPink text-white shadow-[0_0_25px_rgba(255,0,85,0.4)] cursor-pointer'
            : 'bg-cyber-card border border-cyber-border text-gray-500 cursor-not-allowed'
        }`}
      >
        {isRoasting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>EXPOSING WEAKNESSES & EXECUTING BRUTAL ROAST...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>UNLEASH UNFILTERED RESUME ROAST</span>
          </>
        )}
      </button>
    </div>
  );
}
