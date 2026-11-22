import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { api } from '../../services/api';
import {
  GraduationCap,
  Briefcase,
  Factory,
  Building2,
  School,
  Award,
  ArrowRight,
  CheckCircle2,
  Check,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Terminal,
  Database,
  Cloud,
  Code,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    api.admin.getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
    api.admin.getPartners()
      .then((res) => setPartners(res.data || []))
      .catch(() => setPartners([]));
  }, []);

  const handleRoleQuickStart = (_role: UserRole, targetRoute: string) => {
    if (isAuthenticated) {
      navigate(targetRoute);
    } else {
      navigate('/login');
    }
  };

  const rolesConfig: {
    role: UserRole;
    title: string;
    description: string;
    route: string;
    icon: any;
    color: string;
    iconColor: string;
    btnClass: string;
    badge: string;
    checkColor: string;
    features: string[];
  }[] = [
    {
      role: 'student',
      title: 'University Scholars',
      description: 'Institutional track for undergraduate and graduate scholars. Complete diagnostic assessments, map skill gaps, and unlock stipendiary tech internships.',
      route: '/student/dashboard',
      icon: GraduationCap,
      color: 'border-[var(--border-subtle)] hover:border-[var(--orange)] bg-[var(--bg-surface)]',
      iconColor: 'bg-[var(--bg-muted)] text-[var(--orange-text)] dark:text-[var(--orange)] border border-[var(--border-subtle)]',
      btnClass: 'bg-[var(--orange)] !text-[var(--dark)] hover:opacity-90 shadow-xs',
      badge: 'Academic Track',
      checkColor: 'text-[var(--orange-text)] dark:text-[var(--orange)]',
      features: ['Automated Skill Gap Radar', 'Stipendiary Tech Internships', 'Verified Digital Portfolio'],
    },
    {
      role: 'jobseeker',
      title: 'Graduates & Seekers',
      description: 'Open career track for graduates and active job seekers. Take benchmark assessments and connect directly with enterprise technical recruiters.',
      route: '/student/dashboard',
      icon: Briefcase,
      color: 'border-[var(--border-subtle)] hover:border-[var(--blue)] bg-[var(--bg-surface)]',
      iconColor: 'bg-[var(--bg-muted)] text-[var(--blue-text)] dark:text-[var(--blue)] border border-[var(--border-subtle)]',
      btnClass: 'bg-[var(--bg-muted)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)]',
      badge: 'Open Career Track',
      checkColor: 'text-[var(--blue-text)] dark:text-[var(--blue)]',
      features: ['Standard Email Signup', 'Direct Corporate Openings', 'Adaptive Domain Testing'],
    },
    {
      role: 'industry',
      title: 'Industry & Recruiters',
      description: 'Post high-impact technical internships and full-time roles. Filter candidates by benchmarked skill scores and host live WebRTC interviews.',
      route: '/industry/dashboard',
      icon: Factory,
      color: 'border-[var(--border-subtle)] hover:border-[var(--orange)] bg-[var(--bg-surface)]',
      iconColor: 'bg-[var(--bg-muted)] text-[var(--orange-text)] dark:text-[var(--orange)] border border-[var(--border-subtle)]',
      btnClass: 'bg-[var(--bg-muted)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)]',
      badge: 'Enterprise & Recruiters',
      checkColor: 'text-[var(--orange-text)] dark:text-[var(--orange)]',
      features: ['Pre-Assessed Verified Talent', 'Conduct Live Video Interviews', 'Automated Funnel Analytics'],
    },
    {
      role: 'academician',
      title: 'Faculty & Mentors',
      description: 'Institutional faculty with verified registration IDs. Track batch competencies, launch hands-on workshops, and participate in joint research.',
      route: '/academician/dashboard',
      icon: School,
      color: 'border-[var(--border-subtle)] hover:border-[var(--text-main)] bg-[var(--bg-surface)]',
      iconColor: 'bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)]',
      btnClass: 'bg-[var(--bg-muted)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)]',
      badge: 'Faculty Guides',
      checkColor: 'text-[var(--text-main)]',
      features: ['Verified University Faculty ID', 'Student Mentorship Portals', 'Joint Grant & Research MoUs'],
    },
  ];

  return (
    <div className="max-w-[1100px] mx-auto space-y-14 py-8 px-4 sm:px-6">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[16px] p-8 sm:p-12 text-center shadow-xs">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--orange-text)] dark:text-[var(--orange)] text-xs font-heading font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
            <span>NodalConnector National Competency Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-semibold text-[var(--text-main)] tracking-tight leading-tight">
            Connecting Higher Education with <span className="text-[var(--orange-text)] dark:text-[var(--orange)]">Industry Innovation</span>
          </h1>

          <p className="max-w-2xl mx-auto font-body text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            The integrated platform for competency-based skill gap evaluation, standardized assessments, stipendiary tech internships, and direct corporate recruitment pipelines.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to={isAuthenticated ? "/student/dashboard" : "/signup"}
              className="px-6 py-3 rounded-[10px] bg-[var(--orange)] hover:opacity-90 !text-[var(--dark)] font-heading font-medium text-sm shadow-xs transition-opacity flex items-center gap-2 group cursor-pointer"
            >
              <span>{isAuthenticated ? 'Go to Your Dashboard' : 'Get Started — Register Now'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to={isAuthenticated ? "/student/internships" : "/login"}
              className="px-6 py-3 rounded-[10px] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] font-heading font-medium text-sm border border-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              {isAuthenticated ? 'Browse Open Opportunities' : 'Sign In to Portal'}
            </Link>
          </div>

          {/* Key Metrics Banner (Live Data from MongoDB) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-10 border-t border-[var(--border-subtle)] mt-8 text-center">
            <div className="p-4 rounded-[12px] bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
              <div className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-main)]">
                {stats?.totalStudents !== undefined ? `${stats.totalStudents}` : '—'}
              </div>
              <div className="text-xs font-body text-[var(--text-secondary)] mt-1">Verified Scholars</div>
            </div>
            <div className="p-4 rounded-[12px] bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
              <div className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-main)]">
                {stats?.activePartners !== undefined ? `${stats.activePartners}` : partners.length || '—'}
              </div>
              <div className="text-xs font-body text-[var(--text-secondary)] mt-1">Corporate Partners</div>
            </div>
            <div className="p-4 rounded-[12px] bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
              <div className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-main)]">
                {stats?.totalInternshipsPosted !== undefined ? `${stats.totalInternshipsPosted}` : '—'}
              </div>
              <div className="text-xs font-body text-[var(--text-secondary)] mt-1">Active Positions</div>
            </div>
            <div className="p-4 rounded-[12px] bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
              <div className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-main)]">
                {stats?.mouSignedCount !== undefined ? `${stats.mouSignedCount}` : '—'}
              </div>
              <div className="text-xs font-body text-[var(--text-secondary)] mt-1">Signed MoUs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Showcase (4 Public Tracks) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[var(--text-main)] tracking-tight">
            Tailored Pathways for Every Stakeholder
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)]">
            Dedicated portals designed for university students, career job seekers, industry recruiters, and academic faculty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rolesConfig.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                className={`flex flex-col justify-between p-6 rounded-[14px] border transition-all duration-200 hover:-translate-y-0.5 shadow-xs hover:shadow-sm ${item.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-heading font-medium uppercase tracking-wider px-2.5 py-1 rounded-[6px] bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-semibold text-[var(--text-main)]">{item.title}</h3>
                  <p className="text-xs font-body text-[var(--text-secondary)] mt-2 leading-relaxed">{item.description}</p>

                  <ul className="mt-4 space-y-2 border-t border-[var(--border-subtle)] pt-4">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-body text-[var(--text-secondary)]">
                        <Check className={`w-3.5 h-3.5 ${item.checkColor} shrink-0`} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => handleRoleQuickStart(item.role, item.route)}
                    className={`w-full py-2.5 px-4 rounded-[10px] font-heading font-medium text-xs transition-opacity flex items-center justify-center gap-2 cursor-pointer ${item.btnClass}`}
                  >
                    <span>Enter as {item.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Multi-Disciplinary Competency Framework Banner */}
      <section className="bg-[var(--bg-surface)] rounded-[16px] border border-[var(--border-subtle)] p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-heading font-medium uppercase tracking-wider text-[var(--orange-text)] dark:text-[var(--orange)] bg-[var(--bg-muted)] px-3 py-1 rounded-[6px] border border-[var(--border-subtle)] inline-block">
              Multi-Disciplinary Assessment Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[var(--text-main)] tracking-tight">
              Benchmark Your Competencies Against National Standards
            </h2>
            <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
              NodalConnector evaluates real problem-solving ability across software systems, algorithm complexity, cloud resilience, and interdisciplinary engineering:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-[6px] bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 text-xs font-heading font-bold">1</div>
                <div>
                  <h4 className="text-xs font-heading font-semibold text-[var(--text-main)]">Full-Stack Architecture</h4>
                  <p className="text-[11px] font-body text-[var(--text-secondary)]">REST microservices, database transactions, modern UI</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-[6px] bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 text-xs font-heading font-bold">2</div>
                <div>
                  <h4 className="text-xs font-heading font-semibold text-[var(--text-main)]">Cloud & DevOps</h4>
                  <p className="text-[11px] font-body text-[var(--text-secondary)]">Docker containerization, CI/CD pipelines, Kubernetes</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-[6px] bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 text-xs font-heading font-bold">3</div>
                <div>
                  <h4 className="text-xs font-heading font-semibold text-[var(--text-main)]">AI & Applied Machine Learning</h4>
                  <p className="text-[11px] font-body text-[var(--text-secondary)]">Deep learning, NLP, data pipelines, PyTorch/TensorFlow</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-[6px] bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 text-xs font-heading font-bold">4</div>
                <div>
                  <h4 className="text-xs font-heading font-semibold text-[var(--text-main)]">Cyber Defense & IoT</h4>
                  <p className="text-[11px] font-body text-[var(--text-secondary)]">OWASP security compliance, network analysis, edge hardware</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-muted)] rounded-[14px] p-6 border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-[12px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--orange-text)] dark:text-[var(--orange)] shadow-xs">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-[var(--text-main)]">Take the National Skill Assessment</h3>
            <p className="text-xs font-body text-[var(--text-secondary)] max-w-sm">
              Complete our adaptive multi-discipline diagnostic test to generate your verified national competency radar and unlock direct employer matching.
            </p>
            <Link
              to={isAuthenticated ? "/student/assessment" : "/login"}
              className="mt-2 px-6 py-2.5 rounded-[10px] bg-[var(--orange)] hover:opacity-90 !text-[var(--dark)] font-heading font-medium text-xs shadow-xs transition-opacity inline-flex items-center gap-1.5"
            >
              <span>Start Assessment Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise & Research Partners Section */}
      {partners && partners.filter((p: any) => p.status === 'Approved').length > 0 && (
        <section className="text-center space-y-4 pt-4 border-t border-[var(--border-subtle)]">
          <h3 className="text-xs font-heading font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Accredited Collaboration Partners
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-heading font-semibold text-[var(--text-secondary)]">
            {partners
              .filter((p: any) => p.status === 'Approved')
              .map((partner: any, idx: number) => (
                <span key={idx} className="uppercase tracking-wide px-3 py-1.5 rounded-[8px] bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  {partner.name}
                </span>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};
