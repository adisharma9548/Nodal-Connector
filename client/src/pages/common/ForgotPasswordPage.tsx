import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, CheckCircle2, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.resetPassword(email.trim().toLowerCase());
      setMessage(res.data?.message || 'Verification code dispatched to your registered email.');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError('Please enter the full 6-digit security code.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.verifyResetOtp(email.trim().toLowerCase(), otp.trim());
      const token = res.data?.resetToken;
      if (!token) {
        throw new Error('Verification failed: no authorization token issued.');
      }
      setResetToken(token);
      setMessage(res.data?.message || 'Code verified. Please set your new password.');
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!resetToken) {
      setError('Reset authorization missing. Please verify your OTP code first.');
      setStep('otp');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.auth.resetPasswordWithToken({
        resetToken,
        newPassword,
      });
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The reset session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
        {step === 'email' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Account Recovery</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Enter your registered official email address to receive a secure 6-digit verification code.
            </p>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu.in"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                autoComplete="email"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={loading}
              >
                Send Verification OTP
              </Button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Verify Security Code</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">{message}</p>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  6-Digit Security Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-xl font-mono font-bold px-3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={loading}
              >
                Verify Code & Continue
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Didn't receive code? Change email
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'reset' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Set New Password</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Create a strong password with at least 8 characters including letters and numbers.
            </p>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />

              <Input
                label="Confirm New Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={loading}
              >
                Update Password
              </Button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Password Reset Successful</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
              Your institutional password has been securely updated. You can now login with your new credentials.
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => navigate('/login')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Back to Sign In
            </Button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
