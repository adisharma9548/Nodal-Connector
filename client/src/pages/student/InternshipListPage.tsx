import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Internship } from '../../types';
import { useApplicationStore } from '../../store/useApplicationStore';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import {
  Search,
  MapPin,
  Clock,
  Bookmark,
  BookmarkCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Filter,
  CheckCircle2,
  Cpu,
  Layers,
  Globe
} from 'lucide-react';

const formatStipend = (val?: string) => {
  if (!val) return 'Stipend Disclosed Upon Selection';
  const clean = val.trim();
  if (clean.startsWith('₹') || clean.startsWith('$')) return clean;
  if (/^\d+$/.test(clean)) {
    return `₹${Number(clean).toLocaleString('en-IN')} / month`;
  }
  return clean;
};

export const InternshipListPage: React.FC = () => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark, applyForOpportunity } = useApplicationStore();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if student is in Engineering / Tech track
  const isTechStudent = Boolean(
    user?.degree?.toLowerCase().includes('tech') ||
    user?.degree?.toLowerCase().includes('engineer') ||
    user?.degree?.toLowerCase().includes('computer') ||
    user?.department?.toLowerCase().includes('computer') ||
    user?.ayushDomain?.toLowerCase().includes('technology') ||
    user?.role === 'jobseeker'
  );

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(isTechStudent ? 'Technology & Engineering' : 'All');
  const [selectedMode, setSelectedMode] = useState('All');

  // Quick Apply Modal
  const [applyingItem, setApplyingItem] = useState<Internship | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      const res = await api.internships.getAll({
        domain: selectedDomain,
        search,
      });
      setInternships(res.data || []);
      setLoading(false);
    };
    fetchInternships();
  }, [selectedDomain, search]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingItem || !user) return;
    await applyForOpportunity({
      opportunityId: applyingItem.id,
      userId: user.id,
      type: 'internship',
      coverNote,
      studentName: user.name,
      studentEmail: user.email,
    });
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setApplyingItem(null);
      setCoverNote('');
    }, 2000);
  };

  const domainTabs = [
    { label: 'All Disciplines', value: 'All' },
    { label: 'Technology & Software', value: 'Technology & Engineering' },
    { label: 'AI & Data Science', value: 'Artificial Intelligence & Data Science' },
    { label: 'Cloud & DevOps', value: 'Cloud & DevOps' },
    { label: 'Electronics & IoT', value: 'Electronics & IoT' },
    { label: 'Ayush & Health-Tech', value: 'Ayush & Health-Tech' },
    { label: 'Core Engineering', value: 'Core Engineering' },
  ];

  const filteredInternships = internships.filter((item) => {
    if (selectedMode === 'Remote' && !item.isRemote) return false;
    if (selectedMode === 'On-site' && item.isRemote) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            VERIFIED STIPENDIARY ROLES
          </span>
          <span className="text-xs text-[var(--text-secondary)]">Enterprise Accredited Opportunities</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
          Technical & Multi-Disciplinary Internships
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore hands-on software development, cloud computing, AI/ML, and engineering apprenticeships with assured monthly stipends.
        </p>
      </div>

      {/* Quick Domain Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {domainTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setSelectedDomain(tab.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDomain === tab.value
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role title (e.g. Cloud, Full-Stack), company (TCS, NIC, C-DAC, BEL), or skill..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Discipline Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
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

          {/* Mode Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Work Locations & Modes</option>
              <option value="On-site">On-site / Lab Only</option>
              <option value="Remote">Remote / Virtual Apprenticeship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internship Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading verified opportunities...</div>
        ) : filteredInternships.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No opportunities match your filter</h3>
            <p className="text-xs text-slate-400 mt-1">Try broadening your domain or location criteria</p>
          </div>
        ) : (
          filteredInternships.map((item) => {
            const saved = isBookmarked(item.id);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={item.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80'}
                      alt={item.company}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/student/internships/${item.id || (item as any)._id}`}
                          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                        >
                          {item.title}
                        </Link>
                        {item.isRemote && (
                          <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                            Remote
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {item.ayushDomain}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.company}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.duration}
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">{formatStipend(item.stipend)}</span>
                      </div>

                      {/* Required skills badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.skillsRequired.map((skill, idx) => (
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

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className="p-2 text-slate-400 hover:text-amber-500 rounded-lg transition-colors cursor-pointer"
                      title={saved ? 'Remove Bookmark' : 'Bookmark Opportunity'}
                    >
                      {saved ? (
                        <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/student/internships/${item.id}`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => setApplyingItem(item)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Apply Modal */}
      {applyingItem && (
        <Modal
          isOpen={Boolean(applyingItem)}
          onClose={() => setApplyingItem(null)}
          title={`Apply for ${applyingItem.title}`}
        >
          {appliedSuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Submitted!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your verified profile and portfolio have been routed to {applyingItem.company}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="space-y-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>Applying to: <strong className="text-slate-900 dark:text-white">{applyingItem.company}</strong></p>
                <p>Role: <strong className="text-slate-900 dark:text-white">{applyingItem.title}</strong></p>
                <p>Stipend: <strong className="text-emerald-700 dark:text-emerald-400">{formatStipend(applyingItem.stipend)}</strong></p>
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
                  Brief Statement of Interest / Notes
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Share a brief overview of relevant coursework, projects, or technical proficiency..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setApplyingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Confirm Application
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
