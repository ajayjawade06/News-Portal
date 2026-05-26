import { Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { IMAGE_BASE_URL } from '../config';

const NewsCard = ({ newsItem }) => {
  const { getNewsContent } = useNews();

  const title = getNewsContent(newsItem, 'title');
  const subHeading = getNewsContent(newsItem, 'subHeading');
  const content = getNewsContent(newsItem, 'content');
  const preview = content.length > 160 ? content.substring(0, 160) + '...' : content;
  const location = newsItem.location || newsItem.coverage || '';

  return (
    <article className="premium-card group relative">
      <Link to={`/news/${newsItem._id}`} className="block h-full">
        {newsItem.image && (
          <div className="aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              src={newsItem.image.startsWith('http') || newsItem.image.startsWith('data:') ? newsItem.image : `${IMAGE_BASE_URL}${newsItem.image}`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
        )}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="caption text-editorial-red">
              {location || 'News'}
            </span>
            <span className="text-zinc-400 text-[11px] font-sans uppercase tracking-wider">
              {new Date(newsItem.createdAt).toLocaleDateString('mr-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {newsItem.views !== undefined && (
              <span className="text-zinc-400 text-[11px] font-sans uppercase tracking-wider flex items-center gap-1">
                • 👁️ {newsItem.views.toLocaleString()} views
              </span>
            )}
          </div>
          <h2 className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-lg sm:text-xl leading-tight mb-2 line-clamp-2 group-hover:text-editorial-red transition-colors">
            {title}
          </h2>
          {subHeading && (
            <p className="subhead line-clamp-1 mb-2">
              {subHeading}
            </p>
          )}
          <p className="body-text text-editorial-muted dark:text-zinc-400 line-clamp-3 mb-4">
            {preview}
          </p>
          <span className="text-sm font-medium text-editorial-red hover:underline">
            Read full story
          </span>
        </div>
      </Link>
      <div className="px-5 sm:px-6 pb-4 pt-0 border-t border-editorial-border dark:border-zinc-800">
        <span className="text-caption text-editorial-muted dark:text-zinc-400">{newsItem.category}</span>
      </div>
    </article>
  );
};

export default NewsCard;
