import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { SkillProfile } from '../../types';
import { RadarChart } from '../../components/common/RadarChart';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { BookOpen, CheckCircle, AlertTriangle, Sparkles, HelpCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SkillProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.skills.getProfile();
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load skill profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isUnassessed = !profile.skills || profile.skills.length === 0 || profile.status === 'not_assessed';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              NATIONAL SKILL MAPPING
            </span>
            <span className="text-xs text-slate-400">Last Calibrated: {profile.lastAssessmentDate}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Skill Profile & Industry Gap Analysis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual benchmarking of your competencies against active industry hiring requirements and competency frameworks
          </p>
        </div>

        <Link
          to="/student/assessment"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors self-start sm:self-auto flex items-center gap-2 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isUnassessed ? 'Start Diagnostic Assessment' : 'Retake Diagnostic Assessment'}</span>
        </Link>
      </div>

      {/* Program Context Banner if not yet assessed */}
      {isUnassessed && (
        <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-amber-900 dark:text-amber-200">
              Competencies Not Yet Assessed for Current Academic Context
            </div>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              Active program: <strong>{user?.degree || profile.academicContext?.degree || 'Technical Degree'}</strong> ({user?.department || 'Department'}). When academic programs or degrees are updated, previous assessments are archived to prevent stale data cross-contamination. Complete a diagnostic assessment to calibrate your radar.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Radar Chart + Skill Competency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Skill Chart Container */}
        <div className="lg:col-span-6 bg-[var(--card-bg)] rounded-3xl border border-[var(--border-default)] p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center text-center transition-colors">
          <div className="mb-4 text-left w-full">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Competency Gap Analysis</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Terracotta bars indicate your verified mastery; vertical notch markers indicate data-driven industry benchmarks.
            </p>
          </div>

          {isUnassessed ? (
            <div className="py-10 px-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border border-[var(--badge-warning-border)] flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Not Assessed for Current Program</h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs">
                No active competency metrics exist for this academic context. Take the diagnostic assessment to generate your real-time skill chart.
              </p>
              <Link
                to="/student/assessment"
                className="btn-system-primary mt-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Assessment</span>
              </Link>
            </div>
          ) : (
            <RadarChart skills={profile.skills} />
          )}
        </div>

        {/* Skill Breakdown List */}
        <div className="lg:col-span-6 bg-[var(--card-bg)] rounded-3xl border border-[var(--border-default)] p-6 sm:p-8 shadow-xs space-y-4 transition-colors">
          <h3 className="text-base font-bold text-[var(--text-primary)]">Verified Competencies Roster</h3>
          <div className="space-y-4 pt-1 max-h-[440px] overflow-y-auto pr-1">
            {isUnassessed || profile.skills.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
                No individual skills registered yet. Take the diagnostic assessment to calibrate your competencies.
              </div>
            ) : (
              profile.skills.map((s, idx) => {
                const hasBenchmark = typeof s.industryBenchmark === 'number' && s.industryBenchmark !== null;
                const isVerified = s.verificationStatus === 'verified' || (s.verified && s.verificationStatus !== 'unverified');
                const isPending = s.verificationStatus === 'pending';

                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</span>
                        {isVerified ? (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800"
                            title={s.verificationSources?.[0]?.notes || 'Verified by proctored assessment or verified certificate'}
                          >
                            <CheckCircle className="w-3 h-3" /> Verified Evidence
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="w-3 h-3" /> Verification Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            Unverified (Assessment Pending)
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.level}%</span>
                    </div>

                    {/* Progress bar comparing student vs benchmark */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden relative">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, s.level)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Category: {s.category || 'Competency'}</span>
                        {hasBenchmark ? (
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            Required Benchmark: <strong className="text-blue-600 dark:text-blue-400">{s.industryBenchmark}%</strong>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">
                            Benchmark unavailable (Insufficient industry data)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Gap Analysis & Action Recommendations */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 transition-colors">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Industry Gap Analysis & Bridge Modules</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Targeted training recommendations to bridge detected deficiencies for active internship & job postings
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-2">Competency Domain</th>
                <th className="pb-3 px-2">Current Level</th>
                <th className="pb-3 px-2">Industry Standard</th>
                <th className="pb-3 px-2">Gap Delta</th>
                <th className="pb-3 px-2">Action Priority</th>
                <th className="pb-3 px-2 text-right">Recommended Bridge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isUnassessed || profile.gapAnalysis.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No gaps recorded yet. Take the diagnostic assessment to calibrate your competencies against industry requirements.
                  </td>
                </tr>
              ) : (
                profile.gapAnalysis.map((gap, idx) => {
                  const hasBenchmark = typeof gap.requiredLevel === 'number' && gap.requiredLevel !== null;
                  const isNoData = gap.status === 'NO_BENCHMARK_DATA' || !hasBenchmark;
                  const isMatched = gap.status === 'MATCHED' || (hasBenchmark && gap.gapPercentage === 0);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-white">{gap.skill}</td>
                      <td className="py-3.5 px-2 text-slate-700 dark:text-slate-300 font-semibold">{gap.currentLevel}%</td>
                      <td className="py-3.5 px-2 font-semibold">
                        {hasBenchmark ? (
                          <span className="text-blue-600 dark:text-blue-400">{gap.requiredLevel}%</span>
                        ) : (
                          <span className="text-slate-400 italic">No Benchmark Data</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2 font-bold">
                        {isNoData ? (
                          <span className="text-slate-400 font-medium">Uncalibrated</span>
                        ) : isMatched ? (
                          <span className="text-emerald-600 dark:text-emerald-400">Meets Standard</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">-{gap.gapPercentage}%</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2">
                        {isNoData ? (
                          <Badge variant="blue">Benchmark Needed</Badge>
                        ) : isMatched ? (
                          <Badge variant="emerald">Satisfied</Badge>
                        ) : (
                          <Badge
                            variant={gap.priority === 'High' ? 'rose' : gap.priority === 'Medium' ? 'amber' : 'blue'}
                          >
                            {gap.priority || 'Medium'} Priority
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <Link
                          to="/student/learning"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>View Bridge Modules</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
