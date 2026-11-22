import React, { useState } from 'react';
import { User, UserRole } from '../../types';

interface UserAvatarProps {
  user?: User | null;
  name?: string;
  profilePicture?: string | null;
  role?: UserRole;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  name,
  profilePicture,
  role,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const displayName = name || user?.name || 'User';
  const effectiveRole: UserRole = role || user?.role || 'student';
  const avatarUrl = profilePicture !== undefined ? profilePicture : user?.profilePicture;

  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl font-bold',
    xl: 'w-24 h-24 text-3xl font-bold',
  };

  const roleBackgroundClasses: Record<UserRole, string> = {
    student: 'bg-[var(--green-tint-80)] text-[var(--green-text-strong)] dark:bg-[rgba(120,140,93,0.25)] dark:text-[var(--green-tint-60)] border border-[var(--border-default)]',
    jobseeker: 'bg-[var(--blue-tint-80)] text-[var(--blue-text-strong)] dark:bg-[rgba(106,155,204,0.25)] dark:text-[var(--blue-tint-60)] border border-[var(--border-default)]',
    industry: 'bg-[var(--orange-tint-80)] text-[var(--orange-text-strong)] dark:bg-[rgba(217,119,87,0.25)] dark:text-[var(--orange-tint-60)] border border-[var(--border-default)]',
    academician: 'bg-[var(--orange-tint-60)] text-[var(--orange-text-strong)] dark:bg-[rgba(217,119,87,0.3)] dark:text-[var(--orange-tint-60)] border border-[var(--border-default)]',
    institution: 'bg-[var(--blue-tint-60)] text-[var(--blue-text-strong)] dark:bg-[rgba(106,155,204,0.3)] dark:text-[var(--blue-tint-60)] border border-[var(--border-default)]',
    admin: 'bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-strong)]',
  };

  const colorClass = roleBackgroundClasses[effectiveRole] || roleBackgroundClasses.student;

  if (avatarUrl && !imgError && avatarUrl.trim() !== '') {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-[var(--border-default)] shadow-xs shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      title={displayName}
      aria-label={displayName}
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-bold tracking-tight shadow-xs select-none shrink-0 ${className}`}
    >
      <span>{initial}</span>
    </div>
  );
};
