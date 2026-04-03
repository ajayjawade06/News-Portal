import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useText from '../hooks/useText';
import { 
  TrendingUp, Users, DollarSign, MousePointer, BarChart2, 
  PlusCircle, Layout, BookOpen, Clock, Calendar, ChevronRight, Sparkles, Tag, Download
} from 'lucide-react';

const Dashboard = () => {
  const titleText = useText('Dashboard');
  const [stats, setStats] = useState({ 
    total: 0, published: 0, drafts: 0,
    totalRevenue: 0, totalAdsRunning: 0
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const fetchStats = async () => {
      try {
        const [newsRes, adsRes] = await Promise.all([
          api.get('/news/admin/all'),
          api.get('/ads/analytics')
        ]);
        
        const news = newsRes.data.data || [];
        const adData = adsRes.data.data;
        
        setStats({
          total: news.length,
          published: news.filter((n) => n.published).length,
          drafts: news.filter((n) => !n.published).length,
          totalRevenue: adData.totalRevenue,
          totalAdsRunning: adData.totalAdsRunning
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-zinc-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-editorial-border rounded-full opacity-20"></div>
          <div className="absolute inset-0 border-4 border-t-editorial-red rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#09090b] pb-20 selection:bg-editorial-red selection:text-white">
      {/* Dynamic Header Section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-neutral-200 dark:border-zinc-800 pt-10 pb-12 transition-colors duration-300">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-editorial-red/10 text-editorial-red px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} /> System Active
                </div>
                <div className="text-editorial-muted text-xs flex items-center gap-1.5">
                  <Calendar size={12} /> {formatDate()}
                </div>
              </div>
              <h1 className="font-bold text-4xl text-editorial-black dark:text-white tracking-tight leading-tight">
                {greeting}, <span className="text-editorial-red">Admin</span>
              </h1>
              <p className="text-editorial-muted text-base mt-2 max-w-lg">
                Your news portal is performing exceptionally well today. Here's what's happening.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                to="/dashboard/create" 
                className="group relative px-8 py-3.5 bg-editorial-black dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-editorial-red/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-editorial-red translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <PlusCircle size={18} /> New Article
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-editorial -mt-8">
        {/* Glassmorphism Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Live Articles', value: stats.published, icon: BookOpen, color: 'text-red-500', bg: 'bg-red-500/10' },
            { label: 'Total Drafts', value: stats.drafts, icon: Layout, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Revenue Est.', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Active Ads', value: stats.totalAdsRunning, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="group bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon size={20} />
                </div>
                <span className="bg-neutral-100 dark:bg-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded text-editorial-muted">Live</span>
              </div>
              <p className="text-editorial-muted text-xs font-bold uppercase tracking-wider mb-1 opacity-70">{stat.label}</p>
              <h3 className="text-3xl font-black text-editorial-black dark:text-white tracking-tight">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Action Grid: All Equal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { to: '/dashboard/manage', label: 'News Management', desc: 'Manage all articles & drafts', icon: BookOpen, color: 'text-editorial-red', bg: 'bg-editorial-red/10' },
            { to: '/dashboard/analytics', label: 'Revenue Analytics', desc: 'Financial & ROI telemetry', icon: BarChart2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { to: '/dashboard/ads', label: 'Campaign Manager', desc: 'Schedule & design ads', icon: Layout, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { to: '/dashboard/plans', label: 'Ad Plans & Pricing', desc: 'Manage packages & discounts', icon: Tag, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { to: '/dashboard/ad-bookings', label: 'Client Bookings', desc: 'Manage incoming requests', icon: PlusCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { to: '/dashboard/moderation', label: 'Content Guard', desc: 'Review & approve posts', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { to: '/dashboard/reports', label: 'Data & Reports', desc: 'Download CSV & PDF logs', icon: Download, color: 'text-cyan-500', bg: 'bg-cyan-500/10' }
          ].map((item, i) => (
            <Link 
              key={i}
              to={item.to} 
              className="group bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 p-8 rounded-3xl flex flex-col items-start justify-between hover:border-editorial-red dark:hover:border-editorial-red hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-full">
                <div className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500`}>
                  <item.icon size={28} />
                </div>
                <h4 className="font-bold text-editorial-black dark:text-zinc-100 text-xl tracking-tight mb-2">{item.label}</h4>
                <p className="text-sm text-editorial-muted font-medium mb-8 leading-relaxed">{item.desc}</p>
              </div>
              
              <div className="flex items-center gap-2 text-editorial-red text-xs font-black uppercase tracking-widest group/btn">
                <span>Manage Suite</span>
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Meta */}
        <div className="mt-16 py-8 border-t border-neutral-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-editorial-muted text-xs font-bold uppercase tracking-widest">
             © 2026 Multilingual News Portal • Advanced Admin Panel
           </p>
           <div className="flex gap-8">
             <button onClick={() => window.print()} className="text-editorial-muted hover:text-editorial-red text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
               <Clock size={12} /> System Audit
             </button>
             <Link to="/" className="text-editorial-muted hover:text-editorial-black dark:hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">
               View Live Site
             </Link>
           </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
