import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, AlertCircle, ExternalLink, DollarSign, MousePointer, TrendingUp } from 'lucide-react';
import AdFormModal from '../components/AdFormModal';

const AdsManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalViews: 0,
    totalClicks: 0,
    avgCtr: '0.00'
  });

  const fetchAds = async () => {
    try {
      setLoading(true);
      const [adsRes, sRes] = await Promise.all([
        api.get('/ads'),
        api.get('/ads/analytics')
      ]);
      setAds(adsRes.data.data || []);
      setSummary(sRes.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching ads data:', err);
      setError('Failed to load advertisements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleCreate = () => {
    setCurrentAd(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ad) => {
    setCurrentAd(ad);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await api.delete(`/ads/${id}`);
        setAds(ads.filter(ad => ad._id !== id));
      } catch (err) {
        console.error('Error deleting ad:', err);
        alert('Failed to delete advertisement.');
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await api.patch(`/ads/${id}/toggle`);
      setAds(ads.map(ad => ad._id === id ? response.data.data : ad));
    } catch (err) {
      console.error('Error toggling ad status:', err);
      alert('Failed to update advertisement status.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAd(null);
  };

  const handleSave = () => {
    fetchAds();
    closeModal();
  };

  const getStatusBadge = (ad) => {
    const now = new Date();
    const startDate = ad.startDate ? new Date(ad.startDate) : null;
    const endDate = ad.endDate ? new Date(ad.endDate) : null;

    if (!ad.isActive) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-neutral-200 text-neutral-600 dark:bg-zinc-700 dark:text-zinc-300">Inactive</span>;
    }

    if (startDate && startDate > now) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Scheduled</span>;
    }

    if (endDate && endDate < now) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Expired</span>;
    }

    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Active</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center py-20 bg-neutral-50 dark:bg-zinc-950">
        <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-zinc-950">
      <div className="container-editorial py-8 lg:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="font-serif font-bold text-editorial-black text-2xl sm:text-3xl border-b-2 border-editorial-red pb-2 inline-block">
              Ads Management
            </h1>
            <p className="text-editorial-muted text-sm mt-2">Manage website advertisements and placements</p>
          </div>
          <button 
            onClick={handleCreate}
            className="btn-editorial py-2 px-4 flex items-center gap-2"
          >
            <Plus size={18} />
            Create New Ad
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Revenue', value: `₹${summary.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Total Views', value: summary.totalViews?.toLocaleString() || 0, icon: Eye, color: 'text-editorial-black dark:text-white', bg: 'bg-neutral-100 dark:bg-zinc-800' },
            { label: 'Total Clicks', value: summary.totalClicks?.toLocaleString() || 0, icon: MousePointer, color: 'text-editorial-red', bg: 'bg-editorial-red/10' },
            { label: 'Avg. CTR', value: `${summary.avgCtr || '0.00'}%`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 rounded-2xl shadow-sm">
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon size={20} />
              </div>
              <p className="text-editorial-muted text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">{stat.label}</p>
              <h3 className="text-2xl font-black text-editorial-black dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-md flex items-start gap-3 mb-6">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="card-editorial overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-100 dark:bg-zinc-800 text-editorial-muted text-xs uppercase border-b border-editorial-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Advertisement</th>
                  <th className="px-6 py-4 font-semibold">Placement</th>
                  <th className="px-6 py-4 font-semibold">Plan/Price</th>
                  <th className="px-6 py-4 font-semibold">Analytics</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Dates</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border">
                {ads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-editorial-muted">
                      No advertisements found. Create your first ad!
                    </td>
                  </tr>
                ) : (
                  ads.map((ad) => (
                    <tr key={ad._id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-editorial-black">{ad.title}</div>
                        <div className="text-xs text-editorial-muted flex items-center gap-1 mt-1">
                          {ad.type === 'image' ? 'Image Banner' : 'Script / Code'}
                          {ad.targetLink && (
                            <a href={ad.targetLink} target="_blank" rel="noopener noreferrer" className="ml-1 text-editorial-red hover:underline inline-flex items-center gap-0.5">
                              Link <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-editorial-black font-medium">{ad.placement}</span>
                        <div className="text-xs text-editorial-muted mt-1">Priority: {ad.priority}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-[10px] w-fit px-2 py-0.5 rounded-full border border-current font-bold uppercase ${
                            ad.plan === 'premium' ? 'text-blue-600 bg-blue-50' :
                            ad.plan === 'standard' ? 'text-neutral-900 bg-neutral-100' :
                            ad.plan === 'enterprise' ? 'text-amber-600 bg-amber-50' :
                            'text-editorial-muted bg-neutral-50'
                          }`}>
                            {ad.plan || 'none'}
                          </span>
                          <div className="flex flex-col mt-1">
                            <span className="font-bold text-emerald-600">
                              ₹{ad.price || 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-editorial-muted">Views:</span>
                            <span className="font-bold text-editorial-black">{ad.views || 0}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-editorial-muted">Clicks:</span>
                            <span className="font-bold text-editorial-red">{ad.clicks || 0}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-1 border-t border-neutral-100 dark:border-zinc-700">
                            <span className="text-editorial-muted">CTR:</span>
                            <span className="font-bold text-blue-600">
                              {ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(1) : '0.0'}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(ad)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1.5 text-editorial-muted">
                            <span className="w-8">Start:</span>
                            <span className="text-editorial-black">{formatDate(ad.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-editorial-muted">
                            <span className="w-8">End:</span>
                            <span className="text-editorial-black">{formatDate(ad.endDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(ad._id)}
                            className="p-1.5 text-editorial-muted hover:text-editorial-black hover:bg-neutral-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title={ad.isActive ? "Deactivate" : "Activate"}
                          >
                            {ad.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => handleEdit(ad)}
                            className="p-1.5 text-editorial-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(ad._id)}
                            className="p-1.5 text-editorial-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AdFormModal 
          ad={currentAd} 
          onClose={closeModal} 
          onSave={handleSave} 
        />
      )}
    </main>
  );
};

export default AdsManagement;
