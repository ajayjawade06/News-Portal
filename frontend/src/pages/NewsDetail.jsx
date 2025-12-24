import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import api from '../utils/api';
import { IMAGE_BASE_URL } from '../config';

const NewsDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation(); // Subscribe to language changes for re-render
  const { getNewsContent } = useNews();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        setNewsItem(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-600 text-xl font-semibold mb-4">{error || 'News not found'}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            {t('common.back')} {t('nav.home')}
          </Link>
        </div>
      </div>
    );
  }

  const title = getNewsContent(newsItem, 'title');
  const content = getNewsContent(newsItem, 'content');

  const coverageColors = {
    local: 'bg-green-100 text-green-800 border-green-300',
    national: 'bg-blue-100 text-blue-800 border-blue-300',
    international: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors duration-200 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span>{t('common.back')}</span>
        </Link>

        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {newsItem.image && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={`${IMAGE_BASE_URL}${newsItem.image}`}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase border ${coverageColors[newsItem.coverage] || 'bg-gray-100 text-gray-800'}`}>
                  {newsItem.coverage}
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                  {newsItem.category}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <span>📅</span>
                <span className="text-sm font-medium">
                  {new Date(newsItem.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 leading-tight">
              {title}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-line space-y-4">
                {content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4">{paragraph}</p>
                  )
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;

