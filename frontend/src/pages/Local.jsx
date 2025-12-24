import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';

const Local = () => {
  const { t } = useTranslation();
  const { news, loading, error, fetchNews } = useNews();

  useEffect(() => {
    fetchNews('local');
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('nav.local')} {t('home.title')}</h1>
      
      {news.length === 0 ? (
        <p className="text-gray-600 text-center py-8">{t('home.noNews')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard key={item._id} newsItem={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Local;

