import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import LatestNewsSidebar from '../components/LatestNewsSidebar';
import TrendingNewsSidebar from '../components/TrendingNewsSidebar';
import ReporterHighlight from '../components/ReporterHighlight';

const Home = () => {
  const { t } = useTranslation();
  const { news, loading, error, fetchNews } = useNews();

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin mx-auto mb-4" />
          <p className="text-editorial-muted text-sm">{t('common.loading')}</p>
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <section className="lg:col-span-8 order-2 lg:order-1">
            {news.length === 0 ? (
              <div className="card-editorial p-16 text-center">
                <p className="font-serif text-xl text-editorial-muted">{t('home.noNews')}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {news.map((item, index) => (
                  <div key={item._id}>
                    <div className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 0.04, 0.25)}s` }}>
                      <NewsCard newsItem={item} />
                    </div>
                    {(index + 1) % 3 === 0 && index !== news.length - 1 && (
                      <div className="flex justify-center py-4">
                        <AdBanner type="vertical" adIndex={index} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="lg:col-span-4 order-1 lg:order-2 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8">
              <LatestNewsSidebar />
              <ReporterHighlight />
              <TrendingNewsSidebar />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Home;
