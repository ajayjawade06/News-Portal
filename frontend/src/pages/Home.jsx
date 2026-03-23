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
import { IMAGE_BASE_URL } from '../config';
import FeaturedCarousel from '../components/FeaturedCarousel';


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
  const { news, loading, error, fetchNews, getNewsContent } = useNews();

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
              <div className="flex flex-col gap-10">
                {/* HERO SECTION - Carousel */}
                {(() => {
                  const manuallyFeatured = news.filter(n => n.isFeatured);
                  const remainingNeeded = 5 - manuallyFeatured.length;
                  const fallbackNews = news.filter(n => !n.isFeatured).slice(0, Math.max(0, remainingNeeded));
                  const featuredForCarousel = [...manuallyFeatured, ...fallbackNews].slice(0, 5);
                  const featuredIds = new Set(featuredForCarousel.map(n => n._id));
                  const gridNews = news.filter(n => !featuredIds.has(n._id)).slice(0, 12);

                  return (
                    <>
                      <FeaturedCarousel featuredNews={featuredForCarousel} />
                      {/* GRID SECTION */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gridNews.map((item, index) => (
                          <div key={item._id} className="contents relative">
                            <div className="animate-fade-in h-full" style={{ animationDelay: `${Math.min((index + 1) * 0.04, 0.25)}s` }}>
                              <NewsCard newsItem={item} />
                            </div>
                            {/* Inject Ad after every 3 items (at index 2, 5, 8) */}
                            {(index + 1) % 3 === 0 && index !== gridNews.length - 1 && (
                              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center my-4 animate-fade-in">
                                <AdRenderer placement="in-feed" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* VIEW MORE BUTTON */}
                      {news.length > 17 && (
                        <div className="flex justify-center mt-12 pb-4">
                          <Link 
                            to="/category/All" 
                            className="btn-editorial-outline px-10 py-3 text-base flex items-center gap-2 group hover:gap-4 transition-all duration-300"
                          >
                            View More News
                            <span className="text-xl">→</span>
                          </Link>
                        </div>
                      )}
                    </>
                  );
                })()}
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
      </div>
    </main>
  );
};

export default Home;
