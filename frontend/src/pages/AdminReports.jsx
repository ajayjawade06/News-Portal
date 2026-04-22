import { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import BackButton from '../components/BackButton';
import { Download, FileText, FileSpreadsheet, Newspaper, Layout, Target, Tag, Filter, DollarSign, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [loading, setLoading] = useState(false);
  
  // Data stores
  const [rawData, setRawData] = useState([]);
  
  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Columns configs
  const columnsConf = {
    news: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'views', label: 'Views' },
      { key: 'published', label: 'Published' },
      { key: 'featured', label: 'Featured' },
      { key: 'createdAt', label: 'Created At' },
      { key: '_rawDate', label: '', hidden: true }
    ],
    earnings: [
      { key: 'id', label: 'Ref ID' },
      { key: 'type', label: 'Source' },
      { key: 'createdAt', label: 'Payment Date' },
      { key: 'business', label: 'Advertiser/Business' },
      { key: 'plan', label: 'Ad Plan' },
      { key: 'placement', label: 'Placement' },
      { key: 'amount', label: 'Revenue (₹)' },
      { key: 'status', label: 'Status' },
      { key: '_rawDate', label: '', hidden: true }
    ],
    bookings: [
      { key: 'id', label: 'Booking ID' },
      { key: 'advertiser', label: 'Advertiser' },
      { key: 'plan', label: 'Plan ID' },
      { key: 'placement', label: 'Placement' },
      { key: 'status', label: 'Status' },
      { key: 'amount', label: 'Amount Paid' },
      { key: 'createdAt', label: 'Created At' },
      { key: '_rawDate', label: '', hidden: true }
    ],
    ads: [
      { key: 'id', label: 'Ad ID' },
      { key: 'title', label: 'Title' },
      { key: 'placement', label: 'Placement' },
      { key: 'views', label: 'Views' },
      { key: 'clicks', label: 'Clicks' },
      { key: 'ctr', label: 'CTR' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Created At' },
      { key: '_rawDate', label: '', hidden: true }
    ],
    plans: [
      { key: 'id', label: 'Internal ID' },
      { key: 'name', label: 'Name' },
      { key: 'price', label: 'Base Price' },
      { key: 'duration', label: 'Duration (Days)' },
      { key: 'custom', label: 'Is Custom' },
      { key: 'active', label: 'Is Active' },
      { key: '_rawDate', label: '', hidden: true }
    ],
    users: [
      { key: 'id', label: 'User ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'business', label: 'Business' },
      { key: 'status', label: 'Status' },
      { key: 'verified', label: 'Verified' },
      { key: 'createdAt', label: 'Joined Date' },
      { key: '_rawDate', label: '', hidden: true }
    ]
  };

  const currentColumns = columnsConf[activeTab] || [];
  const displayColumns = currentColumns.filter(c => !c.hidden);

  const fetchData = async (tab) => {
    setLoading(true);
    setRawData([]);
    try {
      if (tab === 'news') {
        const res = await api.get('/news/admin/all');
        const items = res.data.data || [];
        setRawData(items.map(item => ({
          id: item._id,
          title: item.title?.en || item.title?.hi || item.title?.mr || 'Untitled',
          category: item.category,
          views: item.views,
          published: item.published ? 'Yes' : 'No',
          featured: item.isFeatured ? 'Yes' : 'No',
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          _rawDate: new Date(item.createdAt),
          _status: item.published ? 'published' : 'draft'
        })));
      } else if (tab === 'bookings') {
        const res = await api.get('/bookings');
        const items = res.data.data || [];
        setRawData(items.map(item => ({
          id: item._id,
          advertiser: item.advertiserName,
          plan: item.planId,
          placement: item.placement,
          status: item.status, // pending, active, completed, cancelled
          amount: item.amountPaid,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          _rawDate: new Date(item.createdAt),
          _status: item.status
        })));
      } else if (tab === 'ads') {
        const res = await api.get('/ads');
        const items = res.data.data || [];
        setRawData(items.map(item => ({
          id: item._id,
          title: item.title,
          placement: item.placement,
          views: item.analytics?.views || 0,
          clicks: item.analytics?.clicks || 0,
          ctr: item.analytics?.views ? ((item.analytics.clicks / item.analytics.views) * 100).toFixed(2) + '%' : '0%',
          status: item.isActive ? 'Active' : 'Inactive',
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          _rawDate: new Date(item.createdAt),
          _status: item.isActive ? 'active' : 'inactive',
          _placement: item.placement
        })));
      } else if (tab === 'plans') {
        const res = await api.get('/plans');
        const items = res.data.data || [];
        setRawData(items.map(item => ({
          id: item.internalId,
          name: item.name,
          price: item.price,
          duration: item.durationDays,
          custom: item.isCustom ? 'Yes' : 'No',
          active: item.isActive ? 'Yes' : 'No',
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          _rawDate: new Date(item.createdAt),
          _status: item.isActive ? 'active' : 'inactive',
          _custom: item.isCustom ? 'custom' : 'regular'
        })));
      } else if (tab === 'earnings') {
        const [bookingsRes, adsRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/ads')
        ]);
        const bookings = bookingsRes.data.data || [];
        const ads = adsRes.data.data || [];
        const now = new Date();
        const earningsData = [];
        
        bookings.forEach(item => {
          earningsData.push({
            id: item._id,
            type: 'Booking',
            business: item.businessName || item.advertiserName,
            plan: item.planId,
            placement: item.placement,
            amount: item.amountPaid,
            status: item.status,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
            _rawDate: new Date(item.createdAt),
            _status: item.status
          });
        });
        
        ads.forEach(item => {
          if (item.price && item.price > 0) {
            const isWithinDate = (!item.startDate || new Date(item.startDate) <= now) && (!item.endDate || new Date(item.endDate) >= now);
            const isActive = item.isActive && isWithinDate;
            earningsData.push({
              id: item._id,
              type: 'Direct Ad',
              business: 'Admin / Direct',
              plan: item.plan || 'none',
              placement: item.placement,
              amount: item.price,
              status: isActive ? 'active' : 'inactive',
              createdAt: new Date(item.createdAt).toLocaleDateString(),
              _rawDate: new Date(item.createdAt),
              _status: isActive ? 'active' : 'inactive'
            });
          }
        });
        setRawData(earningsData);
      } else if (tab === 'users') {
        const res = await api.get('/user-auth/admin/users');
        const items = res.data.data || [];
        setRawData(items.map(item => ({
          id: item._id,
          name: `${item.firstName} ${item.lastName || ''}`.trim(),
          email: item.email,
          phone: item.phone || 'N/A',
          business: item.businessName || 'N/A',
          status: item.isBanned ? 'Banned' : 'Active',
          verified: item.isVerified ? 'Yes' : 'No',
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          _rawDate: new Date(item.createdAt),
          _status: item.isBanned ? 'banned' : 'active',
          _verified: item.isVerified
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset filters on tab change
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
    setPlacementFilter('all');
    setCategoryFilter('all');
    setPlanFilter('all');
    fetchData(activeTab);
  }, [activeTab]);

  // Derived filter options
  const uniqueCategories = useMemo(() => {
    if (activeTab !== 'news') return [];
    return [...new Set(rawData.map(r => r.category).filter(Boolean))].sort();
  }, [rawData, activeTab]);

  const uniquePlans = useMemo(() => {
    if (activeTab !== 'bookings' && activeTab !== 'earnings') return [];
    return [...new Set(rawData.map(r => r.plan).filter(Boolean))].sort();
  }, [rawData, activeTab]);

  // Derived filtered data
  const filteredData = useMemo(() => {
    return rawData.filter(row => {
      // 1. Date Range
      if (startDate && row._rawDate) {
        const itemTime = new Date(row._rawDate).getTime();
        if (!isNaN(itemTime)) {
          const [y, m, d] = startDate.split('-').map(Number);
          const startTimestamp = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
          if (itemTime < startTimestamp) return false;
        }
      }
      if (endDate && row._rawDate) {
        const itemTime = new Date(row._rawDate).getTime();
        if (!isNaN(itemTime)) {
          const [y, m, d] = endDate.split('-').map(Number);
          const endTimestamp = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
          if (itemTime > endTimestamp) return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'all') {
        if (activeTab === 'plans' && statusFilter === 'custom') {
          if (row._custom !== 'custom') return false;
        } else if (activeTab === 'plans' && statusFilter === 'regular') {
          if (row._custom !== 'regular') return false;
        } else if (activeTab === 'users' && statusFilter === 'verified') {
          if (!row._verified) return false;
        } else if (activeTab === 'users' && statusFilter === 'unverified') {
          if (row._verified) return false;
        } else if (row._status !== statusFilter) {
          return false;
        }
      }

      // 3. Placement Filter (Ads only)
      if (activeTab === 'ads' && placementFilter !== 'all') {
        if (row._placement !== placementFilter) return false;
      }

      // 4. Category Filter (News only)
      if (activeTab === 'news' && categoryFilter !== 'all') {
        if (row.category !== categoryFilter) return false;
      }

      // 5. Plan Filter (Bookings/Earnings only)
      if ((activeTab === 'bookings' || activeTab === 'earnings') && planFilter !== 'all') {
        if (row.plan !== planFilter) return false;
      }

      return true;
    });
  }, [rawData, startDate, endDate, statusFilter, placementFilter, categoryFilter, planFilter, activeTab]);

  const generatePDF = () => {
    let title = `${activeTab.toUpperCase()} Report`;
    if (startDate && endDate) title += ` (${startDate} to ${endDate})`;
    else if (startDate) title += ` (From ${startDate})`;
    else if (endDate) title += ` (Until ${endDate})`;

    const doc = new jsPDF();
    doc.text(title, 14, 15);
    
    const tableData = filteredData.map(row => displayColumns.map(col => {
      const val = row[col.key];
      return val !== null && val !== undefined ? String(val) : '';
    }));
    
    autoTable(doc, {
      head: [displayColumns.map(c => c.label)],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 38, 38] } // Editorial Red
    });
    
    doc.save(`${title.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSV = () => {
    let title = `${activeTab.toUpperCase()} Report`;
    if (startDate && endDate) title += `_${startDate}_to_${endDate}`;
    else if (startDate) title += `_from_${startDate}`;
    else if (endDate) title += `_until_${endDate}`;

    const headers = displayColumns.map(c => c.label).join(',');
    const rows = filteredData.map(row => {
      return displayColumns.map(c => {
        let val = row[c.key];
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""'); // Escape quotes
        if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`;
        return val;
      }).join(',');
    });
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const tabs = [
    { id: 'news', icon: Newspaper, label: 'News Articles' },
    { id: 'bookings', icon: Target, label: 'Ad Bookings' },
    { id: 'earnings', icon: DollarSign, label: 'Financial Earnings' },
    { id: 'ads', icon: Layout, label: 'Running Ads' },
    { id: 'plans', icon: Tag, label: 'Ad Plans' },
    { id: 'users', icon: Users, label: 'User Reports' }
  ];

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-zinc-950 pb-20">
      <div className="container-editorial py-8 lg:py-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <BackButton to="/dashboard" label="Back to Dashboard" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-bold text-editorial-black dark:text-zinc-100 text-2xl sm:text-3xl border-b-2 border-editorial-red pb-2 inline-block">
              Reports Dashboard
            </h1>
            <p className="text-editorial-muted text-sm mt-2 max-w-xl">
              Filter data intelligently and preview it before exporting locally.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={generateCSV} disabled={filteredData.length === 0} className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-editorial-black dark:text-zinc-100 font-bold text-sm rounded disabled:opacity-50">
              <FileSpreadsheet size={16} /> Export CSV
            </button>
            <button onClick={generatePDF} disabled={filteredData.length === 0} className="flex items-center gap-2 px-4 py-2 bg-editorial-red hover:bg-red-700 text-white font-bold text-sm rounded disabled:opacity-50">
              <FileText size={16} /> Export PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-200 dark:border-zinc-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-bold text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                ? 'bg-white dark:bg-zinc-900 text-editorial-red border-t-2 border-editorial-red shadow-sm' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-900'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Panel with Sleak UI */}
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-neutral-200 dark:border-zinc-800 rounded-xl p-5 mb-8 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-4 text-editorial-red">
             <Filter size={18} />
             <h3 className="font-bold text-sm tracking-widest uppercase">Report Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1.5">Date Created (From)</label>
              <div className="relative">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full pl-3 pr-10 py-2 border border-neutral-200 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-editorial-red/20 focus:border-editorial-red transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1.5">Date Created (To)</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-editorial-red/20 focus:border-editorial-red transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1.5">Status Filter</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-editorial-red/20 focus:border-editorial-red transition-all appearance-none bg-white">
                <option value="all">Any Status</option>
                {activeTab === 'news' && (
                  <>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                  </>
                )}
                {activeTab === 'bookings' && (
                  <>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
                {activeTab === 'earnings' && (
                  <>
                    <option value="approved">Approved Bookings</option>
                    <option value="pending">Pending Bookings</option>
                    <option value="active">Active Direct Ads</option>
                    <option value="inactive">Inactive Direct Ads</option>
                  </>
                )}
                {activeTab === 'ads' && (
                  <>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </>
                )}
                {activeTab === 'plans' && (
                  <>
                    <option value="active">Active Plans</option>
                    <option value="inactive">Inactive Plans</option>
                    <option value="custom">Enterprise / Custom</option>
                    <option value="regular">Regular Defined</option>
                  </>
                )}
                {activeTab === 'users' && (
                  <>
                    <option value="active">Active Users</option>
                    <option value="banned">Banned Users</option>
                    <option value="verified">Verified Accounts</option>
                    <option value="unverified">Unverified Accounts</option>
                  </>
                )}
              </select>
            </div>

            {/* Dynamic Contextual Filters */}
            {activeTab === 'news' && uniqueCategories.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1.5">Category</label>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-editorial-red/20 focus:border-editorial-red transition-all appearance-none capitalize bg-white">
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {(activeTab === 'bookings' || activeTab === 'earnings') && uniquePlans.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1.5">Ad Plan</label>
                <select value={planFilter} onChange={e => setPlanFilter(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-editorial-red/20 focus:border-editorial-red transition-all appearance-none capitalize bg-white">
                  <option value="all">All Plans</option>
                  {uniquePlans.map(plan => (
                    <option key={plan} value={plan}>{plan.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === 'ads' && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1.5">Placement</label>
                <select value={placementFilter} onChange={e => setPlacementFilter(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-editorial-red/20 focus:border-editorial-red transition-all appearance-none capitalize bg-white">
                  <option value="all">All Placements</option>
                  <option value="header">Header</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                  <option value="in-feed">In-Feed</option>
                  <option value="inline">Inline</option>
                  <option value="popup">Popup</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-zinc-800 flex justify-end gap-3 items-center">
            {activeTab === 'earnings' && (
              <div className="mr-auto text-lg text-editorial-black dark:text-zinc-100 font-black">
                Total Revenue: <span className="text-emerald-600">₹{filteredData.filter(row => row.status === 'approved' || row.status === 'active').reduce((acc, row) => acc + (Number(row.amount) || 0), 0).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="text-xs font-bold tracking-widest uppercase text-editorial-red bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full">
              Showing {filteredData.length} Result{filteredData.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Data Preview Table */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden text-sm animate-fade-in relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-black/50 z-10 flex items-center justify-center">
               <div className="w-10 h-10 border-4 border-t-editorial-red rounded-full animate-spin"></div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 dark:bg-zinc-800 text-editorial-black dark:text-zinc-300 font-bold border-b border-gray-200 dark:border-zinc-700">
                  {displayColumns.map(col => (
                    <th key={col.key} className="py-3 px-4 uppercase text-xs tracking-wider">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? filteredData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-zinc-800/50 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors">
                    {displayColumns.map(col => (
                      <td key={col.key} className="py-3 px-4 text-editorial-muted dark:text-zinc-400 whitespace-nowrap">
                        {String(row[col.key])}
                      </td>
                    ))}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={displayColumns.length} className="py-20 text-center text-gray-500 dark:text-zinc-500">
                      {!loading && 'No data matches your current filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminReports;
