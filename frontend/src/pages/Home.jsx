import { useEffect } from 'react';
import { useText } from '../hooks/useText';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';
import LatestNewsSidebar from '../components/LatestNewsSidebar';
import TrendingNewsSidebar from '../components/TrendingNewsSidebar';
import ReporterHighlight from '../components/ReporterHighlight';
import AdRenderer from '../components/AdRenderer';
import { Link } from 'react-router-dom';
import { useLiveTranslation } from '../hooks/useLiveTranslation';


// small component that translates a single category label
const CategoryLink = ({ category }) => {
  const tCat = useLiveTranslation(category, 'en');
  return (
    <Link
      to={`/category/${encodeURIComponent(category)}`}
      className="text-sm px-3 py-1 border border-editorial-red rounded hover:bg-editorial-red-muted transition-colors"
    >
      {tCat}
    </Link>
  );
};

const Home = () => {
  const loadingText = useText('Loading...');
  const categoryLabel = useText('Category');
  const noNewsText = useText('No news available');
  const { news, loading, error, fetchNews } = useNews();

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin mx-auto mb-4" />
          <p className="text-editorial-muted text-sm">{loadingText}</p>
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
      <div className="container-editorial py-4">
        <div className="flex justify-center mb-6">
          <AdRenderer placement="header" />
        </div>
      </div>
      <div className="container-editorial py-8 lg:py-10">
        {/* category links */}
        {news.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif font-semibold text-editorial-black mb-4">{categoryLabel}</h2>
            <div className="flex flex-wrap gap-3">
              {[...new Set(news.map(n => n.category).filter(Boolean))].map(cat => (
                <CategoryLink key={cat} category={cat} />
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <section className="lg:col-span-8 order-2 lg:order-1">
            {news.length === 0 ? (
              <div className="card-editorial p-16 text-center">
                <p className="font-serif text-xl text-editorial-muted">{noNewsText}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item, index) => (
                  <div key={item._id} className="contents relative">
                    <div className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 0.04, 0.25)}s` }}>
                      <NewsCard newsItem={item} />
                    </div>
                    {/* Inject Ad after every 3 items */}
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

          <aside className="lg:col-span-4 order-1 lg:order-2 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8">
              <LatestNewsSidebar />
              <AdRenderer placement="sidebar" />
              <ReporterHighlight />
              <TrendingNewsSidebar />
            </div>
          </aside>
        </div>
        <div className="mt-12 flex justify-center">
          <AdRenderer placement="footer" />
        </div>
      </div>
    </main>
  );
};

export default Home;
