import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationStore } from '../../store/useNotificationStore';
import {
  Bell,
  User as UserIcon,
  LogOut,
  Sparkles,
  Menu,
  X,
  Shield,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Badge } from './Badge';
import { UserAvatar } from './UserAvatar';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [publicMobileOpen, setPublicMobileOpen] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    switch (role) {
      case 'student':
      case 'jobseeker':
        return '/student/dashboard';
      case 'industry': return '/industry/dashboard';
      case 'academician': return '/academician/dashboard';
      case 'institution': return '/institution/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="bg-[var(--nav-bg)] border-b border-[var(--nav-border)] sticky top-0 z-40 backdrop-blur-md transition-colors">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-[10px] outline-none focus-visible:outline-[var(--focus-ring)]"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => setPublicMobileOpen(!publicMobileOpen)}
                className="md:hidden p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-[10px] outline-none focus-visible:outline-[var(--focus-ring)]"
                aria-label="Toggle public navigation menu"
              >
                {publicMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to={isAuthenticated ? getDashboardPath() : '/'} className="flex items-center gap-2 sm:gap-2.5 group outline-none focus-visible:outline-[var(--focus-ring)] rounded-[10px] p-0.5 sm:p-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[var(--orange)] flex items-center justify-center text-[var(--dark)] shadow-xs transition-transform duration-180 group-hover:scale-105 shrink-0">
                <Sparkles className="w-4 h-4 text-[var(--dark)]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-sm sm:text-base text-[var(--text-primary)] tracking-tight">NodalConnector</span>
                  <span className="text-[10px] font-heading font-semibold bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.18)] text-[var(--orange-text)] dark:text-[var(--orange-lighter)] border border-[var(--border-default)] px-1.5 py-0.2 rounded-full tracking-wider">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-secondary)] hidden sm:block font-ui">
                  Talent & Industry Platform
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1.5 ml-6" aria-label="Main Navigation">
              <Link
                to="/college"
                className="text-xs font-heading font-medium text-[var(--nav-item-text)] hover:text-[var(--nav-item-hover)] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] hover:bg-[var(--bg-subtle)] outline-none focus-visible:outline-[var(--focus-ring)]"
              >
                <Building2 className="w-3.5 h-3.5 text-[var(--blue-text)] dark:text-[var(--blue)]" aria-hidden="true" />
                <span>Colleges</span>
              </Link>
              <Link
                to="/verify/NC-REG-2026"
                className="text-xs font-heading font-medium text-[var(--nav-item-text)] hover:text-[var(--nav-item-hover)] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] hover:bg-[var(--bg-subtle)] outline-none focus-visible:outline-[var(--focus-ring)]"
              >
                <Shield className="w-3.5 h-3.5 text-[var(--green-text)] dark:text-[var(--green)]" aria-hidden="true" />
                <span>Verify Credentials</span>
              </Link>
              <Link
                to="/style-guide"
                className="text-xs font-heading font-medium text-[var(--nav-item-text)] hover:text-[var(--nav-item-hover)] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] hover:bg-[var(--bg-subtle)] outline-none focus-visible:outline-[var(--focus-ring)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--orange-text)] dark:text-[var(--orange-lighter)]" aria-hidden="true" />
                <span>Design System</span>
              </Link>
            </nav>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle compact={true} />
            {isAuthenticated ? (
              <>
                {/* Notification Bell Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-[10px] relative transition-colors outline-none focus-visible:outline-[var(--focus-ring)]"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[var(--orange)] text-[var(--dark)] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--menu-bg)] rounded-[14px] shadow-lg border border-[var(--menu-border)] py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2.5 border-b border-[var(--divider-color)] flex items-center justify-between">
                        <span className="font-heading font-bold text-xs text-[var(--text-primary)]">
                          {role === 'admin' ? 'Administrative Alerts' : 'Notifications'}
                        </span>
                        <span className="text-xs text-[var(--orange-text)] dark:text-[var(--orange-lighter)] font-semibold font-ui">
                          {unreadCount} unread
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-[var(--divider-color)]">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-[var(--text-secondary)]">
                            {role === 'admin' ? 'No alerts pending' : 'No notifications yet'}
                          </div>
                        ) : (
                          notifications.slice(0, 4).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id);
                                if (n.link) navigate(n.link);
                                setShowNotifs(false);
                              }}
                              className={`px-4 py-3 hover:bg-[var(--menu-item-hover)] cursor-pointer transition-colors ${
                                !n.read ? 'bg-[var(--menu-item-active-bg)]' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-heading font-semibold text-[var(--text-primary)]">{n.title}</h4>
                                <span className="text-[10px] text-[var(--text-secondary)] shrink-0 font-ui">{n.timestamp}</span>
                              </div>
                              <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-[var(--divider-color)] text-center">
                        <Link
                          to="/notifications"
                          onClick={() => setShowNotifs(false)}
                          className="text-xs font-semibold text-[var(--text-link)] hover:text-[var(--text-link-hover)] inline-flex items-center gap-1 font-ui"
                        >
                          <span>View all notifications</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Badge Indicator */}
                <div className="hidden sm:flex items-center">
                  <Badge
                    variant={
                      role === 'student' ? 'success' :
                      role === 'industry' ? 'info' :
                      role === 'academician' ? 'warning' : 'neutral'
                    }
                  >
                    {role.toUpperCase()}
                  </Badge>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 rounded-full outline-none focus-visible:outline-[var(--focus-ring)] transition-all cursor-pointer"
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="hidden md:block text-xs font-heading font-medium text-[var(--text-primary)] max-w-[120px] truncate">
                      {user?.name || 'My Account'}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[var(--menu-bg)] rounded-[14px] shadow-lg border border-[var(--menu-border)] py-1.5 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2.5 border-b border-[var(--divider-color)]">
                        <p className="text-xs font-heading font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
                        <p className="text-[11px] text-[var(--text-secondary)] truncate font-ui">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--menu-item-hover)] hover:text-[var(--text-primary)] font-ui"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        <span>Profile & Settings</span>
                      </Link>

                      <Link
                        to="/notifications"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--menu-item-hover)] hover:text-[var(--text-primary)] font-ui"
                      >
                        <Bell className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        <span>Notification Preferences</span>
                      </Link>

                      <div className="border-t border-[var(--divider-color)] my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[var(--color-error)] hover:bg-[var(--color-error-tint)] font-semibold cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)] font-ui"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  className="text-xs font-heading font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 sm:px-3 py-1.5 rounded-[10px] hover:bg-[var(--bg-subtle)] transition-colors outline-none focus-visible:outline-[var(--focus-ring)]"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="btn-system-primary px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Public Mobile Navigation Drawer */}
        {!isAuthenticated && publicMobileOpen && (
          <div className="md:hidden border-t border-[var(--border-default)] py-3 px-2 bg-[var(--nav-bg)] space-y-1 animate-in fade-in slide-in-from-top-2">
            <Link
              to="/college"
              onClick={() => setPublicMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-heading font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              <Building2 className="w-4 h-4 text-[var(--blue-text)] dark:text-[var(--blue)]" />
              <span>College Directory</span>
            </Link>
            <Link
              to="/verify/NC-REG-2026"
              onClick={() => setPublicMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-heading font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              <Shield className="w-4 h-4 text-[var(--green-text)] dark:text-[var(--green)]" />
              <span>Verify Credentials</span>
            </Link>
            <Link
              to="/style-guide"
              onClick={() => setPublicMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-heading font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              <Sparkles className="w-4 h-4 text-[var(--orange-text)] dark:text-[var(--orange-lighter)]" />
              <span>Interactive Design System</span>
            </Link>
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2 px-1">
              <Link
                to="/login"
                onClick={() => setPublicMobileOpen(false)}
                className="flex-1 text-center py-2 text-xs font-heading font-medium text-[var(--text-primary)] bg-[var(--bg-subtle)] rounded-[10px]"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setPublicMobileOpen(false)}
                className="flex-1 text-center py-2 text-xs font-heading font-semibold text-[var(--dark)] bg-[var(--orange)] rounded-[10px]"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
