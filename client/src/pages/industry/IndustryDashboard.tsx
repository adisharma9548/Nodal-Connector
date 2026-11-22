import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { Application, Internship, CompanyAnalytics } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ApplicationFunnelChart, TopSkillsDistribution } from '../../components/analytics/AnalyticsCharts';
import {
  Briefcase,
  Users,
  PlusCircle,
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { MouProposalModal } from '../../components/common/MouProposalModal';

export const IndustryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [meetingsCount, setMeetingsCount] = useState(0);
  const [analytics, setAnalytics] = useState<CompanyAnalytics | null>(null);
  const [showMouModal, setShowMouModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndustryData = async () => {
      setLoading(true);
      const companyQuery = user?.institution || user?.name || '';
      const [appRes, intRes, meetRes, analyticsRes] = await Promise.allSettled([
        api.applications.getCompanyApplicants(companyQuery),
        api.internships.getAll(),
        api.meetings.getMyMeetings(),
        api.analytics.getCompany(),
      ]);
      if (appRes.status === 'fulfilled') setApplicants(appRes.value.data || []);
      if (intRes.status === 'fulfilled') setInternships(intRes.value.data || []);
      if (meetRes.status === 'fulfilled') setMeetingsCount(meetRes.value.data?.length || 0);
      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
      setLoading(false);
    };
    fetchIndustryData();
  }, [user]);

  const isNewUser = (user?.loginCount ?? 1) <= 1;

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto pb-12 font-ui">
      {/* Welcome Banner */}
      <div className="bg-[var(--card-bg)] rounded-[14px] p-6 sm:p-7 border border-[var(--border-default)] shadow-xs relative overflow-hidden transition-colors">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.18)] border border-[var(--border-default)] text-[var(--orange-text)] dark:text-[var(--orange-lighter)] text-xs font-heading font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
            <span>Enterprise Recruitment Console • {user?.institution || 'Corporate Partner'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold tracking-tight text-[var(--text-primary)]">
            {isNewUser ? `Welcome, ${user?.name || 'Recruiter'}` : `Welcome back, ${user?.name || 'Recruiter'}`}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body leading-relaxed">
            {isNewUser
              ? `Your corporate portal for ${user?.institution || 'your organization'} is active. Post internships, review benchmarked applications, and host video interviews.`
              : `Logged in to ${user?.institution || 'Recruitment Console'}. You have ${applicants.length} student applicant${applicants.length === 1 ? '' : 's'} benchmarked against your skill criteria.`}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <Link
              to="/industry/post"
              className="btn-system-primary px-3.5 py-2 rounded-[10px] font-heading font-semibold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Role</span>
            </Link>
            <Link
              to="/meetings"
              className="btn-system-secondary px-3.5 py-2 rounded-[10px] font-heading font-semibold text-xs flex items-center gap-1.5"
            >
              <span>Live Interviews ({meetingsCount})</span>
            </Link>
            <Link
              to="/industry/candidates"
              className="btn-system-secondary px-3.5 py-2 rounded-[10px] font-heading font-semibold text-xs flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Talent</span>
            </Link>
            <Link
              to="/industry/programs"
              className="btn-system-secondary px-3.5 py-2 rounded-[10px] font-heading font-semibold text-xs flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learning Modules</span>
            </Link>
            <button
              onClick={() => setShowMouModal(true)}
              className="btn-system-secondary px-3.5 py-2 rounded-[10px] font-heading font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" />
              <span>Propose MoU</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Active Postings"
          value={internships.length.toString()}
          subtitle={`${internships.length} opportunity postings live`}
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Candidate Applications"
          value={applicants.length.toString()}
          subtitle={applicants.length === 0 ? 'No applications received yet' : 'In recruitment pipeline'}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Interviews Scheduled"
          value={meetingsCount.toString()}
          subtitle={meetingsCount === 0 ? 'No live interviews booked' : `${meetingsCount} live conferences`}
          icon={Calendar}
          color="orange"
        />
        <StatCard
          title="Avg. Time to Hire"
          value={analytics?.averageTimeToHire ? `${analytics.averageTimeToHire} Days` : 'N/A'}
          subtitle={analytics?.averageTimeToHire ? 'Application to offer duration' : 'Pending completed hires'}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Recruitment Analytics Funnel & Top Skills */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-heading font-bold text-[var(--text-primary)]">Application Recruitment Funnel</h3>
                <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">Real-time candidate progression through hiring stages</p>
              </div>
            </div>
            <ApplicationFunnelChart
              applied={analytics.applicationsByStatus?.APPLIED || 0}
              reviewed={analytics.applicationsByStatus?.REVIEWED || 0}
              shortlisted={analytics.applicationsByStatus?.SHORTLISTED || 0}
              rejected={analytics.applicationsByStatus?.REJECTED || 0}
            />
          </div>

          <div className="bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-heading font-bold text-[var(--text-primary)]">Top In-Demand Skills</h3>
                <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">Most sought competencies across your active job postings</p>
              </div>
            </div>
            <TopSkillsDistribution skills={analytics.topInDemandSkills || []} />
          </div>
        </div>
      )}

      {/* Recent Applicants Review Table */}
      <div className="bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-heading font-bold text-[var(--text-primary)]">Recent Candidate Pipeline</h3>
            <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
              Review verified candidates who have applied for your active openings
            </p>
          </div>
          <Link
            to="/industry/applicants"
            className="text-xs font-heading font-semibold text-[var(--text-link)] hover:text-[var(--text-link-hover)] inline-flex items-center gap-1"
          >
            <span>Manage All ({applicants.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-ui">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--table-header-bg)] text-[var(--text-secondary)] font-heading font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Applicant</th>
                <th className="py-2.5 px-3">Institution</th>
                <th className="py-2.5 px-3">Target Opportunity</th>
                <th className="py-2.5 px-3">Skill Match</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[var(--text-secondary)] font-body">
                    No candidate applications in the pipeline yet.
                  </td>
                </tr>
              ) : (
                applicants.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-heading font-semibold text-[var(--text-primary)]">{app.studentName}</div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-body">{app.studentEmail}</div>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)] font-body">{app.studentInstitute}</td>
                    <td className="py-3 px-3 font-medium text-[var(--text-primary)]">{app.opportunityTitle}</td>
                    <td className="py-3 px-3">
                      <Badge variant={app.skillMatchPercentage !== undefined && app.skillMatchPercentage >= 70 ? 'success' : 'neutral'} size="sm">
                        {app.skillMatchPercentage !== undefined ? `${app.skillMatchPercentage}% Compatible` : 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">{formatDate(app.appliedDate)}</td>
                    <td className="py-3 px-3 text-right">
                      <Badge status={app.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MoU Proposal Modal */}
      <MouProposalModal
        isOpen={showMouModal}
        onClose={() => setShowMouModal(false)}
        initiatorRole="industry"
      />
    </div>
  );
};
