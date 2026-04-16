import { useEffect, useState } from 'react';
import { useText } from '../hooks/useText';
import api from '../utils/api';
import BackButton from '../components/BackButton';

const ModerationDashboard = () => {
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'ratings'
  const [viewType, setViewType] = useState('active'); // 'active' or 'deleted'
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ activeComments: 0, deletedComments: 0, activeRatings: 0, deletedRatings: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      let response;
      if (activeTab === 'comments') {
        response = await api.get('/news');
      } else {
        response = await api.get('/news');
      }

      const allNews = response.data.data || [];
      const items = [];

      allNews.forEach(article => {
        if (activeTab === 'comments') {
          article.comments?.forEach(comment => {
            items.push({
              commentId: comment._id,
              newsId: article._id,
              newsTitle: article.title.en,
              text: comment.text,
              author: comment.name,
              isDeleted: comment.isDeleted || false,
              deletedReason: comment.deletedReason,
              deletedAt: comment.deletedAt,
              createdAt: comment.createdAt
            });
          });
        } else {
          article.ratings?.forEach(rating => {
            items.push({
              ratingId: rating._id,
              newsId: article._id,
              newsTitle: article.title.en,
              ratingValue: rating.ratingValue,
              feedback: rating.feedback,
              author: rating.name,
              isDeleted: rating.isDeleted || false,
              deletedReason: rating.deletedReason,
              deletedAt: rating.deletedAt,
              createdAt: rating.createdAt
            });
          });
        }
      });

      setAllItems(items);
      
      // Update stats
      const activeCount = items.filter(i => !i.isDeleted).length;
      const deletedCount = items.filter(i => i.isDeleted).length;
      
      setStats(prev => ({
        ...prev,
        [activeTab === 'comments' ? 'activeComments' : 'activeRatings']: activeCount,
        [activeTab === 'comments' ? 'deletedComments' : 'deletedRatings']: deletedCount
      }));
    } catch (err) {
      setError(err.response?.data?.message || `Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (newsId, itemId) => {
    const reason = prompt('Enter reason for deletion:', 'Inappropriate content');
    if (reason === null) return;

    try {
      let endpoint;
      if (activeTab === 'comments') {
        endpoint = `/news/${newsId}/comments/${itemId}`;
      } else {
        endpoint = `/news/${newsId}/ratings/${itemId}`;
      }

      await api.delete(endpoint, {
        data: { reason: reason || 'Inappropriate content' }
      });

      // Update local state
      const updated = allItems.map(item =>
        (activeTab === 'comments' ? item.commentId === itemId : item.ratingId === itemId)
          ? { ...item, isDeleted: true, deletedReason: reason, deletedAt: new Date() }
          : item
      );
      setAllItems(updated);

      // Update stats
      const activeCount = updated.filter(i => !i.isDeleted).length;
      const deletedCount = updated.filter(i => i.isDeleted).length;
      setStats(prev => ({
        ...prev,
        [activeTab === 'comments' ? 'activeComments' : 'activeRatings']: activeCount,
        [activeTab === 'comments' ? 'deletedComments' : 'deletedRatings']: deletedCount
      }));

      alert(`${activeTab.slice(0, -1)} deleted successfully!`);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to delete ${activeTab.slice(0, -1)}`);
    }
  };

  const handleRestore = async (newsId, itemId) => {
    try {
      let endpoint;
      if (activeTab === 'comments') {
        endpoint = `/news/admin/moderation/comments/restore/${newsId}/${itemId}`;
      } else {
        endpoint = `/news/admin/moderation/ratings/restore/${newsId}/${itemId}`;
      }

      await api.post(endpoint);
      
      // Update local state
      const updated = allItems.map(item =>
        (activeTab === 'comments' ? item.commentId === itemId : item.ratingId === itemId)
          ? { ...item, isDeleted: false, deletedReason: null, deletedAt: null }
          : item
      );
      setAllItems(updated);

      // Update stats
      const activeCount = updated.filter(i => !i.isDeleted).length;
      const deletedCount = updated.filter(i => i.isDeleted).length;
      setStats(prev => ({
        ...prev,
        [activeTab === 'comments' ? 'activeComments' : 'activeRatings']: activeCount,
        [activeTab === 'comments' ? 'deletedComments' : 'deletedRatings']: deletedCount
      }));

      alert(`${activeTab.slice(0, -1)} restored successfully!`);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to restore ${activeTab.slice(0, -1)}`);
    }
  };

  let filteredItems = viewType === 'active'
    ? allItems.filter(i => !i.isDeleted)
    : allItems.filter(i => i.isDeleted);

  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    filteredItems = filteredItems.filter(i => 
      i.author?.toLowerCase().includes(lowerSearch) || 
      i.text?.toLowerCase().includes(lowerSearch) || 
      i.feedback?.toLowerCase().includes(lowerSearch) ||
      i.newsTitle?.toLowerCase().includes(lowerSearch)
    );
  }

  filteredItems.sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name-asc':
        return (a.author || '').localeCompare(b.author || '');
      case 'name-desc':
        return (b.author || '').localeCompare(a.author || '');
      case 'date-desc':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <BackButton to="/dashboard" label="Back to Dashboard" />
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-editorial-black dark:text-white mb-2">
            Moderation Dashboard
          </h1>
          <p className="text-editorial-muted">Review and manage comments and ratings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="card-editorial p-4">
            <p className="text-xs text-editorial-muted mb-1">Active Comments</p>
            <p className="text-3xl font-bold text-editorial-black dark:text-white">{stats.activeComments}</p>
          </div>
          <div className="card-editorial p-4">
            <p className="text-xs text-editorial-muted mb-1">Deleted Comments</p>
            <p className="text-3xl font-bold text-editorial-red">{stats.deletedComments}</p>
          </div>
          <div className="card-editorial p-4">
            <p className="text-xs text-editorial-muted mb-1">Active Ratings</p>
            <p className="text-3xl font-bold text-editorial-black dark:text-white">{stats.activeRatings}</p>
          </div>
          <div className="card-editorial p-4">
            <p className="text-xs text-editorial-muted mb-1">Deleted Ratings</p>
            <p className="text-3xl font-bold text-editorial-orange">{stats.deletedRatings}</p>
          </div>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewType('active')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              viewType === 'active'
                ? 'bg-editorial-red text-white'
                : 'bg-gray-200 dark:bg-zinc-700 text-editorial-black dark:text-white hover:bg-gray-300'
            }`}
          >
            Active Items ({filteredItems.length})
          </button>
          <button
            onClick={() => setViewType('deleted')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              viewType === 'deleted'
                ? 'bg-editorial-red text-white'
                : 'bg-gray-200 dark:bg-zinc-700 text-editorial-black dark:text-white hover:bg-gray-300'
            }`}
          >
            Deleted Items ({allItems.filter(i => i.isDeleted).length})
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-6 border-b border-editorial-border">
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'comments'
                ? 'border-editorial-red text-editorial-red'
                : 'border-transparent text-editorial-muted hover:text-editorial-black dark:hover:text-white'
            }`}
          >
            Comments ({viewType === 'active' ? stats.activeComments : stats.deletedComments})
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'ratings'
                ? 'border-editorial-red text-editorial-red'
                : 'border-transparent text-editorial-muted hover:text-editorial-black dark:hover:text-white'
            }`}
          >
            Ratings ({viewType === 'active' ? stats.activeRatings : stats.deletedRatings})
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by author, article, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-editorial-border rounded bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-editorial-red"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-editorial-border rounded bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-editorial-red"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Author (A-Z)</option>
            <option value="name-desc">Author (Z-A)</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="card-editorial p-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="card-editorial p-12 text-center">
            <p className="text-editorial-muted text-lg">
              No {viewType} {activeTab} found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, idx) => (
              <div key={idx} className={`card-editorial p-6 border-l-4 ${viewType === 'active' ? 'border-editorial-red' : 'border-green-500'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                  {/* Article Title */}
                  <div>
                    <p className="text-xs font-semibold text-editorial-muted uppercase">Article</p>
                    <p className="font-medium text-sm mt-1 truncate">
                      {item.newsTitle}
                    </p>
                  </div>

                  {/* Author */}
                  <div>
                    <p className="text-xs font-semibold text-editorial-muted uppercase">Author</p>
                    <p className="font-medium text-sm mt-1">
                      {item.author}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs font-semibold text-editorial-muted uppercase">
                      {viewType === 'active' ? 'Posted' : 'Deleted'}
                    </p>
                    <p className="text-sm mt-1">
                      {new Date(viewType === 'active' ? item.createdAt : item.deletedAt).toLocaleDateString('en-IN')} <br/>
                      <span className="text-xs">
                        {new Date(viewType === 'active' ? item.createdAt : item.deletedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </p>
                  </div>

                  {/* Rating (if applicable) */}
                  {activeTab === 'ratings' && (
                    <div>
                      <p className="text-xs font-semibold text-editorial-muted uppercase">Rating</p>
                      <p className="text-sm mt-1">
                        {'⭐'.repeat(item.ratingValue)}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {viewType === 'active' ? (
                      <button
                        onClick={() => handleDelete(item.newsId, activeTab === 'comments' ? item.commentId : item.ratingId)}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium text-sm"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(item.newsId, activeTab === 'comments' ? item.commentId : item.ratingId)}
                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium text-sm"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded mb-4">
                  {activeTab === 'comments' ? (
                    <p className="text-sm text-editorial-ink dark:text-zinc-300 whitespace-pre-wrap break-words">
                      {item.text}
                    </p>
                  ) : (
                    <>
                      {item.feedback && (
                        <p className="text-sm text-editorial-ink dark:text-zinc-300 whitespace-pre-wrap break-words">
                          {item.feedback}
                        </p>
                      )}
                      {!item.feedback && (
                        <p className="text-sm text-editorial-muted italic">No feedback provided</p>
                      )}
                    </>
                  )}
                </div>

                {/* Deletion Reason (if deleted) */}
                {viewType === 'deleted' && item.deletedReason && (
                  <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase mb-1">
                      Deletion Reason
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {item.deletedReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ModerationDashboard;
