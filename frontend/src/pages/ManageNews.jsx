import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import api from '../utils/api';

const ManageNews = () => {
  const { t } = useTranslation();
  const { getNewsContent } = useNews();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news/admin/all');
      setNews(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('manage.confirmDelete'))) {
      return;
    }

    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete news');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await api.patch(`/news/${id}/publish`);
      fetchNews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update publish status');
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('manage.title')}</h1>
        <Link
          to="/dashboard/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {t('common.create')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {news.length === 0 ? (
        <p className="text-gray-600 text-center py-8">{t('manage.noPosts')}</p>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="block phone:hidden space-y-4">
            {news.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2">
                    {getNewsContent(item, 'title')}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${
                      item.published
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    }`}
                  >
                    {item.published ? t('common.published') : t('common.draft')}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{item.location || item.coverage || 'N/A'}</span>
                    </span>
                    <span>{item.category}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/dashboard/edit/${item._id}`}
                    className="flex-1 min-w-0 bg-blue-600 text-white px-3 py-2 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-colors touch-manipulation"
                  >
                    {t('common.edit')}
                  </Link>
                  <button
                    onClick={() => handleTogglePublish(item._id)}
                    className={`flex-1 min-w-0 px-3 py-2 rounded-lg text-center text-sm font-medium transition-colors touch-manipulation ${
                      item.published
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {item.published ? t('common.unpublish') : t('common.publish')}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 min-w-0 bg-red-500 text-white px-3 py-2 rounded-lg text-center text-sm font-medium hover:bg-red-600 transition-colors touch-manipulation"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden phone:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('manage.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getNewsContent(item, 'title')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.location || item.coverage || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.published ? t('common.published') : t('common.draft')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/dashboard/edit/${item._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t('common.edit')}
                        </Link>
                        <button
                          onClick={() => handleTogglePublish(item._id)}
                          className={`${
                            item.published
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {item.published ? t('common.unpublish') : t('common.publish')}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageNews;

