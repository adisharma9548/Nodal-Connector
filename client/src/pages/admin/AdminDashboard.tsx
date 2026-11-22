import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  ShieldAlert,
  Users,
  Building2,
  Award,
  TrendingUp,
  FileCheck,
  Download,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Search,
  Clock
} from 'lucide-react';
import { MouReviewModal } from '../../components/common/MouReviewModal';
import { AdminAnalytics, InstitutionClaim } from '../../types';
import { UserGrowthBarChart } from '../../components/analytics/AnalyticsCharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [claims, setClaims] = useState<InstitutionClaim[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, pRes, mRes, aRes, cRes] = await Promise.allSettled([
        api.admin.getDashboardStats(),
        api.admin.getPartners(),
        api.mous.getProposals(),
        api.analytics.getAdmin(),
        api.institution.getAdminClaims(),
      ]);
      if (sRes.status === 'fulfilled') setStats(sRes.value.data);
      if (pRes.status === 'fulfilled') setPartners(pRes.value.data || []);
      if (mRes.status === 'fulfilled') setProposals(mRes.value.data || []);
      if (aRes.status === 'fulfilled') setAnalytics(aRes.value.data);
      if (cRes.status === 'fulfilled') setClaims(cRes.value.data || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    }
    setLoading(false);
  };

  const handleApproveClaim = async (claimId: string) => {
    try {
      await api.institution.approveClaim(claimId);
      setClaims((prev) => prev.map((c) => (c.id === claimId ? { ...c, status: 'APPROVED' } : c)));
      // Refresh admin data to reflect new verified count
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve claim');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const isNewUser = (user?.loginCount ?? 1) <= 1;

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 pb-12">
      {/* Executive Editorial Hero */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[16px] p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--orange-text)] dark:text-[var(--orange)] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
            <span className="font-heading">NodalConnector Oversight Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-[var(--text-main)] tracking-tight">
            {isNewUser ? 'Welcome to Institutional Oversight Dashboard' : 'Welcome back to Institutional Oversight Dashboard'}
          </h1>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            Supervising accredited technical institutions, verified student scholars, and active industry collaboration MoUs nationwide.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/admin/reports"
              className="px-4 py-2 rounded-[10px] bg-[var(--orange)] !text-[var(--dark)] font-heading font-medium text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Accreditation Report</span>
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2 rounded-[10px] bg-[var(--bg-muted)] hover:bg-[var(--bg-subtle)] text-[var(--text-main)] font-heading font-medium text-xs border border-[var(--border-subtle)] transition-colors"
            >
              Manage Industry Partners ({partners.filter(p => p.status === 'Pending').length} Pending)
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Scholars"
          value={(stats?.totalStudents ?? 0).toString()}
          subtitle="Verified active students"
          icon={Users}
        />
        <StatCard
          title="Placement & Internship Rate"
          value={stats?.overallPlacementRate || '0%'}
          subtitle="Verified Industry Absorption"
          icon={Award}
        />
        <StatCard
          title="Active Corporate MoUs"
          value={(stats?.mouSignedCount ?? partners.length).toString()}
          subtitle="Approved Enterprise Partnerships"
          icon={Building2}
        />
        <StatCard
          title="National Avg. Skill Index"
          value={stats?.avgSkillIndex ? `${stats.avgSkillIndex} / 100` : 'Pending Assessment'}
          subtitle="Calculated on verified tests"
          icon={TrendingUp}
        />
      </div>

      {/* User Growth & Institution Discovery Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border-subtle)] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-heading font-semibold text-[var(--text-main)]">National Platform User Growth</h3>
                <p className="text-xs font-body text-[var(--text-secondary)] mt-0.5">Real cohort growth calculated across student, company, and faculty registrations</p>
              </div>
            </div>
            <UserGrowthBarChart growth={analytics.userGrowth || []} />
          </div>

          <div className="space-y-6">
            <div className="bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border-subtle)] p-6 shadow-xs">
              <h3 className="text-base font-heading font-semibold text-[var(--text-main)] mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[var(--orange-text)] dark:text-[var(--orange)]" aria-hidden="true" />
                <span>Institution Discovery Stats</span>
              </h3>
              <p className="text-xs font-body text-[var(--text-secondary)] mb-4">Autonomous college domain verification status</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs p-3 rounded-[10px] bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-secondary)] font-medium">Institutions Discovered</span>
                  <span className="font-heading font-bold text-[var(--text-main)] text-sm">{analytics.institutionDiscoveryStats?.discovered || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 rounded-[10px] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <span className="text-[var(--green-text)] dark:text-[var(--green)] font-medium">Verified Institutions</span>
                  <span className="font-heading font-bold text-[var(--green-text)] dark:text-[var(--green)] text-sm">{analytics.institutionDiscoveryStats?.verified || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 rounded-[10px] bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  <span className="text-[var(--blue-text)] dark:text-[var(--blue)] font-medium">Claim Inquiries Searched</span>
                  <span className="font-heading font-bold text-[var(--blue-text)] dark:text-[var(--blue)] text-sm">{analytics.institutionDiscoveryStats?.searched || 0}</span>
                </div>
              </div>
            </div>

            {analytics.topSearchQueries && analytics.topSearchQueries.length > 0 && (
              <div className="bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border-subtle)] p-6 shadow-xs">
                <h3 className="text-base font-heading font-semibold text-[var(--text-main)] mb-1 flex items-center gap-2">
                  <Search className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                  <span>Top Search Queries</span>
                </h3>
                <p className="text-xs font-body text-[var(--text-secondary)] mb-3">High-frequency discovery terms</p>
                <div className="space-y-1.5">
                  {analytics.topSearchQueries.map((q, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1.5 border-b border-[var(--border-subtle)] last:border-0">
                      <span className="text-[var(--text-main)] font-medium">{q.query}</span>
                      <span className="text-[var(--text-muted)] font-mono text-[11px]">{q.count} queries</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Institution Onboarding Claims Verification Table */}
      {claims.length > 0 && (
        <div className="bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-heading font-semibold text-[var(--text-main)] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--green-text)] dark:text-[var(--green)]" aria-hidden="true" />
                <span>Pending Institution Claims & Verification Requests</span>
              </h3>
              <p className="text-xs font-body text-[var(--text-secondary)] mt-0.5">
                Review representative institutional credentials and verify official college identity
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-heading uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-2">College Name</th>
                  <th className="pb-3 px-2">Representative</th>
                  <th className="pb-3 px-2">Official Email</th>
                  <th className="pb-3 px-2">Verification Code</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                    <td className="py-3 px-2 font-heading font-semibold text-[var(--text-main)]">
                      <Link to={`/college/${claim.collegeSlug}`} className="hover:text-[var(--orange-text)] dark:hover:text-[var(--orange)] hover:underline">
                        {claim.collegeName}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-[var(--text-secondary)]">{claim.representativeName}</td>
                    <td className="py-3 px-2 font-mono text-[var(--text-secondary)]">{claim.email}</td>
                    <td className="py-3 px-2 font-mono text-[var(--orange-text)] dark:text-[var(--orange)] bg-[var(--bg-muted)] px-2 py-0.5 rounded-[6px] border border-[var(--border-subtle)] inline-block my-2">
                      {claim.verificationCode}
                    </td>
                    <td className="py-3 px-2">
                      {claim.status === 'APPROVED' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-heading font-medium bg-[var(--bg-muted)] text-[var(--green-text)] dark:text-[var(--green)] border border-[var(--border-subtle)]">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-heading font-medium bg-[var(--bg-muted)] text-[var(--orange-text)] dark:text-[var(--orange)] border border-[var(--border-subtle)]">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      {claim.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => handleApproveClaim(claim.id)}
                          className="px-3 py-1.5 rounded-[10px] bg-[var(--green)] !text-[var(--dark)] font-heading font-medium text-xs transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
                        >
                          Approve Claim
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Industry MoUs Snapshot Table */}
      <div className="bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-heading font-semibold text-[var(--text-main)]">Partner Enterprise MoU Status</h3>
            <p className="text-xs font-body text-[var(--text-secondary)]">Corporate accreditation status and current intern quotas</p>
          </div>
          <Link to="/admin/users" className="text-xs font-heading font-medium text-[var(--orange-text)] dark:text-[var(--orange)] hover:underline flex items-center gap-1">
            <span>Manage All Partners</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-heading uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-2">Partner Enterprise</th>
                <th className="pb-3 px-2">Domain Sector</th>
                <th className="pb-3 px-2">MoU Validity</th>
                <th className="pb-3 px-2">Active Interns</th>
                <th className="pb-3 px-2">Total Hired</th>
                <th className="pb-3 px-2 text-right">Accreditation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {partners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[var(--text-muted)]">
                    No corporate partners registered in database yet. New employer applications will appear here for accreditation.
                  </td>
                </tr>
              ) : (
                partners.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                    <td className="py-3.5 px-2 font-heading font-semibold text-[var(--text-main)]">{p.name}</td>
                    <td className="py-3.5 px-2 text-[var(--text-secondary)]">{p.category}</td>
                    <td className="py-3.5 px-2 text-[var(--text-secondary)]">{p.mouValidUntil}</td>
                    <td className="py-3.5 px-2 font-medium text-[var(--green-text)] dark:text-[var(--green)]">{p.activeInterns} Scholars</td>
                    <td className="py-3.5 px-2 font-medium text-[var(--text-main)]">{p.totalHired} Placements</td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-heading font-medium bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Directorate MoU Review & Digital Ledger Table */}
      <div className="bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-heading font-medium tracking-wider px-2 py-0.5 rounded-[6px] bg-[var(--bg-muted)] text-[var(--orange-text)] dark:text-[var(--orange)] border border-[var(--border-subtle)]">
                GOVERNANCE LEDGER
              </span>
              <span className="text-xs text-[var(--text-muted)]">Formal Agreements</span>
            </div>
            <h3 className="text-base font-heading font-semibold text-[var(--text-main)] mt-1">
              Industry-Academia MoU Proposals & Digital Seals
            </h3>
            <p className="text-xs font-body text-[var(--text-secondary)]">
              Review collaborative research agreements, verify student internship quotas, and apply official cryptographic seals
            </p>
          </div>
          <span className="text-xs font-heading font-medium text-[var(--text-secondary)]">
            {proposals.length} Total Registered
          </span>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[var(--border-subtle)] rounded-[12px]">
            <Building2 className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-xs font-heading font-semibold text-[var(--text-main)]">No active MoU proposals pending</p>
            <p className="text-[11px] font-body text-[var(--text-secondary)] mt-0.5">
              Proposals submitted by academicians or industry partners will appear here for administrative endorsement.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-heading uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-2">MoU Title</th>
                  <th className="pb-3 px-2">Initiator</th>
                  <th className="pb-3 px-2">Target Organization</th>
                  <th className="pb-3 px-2">Intern Quota</th>
                  <th className="pb-3 px-2">Funding</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {proposals.map((prop) => (
                  <tr key={prop._id || prop.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                    <td className="py-3.5 px-2">
                      <span className="font-heading font-semibold text-[var(--text-main)] block">{prop.title}</span>
                      {prop.digitalSealId && (
                        <span className="text-[10px] font-mono text-[var(--green-text)] dark:text-[var(--green)] block">
                          Seal: {prop.digitalSealId}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-[var(--text-secondary)]">
                      <span className="font-medium text-[var(--text-main)] block">{prop.initiatorName}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{prop.initiatorInstitution}</span>
                    </td>
                    <td className="py-3.5 px-2 font-medium text-[var(--text-main)]">
                      {prop.targetOrganization}
                    </td>
                    <td className="py-3.5 px-2 text-[var(--text-secondary)] font-medium">
                      {prop.internshipQuota} Students
                    </td>
                    <td className="py-3.5 px-2 font-medium text-[var(--green-text)] dark:text-[var(--green)]">
                      {prop.grantFunding}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-heading font-medium bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]">
                        {prop.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      {prop.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-heading font-medium text-[var(--green-text)] dark:text-[var(--green)]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Sealed</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedProposal(prop)}
                          className="px-3 py-1.5 rounded-[10px] bg-[var(--orange)] !text-[var(--dark)] font-heading font-medium text-xs transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
                        >
                          Review & Stamp
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MoU Review Modal */}
      {selectedProposal && (
        <MouReviewModal
          isOpen={true}
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onReviewed={() => {
            fetchAdminData();
            setSelectedProposal(null);
          }}
        />
      )}
    </div>
  );
};
