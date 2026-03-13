import { useEffect } from 'react';
import { useText } from '../hooks/useText';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';
import TrendingNewsSidebar from '../components/TrendingNewsSidebar';
import ReporterHighlight from '../components/ReporterHighlight';
import AdBanner from '../components/AdBanner';

const Chandrapur = () => {
  const titleText = useText('Chandrapur Latest News');
  const noNewsText = useText('No news available');
  const { news, loading, error, fetchNews } = useNews();

  useEffect(() => {
    fetchNews('chandrapur');
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
      <div className="container-editorial py-4">
        <div className="flex justify-center mb-6">
          <AdBanner type="horizontal" adIndex={6} />
        </div>
      </div>
      <div className="container-editorial py-8 lg:py-10">
        <h1 className="font-serif font-bold text-editorial-black text-2xl sm:text-3xl border-b-2 border-editorial-red pb-2 mb-8">
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
                {news.map((item) => (
                  <NewsCard key={item._id} newsItem={item} />
                ))}
              </div>
            )}
          </section>
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              <ReporterHighlight  />
              <AdBanner type="vertical" adIndex={6} />
              <TrendingNewsSidebar />
            </div>
          </aside>
        </div>
        <div className="mt-12 flex justify-center">
          <AdBanner type="horizontal" adIndex={7} />
        </div>
      </div>
    </main>
  );
};

export default Chandrapur;
