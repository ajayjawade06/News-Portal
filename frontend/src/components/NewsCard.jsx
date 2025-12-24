import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import { IMAGE_BASE_URL } from '../config';

const NewsCard = ({ newsItem }) => {
  const { i18n } = useTranslation(); // Subscribe to language changes for re-render
  const { getNewsContent } = useNews();

  const title = getNewsContent(newsItem, 'title');
  const content = getNewsContent(newsItem, 'content');
  const preview = content.length > 150 ? content.substring(0, 150) + '...' : content;

  const coverageColors = {
    local: 'bg-green-100 text-green-800 border-green-300',
    national: 'bg-blue-100 text-blue-800 border-blue-300',
    international: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
      {newsItem.image && (
        <div className="relative overflow-hidden h-56">
          <img
            src={`${IMAGE_BASE_URL}${newsItem.image}`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${coverageColors[newsItem.coverage] || 'bg-gray-100 text-gray-800'}`}>
            {newsItem.coverage}
          </span>
          <span className="text-xs text-gray-500 flex items-center space-x-1">
            <span>📅</span>
            <span>{new Date(newsItem.createdAt).toLocaleDateString()}</span>
          </span>
        </div>
        <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{preview}</p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
            {newsItem.category}
          </span>
          <Link
            to={`/news/${newsItem._id}`}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 group-hover:space-x-2 transition-all duration-200"
          >
            <span>Read More</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;

