import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ICareerRole, IResume } from '../../types';
import {
  Briefcase,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Loader2,
  TrendingUp,
  Target,
  FileText,
  RefreshCw,
  Plus,
  Award,
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const TargetRoleGapPage: React.FC = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<ICareerRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<ICareerRole | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeResume, setActiveResume] = useState<IResume | null>(null);
  const [resumeMetadata, setResumeMetadata] = useState<any>(null);

  // Fetch student's verified resume
  useEffect(() => {
    async function loadResume() {
      try {
        const res = await api.resumes.getMyResume();
        if (res.data) {
          setActiveResume(res.data);
        }
      } catch {
        // No resume uploaded yet
      }
    }
    loadResume();
  }, []);

  // Fetch available career roles
  useEffect(() => {
    async function loadRoles() {
      setLoadingRoles(true);
      try {
        const res = await api.careerRoles.getAll();
        const roleData = res.data || [];
        setRoles(roleData);
        if (roleData.length > 0) {
          const hasRec = roleData.some((r: any) => r.recommended);
          if (hasRec) {
            setSelectedCategory('Recommended');
            const firstRec = roleData.find((r: any) => r.recommended);
            setSelectedRole(firstRec || roleData[0]);
          } else {
            setSelectedRole(roleData[0]);
          }
        } else {
          setSelectedRole(null);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load career roles.');
      } finally {
        setLoadingRoles(false);
      }
    }
    loadRoles();
  }, []);

  // Run gap analysis when selected role changes
  useEffect(() => {
    if (!selectedRole) return;
    async function runGapAnalysis() {
      setAnalyzing(true);
      setErrorMessage('');
      try {
        const isOpp = (selectedRole as any)?.isOpportunity;
        const oppId = isOpp ? ((selectedRole as any)?.opportunityId || selectedRole?.id) : undefined;
        const roleId = !isOpp ? (selectedRole?.id || (selectedRole as any)?._id) : undefined;
        const res = await api.careerRoles.analyzeGap(roleId, selectedRole?.slug, oppId);
        if (res.data?.analysis) {
          setAnalysisResult(res.data.analysis);
        }
        if (res.data?.resumeMetadata) {
          setResumeMetadata(res.data.resumeMetadata);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to compute skill gap analysis.');
      } finally {
        setAnalyzing(false);
      }
    }
    runGapAnalysis();
  }, [selectedRole]);

  const normalizeCategory = (cat?: string) => {
    if (!cat) return '';
    const trimmed = cat.trim();
    if (trimmed === 'Technology & Engineering' || trimmed === 'Technology and Engineering') {
      return 'Engineering & Technology';
    }
    return trimmed;
  };

  const categories = ['All', 'Recommended', ...Array.from(new Set(roles.map((r) => normalizeCategory(r.category)).filter(Boolean)))];

  const filteredRoles = roles.filter((r) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Recommended') return Boolean(r.recommended);
    return normalizeCategory(r.category) === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              NATIONAL CAREER BENCHMARK RADAR
            </span>
            <span className="text-xs text-slate-400">Industry-Aligned Competency Mapping</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Target Role Gap Analysis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Evaluate your verified skill competencies and curriculum profile against national benchmark roles and live industry requisitions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/student/resume')}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            {activeResume ? 'Update Resume Document' : 'Upload Resume Document'}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'Recommended' ? (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Recommended
              </span>
            ) : (
              cat
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Role Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Select Career Profile ({filteredRoles.length})
          </h2>

          {loadingRoles ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Loading benchmark roles...</p>
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No postings found</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedCategory === 'Recommended'
                  ? 'No personalized recommendations yet for this category. Switch to "All" to view all live postings.'
                  : 'Check back as employers post new opportunities.'}
              </p>
            </div>
          ) : (
            filteredRoles.map((r) => {
              const isSelected = selectedRole?.slug === r.slug;
              return (
                <div
                  key={r.slug}
                  onClick={() => setSelectedRole(r)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-500/20'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/60 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 truncate">
                      {r.category}
                    </span>
                    {r.recommended ? (
                      <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
                        <Sparkles className="w-2.5 h-2.5" />
                        Recommended
                      </span>
                    ) : r.isOpportunity ? (
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full truncate max-w-[130px] shrink-0">
                        {r.company || 'Live Opportunity'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                        {r.source?.replace('_', ' ') || 'Framework'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">{r.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{r.description}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{r.requiredSkills?.length || 0}</span> required competencies
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        Active <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Comparative Analysis */}
        <div className="lg:col-span-8 space-y-6">
          {selectedRole ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
              {/* Role Header Banner */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    {selectedRole.isOpportunity ? (
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          Live {selectedRole.type === 'internship' ? 'Internship' : 'Job'} Posting
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{selectedRole.company}</span>
                        {selectedRole.location && (
                          <span className="text-xs text-slate-400">&bull; {selectedRole.location}</span>
                        )}
                        {(selectedRole.stipend || selectedRole.salary) && (
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                            {selectedRole.stipend || selectedRole.salary}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {selectedRole.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">&bull; Source: National Benchmark Framework</span>
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedRole.name}</h2>
                  </div>

                  {analysisResult && (
                    <div className="flex items-center gap-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 px-4 py-2.5 rounded-2xl">
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Match</div>
                        <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                          {analysisResult.overallCompatibility}%
                        </div>
                      </div>
                      <div className="w-11 h-11 rounded-full border-4 border-emerald-500 dark:border-emerald-400 bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-xs text-emerald-700 dark:text-emerald-400 shadow-xs">
                        {analysisResult.overallCompatibility}%
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{selectedRole.description}</p>
              </div>

              {/* Analysis States */}
              {analyzing ? (
                <div className="py-16 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 dark:text-emerald-400 mb-3" />
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Comparing evaluated skills against role benchmarks...
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Executing mathematical fulfillment matrix</div>
                </div>
              ) : analysisResult ? (
                <div className="space-y-6">
                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Matched
                      </div>
                      <div className="text-2xl font-black text-emerald-950 dark:text-white mt-1">
                        {analysisResult.matchingSkills?.length || 0}
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Meets or exceeds benchmark</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-amber-950 dark:text-amber-100">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        Partial Gap
                      </div>
                      <div className="text-2xl font-black text-amber-950 dark:text-white mt-1">
                        {analysisResult.partialSkills?.length || 0}
                      </div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">Competent, bridge needed</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 text-rose-950 dark:text-rose-100">
                      <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs font-bold">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        Missing
                      </div>
                      <div className="text-2xl font-black text-rose-950 dark:text-white mt-1">
                        {analysisResult.missingSkills?.length || 0}
                      </div>
                      <div className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">Unassessed prerequisites</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-bold">
                        <TrendingUp className="w-4 h-4 text-slate-500" />
                        Total Target
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {selectedRole.requiredSkills?.length || 0}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Core role competencies</div>
                    </div>
                  </div>

                  {/* Explainable Breakdown List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Detailed Competency Breakdown
                    </h3>

                    {(analysisResult.gapAnalysisList || []).map((item: any, idx: number) => {
                      const isMatched = item.status === 'MATCHED';
                      const isPartial = item.status === 'PARTIAL';
                      const isMissing = item.status === 'MISSING';

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                            isMatched
                              ? 'border-emerald-200/80 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20'
                              : isPartial
                              ? 'border-amber-200/80 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20'
                              : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                              {isPartial && <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
                              {isMissing && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{item.skill}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isMatched
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                    : isPartial
                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.reason}</p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Current: <span className="font-bold text-slate-900 dark:text-white">{item.currentLevel}%</span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Required: {item.requiredLevel !== null ? `${item.requiredLevel}%` : 'N/A'}
                              </div>
                            </div>

                            {item.recommendedProgramId ? (
                              <button
                                onClick={() => navigate('/student/learning')}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                Bridge
                              </button>
                            ) : isMissing ? (
                              <button
                                onClick={() => navigate('/student/assessment')}
                                title="Calibrate this competency via diagnostic assessment"
                                className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                              >
                                <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                Evaluate
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation summary note */}
                  <div className="p-5 bg-gradient-to-r from-emerald-50/90 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        AI Diagnostics Assessment Recommendation
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {analysisResult.explanation}
                      </p>
                      <button
                        onClick={() => navigate('/student/assessment')}
                        className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                      >
                        Launch Adaptive Skill Evaluation
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : !loadingRoles ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs text-center">
              <Target className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Select an Opportunity or Career Role</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Choose any active employer listing or benchmark standard from the left to compute your personalized skill gap analysis.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TargetRoleGapPage;
