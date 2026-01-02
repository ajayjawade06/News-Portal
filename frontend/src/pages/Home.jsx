import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';
import LatestNewsSidebar from '../components/LatestNewsSidebar';
import TrendingNewsSidebar from '../components/TrendingNewsSidebar';
import AdSlot from '../components/AdSlot';

const Home = () => {
  const { t } = useTranslation();
  const { news, loading, error, fetchNews } = useNews();

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Top Banner Ad */}
      <div className="container mx-auto px-3 sm:px-4 py-4">
        <AdSlot position="top-banner" page="home" className="h-32 mb-4" />
      </div>

      {/* Mobile-First Layout: Stack vertically on mobile, 3 columns on desktop */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-8">
        {/* 
          Mobile-First Responsive Design:
          - Mobile (< 640px): Single column, sidebars stack above main content
          - Tablet (640px+): Main content full width, sidebars below
          - Desktop (1024px+): 3 columns (Latest | Main | Trending)
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* LEFT SIDEBAR: Latest News - Mobile: Full width, Desktop: 3 columns */}
          <aside className="w-full lg:col-span-3 order-1">
            <div className="lg:sticky lg:top-20 lg:h-fit">
              <LatestNewsSidebar />
            </div>
          </aside>

          {/* CENTER: Main News Grid - Mobile: Full width, Desktop: 6 columns */}
          <main className="w-full lg:col-span-6 order-2 flex-1">
            {news.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg">
                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📰</div>
                <p className="text-gray-600 text-lg sm:text-xl px-4">{t('home.noNews')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {news.map((item, index) => (
                  <div
                    key={item._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <NewsCard newsItem={item} />
                    {/* Inline Ad after every 4 news cards */}
                    {(index + 1) % 4 === 0 && (index + 1) < news.length && (
                      <div className="mt-4">
                        <AdSlot position="inline" page="home" className="h-24" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* RIGHT SIDEBAR: Trending News - Mobile: Full width, Desktop: 3 columns */}
          <aside className="w-full lg:col-span-3 order-3">
            <div className="lg:sticky lg:top-20 lg:h-fit">
              <TrendingNewsSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;

