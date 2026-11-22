import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  BarChart2,
  Briefcase,
  Terminal,
  ChevronRight,
  Building,
  Sparkles,
  Lock,
} from 'lucide-react';

export const StageshowProductHero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radar' | 'matchmaking' | 'proctoring'>('radar');
  const [simulatedScore] = useState(88.4);
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-cycle through product beats
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === 'radar') return 'matchmaking';
        if (prev === 'matchmaking') return 'proctoring';
        return 'radar';
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const handleTabClick = (tab: 'radar' | 'matchmaking' | 'proctoring') => {
    setAutoRotate(false);
    setActiveTab(tab);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-8 transition-all">
      {/* Main Browser Chrome Window Frame */}
      <div className="relative rounded-[16px] bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs overflow-hidden transition-colors">
        {/* Browser Top Chrome Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[var(--border-default)] bg-[var(--bg-subtle)]">
          {/* Window control dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-error)] inline-block opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--orange)] inline-block opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--green)] inline-block opacity-80" />
          </div>

          {/* Centered URL / SSL Bar */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-[8px] bg-[var(--card-bg)] border border-[var(--border-default)] text-[11px] font-mono text-[var(--text-secondary)] shadow-xs max-w-xs sm:max-w-sm w-full justify-center">
            <Lock className="w-3 h-3 text-[var(--green)] shrink-0" />
            <span className="text-[var(--orange)] font-semibold">https://</span>
            <span className="truncate font-medium text-[var(--text-primary)]">app.nodalconnector.com</span>
            <span className="text-[var(--text-disabled)]">/preview</span>
          </div>

          {/* Live System Telemetry Status Tag */}
          <div className="flex items-center gap-1.5 bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.18)] px-2 py-0.5 rounded-full border border-[var(--border-default)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange)] animate-pulse" />
            <span className="text-[9px] font-heading font-semibold text-[var(--orange-text)] dark:text-[var(--orange-lighter)] uppercase tracking-wider hidden sm:inline">
              LIVE TELEMETRY
            </span>
          </div>
        </div>

        {/* Feature Mode Switcher Navigation inside the Stage */}
        <div className="px-4 sm:px-6 pt-3 pb-2.5 border-b border-[var(--divider-color)] bg-[var(--bg-subtle)] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleTabClick('radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-heading font-semibold transition-all cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)] ${
                activeTab === 'radar'
                  ? 'bg-[var(--btn-primary-bg)] !text-[var(--dark)] shadow-xs'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Competency Gap</span>
            </button>

            <button
              onClick={() => handleTabClick('matchmaking')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-heading font-semibold transition-all cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)] ${
                activeTab === 'matchmaking'
                  ? 'bg-[var(--btn-primary-bg)] !text-[var(--dark)] shadow-xs'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Corporate Matchmaking</span>
            </button>

            <button
              onClick={() => handleTabClick('proctoring')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-heading font-semibold transition-all cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)] ${
                activeTab === 'proctoring'
                  ? 'bg-[var(--btn-primary-bg)] !text-[var(--dark)] shadow-xs'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Diagnostic Assessment</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] font-ui text-[var(--text-secondary)]">
            <span className="px-2 py-0.5 rounded-full bg-[var(--card-bg)] font-mono text-[10px] font-semibold text-[var(--text-primary)] border border-[var(--border-default)]">
              Verified
            </span>
            <span>•</span>
            <span className="text-[var(--orange-text)] dark:text-[var(--orange-lighter)] font-medium">Automated Placement Gate</span>
          </div>
        </div>

        {/* Stage Content Viewport */}
        <div className="p-4 sm:p-6 bg-[var(--bg-page)] min-h-[360px] transition-colors">
          {/* BEAT 1: Competency Gap Analysis */}
          {activeTab === 'radar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center animate-in fade-in zoom-in-98 duration-180">
              <div className="lg:col-span-7 bg-[var(--card-bg)] p-5 rounded-[12px] border border-[var(--border-default)] shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[var(--orange)]">
                      Standardized Evaluation
                    </span>
                    <h3 className="text-base sm:text-lg font-heading font-bold text-[var(--text-primary)] tracking-tight">
                      Technical Competency Index
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-heading font-bold text-[var(--orange)] font-mono">
                      {simulatedScore}%
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary)] tracking-wider">
                      Fulfillment Ratio
                    </span>
                  </div>
                </div>

                {/* Interactive Skill Metric Bars */}
                <div className="space-y-3 pt-1">
                  {[
                    { name: 'Distributed Systems & Microservices', score: 94 },
                    { name: 'Cloud Infrastructure & DevOps CI/CD', score: 88 },
                    { name: 'Applied AI & Machine Learning Models', score: 82 },
                    { name: 'Bio-Pharma & Healthcare Data Analytics', score: 90 },
                  ].map((skill, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-heading font-medium">
                        <span className="text-[var(--text-primary)]">{skill.name}</span>
                        <span className="font-mono text-[var(--orange)] font-semibold">{skill.score}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--border-default)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--orange)] transition-all duration-700"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-[var(--text-secondary)] font-body flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green)] shrink-0" />
                    Adaptive algorithm calibrated against verified industry questions
                  </span>
                </div>
              </div>

              {/* Side Card: Automated Gap Analysis Feedback */}
              <div className="lg:col-span-5 bg-[var(--card-bg)] p-5 rounded-[12px] border border-[var(--border-default)] shadow-xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-[var(--divider-color)] pb-2.5">
                  <span className="text-xs font-heading font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
                    Bridge Recommendations
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--green-tint-80)] text-[var(--green-text-strong)] dark:bg-[rgba(120,140,93,0.2)] dark:text-[var(--green-tint-60)] font-heading font-semibold border border-[var(--border-default)]">
                    Target Ready
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--green)] mt-1.5 shrink-0" />
                    <div>
                      <p className="font-heading font-semibold text-[var(--text-primary)]">System Architecture Met</p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-body">Directly eligible for Tier-1 engineering roles.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--orange)] mt-1.5 shrink-0" />
                    <div>
                      <p className="font-heading font-semibold text-[var(--text-primary)]">Recommended Lab</p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-body">Complete containerization milestone.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-center">
                  <span className="text-xs text-[var(--text-link)] font-heading font-medium hover:underline cursor-pointer inline-flex items-center gap-1">
                    Explore personalized roadmap <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* BEAT 2: Direct Matchmaking Pipeline */}
          {activeTab === 'matchmaking' && (
            <div className="space-y-4 animate-in fade-in zoom-in-98 duration-180">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[var(--orange)]">
                    Corporate Pipeline
                  </span>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-[var(--text-primary)] tracking-tight">
                    Pre-Assessed Corporate Matchmaking
                  </h3>
                </div>
                <span className="text-xs text-[var(--text-secondary)] font-body">
                  Showing 3 verified matches for candidate index
                </span>
              </div>

              {/* Match Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {[
                  {
                    company: 'Enterprise Automation Systems',
                    role: 'Cloud Systems Software Intern',
                    stipend: '₹45,000 / month',
                    match: 96,
                    tag: 'Direct Gate Passed',
                    type: 'Full-Time Internship',
                  },
                  {
                    company: 'NextGen Software Platforms',
                    role: 'Full-Stack Platform Engineer',
                    stipend: '₹35,000 / month',
                    match: 92,
                    tag: 'Fast-Track',
                    type: 'Campus Placement',
                  },
                  {
                    company: 'Astra Bio-Analytics Labs',
                    role: 'Healthcare Data Informatics Fellow',
                    stipend: '₹40,000 / month',
                    match: 89,
                    tag: 'Research Fellow',
                    type: 'Enterprise Fellowship',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[12px] bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs hover:border-[var(--border-strong)] transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-heading font-medium uppercase px-2 py-0.5 rounded-full bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)] border border-[var(--border-default)]">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1 font-mono font-bold text-xs text-[var(--green-text)] dark:text-[var(--green)]">
                          <span>{item.match}%</span>
                          <span className="text-[10px] text-[var(--text-secondary)]">match</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-heading font-bold text-[var(--text-primary)] line-clamp-1">{item.role}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] font-body flex items-center gap-1 mt-1">
                        <Building className="w-3 h-3 text-[var(--text-secondary)] shrink-0" />
                        {item.company}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[var(--divider-color)] flex items-center justify-between text-xs">
                      <span className="font-heading font-semibold text-[var(--text-primary)]">{item.stipend}</span>
                      <span className="text-[10px] font-heading font-semibold text-[var(--green-text-strong)] dark:text-[var(--green-tint-60)] bg-[var(--green-tint-80)] dark:bg-[rgba(120,140,93,0.2)] px-2 py-0.5 rounded-full border border-[var(--border-default)]">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BEAT 3: Diagnostic Assessment HUD */}
          {activeTab === 'proctoring' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center animate-in fade-in zoom-in-98 duration-180">
              <div className="lg:col-span-7 bg-[var(--card-bg)] p-5 rounded-[12px] border border-[var(--border-default)] shadow-xs space-y-3.5">
                <div>
                  <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[var(--blue-text)] dark:text-[var(--blue)]">
                    Proctored Diagnostic Environment
                  </span>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-[var(--text-primary)] tracking-tight">
                    Standardized Question Moderation & Code Sandbox
                  </h3>
                </div>

                {/* Code Terminal Mockup */}
                <div className="rounded-[10px] bg-[var(--code-bg)] text-[var(--code-text)] p-3.5 font-mono text-xs shadow-xs border border-[var(--border-default)] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] border-b border-[var(--border-default)] pb-1.5">
                    <span className="font-semibold text-[var(--text-primary)]">Task #3: Queue Pipeline</span>
                    <span className="text-[var(--green)] font-bold">5/5 Passed</span>
                  </div>
                  <pre className="text-[11px] text-[var(--code-string)] overflow-x-auto font-mono">
{`// Distributed Queue Implementation
async function processBatch(jobs: QueueJob[]) {
  const result = await Promise.allSettled(jobs.map(dispatchTask));
  return verifyIntegrity(result); // OK (Latency: 12ms)
}`}
                  </pre>
                </div>

                <div className="flex items-center gap-4 text-xs font-body text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" />
                    Orientation Lock Active
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green)]" />
                    Zero Tab Switching
                  </span>
                </div>
              </div>

              {/* Side Card: Credential Issued */}
              <div className="lg:col-span-5 bg-[var(--card-bg)] p-5 rounded-[12px] border border-[var(--border-default)] shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-[10px] bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.18)] text-[var(--orange-text)] dark:text-[var(--orange-lighter)] mx-auto flex items-center justify-center border border-[var(--border-default)]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-[var(--text-primary)]">
                    Enterprise Competency Verified
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-body mt-1">
                    Cryptographically signed certificate with instant verification QR and verified benchmarks.
                  </p>
                </div>
                <div className="pt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)] text-[11px] font-mono font-medium inline-block border border-[var(--border-default)]">
                    ID: NC-CERT-2026-ENG-9042
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Satellite Floating Badge */}
        <div className="hidden sm:flex items-center gap-2 absolute bottom-3.5 right-4 bg-[var(--card-bg)] px-3 py-1.5 rounded-[10px] border border-[var(--border-default)] shadow-xs z-20">
          <div className="w-2 h-2 rounded-full bg-[var(--orange)]" />
          <div className="text-xs font-ui">
            <span className="font-semibold text-[var(--text-primary)]">9,420+ Openings</span>
            <span className="text-[var(--text-secondary)]"> • Verified Gate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
