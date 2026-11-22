import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { Captcha, CaptchaRef } from '../../components/common/Captcha';
import {
  GraduationCap,
  Briefcase,
  Factory,
  School,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, isAuthenticated, login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role') as UserRole | null;
  const initialRole: UserRole = roleParam === 'admin' ? 'admin' : (roleParam || 'student');

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorOtp, setTwoFactorOtp] = useState('');
  const [twoFactorMessage, setTwoFactorMessage] = useState('');
  const captchaRef = useRef<CaptchaRef>(null);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'student':
        case 'jobseeker':
          navigate('/student/dashboard', { replace: true });
          break;
        case 'industry':
          navigate('/industry/dashboard', { replace: true });
          break;
        case 'academician':
          navigate('/academician/dashboard', { replace: true });
          break;
        case 'institution':
          navigate('/institution/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Handle URL query parameter changes
  useEffect(() => {
    if (roleParam && (roleParam === 'student' || roleParam === 'jobseeker' || roleParam === 'industry' || roleParam === 'academician' || roleParam === 'admin' || roleParam === 'institution')) {
      setSelectedRole(roleParam);
    }
  }, [roleParam]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const isCaptchaValid = isLocalhost || captchaRef.current?.validate();
    if (!isCaptchaValid) {
      setLocalError('Please complete the security CAPTCHA verification correctly');
      return;
    }

    try {
      const res = await login(email, password, selectedRole);
      if (res?.requires2FA) {
        setRequires2FA(true);
        setTwoFactorMessage(res.message || 'Enter verification code sent to your registered contact.');
        return;
      }
    } catch (err: any) {
      captchaRef.current?.refresh();
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Login failed';
      setLocalError(msg);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      await login(email, password, selectedRole, twoFactorOtp);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || '2FA verification failed';
      setLocalError(msg);
    }
  };

  const displayedError = localError || error;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Brand Hero & Role Guide */}
        <div className="md:col-span-5 bg-[var(--bg-subtle)] text-[var(--text-primary)] p-6 sm:p-7 rounded-[14px] border border-[var(--border-default)] shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.18)] border border-[var(--border-default)] text-[var(--orange-text)] dark:text-[var(--orange-lighter)] text-xs font-heading font-semibold uppercase tracking-wider mb-5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" />
              <span>Verified Enterprise Gateway</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-bold tracking-tight mb-2">
              One Gateway for Academia & Industry
            </h1>
            <p className="text-xs text-[var(--text-secondary)] font-body leading-relaxed mb-5">
              Access standardized competency assessments, internships, curriculum alignment, and direct recruitment.
            </p>

            <div className="space-y-2.5 mb-5 font-ui">
              <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-default)]">
                <GraduationCap className="w-4 h-4 text-[var(--green)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-heading font-semibold text-[var(--text-primary)]">University Students</p>
                  <p className="text-[11px] text-[var(--text-secondary)] font-body">Diagnostic skill testing, gap radar & verified internships.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-default)]">
                <Briefcase className="w-4 h-4 text-[var(--blue)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-heading font-semibold text-[var(--text-primary)]">Job Seekers & Graduates</p>
                  <p className="text-[11px] text-[var(--text-secondary)] font-body">Open track to connect with technical recruiters.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-default)]">
                <Factory className="w-4 h-4 text-[var(--orange)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-heading font-semibold text-[var(--text-primary)]">Industry Partners</p>
                  <p className="text-[11px] text-[var(--text-secondary)] font-body">Hire benchmarked talent and schedule live technical interviews.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-default)]">
                <School className="w-4 h-4 text-[var(--orange-text)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-heading font-semibold text-[var(--text-primary)]">Faculty & Mentors</p>
                  <p className="text-[11px] text-[var(--text-secondary)] font-body">Curriculum oversight & collaborative R&D grants.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] font-ui">
              <ShieldAlert className="w-3.5 h-3.5 text-[var(--orange)] shrink-0" />
              <span>Protected by modern encryption & security protocols.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Form */}
        <div className="md:col-span-7 bg-[var(--card-bg)] p-6 sm:p-7 rounded-[14px] border border-[var(--border-default)] shadow-xs transition-colors">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-[var(--text-primary)] tracking-tight">Sign In to NodalConnector</h2>
              {selectedRole === 'admin' && (
                <span className="text-[10px] uppercase font-heading font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] border border-[var(--border-default)]">
                  Admin Portal
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-body mt-1">Select your role and enter your registered credentials</p>
          </div>

          {/* Role selector tabs */}
          {selectedRole === 'admin' ? (
            <div className="p-2.5 mb-5 rounded-[10px] bg-[var(--badge-info-bg)] border border-[var(--border-default)] flex items-center justify-between text-xs text-[var(--badge-info-text)]">
              <div className="flex items-center gap-2 font-heading font-semibold">
                <ShieldCheck className="w-4 h-4 text-[var(--badge-info-text)]" />
                <span>Administrator Direct Access</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className="text-[11px] underline font-ui cursor-pointer text-[var(--text-link)] hover:text-[var(--text-link-hover)]"
              >
                Switch to standard login
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1 p-1 bg-[var(--bg-subtle)] rounded-[10px] mb-5 border border-[var(--border-default)]">
              {[
                { key: 'student', label: 'Student' },
                { key: 'jobseeker', label: 'Job Seeker' },
                { key: 'industry', label: 'Industry' },
                { key: 'academician', label: 'Faculty' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleRoleSelect(key as UserRole)}
                  className={`py-1.5 text-xs font-heading rounded-[8px] transition-all cursor-pointer ${
                    selectedRole === key
                      ? 'bg-[var(--btn-primary-bg)] !text-[var(--dark)] shadow-xs font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {displayedError && (
            <div className="mb-4 p-3 rounded-[10px] bg-[var(--color-error-tint)] border border-[var(--color-error)] text-[var(--color-error-text)] text-xs flex items-center justify-between font-ui">
              <span>{displayedError}</span>
              <button type="button" onClick={() => setLocalError(null)} className="font-bold ml-2 cursor-pointer">×</button>
            </div>
          )}

          {requires2FA ? (
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="p-4 rounded-[10px] bg-[var(--green-tint-80)] border border-[var(--border-default)] text-center space-y-2">
                <div className="w-9 h-9 rounded-[8px] bg-[var(--card-bg)] text-[var(--green)] flex items-center justify-center mx-auto border border-[var(--border-default)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-heading font-bold text-[var(--text-primary)]">Two-Factor Authentication</h3>
                <p className="text-xs text-[var(--text-secondary)] font-body leading-relaxed">
                  {twoFactorMessage}
                </p>
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold text-[var(--text-primary)] mb-1.5 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={twoFactorOtp}
                  onChange={(e) => setTwoFactorOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] font-mono text-lg py-2.5 rounded-[10px] border border-[var(--border-default)] bg-[var(--input-bg)] text-[var(--input-text)] focus:border-[var(--blue)] focus:outline-none"
                  placeholder="••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-system-primary w-full py-2.5 px-4 rounded-[10px] font-heading font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <span>Verify Code & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequires2FA(false);
                  setTwoFactorOtp('');
                  setLocalError(null);
                }}
                className="w-full py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-ui text-center cursor-pointer"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-semibold text-[var(--text-primary)] mb-1.5">
                  {selectedRole === 'admin'
                    ? 'Administrator Username or Email'
                    : selectedRole === 'jobseeker'
                    ? 'Email Address'
                    : selectedRole === 'industry'
                    ? 'Corporate Work Email'
                    : 'Institutional University Email (.edu.in)'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-[10px] border border-[var(--border-default)] bg-[var(--input-bg)] text-xs text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] hover:border-[var(--border-strong)] focus:border-[var(--blue)] focus:outline-none font-ui"
                    placeholder={
                      selectedRole === 'admin'
                        ? 'admin or admin@nodalconnector.in'
                        : selectedRole === 'jobseeker'
                        ? 'candidate@nodalconnector.in'
                        : selectedRole === 'industry'
                        ? 'recruiter@company.in'
                        : 'scholar@university.edu.in'
                    }
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-heading font-semibold text-[var(--text-primary)]">Password</label>
                  <Link to="/forgot-password" className="text-xs font-ui text-[var(--text-link)] hover:text-[var(--text-link-hover)] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-[10px] border border-[var(--border-default)] bg-[var(--input-bg)] text-xs text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] hover:border-[var(--border-strong)] focus:border-[var(--blue)] focus:outline-none font-ui"
                    placeholder={selectedRole === 'admin' ? 'admin' : '••••••••'}
                  />
                </div>
              </div>

              {/* Anti-Bot Security CAPTCHA */}
              <Captcha ref={captchaRef} />

              <div className="flex items-center justify-between pt-1 font-ui">
                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded-[4px] border-[var(--border-default)] accent-[var(--orange)]" />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-system-primary w-full py-2.5 px-4 rounded-[10px] font-heading font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      Sign In as {selectedRole === 'jobseeker' ? 'Job Seeker' : selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-5 pt-3.5 border-t border-[var(--border-default)] text-center text-xs text-[var(--text-secondary)] font-ui">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[var(--text-link)] hover:text-[var(--text-link-hover)] hover:underline">
              Register New Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
