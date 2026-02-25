import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';
import api from '../utils/api';
import { IMAGE_BASE_URL } from '../config';

const NewsDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
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
      <main className="min-h-[50vh] flex items-center justify-center py-20 bg-white dark:bg-zinc-950">
        <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !newsItem) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center py-20 bg-white dark:bg-zinc-950">
        <div className="card-editorial p-10 max-w-md text-center">
          <p className="font-medium text-editorial-red-dark mb-6">{error || 'Article not found'}</p>
          <Link to="/" className="btn-editorial">
            {t('common.back')} to {t('nav.home')}
          </Link>
        </div>
      </main>
    );
  }

  const title = getNewsContent(newsItem, 'title');
  const subHeading = getNewsContent(newsItem, 'subHeading');
  const content = getNewsContent(newsItem, 'content');
  const location = newsItem.location || newsItem.coverage || '';

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container-editorial py-8 lg:py-10 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-editorial-muted hover:text-editorial-red font-medium mb-8 transition-colors"
        >
          <span>&#8592;</span>
          {t('common.back')}
        </Link>

        <article className="card-editorial">
          {newsItem.image && (
            <div className="aspect-video overflow-hidden">
              <img
                src={`${IMAGE_BASE_URL}${newsItem.image}`}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="caption text-editorial-red">{location || 'News'}</span>
              <span className="caption text-editorial-muted">{newsItem.category}</span>
              {newsItem.views !== undefined && (
                <span className="caption text-editorial-muted">{newsItem.views || 0} views</span>
              )}
              <span className="caption text-editorial-muted">
                {new Date(newsItem.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 className="font-serif font-bold text-editorial-black text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4">
              {title}
            </h1>
            {subHeading && (
              <p className="font-sans text-lg text-editorial-muted font-medium italic border-l-4 border-editorial-red pl-4 mb-6">
                {subHeading}
              </p>
            )}

            <div className="body-text prose prose-neutral max-w-none">
              <div className="text-editorial-ink leading-relaxed whitespace-pre-line space-y-4">
                {content.split('\n').map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    )
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};

export default NewsDetail;
