import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useText } from '../hooks/useText';

const UserForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useUserAuth();
  
  const title = useText('Forgot Password?');
  const subtitle = useText('Enter your registered email to receive a reset code');
  const emailLabel = useText('Email address');
  const submitText = useText('Send Reset Code');
  const backToLoginText = useText('Back to Login');

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic email format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address (e.g. user@example.com)');
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      navigate('/user/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-red-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="card-editorial p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-editorial-red via-red-400 to-editorial-red" />
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 text-editorial-red rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-2xl mb-1">
              {title}
            </h2>
            <p className="text-sm text-editorial-muted dark:text-zinc-400">{subtitle}</p>
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

            <div>
              <label className="block text-sm font-medium text-editorial-ink dark:text-zinc-300 mb-1">{emailLabel}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted dark:text-zinc-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input 
                  type="email" 
                  required 
                  className="input-editorial w-full pl-10" 
                  placeholder="you@example.com"
                  value={email} 
                  onChange={(e) => { setEmail(e.target.value); setError(''); }} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-editorial w-full py-3 mt-4 text-sm font-bold">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking email...
                </span>
              ) : submitText}
            </button>
          </form>

          <div className="mt-6 text-center text-sm border-t border-editorial-border dark:border-zinc-800 pt-6">
            <Link to="/user/login" className="text-editorial-muted hover:text-editorial-red font-bold uppercase tracking-widest text-xs transition-colors">
              ← {backToLoginText}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserForgotPassword;
