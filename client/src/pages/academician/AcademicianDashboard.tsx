import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { FacultyOpportunity, MentorshipRequest, Workshop } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  School,
  CalendarCheck,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Video,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { MouProposalModal } from '../../components/common/MouProposalModal';

export const AcademicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<FacultyOpportunity[]>([]);
  const [mentorships, setMentorships] = useState<MentorshipRequest[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [showMouModal, setShowMouModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAcademicData = async () => {
      setLoading(true);
      const [oppRes, mentRes, wkRes] = await Promise.all([
        api.academician.getFacultyOpportunities(),
        api.academician.getMentorshipRequests(),
        api.academician.getWorkshops()
      ]);
      setOpportunities(oppRes.data);
      setMentorships(mentRes.data);
      setWorkshops(wkRes.data);
      setLoading(false);
    };
    loadAcademicData();
  }, []);

  const handleAcceptRequest = async (id: string) => {
    await api.academician.updateMentorshipStatus(id, 'accepted');
    setMentorships((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'accepted' } : m))
    );
  };

  const isNewUser = (user?.loginCount ?? 1) <= 1;

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto pb-12 font-ui">
      {/* Welcome Banner */}
      <div className="bg-[var(--card-bg)] rounded-[14px] p-6 sm:p-7 border border-[var(--border-default)] shadow-xs relative overflow-hidden transition-colors">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.18)] border border-[var(--border-default)] text-[var(--orange-text)] dark:text-[var(--orange-lighter)] text-xs font-heading font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
            <span>Academic Faculty & Research Console • {user?.institution || 'University Lead'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold tracking-tight text-[var(--text-primary)]">
            {isNewUser ? `Welcome, ${user?.name || 'Faculty Member'}` : `Welcome back, ${user?.name || 'Faculty Member'}`}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body leading-relaxed">
            {isNewUser
              ? `Your faculty console at ${user?.institution || 'your university'} is active. Supervise student competencies, organize skill workshops, and review industry grants.`
              : `${user?.designation || 'Academic Faculty'} • ${user?.institution || 'Affiliated University'}. You have ${mentorships.filter(m => m.status === 'pending').length} pending mentorship request${mentorships.filter(m => m.status === 'pending').length === 1 ? '' : 's'} and ${opportunities.length} active industry grant calls.`}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <Link
              to="/academician/students"
              className="btn-system-primary px-3.5 py-2 rounded-[10px] font-heading font-semibold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Scholars Directory</span>
            </Link>
            <Link
              to="/academician/mentorship"
              className="btn-system-secondary px-3.5 py-2 rounded-[10px] font-heading font-semibold text-xs"
            >
              Manage Mentorship
            </Link>
            <Link
              to="/meetings"
              className="btn-system-secondary px-3.5 py-2 rounded-[10px] font-heading font-semibold text-xs flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Live Guidance</span>
            </Link>
            <Link
              to="/academician/opportunities"
              className="btn-system-secondary px-3.5 py-2 rounded-[10px] font-heading font-semibold text-xs"
            >
              Browse Grants
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
          title="Active Student Mentees"
          value={mentorships.filter((m) => m.status === 'accepted').length.toString()}
          subtitle="Accepted research mentees"
          icon={School}
          color="orange"
        />
        <StatCard
          title="Pending Guidance Requests"
          value={mentorships.filter((m) => m.status === 'pending').length.toString()}
          subtitle="Scholar guidance requests"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Workshops Hosted"
          value={workshops.length.toString()}
          subtitle={workshops.length === 0 ? 'No workshops scheduled' : `${workshops.length} active training programs`}
          icon={CalendarCheck}
          color="green"
        />
        <StatCard
          title="Industry Grant Calls"
          value={opportunities.length.toString()}
          subtitle={`${opportunities.length} sabbatical & research calls`}
          icon={Award}
          color="orange"
        />
      </div>

      {/* Mentorship Requests & Faculty Immersion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mentorship Queue */}
        <div className="lg:col-span-6 bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-heading font-bold text-[var(--text-primary)]">Student Guidance Queue</h3>
              <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">1-on-1 requests for student project & research mentoring</p>
            </div>
            <Link to="/academician/mentorship" className="text-xs font-heading font-semibold text-[var(--text-link)] hover:text-[var(--text-link-hover)] inline-flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {mentorships.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-secondary)] font-body">No guidance requests pending.</div>
            ) : (
              mentorships.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-[12px] border border-[var(--border-default)] bg-[var(--bg-subtle)] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-heading font-semibold text-[var(--text-primary)]">{req.studentName}</h4>
                      <p className="text-[11px] font-heading font-semibold text-[var(--green-text)] dark:text-[var(--green)] mt-0.5">{req.topic}</p>
                    </div>
                    <Badge variant={req.status === 'accepted' ? 'success' : 'warning'} size="sm">
                      {req.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] font-body line-clamp-2">{req.message}</p>

                  <div className="pt-2 border-t border-[var(--border-default)] flex items-center justify-between text-xs font-ui">
                    <span className="text-[var(--text-secondary)] text-[11px]">Proposed: {req.preferredDate}</span>
                    {req.status === 'pending' ? (
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="btn-system-primary px-3 py-1 rounded-[8px] text-xs font-heading font-semibold cursor-pointer"
                      >
                        Accept Guidance
                      </button>
                    ) : (
                      <a
                        href={req.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-system-secondary px-3 py-1 rounded-[8px] text-xs font-heading font-semibold flex items-center gap-1"
                      >
                        <Video className="w-3 h-3" />
                        <span>Join Room</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Faculty Opportunities */}
        <div className="lg:col-span-6 bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-heading font-bold text-[var(--text-primary)]">Industry Immersion & Grants</h3>
              <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">Corporate research sabbaticals and funded projects</p>
            </div>
            <Link to="/academician/opportunities" className="text-xs font-heading font-semibold text-[var(--text-link)] hover:text-[var(--text-link-hover)] inline-flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {opportunities.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-secondary)] font-body">No grant postings active.</div>
            ) : (
              opportunities.slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  className="p-3.5 rounded-[12px] border border-[var(--border-default)] bg-[var(--bg-subtle)] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-heading font-semibold text-[var(--text-primary)]">{opp.title}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] font-body">{opp.organization}</p>
                    </div>
                    <span className="text-[10px] font-heading font-semibold text-[var(--orange-text)] dark:text-[var(--orange-lighter)] bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.18)] px-2 py-0.5 rounded-full border border-[var(--border-default)]">
                      {opp.stipendOrGrant || opp.type}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-body line-clamp-2">{opp.description}</p>
                  <div className="pt-2 border-t border-[var(--border-default)] flex justify-end">
                    <Link
                      to="/academician/opportunities"
                      className="text-xs font-heading font-semibold text-[var(--text-link)] hover:text-[var(--text-link-hover)] inline-flex items-center gap-1"
                    >
                      <span>Review Program</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MoU Proposal Modal */}
      <MouProposalModal
        isOpen={showMouModal}
        onClose={() => setShowMouModal(false)}
        initiatorRole="academician"
      />
    </div>
  );
};
