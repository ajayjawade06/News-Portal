import { useEffect, useMemo } from 'react';
import { useText } from '../hooks/useText';
import { useLiveTranslation } from '../hooks/useLiveTranslation';
import { useNews } from '../context/NewsContext';
import { useParams, Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import AdRenderer from '../components/AdRenderer';
import BackButton from '../components/BackButton';

const CategoryPage = () => {
  const noNewsText = useText('No news available');
  const homeTitle = useText('Latest News');
  const categoryLabel = useText('Category');
  const allNewsText = useText('All news');
  const { news, loading, error, fetchNews } = useNews();
  const { category } = useParams();
  const translatedCategory = useLiveTranslation(category, 'en');

  useEffect(() => {
    // fetch all news on mount (if not already fetched)
    if (!news.length) {
      fetchNews();
    }
  }, []);

  const filtered = useMemo(() => {
    if (!category) return [];
    const isAll = category.toLowerCase() === 'all';
    if (isAll) return news;
    return news.filter(item =>
      item.category &&
      item.category.toLowerCase() === category.toLowerCase()
    );
  }, [news, category]);

  if (loading) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container-editorial py-12">
        <div className="border border-editorial-red bg-editorial-red-muted text-editorial-red-dark px-6 py-4">
          <p className="font-medium">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container-editorial py-8 lg:py-10">
        <div className="mb-6">
          <BackButton to="/" label={allNewsText} />
        </div>
        <h1 className="font-serif font-bold text-editorial-black text-2xl sm:text-3xl mb-8">
          {category.toLowerCase() === 'all' ? allNewsText : `${categoryLabel} : ${translatedCategory}`}
        </h1>
        {filtered.length === 0 ? (
          <div className="card-editorial p-12 text-center">
            <p className="text-editorial-muted">{noNewsText}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, index) => (
              <div key={item._id} className="contents relative">
                <NewsCard newsItem={item} />
                {(index + 1) % 3 === 0 && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center my-4 animate-fade-in">
                    <AdRenderer placement="in-feed" />
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

export default CategoryPage;
