import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useText } from '../hooks/useText';
import { useNews } from '../context/NewsContext';
import { useUserAuth } from '../context/UserAuthContext';
import AdRenderer from '../components/AdRenderer';
import NewsRating from '../components/NewsRating';
import BackButton from '../components/BackButton';
import api from '../utils/api';
import { IMAGE_BASE_URL } from '../config';

const NewsDetail = () => {
  const { id } = useParams();
  const backText = useText('Back');
  const homeText = useText('Home');
  const shareText = useText('Share');
  const { getNewsContent } = useNews();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // comment handling (no login, ask name on first post)
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const commentsLabel = useText('Comments');
  const noCommentsText = useText('No comments yet');
  const yourCommentLabel = useText('Your comment');
  const postCommentText = useText('Post');
  const namePromptText = useText('Please enter your name');
  const { user, isAuthenticated } = useUserAuth();

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        const item = response.data.data;
        setNewsItem(item);
        setComments(item.comments || []);
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
            {backText} to {homeText}
          </Link>
        </div>
      </main>
    );
  }

  const title = getNewsContent(newsItem, 'title');
  const subHeading = getNewsContent(newsItem, 'subHeading');
  const content = getNewsContent(newsItem, 'content');
  const location = newsItem.location || newsItem.coverage || '';

  const shareUrl = window.location.href;
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: subHeading || title,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard');
      });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!isAuthenticated) {
      alert('Please log in to post a comment');
      return;
    }

    try {
      const res = await api.post(`/news/${id}/comments`, { text: commentText });
      setComments(res.data.data);
      setCommentText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment');
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container-editorial py-8 lg:py-10 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <BackButton to="/" label="Home" />
          <button
            type="button"
            onClick={handleShare}
            className="text-sm font-medium text-editorial-red hover:underline"
          >
            {shareText}
          </button>
        </div>

        <article className="card-editorial">
          {newsItem.image && (
            <div className="aspect-video overflow-hidden">
              <img
                src={newsItem.image.startsWith('http') || newsItem.image.startsWith('data:') ? newsItem.image : `${IMAGE_BASE_URL}${newsItem.image}`}
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
                {new Date(newsItem.createdAt).toLocaleDateString('mr-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                {content.split('\n').map((paragraph, index) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;
                  return (
                    <div key={index} className="mb-4">
                      <p>{trimmed}</p>
                      {index > 0 && index % 3 === 0 && (
                        <div className="my-8 flex justify-center">
                          <AdRenderer placement="inline" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* bottom share button */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-editorial-red text-white font-medium rounded hover:bg-editorial-red-dark transition-colors"
              >
                {shareText}
              </button>
            </div>
          </div>
        </article>

        {/* comments section */}
        <section className="container-editorial max-w-3xl mt-10">
          <h2 className="text-xl font-semibold mb-4">{commentsLabel}</h2>
          {comments.filter(c => !c.isDeleted).length === 0 ? (
            <p className="text-editorial-muted mb-4">{noCommentsText}</p>
          ) : (
            <ul className="space-y-4 mb-6">
              {comments.filter(c => !c.isDeleted).map((c, idx) => (
                <li key={idx} className="border border-editorial-border p-4 rounded">
                  <p className="font-medium">
                    {c.name} 
                    <span className="text-xs text-editorial-muted block sm:inline sm:ml-2">
                      {new Date(c.createdAt).toLocaleDateString('mr-IN')} at {new Date(c.createdAt).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </p>
                  <p className="mt-2 whitespace-pre-line text-editorial-ink">{c.text}</p>
                </li>
              ))}
            </ul>
          )}

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-editorial-red text-white text-[10px] font-bold rounded-full flex items-center justify-center uppercase">
                  {user.firstName?.charAt(0)}
                </div>
                <span className="text-sm font-bold text-editorial-black dark:text-zinc-200">
                  {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                </span>
              </div>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                required
                rows={3}
                placeholder={yourCommentLabel}
                className="input-editorial w-full"
              />
              <button type="submit" className="btn-editorial">
                {postCommentText}
              </button>
            </form>
          ) : (
            <div className="bg-neutral-50 dark:bg-zinc-900 border border-editorial-border dark:border-zinc-800 p-6 text-center rounded">
              <p className="text-editorial-muted mb-4 text-sm font-medium">Please log in to participate in the conversation.</p>
              <Link to="/user/login" state={{ from: { pathname: `/news/${id}` } }} className="btn-editorial text-sm">
                Log in to Comment
              </Link>
            </div>
          )}
        </section>

        {/* news rating section */}
        <section className="container-editorial max-w-3xl mt-10">
          <NewsRating newsId={newsItem._id} />
        </section>

      </div>
    </main>
  );
};

export default NewsDetail;
