import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useText from '../hooks/useText';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const titleText = useText('Create admin account');
  const submitText = useText('Register');
  const usernameLabel = useText('Username');
  const emailLabel = useText('Email address');
  const passwordLabel = useText('Password');
  const loadingText = useText('Loading...');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await api.post('/auth/register', formData, config);
      alert('Admin account created successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
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
              {titleText}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="border border-editorial-red bg-editorial-red-muted text-editorial-red-dark px-4 py-3 text-sm animate-shake">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-editorial-ink mb-2">
                {usernameLabel}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-editorial"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-editorial-ink mb-2">
                {emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-editorial"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-editorial-ink mb-2">
                {passwordLabel}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-editorial"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-editorial w-full py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {loadingText}
                </span>
              ) : (
                submitText
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
