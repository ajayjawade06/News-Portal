import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import api from '../utils/api';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
};

const LatestNewsSidebar = () => {
  const { getNewsContent } = useNews();
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/news/latest');
        const data = response.data?.data || [];
        setLatestNews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching latest news:', err);
        setError('Failed to load');
        setLatestNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();
  }, []);

  return (
    <aside className="card-editorial p-5">
      <h2 className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-lg border-b-2 border-editorial-red pb-2 mb-4">
        Latest
      </h2>
      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-sm text-editorial-muted py-4">{error}</p>
      ) : latestNews.length === 0 ? (
        <p className="text-sm text-editorial-muted py-4">No recent articles</p>
      ) : (
        <ul className="space-y-0 divide-y divide-editorial-border">
          {latestNews.map((item) => {
            if (!item?._id) return null;
            const title = getNewsContent(item, 'title');
            return (
              <li key={item._id}>
                <Link
                  to={`/news/${item._id}`}
                  className="block py-4 hover:bg-editorial-red-muted dark:hover:bg-red-950/30 transition-colors -mx-2 px-2"
                >
                  <h3 className="font-serif font-semibold text-editorial-black dark:text-zinc-200 text-sm leading-snug line-clamp-2 hover:text-editorial-red transition-colors">
                    {title || 'Untitled'}
                  </h3>
                  <p className="text-caption text-editorial-muted dark:text-zinc-400 mt-1">{formatDate(item.createdAt)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
};

export default LatestNewsSidebar;
