import { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useText } from '../hooks/useText';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout } = useUserAuth();
  const [activeTab, setActiveTab] = useState('ads');
  const [ads, setAds] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const profileTitle = useText('My Profile');
  const adsTab = useText('My Ad Bookings');
  const commentsTab = useText('My Comments');
  const noAdsText = useText('You haven\'t booked any ads yet.');
  const noCommentsText = useText('You haven\'t posted any comments yet.');
  const logoutText = useText('Sign Out');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [adsRes, commentsRes] = await Promise.all([
          api.get('/bookings/my-bookings'),
          api.get('/news/user/my-comments')
        ]);
        setAds(adsRes.data.data || []);
        setComments(commentsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-zinc-950 py-12 px-6">
      <div className="container-editorial max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="font-serif font-bold text-3xl text-editorial-black dark:text-zinc-100">{profileTitle}</h1>
            <p className="text-editorial-muted dark:text-zinc-400">Welcome back, {user.firstName} {user.lastName}</p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 border border-editorial-red text-editorial-red hover:bg-editorial-red hover:text-white transition-colors text-sm font-bold rounded"
          >
            {logoutText}
          </button>
        </div>

        <div className="card-editorial overflow-hidden">
          <div className="flex border-b border-editorial-border dark:border-zinc-800">
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-4 text-sm font-bold transition-colors ${
                activeTab === 'ads' 
                ? 'text-editorial-red border-b-2 border-editorial-red bg-white dark:bg-zinc-900' 
                : 'text-editorial-muted hover:text-editorial-black dark:hover:text-zinc-200'
              }`}
            >
              {adsTab} ({ads.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-4 text-sm font-bold transition-colors ${
                activeTab === 'comments' 
                ? 'text-editorial-red border-b-2 border-editorial-red bg-white dark:bg-zinc-900' 
                : 'text-editorial-muted hover:text-editorial-black dark:hover:text-zinc-200'
              }`}
            >
              {commentsTab} ({comments.length})
            </button>
          </div>

          <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-editorial-red border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {activeTab === 'ads' && (
                  <div className="space-y-4">
                    {ads.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-editorial-muted mb-6">{noAdsText}</p>
                        <Link to="/advertising" className="btn-editorial">Book an Ad</Link>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-editorial-border dark:border-zinc-800 text-editorial-muted uppercase tracking-wider text-xs">
                              <th className="py-3 px-4">Booking ID</th>
                              <th className="py-3 px-4">Plan / Placement</th>
                              <th className="py-3 px-4">Dates</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-editorial-border dark:divide-zinc-800">
                            {ads.map((ad) => (
                              <tr key={ad._id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="py-4 px-4">
                                  <span className="text-xs font-bold text-editorial-red">{ad.bookingId || '—'}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="font-bold text-editorial-black dark:text-zinc-100">{ad.planId.toUpperCase()}</div>
                                  <div className="text-xs text-editorial-muted capitalize">{ad.placement.replace('-', ' ')}</div>
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-editorial-ink dark:text-zinc-300">
                                  {new Date(ad.startDate).toLocaleDateString()} - <br/>
                                  {new Date(ad.endDate).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    ad.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    ad.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {ad.status}
                                  </span>
                                </td>
                                <td className="py-4 px-4 font-bold text-editorial-black dark:text-zinc-100">
                                  ₹{ad.amountPaid.toLocaleString('en-IN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-6">
                    {comments.length === 0 ? (
                      <div className="text-center py-12 text-editorial-muted">{noCommentsText}</div>
                    ) : (
                      comments.map((comment, i) => (
                        <div key={i} className="border border-editorial-border dark:border-zinc-800 p-4 rounded-lg hover:shadow-md transition-shadow bg-neutral-50 dark:bg-zinc-800/30">
                          <Link to={`/news/${comment.newsId}`} className="text-xs font-bold text-editorial-red hover:underline mb-2 block uppercase tracking-wide">
                            {comment.newsTitle}
                          </Link>
                          <p className="text-editorial-ink dark:text-zinc-200 text-sm mb-2 italic">"{comment.text}"</p>
                          <div className="text-[10px] text-editorial-muted uppercase font-bold">
                            Posted on {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
