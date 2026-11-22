import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Job } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useApplicationStore } from '../../store/useApplicationStore';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ArrowRight
} from 'lucide-react';

export const JobListPage: React.FC = () => {
  const { user } = useAuth();
  const { applyForOpportunity } = useApplicationStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if student / candidate is in Tech track
  const isTechStudent = Boolean(
    user?.degree?.toLowerCase().includes('tech') ||
    user?.degree?.toLowerCase().includes('engineer') ||
    user?.degree?.toLowerCase().includes('computer') ||
    user?.department?.toLowerCase().includes('computer') ||
    user?.ayushDomain?.toLowerCase().includes('technology') ||
    user?.role === 'jobseeker'
  );

  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState(isTechStudent ? 'Technology & Engineering' : 'All');

  // Fast apply modal
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const res = await api.jobs.getAll({
        domain: domainFilter,
        search,
      });
      setJobs(res.data || []);
      setLoading(false);
    };
    fetchJobs();
  }, [domainFilter, search]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob || !user) return;
    await applyForOpportunity({
      opportunityId: applyingJob.id,
      userId: user.id,
      type: 'job',
      coverNote,
      studentName: user.name,
      studentEmail: user.email,
    });
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setApplyingJob(null);
      setCoverNote('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            CAMPUS PLACEMENT ROLES
          </span>
          <span className="text-xs text-slate-400">Direct Industry Absorption</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
          Full-Time Campus Placements & Roles
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore permanent technical, research, engineering, and medical positions posted directly by verified enterprise partners
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, corporate employer, or technical competencies..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Disciplines & Fields</option>
              <option value="Technology & Engineering">Technology & Software Engineering</option>
              <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Electronics & IoT">Electronics & Embedded IoT</option>
              <option value="Ayush & Health-Tech">Ayush & Health-Tech</option>
              <option value="Core Engineering">Core Engineering</option>
              <option value="Ayurveda">Ayurveda & Bio-Pharma</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading placement positions...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No placement jobs posted yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Verified corporate partners have not posted any full-time positions yet. Openings will appear here in real-time as employers publish opportunities.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-xs transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={job.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80'}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/student/jobs/${job.id || (job as any)._id}`}
                        className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {job.ayushDomain}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{job.company}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: {job.deadline}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.skillsRequired.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/student/jobs/${job.id}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fast Apply Modal */}
      {applyingJob && (
        <Modal
          isOpen={Boolean(applyingJob)}
          onClose={() => setApplyingJob(null)}
          title={`Apply for ${applyingJob.title}`}
        >
          {appliedSuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Dispatched!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your credentials have been submitted to {applyingJob.company} talent acquisition.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>Company: <strong className="text-slate-900 dark:text-white">{applyingJob.company}</strong></p>
                <p>Package: <strong className="text-emerald-700 dark:text-emerald-400">{applyingJob.salary}</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Candidate Profile Verification
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Applying as <strong className="text-slate-800 dark:text-slate-200">{user?.name}</strong> ({user?.email})
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Candidate Statement / Cover Note
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Outline your relevant technical experience, projects, and why you are a fit for this role..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setApplyingJob(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
