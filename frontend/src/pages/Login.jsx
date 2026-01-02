import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-8 phone:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 phone:space-y-8 bg-white p-6 phone:p-8 sm:p-10 rounded-2xl phone:rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 phone:w-20 phone:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 phone:mb-6 shadow-lg">
            <span className="text-3xl phone:text-4xl">🔐</span>
          </div>
          <h2 className="text-2xl phone:text-3xl lg:text-3xl font-extrabold text-gray-900 mb-2 phone:mb-3">
            {t('login.title')}
          </h2>
          <p className="text-gray-600 text-sm phone:text-base">Welcome back! Please login to continue.</p>
        </div>
        <form className="mt-6 phone:mt-8 space-y-4 phone:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 phone:px-6 py-3 phone:py-4 rounded-lg flex items-center space-x-2 animate-shake">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4 phone:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 phone:mb-3">
                {t('login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 phone:px-6 py-3 phone:py-4 text-base phone:text-lg border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg phone:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder={t('login.email')}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 phone:mb-3">
                {t('login.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 phone:px-6 py-3 phone:py-4 text-base phone:text-lg border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg phone:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder={t('login.password')}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 phone:py-4 px-4 phone:px-6 border border-transparent text-base phone:text-lg font-semibold rounded-lg phone:rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] touch-manipulation"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-5 w-5 phone:h-6 phone:w-6 border-t-2 border-b-2 border-white mr-2 phone:mr-3"></span>
                  {t('common.loading')}
                </span>
              ) : (
                t('login.submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

