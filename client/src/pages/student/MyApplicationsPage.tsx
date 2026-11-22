import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Application } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Download,
  AlertCircle,
  Video,
  CheckCircle2
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { AiMatchMatrix } from '../../components/common/AiMatchMatrix';

export const MyApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedMatch, setExpandedMatch] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      const res = await api.applications.getMyApplications(user?.id);
      setApplications(res.data);
      setLoading(false);
    };
    fetchApps();
  }, [user]);

  const pipelineStages = [
    { key: 'applied', label: 'Applied' },
    { key: 'in_review', label: 'Under Review' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'interview_scheduled', label: 'Interview Scheduled' },
    { key: 'interview_completed', label: 'Interview Completed' },
    { key: 'offered', label: 'Offer Extended' }
  ];

  const getStageIndex = (status: string) => {
    const idx = pipelineStages.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return app.status !== 'rejected';
    if (statusFilter === 'interview') return app.status === 'interview_scheduled' || app.status === 'interview_completed' || app.status === 'shortlisted';
    return app.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            APPLICATION TRACKER
          </span>
          <span className="text-xs text-slate-400">Real-Time Industry Pipeline</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
          My Applications & Recruitment Pipeline
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Track the status of all your submitted internship and placement applications in real time
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        {[
          { key: 'all', label: `All Applications (${applications.length})` },
          { key: 'interview', label: 'Interviews & Shortlists' },
          { key: 'in_review', label: 'Under Review' },
          { key: 'active', label: 'Active Pipeline' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading your applications...</div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <FileCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No applications found in this category</p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-5"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{app.opportunityTitle}</h3>
                      <Badge variant={app.type === 'internship' ? 'emerald' : 'blue'} size="sm">
                        {app.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">{app.companyName}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                      <span>Applied on: {formatDate(app.appliedDate)}</span>
                      {app.skillMatchPercentage && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          • {app.skillMatchPercentage}% Skill Compatibility
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="self-start sm:self-auto">
                    <Badge status={app.status} size="md" />
                  </div>
                </div>

                {/* Visual Pipeline Progress */}
                <div className="pt-2">
                  <div className="grid grid-cols-5 gap-1.5 text-center">
                    {pipelineStages.map((stage, idx) => {
                      const isPastOrCurrent = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      return (
                        <div key={stage.key} className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isCurrent
                                ? 'bg-emerald-600 ring-2 ring-emerald-500/20'
                                : isPastOrCurrent
                                ? 'bg-emerald-400 dark:bg-emerald-600'
                                : 'bg-slate-100 dark:bg-slate-800'
                            }`}
                          />
                          <span
                            className={`text-[10px] block truncate font-semibold ${
                              isCurrent
                                ? 'text-emerald-800 dark:text-emerald-300 font-bold'
                                : isPastOrCurrent
                                ? 'text-slate-700 dark:text-slate-300'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interview / Next Action Banner */}
                {app.status === 'interview_completed' && (
                  <div className="p-3.5 rounded-2xl bg-teal-50/90 dark:bg-teal-950/40 border border-teal-200/90 dark:border-teal-800 flex items-center gap-2.5 text-xs text-teal-900 dark:text-teal-200">
                    <CheckCircle2 className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <div>
                      <strong>Technical Interview Completed:</strong> Your live session has concluded and was successfully recorded. Recruiter evaluation is underway.
                    </div>
                  </div>
                )}

                {app.status === 'interview_scheduled' && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 text-indigo-900 dark:text-indigo-200 font-medium">
                      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>
                        <strong>Interview Scheduled:</strong> {app.interviewDate || 'Live Interview Room Ready'}
                      </span>
                    </div>
                    <Link
                      to={`/meetings?room=interview-${app.id || (app as any)._id}&title=${encodeURIComponent((app.opportunityTitle || 'Technical') + ' Interview')}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Virtual Room</span>
                    </Link>
                  </div>
                )}

                {/* Cover note preview */}
                {app.coverNote && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Your Note to Recruiter:</span>
                    {app.coverNote}
                  </div>
                )}

                {/* AI Match Matrix Accordion */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setExpandedMatch((prev) => ({ ...prev, [app.id]: !prev[app.id] }))}
                    className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{expandedMatch[app.id] ? 'Hide AI Compatibility Breakdown' : 'View AI Skill Alignment & Preparation Guide'}</span>
                  </button>
                  {expandedMatch[app.id] && (
                    <div className="mt-3 animate-in fade-in duration-150">
                      <AiMatchMatrix
                        opportunityTitle={app.opportunityTitle}
                        matchScore={app.skillMatchPercentage ?? 0}
                        coverNote={app.coverNote}
                        isRecruiterView={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
