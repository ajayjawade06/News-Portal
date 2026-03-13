import { useState, useEffect } from 'react';
import api from '../utils/api';

const NewsRating = ({ newsId }) => {
  const [ratings, setRatings] = useState([]);
  const [aggregateRating, setAggregateRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch ratings
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get(`/news/${newsId}/ratings`);
        setRatings(response.data.data.ratings || []);
        setAggregateRating(response.data.data.aggregateRating || {});
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [newsId]);

  // Submit rating
  const handleSubmitRating = async (e) => {
    e.preventDefault();

    if (!selectedRating || !name.trim()) {
      alert('Please select a rating and enter your name');
      return;
    }

    try {
      const response = await api.post(`/news/${newsId}/ratings`, {
        ratingValue: selectedRating,
        feedback: feedback.trim(),
        name: name.trim(),
        email: email.trim()
      });

      if (response.data.success) {
        setRatings([...ratings, response.data.data.rating]);
        setAggregateRating(response.data.data.aggregateRating);
        setSelectedRating(0);
        setFeedback('');
        setName('');
        setEmail('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading ratings...</div>;
  }

  return (
    <section className="mt-12 bg-neutral-50 dark:bg-zinc-900 rounded-lg p-8">
      <h2 className="text-2xl font-serif font-bold mb-6 text-editorial-black dark:text-zinc-100">
        Article Rating & Feedback
      </h2>

      {/* Aggregate Rating Display */}
      {aggregateRating?.totalRatings > 0 ? (
        <div className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-lg border border-editorial-border dark:border-zinc-700">
          <div className="flex items-baseline gap-4 mb-6">
            <div className="text-6xl font-bold text-editorial-red">
              {aggregateRating.averageRating}
            </div>
            <div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < Math.round(aggregateRating.averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-editorial-muted mt-1">
                Based on {aggregateRating.totalRatings} rating{aggregateRating.totalRatings !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count =
                aggregateRating.ratingBreakdown?.[
                  stars === 5 ? 'fiveStar' : stars === 4 ? 'fourStar' : stars === 3 ? 'threeStar' : stars === 2 ? 'twoStar' : 'oneStar'
                ] || 0;
              const percentage =
                aggregateRating.totalRatings > 0
                  ? Math.round((count / aggregateRating.totalRatings) * 100)
                  : 0;

              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">
                    {stars}★
                  </span>
                  <div className="flex-1 lg:max-w-xs bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-editorial-muted w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-lg text-center text-editorial-muted">
          Be the first to rate this article!
        </div>
      )}

      {/* Submit Rating Form */}
      <div className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-lg border border-editorial-border dark:border-zinc-700">
        <h3 className="font-semibold text-lg mb-4">Share Your Rating</h3>

        <form onSubmit={handleSubmitRating} className="space-y-4">
          {/* Star Rating Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Rate this article</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  className="text-4xl transition-colors"
                >
                  <span
                    className={`${
                      star <= selectedRating
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            {selectedRating > 0 && (
              <p className="text-sm text-editorial-red mt-1">
                You selected {selectedRating} star{selectedRating !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-editorial-border dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-editorial-black dark:text-zinc-100"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-editorial-border dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-editorial-black dark:text-zinc-100"
            />
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium mb-1">Your Feedback (optional)</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts about this article..."
              maxLength={500}
              rows="4"
              className="w-full px-3 py-2 border border-editorial-border dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-editorial-black dark:text-zinc-100"
            />
            <p className="text-xs text-editorial-muted mt-1">
              {feedback.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-editorial-red text-white font-medium py-2 rounded hover:bg-editorial-red-dark transition-colors"
          >
            Submit Rating
          </button>

          {submitted && (
            <div className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm">
              ✓ Thank you for rating this article!
            </div>
          )}
        </form>
      </div>

      {/* Ratings List */}
      {ratings.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Reader Reviews</h3>
          <div className="space-y-4">
            {ratings.map((rating, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border bg-white dark:bg-zinc-800 border-editorial-border dark:border-zinc-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-editorial-black dark:text-zinc-100">
                        {rating.name}
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < rating.ratingValue
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-editorial-muted">
                      {new Date(rating.createdAt).toLocaleDateString('en-IN')} at {new Date(rating.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {rating.feedback && (
                  <p className="text-sm text-editorial-ink dark:text-zinc-300 mt-2">
                    {rating.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsRating;
