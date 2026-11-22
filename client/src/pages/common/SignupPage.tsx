import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { api } from '../../services/api';
import { Captcha, CaptchaRef } from '../../components/common/Captcha';
import { AcademicHierarchySelector } from '../../components/common/AcademicHierarchySelector';
import {
  User as UserIcon,
  Mail,
  Lock,
  Building,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Loader2,
  X,
  Sparkles
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { user, isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();

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

  const [role, setRole] = useState<UserRole>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    degree: '',
    academicField: '',
    department: '',
    specialization: '',
    designation: '',
    industry: '',
    licenseNumber: '',
    facultyId: '',
    graduationYear: new Date().getFullYear(),
    ayushDomain: '' as any,
  });

  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const captchaRef = useRef<CaptchaRef>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(null);
  };

  const validateClientSide = (): string | null => {
    const cleanEmail = formData.email.toLowerCase().trim();

    if (!formData.name.trim()) return 'Please enter your full legal name.';

    // 1. Password policy check (synchronized with backend security policy)
    if (!formData.password || formData.password.length < 8) {
      return 'Password must be at least 8 characters in length.';
    }
    if (!/[A-Z]/.test(formData.password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[0-9]/.test(formData.password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
      return 'Password must contain at least one special character.';
    }

    // 2. Student & Academician institutional domain check
    if (role === 'student' || role === 'academician') {
      const isEdu = cleanEmail.endsWith('.edu.in') || cleanEmail.endsWith('.ac.in');
      if (!isEdu) {
        return `${role === 'student' ? 'Students' : 'Academicians'} must register with an institutional email (.edu.in or .ac.in). For non-academic or general registration, please select "Job Seeker".`;
      }
    }

    if (role === 'jobseeker') {
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        return 'Please enter a valid email address to receive your OTP verification code.';
      }
    }

    // 3. Academician Faculty ID check
    if (role === 'academician') {
      if (!formData.institution.trim()) {
        return 'Please select a verified university or college.';
      }
      if (!formData.facultyId.trim()) {
        return 'University Faculty ID / Registration number is required for academician registration.';
      }
    }

    // 4. Industry corporate work email check
    if (role === 'industry') {
      const consumerDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'rediffmail.com', 'proton.me'];
      const domain = cleanEmail.split('@')[1] || '';
      if (consumerDomains.includes(domain)) {
        return 'Industry recruiters must register using an official corporate work email (consumer domains like @gmail.com are not permitted).';
      }

      if (formData.institution.trim()) {
        const compClean = formData.institution.toLowerCase().replace(/[^a-z0-9]/g, '');
        const domClean = domain.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!domClean.includes(compClean) && !compClean.includes(domClean)) {
          return `Company name "${formData.institution}" does not match your corporate email domain "@${domain}". Please check your company name or use your official corporate work email.`;
        }
      }
    }

    return null;
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const clientError = validateClientSide();
    if (clientError) {
      setFormError(clientError);
      return;
    }

    // Anti-bot CAPTCHA check
    if (captchaRef.current && !captchaRef.current.validate()) {
      setFormError('Incorrect security CAPTCHA code. Please enter the characters displayed in the anti-bot box.');
      return;
    }

    setIsSendingOtp(true);
    try {
      await api.auth.sendOtp({
        email: formData.email.trim(),
        role,
        companyName: formData.institution,
        facultyId: formData.facultyId,
      });

      setOtpStep(true);
    } catch (err: any) {
      setFormError(err.message || 'Failed to dispatch verification OTP to your email.');
      captchaRef.current?.refresh();
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setFormError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsVerifying(true);
    setFormError(null);

    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role,
        institution: formData.institution.trim(),
        degree: formData.degree,
        academicField: formData.academicField,
        specialization: formData.specialization,
        department: formData.department,
        designation: formData.designation,
        industry: formData.industry,
        facultyId: formData.facultyId.trim(),
        graduationYear: formData.graduationYear,
        ayushDomain: formData.ayushDomain,
        otp: otpCode.trim(),
      } as any);

      switch (role) {
        case 'student':
        case 'jobseeker':
          navigate('/student/dashboard');
          break;
        case 'industry':
          navigate('/industry/dashboard');
          break;
        case 'academician':
          navigate('/academician/dashboard');
          break;
        case 'institution':
          navigate('/institution/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setFormError(err.message || 'Verification failed. Please verify your OTP and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-[var(--bg-surface)] p-6 sm:p-10 rounded-[16px] border border-[var(--border-subtle)] shadow-xs transition-colors">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-heading font-medium tracking-wider px-2.5 py-1 rounded-[6px] bg-[var(--bg-muted)] text-[var(--orange-text)] dark:text-[var(--orange)] border border-[var(--border-subtle)]">
              Verified Registration
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] font-body">NodalConnector Platform</span>
          </div>
          <h2 className="text-2xl font-heading font-semibold text-[var(--text-main)] mt-2">Create Your NodalConnector Account</h2>
          <p className="text-xs font-body text-[var(--text-secondary)] mt-1">
            Sign up for university students, career job seekers, corporate recruiters, and academic faculty.
          </p>
        </div>

        {/* Role Selection Tabs - Public shows Student, Job Seeker, Industry, Academician */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-[10px] mb-6">
          {[
            { key: 'student', label: 'Student (.edu.in)' },
            { key: 'jobseeker', label: 'Job Seeker' },
            { key: 'industry', label: 'Industry' },
            { key: 'academician', label: 'Academician' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setRole(key as UserRole);
                setFormError(null);
              }}
              className={`py-2 px-1 text-center text-[11px] rounded-[8px] transition-all cursor-pointer ${
                role === key
                  ? 'bg-[var(--orange)] !text-[var(--dark)] font-heading font-medium shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] font-body'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {formError && (
          <div className="p-4 mb-4 rounded-[10px] bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--orange-text)] dark:text-[var(--orange)] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[var(--orange-text)] dark:text-[var(--orange)] shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-medium text-[var(--text-main)] mb-1.5">
                {role === 'industry' ? 'Corporate Recruiter Name' : 'Full Legal Name'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={role === 'industry' ? 'Rohan Mehra' : 'Aditya Sharma'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-medium text-[var(--text-main)] mb-1.5">
                {role === 'industry'
                  ? 'Corporate Work Email'
                  : role === 'jobseeker'
                  ? 'Email Address (Any email allowed)'
                  : 'Institutional University Email (.edu.in)'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    role === 'industry'
                      ? 'recruiter@company.com'
                      : role === 'jobseeker'
                      ? 'candidate@gmail.com'
                      : role === 'academician'
                      ? 'professor@university.edu.in'
                      : 'student@dtu.edu.in'
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)]"
                />
              </div>
              <span className="text-[10px] font-body text-[var(--text-secondary)] mt-1 block">
                {role === 'industry'
                  ? 'Domain must match company name (No @gmail.com)'
                  : role === 'jobseeker'
                  ? 'Standard email accepted (@gmail.com, @yahoo.com, etc.)'
                  : 'Mandatory: must end with .edu.in or .ac.in'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-medium text-[var(--text-main)] mb-1.5">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-9 pr-3 py-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)]"
              />
            </div>
          </div>

          {/* Student Fields */}
          {role === 'student' && (
            <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
              <AcademicHierarchySelector
                value={{
                  institution: formData.institution,
                  degree: formData.degree,
                  academicField: formData.academicField,
                  department: formData.department,
                  specialization: formData.specialization,
                }}
                onChange={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    institution: val.institution,
                    degree: val.degree,
                    academicField: val.academicField || '',
                    department: val.department,
                    specialization: val.specialization || '',
                    ayushDomain: (val.academicField || prev.ayushDomain) as any,
                  }));
                  setFormError(null);
                }}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-medium text-[var(--text-main)] mb-1.5">Graduation Passing Year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    min="1970"
                    max="2035"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Job Seeker Fields */}
          {role === 'jobseeker' && (
            <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
              <AcademicHierarchySelector
                value={{
                  institution: formData.institution,
                  degree: formData.degree,
                  academicField: formData.academicField,
                  department: formData.department,
                  specialization: formData.specialization,
                }}
                onChange={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    institution: val.institution,
                    degree: val.degree,
                    academicField: val.academicField || '',
                    department: val.department,
                    specialization: val.specialization || '',
                    ayushDomain: (val.academicField || prev.ayushDomain) as any,
                  }));
                  setFormError(null);
                }}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-medium text-[var(--text-main)] mb-1.5">Graduation Passing Year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    min="1970"
                    max="2035"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Industry Fields */}
          {role === 'industry' && (
            <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-medium text-[var(--text-main)] mb-1.5">Registered Company Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="e.g. Tata Consultancy Services"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-heading font-medium text-[var(--text-main)] mb-1.5">Recruiter Job Title</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Talent Acquisition Lead"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academician Fields */}
          {role === 'academician' && (
            <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
              <AcademicHierarchySelector
                value={{
                  institution: formData.institution,
                  degree: formData.degree,
                  academicField: formData.academicField,
                  department: formData.department,
                  specialization: formData.specialization,
                }}
                onChange={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    institution: val.institution,
                    degree: val.degree,
                    academicField: val.academicField || '',
                    department: val.department,
                    specialization: val.specialization || '',
                  }));
                  setFormError(null);
                }}
                showDegree={false}
                showSpecialization={false}
                required
              />

              <div>
                <label className="block text-xs font-heading font-medium text-[var(--text-main)] mb-1.5">
                  Faculty ID / Employee Code <span className="text-[var(--orange-text)] dark:text-[var(--orange)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="facultyId"
                  value={formData.facultyId}
                  onChange={handleChange}
                  placeholder="FAC-2026-ENG-891"
                  className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)]"
                />
              </div>
            </div>
          )}

          {/* Anti-Bot Security CAPTCHA */}
          <div className="pt-2">
            <Captcha ref={captchaRef} />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full py-3 px-4 rounded-[10px] bg-[var(--orange)] hover:opacity-90 !text-[var(--dark)] font-heading font-medium text-xs shadow-xs transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSendingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating Domain & Dispatching OTP to Email...</span>
                </>
              ) : (
                <>
                  <span>Send Email Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-center text-xs font-body text-[var(--text-secondary)]">
          Already registered on the platform?{' '}
          <Link to="/login" className="font-heading font-semibold text-[var(--orange-text)] dark:text-[var(--orange)] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>

      {/* Email OTP Verification Modal */}
      {otpStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] rounded-[16px] max-w-md w-full p-6 sm:p-8 shadow-xs border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-[var(--bg-muted)] text-[var(--orange-text)] dark:text-[var(--orange)] flex items-center justify-center border border-[var(--border-subtle)]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-heading font-semibold text-[var(--text-main)]">Verify Email Address</h3>
              </div>
              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs font-body text-[var(--text-secondary)]">
                A 6-digit one-time password (OTP) has been dispatched to{' '}
                <strong className="text-[var(--text-main)]">{formData.email}</strong>.
              </p>

              {formError && (
                <div className="p-3 rounded-[10px] bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--orange-text)] dark:text-[var(--orange)] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[var(--orange-text)] dark:text-[var(--orange)] shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="p-3 bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-[10px] text-xs font-body text-[var(--text-secondary)] flex items-start gap-2">
                <Mail className="w-4 h-4 text-[var(--green-text)] dark:text-[var(--green)] shrink-0 mt-0.5" />
                <span>
                  Please check your inbox (and spam/junk folder) for the 6-digit verification code. The code is valid for 10 minutes.
                </span>
              </div>

              <div>
                <label className="block text-xs font-heading font-medium text-[var(--text-main)] mb-1.5">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ''));
                    setFormError(null);
                  }}
                  placeholder="e.g. 123456"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 px-4 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] focus:outline-none focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)]"
                />
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  disabled={isSendingOtp}
                  onClick={async () => {
                    setFormError(null);
                    setIsSendingOtp(true);
                    try {
                      await api.auth.sendOtp({
                        email: formData.email.trim(),
                        role,
                        companyName: formData.institution,
                        facultyId: formData.facultyId,
                      });
                      setOtpCode('');
                    } catch (err: any) {
                      setFormError(err.message || 'Failed to resend verification OTP.');
                    } finally {
                      setIsSendingOtp(false);
                    }
                  }}
                  className="text-xs text-[var(--orange-text)] dark:text-[var(--orange)] hover:underline font-heading font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Resending OTP...</span>
                    </>
                  ) : (
                    <span>Didn't receive code? Click to Resend OTP</span>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleVerifyAndRegister}
                disabled={isVerifying || otpCode.length !== 6}
                className="w-full py-3 rounded-[10px] bg-[var(--orange)] hover:opacity-90 disabled:opacity-50 !text-[var(--dark)] font-heading font-medium text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-opacity"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify OTP & Complete Registration</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtpStep(false);
                  setFormError(null);
                }}
                className="text-xs font-body text-[var(--text-secondary)] hover:text-[var(--text-main)] py-1"
              >
                Back to Registration Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
