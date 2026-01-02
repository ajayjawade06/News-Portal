import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/news/admin/all');
        const news = response.data.data || [];
        
        setStats({
          total: news.length,
          published: news.filter(n => n.published).length,
          drafts: news.filter(n => !n.published).length
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('dashboard.title')}</h1>

      {/* Stats Cards - iPhone 16 Pro Optimized */}
      <div className="grid grid-cols-1 phone:grid-cols-2 lg:grid-cols-3 gap-4 phone:gap-6 mb-6 phone:mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 phone:p-6 rounded-xl phone:rounded-2xl shadow-lg phone:shadow-xl transform hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs phone:text-sm mb-1">Total Posts</p>
              <p className="text-2xl phone:text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="text-3xl phone:text-4xl">📊</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 phone:p-6 rounded-xl phone:rounded-2xl shadow-lg phone:shadow-xl transform hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs phone:text-sm mb-1">Published</p>
              <p className="text-2xl phone:text-3xl font-bold">{stats.published}</p>
            </div>
            <div className="text-3xl phone:text-4xl">✅</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 phone:p-6 rounded-xl phone:rounded-2xl shadow-lg phone:shadow-xl transform hover:scale-[1.02] transition-transform duration-200 phone:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-xs phone:text-sm mb-1">Drafts</p>
              <p className="text-2xl phone:text-3xl font-bold">{stats.drafts}</p>
            </div>
            <div className="text-3xl phone:text-4xl">📝</div>
          </div>
        </div>
      </div>

      {/* Action Buttons - iPhone 16 Pro Optimized */}
      <div className="flex flex-col phone:flex-row gap-3 phone:gap-4">
        <Link
          to="/dashboard/create"
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 phone:px-6 py-3 phone:py-4 rounded-xl phone:rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg phone:shadow-xl hover:shadow-2xl transform hover:scale-[1.02] text-center touch-manipulation text-base phone:text-lg"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>✍️</span>
            <span>{t('dashboard.createNews')}</span>
          </span>
        </Link>
        <Link
          to="/dashboard/manage"
          className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 phone:px-6 py-3 phone:py-4 rounded-xl phone:rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-lg phone:shadow-xl hover:shadow-2xl transform hover:scale-[1.02] text-center touch-manipulation text-base phone:text-lg"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>📋</span>
            <span>{t('dashboard.manageNews')}</span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

