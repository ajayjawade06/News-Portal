import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useText } from '../hooks/useText';

const getPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  let label = 'Very Weak';
  let color = 'bg-red-500';
  if (passed >= 5) { label = 'Strong'; color = 'bg-green-500'; }
  else if (passed >= 4) { label = 'Good'; color = 'bg-lime-500'; }
  else if (passed >= 3) { label = 'Fair'; color = 'bg-yellow-500'; }
  else if (passed >= 2) { label = 'Weak'; color = 'bg-orange-500'; }
  return { checks, passed, label, color, percentage: (passed / 5) * 100 };
};

const UserResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useUserAuth();
  
  const title = useText('Reset Your Password');
  const subtitle = useText('Enter the 6-digit code sent to your email');
  const passLabel = useText('New Password');
  const confirmPassLabel = useText('Confirm New Password');
  const submitText = useText('Reset Password');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/user/forgot-password');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      return setError('Please enter the 6-digit OTP');
    }
    if (passwordStrength.passed < 5) {
      return setError('Please meet all password requirements');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setError('');
    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/user/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code or error resetting password');
    } finally {
      setLoading(false);
    }
  };

  const PasswordCheck = ({ passed, label }) => (
    <div className="flex items-center gap-2 text-xs">
      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passed ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'} transition-colors`}>
        {passed ? '✓' : ''}
      </span>
      <span className={`${passed ? 'text-green-600 dark:text-green-400' : 'text-editorial-muted dark:text-zinc-500'} transition-colors`}>
        {label}
      </span>
    </div>
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-red-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="card-editorial p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-editorial-red via-red-400 to-editorial-red" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 text-editorial-red rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h2 className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-2xl mb-1">
              {title}
            </h2>
            <p className="text-sm text-editorial-muted dark:text-zinc-400">
               {subtitle} <br/> <span className="font-bold text-editorial-ink dark:text-zinc-200">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-editorial-red/30 bg-red-50 dark:bg-red-950/20 text-editorial-red px-4 py-3 text-sm rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="border border-green-400 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-4 py-3 text-sm rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            )}

            {/* OTP Input - 6 individual boxes */}
            <div>
              <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-2">Verification Code</label>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    id={`reset-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-editorial-border dark:border-zinc-700 rounded-lg focus:border-editorial-red focus:ring-0 dark:bg-zinc-800 dark:text-zinc-100 transition-colors"
                    value={otp[idx] || ''}
                    autoFocus={idx === 0}
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                      if (paste) {
                        setOtp(paste);
                        const focusIdx = Math.min(paste.length, 5);
                        document.getElementById(`reset-otp-${focusIdx}`)?.focus();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val) {
                        const newOtp = otp.split('');
                        newOtp[idx] = val[0];
                        setOtp(newOtp.join(''));
                        setError('');
                        if (idx < 5) document.getElementById(`reset-otp-${idx + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                        if (!otp[idx] && idx > 0) {
                          const newOtp = otp.split('');
                          newOtp[idx - 1] = '';
                          setOtp(newOtp.join(''));
                          document.getElementById(`reset-otp-${idx - 1}`)?.focus();
                        } else {
                          const newOtp = otp.split('');
                          newOtp[idx] = '';
                          setOtp(newOtp.join(''));
                        }
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">{passLabel}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted dark:text-zinc-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  className="input-editorial w-full pl-10 pr-10" 
                  placeholder="Create a strong password"
                  value={newPassword} 
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-editorial-muted hover:text-editorial-ink dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`} 
                        style={{ width: `${passwordStrength.percentage}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.passed >= 5 ? 'text-green-600 dark:text-green-400' : 
                      passwordStrength.passed >= 3 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-red-500'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <PasswordCheck passed={passwordStrength.checks.length} label="8+ characters" />
                    <PasswordCheck passed={passwordStrength.checks.uppercase} label="Uppercase (A-Z)" />
                    <PasswordCheck passed={passwordStrength.checks.lowercase} label="Lowercase (a-z)" />
                    <PasswordCheck passed={passwordStrength.checks.number} label="Number (0-9)" />
                    <PasswordCheck passed={passwordStrength.checks.special} label="Special (!@#$)" />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">{confirmPassLabel}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted dark:text-zinc-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <input 
                  type="password" 
                  required 
                  className={`input-editorial w-full pl-10 ${confirmPassword && newPassword !== confirmPassword ? 'border-red-400 dark:border-red-500' : ''} ${confirmPassword && newPassword === confirmPassword ? 'border-green-400 dark:border-green-500' : ''}`}
                  placeholder="Re-enter your new password"
                  value={confirmPassword} 
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} 
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || !!success || (newPassword && passwordStrength.passed < 5)} 
              className="btn-editorial w-full py-3 mt-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting...
                </span>
              ) : submitText}
            </button>
          </form>

          <div className="mt-6 text-center text-sm border-t border-editorial-border dark:border-zinc-800 pt-6">
            <Link to="/user/login" className="text-editorial-muted hover:text-editorial-red font-bold uppercase tracking-widest text-xs transition-colors">
              ← Remembered your password? Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserResetPassword;
