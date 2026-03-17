import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useText from '../hooks/useText';

const Dashboard = () => {
  const titleText = useText('Dashboard');
  const totalLabel = useText('Total Posts');
  const publishedLabel = useText('Published');
  const draftsLabel = useText('Drafts');
  const createText = useText('Create news');
  const manageText = useText('Manage news');
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/news/admin/all');
        const news = response.data.data || [];
        setStats({
          total: news.length,
          published: news.filter((n) => n.published).length,
          drafts: news.filter((n) => !n.published).length,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center py-20 bg-white dark:bg-zinc-950">
        <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container-editorial py-8 lg:py-10">
        <h1 className="font-serif font-bold text-editorial-black text-2xl sm:text-3xl border-b-2 border-editorial-red pb-2 mb-8">
          {titleText}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="card-editorial p-6">
            <p className="caption text-editorial-muted mb-1">{totalLabel}</p>
            <p className="font-serif font-bold text-editorial-black text-3xl">{stats.total}</p>
          </div>
          <div className="card-editorial p-6">
            <p className="caption text-editorial-muted mb-1">{publishedLabel}</p>
            <p className="font-serif font-bold text-editorial-red text-3xl">{stats.published}</p>
          </div>
          <div className="card-editorial p-6">
            <p className="caption text-editorial-muted mb-1">{draftsLabel}</p>
            <p className="font-serif font-bold text-editorial-ink text-3xl">{stats.drafts}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard/create"
            className="btn-editorial flex-1 py-3 flex items-center justify-center gap-2"
          >
            {createText}
          </Link>
          <Link
            to="/dashboard/manage"
            className="btn-editorial-outline flex-1 py-3 flex items-center justify-center gap-2"
          >
            {manageText}
          </Link>
          <Link
            to="/dashboard/moderation"
            className="btn-editorial-outline flex-1 py-3 flex items-center justify-center gap-2"
          >
            Moderation
          </Link>
          <Link
            to="/dashboard/ads"
            className="btn-editorial-outline flex-1 py-3 flex items-center justify-center gap-2"
          >
            Ads Management
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
