import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import api from '../utils/api';
import AdSlot from './AdSlot';

/**
 * Trending News Sidebar Component
 * Displays the top 5 most viewed published news articles
 * 
 * For MCA Viva: This component demonstrates:
 * - Trending News: Shows top 5 news with highest views count
 * - Difference from Latest: Trending shows most viewed, Latest shows newest
 * - How trending works: Articles with most views are considered most trending
 *   This helps readers discover popular content that others are reading
 * - Error handling: Gracefully handles API failures and empty states
 * 
 * Layout: This component is displayed on the RIGHT sidebar
 */
const TrendingNewsSidebar = () => {
  const { t } = useTranslation();
  const { getNewsContent } = useNews();
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch trending news (top 5 by views)
        const response = await api.get('/news/trending');
        
        // Handle response - ensure data is always an array
        const newsData = response.data?.data || [];
        setTrendingNews(Array.isArray(newsData) ? newsData : []);
      } catch (error) {
        // Log error but don't crash the UI
        console.error('Error fetching trending news:', error);
        setError('Failed to load trending news');
        setTrendingNews([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingNews();
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
        <span className="text-xl sm:text-2xl">🔥</span>
        <span>Trending News</span>
      </h2>
      <p className="text-xs text-gray-500 mb-3 sm:mb-4 hidden sm:block">
        Most viewed articles - Discover what others are reading
      </p>
      
      {loading ? (
        <div className="text-center py-3 sm:py-4">
          <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-t-2 border-b-2 border-orange-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-3 sm:py-4">
          <p className="text-red-500 text-xs sm:text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-1 sm:mt-2">No trending news available</p>
        </div>
      ) : trendingNews.length === 0 ? (
        <p className="text-gray-500 text-xs sm:text-sm text-center py-3 sm:py-4">No trending news available</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {trendingNews.map((item, index) => {
            if (!item || !item._id) return null; // Safety check
            
            const title = getNewsContent(item, 'title');
            const subHeading = getNewsContent(item, 'subHeading');
            // Ensure views is always a number (handle undefined/null)
            const views = typeof item.views === 'number' ? item.views : 0;
            
            return (
              <Link
                key={item._id}
                to={`/news/${item._id}`}
                className="block group active:bg-gray-50 hover:bg-gray-50 p-2.5 sm:p-3 rounded-lg transition-colors duration-200 border-l-4 border-transparent group-hover:border-orange-500 touch-manipulation"
              >
                <div className="flex items-start space-x-2 mb-1">
                  <span className="text-base sm:text-lg font-bold text-orange-500 flex-shrink-0">
                    #{index + 1}
                  </span>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 active:text-orange-600 transition-colors duration-200 line-clamp-2 flex-1 text-xs sm:text-sm leading-tight">
                    {title || 'Untitled'}
                  </h3>
                </div>
                {subHeading && (
                  <p className="text-xs text-gray-600 line-clamp-1 mb-1.5 sm:mb-2 ml-6 sm:ml-7">
                    {subHeading}
                  </p>
                )}
                <div className="flex items-center justify-between ml-6 sm:ml-7">
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <span>👁️</span>
                    <span>{views} views</span>
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
      
      {/* Sidebar Ad */}
      <div className="mt-4">
        <AdSlot position="sidebar" page="home" className="h-48" />
      </div>
    </div>
  );
};

export default TrendingNewsSidebar;

