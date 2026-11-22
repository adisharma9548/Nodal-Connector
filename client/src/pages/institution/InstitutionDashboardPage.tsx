import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { IInstitutionAnalytics } from '../../types';
import {
  Building,
  Users,
  Award,
  TrendingUp,
  Briefcase,
  Search,
  CheckCircle,
  Loader2,
  ExternalLink,
  Edit,
  GraduationCap,
  MapPin,
  Mail,
  Globe,
  Sparkles,
  AlertCircle,
  Check,
} from 'lucide-react';

export const InstitutionDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<IInstitutionAnalytics | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editAbout, setEditAbout] = useState<string>('');
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [analyticsRes, studentsRes] = await Promise.all([
          api.institution.dashboard.getAnalytics(),
          api.institution.dashboard.getStudents(),
        ]);

        if (analyticsRes.data) {
          setAnalytics(analyticsRes.data);
          setEditAbout(analyticsRes.data.college?.about || '');
        }
        if (studentsRes.data) {
          setStudents(studentsRes.data);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load institutional dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.institution.dashboard.updateProfile({ about: editAbout });
      if (analytics) {
        setAnalytics({
          ...analytics,
          college: { ...analytics.college, about: editAbout },
        });
      }
      setEditModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const departments = ['All', ...Array.from(new Set(students.map((s) => s.department).filter(Boolean)))];

  const filteredStudents = students.filter((s) => {
    const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment;
    const matchesSearch =
      !studentSearch ||
      s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesDept && matchesSearch;
  });

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-20 text-center font-ui">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--orange)] mb-3" />
        <h2 className="text-base font-heading font-bold text-[var(--text-primary)]">
          Loading Institutional Analytics...
        </h2>
        <p className="text-xs text-[var(--text-secondary)] font-body mt-1">Querying student rosters and competency profiles</p>
      </div>
    );
  }

  if (!analytics && errorMessage) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-16 font-ui">
        <div className="p-8 rounded-[14px] bg-[var(--card-bg)] border border-[var(--border-default)] text-center shadow-xs">
          <Building className="w-10 h-10 text-[var(--orange)] mx-auto mb-3" />
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)]">Institution Not Linked</h2>
          <p className="text-xs text-[var(--text-secondary)] font-body mt-2 max-w-lg mx-auto">{errorMessage}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/college"
              className="btn-system-primary px-4 py-2 text-xs font-heading font-semibold rounded-[10px] inline-flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore College Directory & Claim</span>
            </a>
            <a
              href="/profile"
              className="btn-system-secondary px-4 py-2 text-xs font-heading font-semibold rounded-[10px] inline-flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Update Profile Institution</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { college, metrics, departmentBreakdown, topSkills, laggingSkills } = analytics || ({} as any);

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 space-y-6 font-ui">
      {/* College Identity Banner */}
      <div className="p-6 sm:p-7 bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] shadow-xs relative overflow-hidden transition-colors">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-heading font-medium bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-default)]">
                {college?.type || 'Higher Education Institution'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-heading font-semibold bg-[var(--green-tint-80)] dark:bg-[rgba(120,140,93,0.18)] text-[var(--green-text)] dark:text-[var(--green)] border border-[var(--border-default)]">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--green)]" />
                {college?.verificationStatus || 'VERIFIED'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-[var(--text-primary)]">{college?.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] font-body pt-0.5">
              {(college?.city || college?.state) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  {[college.city, college.district, college.state].filter(Boolean).join(', ')}
                </span>
              )}
              {college?.contact?.email && (
                <span className="flex items-center gap-1 font-ui">
                  <Mail className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  {college.contact.email}
                </span>
              )}
              {college?.contact?.website && (
                <a
                  href={college.contact.website.startsWith('http') ? college.contact.website : `https://${college.contact.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline text-[var(--text-link)]"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Official Portal
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={() => setEditModalOpen(true)}
            className="btn-system-secondary px-3.5 py-2 text-xs font-heading font-semibold rounded-[10px] flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-[var(--card-bg)] rounded-[12px] border border-[var(--border-default)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-semibold text-[var(--text-secondary)]">Enrolled Students</span>
            <Users className="w-4 h-4 text-[var(--green)]" />
          </div>
          <div className="text-2xl font-heading font-bold text-[var(--text-primary)] mt-1.5 font-mono">
            {metrics?.totalStudents || 0}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-body mt-1">Authenticated accounts</div>
        </div>

        <div className="p-4 bg-[var(--card-bg)] rounded-[12px] border border-[var(--border-default)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-semibold text-[var(--text-secondary)]">Assessed Students</span>
            <Award className="w-4 h-4 text-[var(--orange)]" />
          </div>
          <div className="text-2xl font-heading font-bold text-[var(--text-primary)] mt-1.5 font-mono">
            {metrics?.assessedStudents || 0}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-body mt-1">{metrics?.assessmentParticipationRate || 0}% participation</div>
        </div>

        <div className="p-4 bg-[var(--card-bg)] rounded-[12px] border border-[var(--border-default)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-semibold text-[var(--text-secondary)]">Average Score</span>
            <TrendingUp className="w-4 h-4 text-[var(--blue)]" />
          </div>
          <div className="text-2xl font-heading font-bold text-[var(--text-primary)] mt-1.5 font-mono">
            {metrics?.averageSkillScore || 0}%
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-body mt-1">Institutional index</div>
        </div>

        <div className="p-4 bg-[var(--card-bg)] rounded-[12px] border border-[var(--border-default)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-semibold text-[var(--text-secondary)]">Placement Ready</span>
            <Briefcase className="w-4 h-4 text-[var(--green)]" />
          </div>
          <div className="text-2xl font-heading font-bold text-[var(--text-primary)] mt-1.5 font-mono">
            {metrics?.placementReadyCount || 0}
          </div>
          <div className="text-[11px] text-[var(--green-text)] dark:text-[var(--green)] font-semibold mt-1">
            {metrics?.placementReadinessRate || 0}% scoring ≥ 70%
          </div>
        </div>

        <div className="p-4 bg-[var(--card-bg)] rounded-[12px] border border-[var(--border-default)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-semibold text-[var(--text-secondary)]">Departments</span>
            <GraduationCap className="w-4 h-4 text-[var(--mid)]" />
          </div>
          <div className="text-2xl font-heading font-bold text-[var(--text-primary)] mt-1.5 font-mono">
            {departmentBreakdown?.length || 0}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-body mt-1">Academic disciplines</div>
        </div>
      </div>

      {/* Two Column Grid: Top Institutional Strengths & Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <div className="bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs">
          <h2 className="text-sm font-heading font-bold text-[var(--text-primary)] flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-4 h-4 text-[var(--green)]" />
            Top Institutional Competencies
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-body mb-3.5">Leading skills assessed across your student cohort</p>

          <div className="space-y-2.5">
            {(topSkills || []).length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] font-body py-4 text-center">No assessed student competencies yet.</p>
            ) : (
              topSkills.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                  <div>
                    <div className="text-xs font-heading font-semibold text-[var(--text-primary)]">{s.name}</div>
                    <div className="text-[11px] text-[var(--text-secondary)] font-body">{s.studentCount} students assessed</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[var(--green-text)] dark:text-[var(--green)]">
                      {s.averageProficiency}%
                    </span>
                    <div className="w-20 h-1.5 bg-[var(--border-default)] rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[var(--green)] rounded-full" style={{ width: `${s.averageProficiency}%` }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lagging Skill Gaps */}
        <div className="bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs">
          <h2 className="text-sm font-heading font-bold text-[var(--text-primary)] flex items-center gap-1.5 mb-0.5">
            <AlertCircle className="w-4 h-4 text-[var(--orange)]" />
            Priority Departmental Skill Gaps
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-body mb-3.5">Competencies requiring faculty workshops or bridge training</p>

          <div className="space-y-2.5">
            {(laggingSkills || []).length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] font-body py-4 text-center">No urgent institutional skill gaps detected.</p>
            ) : (
              laggingSkills.map((g: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                  <div>
                    <div className="text-xs font-heading font-semibold text-[var(--text-primary)]">{g.name}</div>
                    <div className="text-[11px] text-[var(--orange-text)] dark:text-[var(--orange-lighter)] font-body">{g.studentsAffected} students lagging behind benchmark</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[var(--orange-text)] dark:text-[var(--orange-lighter)]">
                      {g.averageGapPercentage}% Gap
                    </span>
                    <div className="w-20 h-1.5 bg-[var(--border-default)] rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[var(--orange)] rounded-full" style={{ width: `${Math.min(100, g.averageGapPercentage)}%` }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs">
        <h2 className="text-sm font-heading font-bold text-[var(--text-primary)] mb-3">Academic Department Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-ui">
            <thead className="bg-[var(--table-header-bg)] text-[var(--text-secondary)] font-heading font-semibold border-b border-[var(--border-default)]">
              <tr>
                <th className="p-2.5">Department / Discipline</th>
                <th className="p-2.5">Enrolled</th>
                <th className="p-2.5">Assessed</th>
                <th className="p-2.5">Participation</th>
                <th className="p-2.5">Average Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {(departmentBreakdown || []).map((d: any, idx: number) => {
                const partRate = d.studentCount > 0 ? Math.round((d.assessedCount / d.studentCount) * 100) : 0;
                return (
                  <tr key={idx} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="p-2.5 font-heading font-semibold text-[var(--text-primary)]">{d.department}</td>
                    <td className="p-2.5 text-[var(--text-secondary)]">{d.studentCount}</td>
                    <td className="p-2.5 text-[var(--text-secondary)]">{d.assessedCount}</td>
                    <td className="p-2.5 text-[var(--text-secondary)]">{partRate}%</td>
                    <td className="p-2.5 font-mono font-bold text-[var(--green-text)] dark:text-[var(--green)]">{d.averageScore}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Affiliated Student Roster */}
      <div className="bg-[var(--card-bg)] rounded-[14px] border border-[var(--border-default)] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-heading font-bold text-[var(--text-primary)]">Institutional Student Roster</h2>
            <p className="text-xs text-[var(--text-secondary)] font-body">Real students affiliated with your institution</p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--text-secondary)] pointer-events-none" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students..."
                className="pl-8 pr-3 py-1.5 bg-[var(--input-bg)] border border-[var(--border-default)] rounded-[8px] text-xs w-48 font-ui"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-2.5 py-1.5 bg-[var(--input-bg)] border border-[var(--border-default)] rounded-[8px] text-xs font-ui"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-ui">
            <thead className="bg-[var(--table-header-bg)] text-[var(--text-secondary)] font-heading font-semibold border-b border-[var(--border-default)]">
              <tr>
                <th className="p-2.5">Student Name</th>
                <th className="p-2.5">Email</th>
                <th className="p-2.5">Department</th>
                <th className="p-2.5">Degree</th>
                <th className="p-2.5">Overall Score</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-xs text-[var(--text-secondary)] font-body">
                    No affiliated students found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st._id || st.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="p-2.5 font-heading font-semibold text-[var(--text-primary)]">{st.name}</td>
                    <td className="p-2.5 text-[var(--text-secondary)]">{st.email}</td>
                    <td className="p-2.5 text-[var(--text-secondary)] font-body">{st.department || '—'}</td>
                    <td className="p-2.5 text-[var(--text-secondary)] font-body">{st.degree || '—'}</td>
                    <td className="p-2.5 font-mono font-bold text-[var(--text-primary)]">
                      {st.overallScore !== null && st.overallScore !== undefined ? `${st.overallScore}%` : '—'}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-heading font-semibold ${
                          st.assessmentStatus === 'current'
                            ? 'bg-[var(--green-tint-80)] text-[var(--green-text)] dark:bg-[rgba(120,140,93,0.18)] dark:text-[var(--green)]'
                            : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {st.assessmentStatus || 'not_assessed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--modal-overlay)] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--modal-bg)] rounded-[14px] border border-[var(--border-default)] p-6 max-w-lg w-full shadow-lg space-y-4">
            <h3 className="text-base font-heading font-bold text-[var(--text-primary)]">Edit Institutional Information</h3>
            <div>
              <label className="block text-xs font-heading font-semibold text-[var(--text-secondary)] mb-1">
                Institutional Overview (About)
              </label>
              <textarea
                rows={5}
                value={editAbout}
                onChange={(e) => setEditAbout(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-default)] rounded-[10px] text-xs font-ui"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-default)]">
              <button
                onClick={() => setEditModalOpen(false)}
                className="btn-system-secondary px-3.5 py-1.5 text-xs font-heading font-semibold rounded-[8px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="btn-system-primary px-3.5 py-1.5 text-xs font-heading font-semibold rounded-[8px] disabled:opacity-50"
              >
                {savingProfile ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionDashboardPage;
