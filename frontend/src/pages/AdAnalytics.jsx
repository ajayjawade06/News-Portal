import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, DollarSign, MousePointer, Users, ArrowLeft, ExternalLink, Sparkles, PieChart as PieIcon, BarChart3 } from 'lucide-react';

const AdAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/ads/analytics');
        setAnalytics(res.data.data);
      } catch (err) {
        console.error('Error fetching ad analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#09090b]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-editorial-border rounded-full opacity-20"></div>
          <div className="absolute inset-0 border-4 border-t-editorial-red rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#09090b] pb-20">
      <div className="container-editorial py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-neutral-200 dark:border-zinc-800 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link to="/dashboard" className="group flex items-center gap-2 text-editorial-muted hover:text-editorial-red transition-all duration-300">
                <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-zinc-800 group-hover:bg-editorial-red/10 transition-colors">
                  <ArrowLeft size={16} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Back to Console</span>
              </Link>
            </div>
            <h1 className="font-serif font-black text-editorial-black dark:text-white text-4xl tracking-tight">
              Ad Intelligence <span className="text-editorial-red">&</span> Revenue
            </h1>
            <p className="text-editorial-muted text-base mt-2 max-w-lg">
              Performance telemetry and financial distribution metrics for your advertisement ecosystem.
            </p>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
             <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
                <Sparkles size={14} /> Live Revenue Tracking
             </div>
          </div>
        </div>

        {/* Premium Core Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Revenue', value: `₹${analytics?.totalRevenue.toLocaleString('en-IN')}`, sub: `From ${analytics?.totalAdsRunning} active plans`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Engagement Clicks', value: analytics?.totalClicks.toLocaleString(), sub: `${analytics?.avgCtr}% average CTR`, icon: MousePointer, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Total Impressions', value: (analytics?.totalViews || 0).toLocaleString(), sub: 'Across all placements', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Conversion Performance', value: `${analytics?.avgCtr}%`, sub: 'Real-time ROI metric', icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-500/10' }
          ].map((stat, i) => (
             <div key={i} className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                   <stat.icon size={20} />
                </div>
                <p className="text-editorial-muted text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">{stat.label}</p>
                <h3 className="text-2xl font-black text-editorial-black dark:text-white tracking-tight mb-1">{stat.value}</h3>
                <p className="text-[10px] text-editorial-muted font-medium">{stat.sub}</p>
             </div>
          ))}
        </div>

        {/* Charts Section with Glass Containers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Plan Distribution */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-neutral-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-serif font-bold text-xl text-editorial-black dark:text-white flex items-center gap-2">
                 <PieIcon size={20} className="text-editorial-red" /> Plan Utilization
               </h3>
               <span className="text-[10px] font-bold text-editorial-muted uppercase tracking-widest">Market Share</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={analytics?.planDistribution || []} 
                    cx="50%" cy="50%" 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={8} 
                    dataKey="value"
                  >
                    {analytics?.planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Click Performance */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-neutral-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-serif font-bold text-xl text-editorial-black dark:text-white flex items-center gap-2">
                 <BarChart3 size={20} className="text-blue-500" /> Interaction Leaders
               </h3>
               <span className="text-[10px] font-bold text-editorial-muted uppercase tracking-widest">Engagement stats</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.topAdsByClicks || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="clicks" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Global Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-neutral-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-serif font-bold text-xl text-editorial-black dark:text-white">Placement ROI</h3>
               <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center">
                  <DollarSign size={14} className="text-emerald-500" />
               </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.placementRevenueData || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                   />
                  <Bar dataKey="revenue" fill="#0f172a" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-zinc-800 flex items-center justify-between">
               <p className="text-editorial-muted text-xs font-bold uppercase">Manual Ad Revenue</p>
               <p className="font-black text-editorial-black dark:text-white">₹{analytics?.manualRevenue.toLocaleString()}</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
               <p className="text-editorial-muted text-xs font-bold uppercase">Client Bookings</p>
               <p className="font-black text-emerald-600">₹{analytics?.bookingRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-neutral-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-neutral-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-editorial-black dark:text-white">Performance Leaderboard</h3>
              <div className="bg-editorial-red/10 text-editorial-red px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                 Top 10 Performers
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fcfcfc] dark:bg-zinc-800/50 text-editorial-muted text-[10px] uppercase font-black tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Advertisement Title</th>
                    <th className="px-8 py-4">Tier Plan</th>
                    <th className="px-8 py-4 text-right">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                  {analytics?.ads.slice(0, 10).map((ad) => (
                    <tr key={ad._id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-editorial-black dark:text-zinc-100 leading-tight mb-0.5">{ad.title}</div>
                        <div className="text-[9px] text-editorial-muted font-black uppercase tracking-widest">{ad.placement}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[9px] px-2.5 py-1 rounded-lg border font-black uppercase tracking-widest ${
                          ad.plan === 'premium' ? 'border-blue-200 text-blue-600 bg-blue-50/50' :
                          ad.plan === 'standard' ? 'border-neutral-200 text-neutral-900 bg-neutral-100/50' :
                          ad.plan === 'enterprise' ? 'border-amber-200 text-amber-600 bg-amber-50/50' :
                          'border-neutral-200 text-editorial-muted bg-neutral-50/50'
                        }`}>
                          {ad.plan || 'No Plan'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-editorial-black dark:text-white text-base">
                        {ad.clicks || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdAnalytics;
