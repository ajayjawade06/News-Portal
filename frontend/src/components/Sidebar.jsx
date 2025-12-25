import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import api from '../utils/api';

/**
 * Sidebar Component
 * Displays Latest News and Trending News sections
 * 
 * For MCA Viva: This component demonstrates:
 * - Latest News: Shows 5 most recent published news (sorted by createdAt DESC)
 * - Trending News: Shows top 5 news with highest views count
 * - How trending news works: Articles with most views are considered most trending
 *   This helps readers discover popular content that others are reading
 */
const Sidebar = () => {
  const { t } = useTranslation();
  const { getNewsContent } = useNews();
  const [latestNews, setLatestNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarNews = async () => {
      try {
        setLoading(true);
        // Fetch latest news (5 most recent published news)
        const latestResponse = await api.get('/news/latest');
        setLatestNews(latestResponse.data.data || []);

        // Fetch trending news (top 5 by views)
        const trendingResponse = await api.get('/news/trending');
        setTrendingNews(trendingResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching sidebar news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Latest News Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <span>📰</span>
          <span>Latest News</span>
        </h2>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : latestNews.length === 0 ? (
          <p className="text-gray-500 text-sm">No latest news available</p>
        ) : (
          <div className="space-y-4">
            {latestNews.map((item) => {
              const title = getNewsContent(item, 'title');
              const subHeading = getNewsContent(item, 'subHeading');
              return (
                <Link
                  key={item._id}
                  to={`/news/${item._id}`}
                  className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200 border-l-4 border-transparent group-hover:border-blue-500"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
                    {title}
                  </h3>
                  {subHeading && (
                    <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                      {subHeading}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <span>🕐</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Trending News Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <span>🔥</span>
          <span>Trending News</span>
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Most viewed articles - Discover what others are reading
        </p>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : trendingNews.length === 0 ? (
          <p className="text-gray-500 text-sm">No trending news available</p>
        ) : (
          <div className="space-y-4">
            {trendingNews.map((item, index) => {
              const title = getNewsContent(item, 'title');
              const subHeading = getNewsContent(item, 'subHeading');
              return (
                <Link
                  key={item._id}
                  to={`/news/${item._id}`}
                  className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200 border-l-4 border-transparent group-hover:border-orange-500"
                >
                  <div className="flex items-start space-x-2 mb-1">
                    <span className="text-lg font-bold text-orange-500 flex-shrink-0">
                      #{index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2 flex-1">
                      {title}
                    </h3>
                  </div>
                  {subHeading && (
                    <p className="text-sm text-gray-600 line-clamp-1 mb-2 ml-7">
                      {subHeading}
                    </p>
                  )}
                  <div className="flex items-center justify-between ml-7">
                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <span>👁️</span>
                      <span>{item.views || 0} views</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

