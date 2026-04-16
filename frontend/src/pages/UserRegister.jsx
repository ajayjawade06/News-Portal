import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useText } from '../hooks/useText';

/**
 * Password strength checker
 */
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

/**
 * Email format validation
 */
const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const UserRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, verifyOTP } = useUserAuth();
  
  const regTitle = useText('Create your account');
  const regSubtitle = useText('Join Lokawani to book ads and discuss news');
  const otpTitle = useText('Verify your email');
  const otpSubtitle = useText("We've sent a 6-digit code to");
  const submitText = useText('Create Account');
  const verifyText = useText('Verify & Register');
  const haveAccountText = useText('Already have an account?');
  const loginLinkText = useText('Sign in here');

  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  const emailValid = useMemo(() => isValidEmail(formData.email), [formData.email]);

  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
      if (location.state.step === 'otp') {
        setStep('otp');
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!isValidEmail(formData.email)) {
      return setError('Please enter a valid email address (e.g. user@example.com)');
    }

    // Password strength
    if (passwordStrength.passed < 5) {
      return setError('Please meet all password requirements');
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setError('');
    setLoading(true);
    try {
      await register(formData);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return setError('Please enter a 6-digit OTP');
    }
    setError('');
    setLoading(true);
    try {
      await verifyOTP(formData.email, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const PasswordCheck = ({ passed, label }) => (
    <div className="flex items-center gap-2 text-xs">
      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passed ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500'} transition-colors`}>
        {passed ? '✓' : ''}
      </span>
      <span className={`${passed ? 'text-green-600 dark:text-green-400' : 'text-editorial-muted dark:text-zinc-500'} transition-colors`}>
        {label}
      </span>
    </div>
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-red-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="card-editorial p-8 sm:p-10 relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-editorial-red via-red-400 to-editorial-red" />

          {step === 'form' ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 text-editorial-red rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-2xl mb-1">
                  {regTitle}
                </h2>
                <p className="text-sm text-editorial-muted dark:text-zinc-400">{regSubtitle}</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {error && (
                  <div className="border border-editorial-red/30 bg-red-50 dark:bg-red-950/20 text-editorial-red px-4 py-3 text-sm rounded-lg flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">First Name <span className="text-editorial-red">*</span></label>
                    <input name="firstName" required className="input-editorial w-full" placeholder="John" value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">Last Name <span className="text-editorial-red">*</span></label>
                    <input name="lastName" required className="input-editorial w-full" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">Email Address <span className="text-editorial-red">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted dark:text-zinc-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input 
                      name="email" 
                      type="email" 
                      required 
                      className={`input-editorial w-full pl-10 pr-10 ${emailTouched && formData.email && !emailValid ? 'border-red-400 dark:border-red-500' : ''} ${emailTouched && emailValid ? 'border-green-400 dark:border-green-500' : ''}`}
                      placeholder="you@example.com"
                      value={formData.email} 
                      onChange={handleChange}
                      onBlur={() => setEmailTouched(true)}
                    />
                    {emailTouched && formData.email && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${emailValid ? 'text-green-500' : 'text-red-400'}`}>
                        {emailValid ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                      </span>
                    )}
                  </div>
                  {emailTouched && formData.email && !emailValid && (
                    <p className="text-xs text-red-500 mt-1">Enter a valid email (e.g. user@example.com)</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">Password <span className="text-editorial-red">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted dark:text-zinc-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      className="input-editorial w-full pl-10 pr-10" 
                      placeholder="Create a strong password"
                      value={formData.password} 
                      onChange={handleChange} 
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

                  {/* Password Strength Meter */}
                  {formData.password && (
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
                  <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">Confirm Password <span className="text-editorial-red">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted dark:text-zinc-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <input 
                      name="confirmPassword" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      required 
                      className={`input-editorial w-full pl-10 pr-10 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-400 dark:border-red-500' : ''} ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-400 dark:border-green-500' : ''}`}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-editorial-muted hover:text-editorial-ink dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">Business Name <span className="text-editorial-red">*</span></label>
                  <input name="businessName" required className="input-editorial w-full" placeholder="Your business name" value={formData.businessName} onChange={handleChange} />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">Phone Number <span className="text-editorial-red">*</span></label>
                  <input name="phone" type="tel" required className="input-editorial w-full" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || (formData.password && passwordStrength.passed < 5) || (formData.email && !emailValid)} 
                  className="btn-editorial w-full py-3 mt-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending OTP...
                    </span>
                  ) : submitText}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-editorial-red rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                </div>
                <h2 className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-2xl mb-1">
                  {otpTitle}
                </h2>
                <p className="text-sm text-editorial-muted dark:text-zinc-400">
                  {otpSubtitle} <span className="font-bold text-editorial-ink dark:text-zinc-200">{formData.email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-6">
                {error && (
                  <div className="border border-editorial-red/30 bg-red-50 dark:bg-red-950/20 text-editorial-red px-4 py-3 text-sm rounded-lg flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
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
                          document.getElementById(`otp-${focusIdx}`)?.focus();
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val) {
                          const newOtp = otp.split('');
                          newOtp[idx] = val[0];
                          setOtp(newOtp.join(''));
                          setError('');
                          if (idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                          if (!otp[idx] && idx > 0) {
                            const newOtp = otp.split('');
                            newOtp[idx - 1] = '';
                            setOtp(newOtp.join(''));
                            document.getElementById(`otp-${idx - 1}`)?.focus();
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

                <button type="submit" disabled={loading} className="btn-editorial w-full py-3 text-sm font-semibold">
                  {loading ? 'Verifying...' : verifyText}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setStep('form')}
                  className="w-full text-xs text-editorial-muted hover:text-editorial-red font-bold uppercase tracking-widest transition-colors"
                >
                  ← Change Email / Back
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center text-sm border-t border-editorial-border dark:border-zinc-800 pt-6">
            <span className="text-editorial-muted dark:text-zinc-400">{haveAccountText} </span>
            <Link to="/user/login" className="text-editorial-red font-bold hover:underline">
              {loginLinkText}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserRegister;
