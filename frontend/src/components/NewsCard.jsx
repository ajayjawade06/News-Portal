import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import { IMAGE_BASE_URL } from '../config';

const NewsCard = ({ newsItem }) => {
  const { i18n } = useTranslation(); // Subscribe to language changes for re-render
  const { getNewsContent } = useNews();

  const title = getNewsContent(newsItem, 'title');
  const subHeading = getNewsContent(newsItem, 'subHeading');
  const content = getNewsContent(newsItem, 'content');
  const preview = content.length > 150 ? content.substring(0, 150) + '...' : content;

  // Location-based colors (replaces old coverage colors)
  const locationColors = {
    maharashtra: 'bg-blue-100 text-blue-800 border-blue-300',
    chandrapur: 'bg-green-100 text-green-800 border-green-300',
    korpana: 'bg-purple-100 text-purple-800 border-purple-300',
    rajura: 'bg-orange-100 text-orange-800 border-orange-300'
  };

  // Support both location (new) and coverage (old) for backward compatibility
  const location = newsItem.location || newsItem.coverage || '';

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden active:shadow-lg sm:hover:shadow-2xl transition-all duration-300 sm:transform sm:hover:-translate-y-1 border border-gray-100 group touch-manipulation">
      {newsItem.image && (
        <div className="relative overflow-hidden h-48 sm:h-56">
          <img
            src={`${IMAGE_BASE_URL}${newsItem.image}`}
            alt={title}
            className="w-full h-full object-cover sm:group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3 flex-wrap gap-2">
          <span className={`text-xs font-bold uppercase px-2 sm:px-3 py-1 rounded-full border ${locationColors[location] || 'bg-gray-100 text-gray-800'}`}>
            {location}
          </span>
          <span className="text-xs text-gray-500 flex items-center space-x-1">
            <span>📅</span>
            <span className="whitespace-nowrap">{new Date(newsItem.createdAt).toLocaleDateString()}</span>
          </span>
        </div>
        <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 active:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
          {title}
        </h2>
        {subHeading && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-1 italic">
            {subHeading}
          </p>
        )}
        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3 leading-relaxed">{preview}</p>
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 flex-wrap gap-2">
          <span className="text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 px-2 sm:px-3 py-1 rounded-full">
            {newsItem.category}
          </span>
          <Link
            to={`/news/${newsItem._id}`}
            className="text-blue-600 active:text-blue-700 sm:hover:text-blue-700 font-semibold flex items-center space-x-1 sm:group-hover:space-x-2 transition-all duration-200 text-sm sm:text-base touch-manipulation"
          >
            <span>Read More</span>
            <span className="transform sm:group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;

