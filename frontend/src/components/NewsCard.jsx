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
    <article className="card-editorial group">
      <Link to={`/news/${newsItem._id}`} className="block">
        {newsItem.image && (
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={`${IMAGE_BASE_URL}${newsItem.image}`}
              alt={title}
              className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-200"
            />
          </div>
        )}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="caption text-editorial-red">
              {location || 'News'}
            </span>
            <span className="text-editorial-muted dark:text-zinc-400 text-caption font-sans normal-case">
              {new Date(newsItem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
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
