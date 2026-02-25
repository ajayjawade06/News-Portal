import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.reporter));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('login.invalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="card-editorial p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="font-serif font-bold text-editorial-black text-2xl mb-2">
              {t('login.title')}
            </h2>
            <p className="text-sm text-editorial-muted">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="border border-editorial-red bg-editorial-red-muted text-editorial-red-dark px-4 py-3 text-sm animate-shake">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-editorial-ink mb-2">
                {t('login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-editorial"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-editorial-ink mb-2">
                {t('login.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-editorial"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-editorial w-full py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('common.loading')}
                </span>
              ) : (
                t('login.submit')
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
