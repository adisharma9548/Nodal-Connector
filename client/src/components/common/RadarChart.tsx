import React from 'react';
import { SkillItem } from '../../types';
import { CheckCircle2, AlertCircle, Award } from 'lucide-react';

interface SkillBarChartProps {
  skills: SkillItem[];
  size?: number;
  className?: string;
}

export const SkillBarChart: React.FC<SkillBarChartProps> = ({ skills, className = '' }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-secondary)] text-xs">
        No skill diagnostic scores available. Complete an assessment to generate your skill benchmark report.
      </div>
    );
  }

  // Calculate metrics
  const benchmarked = skills.filter(
    (s) => typeof s.industryBenchmark === 'number' && s.industryBenchmark !== null
  );
  const metCount = benchmarked.filter((s) => s.level >= (s.industryBenchmark || 0)).length;
  const avgScore = Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length);

  return (
    <div className={`w-full space-y-5 ${className}`}>
      {/* Top Summary KPI Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.2)] border border-[var(--border-default)] flex items-center justify-center text-[var(--orange-text)] dark:text-[var(--orange-lighter)]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Average Verified Competency
            </span>
            <div className="text-xl font-extrabold text-[var(--text-primary)]">
              {avgScore}%{' '}
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                across {skills.length} skills
              </span>
            </div>
          </div>
        </div>

        {benchmarked.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-default)] text-xs font-semibold text-[var(--text-primary)]">
            <CheckCircle2 className="w-4 h-4 text-[var(--green)]" />
            <span>
              {metCount} of {benchmarked.length} Benchmarks Met
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-[var(--orange)]" />
          <span>Verified Mastery Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-[var(--bg-subtle)] border-2 border-dashed border-[var(--border-strong)]" />
          <span>Target Industry Benchmark</span>
        </div>
      </div>

      {/* Horizontal Bar Chart Rows */}
      <div className="space-y-4">
        {skills.map((skill, idx) => {
          const hasBench = typeof skill.industryBenchmark === 'number' && skill.industryBenchmark !== null;
          const benchVal = hasBench ? skill.industryBenchmark! : 0;
          const gap = hasBench ? skill.level - benchVal : 0;
          const isMet = gap >= 0;

          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-[var(--card-shadow)] space-y-2 hover:border-[var(--card-hover-border)] transition-all"
            >
              {/* Skill Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                    {skill.name}
                  </span>
                  {skill.category && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                      {skill.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-extrabold text-[var(--orange)] font-mono">
                    {skill.level}%
                  </span>
                  {hasBench ? (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isMet
                          ? 'bg-[var(--green-tint-80)] text-[var(--green-text-strong)] dark:bg-[rgba(120,140,93,0.2)] dark:text-[var(--green-tint-60)] border border-[var(--border-default)]'
                          : 'bg-[var(--orange-tint-60)] text-[var(--orange-text-strong)] dark:bg-[rgba(217,119,87,0.2)] dark:text-[var(--orange-tint-60)] border border-[var(--border-default)]'
                      }`}
                    >
                      {isMet ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Met (+{gap}%)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>Gap ({gap}%)</span>
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-[10px] text-[var(--text-secondary)] italic">
                      No Benchmark
                    </span>
                  )}
                </div>
              </div>

              {/* Bar Comparison Track */}
              <div className="relative w-full h-3.5 rounded-full bg-[var(--progress-track)] overflow-hidden border border-[var(--border-default)]">
                {/* Benchmark Indicator Line */}
                {hasBench && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-[var(--text-primary)] z-10 opacity-75"
                    style={{ left: `${Math.min(100, Math.max(0, benchVal))}%` }}
                    title={`Target Benchmark: ${benchVal}%`}
                  />
                )}

                {/* Student Score Bar */}
                <div
                  className="h-full rounded-full bg-[var(--progress-fill)] transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }}
                />
              </div>

              {/* Sub-label indicators */}
              <div className="flex justify-between text-[10px] text-[var(--text-secondary)] font-mono pt-0.5">
                <span>0%</span>
                {hasBench && (
                  <span style={{ marginLeft: `${Math.min(90, Math.max(10, benchVal - 10))}%` }}>
                    Benchmark: {benchVal}%
                  </span>
                )}
                <span>100%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Export RadarChart as an alias for backward compatibility
export const RadarChart = SkillBarChart;
