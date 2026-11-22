import { ApplicationStatus } from '../types';

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getStatusBadgeColor = (status: ApplicationStatus | string) => {
  switch (status) {
    case 'applied':
      return { 
        bg: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]', 
        text: 'Applied' 
      };
    case 'in_review':
      return { 
        bg: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]', 
        text: 'Under Review' 
      };
    case 'shortlisted':
      return { 
        bg: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]', 
        text: 'Shortlisted' 
      };
    case 'interview_scheduled':
      return { 
        bg: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]', 
        text: 'Interview Scheduled' 
      };
    case 'interview_completed':
      return { 
        bg: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]', 
        text: 'Interview Completed' 
      };
    case 'offered':
      return { 
        bg: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]', 
        text: 'Offer Extended' 
      };
    case 'rejected':
      return { 
        bg: 'bg-[var(--badge-error-bg)] text-[var(--badge-error-text)]', 
        text: 'Not Selected' 
      };
    case 'active':
      return { 
        bg: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]', 
        text: 'Active' 
      };
    case 'closed':
      return { 
        bg: 'bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)]', 
        text: 'Closed' 
      };
    default:
      return { 
        bg: 'bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)]', 
        text: status 
      };
  }
};

export const getScoreGrade = (score: number) => {
  if (score >= 85) return { grade: 'Advanced (Tier 1)', color: 'text-[var(--green)]', ring: 'stroke-[var(--green)]' };
  if (score >= 70) return { grade: 'Proficient (Tier 2)', color: 'text-[var(--blue)]', ring: 'stroke-[var(--blue)]' };
  if (score >= 55) return { grade: 'Intermediate (Tier 3)', color: 'text-[var(--orange)]', ring: 'stroke-[var(--orange)]' };
  return { grade: 'Needs Bridge Course', color: 'text-[var(--color-error)]', ring: 'stroke-[var(--color-error)]' };
};
