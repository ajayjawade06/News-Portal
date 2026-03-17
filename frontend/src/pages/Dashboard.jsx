import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useText from '../hooks/useText';
import { 
  TrendingUp, Users, DollarSign, MousePointer, BarChart2, 
  PlusCircle, Layout, BookOpen, Clock, Calendar, ChevronRight, Sparkles 
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
              <h1 className="font-serif font-bold text-4xl text-editorial-black dark:text-white tracking-tight leading-tight">
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
              <h3 className="text-3xl font-serif font-black text-editorial-black dark:text-white tracking-tight">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* High-Impact Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Visual Entry: News Management */}
          <div className="lg:col-span-2 group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl border border-neutral-200 dark:border-zinc-800 p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-editorial-red/5 rounded-full -mr-20 -mt-20 blur-3xl transition-opacity group-hover:opacity-100 opacity-50"></div>
            
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-editorial-black dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-editorial-black dark:text-white">Editorial Control Center</h3>
                  <p className="text-editorial-muted text-sm italic">Mastering the narrative</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-100 dark:border-zinc-800">
                  <p className="text-editorial-muted text-xs font-bold uppercase mb-1">Efficiency Ratio</p>
                  <p className="text-2xl font-black text-editorial-black dark:text-white">92.4%</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-100 dark:border-zinc-800">
                  <p className="text-editorial-muted text-xs font-bold uppercase mb-1">Weekly Growth</p>
                  <p className="text-2xl font-black text-emerald-500">+14.2%</p>
                </div>
              </div>

              <p className="text-editorial-muted text-lg leading-relaxed mb-10 max-w-xl">
                Your content pipeline is active. Review, categorize, and deploy breaking news to maintain your portal's leading edge.
              </p>
            </div>

            <Link 
              to="/dashboard/manage" 
              className="inline-flex items-center gap-3 text-editorial-black dark:text-white font-black text-lg group/btn hover:gap-5 transition-all duration-300"
            >
              Enterprise Article Manager <ChevronRight size={20} className="text-editorial-red" />
            </Link>
          </div>

          {/* Premium Entry: Ad Analytics */}
          <div className="group relative overflow-hidden bg-zinc-900 dark:bg-zinc-950 rounded-3xl p-10 flex flex-col justify-between shadow-2xl hover:scale-[1.02] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-editorial-red/20 opacity-30"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-10 ring-1 ring-emerald-500/30">
                <BarChart2 size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">Ad Performance Intel</h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-10">
                Deep dive into revenue streams, click-through patterns, and plan ROI distribution.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-zinc-500 text-sm">Ad Revenue</span>
                  <span className="text-emerald-400 font-bold">₹{stats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-zinc-500 text-sm">Active Ads</span>
                  <span className="text-white font-bold">{stats.totalAdsRunning}</span>
                </div>
              </div>
            </div>

            <Link 
              to="/dashboard/analytics" 
              className="relative z-10 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
            >
              <TrendingUp size={20} /> Open Analytics Suite
            </Link>
          </div>
        </div>

        {/* Secondary Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { to: '/dashboard/ads', label: 'Campaign Manager', desc: 'Schedule & design ads', icon: Layout, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { to: '/dashboard/ad-bookings', label: 'Client Bookings', desc: 'Manage incoming requests', icon: PlusCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { to: '/dashboard/moderation', label: 'Content Guard', desc: 'Review & approve posts', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' }
          ].map((item, i) => (
            <Link 
              key={i}
              to={item.to} 
              className="group card-editorial p-6 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 flex items-center justify-between hover:border-neutral-800 dark:hover:border-zinc-400 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`${item.bg} ${item.color} w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-editorial-black dark:text-zinc-100 text-lg tracking-tight">{item.label}</h4>
                  <p className="text-xs text-editorial-muted font-medium">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-editorial-muted group-hover:text-editorial-red opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
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
