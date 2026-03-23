import { useEffect } from 'react';
import { useText } from '../hooks/useText';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';
import TrendingNewsSidebar from '../components/TrendingNewsSidebar';
import AdRenderer from '../components/AdRenderer';
import BackButton from '../components/BackButton';

const International = () => {
  const titleText = useText('International News');
  const noNewsText = useText('No news available');
  const allNewsText = useText('All news');
  const { news, loading, error, fetchNews } = useNews();

  useEffect(() => {
    fetchNews('international');
  }, []);

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
        <h1 className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-2xl sm:text-3xl border-b-2 border-editorial-red pb-2 mb-8">
          {titleText}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <section className="lg:col-span-8">
            {news.length === 0 ? (
              <div className="card-editorial p-12 text-center">
                <p className="text-editorial-muted">{noNewsText}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
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
          </section>
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              <AdRenderer placement="sidebar" />
              <TrendingNewsSidebar />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default International;
