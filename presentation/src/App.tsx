import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Grid,
  Sparkles,
  ShieldCheck,
  Award,
  Radar,
  Briefcase,
  GraduationCap,
  Building,
  School,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  Database,
  ExternalLink,
  Code2,
  MapPin,
  FileText,
  UserCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface Slide {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);

  // Active tab inside Stageshow slide
  const [stageshowTab, setStageshowTab] = useState<'radar' | 'matchmaking' | 'proctoring'>('radar');

  const slides: Slide[] = [
    // SLIDE 1: Title & Executive Overview
    {
      id: 1,
      category: 'EXECUTIVE OVERVIEW',
      title: 'NodalConnector Portal',
      subtitle: 'National Multi-Disciplinary Skills, Internship & Placement Platform',
      content: (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Problem Statement SIH26044</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Portal for Academia – Industry Collaboration for Skill Mapping, Internships and Placement, sponsored by Ministry of Ayush.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Disciplinary Scope</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full-spectrum support across B.Tech, Computer Science, AI/ML, Cloud DevOps, Bio-Pharma, and Traditional Medicine under UGC Section 22.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Trust Security</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Authenticated Cloudinary storage, 60-min signed URLs, rate limiting, and 5-tier role segregation (Student, Recruiter, Faculty, Institution, Admin).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">National Smart Automation Initiative</span> — Live MongoDB Atlas & Redis Cached Architecture
            </div>
            <span className="font-mono text-[11px] bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-500/40">
              v1.0 Production
            </span>
          </div>
        </div>
      )
    },

    // SLIDE 2: The Core Problem & Architecture
    {
      id: 2,
      category: 'CHALLENGE ANALYSIS',
      title: 'The University-Industry Competency Chasm',
      subtitle: 'Overcoming Curricular Latency with Standardized Diagnostic Benchmarks',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-2">
              <span className="text-[11px] font-bold uppercase text-rose-400 tracking-wider">The Academic Reality</span>
              <h4 className="text-sm font-bold text-white">Static Curricula vs. Rapid Industry Shifts</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Traditional degrees lag 3–5 years behind cloud, AI, and distributed systems evolutions. Students lack verified competency proof, relying solely on unvetted GPA.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 space-y-2">
              <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">The NodalConnector Solution</span>
              <h4 className="text-sm font-bold text-white">Continuous Diagnostic Skill Mapping</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adaptive proctored assessments compute fulfillment ratios against real corporate role requirements. Bridge courses with roadmap.sh guides close gaps automatically.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Four Pillars of Convergence
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <div>
                  <p className="font-bold text-white">UGC Section 22 Standardized Degrees</p>
                  <p className="text-slate-400 text-[11px]">Strict degree cascade preventing invalid or hallucinated qualifications.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <div>
                  <p className="font-bold text-white">Authentic Skill Radar Diagnostics</p>
                  <p className="text-slate-400 text-[11px]">Honest mathematical scoring without Math.random() or mock data.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <div>
                  <p className="font-bold text-white">Corporate Matchmaking Gates</p>
                  <p className="text-slate-400 text-[11px]">Minimum verified competency gate required before 1-click internship applications.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">4</span>
                <div>
                  <p className="font-bold text-white">Regulatory Institutional Analytics</p>
                  <p className="text-slate-400 text-[11px]">Real-time cohort progress oversight with CSV export for NIRF & NAAC auditing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 3: Stageshow Live Faux UI Interactive Showcase
    {
      id: 3,
      category: 'STAGESHOW PRODUCT SHOWCASE',
      title: 'Interactive Platform Faux UI Demonstration',
      subtitle: 'Experience NodalConnector Live Telemetry, Diagnostic Radars & Corporate Gates',
      content: (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Stageshow Browser Chrome Window Frame */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Top Chrome Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">https://</span>
                <span>portal.nodalconnector.gov.in</span>
                <span className="text-slate-400">/assessment/radar</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ACTIVE SESSION</span>
              </div>
            </div>

            {/* Stage Mode Switcher */}
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStageshowTab('radar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stageshowTab === 'radar'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Competency Radar
                </button>
                <button
                  onClick={() => setStageshowTab('matchmaking')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stageshowTab === 'matchmaking'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Corporate Pipeline
                </button>
                <button
                  onClick={() => setStageshowTab('proctoring')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stageshowTab === 'proctoring'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Proctored Code Sandbox
                </button>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Fulfillment: 88.4% (Tier 1 Passed)</span>
            </div>

            {/* Stageshow Viewport */}
            <div className="p-6 bg-slate-950/60 min-h-[260px]">
              {stageshowTab === 'radar' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Skill Diagnostic Metrics</span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between mb-1 text-[11px] font-semibold">
                          <span>Distributed Systems & Algorithms</span>
                          <span className="text-emerald-400 font-mono">94%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-[11px] font-semibold">
                          <span>Cloud Infrastructure & CI/CD Pipelines</span>
                          <span className="text-emerald-400 font-mono">88%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-teal-400 rounded-full" style={{ width: '88%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-[11px] font-semibold">
                          <span>Applied AI & Machine Learning Workflows</span>
                          <span className="text-emerald-400 font-mono">82%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <h5 className="text-xs font-bold text-white">Tier 1 Placement Eligibility</h5>
                    <p className="text-[11px] text-slate-400">Pre-cleared for direct interview matching with corporate partners.</p>
                  </div>
                </div>
              )}

              {stageshowTab === 'matchmaking' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { company: 'TCS Digital Innovations', role: 'Cloud Platform Associate', match: '96%', stipend: '₹45,000/mo' },
                    { company: 'Infosys Springboard', role: 'Full-Stack Systems Intern', match: '92%', stipend: '₹35,000/mo' },
                    { company: 'Ministry of Ayush / AIIA', role: 'Health Informatics Analyst', match: '89%', stipend: '₹40,000/mo' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-400">{item.match} Match</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.stipend}</span>
                      </div>
                      <h5 className="text-xs font-bold text-white line-clamp-1">{item.role}</h5>
                      <p className="text-[11px] text-slate-400">{item.company}</p>
                      <button className="w-full mt-2 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]">
                        1-Click Apply (Gate Passed)
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {stageshowTab === 'proctoring' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-emerald-300 border border-slate-800 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                      <span>Task #4: Transaction Concurrency Control</span>
                      <span className="text-emerald-400">Test Suite: 5/5 PASSED</span>
                    </div>
                    <pre className="text-[11px]">
{`const tx = await session.withTransaction(async () => {
  return await verifyAtomicIntegrity(auditLog); // OK 14ms
});`}
                    </pre>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> AI Face-Lock Active
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tab Switch Counter: 0
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 4: Diagnostic Assessment Engine & Proctoring
    {
      id: 4,
      category: 'TECHNICAL CORE',
      title: 'Diagnostic Assessment & Anti-Cheat Engine',
      subtitle: 'Standardized Question Moderation, Sandbox Testing & Integrity Verification',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <Terminal className="w-4 h-4" />
                <span>Admin Moderation Lifecycle</span>
              </div>
              <h4 className="text-sm font-bold text-white">Curated Multi-Disciplinary Question Bank</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Questions undergo 3-tier moderation: <code className="text-amber-400">active</code>, <code className="text-blue-400">under_review</code>, and <code className="text-slate-400">retired</code>. Questions span algorithmic logic, systems design, cloud architectures, and healthcare data.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Browser Proctoring HUD</span>
              </div>
              <h4 className="text-sm font-bold text-white">Full-Screen Lock & Violation Audits</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tracks tab switching, window defocusing, and multiple displays. Automatic violation strikes invalidate fraudulent test sessions without human supervisor overhead.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              Evaluation Architecture
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Question Categories</span>
                <span className="font-mono font-bold text-emerald-400">CS, Cloud, AI, Ayush</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Passing Threshold</span>
                <span className="font-mono font-bold text-emerald-400">70% Competency</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Verification Certificate</span>
                <span className="font-mono font-bold text-emerald-400">Instant Cryptographic Hash</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Roadmap Alignment</span>
                <span className="font-mono font-bold text-emerald-400">roadmap.sh Curated Paths</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 5: Compulsory Resume Upload & AI Extraction Pipeline
    {
      id: 5,
      category: 'PIPELINE ARCHITECTURE',
      title: 'Compulsory Resume Upload & AI Extraction',
      subtitle: 'Server-Side Document Parsing & Career Role Gap Analysis',
      content: (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-bold text-emerald-400 mb-1">Step 1</div>
                <h5 className="text-xs font-bold text-white">Client Upload</h5>
                <p className="text-[11px] text-slate-400 mt-1">PDF/DOCX validated (5MB limit & MIME checks)</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-bold text-blue-400 mb-1">Step 2</div>
                <h5 className="text-xs font-bold text-white">Server-Side Parse</h5>
                <p className="text-[11px] text-slate-400 mt-1">pdf-parse extracts raw text (no raw binary to LLM)</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-bold text-purple-400 mb-1">Step 3</div>
                <h5 className="text-xs font-bold text-white">Groq AI Extraction</h5>
                <p className="text-[11px] text-slate-400 mt-1">Honest JSON extraction of skills, education, experience</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-bold text-amber-400 mb-1">Step 4</div>
                <h5 className="text-xs font-bold text-white">Candidate Review</h5>
                <p className="text-[11px] text-slate-400 mt-1">Side-by-side editing before syncing to SkillProfile</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Candidate Integrity Protection
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                If the document text contains less than 30 characters (e.g. non-OCR scanned images), the system returns an honest extraction failure prompt rather than hallucinating credentials.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Target Role Competency Gap Evaluator
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reuses <code className="text-emerald-400">skillGapService.analyzeSkillGaps</code> with importance-weighted fulfillment ratios against real market job profiles.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 6: Indian Administrative Geography & College Discovery
    {
      id: 6,
      category: 'DATA STANDARDIZATION',
      title: 'Indian Administrative Geography & College Search',
      subtitle: 'Complete Official Mapping of All 28 States, 8 UTs & AISHE Universities',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <MapPin className="w-4 h-4" />
                <span>Deterministic Geography Cascade</span>
              </div>
              <h4 className="text-sm font-bold text-white">All 28 States + 8 Union Territories</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Standardized in <code className="text-emerald-400">server/src/config/indiaGeography.ts</code> with official district rosters. Zero-latency client cascade in <code className="text-blue-400">client/src/data/indiaGeography.ts</code>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <School className="w-4 h-4" />
                <span>Colleges & Universities Directory</span>
              </div>
              <h4 className="text-sm font-bold text-white">Full-Text Campus Discovery (/college)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Search verified engineering colleges and Ayush institutes by state, district, or university affiliation. Includes institutional claim workflows for registrars.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Location Endpoints & Normalization
            </h4>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-emerald-400 font-bold">GET</span> /api/locations/states
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Returns sorted list of 36 administrative states & UTs.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-emerald-400 font-bold">GET</span> /api/locations/districts?state=...
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Returns official district roster for selected territory.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-blue-400 font-bold">POST</span> /api/locations/normalize
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Normalizes freeform user address strings into structured records.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 7: P0 Security Remediation & 5-Tier Governance
    {
      id: 7,
      category: 'ENTERPRISE SECURITY',
      title: 'P0 Security Hardening & 5-Tier Governance',
      subtitle: 'OWASP Alignment, Authenticated Cloudinary Storage & Scoped Roles',
      content: (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-bold text-white">Private Storage</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cloudinary configured with <code className="text-emerald-400">type: 'authenticated'</code>. Resumes and certificates accessible only via time-limited signed URLs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-bold text-white">Path Traversal Neutralized</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Strict <code className="text-blue-400">sanitizeFilename</code> regex strips <code className="text-slate-400">..</code> path traversal sequences and control characters from uploads.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-bold text-white">Dedicated Institution Role</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Isolates production analytics from demo accounts via strict <code className="text-purple-400">REAL_USER_FILTER</code>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">Role Segregation:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[11px]">STUDENT</span>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-[11px]">JOB SEEKER</span>
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-mono text-[11px]">INDUSTRY</span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono text-[11px]">ACADEMICIAN</span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-mono text-[11px]">INSTITUTION ADMIN</span>
            </div>
            <span className="text-emerald-400 font-semibold text-[11px]">OWASP Top 10 Compliant</span>
          </div>
        </div>
      )
    },

    // SLIDE 8: Production Deployments & Impact
    {
      id: 8,
      category: 'DEPLOYMENT & IMPACT',
      title: 'Production Infrastructure & Next Milestones',
      subtitle: 'Live Cloud Deployments, Microservices & Future Enhancements',
      content: (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  Live Web Application Endpoints
                </h5>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold">ONLINE</span>
              </div>
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Frontend Vercel:</span>
                  <a href="https://sih26044-ayush-portal.vercel.app" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                    sih26044-ayush-portal.vercel.app
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Backend Railway:</span>
                  <span className="text-blue-400 truncate max-w-[220px]">
                    ...portal-production.up.railway.app
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Database Engine:</span>
                  <span className="text-purple-400">MongoDB Atlas (Replica Set)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Strategic Impact & Future Scope
              </h5>
              <div className="space-y-2.5 text-xs text-slate-300">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>AI Matching Scale:</strong> Direct corporate-student pipelines reducing campus placement overhead by 65%.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>UGC Curriculum Sync:</strong> Autonomous gap telemetry feeds into university Board of Studies for semesterly syllabus revision.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>National Ayush Bio-Pharma Track:</strong> Direct incubation access for CCRAS, AIIA, and herbal R&D labs.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center text-xs text-emerald-300">
            <span className="font-bold">Thank You — Jury & Evaluation Committee</span> • Ready for Live Demonstration & Technical Q&A
          </div>
        </div>
      )
    }
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(totalSlides - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, totalSlides]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoplay, nextSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const active = slides[currentSlide];

  return (
    <div className="h-screen w-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[140px] pointer-events-none" />

      {/* Top Header / Deck Navigation */}
      <header className="flex items-center justify-between z-20 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">NodalConnector</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                SIH26044
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">
              Idea Presentation & Technical Defense Guide
            </span>
          </div>
        </div>

        {/* Deck Controls */}
        <div className="flex items-center gap-2">
          {/* Thumbnails Drawer Toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showThumbnails
                ? 'bg-slate-800 text-white border-slate-700'
                : 'text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
            title="Toggle Slide Thumbnails"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Autoplay Toggle */}
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isAutoplay
                ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                : 'text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
            title={isAutoplay ? 'Pause Autoplay' : 'Start Autoplay'}
          >
            {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-xs text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all cursor-pointer"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Slide Progress Counter */}
          <div className="ml-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 font-bold">
            {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </div>
        </div>
      </header>

      {/* Main Slide Content Stage */}
      <main className="flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto my-4 z-10 overflow-y-auto">
        <div className="space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {active.category}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {active.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
            {active.subtitle}
          </p>
        </div>

        <div className="w-full">
          {active.content}
        </div>
      </main>

      {/* Thumbnails Drawer (Overlay) */}
      {showThumbnails && (
        <div className="absolute inset-x-0 bottom-20 z-30 p-4 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 max-w-5xl mx-auto rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Slide Directory</span>
            <button
              onClick={() => setShowThumbnails(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Close ✕
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlide(idx);
                  setShowThumbnails(false);
                }}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono font-bold mb-1">Slide {idx + 1}</div>
                <div className="text-[11px] font-bold truncate">{s.title.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Footer Controls & Linear Progress Bar */}
      <footer className="z-20 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button
            onClick={nextSlide}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-slate-950 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Global Slide Progress Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-4">
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
          Use ← / → Arrow Keys to Navigate
        </div>
      </footer>
    </div>
  );
}

export default App;
