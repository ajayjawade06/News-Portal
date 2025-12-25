import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import api from '../utils/api';

/**
 * Latest News Sidebar Component
 * Displays the 5 most recent published news articles
 * 
 * For MCA Viva: This component demonstrates:
 * - Latest News: Shows 5 most recent published news (sorted by createdAt DESC)
 * - Difference from Trending: Latest shows newest articles, Trending shows most viewed
 * - Error handling: Gracefully handles API failures and empty states
 * 
 * Layout: This component is displayed on the LEFT sidebar
 */
const LatestNewsSidebar = () => {
  const { t } = useTranslation();
  const { getNewsContent } = useNews();
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch latest news (5 most recent published news)
        const response = await api.get('/news/latest');
        
        // Handle response - ensure data is always an array
        const newsData = response.data?.data || [];
        setLatestNews(Array.isArray(newsData) ? newsData : []);
      } catch (error) {
        // Log error but don't crash the UI
        console.error('Error fetching latest news:', error);
        setError('Failed to load latest news');
        setLatestNews([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
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
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <div className="w-full bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 border border-gray-100">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 flex items-center space-x-2">
        <span className="text-xl sm:text-2xl">📰</span>
        <span>Latest News</span>
      </h2>
      <p className="text-xs text-gray-500 mb-3 sm:mb-4 hidden sm:block">
        Most recently published articles
      </p>
      
      {loading ? (
        <div className="text-center py-3 sm:py-4">
          <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-3 sm:py-4">
          <p className="text-red-500 text-xs sm:text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-1 sm:mt-2">No latest news available</p>
        </div>
      ) : latestNews.length === 0 ? (
        <p className="text-gray-500 text-xs sm:text-sm text-center py-3 sm:py-4">No latest news available</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {latestNews.map((item) => {
            if (!item || !item._id) return null; // Safety check
            
            const title = getNewsContent(item, 'title');
            const subHeading = getNewsContent(item, 'subHeading');
            
            return (
              <Link
                key={item._id}
                to={`/news/${item._id}`}
                className="block group active:bg-gray-50 hover:bg-gray-50 p-2.5 sm:p-3 rounded-lg transition-colors duration-200 border-l-4 border-transparent group-hover:border-blue-500 touch-manipulation"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 active:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1 text-xs sm:text-sm leading-tight">
                  {title || 'Untitled'}
                </h3>
                {subHeading && (
                  <p className="text-xs text-gray-600 line-clamp-1 mb-1.5 sm:mb-2">
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
  );
};

export default LatestNewsSidebar;

