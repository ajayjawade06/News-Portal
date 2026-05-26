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
    return date.toLocaleDateString('mr-IN', { month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
};

const Sidebar = () => {
  const { getNewsContent } = useNews();
  const [latestNews, setLatestNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarNews = async () => {
      try {
        setLoading(true);
        const [latestRes, trendingRes] = await Promise.all([
          api.get('/news/latest'),
          api.get('/news/trending'),
        ]);
        setLatestNews(latestRes.data.data || []);
        setTrendingNews(trendingRes.data.data || []);
      } catch (err) {
        console.error('Error fetching sidebar news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSidebarNews();
  }, []);

  return (
    <div className="w-full lg:w-80 space-y-6">
      <div className="card-editorial p-5">
        <h2 className="font-serif font-bold text-editorial-black text-lg border-b-2 border-editorial-red pb-2 mb-4">
          Latest
        </h2>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
          </div>
        ) : latestNews.length === 0 ? (
          <p className="text-sm text-editorial-muted">No latest news</p>
        ) : (
          <ul className="space-y-0 divide-y divide-editorial-border">
            {latestNews.map((item) => {
              if (!item?._id) return null;
              const title = getNewsContent(item, 'title');
              return (
                <li key={item._id}>
                  <Link to={`/news/${item._id}`} className="block py-4 hover:bg-editorial-red-muted transition-colors -mx-2 px-2">
                    <h3 className="font-serif font-semibold text-editorial-black text-sm line-clamp-2 hover:text-editorial-red transition-colors">{title || 'Untitled'}</h3>
                    <p className="caption text-editorial-muted mt-1">{formatDate(item.createdAt)}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="card-editorial p-5">
        <h2 className="font-serif font-bold text-editorial-black text-lg border-b-2 border-editorial-red pb-2 mb-4">
          Trending
        </h2>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
          </div>
        ) : trendingNews.length === 0 ? (
          <p className="text-sm text-editorial-muted">No trending news</p>
        ) : (
          <ul className="space-y-0 divide-y divide-editorial-border">
            {trendingNews.map((item, index) => {
              if (!item?._id) return null;
              const title = getNewsContent(item, 'title');
              const views = typeof item.views === 'number' ? item.views : 0;
              return (
                <li key={item._id}>
                  <Link to={`/news/${item._id}`} className="block py-4 hover:bg-editorial-red-muted transition-colors -mx-2 px-2">
                    <div className="flex gap-2">
                      <span className="font-serif font-bold text-editorial-red text-sm shrink-0">{index + 1}.</span>
                      <h3 className="font-serif font-semibold text-editorial-black text-sm line-clamp-2 hover:text-editorial-red transition-colors">{title || 'Untitled'}</h3>
                    </div>
                    <p className="caption text-editorial-muted mt-1 ml-4">{views} views · {formatDate(item.createdAt)}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
