import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Award,
  BarChart2,
  BookOpen,
  Briefcase,
  FileCheck,
  FolderGit2,
  PlusCircle,
  Users,
  Search,
  School,
  CalendarCheck,
  LineChart,
  UserCheck,
  Settings,
  GraduationCap,
  Video,
  FileText,
  Target,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { role } = useAuth();

  const studentNav = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Resume & Verified Skills', path: '/student/resume', icon: FileText },
    { label: 'Target Career Role Gap', path: '/student/target-role', icon: Target },
    { label: 'Skill Assessment', path: '/student/assessment', icon: Award },
    { label: 'Competency Gap Analysis', path: '/student/skills', icon: BarChart2 },
    { label: 'Live Video Meetings', path: '/meetings', icon: Video },
    { label: 'Learning Paths', path: '/student/learning', icon: BookOpen },
    { label: 'Internships', path: '/student/internships', icon: Briefcase },
    { label: 'Placement Jobs', path: '/student/jobs', icon: GraduationCap },
    { label: 'My Applications', path: '/student/applications', icon: FileCheck },
    { label: 'Digital Portfolio', path: '/student/portfolio', icon: FolderGit2 },
  ];

  const industryNav = [
    { label: 'Recruiter Dashboard', path: '/industry/dashboard', icon: LayoutDashboard },
    { label: 'Live Video Interviews', path: '/meetings', icon: Video },
    { label: 'Learning Modules & Labs', path: '/industry/programs', icon: BookOpen },
    { label: 'Post Internship / Job', path: '/industry/post', icon: PlusCircle },
    { label: 'Manage Applicants', path: '/industry/applicants', icon: Users },
    { label: 'Candidate Search', path: '/industry/candidates', icon: Search },
  ];

  const academicianNav = [
    { label: 'Faculty Dashboard', path: '/academician/dashboard', icon: LayoutDashboard },
    { label: 'Scholars Directory', path: '/academician/students', icon: GraduationCap },
    { label: 'Live Mentorship Meetings', path: '/meetings', icon: Video },
    { label: 'Industry Immersion & FDP', path: '/academician/opportunities', icon: School },
    { label: 'Mentorship & Workshops', path: '/academician/mentorship', icon: CalendarCheck },
  ];

  const institutionNav = [
    { label: 'Institution Dashboard', path: '/institution/dashboard', icon: LayoutDashboard },
    { label: 'Live Faculty Meetings', path: '/meetings', icon: Video },
    { label: 'College Directory', path: '/college', icon: School },
  ];

  const adminNav = [
    { label: 'Executive Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Question Bank Moderation', path: '/admin/questions', icon: HelpCircle },
    { label: 'Live Video Conferences', path: '/meetings', icon: Video },
    { label: 'Student & Faculty Progress', path: '/admin/progress', icon: LineChart },
    { label: 'Analytics & Reports', path: '/admin/reports', icon: Award },
    { label: 'Users & Industry Partners', path: '/admin/users', icon: UserCheck },
  ];

  const getNavLinks = () => {
    switch (role) {
      case 'student':
      case 'jobseeker':
        return studentNav;
      case 'industry': return industryNav;
      case 'academician': return academicianNav;
      case 'institution': return institutionNav;
      case 'admin': return adminNav;
      default: return studentNav;
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside
      className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-60 bg-[var(--sidebar-bg)] border-r border-[var(--border-default)] flex flex-col justify-between transition-transform duration-180 ease-out font-ui ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-3.5 space-y-6 overflow-y-auto">
        {/* Navigation group */}
        <div>
          <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[var(--text-secondary)] px-3">
            {role.toUpperCase()} WORKSPACE
          </span>
          <nav className="mt-2 space-y-0.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-heading font-medium transition-colors outline-none focus-visible:outline-[var(--focus-ring)] ${
                      isActive
                        ? 'bg-[var(--card-bg)] text-[var(--text-primary)] font-semibold border border-[var(--border-default)] shadow-xs'
                        : 'text-[var(--nav-item-text)] hover:bg-[var(--bg-subtle)] hover:text-[var(--nav-item-hover)]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-[var(--orange)]" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Global section */}
        <div>
          <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[var(--text-secondary)] px-3">
            ACCOUNT
          </span>
          <nav className="mt-2 space-y-0.5">
            <NavLink
              to="/profile"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-heading font-medium transition-colors outline-none focus-visible:outline-[var(--focus-ring)] ${
                  isActive
                    ? 'bg-[var(--card-bg)] text-[var(--text-primary)] font-semibold border border-[var(--border-default)] shadow-xs'
                    : 'text-[var(--nav-item-text)] hover:bg-[var(--bg-subtle)] hover:text-[var(--nav-item-hover)]'
                }`
              }
            >
              <Settings className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
              <span>Profile & Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Platform status footer card */}
      <div className="p-3.5 border-t border-[var(--border-default)] bg-[var(--card-bg)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--green)]"></div>
          <span className="text-xs font-heading font-semibold text-[var(--text-primary)]">NodalConnector Live</span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 font-body">Collaboration Platform</p>
      </div>
    </aside>
  );
};
