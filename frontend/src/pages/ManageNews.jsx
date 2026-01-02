import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import api from '../utils/api';

const ManageNews = () => {
  const { t } = useTranslation();
  const { getNewsContent } = useNews();
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchTerm, statusFilter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/news/admin/all');
      setNews(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        getNewsContent(item, 'title').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location || item.coverage || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (statusFilter === 'published') return item.published;
        if (statusFilter === 'draft') return !item.published;
        return true;
      });
    }

    setFilteredNews(filtered);
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

  const handleBulkPublish = async () => {
    if (selectedItems.length === 0) return;

    try {
      await Promise.all(selectedItems.map(id => api.patch(`/news/${id}/publish`)));
      setSelectedItems([]);
      setShowBulkActions(false);
      fetchNews();
    } catch (err) {
      alert('Failed to update selected items');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    if (!window.confirm(`Delete ${selectedItems.length} selected items?`)) {
      return;
    }

    try {
      await Promise.all(selectedItems.map(id => api.delete(`/news/${id}`)));
      setSelectedItems([]);
      setShowBulkActions(false);
      fetchNews();
    } catch (err) {
      alert('Failed to delete selected items');
    }
  };

  const toggleSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredNews.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredNews.map(item => item._id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-8">
        <div className="container mx-auto px-4 phone:px-6">
          <div className="text-center py-12 phone:py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 phone:h-16 phone:w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg phone:text-xl">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-4 phone:py-6 lg:py-8">
      <div className="container mx-auto px-4 phone:px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col phone:flex-row phone:justify-between phone:items-center gap-4 mb-6 phone:mb-8">
          <div>
            <h1 className="text-2xl phone:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{t('manage.title')}</h1>
            <p className="text-gray-600 text-sm phone:text-base">Manage your news articles and publications</p>
          </div>
          <Link
            to="/dashboard/create"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 phone:px-6 py-3 phone:py-4 rounded-lg phone:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] touch-manipulation text-center"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>✍️</span>
              <span>{t('common.create')}</span>
            </span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 phone:px-6 py-3 phone:py-4 rounded-lg phone:rounded-xl mb-6 flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 phone:grid-cols-4 gap-3 phone:gap-4 mb-6 phone:mb-8">
          <div className="bg-white p-3 phone:p-4 rounded-lg phone:rounded-xl shadow-md border border-gray-100">
            <div className="text-2xl phone:text-3xl font-bold text-blue-600">{news.length}</div>
            <div className="text-xs phone:text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-3 phone:p-4 rounded-lg phone:rounded-xl shadow-md border border-gray-100">
            <div className="text-2xl phone:text-3xl font-bold text-green-600">{news.filter(n => n.published).length}</div>
            <div className="text-xs phone:text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white p-3 phone:p-4 rounded-lg phone:rounded-xl shadow-md border border-gray-100">
            <div className="text-2xl phone:text-3xl font-bold text-yellow-600">{news.filter(n => !n.published).length}</div>
            <div className="text-xs phone:text-sm text-gray-600">Drafts</div>
          </div>
          <div className="bg-white p-3 phone:p-4 rounded-lg phone:rounded-xl shadow-md border border-gray-100">
            <div className="text-2xl phone:text-3xl font-bold text-purple-600">{selectedItems.length}</div>
            <div className="text-xs phone:text-sm text-gray-600">Selected</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 phone:p-6 rounded-lg phone:rounded-xl shadow-md mb-6 phone:mb-8 border border-gray-100">
          <div className="flex flex-col phone:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, category, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 phone:py-3 border border-gray-300 rounded-lg phone:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="phone:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 phone:px-4 py-2 phone:py-3 border border-gray-300 rounded-lg phone:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Posts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg phone:rounded-xl p-4 phone:p-6 mb-6">
            <div className="flex flex-col phone:flex-row items-start phone:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-800 font-medium">{selectedItems.length} items selected</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleBulkPublish}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Publish Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* News List */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 phone:py-16 bg-white rounded-lg phone:rounded-xl shadow-md">
            <div className="text-5xl phone:text-6xl mb-4">📝</div>
            <p className="text-gray-600 text-lg phone:text-xl mb-4">
              {searchTerm || statusFilter !== 'all' ? 'No posts match your filters' : t('manage.noPosts')}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredNews.length && filteredNews.length > 0}
                  onChange={selectAll}
                  className="w-4 h-4 phone:w-5 phone:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm phone:text-base text-gray-700">Select All</span>
              </label>
              <span className="text-sm text-gray-500">{filteredNews.length} posts</span>
            </div>

            {/* Mobile Card Layout */}
            <div className="block md:hidden space-y-4">
              {filteredNews.map((item) => (
                <div key={item._id} className="bg-white rounded-lg phone:rounded-xl shadow-md overflow-hidden border border-gray-100">
                  {/* Selection Checkbox */}
                  <div className="p-4 border-b border-gray-100">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelection(item._id)}
                        className="w-4 h-4 phone:w-5 phone:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Select</span>
                    </label>
                  </div>

                  {/* Content */}
                  <div className="p-4 phone:p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg phone:text-xl font-semibold text-gray-900 flex-1 mr-2 line-clamp-2">
                        {getNewsContent(item, 'title')}
                      </h3>
                      <span
                        className={`px-2 phone:px-3 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${
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
                        <span className="flex items-center space-x-1">
                          <span>🏷️</span>
                          <span>{item.category}</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <span>📅</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col phone:flex-row gap-2">
                      <Link
                        to={`/dashboard/edit/${item._id}`}
                        className="flex-1 bg-blue-600 text-white px-4 py-3 phone:py-4 rounded-lg phone:rounded-xl text-center text-sm phone:text-base font-medium hover:bg-blue-700 transition-colors touch-manipulation"
                      >
                        <span className="flex items-center justify-center space-x-1">
                          <span>✏️</span>
                          <span>{t('common.edit')}</span>
                        </span>
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(item._id)}
                        className={`flex-1 px-4 py-3 phone:py-4 rounded-lg phone:rounded-xl text-center text-sm phone:text-base font-medium transition-colors touch-manipulation ${
                          item.published
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        <span className="flex items-center justify-center space-x-1">
                          <span>{item.published ? '📥' : '📤'}</span>
                          <span>{item.published ? t('common.unpublish') : t('common.publish')}</span>
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-red-500 text-white px-4 py-3 phone:py-4 rounded-lg phone:rounded-xl text-center text-sm phone:text-base font-medium hover:bg-red-600 transition-colors touch-manipulation"
                      >
                        <span className="flex items-center justify-center space-x-1">
                          <span>🗑️</span>
                          <span>{t('common.delete')}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block bg-white rounded-lg phone:rounded-xl shadow-md overflow-hidden border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredNews.length && filteredNews.length > 0}
                        onChange={selectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNews.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => toggleSelection(item._id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
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
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/dashboard/edit/${item._id}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(item._id)}
                            className={`transition-colors ${
                              item.published
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {item.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
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
    </div>
  );
};

export default ManageNews;

