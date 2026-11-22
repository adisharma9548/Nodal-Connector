import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StudentCertificate, StudentProject } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import {
  ShieldCheck,
  Award,
  Leaf,
  Plus,
  ExternalLink,
  Download,
  Calendar,
  Sparkles,
  FileCheck2,
  FolderGit2,
  CheckCircle2,
  Video
} from 'lucide-react';

import { sanitizeUrl } from '../../utils/sanitizeUrl';

export const DigitalPortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<StudentCertificate[]>([]);
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Add project modal
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    role: 'Lead Student Researcher',
    technologies: '',
    description: '',
    link: '',
    startDate: 'Jan 2026',
    endDate: 'May 2026'
  });

  // Certificate preview modal
  const [previewCert, setPreviewCert] = useState<StudentCertificate | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      const res = await api.skills.getPortfolioData(user?.id);
      setCertificates(res.data.certificates);
      setProjects(res.data.projects);
      setLoading(false);
    };
    fetchPortfolio();
  }, [user]);

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = projectForm.technologies.split(',').map((t) => t.trim());
    const res = await api.skills.addPortfolioProject({
      title: projectForm.title,
      role: projectForm.role,
      technologies: techArray,
      description: projectForm.description,
      link: projectForm.link || undefined,
      startDate: projectForm.startDate,
      endDate: projectForm.endDate
    });
    setProjects([res.data, ...projects]);
    setShowAddProject(false);
    setProjectForm({
      title: '',
      role: 'Lead Student Researcher',
      technologies: '',
      description: '',
      link: '',
      startDate: 'Jan 2026',
      endDate: 'May 2026'
    });
  };

  const downloadCV = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              NATIONAL VERIFIED PORTFOLIO
            </span>
            <span className="text-xs text-slate-400">NodalConnector Verified</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Digital Portfolio & Credentials
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Your verified competencies, academic projects, and certified badges
          </p>
        </div>

        <button
          onClick={downloadCV}
          className="btn-system-primary px-4 py-2 rounded-[10px] text-xs font-heading font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Verified CV (PDF)</span>
        </button>
      </div>

      {/* Verified Badges Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 transition-colors">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">National Certified Badges</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically signed micro-credentials verified by accredited regulatory councils
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No certified badges earned yet. Complete assessments or bridge courses to earn verified badges.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setPreviewCert(cert)}
                className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-xs cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <Badge variant="emerald" size="sm">VERIFIED</Badge>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">{cert.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{cert.issuer}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Issued: {cert.issueDate}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    View <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Research & Academic Projects Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Technical & Research Projects</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Software repositories, laboratory trials, and academic projects
            </p>
          </div>

          <button
            onClick={() => setShowAddProject(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 font-bold text-xs transition-colors flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>

        <div className="space-y-4 pt-2">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-white dark:bg-slate-800/60 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">{proj.role}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{proj.startDate} - {proj.endDate}</span>
                  {proj.link && (
                    <a
                      href={sanitizeUrl(proj.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 p-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{proj.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Faculty Guidance & Assistance Notes */}
              {proj.assistance && proj.assistance.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Faculty Academic Guidance (.edu.in)</span>
                  </div>
                  <div className="space-y-2">
                    {proj.assistance.map((asst, aIdx) => (
                      <div
                        key={aIdx}
                        className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 rounded-xl p-3 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">
                          <span>{asst.facultyName} ({asst.assistanceType.toUpperCase()})</span>
                          <span className="text-slate-400 font-normal">
                            {new Date(asst.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{asst.notes}</p>
                        {asst.meetingRoomId && (
                          <div className="pt-1">
                            <a
                              href={`/meetings?room=${asst.meetingRoomId}`}
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Live Video Guidance Meeting</span>
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddProject(false)}
          title="Add Research Project"
          subtitle="Showcase your laboratory investigations to industry recruiters"
        >
          <form onSubmit={handleAddProjectSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Project Title</label>
              <input
                type="text"
                required
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="e.g. Distributed Cloud File System / AI Diagnostic Engine"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Your Role</label>
                <input
                  type="text"
                  required
                  value={projectForm.role}
                  onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">DOI or Paper Link</label>
                <input
                  type="url"
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  placeholder="https://doi.org/..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Analytical Techniques / Tools (comma separated)
              </label>
              <input
                type="text"
                required
                value={projectForm.technologies}
                onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                placeholder="React, Node.js, Python, PyTorch, Docker"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Brief Methodology & Findings</label>
              <textarea
                required
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Describe objectives, architectural decisions, and key outcomes..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddProject(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Save Project
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Certificate View Modal */}
      {previewCert && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewCert(null)}
          title={previewCert.title}
          subtitle={`Issued by ${previewCert.issuer}`}
        >
          <div className="space-y-4 text-xs text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{previewCert.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{previewCert.issuer} • {previewCert.issueDate}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              Credential ID: NODALCONNECTOR-CERT-{previewCert.id ? previewCert.id.slice(-6).toUpperCase() : 'VERIFIED'}
            </div>
            <p className="text-slate-400">
              This credential has been verified against the National Higher Education & Skills Registry.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
