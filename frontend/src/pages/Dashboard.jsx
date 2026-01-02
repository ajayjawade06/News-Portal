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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            {t('dashboard.totalPosts')}
          </h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            {t('dashboard.publishedPosts')}
          </h3>
          <p className="text-3xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            {t('dashboard.draftPosts')}
          </h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.drafts}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          to="/dashboard/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {t('dashboard.createNews')}
        </Link>
        <Link
          to="/dashboard/manage"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
        >
          {t('dashboard.manageNews')}
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/dashboard/ads"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Manage Ads
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

