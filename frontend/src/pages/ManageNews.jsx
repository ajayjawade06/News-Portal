import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useText } from '../hooks/useText';
import { useNews } from '../context/NewsContext';
import api from '../utils/api';
import BackButton from '../components/BackButton';

const ManageNews = () => {
  const manageTitle = useText('Manage News Posts');
  const createText = useText('Create');
  const noPostsText = useText('No posts found');
  const publishedText = useText('Published');
  const draftText = useText('Drafts');
  const editText = useText('Edit');
  const publishText = useText('Publish');
  const unpublishText = useText('Unpublish');
  const deleteText = useText('Delete');
  const confirmDeleteText = useText('Are you sure you want to delete this post?');
  const { getNewsContent } = useNews();
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    let filtered = news;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          getNewsContent(item, 'title').toLowerCase().includes(term) ||
          (item.category || '').toLowerCase().includes(term) ||
          (item.location || item.coverage || '').toLowerCase().includes(term)
      );
    }
    if (statusFilter === 'published') filtered = filtered.filter((item) => item.published);
    if (statusFilter === 'draft') filtered = filtered.filter((item) => !item.published);
    setFilteredNews(filtered);
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

  const handleDelete = async (id) => {
    if (!window.confirm(confirmDeleteText)) return;
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await api.patch(`/news/${id}/publish`);
      fetchNews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleBulkPublish = async () => {
    if (selectedItems.length === 0) return;
    try {
      await Promise.all(selectedItems.map((id) => api.patch(`/news/${id}/publish`)));
      setSelectedItems([]);
      fetchNews();
    } catch {
      alert('Failed to update selected');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!window.confirm(`Delete ${selectedItems.length} selected items?`)) return;
    try {
      await Promise.all(selectedItems.map((id) => api.delete(`/news/${id}`)));
      setSelectedItems([]);
      fetchNews();
    } catch {
      alert('Failed to delete');
    }
  };

  const toggleSelection = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => {
    setSelectedItems(selectedItems.length === filteredNews.length ? [] : filteredNews.map((item) => item._id));
  };

  if (loading) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center py-20 bg-white dark:bg-zinc-950">
        <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 py-8 lg:py-10">
      <div className="container-editorial">
        <div className="mb-6">
          <BackButton to="/dashboard" label="Back to Dashboard" />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-serif font-bold text-editorial-black text-2xl sm:text-3xl border-b-2 border-editorial-red pb-2 mb-1">
              {manageTitle}
            </h1>
            <p className="text-sm text-editorial-muted">Manage your articles</p>
          </div>
          <Link to="/dashboard/create" className="btn-editorial shrink-0">
            {createText}
          </Link>
        </div>

        {error && (
          <div className="border border-editorial-red bg-editorial-red-muted text-editorial-red-dark px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="card-editorial p-4">
            <p className="font-serif font-bold text-editorial-black text-2xl">{news.length}</p>
            <p className="caption text-editorial-muted">Total</p>
          </div>
          <div className="card-editorial p-4">
            <p className="font-serif font-bold text-editorial-red text-2xl">{news.filter((n) => n.published).length}</p>
            <p className="caption text-editorial-muted">Published</p>
          </div>
          <div className="card-editorial p-4">
            <p className="font-serif font-bold text-editorial-ink text-2xl">{news.filter((n) => !n.published).length}</p>
            <p className="caption text-editorial-muted">Drafts</p>
          </div>
          <div className="card-editorial p-4">
            <p className="font-serif font-bold text-editorial-ink text-2xl">{selectedItems.length}</p>
            <p className="caption text-editorial-muted">Selected</p>
          </div>
        </div>

        <div className="card-editorial p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-editorial-ink mb-2">Search</label>
              <input
                type="text"
                placeholder="Title, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-editorial"
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-editorial-ink mb-2">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-editorial">
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="border border-editorial-border bg-neutral-50 p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-sm font-medium text-editorial-ink">{selectedItems.length} selected</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleBulkPublish} className="btn-editorial text-sm py-2">
                Publish selected
              </button>
              <button type="button" onClick={handleBulkDelete} className="px-4 py-2 text-sm font-medium bg-editorial-red text-white hover:bg-editorial-red-dark focus:ring-2 focus:ring-editorial-red focus:ring-offset-2">
                Delete selected
              </button>
              <button type="button" onClick={() => setSelectedItems([])} className="btn-editorial-outline text-sm py-2">
                Clear
              </button>
            </div>
          </div>
        )}

        {filteredNews.length === 0 ? (
          <div className="card-editorial p-12 sm:p-16 text-center">
            <p className="text-editorial-muted mb-4">
              {searchTerm || statusFilter !== 'all' ? 'No posts match your filters' : noPostsText}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button type="button" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="link-editorial">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filteredNews.length > 0 && selectedItems.length === filteredNews.length}
                  onChange={selectAll}
                  className="w-4 h-4 border-editorial-border text-editorial-red focus:ring-editorial-red"
                />
                <span className="text-sm text-editorial-ink">Select all</span>
              </label>
              <span className="text-sm text-editorial-muted">{filteredNews.length} posts</span>
            </div>

            <div className="block md:hidden space-y-4">
              {filteredNews.map((item) => (
                <div key={item._id} className="card-editorial">
                  <div className="p-4 border-b border-editorial-border">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelection(item._id)}
                        className="w-4 h-4 border-editorial-border text-editorial-red focus:ring-editorial-red"
                      />
                      <span className="text-sm text-editorial-muted">Select</span>
                    </label>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h3 className="font-serif font-semibold text-editorial-black line-clamp-2 flex-1">
                        {getNewsContent(item, 'title')}
                      </h3>
                      <span className={`shrink-0 caption ${item.published ? 'text-editorial-red' : 'text-editorial-muted'}`}>
                        {item.published ? publishedText : draftText}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-caption text-editorial-muted mb-4">
                      <span>{item.location || item.coverage || 'N/A'}</span>
                      <span>{item.category}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/dashboard/edit/${item._id}`} className="btn-editorial flex-1 min-w-[80px] text-center text-sm py-2">
                        {editText}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(item._id)}
                        className="flex-1 min-w-[80px] py-2 text-sm font-medium border border-editorial-border text-editorial-ink hover:bg-neutral-50"
                      >
                        {item.published ? unpublishText : publishText}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 min-w-[80px] py-2 text-sm font-medium text-editorial-red hover:bg-editorial-red-muted"
                      >
                        {deleteText}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block card-editorial overflow-hidden">
              <table className="min-w-full divide-y divide-editorial-border">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={filteredNews.length > 0 && selectedItems.length === filteredNews.length}
                        onChange={selectAll}
                        className="w-4 h-4 border-editorial-border text-editorial-red focus:ring-editorial-red"
                      />
                    </th>
                    <th className="px-6 py-3 text-left caption text-editorial-muted">Title</th>
                    <th className="px-6 py-3 text-left caption text-editorial-muted">Location</th>
                    <th className="px-6 py-3 text-left caption text-editorial-muted">Category</th>
                    <th className="px-6 py-3 text-left caption text-editorial-muted">Status</th>
                    <th className="px-6 py-3 text-left caption text-editorial-muted">Date</th>
                    <th className="px-6 py-3 text-left caption text-editorial-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-editorial-border">
                  {filteredNews.map((item) => (
                    <tr key={item._id} className="hover:bg-neutral-50/50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => toggleSelection(item._id)}
                          className="w-4 h-4 border-editorial-border text-editorial-red focus:ring-editorial-red"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-editorial-ink line-clamp-2">
                          {getNewsContent(item, 'title')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap caption text-editorial-muted">
                        {item.location || item.coverage || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-editorial-muted">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`caption ${item.published ? 'text-editorial-red' : 'text-editorial-muted'}`}>
                          {item.published ? publishedText : draftText}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-editorial-muted">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Link to={`/dashboard/edit/${item._id}`} className="text-sm font-medium text-editorial-red hover:underline">
                            Edit
                          </Link>
                          <button type="button" onClick={() => handleTogglePublish(item._id)} className="text-sm font-medium text-editorial-muted hover:underline">
                            {item.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button type="button" onClick={() => handleDelete(item._id)} className="text-sm font-medium text-editorial-red hover:underline">
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
    </main>
  );
};

export default ManageNews;
