import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { Internship, Job, SkillProfile, StudentAnalytics } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { GaugeScore } from '../../components/common/GaugeScore';
import { Badge } from '../../components/common/Badge';
import { UserAvatar } from '../../components/common/UserAvatar';
import { AiOnboardingModal } from '../../components/student/AiOnboardingModal';
import { ProfileCompletionCard } from '../../components/analytics/AnalyticsCharts';
import {
  Award,
  Briefcase,
  FileCheck,
  Calendar,
  ArrowRight,
  Sparkles,
  BookOpen,
  MapPin,
  Clock,
  TrendingUp,
  AlertCircle,
  Video,
  BrainCircuit,
  Check,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [upcomingMeeting, setUpcomingMeeting] = useState<any | null>(null);
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAiModal, setShowAiModal] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, intRes, jobRes, appRes, meetRes, analyticsRes] = await Promise.allSettled([
        api.skills.getProfile(),
        api.internships.getAll(),
        api.jobs.getAll(),
        api.applications.getMyApplications(),
        api.meetings.getMyMeetings(),
        api.analytics.getStudent(),
      ]);

      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data);
      }

      if (profileRes.status === 'fulfilled') {
        const prof = profileRes.value.data;
        setSkillProfile(prof);
        if (!prof || prof.overallScore === 0) {
          setShowAiModal(true);
        }
      }

      if (intRes.status === 'fulfilled') {
        setInternships(intRes.value.data.slice(0, 3));
      }

      if (jobRes.status === 'fulfilled') {
        setJobs(jobRes.value.data.slice(0, 2));
      }

      if (appRes.status === 'fulfilled') {
        setApplicationsCount(appRes.value.data?.length || 0);
      }

      if (meetRes.status === 'fulfilled') {
        const meetings = meetRes.value.data || [];
        const upcoming = meetings.find((m: any) => new Date(m.scheduledAt) >= new Date() && m.status === 'scheduled');
        setUpcomingMeeting(upcoming || null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAiModalComplete = () => {
    setShowAiModal(false);
    loadDashboardData();
  };

  const isAssessed = skillProfile && skillProfile.overallScore > 0;
  const isNewUser = (user?.loginCount ?? 1) <= 1;

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto pb-12 font-ui">
      {/* Welcome Banner */}
      <div className="bg-[var(--card-bg)] rounded-[14px] p-6 sm:p-7 border border-[var(--border-default)] shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.18)] border border-[var(--border-default)] text-[var(--orange-text)] dark:text-[var(--orange-lighter)] text-xs font-heading font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
            <span>Scholar Workspace • {user?.degree || 'Technical Degree'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold tracking-tight text-[var(--text-primary)]">
            {isNewUser ? `Welcome to NodalConnector, ${user?.name || 'Scholar'}!` : `Welcome back, ${user?.name || 'Scholar'}!`}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body leading-relaxed">
            {isNewUser
              ? "Your candidate profile is active. Take the diagnostic competency assessment to map skill gaps and unlock verified employer placement gates."
              : "Track your verified competency progress, prepare for scheduled interviews, and apply to matching industry opportunities."}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAiModal(true)}
              className="btn-system-primary px-4 py-2 rounded-[10px] font-heading font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>{isAssessed ? 'Retake Diagnostic' : 'Launch Skill Diagnostic'}</span>
            </button>
            <Link
              to="/student/internships"
              className="btn-system-secondary px-4 py-2 rounded-[10px] font-heading font-semibold text-xs transition-all cursor-pointer"
            >
              Browse Internships
            </Link>
          </div>
        </div>
        <div className="relative z-10 shrink-0 hidden md:block">
          <UserAvatar user={user} size="xl" className="ring-1 ring-[var(--border-default)] shadow-xs" />
        </div>
      </div>

      {/* Active Study Sprint Banner */}
      {user?.studyRoadmap && !isAssessed && (
        <div className="p-4 rounded-[12px] bg-[var(--blue-tint-80)] dark:bg-[rgba(106,155,204,0.15)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--card-bg)] text-[var(--blue-text)] dark:text-[var(--blue)] flex items-center justify-center shrink-0 border border-[var(--border-default)]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-xs text-[var(--text-primary)]">Active Preparation Sprint</h3>
                <span className="text-[10px] font-heading font-semibold bg-[var(--card-bg)] text-[var(--blue-text-strong)] px-2 py-0.5 rounded-full border border-[var(--border-default)]">
                  {user.studyRoadmap.recommendedTimeline}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
                Targeted review topics: <strong className="text-[var(--text-primary)]">{user.studyRoadmap.targetedTopics?.join(' • ')}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAiModal(true)}
            className="btn-system-primary px-3.5 py-1.5 rounded-[8px] font-heading font-semibold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Retake Diagnostic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mandatory Diagnostic Alert Banner */}
      {!isAssessed && !user?.studyRoadmap && (
        <div className="p-4 rounded-[12px] bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.15)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--card-bg)] text-[var(--orange-text)] dark:text-[var(--orange)] flex items-center justify-center shrink-0 border border-[var(--border-default)]">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xs text-[var(--text-primary)]">Skill Diagnostic Required</h3>
              <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
                Complete diagnostic questions tailored to <strong className="text-[var(--text-primary)]">{user?.currentDomain || user?.degree || 'your technical degree'}</strong> to generate your verified competency profile.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAiModal(true)}
            className="btn-system-primary px-3.5 py-1.5 rounded-[8px] font-heading font-semibold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Take Diagnostic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Real-time Profile Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileCompletionCard completion={analytics.profileCompletion} />
          <div className="bg-[var(--card-bg)] p-5 rounded-[14px] border border-[var(--border-default)] shadow-xs flex items-center justify-between gap-4 transition-colors">
            <div>
              <span className="text-xs font-heading font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Average Skill Match
              </span>
              <h3 className="text-xl font-heading font-bold text-[var(--text-primary)] mt-0.5">
                {analytics.averageSkillMatch > 0 ? `${analytics.averageSkillMatch}%` : 'Assessment Active'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-body mt-1">
                {analytics.applicationsViewed} of {analytics.applicationsSent} applications reviewed by recruiters.
              </p>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-[var(--blue-tint-80)] text-[var(--blue-text)] dark:bg-[rgba(106,155,204,0.18)] dark:text-[var(--blue)] flex items-center justify-center font-bold text-base flex-shrink-0 border border-[var(--border-default)]">
              <TrendingUp className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Competency Index"
          value={isAssessed ? `${skillProfile?.overallScore} / 100` : 'Pending'}
          subtitle={isAssessed ? `Top ${Math.max(1, 100 - (skillProfile?.rankPercentile ?? 0))}% in peer cohort` : 'Diagnostic Required'}
          icon={Award}
          color="green"
          trend={isAssessed ? { value: 'Verified', isPositive: true } : undefined}
        />
        <StatCard
          title="Active Applications"
          value={applicationsCount.toString()}
          subtitle={applicationsCount === 0 ? 'No active submissions' : `${applicationsCount} in recruiter review`}
          icon={FileCheck}
          color="blue"
        />
        <StatCard
          title="Upcoming Interview"
          value={upcomingMeeting ? new Date(upcomingMeeting.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'None'}
          subtitle={upcomingMeeting ? `${upcomingMeeting.title.substring(0, 20)}...` : 'No meetings scheduled'}
          icon={Calendar}
          color="orange"
        />
        <StatCard
          title="Skill Gap Modules"
          value={skillProfile?.gapAnalysis?.length ? `${skillProfile.gapAnalysis.length} Identified` : '0 Gaps'}
          subtitle={skillProfile?.gapAnalysis?.[0]?.skill ? `Priority: ${skillProfile.gapAnalysis[0].skill.substring(0, 18)}...` : 'Diagnostic required'}
          icon={BookOpen}
          color="orange"
        />
      </div>

      {/* Main Grid: Skill Score Gauge & Recommended Openings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skill Score Gauge & Priority Bridge Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-[var(--text-primary)] text-sm">Competency Score Gauge</h3>
              {isAssessed && (
                <Link to="/student/skills" className="text-xs font-heading font-semibold text-[var(--text-link)] hover:text-[var(--text-link-hover)] inline-flex items-center gap-1">
                  <span>View Radar</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            {isAssessed ? (
              <GaugeScore score={skillProfile?.overallScore || 0} percentile={skillProfile?.rankPercentile || 0} />
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[var(--bg-subtle)] border border-dashed border-[var(--border-strong)] flex items-center justify-center mx-auto text-[var(--text-disabled)] font-bold text-base">
                  --
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-body">No assessment completed yet</p>
                <button
                  onClick={() => setShowAiModal(true)}
                  className="btn-system-primary px-3 py-1.5 rounded-[8px] font-heading font-semibold text-xs cursor-pointer"
                >
                  Start Diagnostic Test
                </button>
              </div>
            )}

            {/* Competency breakdown */}
            {isAssessed && skillProfile?.skills && skillProfile.skills.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[var(--border-default)] space-y-2.5">
                {skillProfile.skills.slice(0, 4).map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-heading font-medium">
                      <span className="text-[var(--text-secondary)] truncate max-w-[180px]">{s.name}</span>
                      <span className="text-[var(--green-text)] dark:text-[var(--green)] font-mono font-semibold">{s.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--border-default)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--green)] rounded-full transition-all duration-500"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Matched Internships & Live Meeting Link */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live Meetings Quick Link */}
          <div className="bg-[var(--card-bg)] rounded-[14px] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[var(--border-default)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[var(--green-tint-80)] text-[var(--green-text)] dark:bg-[rgba(120,140,93,0.18)] dark:text-[var(--green)] flex items-center justify-center shrink-0 border border-[var(--border-default)]">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-xs sm:text-sm text-[var(--text-primary)]">Live Interview & Guidance Room</h4>
                <p className="text-[11px] text-[var(--text-secondary)] font-body mt-0.5">
                  Direct connection with recruiters and faculty mentors via secure video calls.
                </p>
              </div>
            </div>
            <Link
              to="/meetings"
              className="btn-system-secondary px-3.5 py-1.5 rounded-[8px] font-heading font-semibold text-xs shrink-0"
            >
              Open Meetings
            </Link>
          </div>

          <div className="bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-[var(--text-primary)] text-sm">Matched Industry Opportunities</h3>
                <p className="text-xs text-[var(--text-secondary)] font-body">Tailored for {user?.degree || 'Engineering & Computing'}</p>
              </div>
              <Link to="/student/internships" className="text-xs font-heading font-semibold text-[var(--text-link)] hover:text-[var(--text-link-hover)] inline-flex items-center gap-1">
                <span>View All ({internships.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {internships.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-[var(--border-default)] rounded-[10px] bg-[var(--bg-subtle)]">
                <Briefcase className="w-8 h-8 text-[var(--text-disabled)] mx-auto mb-2" />
                <h4 className="text-xs font-heading font-semibold text-[var(--text-secondary)]">No active opportunities posted yet</h4>
                <p className="text-[11px] text-[var(--text-secondary)] font-body mt-1 max-w-sm mx-auto">
                  New verified internships and placement roles will appear here as employers publish openings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {internships.map((int) => {
                  const reqSkills = int.skillsRequired || [];
                  let matchScore: number | null = null;
                  if (reqSkills.length > 0 && skillProfile?.skills && skillProfile.skills.length > 0) {
                    const userSkills = skillProfile.skills.map((s: any) =>
                      (typeof s === 'string' ? s : s.name || '').toLowerCase().trim()
                    );
                    const matched = reqSkills.filter((req: string) =>
                      userSkills.some((u: string) => u.includes(req.toLowerCase().trim()) || req.toLowerCase().trim().includes(u))
                    ).length;
                    matchScore = Math.round((matched / reqSkills.length) * 100);
                  }

                  return (
                    <div
                      key={int.id}
                      className="p-3.5 rounded-[12px] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all bg-[var(--card-bg)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={int.companyLogo || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&auto=format&fit=crop&q=80'}
                          alt={int.company}
                          className="w-9 h-9 rounded-[8px] object-cover border border-[var(--border-default)] shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-heading font-bold text-[var(--text-primary)]">{int.title}</h4>
                            {matchScore !== null ? (
                              <Badge variant={matchScore >= 70 ? 'success' : matchScore >= 40 ? 'warning' : 'neutral'} size="sm">
                                {matchScore}% Match
                              </Badge>
                            ) : (
                              <Badge variant="neutral" size="sm">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">{int.company}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] mt-1.5 font-ui">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[var(--text-secondary)]" /> {int.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[var(--text-secondary)]" /> {int.duration}</span>
                            <span className="font-heading font-semibold text-[var(--green-text)] dark:text-[var(--green)]">{int.stipend}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        <Link
                          to={`/student/internships/${int.id || (int as any)._id}`}
                          className="btn-system-primary px-3 py-1.5 rounded-[8px] font-heading font-semibold text-xs"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Diagnostic Modal */}
      <AiOnboardingModal
        isOpen={showAiModal}
        onComplete={handleAiModalComplete}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
};
